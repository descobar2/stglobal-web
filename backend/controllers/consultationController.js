import ConsultationModel from "../models/consultationModel.js";
import { parseConsultationWindow } from "../utils/consultation.js";

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
    if (!userId) return res.status(401).json({ error: "No autorizado" });
    const window = parseConsultationWindow(req.body);
    if (!window.ok) return res.status(400).json({ error: window.error });
    const { startAt, endAt, duration } = window;
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
    if (!userId) return res.status(401).json({ error: "No autorizado" });
    if (!/^[1-9][0-9]*$/.test(String(id))) return res.status(400).json({ error: "ID inválido" });
    const window = parseConsultationWindow(req.body);
    if (!window.ok) return res.status(400).json({ error: window.error });
    const { startAt, endAt, duration } = window;
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
