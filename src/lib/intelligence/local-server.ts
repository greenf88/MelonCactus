import { randomBytes, timingSafeEqual } from "node:crypto";
import http, { type IncomingMessage, type ServerResponse } from "node:http";

import {
  DossierRevisionConflictError,
  type LocalDossier,
  type LocalIntelligenceStore,
} from "./local-store";
import { renderLocalControlRoomPage } from "./local-web-ui";

const MAX_BODY_BYTES = 64 * 1024;
const SESSION_COOKIE = "mc_local_session";

export interface LocalControlRoomServerOptions {
  port?: number;
  mutationsEnabled?: boolean;
}

export interface LocalControlRoomServerHandle {
  url: string;
  accessUrl: string;
  port: number;
  closed: Promise<void>;
  stop(): Promise<void>;
}

export async function startLocalControlRoomServer(
  store: LocalIntelligenceStore,
  options: LocalControlRoomServerOptions = {},
): Promise<LocalControlRoomServerHandle> {
  const accessToken = randomBytes(32).toString("hex");
  const csrfToken = randomBytes(32).toString("hex");
  const mutationsEnabled = options.mutationsEnabled ?? false;
  let editMode = false;
  let notice: string | undefined;
  let port = options.port ?? 0;

  const server = http.createServer((request, response) => {
    void handle(request, response).catch((error: unknown) => {
      if (response.headersSent) {
        response.destroy();
        return;
      }
      const conflict = error instanceof DossierRevisionConflictError;
      const message =
        error instanceof UserInputError
          ? error.message
          : conflict
            ? "Dit dossier is intussen gewijzigd. De bewerking is niet opgeslagen; controleer de nieuwste versie en probeer opnieuw."
            : "Onverwachte lokale serverfout.";
      sendHtml(
        response,
        error instanceof UserInputError ? error.status : conflict ? 409 : 500,
        renderLocalControlRoomPage(store, {
          csrfToken,
          editMode,
          mutationsEnabled,
          error: message,
        }),
      );
    });
  });
  server.maxHeadersCount = 60;
  server.headersTimeout = 10_000;
  server.requestTimeout = 15_000;
  server.keepAliveTimeout = 5_000;

  const closed = new Promise<void>((resolve) => server.once("close", resolve));
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Local Control Room could not determine its loopback port.");
  }
  port = address.port;
  const origin = `http://127.0.0.1:${port}`;

  async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    if (!isLoopback(request.socket.remoteAddress)) {
      sendText(response, 403, "Loopback access only.");
      return;
    }
    if (request.headers.host !== `127.0.0.1:${port}`) {
      sendText(response, 421, "Unexpected host.");
      return;
    }

    const url = new URL(request.url ?? "/", origin);
    if (request.method === "GET" && url.searchParams.has("access")) {
      if (!safeEqual(url.searchParams.get("access") ?? "", accessToken)) {
        sendText(response, 401, "Invalid local access token.");
        return;
      }
      response.writeHead(303, {
        ...securityHeaders(),
        "Set-Cookie": `${SESSION_COOKIE}=${accessToken}; HttpOnly; SameSite=Strict; Path=/`,
        Location: "/",
      });
      response.end();
      return;
    }

    if (!safeEqual(readCookie(request.headers.cookie, SESSION_COOKIE) ?? "", accessToken)) {
      sendText(response, 401, "Open the one-time local access URL shown in the terminal.");
      return;
    }

    if (request.method === "GET") {
      if (url.pathname === "/favicon.ico") {
        response.writeHead(204, securityHeaders());
        response.end();
        return;
      }
      if (url.pathname !== "/") {
        sendText(response, 404, "Not found.");
        return;
      }
      const currentNotice = notice;
      notice = undefined;
      sendHtml(
        response,
        200,
        renderLocalControlRoomPage(store, {
          csrfToken,
          editMode,
          mutationsEnabled,
          notice: currentNotice,
        }),
      );
      return;
    }

    if (request.method !== "POST") {
      response.writeHead(405, { ...securityHeaders(), Allow: "GET, POST" });
      response.end();
      return;
    }
    if (request.headers.origin !== origin) {
      throw new UserInputError("Ongeldige request-origin.", 403);
    }
    if (!request.headers["content-type"]?.toLowerCase().startsWith("application/x-www-form-urlencoded")) {
      throw new UserInputError("Alleen lokale formulierdata wordt geaccepteerd.", 415);
    }
    const fields = new URLSearchParams(await readBody(request));
    if (!safeEqual(fields.get("_csrf") ?? "", csrfToken)) {
      throw new UserInputError("Ongeldig of verlopen formulier-token.", 403);
    }

    if (url.pathname === "/edit-mode") {
      if (!mutationsEnabled) throw new UserInputError("Schrijfbewerkingen zijn niet voor deze opslaglocatie vrijgegeven.", 403);
      editMode = field(fields, "state", 3) === "on";
      notice = editMode ? "Edit-modus is lokaal geopend." : "Edit-modus is gesloten.";
      redirectHome(response);
      return;
    }

    requireEditMode(editMode, mutationsEnabled);
    if (url.pathname === "/dossiers/new") {
      const operatorRef = field(fields, "operatorRef", 200);
      const dossier = store.registerDossier({
        receivedAt: dateTimeField(fields, "receivedAt", true)!,
        decisionQuestion: field(fields, "decisionQuestion", 4_000),
        scope: {
          classification: oneOf(fields, "classification", [
            "restricted",
            "confidential",
            "public-only-test",
          ]),
          note: optionalField(fields, "scopeNote", 4_000),
          externalActionsAllowed: false,
        },
        actor: { type: "human", ref: operatorRef },
      });
      store.ensureResearchPlan(dossier.id, { type: "system", ref: "local-control-room" });
      notice = `Dossier ${dossier.dossierNumber} is lokaal geregistreerd.`;
      redirectHome(response);
      return;
    }

    const route = parseDossierRoute(url.pathname);
    if (!route) throw new UserInputError("Onbekende lokale formulieractie.", 404);
    const dossier = store.getDossier(route.dossierId);
    if (!dossier) throw new UserInputError("Dossier niet gevonden.", 404);
    const expectedRevision = integerField(fields, "_revision");

    store.withExpectedDossierRevision(dossier.id, expectedRevision, () => {
      if (route.action === "scope-approve") {
        store.approveScope({
          dossierId: dossier.id,
          decidedBy: field(fields, "decidedBy", 200),
          rationale: field(fields, "rationale", 1_000),
        });
        notice = `Scope van ${dossier.dossierNumber} is expliciet goedgekeurd.`;
      } else if (route.action === "complete-job") {
        const actorRef = "local-human-operator";
        store.updateResearchJobStatus({
          dossierId: dossier.id,
          jobKey: route.jobKey!,
          status: "completed",
          actor: { type: "human", ref: actorRef },
        });
        advanceDossierForJob(store, dossier, route.jobKey!, actorRef);
        notice = `Onderzoeksstap ${route.jobKey} is voltooid.`;
      } else if (route.action === "sources") {
        const sha256 = optionalField(fields, "sha256", 64);
        if (sha256 && !/^[a-f0-9]{64}$/i.test(sha256)) {
          throw new UserInputError("SHA-256 moet exact 64 hexadecimale tekens bevatten.");
        }
        store.addSource(
          dossier.id,
          {
            code: field(fields, "code", 60),
            title: field(fields, "title", 500),
            canonicalUrl: optionalHttpUrl(fields, "canonicalUrl"),
            publisher: optionalField(fields, "publisher", 300),
            sourceType: field(fields, "sourceType", 100),
            publishedAt: dateTimeField(fields, "publishedAt", false),
            retrievedAt: dateTimeField(fields, "retrievedAt", true)!,
            sha256: sha256?.toLowerCase(),
          },
          { type: "human", ref: "local-source-operator" },
        );
        notice = `Bron is aan ${dossier.dossierNumber} toegevoegd.`;
      } else if (route.action === "evidence") {
        store.addEvidence(
          dossier.id,
          {
            sourceId: field(fields, "sourceId", 100),
            code: field(fields, "code", 60),
            observation: field(fields, "observation", 8_000),
            locator: optionalField(fields, "locator", 1_000),
            observedAt: dateTimeField(fields, "observedAt", false),
          },
          { type: "human", ref: "local-evidence-operator" },
        );
        notice = `Bewijsstuk is aan ${dossier.dossierNumber} toegevoegd.`;
      } else if (route.action === "findings") {
        const createdBy = field(fields, "createdBy", 200);
        store.addFinding(
          dossier.id,
          {
            code: field(fields, "code", 60),
            statement: field(fields, "statement", 8_000),
            type: oneOf(fields, "type", ["observation", "assessment", "inference", "unknown"]),
            confidence: oneOf(fields, "confidence", ["high", "moderate", "low", "unknown"]),
            rationale: field(fields, "rationale", 12_000),
            material: oneOf(fields, "material", ["yes", "no"]) === "yes",
            createdBy,
            status: oneOf(fields, "status", [
              "proposed",
              "evidence_linked",
              "red_teamed",
              "verified",
              "rejected",
            ]),
            contradictionResolution: optionalField(fields, "contradictionResolution", 8_000),
            informationGaps: lines(fields, "informationGaps", 100, 8_000),
          },
          { type: "human", ref: createdBy },
        );
        notice = `Bevinding is aan ${dossier.dossierNumber} toegevoegd.`;
      } else if (route.action === "links") {
        store.linkEvidence(
          dossier.id,
          field(fields, "findingId", 100),
          field(fields, "evidenceId", 100),
          oneOf(fields, "direction", ["supports", "contradicts", "context"]),
          { type: "human", ref: "local-evidence-operator" },
        );
        notice = `Bewijskoppeling is in ${dossier.dossierNumber} opgeslagen.`;
      } else if (route.action === "reviews") {
        const reviewerRef = field(fields, "reviewerRef", 200);
        store.addVerificationReview(
          dossier.id,
          {
            findingId: field(fields, "findingId", 100),
            reviewType: oneOf(fields, "reviewType", ["source_verification", "red_team", "qa"]),
            reviewerKind: "human",
            reviewerRef,
            verdict: oneOf(fields, "verdict", ["pass", "qualified", "inconclusive", "reject"]),
            confidenceBefore: oneOf(fields, "confidenceBefore", ["high", "moderate", "low", "unknown"]),
            confidenceAfter: oneOf(fields, "confidenceAfter", ["high", "moderate", "low", "unknown"]),
            alternativeExplanations: lines(fields, "alternatives", 100, 8_000),
            unresolvedGaps: lines(fields, "unresolvedGaps", 100, 8_000),
            notes: optionalField(fields, "notes", 12_000),
            completedAt: new Date().toISOString(),
          },
          { type: "human", ref: reviewerRef },
        );
        notice = `Onafhankelijke review is in ${dossier.dossierNumber} opgeslagen.`;
      } else if (route.action === "drafts") {
        const createdBy = field(fields, "createdBy", 200);
        const draft = store.createDraft({
          dossierId: dossier.id,
          title: field(fields, "title", 300),
          createdBy,
          actor: { type: "human", ref: createdBy },
        });
        store.exportLatestDraft(dossier.id);
        notice = `Conceptversie ${draft.version} is lokaal aangemaakt (${draft.status}).`;
      } else if (route.action === "report-approve") {
        store.approveDraft({
          dossierId: dossier.id,
          draftId: field(fields, "draftId", 100),
          decidedBy: field(fields, "decidedBy", 200),
          rationale: field(fields, "rationale", 1_000),
        });
        notice = `Rapport van ${dossier.dossierNumber} is lokaal goedgekeurd; niets is verzonden.`;
      } else if (route.action === "retention-items") {
        const createdBy = field(fields, "createdBy", 200);
        asRetentionUserInput(() =>
          store.addRetentionItem(
            dossier.id,
            {
              category: oneOf(fields, "category", [
                "enquiry_not_converted",
                "non_fiscal_correspondence",
                "research_working_files",
                "final_report",
                "fiscal_record",
                "legal_claim",
              ]),
              triggerAt: dateTimeField(fields, "triggerAt", true)!,
              deadlineAt: dateTimeField(fields, "deadlineAt", true)!,
              storageLocations: lines(fields, "storageLocations", 100, 8_000),
              createdBy,
            },
            { type: "human", ref: createdBy },
          ),
        );
        notice = `Bewaarcategorie is voor ${dossier.dossierNumber} vastgelegd; niets is verwijderd.`;
      } else if (route.action === "retention-hold") {
        asRetentionUserInput(() =>
          store.placeRetentionHold({
            dossierId: dossier.id,
            retentionItemId: field(fields, "retentionItemId", 100),
            reason: field(fields, "reason", 1_000),
            nextReviewAt: dateTimeField(fields, "nextReviewAt", true)!,
            placedBy: field(fields, "placedBy", 200),
          }),
        );
        notice = `Juridische hold is voor ${dossier.dossierNumber} geplaatst; verwijdering is geblokkeerd.`;
      } else if (route.action === "retention-release") {
        asRetentionUserInput(() =>
          store.releaseRetentionHold({
            dossierId: dossier.id,
            retentionItemId: field(fields, "retentionItemId", 100),
            rationale: field(fields, "rationale", 1_000),
            releasedBy: field(fields, "releasedBy", 200),
          }),
        );
        notice = `Juridische hold is voor ${dossier.dossierNumber} vrijgegeven.`;
      } else if (route.action === "deletion-propose") {
        asRetentionUserInput(() =>
          store.proposeDossierDeletion({
            dossierId: dossier.id,
            reviewedAt: dateTimeField(fields, "reviewedAt", true)!,
            requestedBy: field(fields, "requestedBy", 200),
            rationale: field(fields, "rationale", 1_000),
          }),
        );
        notice = `Verwijdervoorstel voor ${dossier.dossierNumber} is vastgelegd; er is nog niets verwijderd.`;
      } else if (route.action === "deletion-approve") {
        asRetentionUserInput(() =>
          store.approveDossierDeletion({
            dossierId: dossier.id,
            requestId: field(fields, "requestId", 100),
            decidedBy: field(fields, "decidedBy", 200),
            rationale: field(fields, "rationale", 1_000),
          }),
        );
        notice = `Verwijdervoorstel voor ${dossier.dossierNumber} is onafhankelijk goedgekeurd; er is nog niets verwijderd.`;
      } else if (route.action === "deletion-execute") {
        asRetentionUserInput(() =>
          store.executeApprovedDeletion({
            dossierId: dossier.id,
            requestId: field(fields, "requestId", 100),
            executedBy: field(fields, "executedBy", 200),
            confirmation: field(fields, "confirmation", 40),
          }),
        );
        notice = `Dossierinhoud van ${dossier.dossierNumber} is lokaal verwijderd. Minimale metadata, auditgegevens en het verwijderregister zijn behouden; niets is extern verzonden.`;
      }
    });
    redirectHome(response);
  }

  return {
    url: origin,
    accessUrl: `${origin}/?access=${accessToken}`,
    port,
    closed,
    stop: async () => {
      if (!server.listening) return;
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    },
  };
}

