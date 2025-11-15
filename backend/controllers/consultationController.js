import ConsultationModel from "../models/consultationModel.js";

function toISO(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.userId,
    start: new Date(row.startAt).toISOString(),
    end: new Date(row.endAt).toISOString(),
    duration: row.duration,
    status: row.status,
    createdAt: row.createdAt,
  };
}

export const createConsultation = async (req, res) => {
  try {
    const userId = req.user?.uid;
    const { start, end, duration } = req.body || {};
    if (!userId || !start || !end || !duration) {
      return res.status(400).json({ error: "Faltan datos para agendar" });
    }
    const startAt = new Date(start);
    const endAt = new Date(end);
    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      return res.status(400).json({ error: "Fechas inválidas" });
    }
    const consultation = await ConsultationModel.create({
      userId,
      startAt,
      endAt,
      duration,
      status: "confirmed",
    });
    return res.status(201).json({ consultation: toISO(consultation) });
  } catch (err) {
    console.error("Create consultation error:", err);
    return res.status(500).json({ error: "No se pudo registrar la consultoría" });
  }
};

export const listConsultations = async (req, res) => {
  try {
    const userId = req.user?.uid;
    await ConsultationModel.markCompleted(userId);
    const records = await ConsultationModel.listByUser(userId);
    const scheduled = [];
    const history = [];
    records.forEach((row) => {
      if (row.status === "completed") {
        history.push(toISO(row));
      } else if (row.status === "confirmed") {
        scheduled.push(toISO(row));
      }
    });
    return res.json({ scheduled, history });
  } catch (err) {
    console.error("List consultations error:", err);
    return res.status(500).json({ error: "No se pudieron obtener las consultorías" });
  }
};

export const rescheduleConsultation = async (req, res) => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;
    const { start, end, duration } = req.body || {};
    if (!id || !start || !end || !duration) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    const startAt = new Date(start);
    const endAt = new Date(end);
    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      return res.status(400).json({ error: "Fechas inválidas" });
    }
    const updated = await ConsultationModel.updateById({
      id,
      userId,
      startAt,
      endAt,
      duration,
      status: "confirmed",
    });
    if (!updated) return res.status(404).json({ error: "Consultoría no encontrada" });
    return res.json({ consultation: toISO(updated) });
  } catch (err) {
    console.error("Reschedule consultation error:", err);
    return res.status(500).json({ error: "No se pudo re-agendar la consultoría" });
  }
};
