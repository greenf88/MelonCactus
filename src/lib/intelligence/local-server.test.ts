import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  startLocalControlRoomServer,
  type LocalControlRoomServerHandle,
} from "./local-server";
import { LocalIntelligenceStore } from "./local-store";

describe("local Control Room server", () => {
  const stores: LocalIntelligenceStore[] = [];
  const servers: LocalControlRoomServerHandle[] = [];
  const directories: string[] = [];

  afterEach(async () => {
    for (const server of servers.splice(0)) await server.stop();
    for (const store of stores.splice(0)) store.close();
    for (const directory of directories.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  function createStore(): LocalIntelligenceStore {
    const directory = mkdtempSync(path.join(tmpdir(), "meloncactus-control-room-test-"));
    directories.push(directory);
    const store = new LocalIntelligenceStore(directory);
    stores.push(store);
    return store;
  }

  async function authenticate(server: LocalControlRoomServerHandle): Promise<string> {
    const response = await fetch(server.accessUrl, { redirect: "manual" });
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/");
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Strict");
    return setCookie!.split(";", 1)[0];
  }

  it("requires a one-time token and protects every local mutation", async () => {
    const store = createStore();
    const server = await startLocalControlRoomServer(store, {
      mutationsEnabled: true,
      port: 0,
    });
    servers.push(server);

    const unauthenticated = await fetch(server.url);
    expect(unauthenticated.status).toBe(401);

    const cookie = await authenticate(server);
    const initial = await fetch(server.url, { headers: { cookie } });
    const initialHtml = await initial.text();
    expect(initial.status).toBe(200);
    expect(initial.headers.get("cache-control")).toContain("no-store");
    expect(initial.headers.get("content-security-policy")).toContain("default-src 'none'");
    expect(initial.headers.get("x-frame-options")).toBe("DENY");
    expect(initialHtml).toContain("Alleen-lezen");
    expect(initialHtml).not.toContain("?access=");
    expect(initialHtml).not.toContain(new URL(server.accessUrl).searchParams.get("access"));

    const csrf = initialHtml.match(/name="_csrf" value="([a-f0-9]+)"/)?.[1];
    expect(csrf).toMatch(/^[a-f0-9]{64}$/);
    const formHeaders = {
      cookie,
      origin: server.url,
      "content-type": "application/x-www-form-urlencoded",
    };

    const editMode = await fetch(`${server.url}/edit-mode`, {
      method: "POST",
      headers: formHeaders,
      body: new URLSearchParams({ _csrf: csrf!, state: "on" }),
      redirect: "manual",
    });
    expect(editMode.status).toBe(303);

    const editingPage = await fetch(server.url, { headers: { cookie } });
    expect(await editingPage.text()).toContain("Edit-modus actief");

    const createDossier = await fetch(`${server.url}/dossiers/new`, {
      method: "POST",
      headers: formHeaders,
      body: new URLSearchParams({
        _csrf: csrf!,
        receivedAt: "2026-10-17T12:00",
        decisionQuestion: "Is dit lokale testdossier klaar voor veilig onderzoek?",
        classification: "public-only-test",
        scopeNote: "Uitsluitend synthetische testdata.",
        operatorRef: "test-human",
      }),
      redirect: "manual",
    });
    expect(createDossier.status).toBe(303);
    expect(store.getStatus().dossiers).toBe(1);
    const dossier = store.listDossiers()[0];
    expect(store.listResearchJobs(dossier.id)).toHaveLength(11);

    const currentPage = await fetch(server.url, { headers: { cookie } });
    const currentHtml = await currentPage.text();
    const revision = currentHtml.match(/name="_revision" value="(\d+)"/)?.[1];
    expect(revision).toBe(String(store.getDossierRevision(dossier.id)));
    expect(currentHtml).toContain("Dossierrevisie");
    const dossierForms = currentHtml.match(
      /<form[^>]+action="\/dossiers\/[^/\"]+\/[^\"]+"[\s\S]*?<\/form>/g,
    );
    expect(dossierForms?.length).toBeGreaterThan(0);
    expect(dossierForms?.every((form) => form.includes('name="_revision"'))).toBe(true);

    const firstSource = await fetch(`${server.url}/dossiers/${dossier.id}/sources`, {
      method: "POST",
      headers: formHeaders,
      body: new URLSearchParams({
        _csrf: csrf!,
        _revision: revision!,
        code: "SRC-HTTP-1",
        title: "Eerste synthetische bron",
        sourceType: "public_web",
        retrievedAt: "2026-10-17T12:30",
      }),
      redirect: "manual",
    });
    expect(firstSource.status).toBe(303);
    expect(store.getBundle(dossier.id).sources).toHaveLength(1);

    const staleSource = await fetch(`${server.url}/dossiers/${dossier.id}/sources`, {
      method: "POST",
      headers: formHeaders,
      body: new URLSearchParams({
        _csrf: csrf!,
        _revision: revision!,
        code: "SRC-HTTP-STALE",
        title: "Deze verouderde wijziging moet worden geweigerd",
        sourceType: "public_web",
        retrievedAt: "2026-10-17T12:31",
      }),
      redirect: "manual",
    });
    expect(staleSource.status).toBe(409);
    expect(await staleSource.text()).toContain("Dit dossier is intussen gewijzigd");
    expect(store.getBundle(dossier.id).sources).toHaveLength(1);

    const noCsrf = await fetch(`${server.url}/dossiers/new`, {
      method: "POST",
      headers: formHeaders,
      body: new URLSearchParams({ decisionQuestion: "Blocked" }),
      redirect: "manual",
    });
    expect(noCsrf.status).toBe(403);
    expect(store.getStatus().dossiers).toBe(1);
  });

  it("cannot leave read-only mode when mutations were not explicitly enabled", async () => {
    const store = createStore();
    const server = await startLocalControlRoomServer(store, {
      mutationsEnabled: false,
      port: 0,
    });
    servers.push(server);
    const cookie = await authenticate(server);
    const page = await fetch(server.url, { headers: { cookie } });
    const html = await page.text();

    expect(html).toContain("Alleen-lezen");
    expect(html).not.toContain("Edit-modus openen");

    const blocked = await fetch(`${server.url}/edit-mode`, {
      method: "POST",
      headers: {
        cookie,
        origin: server.url,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        _csrf: html.match(/name="_csrf" value="([a-f0-9]+)"/)?.[1] ?? "",
        state: "on",
      }),
      redirect: "manual",
    });
    expect(blocked.status).toBe(403);
    expect(store.getStatus().dossiers).toBe(0);
  });

  it("records a human finding decision through the private browser flow without delivery", async () => {
    const store = createStore();
    const dossier = store.registerDossier({
      receivedAt: "2099-10-17T10:00:00.000Z",
      decisionQuestion: "Can a fictional proposed finding pass the explicit browser approval gate?",
      scope: { classification: "fictional-test-data", externalActionsAllowed: false },
      actor: { type: "human", ref: "fixture-owner" },
    });
    const source = store.addSource(
      dossier.id,
      {
        code: "S-HTTP-APPROVAL",
        title: "Fictional approval source",
        sourceType: "synthetic_test",
        retrievedAt: "2099-10-17T10:05:00.000Z",
      },
      { type: "human", ref: "fixture-source-owner" },
    );
    const evidence = store.addEvidence(
      dossier.id,
      {
        sourceId: source.id,
        code: "E-HTTP-APPROVAL",
        observation: "A fictional observation supports the browser approval test.",
      },
      { type: "human", ref: "fixture-evidence-owner" },
    );
    const finding = store.addFinding(
      dossier.id,
      {
        code: "F-HTTP-APPROVAL",
        statement: "The fictional browser approval path is evidence-linked.",
        type: "assessment",
        confidence: "moderate",
        rationale: "This is a synthetic browser-flow fixture.",
        material: true,
        createdBy: "fixture-analyst",
        status: "proposed",
      },
      { type: "human", ref: "fixture-analyst" },
    );
    store.linkEvidence(dossier.id, finding.id, evidence.id, "supports", {
      type: "human",
      ref: "fixture-evidence-owner",
    });
    store.addVerificationReview(
      dossier.id,
      {
        findingId: finding.id,
        reviewType: "red_team",
        reviewerKind: "human",
        reviewerRef: "fixture-red-team",
        verdict: "qualified",
        confidenceBefore: "moderate",
        confidenceAfter: "moderate",
        alternativeExplanations: ["The fixture may cover only one browser path."],
        unresolvedGaps: [],
        completedAt: "2099-10-17T10:30:00.000Z",
      },
      { type: "human", ref: "fixture-red-team" },
    );

    const server = await startLocalControlRoomServer(store, { mutationsEnabled: true, port: 0 });
    servers.push(server);
    const cookie = await authenticate(server);
    const initialPage = await fetch(server.url, { headers: { cookie } });
    const initialHtml = await initialPage.text();
    const csrf = initialHtml.match(/name="_csrf" value="([a-f0-9]+)"/)?.[1];
    const headers = {
      cookie,
      origin: server.url,
      "content-type": "application/x-www-form-urlencoded",
    };
    await fetch(`${server.url}/edit-mode`, {
      method: "POST",
      headers,
      body: new URLSearchParams({ _csrf: csrf!, state: "on" }),
      redirect: "manual",
    });
    const decision = await fetch(`${server.url}/dossiers/${dossier.id}/finding-decision`, {
      method: "POST",
      headers,
      body: new URLSearchParams({
        _csrf: csrf!,
        _revision: String(store.getDossierRevision(dossier.id)),
        findingId: finding.id,
        decidedBy: "fixture-human-approver",
        decision: "approved",
        rationale: "Independent fictional human decision through the local Control Room.",
      }),
      redirect: "manual",
    });

    expect(decision.status).toBe(303);
    expect(store.getBundle(dossier.id).findings[0].status).toBe("verified");
    expect(store.listFindingApprovals(dossier.id)).toHaveLength(1);
  });

  it("enforces the hold, second-person approval, and exact confirmation in the browser flow", async () => {
    const store = createStore();
    const dossier = store.registerDossier({
      receivedAt: "2026-10-17T10:00:00.000Z",
      decisionQuestion: "Mag dit fictieve HTTP-testdossier volgens beleid worden verwijderd?",
      scope: { classification: "public-only-test", synthetic: true },
      actor: { type: "human", ref: "test-registrar" },
    });
    store.addSource(
      dossier.id,
      {
        code: "SRC-DELETE-HTTP",
        title: "Uitsluitend synthetische verwijdertest",
        sourceType: "synthetic_test",
        retrievedAt: "2026-10-17T10:05:00.000Z",
      },
      { type: "human", ref: "test-source-operator" },
    );

    const server = await startLocalControlRoomServer(store, { mutationsEnabled: true, port: 0 });
    servers.push(server);
    const cookie = await authenticate(server);
    const page = await fetch(server.url, { headers: { cookie } });
    const html = await page.text();
    const csrf = html.match(/name="_csrf" value="([a-f0-9]+)"/)?.[1];
    expect(csrf).toBeTruthy();
    const headers = {
      cookie,
      origin: server.url,
      "content-type": "application/x-www-form-urlencoded",
    };
    await fetch(`${server.url}/edit-mode`, {
      method: "POST",
      headers,
      body: new URLSearchParams({ _csrf: csrf!, state: "on" }),
      redirect: "manual",
    });

    const post = (action: string, values: Record<string, string>) =>
      fetch(`${server.url}/dossiers/${dossier.id}/${action}`, {
        method: "POST",
        headers,
        body: new URLSearchParams({
          _csrf: csrf!,
          _revision: String(store.getDossierRevision(dossier.id)),
          ...values,
        }),
        redirect: "manual",
      });

    expect(
      (await post("retention-items", {
        category: "research_working_files",
        triggerAt: "2020-01-01T00:00",
        deadlineAt: "2021-01-01T00:00",
        storageLocations: "synthetic-local-test-only",
        createdBy: "retention-owner",
      })).status,
    ).toBe(303);
    const retentionItem = store.listRetentionItems(dossier.id)[0];

    expect(
      (await post("retention-hold", {
        retentionItemId: retentionItem.id,
        reason: "Fictieve juridische controle",
        nextReviewAt: "2027-01-01T00:00",
        placedBy: "legal-reviewer",
      })).status,
    ).toBe(303);
    const heldProposal = await post("deletion-propose", {
      reviewedAt: "2026-10-17T12:00",
      requestedBy: "retention-owner",
      rationale: "Deadline verstreken in synthetische test",
    });
    expect(heldProposal.status).toBe(400);
    expect(await heldProposal.text()).toContain("geblokkeerd door een legal hold");

    expect(
      (await post("retention-release", {
        retentionItemId: retentionItem.id,
        rationale: "Fictieve controle afgerond",
        releasedBy: "legal-reviewer",
      })).status,
    ).toBe(303);
    expect(
      (await post("deletion-propose", {
        reviewedAt: "2026-10-17T12:00",
        requestedBy: "retention-owner",
        rationale: "Deadline verstreken in synthetische test",
      })).status,
    ).toBe(303);
    const request = store.listDeletionRequests(dossier.id)[0];

    const selfApproval = await post("deletion-approve", {
      requestId: request.id,
      decidedBy: "retention-owner",
      rationale: "Dit moet worden geweigerd",
    });
    expect(selfApproval.status).toBe(400);
    expect(await selfApproval.text()).toContain("andere menselijke beoordelaar");
    expect(
      (await post("deletion-approve", {
        requestId: request.id,
        decidedBy: "independent-reviewer",
        rationale: "Bewaartermijn en hold onafhankelijk gecontroleerd",
      })).status,
    ).toBe(303);

    const wrongConfirmation = await post("deletion-execute", {
      requestId: request.id,
      executedBy: "retention-executor",
      confirmation: "verkeerd nummer",
    });
    expect(wrongConfirmation.status).toBe(400);
    expect(await wrongConfirmation.text()).toContain("exact overeenkomen met het dossiernummer");
    expect(
      (await post("deletion-execute", {
        requestId: request.id,
        executedBy: "retention-executor",
        confirmation: dossier.dossierNumber,
      })).status,
    ).toBe(303);

    expect(store.getBundle(dossier.id).sources).toHaveLength(0);
    expect(store.getDossier(dossier.id)?.scope.retentionStatus).toBe("deleted");
    expect(store.verifyDeletionRegister()).toMatchObject({ valid: true, entries: 1 });
    const deletedPage = await fetch(server.url, { headers: { cookie } });
    const deletedHtml = await deletedPage.text();
    expect(deletedHtml).toContain("Alleen minimale metadata en de auditketen blijven bestaan");
    expect(deletedHtml).not.toContain(`/dossiers/${dossier.id}/sources`);
  });
});