function parseDossierRoute(pathname: string):
  | { dossierId: string; action: string; jobKey?: string }
  | undefined {
  const job = /^\/dossiers\/([^/]+)\/jobs\/([^/]+)\/complete$/.exec(pathname);
  if (job) return { dossierId: decodeURIComponent(job[1]), action: "complete-job", jobKey: decodeURIComponent(job[2]) };
  const standard = /^\/dossiers\/([^/]+)\/(scope-approve|sources|evidence|findings|links|reviews|drafts|report-approve|retention-items|retention-hold|retention-release|deletion-propose|deletion-approve|deletion-execute)$/.exec(
    pathname,
  );
  return standard ? { dossierId: decodeURIComponent(standard[1]), action: standard[2] } : undefined;
}

function advanceDossierForJob(
  store: LocalIntelligenceStore,
  dossier: LocalDossier,
  jobKey: string,
  actorRef: string,
): void {
  const order: LocalDossier["status"][] = [
    "registered",
    "scoped",
    "researching",
    "reviewing",
    "drafted",
    "closed",
  ];
  const desired: LocalDossier["status"] = ["red-team", "analysis", "report", "qa"].includes(jobKey)
    ? "reviewing"
    : "researching";
  if (order.indexOf(desired) > order.indexOf(dossier.status)) {
    store.updateDossierStatus(dossier.id, desired, { type: "human", ref: actorRef });
  }
}

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let length = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    length += buffer.length;
    if (length > MAX_BODY_BYTES) throw new UserInputError("Formulier is groter dan 64 KiB.", 413);
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function field(fields: URLSearchParams, name: string, maxLength: number): string {
  const value = fields.get(name)?.trim() ?? "";
  if (!value) throw new UserInputError(`${name} is verplicht.`);
  if (value.length > maxLength) throw new UserInputError(`${name} is te lang.`);
  return value;
}

