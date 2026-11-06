import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";

process.env.JWT_SECRET ||= "ci-secret-not-for-production";
process.env.COOKIE_NAME ||= "auth_token";
process.env.FRONTEND_ORIGIN ||= "http://localhost:5173";

async function withServer(run) {
  const server = createApp({ pingFn: async () => true }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const url = "http://127.0.0.1:" + server.address().port;
  try { await run(url); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}
async function request(base, path, method = "GET", body = null, cookie = null) {
  const res = await fetch(base + path, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json, cookie: res.headers.get("set-cookie")?.split(";")[0] };
}

test("IT-01: HTTP /api/ping, /health y 404", async () => {
  await withServer(async (base) => {
    assert.deepEqual((await request(base, "/api/ping")).json, { message: "pong" });
    assert.equal((await request(base, "/health")).status, 200);
    assert.equal((await request(base, "/inexistente")).status, 404);
  });
});
test("IT-02: API de consultorías sin cookie retorna 401", async () => {
  await withServer(async (base) => {
    assert.equal((await request(base, "/consultations")).status, 401);
    assert.equal((await request(base, "/auth/me")).status, 401);
  });
});
test("IT-03/04 y RG-01: CRUD de consultorías + aislamiento de usuarios en MariaDB", {
  skip: process.env.RUN_DB_TESTS !== "1" && "Requiere RUN_DB_TESTS=1 y MariaDB de pruebas",
}, async () => {
  await withServer(async (base) => {
    const seed = String(Date.now());
    async function signup(name) {
      const answer = await request(base, "/auth/signup", "POST", {
        name, email: name.toLowerCase() + seed + "@example.test", password: "testing-Secret-123",
      });
      assert.equal(answer.status, 201, JSON.stringify(answer.json));
      assert.ok(answer.cookie);
      return answer;
    }
    const a = await signup("ACS_A");
    const b = await signup("ACS_B");
    const start = new Date(Date.now() + 86_400_000).toISOString();
    const end = new Date(Date.parse(start) + 30 * 60_000).toISOString();
    const body = { start, end, duration: 30 };
    const created = await request(base, "/consultations", "POST", body, a.cookie);
    assert.equal(created.status, 201, JSON.stringify(created.json));
    const id = created.json.consultation.id;
    assert.equal((await request(base, "/consultations", "POST", {
      ...body, end: start,
    }, a.cookie)).status, 400);
    const listing = await request(base, "/consultations", "GET", null, a.cookie);
    assert.equal(listing.status, 200);
    assert.ok(listing.json.scheduled.some((item) => item.id === id));
    const denied = await request(base, "/consultations/" + id, "PATCH", body, b.cookie);
    assert.equal(denied.status, 404);
    assert.equal(denied.json.consultation, undefined);
    const foreignList = await request(base, "/consultations", "GET", null, b.cookie);
    assert.equal(foreignList.json.scheduled.length, 0);
    const updated = await request(base, "/consultations/" + id, "PATCH", body, a.cookie);
    assert.equal(updated.status, 200);
    assert.equal(updated.json.consultation.id, id);
    const profile = await request(base, "/auth/me", "GET", null, a.cookie);
    assert.equal(profile.status, 200);
  });
});

