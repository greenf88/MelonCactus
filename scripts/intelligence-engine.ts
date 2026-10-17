import path from "node:path";

import { writeLocalDashboard } from "../src/lib/intelligence/local-dashboard";
import { ensureFictionalDemo } from "../src/lib/intelligence/local-demo";
import { ensureFictionalDiscoveryDemo } from "../src/lib/intelligence/local-discovery-demo";
import { startLocalControlRoomServer } from "../src/lib/intelligence/local-server";
import {
  DEFAULT_LOCAL_HOME,
  LocalIntelligenceStore,
  restoreBackupToIsolatedHome,
} from "../src/lib/intelligence/local-store";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] ?? "help";
  const homeArgument = option(args, "--home");
  const home = path.resolve(homeArgument ?? DEFAULT_LOCAL_HOME);
  const confirmedPrivateStorage =
    command === "serve" && args.includes("--confirm-private-storage");
  if (confirmedPrivateStorage && !homeArgument) {
    throw new Error("Editing requires an explicit --home path outside this Git repository.");
  }
  if (confirmedPrivateStorage && pathInside(process.cwd(), home)) {
    throw new Error(
      "Editing is blocked because --home is inside the Git repository. Choose a private encrypted location.",
    );
  }
  const store = new LocalIntelligenceStore(home);

  try {
    if (command === "init") {
      printStatus(store);
      console.log("Local Control Room initialized. No network or cloud database was used.");
      return;
    }

    if (command === "demo") {
      const result = ensureFictionalDemo(store);
      const dashboardPath = writeLocalDashboard(store);
      const backupPath = await store.createBackup(
        `fictional-demo-${new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-")}`,
      );
      console.log(result.reused ? "Fictional dossier reused." : "Fictional dossier created.");
      console.log(`Dossier: ${result.dossier.dossierNumber}`);
      console.log(`Draft status: ${result.draftStatus}`);
      console.log(`Draft: ${result.draftPath}`);
      console.log(`Control Room: ${dashboardPath}`);
      console.log(`Audit chain: ${result.auditValid ? "valid" : "invalid"} (${result.auditEvents} events)`);
      console.log(`Backup: ${backupPath}`);
      console.log("Human approval is still pending; nothing was sent or published.");
      return;
    }

    if (command === "discovery-demo") {
      const result = await ensureFictionalDiscoveryDemo(store);
      console.log(result.reused ? "Fictional discovery run reused." : "Fictional discovery run completed.");
      console.log(`Dossier: ${result.dossier.dossierNumber}`);
      console.log(`Accepted source candidates: ${result.acceptedSources}`);
      console.log(`Rejected candidates: ${result.rejectedCandidates}`);
      console.log(`Normalised evidence records: ${result.normalisedEvidence}`);
      console.log(`Independent red-team reviews: ${result.redTeamReviews}`);
      console.log("Model use: none | Estimated model cost: EUR 0.000000");
      console.log("Discovery, normalisation and red team used offline fixtures in separated contexts.");
      console.log("No network, message or publication action occurred.");
      return;
    }

    if (command === "status") {
      printStatus(store);
      for (const dossier of store.listDossiers()) {
        const draft = store.getLatestDraft(dossier.id);
        console.log(
          `${dossier.dossierNumber} | ${dossier.status} | draft ${draft?.status ?? "none"} | ${dossier.decisionQuestion}`,
        );
      }
      return;
    }

    if (command === "serve") {
      const server = await startLocalControlRoomServer(store, {
        mutationsEnabled: confirmedPrivateStorage,
        port: numberOption(args, "--port") ?? 0,
      });
      const shutdown = (): void => {
        void server.stop();
      };
      process.once("SIGINT", shutdown);
      process.once("SIGTERM", shutdown);
      try {
        console.log(`Open the private Control Room: ${server.accessUrl}`);
        console.log(
          confirmedPrivateStorage
            ? `Editing can be enabled in the browser. Private storage: ${home}`
            : "Read-only mode. Restart with an explicit external --home and --confirm-private-storage to permit edits.",
        );
        console.log("Nothing is sent, published or exposed to the local network.");
        await server.closed;
      } finally {
        process.off("SIGINT", shutdown);
        process.off("SIGTERM", shutdown);
      }
      return;
    }

    if (command === "verify") {
      const integrity = store.verifyDatabase();
      console.log(`Database integrity: ${integrity.valid ? "valid" : "invalid"} (${integrity.message})`);
      const deletionRegister = store.verifyDeletionRegister();
      console.log(
        `Deletion register: ${deletionRegister.valid ? "valid" : "invalid"} (${deletionRegister.entries} entries)${deletionRegister.error ? ` — ${deletionRegister.error}` : ""}`,
      );
      let invalid = !integrity.valid || !deletionRegister.valid;
      for (const dossier of store.listDossiers()) {
        const audit = store.verifyAuditChain(dossier.id);
        console.log(
          `${dossier.dossierNumber} audit: ${audit.valid ? "valid" : "invalid"} (${audit.events} events)${audit.error ? ` — ${audit.error}` : ""}`,
        );
        invalid ||= !audit.valid;
      }
      if (invalid) process.exitCode = 1;
      return;
    }

    if (command === "backup") {
      console.log(`Backup: ${await store.createBackup()}`);
      return;
    }

    if (command === "dashboard") {
      console.log(`Control Room: ${writeLocalDashboard(store)}`);
      return;
    }

    if (command === "restore-check") {
      const backupPath = args[1];
      const target = option(args, "--target");
      if (!backupPath || !target) {
        throw new Error("Usage: restore-check <backup-file> --target <new-empty-directory>");
      }
      const result = restoreBackupToIsolatedHome(backupPath, target, store.deletionRegisterPath);
      console.log(`Isolated restore: ${result.databasePath}`);
      console.log(`Dossiers ${result.dossiers} | verified audit events ${result.auditEvents}`);
      console.log(`Reapplied deletion-register entries: ${result.reappliedDeletions}`);
      console.log("The active Control Room database was not replaced.");
      return;
    }

    if (command === "export") {
      const dossier = args[1];
      if (!dossier) throw new Error("Usage: export <dossier-number>");
      const record = store.getDossier(dossier);
      if (!record) throw new Error(`Dossier not found: ${dossier}`);
      console.log(`Export: ${store.exportLatestDraft(record.id)}`);
      return;
    }

    printHelp();
  } finally {
    store.close();
  }
}