function integerField(fields: URLSearchParams, name: string): number {
  const value = field(fields, name, 20);
  if (!/^[1-9]\d*$/.test(value)) throw new UserInputError(`${name} is geen geldige versie.`);
  const result = Number(value);
  if (!Number.isSafeInteger(result)) throw new UserInputError(`${name} is geen geldige versie.`);
  return result;
}

function optionalField(fields: URLSearchParams, name: string, maxLength: number): string | undefined {
  const value = fields.get(name)?.trim() ?? "";
  if (value.length > maxLength) throw new UserInputError(`${name} is te lang.`);
  return value || undefined;
}

function oneOf<const T extends string>(fields: URLSearchParams, name: string, values: readonly T[]): T {
  const value = field(fields, name, 100);
  if (!values.includes(value as T)) throw new UserInputError(`${name} heeft een ongeldige waarde.`);
  return value as T;
}

function lines(fields: URLSearchParams, name: string, maxItems: number, maxLength: number): string[] {
  const value = optionalField(fields, name, maxLength);
  if (!value) return [];
  const items = value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (items.length > maxItems) throw new UserInputError(`${name} bevat te veel regels.`);
  return items;
}

function dateTimeField(fields: URLSearchParams, name: string, required: boolean): string | undefined {
  const value = required ? field(fields, name, 100) : optionalField(fields, name, 100);
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new UserInputError(`${name} is geen geldige datum.`);
  return date.toISOString();
}

