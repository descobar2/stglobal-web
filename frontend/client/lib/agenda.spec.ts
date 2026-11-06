import { describe, expect, it } from "vitest";
import { generateSlots, canFitSlot } from "./agenda";

describe("FE-02: calendario de consultorías", () => {
  const date = new Date(2026, 10, 10);
  const slots = generateSlots(date);
  it("genera 14 horarios de 30 minutos entre mañana y tarde", () => {
    expect(slots).toHaveLength(14);
  });
  it("comienza a las 08:00", () => {
    expect(slots[0].time.getHours()).toBe(8);
    expect(slots[0].time.getMinutes()).toBe(0);
  });
  it("termina con el horario 17:30", () => {
    expect(slots[slots.length - 1]?.time.getHours()).toBe(17);
    expect(slots[slots.length - 1]?.time.getMinutes()).toBe(30);
  });
  it("no permite una cita de 90 minutos a las 11:30", () => {
    expect(canFitSlot(slots[7], 90)).toBe(false);
  });
  it("acepta una cita de 30 minutos a las 11:30", () => {
    expect(canFitSlot(slots[7], 30)).toBe(true);
  });
  it("no permite una cita de 60 minutos a las 17:30", () => {
    expect(canFitSlot(slots[slots.length - 1]!, 60)).toBe(false);
  });
  it("acepta una cita de 180 minutos a las 15:00", () => {
    expect(canFitSlot(slots[8], 180)).toBe(true);
  });
  it("rechaza duración negativa", () => {
    expect(canFitSlot(slots[0], -15)).toBe(false);
  });
  it("rechaza duración NaN", () => {
    expect(canFitSlot(slots[0], Number.NaN)).toBe(false);
  });
  it("respeta el día seleccionado", () => {
    expect(slots.every((slot) => slot.time.getDate() === 10)).toBe(true);
  });
});
