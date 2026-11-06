import test from "node:test";
import assert from "node:assert/strict";
import { OAuth2Client } from "google-auth-library";
import { googleSignIn } from "../controllers/authController.js";

test("SEC-01: OAuth no registra tokens ni detalles no confiables", async (t) => {
  const maliciousToken = "forged-token\r\n[FAKE SUCCESS]";
  const maliciousError = "external error\r\n[FAKE SUCCESS]";
  t.mock.method(OAuth2Client.prototype, "verifyIdToken", async () => {
    throw new Error(maliciousError);
  });
  const info = t.mock.method(console, "info", () => {});
  const logs = t.mock.method(console, "log", () => {});
  const errors = t.mock.method(console, "error", () => {});
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };

  await googleSignIn({ body: { id_token: maliciousToken } }, res);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { error: "Unauthorized" });
  const output = [info, logs, errors]
    .flatMap((method) => method.mock.calls.flatMap((call) => call.arguments))
    .join(" ");
  assert.doesNotMatch(output, /forged-token|FAKE SUCCESS|external error/);
  assert.equal(errors.mock.callCount(), 1);
});