function optionalHttpUrl(fields: URLSearchParams, name: string): string | undefined {
  const value = optionalField(fields, name, 2_000);
  if (!value) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new UserInputError(`${name} is geen geldige URL.`);
  }
  if (!new Set(["http:", "https:"]).has(parsed.protocol)) {
    throw new UserInputError(`${name} moet http of https gebruiken.`);
  }
  return parsed.toString();
}

function requireEditMode(editMode: boolean, mutationsEnabled: boolean): void {
  if (!mutationsEnabled) throw new UserInputError("Schrijfbewerkingen zijn niet vrijgegeven.", 403);
  if (!editMode) throw new UserInputError("Open eerst expliciet de lokale edit-modus.", 403);
}

function asRetentionUserInput<T>(work: () => T): T {
  try {
    return work();
  } catch (error) {
    if (error instanceof UserInputError || error instanceof DossierRevisionConflictError) throw error;
    if (error instanceof Error) throw new UserInputError(translateRetentionError(error.message));
    throw error;
  }
}

function translateRetentionError(message: string): string {
  if (message.includes("blocked by a legal hold")) {
    return "Verwijdering is geblokkeerd door een legal hold.";
  }
  if (message.includes("different human reviewer")) {
    return "Verwijdering moet door een andere menselijke beoordelaar worden goedgekeurd.";
  }
  if (message.includes("exactly match the dossier number")) {
    return "De bevestiging moet exact overeenkomen met het dossiernummer.";
  }
  if (message.includes("deadline has not passed")) {
    return "De bewaartermijn is nog niet verstreken.";
  }
  return message;
}

function redirectHome(response: ServerResponse): void {
  response.writeHead(303, { ...securityHeaders(), Location: "/" });
  response.end();
}

function sendHtml(response: ServerResponse, status: number, html: string): void {
  response.writeHead(status, {
    ...securityHeaders(),
    "Content-Type": "text/html; charset=utf-8",
  });
  response.end(html);
}

function sendText(response: ServerResponse, status: number, body: string): void {
  response.writeHead(status, {
    ...securityHeaders(),
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end(body);
}

function securityHeaders(): Record<string, string> {
  return {
    "Cache-Control": "no-store, max-age=0",
    "Content-Security-Policy":
      "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}

function readCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const entry of header.split(";")) {
    const index = entry.indexOf("=");
    if (index < 0) continue;
    if (entry.slice(0, index).trim() === name) return entry.slice(index + 1).trim();
  }
  return undefined;
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isLoopback(address: string | undefined): boolean {
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

class UserInputError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}
