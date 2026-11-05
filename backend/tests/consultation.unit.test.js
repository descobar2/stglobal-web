import test from "node:test";
import assert from "node:assert/strict";
import { parseConsultationWindow } from "../utils/consultation.js";

const start = "2026-11-10T10:00:00.000Z";
const end = "2026-11-10T10:30:00.000Z";

test("UT-01: acepta una ventana válida de 30 minutos", () => {
  const result = parseConsultationWindow({ start, end, duration: 30 });
  assert.equal(result.ok, true);
  assert.equal(result.startAt.toISOString(), start);
});
for (const [name, input] of [
  ["UT-02: rechaza cuerpo ausente", undefined],
  ["UT-03: rechaza inicio ausente", { end, duration: 30 }],
  ["UT-04: rechaza fin ausente", { start, duration: 30 }],
  ["UT-05: rechaza fecha inválida", { start: "nonsense", end, duration: 30 }],
  ["UT-06: rechaza fin anterior", { start: end, end: start, duration: 30 }],
  ["UT-07: rechaza duración negativa", { start, end, duration: -30 }],
  ["UT-08: rechaza duración fuera de múltiplos de 15", { start, end, duration: 31 }],
  ["UT-09: rechaza duración que no coincide con intervalo", { start, end, duration: 45 }],
  ["UT-10: rechaza duración en texto", { start, end, duration: "30" }],
  ["UT-11: rechaza duración >180", { start, end, duration: 195 }],
]) {
  test(name, () => assert.equal(parseConsultationWindow(input).ok, false));
}
test("UT-12: acepta intervalos válidos de 90 minutos", () => {
  assert.equal(parseConsultationWindow({
    start, end: "2026-11-10T11:30:00.000Z", duration: 90,
  }).ok, true);
});