function printStatus(store: LocalIntelligenceStore): void {
  const status = store.getStatus();
  console.log(`Database: ${status.databasePath}`);
  console.log(
    `Dossiers ${status.dossiers} | sources ${status.sources} | evidence ${status.evidence} (${status.normalisedEvidence} normalised) | findings ${status.findings} | agent runs ${status.agentRuns}`,
  );
  console.log(
    `Pending human approvals ${status.pendingHumanApprovals} | audit events ${status.auditEvents}`,
  );
}

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function numberOption(args: string[], name: string): number | undefined {
  const value = option(args, name);
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65_535) {
    throw new Error(`${name} must be a port between 0 and 65535.`);
  }
  return parsed;
}

function pathInside(parent: string, candidate: string): boolean {
  const relative = path.relative(path.resolve(parent), path.resolve(candidate));
  return (
    relative === "" ||
    (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}

function printHelp(): void {
  console.log(`MelonCactus local Intelligence Engine

Commands:
  init                  Create the private local database
  demo                  Create/reuse one entirely fictional dossier and draft
  discovery-demo        Run the bounded source-discovery agent on an offline fictional fixture
  status                Show local dossiers and workflow state
  serve                 Start the token-protected loopback Control Room
  verify                Verify SQLite integrity and every audit hash chain
  backup                Create a point-in-time database backup
  dashboard             Regenerate the private read-only HTML overview
  restore-check <file>  Restore into a new isolated directory and verify it
  export <number>       Export the latest internal Markdown draft

Options:
  --home <path>         Override the default .meloncactus-intelligence directory
  --port <number>       Override the random local port used by serve
  --confirm-private-storage
                        Permit browser edits after confirming --home is private and encrypted

No command sends, publishes, deploys, emails or changes a cloud database.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
