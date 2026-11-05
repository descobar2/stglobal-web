/** Valida el contrato de fechas y duración para agendar o reagendar. */
export function parseConsultationWindow(payload) {
  const { start, end, duration } = payload || {};
  if (!start || !end || duration === undefined || duration === null) {
    return { ok: false, error: "Datos incompletos" };
  }
  if (!Number.isInteger(duration) || duration < 30 || duration > 180 || duration % 15 !== 0) {
    return { ok: false, error: "Duración inválida" };
  }
  const startAt = new Date(start);
  const endAt = new Date(end);
  if (!Number.isFinite(startAt.getTime()) || !Number.isFinite(endAt.getTime())) {
    return { ok: false, error: "Fechas inválidas" };
  }
  const elapsed = endAt.getTime() - startAt.getTime();
  if (elapsed <= 0 || elapsed !== duration * 60_000) {
    return { ok: false, error: "Intervalo y duración no coinciden" };
  }
  return { ok: true, startAt, endAt, duration };
}
