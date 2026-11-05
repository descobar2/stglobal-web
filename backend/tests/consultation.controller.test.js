import test from "node:test";
import assert from "node:assert/strict";
import Model from "../models/consultationModel.js";
import {
  createConsultation, listConsultations, rescheduleConsultation,
} from "../controllers/consultationController.js";

const start = "2026-11-10T10:00:00.000Z";
const end = "2026-11-10T10:30:00.000Z";
function response() {
  const res = {
    code: 200, body: null,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
  return res;
}
function record(status = "confirmed") {
  return { id: 4, userId: 7, startAt: start, endAt: end, duration: 30, status };
}

test("CU-01: crear consulta valida el contrato antes de escribir", async (t) => {
  const stub = t.mock.method(Model, "create", async () => record());
  const res = response();
  await createConsultation({ user: { uid: 7 }, body: { start, end, duration: 30 } }, res);
  assert.equal(res.code, 201);
  assert.equal(res.body.consultation.userId, 7);
  assert.equal(stub.mock.callCount(), 1);
});
test("CU-02: inicio posterior al fin no toca persistencia", async (t) => {
  const stub = t.mock.method(Model, "create", async () => record());
  const res = response();
  await createConsultation({ user: { uid: 7 }, body: { start: end, end: start, duration: 30 } }, res);
  assert.equal(res.code, 400);
  assert.equal(stub.mock.callCount(), 0);
});
test("CU-03: usuario inexistente no crea consultas", async (t) => {
  const stub = t.mock.method(Model, "create", async () => record());
  const res = response();
  await createConsultation({ body: { start, end, duration: 30 } }, res);
  assert.equal(res.code, 401);
  assert.equal(stub.mock.callCount(), 0);
});
test("CU-04: consulta ajena no se filtra al reagendar", async (t) => {
  t.mock.method(Model, "updateById", async () => null);
  const res = response();
  await rescheduleConsultation({ user: { uid: 8 }, params: { id: "4" },
    body: { start, end, duration: 30 } }, res);
  assert.equal(res.code, 404);
  assert.equal(res.body.consultation, undefined);
});
test("CU-05: un id no numérico se rechaza antes de consultar", async (t) => {
  const stub = t.mock.method(Model, "updateById", async () => record());
  const res = response();
  await rescheduleConsultation({ user: { uid: 7 }, params: { id: "abc" },
    body: { start, end, duration: 30 } }, res);
  assert.equal(res.code, 400);
  assert.equal(stub.mock.callCount(), 0);
});
test("CU-06: actualización propia devuelve la consulta", async (t) => {
  t.mock.method(Model, "updateById", async () => record());
  const res = response();
  await rescheduleConsultation({ user: { uid: 7 }, params: { id: "4" },
    body: { start, end, duration: 30 } }, res);
  assert.equal(res.code, 200);
  assert.equal(res.body.consultation.id, 4);
});
test("CU-07: clasifica confirmadas e históricas", async (t) => {
  const completed = t.mock.method(Model, "markCompleted", async () => {});
  t.mock.method(Model, "listByUser", async () => [record(), record("completed")]);
  const res = response();
  await listConsultations({ user: { uid: 7 } }, res);
  assert.equal(res.body.scheduled.length, 1);
  assert.equal(res.body.history.length, 1);
  assert.equal(completed.mock.callCount(), 1);
});
test("CU-08: fallos de DB producen 500 sin información interna", async (t) => {
  t.mock.method(Model, "create", async () => { throw Error("secret db error"); });
  const res = response();
  const log = t.mock.method(console, "error", () => {});
  await createConsultation({ user: { uid: 7 }, body: { start, end, duration: 30 } }, res);
  assert.equal(res.code, 500);
  assert.doesNotMatch(JSON.stringify(res.body), /secret db error/);
  assert.equal(log.mock.callCount(), 1);
});
