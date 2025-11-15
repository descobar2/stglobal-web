// backend/server.js  (ESM)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import { ping, query } from "./models/db.js";
import authRoutes from "./routes/auth.js";
import consultationRoutes from "./routes/consultations.js";
import "./middlewares/passport.js"; // inicializa estrategias

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 4000);
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (FRONTEND_ORIGINS.includes("*") || FRONTEND_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    console.warn("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones + cookies
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET || "change_me",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Rutas de auth (Google, etc.)
app.use("/auth", authRoutes);
app.use("/consultations", consultationRoutes);

// Root + health
app.get("/", async (_req, res) => {
  const ok = await ping().catch(() => false);
  res.json({ api: "STGlobal API OK", db: ok ? "up" : "down" });
});

app.get("/health", async (_req, res) => {
  try {
    const dbOk = await ping();
    res.status(200).json({ status: "ok", db: dbOk ? "up" : "down", time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// Endpoints demo
app.get("/api/ping", (_req, res) => res.json({ message: "pong" }));
app.get("/api/time", async (_req, res) => {
  try {
    const rows = await query("SELECT NOW() AS server_time");
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 404
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

// Start
try {
  await ping();
  console.log("✅ DB connection OK");
} catch (e) {
  console.error("⚠️  DB connection failed:", e.message);
}
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
  console.log(`CORS origins: ${FRONTEND_ORIGINS.join(", ") || "none"}`);
});
