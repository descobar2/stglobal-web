import express from "express";
import { googleSignIn, me, logout, signup, login, updateProfile } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/requireauth.js";

const router = express.Router();

router.post("/google", googleSignIn);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, updateProfile);
router.post("/logout", logout);

export default router;
