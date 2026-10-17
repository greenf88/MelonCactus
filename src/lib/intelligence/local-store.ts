import { randomUUID } from "node:crypto";
import {
  chmodSync,
  constants as fsConstants,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
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
    if (existingVersion && existingVersion !== String(LOCAL_SCHEMA_VERSION)) {
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

  updateDossierStatus(
    dossierId: string,
    status: LocalDossier["status"],
    actor: LocalActor,
  ): void {
    this.transaction(() => {
      const dossier = this.requireDossier(dossierId);
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
    const dossier = this.requireDossier(dossierId);
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
    const dossier = this.requireDossier(input.dossierId);
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
    this.requireDossier(dossierId);
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
    this.requireDossier(dossierId);
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
    this.requireDossier(dossierId);
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
      pendingHumanApprovals: this.count(
        "research_jobs",
        "where execution = 'human' and status = 'waiting_for_approval'",
      ),
      auditEvents: this.count("audit_events"),
    };
  }

  private requireDossier(idOrNumber: string): LocalDossier {
    const dossier = this.getDossier(idOrNumber);
    if (!dossier) throw new Error(`Dossier not found: ${idOrNumber}`);
    return dossier;
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
    const integrity = restored.verifyDatabase();
    if (!integrity.valid) throw new Error(`Restored database failed integrity check: ${integrity.message}`);
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
