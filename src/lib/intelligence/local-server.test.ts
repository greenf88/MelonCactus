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
    expect(store.listResearchJobs(dossier.id)).toHaveLength(10);

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
});
