import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import consultationRoutes from "./routes/consultations.js";
import { ping, query } from "./models/db.js";

export function createApp({ pingFn = ping, queryFn = query } = {}) {
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in production");
  }
  const app = express();
  const origins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
    .split(",").map((item) => item.trim()).filter(Boolean);

  app.use(cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  }));
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session({
    secret: process.env.JWT_SECRET || "development-only-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" },
  }));

  app.use("/auth", authRoutes);
  app.use("/consultations", consultationRoutes);
  app.get("/", async (_req, res) => {
    const ok = await pingFn().catch(() => false);
    res.json({ api: "STGlobal API OK", db: ok ? "up" : "down" });
  });
  app.get("/health", async (_req, res) => {
    try {
      const ok = await pingFn();
      res.json({ status: "ok", db: ok ? "up" : "down", time: new Date().toISOString() });
    } catch {
      res.status(503).json({ status: "error" });
    }
  });
  app.get("/api/ping", (_req, res) => res.json({ message: "pong" }));
  app.get("/api/time", async (_req, res) => {
    try {
      const rows = await queryFn("SELECT NOW() AS server_time");
      res.json(rows[0]);
    } catch {
      res.status(503).json({ error: "Database unavailable" });
    }
  });
  app.use((_req, res) => res.status(404).json({ error: "Not Found" }));
  return app;
}
