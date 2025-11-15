import express from "express";
import { createConsultation, listConsultations, rescheduleConsultation } from "../controllers/consultationController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", listConsultations);
router.post("/", createConsultation);
router.patch("/:id", rescheduleConsultation);

export default router;
