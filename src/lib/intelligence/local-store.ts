import { createHash, randomUUID } from "node:crypto";
import {
  appendFileSync,
  chmodSync,
  constants as fsConstants,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { backup, DatabaseSync } from "node:sqlite";

import { buildAuditEvent, type AuditEvent } from "./audit";
import { formatDossierNumber } from "./dossier-number";
import { LOCAL_SCHEMA_VERSION, localSchemaSql } from "./local-schema";
import { buildDraftReport, type DraftReport } from "./report";
import type {
  EvidenceDirection,
  EvidenceLink,
  EvidenceRecord,
  FindingRecord,
  ResearchPlan,
  SourceRecord,
  VerificationReview,
} from "./types";
import { buildPhaseOneResearchPlan, evaluateDraftReadiness } from "./workflow";

export const DEFAULT_LOCAL_HOME = ".meloncactus-intelligence";
export const LOCAL_DATABASE_NAME = "control-room.sqlite";
export const DELETION_REGISTER_NAME = "deletion-register.jsonl";

type ActorType = "human" | "agent" | "system";
type JobStatus = "pending" | "ready" | "running" | "blocked" | "completed" | "waiting_for_approval";

export interface LocalActor {
  type: ActorType;
  ref: string;
}

export interface LocalDossier {
  id: string;
  dossierNumber: string;
  receivedAt: string;
  decisionQuestion: string;
  scope: Record<string, unknown>;
  status: "registered" | "scoped" | "researching" | "reviewing" | "drafted" | "closed";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalResearchJob {
  id: string;
  dossierId: string;
  key: string;
  role: string;
  title: string;
  execution: "agent" | "human";
  status: JobStatus;
  approvalRequired: boolean;
}

export interface StoredDraft {
  id: string;
  dossierId: string;
  version: number;
  status: DraftReport["status"] | "approved" | "archived" | "composing";
  title: string;
  markdown: string;
  createdBy: string;
  createdAt: string;
  approvedAt?: string;
}

export interface LocalStatus {
  databasePath: string;
  dossiers: number;
  sources: number;
  evidence: number;
  findings: number;
  pendingHumanApprovals: number;
  auditEvents: number;
}

export interface LocalAuditEvent {
  sequence: number;
  occurredAt: string;
  actorType: ActorType;
  actorRef: string;
  action: string;
  objectType: string;
  objectId: string;
  metadata: AuditEvent["metadata"];
  eventHash: string;
}

export interface IsolatedRestoreResult {
  restoredHome: string;
  databasePath: string;
  dossiers: number;
  auditEvents: number;
  reappliedDeletions: number;
}

export type RetentionCategory =
  | "enquiry_not_converted"
  | "non_fiscal_correspondence"
  | "research_working_files"
  | "final_report"
  | "fiscal_record"
  | "legal_claim";

const RETENTION_CATEGORIES = new Set<RetentionCategory>([
  "enquiry_not_converted",
  "non_fiscal_correspondence",
  "research_working_files",
  "final_report",
  "fiscal_record",
  "legal_claim",
]);

export interface LocalRetentionItem {
  id: string;
  dossierId: string;
  category: RetentionCategory;
  triggerAt: string;
  deadlineAt: string;
  storageLocations: string[];
  status: "active" | "held" | "deletion_proposed";
  holdReason?: string;
  holdReviewAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalDeletionRequest {
  id: string;
  dossierId: string;
  status: "proposed" | "approved" | "executed" | "rejected";
  categories: RetentionCategory[];
  reviewedAt: string;
  requestedBy: string;
  requestedAt: string;
  rationale: string;
  decidedBy?: string;
  decidedAt?: string;
  decisionRationale?: string;
  executedBy?: string;
  executedAt?: string;
}

export interface DeletionRegisterEntry {
  id: string;
  dossierNumber: string;
  categories: RetentionCategory[];
  action: "deleted" | "anonymised";
  locations: string[];
  deadlineAt: string;
  reviewedAt: string;
  approvedBy: string;
  executedBy: string;
  completedAt: string;
  previousHash?: string;
  entryHash: string;
}

export class DossierRevisionConflictError extends Error {
  constructor(
    readonly expectedRevision: number,
    readonly currentRevision: number,
  ) {
    super(
      `Dossier revision conflict: expected ${expectedRevision}, current ${currentRevision}.`,
    );
    this.name = "DossierRevisionConflictError";
  }
}

export class LocalIntelligenceStore {
  readonly homePath: string;
  readonly databasePath: string;
  private readonly database: DatabaseSync;
  private closed = false;
  private transactionDepth = 0;

  constructor(homePath = path.resolve(DEFAULT_LOCAL_HOME)) {
    this.homePath = path.resolve(homePath);
    this.databasePath = path.join(this.homePath, LOCAL_DATABASE_NAME);
    mkdirPrivate(this.homePath);
    mkdirPrivate(path.join(this.homePath, "exports"));
    mkdirPrivate(path.join(this.homePath, "backups"));
    this.database = new DatabaseSync(this.databasePath);
    this.database.exec(localSchemaSql);
    const existingVersion = this.getMeta("schema_version");
    if (existingVersion === "1" && LOCAL_SCHEMA_VERSION === 2) {
      this.setMeta("schema_version", String(LOCAL_SCHEMA_VERSION));
    } else if (existingVersion && existingVersion !== String(LOCAL_SCHEMA_VERSION)) {
      this.database.close();
      this.closed = true;
      throw new Error(
        `Unsupported local schema version ${existingVersion}; expected ${LOCAL_SCHEMA_VERSION}.`,
      );
    }
    this.setMetaIfMissing("schema_version", String(LOCAL_SCHEMA_VERSION));
    this.setMetaIfMissing("created_at", now());
    chmodPrivate(this.databasePath, 0o600);
  }

  close(): void {
    if (this.closed) return;
    this.database.close();
    this.closed = true;
  }

  getMeta(key: string): string | undefined {
    const row = this.get<{ value: string }>("select value from local_meta where key = ?", key);
    return row?.value;
  }

  get deletionRegisterPath(): string {
    return path.join(this.homePath, DELETION_REGISTER_NAME);
  }

  setMeta(key: string, value: string): void {
    this.run(
      `insert into local_meta (key, value) values (?, ?)
       on conflict(key) do update set value = excluded.value`,
      key,
      value,
    );
  }

  registerDossier(input: {
    receivedAt: string;
    decisionQuestion: string;
    scope?: Record<string, unknown>;
    actor: LocalActor;
  }): LocalDossier {
    const receivedAt = new Date(input.receivedAt);
    if (Number.isNaN(receivedAt.getTime())) throw new TypeError("A valid receipt timestamp is required.");
    const decisionQuestion = requireText(input.decisionQuestion, "decisionQuestion");
    const actorRef = requireText(input.actor.ref, "actor.ref");
    const scope = input.scope ?? {};
    const id = randomUUID();
    const timestamp = now();

    return this.transaction(() => {
      const firstNumber = formatDossierNumber(receivedAt, 1);
      const periodKey = firstNumber.slice(0, 4);
      const current = this.get<{ last_value: number }>(
        "select last_value from dossier_sequences where period_key = ?",
        periodKey,
      );
      const sequence = current ? current.last_value + 1 : 1;
      if (sequence > 999) throw new RangeError(`Dossier sequence exhausted for ${periodKey}.`);

      this.run(
        `insert into dossier_sequences (period_key, last_value, updated_at) values (?, ?, ?)
         on conflict(period_key) do update set last_value = excluded.last_value, updated_at = excluded.updated_at`,
        periodKey,
        sequence,
        timestamp,
      );

      const dossierNumber = formatDossierNumber(receivedAt, sequence);
      this.run(
        `insert into dossiers (
           id, dossier_number, received_at, decision_question, scope_json,
           status, created_by, created_at, updated_at
         ) values (?, ?, ?, ?, ?, 'registered', ?, ?, ?)`,
        id,
        dossierNumber,
        receivedAt.toISOString(),
        decisionQuestion,
        JSON.stringify(scope),
        actorRef,
        timestamp,
        timestamp,
      );
      this.appendAudit(id, input.actor, "create", "dossier", id, { dossierNumber });
      return this.requireDossier(id);
    });
  }

  getDossier(idOrNumber: string): LocalDossier | undefined {
    const row = this.get<DossierRow>(
      "select * from dossiers where id = ? or dossier_number = ?",
      idOrNumber,
      idOrNumber,
    );
    return row ? mapDossier(row) : undefined;
  }

  findDossierByDecisionQuestion(decisionQuestion: string): LocalDossier | undefined {
    const row = this.get<DossierRow>(
      "select * from dossiers where decision_question = ? order by created_at desc limit 1",
      decisionQuestion,
    );
    return row ? mapDossier(row) : undefined;
  }

  getDossierRevision(dossierId: string): number {
    this.requireDossier(dossierId);
    const row = this.get<{ revision: number }>(
      `select coalesce(max(sequence), 0) as revision
       from audit_events where dossier_id = ?`,
      dossierId,
    );
    return row?.revision ?? 0;
  }

  withExpectedDossierRevision<T>(
    dossierId: string,
    expectedRevision: number,
    work: () => T,
  ): T {
    if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 1) {
      throw new TypeError("A positive dossier revision is required.");
    }
    return this.transaction(() => {
      const currentRevision = this.getDossierRevision(dossierId);
      if (currentRevision !== expectedRevision) {
        throw new DossierRevisionConflictError(expectedRevision, currentRevision);
      }
      return work();
    });
  }

  addRetentionItem(
    dossierId: string,
    input: {
      category: RetentionCategory;
      triggerAt: string;
      deadlineAt: string;
      storageLocations: string[];
      createdBy: string;
    },
    actor: LocalActor,
  ): LocalRetentionItem {
    this.requireNotDeletedDossier(dossierId);
    const category = requireRetentionCategory(input.category);
    const triggerAt = requireIsoDate(input.triggerAt, "retention.triggerAt");
    const deadlineAt = requireIsoDate(input.deadlineAt, "retention.deadlineAt");
    if (new Date(deadlineAt) < new Date(triggerAt)) {
      throw new Error("Retention deadline cannot be earlier than its trigger date.");
    }
    const storageLocations = requireStringList(input.storageLocations, "retention.storageLocations");
    const createdBy = requireText(input.createdBy, "retention.createdBy");
    const id = randomUUID();
    const timestamp = now();

    this.transaction(() => {
      const existing = this.get<{ id: string }>(
        "select id from retention_items where dossier_id = ? and category = ?",
        dossierId,
        category,
      );
      if (existing) throw new Error(`Retention category already exists for this dossier: ${category}`);
      this.run(
        `insert into retention_items (
           id, dossier_id, category, trigger_at, deadline_at, storage_locations_json,
           status, created_by, created_at, updated_at
         ) values (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
        id,
        dossierId,
        category,
        triggerAt,
        deadlineAt,
        JSON.stringify(storageLocations),
        createdBy,
        timestamp,
        timestamp,
      );
      this.appendAudit(dossierId, actor, "create", "retention_item", id, {
        retentionCategory: category,
      });
    });
    return this.requireRetentionItem(dossierId, id);
  }

  listRetentionItems(dossierId: string): LocalRetentionItem[] {
    this.requireDossier(dossierId);
    return this.all<RetentionItemRow>(
      "select * from retention_items where dossier_id = ? order by deadline_at, category",
      dossierId,
    ).map(mapRetentionItem);
  }

  placeRetentionHold(input: {
    dossierId: string;
    retentionItemId: string;
    reason: string;
    nextReviewAt: string;
    placedBy: string;
  }): LocalRetentionItem {
    const reason = requireText(input.reason, "retentionHold.reason");
    const nextReviewAt = requireIsoDate(input.nextReviewAt, "retentionHold.nextReviewAt");
    const placedBy = requireText(input.placedBy, "retentionHold.placedBy");
    this.transaction(() => {
      const item = this.requireRetentionItem(input.dossierId, input.retentionItemId);
      this.run(
        `update retention_items
         set status = 'held', hold_reason = ?, hold_review_at = ?, updated_at = ?
         where id = ? and dossier_id = ?`,
        reason,
        nextReviewAt,
        now(),
        item.id,
        input.dossierId,
      );
      this.appendAudit(
        input.dossierId,
        { type: "human", ref: placedBy },
        "place_hold",
        "retention_item",
        item.id,
        { reasonCode: "legal_hold", retentionCategory: item.category },
      );
    });
    return this.requireRetentionItem(input.dossierId, input.retentionItemId);
  }

  releaseRetentionHold(input: {
    dossierId: string;
    retentionItemId: string;
    rationale: string;
    releasedBy: string;
  }): LocalRetentionItem {
    requireText(input.rationale, "retentionHold.rationale");
    const releasedBy = requireText(input.releasedBy, "retentionHold.releasedBy");
    this.transaction(() => {
      const item = this.requireRetentionItem(input.dossierId, input.retentionItemId);
      if (item.status !== "held") throw new Error("Only a held retention item can be released.");
      this.run(
        `update retention_items
         set status = 'active', hold_reason = null, hold_review_at = null, updated_at = ?
         where id = ? and dossier_id = ?`,
        now(),
        item.id,
        input.dossierId,
      );
      this.appendAudit(
        input.dossierId,
        { type: "human", ref: releasedBy },
        "release_hold",
        "retention_item",
        item.id,
        { reasonCode: "hold_released", retentionCategory: item.category },
      );
    });
    return this.requireRetentionItem(input.dossierId, input.retentionItemId);
  }

  proposeDossierDeletion(input: {
    dossierId: string;
    reviewedAt: string;
    requestedBy: string;
    rationale: string;
  }): LocalDeletionRequest {
    const reviewedAt = requireIsoDate(input.reviewedAt, "deletion.reviewedAt");
    if (new Date(reviewedAt).getTime() > Date.now() + 5 * 60_000) {
      throw new Error("Deletion review time cannot be in the future.");
    }
    const requestedBy = requireText(input.requestedBy, "deletion.requestedBy");
    const rationale = requireText(input.rationale, "deletion.rationale");
    const requestId = randomUUID();
    const timestamp = now();

    this.transaction(() => {
      this.requireDossier(input.dossierId);
      const existing = this.get<{ id: string }>(
        `select id from deletion_requests
         where dossier_id = ? and status in ('proposed', 'approved') limit 1`,
        input.dossierId,
      );
      if (existing) throw new Error("This dossier already has an open deletion request.");
      const items = this.listRetentionItems(input.dossierId);
      if (items.length === 0) throw new Error("Deletion requires at least one retention item.");
      const held = items.find((item) => item.status === "held");
      if (held) throw new Error(`Deletion is blocked by a legal hold: ${held.category}`);
      const notDue = items.find((item) => new Date(item.deadlineAt) > new Date(reviewedAt));
      if (notDue) throw new Error(`Retention deadline has not passed: ${notDue.category}`);
      const categories = items.map((item) => item.category);
      this.run(
        `insert into deletion_requests (
           id, dossier_id, status, categories_json, reviewed_at, requested_by,
           requested_at, rationale, created_at, updated_at
         ) values (?, ?, 'proposed', ?, ?, ?, ?, ?, ?, ?)`,
        requestId,
        input.dossierId,
        JSON.stringify(categories),
        reviewedAt,
        requestedBy,
        timestamp,
        rationale,
        timestamp,
        timestamp,
      );
      this.run(
        "update retention_items set status = 'deletion_proposed', updated_at = ? where dossier_id = ?",
        timestamp,
        input.dossierId,
      );
      this.appendAudit(
        input.dossierId,
        { type: "human", ref: requestedBy },
        "propose",
        "deletion_request",
        requestId,
        { reasonCode: "retention_due", retentionCategoryCount: categories.length },
      );
    });
    return this.requireDeletionRequest(input.dossierId, requestId);
  }

  approveDossierDeletion(input: {
    dossierId: string;
    requestId: string;
    decidedBy: string;
    rationale: string;
  }): LocalDeletionRequest {
    const decidedBy = requireText(input.decidedBy, "deletion.decidedBy");
    const rationale = requireText(input.rationale, "deletion.decisionRationale");
    this.transaction(() => {
      const request = this.requireDeletionRequest(input.dossierId, input.requestId);
      if (request.status !== "proposed") throw new Error("Only a proposed deletion can be approved.");
      if (sameOperatorReference(request.requestedBy, decidedBy)) {
        throw new Error("Deletion must be approved by a different human reviewer.");
      }
      const held = this.listRetentionItems(input.dossierId).find((item) => item.status === "held");
      if (held) throw new Error(`Deletion is blocked by a legal hold: ${held.category}`);
      const timestamp = now();
      this.run(
        `update deletion_requests
         set status = 'approved', decided_by = ?, decided_at = ?,
             decision_rationale = ?, updated_at = ?
         where id = ? and dossier_id = ?`,
        decidedBy,
        timestamp,
        rationale,
        timestamp,
        request.id,
        input.dossierId,
      );
      this.appendAudit(
        input.dossierId,
        { type: "human", ref: decidedBy },
        "approve",
        "deletion_request",
        request.id,
        {
          approvalDecision: "approved",
          reasonCode: "retention_deletion",
          retentionCategoryCount: request.categories.length,
        },
      );
    });
    return this.requireDeletionRequest(input.dossierId, input.requestId);
  }

  executeApprovedDeletion(input: {
    dossierId: string;
    requestId: string;
    executedBy: string;
    confirmation: string;
  }): DeletionRegisterEntry {
    const dossier = this.requireDossier(input.dossierId);
    if (input.confirmation.trim() !== dossier.dossierNumber) {
      throw new Error("Deletion confirmation must exactly match the dossier number.");
    }
    const request = this.requireDeletionRequest(input.dossierId, input.requestId);
    if (request.status !== "approved") throw new Error("Deletion request is not approved.");
    const executedBy = requireText(input.executedBy, "deletion.executedBy");
    const items = this.listRetentionItems(input.dossierId);
    if (items.length === 0) throw new Error("Approved deletion has no retention items.");
    const held = items.find((item) => item.status === "held");
    if (held) throw new Error(`Deletion is blocked by a legal hold: ${held.category}`);
    const approvedBy = request.decidedBy;
    if (!approvedBy) throw new Error("Deletion approval is incomplete.");
    const completedAt = now();
    const entry = this.getOrAppendDeletionRegisterEntry({
      id: request.id,
      dossierNumber: dossier.dossierNumber,
      categories: request.categories,
      action: "deleted",
      locations: [...new Set(items.flatMap((item) => item.storageLocations))].sort(),
      deadlineAt: latestDate(items.map((item) => item.deadlineAt)),
      reviewedAt: request.reviewedAt,
      approvedBy,
      executedBy,
      completedAt,
    });

    this.removeGeneratedDossierFiles(dossier.dossierNumber);
    this.transaction(() => {
      const current = this.requireDeletionRequest(input.dossierId, input.requestId);
      if (current.status !== "approved") throw new Error("Deletion request changed before execution.");
      this.applyDeletionEntry(input.dossierId, entry, { type: "human", ref: executedBy }, false);
    });
    return entry;
  }

  listDeletionRequests(dossierId: string): LocalDeletionRequest[] {
    this.requireDossier(dossierId);
    return this.all<DeletionRequestRow>(
      "select * from deletion_requests where dossier_id = ? order by requested_at desc",
      dossierId,
    ).map(mapDeletionRequest);
  }

  listDeletionRegister(): DeletionRegisterEntry[] {
    return this.all<DeletionRegisterRow>(
      "select * from deletion_register order by completed_at, id",
    ).map(mapDeletionRegisterEntry);
  }

  verifyDeletionRegister(registerPath = this.deletionRegisterPath): {
    valid: boolean;
    entries: number;
    error?: string;
  } {
    const verification = verifyDeletionRegisterFile(registerPath);
    if (!verification.valid || path.resolve(registerPath) !== path.resolve(this.deletionRegisterPath)) {
      return verification;
    }
    const fileEntries = readDeletionRegisterFile(registerPath);
    const databaseEntries = this.listDeletionRegister();
    if (fileEntries.length !== databaseEntries.length) {
      return {
        valid: false,
        entries: fileEntries.length,
        error: "Deletion register file and database contain a different number of entries.",
      };
    }
    const databaseHashes = new Map(databaseEntries.map((entry) => [entry.id, entry.entryHash]));
    const mismatch = fileEntries.find((entry) => databaseHashes.get(entry.id) !== entry.entryHash);
    if (mismatch) {
      return {
        valid: false,
        entries: fileEntries.length,
        error: `Deletion register entry is missing or inconsistent in the database: ${mismatch.id}.`,
      };
    }
    return verification;
  }

  reapplyDeletionRegister(registerPath = this.deletionRegisterPath): number {
    const verification = verifyDeletionRegisterFile(registerPath);
    if (!verification.valid) throw new Error(`Deletion register is invalid: ${verification.error}`);
    let applied = 0;
    for (const entry of readDeletionRegisterFile(registerPath)) {
      const dossier = this.getDossier(entry.dossierNumber);
      if (!dossier || dossier.scope.retentionStatus === "deleted") continue;
      this.removeGeneratedDossierFiles(dossier.dossierNumber);
      this.transaction(() => {
        this.applyDeletionEntry(dossier.id, entry, { type: "system", ref: "restore-deletion-replay" }, true);
      });
      applied += 1;
    }
    return applied;
  }

  updateDossierStatus(
    dossierId: string,
    status: LocalDossier["status"],
    actor: LocalActor,
  ): void {
    this.transaction(() => {
      const dossier = this.requireMutableDossier(dossierId);
      if (dossier.status === status) return;
      const order: LocalDossier["status"][] = [
        "registered",
        "scoped",
        "researching",
        "reviewing",
        "drafted",
        "closed",
      ];
      if (order.indexOf(status) < order.indexOf(dossier.status)) {
        throw new Error(`Dossier status cannot move backwards from ${dossier.status} to ${status}.`);
      }
      this.run(
        "update dossiers set status = ?, updated_at = ?, version = version + 1 where id = ?",
        status,
        now(),
        dossier.id,
      );
      this.appendAudit(dossier.id, actor, "update_status", "dossier", dossier.id, {
        dossierNumber: dossier.dossierNumber,
        statusFrom: dossier.status,
        statusTo: status,
      });
    });
  }

  listDossiers(): LocalDossier[] {
    return this.all<DossierRow>("select * from dossiers order by received_at desc").map(mapDossier);
  }

  ensureResearchPlan(dossierId: string, actor: LocalActor): ResearchPlan {
    const dossier = this.requireMutableDossier(dossierId);
    const plan = buildPhaseOneResearchPlan({
      dossierId: dossier.id,
      decisionQuestion: dossier.decisionQuestion,
    });

    this.transaction(() => {
      const jobIds = new Map<string, string>();
      for (const definition of plan.jobs) {
        const existing = this.get<{ id: string }>(
          "select id from research_jobs where dossier_id = ? and job_key = ?",
          dossier.id,
          definition.key,
        );
        const jobId = existing?.id ?? randomUUID();
        jobIds.set(definition.key, jobId);
        if (!existing) {
          const timestamp = now();
          this.run(
            `insert into research_jobs (
               id, dossier_id, job_key, role, title, execution, status,
               approval_required, created_at, updated_at
             ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            jobId,
            dossier.id,
            definition.key,
            definition.role,
            definition.title,
            definition.execution,
            definition.key === "scope" || definition.execution === "human"
              ? "waiting_for_approval"
              : "pending",
            definition.approvalRequired ? 1 : 0,
            timestamp,
            timestamp,
          );
          this.appendAudit(dossier.id, actor, "create", "research_job", jobId, {
            jobKind: definition.role,
          });
        }
      }

      for (const definition of plan.jobs) {
        for (const dependency of definition.dependsOn) {
          this.run(
            `insert or ignore into research_job_dependencies
             (dossier_id, job_id, depends_on_job_id) values (?, ?, ?)`,
            dossier.id,
            jobIds.get(definition.key),
            jobIds.get(dependency),
          );
        }
      }
    });
    return plan;
  }

  listResearchJobs(dossierId: string): LocalResearchJob[] {
    return this.all<JobRow>(
      "select * from research_jobs where dossier_id = ? order by created_at, job_key",
      dossierId,
    ).map(mapJob);
  }

  updateResearchJobStatus(input: {
    dossierId: string;
    jobKey: string;
    status: JobStatus;
    actor: LocalActor;
  }): void {
    this.transaction(() => {
      this.requireMutableDossier(input.dossierId);
      const row = this.get<JobRow>(
        "select * from research_jobs where dossier_id = ? and job_key = ?",
        input.dossierId,
        input.jobKey,
      );
      if (!row) throw new Error(`Unknown research job: ${input.jobKey}`);
      if (row.status === input.status) return;
      if (input.status === "completed") {
        if (row.execution === "human") {
          throw new Error("Human workflow jobs can only complete through an explicit approval method.");
        }
        const blocker = this.get<{ job_key: string }>(
          `select dependency.job_key
           from research_job_dependencies as relation
           join research_jobs as dependency on dependency.id = relation.depends_on_job_id
           where relation.job_id = ? and dependency.status <> 'completed'
           limit 1`,
          row.id,
        );
        if (blocker) throw new Error(`Research job is blocked by incomplete dependency: ${blocker.job_key}`);
        if (row.approval_required === 1) {
          const approval = this.get<{ id: string }>(
            `select id from approvals
             where dossier_id = ? and object_type = 'scope' and object_id = ?
               and reviewer_kind = 'human' and decision = 'approved'
             order by decided_at desc limit 1`,
            input.dossierId,
            input.dossierId,
          );
          if (!approval) throw new Error("This research job requires a recorded human approval.");
        }
        if (row.job_key === "evidence" && this.countForDossier("evidence", input.dossierId) === 0) {
          throw new Error("Evidence normalisation cannot complete without an evidence record.");
        }
        if (row.job_key === "red-team") {
          const review = this.get<{ id: string }>(
            `select review.id
             from verification_reviews as review
             join findings as finding on finding.id = review.finding_id
             where review.dossier_id = ? and review.review_type = 'red_team'
               and review.reviewer_ref <> finding.created_by
             limit 1`,
            input.dossierId,
          );
          if (!review) {
            throw new Error("Red-team work cannot complete without an independent red-team review.");
          }
        }
        if (row.job_key === "analysis" && this.countForDossier("findings", input.dossierId) === 0) {
          throw new Error("Analysis cannot complete without a finding.");
        }
        if (row.job_key === "report" && !this.getLatestDraft(input.dossierId)) {
          throw new Error("Report work cannot complete without a stored draft.");
        }
      }
      this.run(
        "update research_jobs set status = ?, updated_at = ? where id = ?",
        input.status,
        now(),
        row.id,
      );
      this.appendAudit(input.dossierId, input.actor, "update_status", "research_job", row.id, {
        jobKind: row.role,
        statusFrom: row.status,
        statusTo: input.status,
      });
    });
  }

  approveScope(input: { dossierId: string; decidedBy: string; rationale: string }): void {
    const dossier = this.requireMutableDossier(input.dossierId);
    const decidedBy = requireText(input.decidedBy, "approval.decidedBy");
    const rationale = requireText(input.rationale, "approval.rationale");
    const actor: LocalActor = { type: "human", ref: decidedBy };
    this.transaction(() => {
      const existing = this.get<{ id: string }>(
        `select id from approvals
         where dossier_id = ? and object_type = 'scope' and object_id = ?
           and reviewer_kind = 'human' and decision = 'approved'
         order by decided_at desc limit 1`,
        dossier.id,
        dossier.id,
      );
      if (existing) return;
      const timestamp = now();
      const approvalId = randomUUID();
      this.run(
        `insert into approvals (
           id, dossier_id, object_type, object_id, reviewer_kind, decided_by,
           decision, rationale, decided_at, created_at
         ) values (?, ?, 'scope', ?, 'human', ?, 'approved', ?, ?, ?)`,
        approvalId,
        dossier.id,
        dossier.id,
        decidedBy,
        rationale,
        timestamp,
        timestamp,
      );
      this.appendAudit(dossier.id, actor, "approve", "scope", dossier.id, {
        approvalDecision: "approved",
        dossierNumber: dossier.dossierNumber,
      });
      this.run(
        `update research_jobs set status = 'completed', updated_at = ?
         where dossier_id = ? and job_key = 'scope'`,
        timestamp,
        dossier.id,
      );
      if (dossier.status === "registered") {
        this.run(
          "update dossiers set status = 'scoped', updated_at = ?, version = version + 1 where id = ?",
          timestamp,
          dossier.id,
        );
        this.appendAudit(dossier.id, actor, "update_status", "dossier", dossier.id, {
          dossierNumber: dossier.dossierNumber,
          statusFrom: "registered",
          statusTo: "scoped",
        });
      }
      this.appendAudit(dossier.id, actor, "update_status", "research_job", "scope", {
        jobKind: "scope",
        statusFrom: "waiting_for_approval",
        statusTo: "completed",
      });
    });
  }

  addSource(
    dossierId: string,
    input: Omit<SourceRecord, "id"> & { id?: string },
    actor: LocalActor,
  ): SourceRecord {
    this.requireMutableDossier(dossierId);
    const existing = this.get<SourceRow>(
      "select * from sources where dossier_id = ? and code = ?",
      dossierId,
      input.code,
    );
    if (existing) return mapSource(existing);
    const id = input.id ?? randomUUID();
    const timestamp = now();
    this.transaction(() => {
      this.run(
        `insert into sources (
           id, dossier_id, code, title, canonical_url, publisher, source_type,
           published_at, retrieved_at, sha256, created_at
         ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        dossierId,
        requireText(input.code, "source.code"),
        requireText(input.title, "source.title"),
        input.canonicalUrl ?? null,
        input.publisher ?? null,
        requireText(input.sourceType, "source.sourceType"),
        input.publishedAt ?? null,
        requireIsoDate(input.retrievedAt, "source.retrievedAt"),
        input.sha256 ?? null,
        timestamp,
      );
      this.appendAudit(dossierId, actor, "create", "source", id, { sourceCode: input.code });
    });
    return { ...input, id };
  }

  addEvidence(
    dossierId: string,
    input: Omit<EvidenceRecord, "id"> & { id?: string },
    actor: LocalActor,
  ): EvidenceRecord {
    this.requireMutableDossier(dossierId);
    const existing = this.get<EvidenceRow>(
      "select * from evidence where dossier_id = ? and code = ?",
      dossierId,
      input.code,
    );
    if (existing) return mapEvidence(existing);
    const id = input.id ?? randomUUID();
    const timestamp = now();
    this.transaction(() => {
      this.run(
        `insert into evidence (
           id, dossier_id, source_id, code, observation, locator, observed_at, created_at
         ) values (?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        dossierId,
        input.sourceId,
        requireText(input.code, "evidence.code"),
        requireText(input.observation, "evidence.observation"),
        input.locator ?? null,
        input.observedAt ?? null,
        timestamp,
      );
      this.appendAudit(dossierId, actor, "create", "evidence", id, { sourceCode: input.code });
    });
    return { ...input, id };
  }

  addFinding(
    dossierId: string,
    input: Omit<FindingRecord, "id"> & { id?: string },
    actor: LocalActor,
  ): FindingRecord {
    this.requireMutableDossier(dossierId);
    const existing = this.get<FindingRow>(
      "select * from findings where dossier_id = ? and code = ?",
      dossierId,
      input.code,
    );
    if (existing) return mapFinding(existing);
    const id = input.id ?? randomUUID();
    const timestamp = now();
    this.transaction(() => {
      this.run(
        `insert into findings (
           id, dossier_id, code, statement, finding_type, confidence, rationale,
           material, created_by, status, contradiction_resolution,
           information_gaps_json, created_at, updated_at
         ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        dossierId,
        requireText(input.code, "finding.code"),
        requireText(input.statement, "finding.statement"),
        input.type,
        input.confidence,
        requireText(input.rationale, "finding.rationale"),
        input.material ? 1 : 0,
        requireText(input.createdBy, "finding.createdBy"),
        input.status,
        input.contradictionResolution ?? null,
        JSON.stringify(input.informationGaps ?? []),
        timestamp,
        timestamp,
      );
      this.appendAudit(dossierId, actor, "create", "finding", id, { findingCode: input.code });
    });
    return { ...input, id };
  }

  linkEvidence(
    dossierId: string,
    findingId: string,
    evidenceId: string,
    direction: EvidenceDirection,
    actor: LocalActor,
  ): void {
    this.transaction(() => {
      this.requireMutableDossier(dossierId);
      const result = this.run(
        `insert or ignore into finding_evidence
         (dossier_id, finding_id, evidence_id, direction) values (?, ?, ?, ?)`,
        dossierId,
        findingId,
        evidenceId,
        direction,
      );
      if (Number(result.changes) > 0) {
        this.appendAudit(
          dossierId,
          actor,
          "link",
          "finding_evidence",
          `${findingId}:${evidenceId}`,
        );
      }
    });
  }

  addVerificationReview(
    dossierId: string,
    input: Omit<VerificationReview, "id"> & {
      id?: string;
      confidenceBefore: FindingRecord["confidence"];
      confidenceAfter: FindingRecord["confidence"];
      notes?: string;
    },
    actor: LocalActor,
  ): VerificationReview {
    this.requireMutableDossier(dossierId);
    const existing = this.get<ReviewRow>(
      `select * from verification_reviews
       where dossier_id = ? and finding_id = ? and review_type = ? and reviewer_ref = ?`,
      dossierId,
      input.findingId,
      input.reviewType,
      input.reviewerRef,
    );
    if (existing) return mapReview(existing);
    const id = input.id ?? randomUUID();
    const timestamp = now();
    this.transaction(() => {
      this.run(
        `insert into verification_reviews (
           id, dossier_id, finding_id, review_type, reviewer_kind, reviewer_ref,
           verdict, confidence_before, confidence_after, alternative_explanations_json,
           unresolved_gaps_json, notes, completed_at, created_at
         ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        dossierId,
        input.findingId,
        input.reviewType,
        input.reviewerKind,
        requireText(input.reviewerRef, "review.reviewerRef"),
        input.verdict,
        input.confidenceBefore,
        input.confidenceAfter,
        JSON.stringify(input.alternativeExplanations),
        JSON.stringify(input.unresolvedGaps),
        input.notes ?? null,
        requireIsoDate(input.completedAt, "review.completedAt"),
        timestamp,
      );
      this.appendAudit(dossierId, actor, "create", "verification_review", id, {
        findingCode: input.findingId,
      });
    });
    return { ...input, id };
  }

  getBundle(dossierId: string): {
    dossier: LocalDossier;
    sources: SourceRecord[];
    evidence: EvidenceRecord[];
    findings: FindingRecord[];
    links: EvidenceLink[];
    reviews: VerificationReview[];
  } {
    return {
      dossier: this.requireDossier(dossierId),
      sources: this.all<SourceRow>("select * from sources where dossier_id = ? order by code", dossierId).map(
        mapSource,
      ),
      evidence: this.all<EvidenceRow>(
        "select * from evidence where dossier_id = ? order by code",
        dossierId,
      ).map(mapEvidence),
      findings: this.all<FindingRow>(
        "select * from findings where dossier_id = ? order by code",
        dossierId,
      ).map(mapFinding),
      links: this.all<LinkRow>(
        "select * from finding_evidence where dossier_id = ? order by finding_id, evidence_id",
        dossierId,
      ).map((row) => ({
        findingId: row.finding_id,
        evidenceId: row.evidence_id,
        direction: row.direction,
      })),
      reviews: this.all<ReviewRow>(
        "select * from verification_reviews where dossier_id = ? order by completed_at",
        dossierId,
      ).map(mapReview),
    };
  }

  createDraft(input: {
    dossierId: string;
    title: string;
    createdBy: string;
    actor: LocalActor;
  }): StoredDraft {
    this.requireMutableDossier(input.dossierId);
    const bundle = this.getBundle(input.dossierId);
    if (bundle.dossier.status === "closed") throw new Error("A closed dossier cannot receive a new draft.");
    const reportJob = this.get<JobRow>(
      "select * from research_jobs where dossier_id = ? and job_key = 'report'",
      input.dossierId,
    );
    if (reportJob) {
      const blocker = this.get<{ job_key: string }>(
        `select dependency.job_key
         from research_job_dependencies as relation
         join research_jobs as dependency on dependency.id = relation.depends_on_job_id
         where relation.job_id = ? and dependency.status <> 'completed'
         limit 1`,
        reportJob.id,
      );
      if (blocker) throw new Error(`Report draft is blocked by incomplete job: ${blocker.job_key}`);
    }
    const report = buildDraftReport({
      dossierNumber: bundle.dossier.dossierNumber,
      title: input.title,
      decisionQuestion: bundle.dossier.decisionQuestion,
      sources: bundle.sources,
      evidence: bundle.evidence,
      findings: bundle.findings,
      links: bundle.links,
      reviews: bundle.reviews,
    });
    const current = this.get<{ version: number }>(
      "select coalesce(max(version), 0) as version from report_drafts where dossier_id = ?",
      input.dossierId,
    );
    const version = (current?.version ?? 0) + 1;
    const id = randomUUID();
    const timestamp = now();
    this.transaction(() => {
      this.run(
        `insert into report_drafts (
           id, dossier_id, version, status, title, body_markdown,
           created_by, created_at, updated_at
         ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        input.dossierId,
        version,
        report.status,
        requireText(input.title, "draft.title"),
        report.markdown,
        requireText(input.createdBy, "draft.createdBy"),
        timestamp,
        timestamp,
      );
      this.run(
        "update dossiers set status = 'drafted', updated_at = ?, version = version + 1 where id = ?",
        timestamp,
        input.dossierId,
      );
      this.appendAudit(input.dossierId, input.actor, "create", "report_draft", id, { version });
    });
    return {
      id,
      dossierId: input.dossierId,
      version,
      status: report.status,
      title: input.title,
      markdown: report.markdown,
      createdBy: input.createdBy,
      createdAt: timestamp,
    };
  }

  getLatestDraft(dossierId: string): StoredDraft | undefined {
    const row = this.get<DraftRow>(
      "select * from report_drafts where dossier_id = ? order by version desc limit 1",
      dossierId,
    );
    return row ? mapDraft(row) : undefined;
  }

  approveDraft(input: {
    dossierId: string;
    draftId: string;
    decidedBy: string;
    rationale: string;
  }): void {
    this.requireMutableDossier(input.dossierId);
    const bundle = this.getBundle(input.dossierId);
    const readiness = evaluateDraftReadiness(bundle);
    if (!readiness.ready) {
      throw new Error(`Draft is blocked: ${readiness.blockers.map((item) => item.code).join(", ")}`);
    }
    const draft = this.get<DraftRow>(
      "select * from report_drafts where id = ? and dossier_id = ?",
      input.draftId,
      input.dossierId,
    );
    if (!draft) throw new Error("Draft not found.");
    if (draft.status !== "review_ready") throw new Error("Only a review-ready draft can be approved.");
    const qaJob = this.get<JobRow>(
      "select * from research_jobs where dossier_id = ? and job_key = 'qa'",
      input.dossierId,
    );
    if (qaJob && qaJob.status !== "completed") {
      throw new Error("Report approval is blocked until the QA job is completed.");
    }
    const decidedBy = requireText(input.decidedBy, "approval.decidedBy");
    const rationale = requireText(input.rationale, "approval.rationale");
    const timestamp = now();
    const approvalId = randomUUID();
    const actor: LocalActor = { type: "human", ref: decidedBy };
    this.transaction(() => {
      this.run(
        `insert into approvals (
           id, dossier_id, object_type, object_id, reviewer_kind, decided_by,
           decision, rationale, decided_at, created_at
         ) values (?, ?, 'report_draft', ?, 'human', ?, 'approved', ?, ?, ?)`,
        approvalId,
        input.dossierId,
        input.draftId,
        decidedBy,
        rationale,
        timestamp,
        timestamp,
      );
      this.appendAudit(input.dossierId, actor, "approve", "report_draft", input.draftId, {
        approvalDecision: "approved",
        version: draft.version,
      });
      this.run(
        "update report_drafts set status = 'approved', approved_at = ?, updated_at = ? where id = ?",
        timestamp,
        timestamp,
        input.draftId,
      );
      this.run(
        `update research_jobs set status = 'completed', updated_at = ?
         where dossier_id = ? and job_key = 'approval'`,
        timestamp,
        input.dossierId,
      );
      this.appendAudit(input.dossierId, actor, "update_status", "report_draft", input.draftId, {
        statusFrom: "review_ready",
        statusTo: "approved",
        version: draft.version,
      });
    });
  }

  exportLatestDraft(dossierId: string): string {
    const dossier = this.requireDossier(dossierId);
    const draft = this.getLatestDraft(dossier.id);
    if (!draft) throw new Error("No report draft is available to export.");
    const directory = path.join(this.homePath, "exports", dossier.dossierNumber);
    mkdirPrivate(directory);
    const target = path.join(directory, `draft-v${draft.version}.md`);
    writeFileSync(target, draft.markdown, { encoding: "utf8", mode: 0o600 });
    chmodPrivate(target, 0o600);
    return target;
  }

  async createBackup(label = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-")): Promise<string> {
    const safeLabel = label.replace(/[^a-zA-Z0-9_-]/g, "-");
    const directory = path.join(this.homePath, "backups", safeLabel);
    mkdirPrivate(directory);
    const target = path.join(directory, LOCAL_DATABASE_NAME);
    await backup(this.database, target);
    chmodPrivate(target, 0o600);
    if (existsSync(this.deletionRegisterPath)) {
      const registerTarget = path.join(directory, DELETION_REGISTER_NAME);
      copyFileSync(this.deletionRegisterPath, registerTarget);
      chmodPrivate(registerTarget, 0o600);
    }
    return target;
  }

  verifyAuditChain(dossierId: string): { valid: boolean; events: number; error?: string } {
    const rows = this.all<AuditRow>(
      "select * from audit_events where dossier_id = ? order by sequence",
      dossierId,
    );
    let previousHash: string | undefined;
    for (const row of rows) {
      if ((row.previous_hash ?? undefined) !== previousHash) {
        return { valid: false, events: rows.length, error: `Broken previous hash at event ${row.sequence}.` };
      }
      const rebuilt = buildAuditEvent({
        occurredAt: row.occurred_at,
        actorType: row.actor_type,
        actorRef: row.actor_ref,
        action: row.action,
        objectType: row.object_type,
        objectId: row.object_id,
        metadata: JSON.parse(row.metadata_json) as AuditEvent["metadata"],
        previousHash,
      });
      if (rebuilt.eventHash !== row.event_hash) {
        return { valid: false, events: rows.length, error: `Hash mismatch at event ${row.sequence}.` };
      }
      previousHash = row.event_hash;
    }
    return { valid: true, events: rows.length };
  }

  listAuditEvents(dossierId: string, limit = 100): LocalAuditEvent[] {
    if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
      throw new RangeError("Audit event limit must be an integer from 1 through 500.");
    }
    return this.all<AuditRow>(
      `select * from audit_events where dossier_id = ? order by sequence desc limit ?`,
      dossierId,
      limit,
    ).map((row) => ({
      sequence: row.sequence,
      occurredAt: row.occurred_at,
      actorType: row.actor_type,
      actorRef: row.actor_ref,
      action: row.action,
      objectType: row.object_type,
      objectId: row.object_id,
      metadata: JSON.parse(row.metadata_json) as AuditEvent["metadata"],
      eventHash: row.event_hash,
    }));
  }

  verifyDatabase(): { valid: boolean; message: string } {
    const row = this.get<{ integrity_check: string }>("pragma integrity_check");
    const message = row?.integrity_check ?? "No integrity result returned.";
    return { valid: message === "ok", message };
  }

  getStatus(): LocalStatus {
    return {
      databasePath: this.databasePath,
      dossiers: this.count("dossiers"),
      sources: this.count("sources"),
      evidence: this.count("evidence"),
      findings: this.count("findings"),
      pendingHumanApprovals:
        this.count(
          "research_jobs",
          "where execution = 'human' and status = 'waiting_for_approval'",
        ) + this.count("deletion_requests", "where status = 'proposed'"),
      auditEvents: this.count("audit_events"),
    };
  }

  private requireDossier(idOrNumber: string): LocalDossier {
    const dossier = this.getDossier(idOrNumber);
    if (!dossier) throw new Error(`Dossier not found: ${idOrNumber}`);
    return dossier;
  }

  private requireMutableDossier(idOrNumber: string): LocalDossier {
    const dossier = this.requireDossier(idOrNumber);
    if (dossier.status === "closed" || dossier.scope.retentionStatus === "deleted") {
      throw new Error("A closed or retention-deleted dossier cannot receive new content.");
    }
    return dossier;
  }

  private requireNotDeletedDossier(idOrNumber: string): LocalDossier {
    const dossier = this.requireDossier(idOrNumber);
    if (dossier.scope.retentionStatus === "deleted") {
      throw new Error("A retention-deleted dossier cannot receive new records.");
    }
    return dossier;
  }

  private requireRetentionItem(dossierId: string, itemId: string): LocalRetentionItem {
    const row = this.get<RetentionItemRow>(
      "select * from retention_items where id = ? and dossier_id = ?",
      itemId,
      dossierId,
    );
    if (!row) throw new Error("Retention item not found.");
    return mapRetentionItem(row);
  }

  private requireDeletionRequest(dossierId: string, requestId: string): LocalDeletionRequest {
    const row = this.get<DeletionRequestRow>(
      "select * from deletion_requests where id = ? and dossier_id = ?",
      requestId,
      dossierId,
    );
    if (!row) throw new Error("Deletion request not found.");
    return mapDeletionRequest(row);
  }

  private getOrAppendDeletionRegisterEntry(
    input: Omit<DeletionRegisterEntry, "previousHash" | "entryHash">,
  ): DeletionRegisterEntry {
    const verification = verifyDeletionRegisterFile(this.deletionRegisterPath);
    if (!verification.valid) {
      throw new Error(`Deletion register is invalid: ${verification.error}`);
    }
    const entries = readDeletionRegisterFile(this.deletionRegisterPath);
    const existing = entries.find((entry) => entry.id === input.id);
    if (existing) {
      if (existing.dossierNumber !== input.dossierNumber || existing.action !== input.action) {
        throw new Error("Deletion register request ID conflicts with an existing entry.");
      }
      return existing;
    }
    const entry = buildDeletionRegisterEntry(input, entries.at(-1)?.entryHash);
    appendFileSync(this.deletionRegisterPath, `${JSON.stringify(entry)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
    chmodPrivate(this.deletionRegisterPath, 0o600);
    return entry;
  }

  private removeGeneratedDossierFiles(dossierNumber: string): void {
    const exportRoot = path.resolve(this.homePath, "exports");
    const dossierExport = path.resolve(exportRoot, dossierNumber);
    if (!dossierExport.startsWith(`${exportRoot}${path.sep}`)) {
      throw new Error("Refusing to remove an export path outside the local export directory.");
    }
    rmSync(dossierExport, { recursive: true, force: true });
    const dashboard = path.join(this.homePath, "control-room.html");
    if (existsSync(dashboard)) unlinkSync(dashboard);
  }

  private applyDeletionEntry(
    dossierId: string,
    entry: DeletionRegisterEntry,
    actor: LocalActor,
    replay: boolean,
  ): void {
    this.requireDossier(dossierId);
    this.run("delete from finding_evidence where dossier_id = ?", dossierId);
    this.run("delete from verification_reviews where dossier_id = ?", dossierId);
    this.run("delete from evidence where dossier_id = ?", dossierId);
    this.run("delete from findings where dossier_id = ?", dossierId);
    this.run("delete from agent_runs where dossier_id = ?", dossierId);
    this.run("delete from research_job_dependencies where dossier_id = ?", dossierId);
    this.run("delete from research_jobs where dossier_id = ?", dossierId);
    this.run("delete from sources where dossier_id = ?", dossierId);
    this.run("delete from report_drafts where dossier_id = ?", dossierId);
    this.run("delete from approvals where dossier_id = ?", dossierId);
    this.run("delete from retention_items where dossier_id = ?", dossierId);
    this.run("delete from deletion_requests where dossier_id = ?", dossierId);
    this.run(
      `insert or ignore into deletion_register (
         id, dossier_number, categories_json, action, locations_json,
         deadline_at, reviewed_at, approved_by, executed_by, completed_at,
         previous_hash, entry_hash
       ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      entry.id,
      entry.dossierNumber,
      JSON.stringify(entry.categories),
      entry.action,
      JSON.stringify(entry.locations),
      entry.deadlineAt,
      entry.reviewedAt,
      entry.approvedBy,
      entry.executedBy,
      entry.completedAt,
      entry.previousHash ?? null,
      entry.entryHash,
    );
    this.run(
      `update dossiers
       set decision_question = '[deleted under approved retention request]',
           scope_json = ?, status = 'closed', created_by = 'retention-deleted',
           updated_at = ?, version = version + 1
       where id = ?`,
      JSON.stringify({ retentionStatus: "deleted", deletionRequestId: entry.id }),
      now(),
      dossierId,
    );
    this.appendAudit(
      dossierId,
      actor,
      replay ? "reapply_deletion" : "execute_deletion",
      "deletion_register",
      entry.id,
      {
        retentionAction: replay ? "reapplied" : entry.action,
        retentionCategoryCount: entry.categories.length,
      },
    );
  }

  private appendAudit(
    dossierId: string,
    actor: LocalActor,
    action: string,
    objectType: string,
    objectId: string,
    metadata: AuditEvent["metadata"] = {},
  ): void {
    const previous = this.get<{ event_hash: string }>(
      "select event_hash from audit_events where dossier_id = ? order by sequence desc limit 1",
      dossierId,
    );
    const event = buildAuditEvent({
      occurredAt: now(),
      actorType: actor.type,
      actorRef: requireText(actor.ref, "actor.ref"),
      action,
      objectType,
      objectId,
      metadata,
      previousHash: previous?.event_hash,
    });
    this.run(
      `insert into audit_events (
         dossier_id, occurred_at, actor_type, actor_ref, action, object_type,
         object_id, metadata_json, previous_hash, event_hash
       ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      dossierId,
      event.occurredAt,
      event.actorType,
      event.actorRef,
      event.action,
      event.objectType,
      event.objectId,
      JSON.stringify(event.metadata),
      event.previousHash ?? null,
      event.eventHash,
    );
  }

  private transaction<T>(work: () => T): T {
    if (this.transactionDepth > 0) return work();
    this.database.exec("begin immediate");
    this.transactionDepth = 1;
    try {
      const result = work();
      this.database.exec("commit");
      return result;
    } catch (error) {
      this.database.exec("rollback");
      throw error;
    } finally {
      this.transactionDepth = 0;
    }
  }

  private setMetaIfMissing(key: string, value: string): void {
    this.run("insert or ignore into local_meta (key, value) values (?, ?)", key, value);
  }

  private count(table: string, suffix = ""): number {
    const allowed = new Set([
      "dossiers",
      "sources",
      "evidence",
      "findings",
      "research_jobs",
      "deletion_requests",
      "audit_events",
    ]);
    if (!allowed.has(table)) throw new TypeError("Unsupported count table.");
    const row = this.get<{ count: number }>(`select count(*) as count from ${table} ${suffix}`);
    return row?.count ?? 0;
  }

  private countForDossier(table: "evidence" | "findings", dossierId: string): number {
    const row = this.get<{ count: number }>(
      `select count(*) as count from ${table} where dossier_id = ?`,
      dossierId,
    );
    return row?.count ?? 0;
  }

  private run(sql: string, ...parameters: unknown[]) {
    return this.database.prepare(sql).run(...parameters);
  }

  private get<T>(sql: string, ...parameters: unknown[]): T | undefined {
    return this.database.prepare(sql).get(...parameters) as T | undefined;
  }

  private all<T>(sql: string, ...parameters: unknown[]): T[] {
    return this.database.prepare(sql).all(...parameters) as T[];
  }
}

export function restoreBackupToIsolatedHome(
  backupPath: string,
  targetHome: string,
  deletionRegisterPath?: string,
): IsolatedRestoreResult {
  const source = path.resolve(backupPath);
  const target = path.resolve(targetHome);
  if (!existsSync(source) || !lstatSync(source).isFile()) {
    throw new Error(`Backup file not found: ${source}`);
  }
  if (existsSync(target) && readdirSync(target).length > 0) {
    throw new Error("Restore target must be a new or empty directory.");
  }
  mkdirPrivate(target);
  const restoredDatabase = path.join(target, LOCAL_DATABASE_NAME);
  copyFileSync(source, restoredDatabase, fsConstants.COPYFILE_EXCL);
  chmodPrivate(restoredDatabase, 0o600);

  const restored = new LocalIntelligenceStore(target);
  try {
    const adjacentRegister = path.join(path.dirname(source), DELETION_REGISTER_NAME);
    const requestedRegister = deletionRegisterPath ? path.resolve(deletionRegisterPath) : undefined;
    const register = requestedRegister && existsSync(requestedRegister)
      ? requestedRegister
      : existsSync(adjacentRegister)
        ? adjacentRegister
        : undefined;
    let reappliedDeletions = 0;
    if (register) {
      copyFileSync(register, restored.deletionRegisterPath, fsConstants.COPYFILE_EXCL);
      chmodPrivate(restored.deletionRegisterPath, 0o600);
      reappliedDeletions = restored.reapplyDeletionRegister();
    }
    const integrity = restored.verifyDatabase();
    if (!integrity.valid) throw new Error(`Restored database failed integrity check: ${integrity.message}`);
    const deletionIntegrity = restored.verifyDeletionRegister();
    if (!deletionIntegrity.valid) {
      throw new Error(`Restored deletion register failed verification: ${deletionIntegrity.error}`);
    }
    let auditEvents = 0;
    for (const dossier of restored.listDossiers()) {
      const audit = restored.verifyAuditChain(dossier.id);
      if (!audit.valid) {
        throw new Error(`Restored audit chain failed for ${dossier.dossierNumber}: ${audit.error}`);
      }
      auditEvents += audit.events;
    }
    const status = restored.getStatus();
    return {
      restoredHome: target,
      databasePath: restored.databasePath,
      dossiers: status.dossiers,
      auditEvents,
      reappliedDeletions,
    };
  } finally {
    restored.close();
  }
}

interface DossierRow {
  id: string;
  dossier_number: string;
  received_at: string;
  decision_question: string;
  scope_json: string;
  status: LocalDossier["status"];
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface SourceRow {
  id: string;
  code: string;
  title: string;
  canonical_url: string | null;
  publisher: string | null;
  source_type: string;
  published_at: string | null;
  retrieved_at: string;
  sha256: string | null;
}

interface EvidenceRow {
  id: string;
  code: string;
  source_id: string;
  observation: string;
  locator: string | null;
  observed_at: string | null;
}

interface FindingRow {
  id: string;
  code: string;
  statement: string;
  finding_type: FindingRecord["type"];
  confidence: FindingRecord["confidence"];
  rationale: string;
  material: number;
  created_by: string;
  status: FindingRecord["status"];
  contradiction_resolution: string | null;
  information_gaps_json: string;
}

interface LinkRow {
  finding_id: string;
  evidence_id: string;
  direction: EvidenceDirection;
}

interface ReviewRow {
  id: string;
  finding_id: string;
  review_type: VerificationReview["reviewType"];
  reviewer_kind: VerificationReview["reviewerKind"];
  reviewer_ref: string;
  verdict: VerificationReview["verdict"];
  alternative_explanations_json: string;
  unresolved_gaps_json: string;
  completed_at: string;
}

interface JobRow {
  id: string;
  dossier_id: string;
  job_key: string;
  role: string;
  title: string;
  execution: "agent" | "human";
  status: JobStatus;
  approval_required: number;
}

interface DraftRow {
  id: string;
  dossier_id: string;
  version: number;
  status: StoredDraft["status"];
  title: string;
  body_markdown: string;
  created_by: string;
  created_at: string;
  approved_at: string | null;
}

interface AuditRow {
  sequence: number;
  occurred_at: string;
  actor_type: ActorType;
  actor_ref: string;
  action: string;
  object_type: string;
  object_id: string;
  metadata_json: string;
  previous_hash: string | null;
  event_hash: string;
}

interface RetentionItemRow {
  id: string;
  dossier_id: string;
  category: RetentionCategory;
  trigger_at: string;
  deadline_at: string;
  storage_locations_json: string;
  status: LocalRetentionItem["status"];
  hold_reason: string | null;
  hold_review_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface DeletionRequestRow {
  id: string;
  dossier_id: string;
  status: LocalDeletionRequest["status"];
  categories_json: string;
  reviewed_at: string;
  requested_by: string;
  requested_at: string;
  rationale: string;
  decided_by: string | null;
  decided_at: string | null;
  decision_rationale: string | null;
  executed_by: string | null;
  executed_at: string | null;
}

interface DeletionRegisterRow {
  id: string;
  dossier_number: string;
  categories_json: string;
  action: DeletionRegisterEntry["action"];
  locations_json: string;
  deadline_at: string;
  reviewed_at: string;
  approved_by: string;
  executed_by: string;
  completed_at: string;
  previous_hash: string | null;
  entry_hash: string;
}

function mapDossier(row: DossierRow): LocalDossier {
  return {
    id: row.id,
    dossierNumber: row.dossier_number,
    receivedAt: row.received_at,
    decisionQuestion: row.decision_question,
    scope: JSON.parse(row.scope_json) as Record<string, unknown>,
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSource(row: SourceRow): SourceRecord {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    canonicalUrl: row.canonical_url ?? undefined,
    publisher: row.publisher ?? undefined,
    sourceType: row.source_type,
    publishedAt: row.published_at ?? undefined,
    retrievedAt: row.retrieved_at,
    sha256: row.sha256 ?? undefined,
  };
}

function mapEvidence(row: EvidenceRow): EvidenceRecord {
  return {
    id: row.id,
    code: row.code,
    sourceId: row.source_id,
    observation: row.observation,
    locator: row.locator ?? undefined,
    observedAt: row.observed_at ?? undefined,
  };
}

function mapFinding(row: FindingRow): FindingRecord {
  return {
    id: row.id,
    code: row.code,
    statement: row.statement,
    type: row.finding_type,
    confidence: row.confidence,
    rationale: row.rationale,
    material: row.material === 1,
    createdBy: row.created_by,
    status: row.status,
    contradictionResolution: row.contradiction_resolution ?? undefined,
    informationGaps: JSON.parse(row.information_gaps_json) as string[],
  };
}

function mapReview(row: ReviewRow): VerificationReview {
  return {
    id: row.id,
    findingId: row.finding_id,
    reviewType: row.review_type,
    reviewerKind: row.reviewer_kind,
    reviewerRef: row.reviewer_ref,
    verdict: row.verdict,
    alternativeExplanations: JSON.parse(row.alternative_explanations_json) as string[],
    unresolvedGaps: JSON.parse(row.unresolved_gaps_json) as string[],
    completedAt: row.completed_at,
  };
}

function mapJob(row: JobRow): LocalResearchJob {
  return {
    id: row.id,
    dossierId: row.dossier_id,
    key: row.job_key,
    role: row.role,
    title: row.title,
    execution: row.execution,
    status: row.status,
    approvalRequired: row.approval_required === 1,
  };
}

function mapDraft(row: DraftRow): StoredDraft {
  return {
    id: row.id,
    dossierId: row.dossier_id,
    version: row.version,
    status: row.status,
    title: row.title,
    markdown: row.body_markdown,
    createdBy: row.created_by,
    createdAt: row.created_at,
    approvedAt: row.approved_at ?? undefined,
  };
}

function mapRetentionItem(row: RetentionItemRow): LocalRetentionItem {
  return {
    id: row.id,
    dossierId: row.dossier_id,
    category: row.category,
    triggerAt: row.trigger_at,
    deadlineAt: row.deadline_at,
    storageLocations: parseStringArray(row.storage_locations_json, "retention storage locations"),
    status: row.status,
    holdReason: row.hold_reason ?? undefined,
    holdReviewAt: row.hold_review_at ?? undefined,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDeletionRequest(row: DeletionRequestRow): LocalDeletionRequest {
  return {
    id: row.id,
    dossierId: row.dossier_id,
    status: row.status,
    categories: parseRetentionCategories(row.categories_json),
    reviewedAt: row.reviewed_at,
    requestedBy: row.requested_by,
    requestedAt: row.requested_at,
    rationale: row.rationale,
    decidedBy: row.decided_by ?? undefined,
    decidedAt: row.decided_at ?? undefined,
    decisionRationale: row.decision_rationale ?? undefined,
    executedBy: row.executed_by ?? undefined,
    executedAt: row.executed_at ?? undefined,
  };
}

function mapDeletionRegisterEntry(row: DeletionRegisterRow): DeletionRegisterEntry {
  return {
    id: row.id,
    dossierNumber: row.dossier_number,
    categories: parseRetentionCategories(row.categories_json),
    action: row.action,
    locations: parseStringArray(row.locations_json, "deletion locations"),
    deadlineAt: row.deadline_at,
    reviewedAt: row.reviewed_at,
    approvedBy: row.approved_by,
    executedBy: row.executed_by,
    completedAt: row.completed_at,
    previousHash: row.previous_hash ?? undefined,
    entryHash: row.entry_hash,
  };
}

function requireText(value: string, label: string): string {
  const result = value.trim();
  if (!result) throw new TypeError(`${label} must not be empty.`);
  return result;
}

function requireIsoDate(value: string, label: string): string {
  const result = new Date(value);
  if (Number.isNaN(result.getTime())) throw new TypeError(`${label} must be a valid timestamp.`);
  return result.toISOString();
}

function requireRetentionCategory(value: string): RetentionCategory {
  if (!RETENTION_CATEGORIES.has(value as RetentionCategory)) {
    throw new TypeError(`Unsupported retention category: ${value}`);
  }
  return value as RetentionCategory;
}

function sameOperatorReference(left: string, right: string): boolean {
  return left.trim().toLocaleLowerCase("en-US") === right.trim().toLocaleLowerCase("en-US");
}

function requireStringList(values: string[], label: string): string[] {
  const result = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  if (result.length === 0) throw new TypeError(`${label} must contain at least one item.`);
  if (result.length > 100) throw new TypeError(`${label} contains too many items.`);
  if (result.some((value) => value.length > 500)) throw new TypeError(`${label} contains an item that is too long.`);
  return result;
}

function parseStringArray(value: string, label: string): string[] {
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
    throw new Error(`Invalid ${label}.`);
  }
  return parsed;
}

function parseRetentionCategories(value: string): RetentionCategory[] {
  return parseStringArray(value, "retention categories").map(requireRetentionCategory);
}

function latestDate(values: string[]): string {
  if (values.length === 0) throw new Error("At least one retention deadline is required.");
  return values.map((value) => requireIsoDate(value, "retention.deadlineAt")).sort().at(-1)!;
}

function buildDeletionRegisterEntry(
  input: Omit<DeletionRegisterEntry, "previousHash" | "entryHash">,
  previousHash?: string,
): DeletionRegisterEntry {
  const payload = {
    id: requireText(input.id, "deletionRegister.id"),
    dossierNumber: requireText(input.dossierNumber, "deletionRegister.dossierNumber"),
    categories: input.categories.map(requireRetentionCategory),
    action: input.action,
    locations: requireStringList(input.locations, "deletionRegister.locations"),
    deadlineAt: requireIsoDate(input.deadlineAt, "deletionRegister.deadlineAt"),
    reviewedAt: requireIsoDate(input.reviewedAt, "deletionRegister.reviewedAt"),
    approvedBy: requireText(input.approvedBy, "deletionRegister.approvedBy"),
    executedBy: requireText(input.executedBy, "deletionRegister.executedBy"),
    completedAt: requireIsoDate(input.completedAt, "deletionRegister.completedAt"),
    previousHash: previousHash ?? null,
  };
  if (!/^[0-9]{7}$/.test(payload.dossierNumber)) {
    throw new TypeError("Deletion register dossier number must contain seven digits.");
  }
  if (!new Set(["deleted", "anonymised"]).has(payload.action)) {
    throw new TypeError("Deletion register action is invalid.");
  }
  if (previousHash && !/^[a-f0-9]{64}$/.test(previousHash)) {
    throw new TypeError("Deletion register previous hash is invalid.");
  }
  const entryHash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  return {
    ...input,
    ...payload,
    previousHash: previousHash ?? undefined,
    entryHash,
  };
}

function readDeletionRegisterFile(registerPath: string): DeletionRegisterEntry[] {
  if (!existsSync(registerPath)) return [];
  const content = readFileSync(registerPath, "utf8");
  if (!content.trim()) return [];
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line, index) => {
      try {
        return JSON.parse(line) as DeletionRegisterEntry;
      } catch {
        throw new Error(`Deletion register contains invalid JSON on line ${index + 1}.`);
      }
    });
}

function verifyDeletionRegisterFile(registerPath: string): {
  valid: boolean;
  entries: number;
  error?: string;
} {
  let entries: DeletionRegisterEntry[];
  try {
    entries = readDeletionRegisterFile(registerPath);
  } catch (error) {
    return { valid: false, entries: 0, error: error instanceof Error ? error.message : String(error) };
  }
  let previousHash: string | undefined;
  const ids = new Set<string>();
  for (const [index, entry] of entries.entries()) {
    try {
      if (ids.has(entry.id)) throw new Error(`Duplicate request ID at line ${index + 1}.`);
      ids.add(entry.id);
      const rebuilt = buildDeletionRegisterEntry(
        {
          id: entry.id,
          dossierNumber: entry.dossierNumber,
          categories: entry.categories,
          action: entry.action,
          locations: entry.locations,
          deadlineAt: entry.deadlineAt,
          reviewedAt: entry.reviewedAt,
          approvedBy: entry.approvedBy,
          executedBy: entry.executedBy,
          completedAt: entry.completedAt,
        },
        previousHash,
      );
      if ((entry.previousHash ?? undefined) !== previousHash) {
        throw new Error(`Broken previous hash at line ${index + 1}.`);
      }
      if (entry.entryHash !== rebuilt.entryHash) {
        throw new Error(`Hash mismatch at line ${index + 1}.`);
      }
      previousHash = entry.entryHash;
    } catch (error) {
      return {
        valid: false,
        entries: entries.length,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  return { valid: true, entries: entries.length };
}

function now(): string {
  return new Date().toISOString();
}

function mkdirPrivate(directory: string): void {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodPrivate(directory, 0o700);
}

function chmodPrivate(target: string, mode: number): void {
  try {
    chmodSync(target, mode);
  } catch {
    // Windows ACLs remain the controlling boundary; chmod is best-effort there.
  }
}
