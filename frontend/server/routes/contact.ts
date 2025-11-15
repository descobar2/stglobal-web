import { z } from "zod";
import type { RequestHandler } from "express";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  consent: z.boolean(),
  company: z.string().max(0).optional(), // honeypot
});

const submissions: { at: number; ip: string }[] = [];

export const handleContact: RequestHandler = (req, res) => {
  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { company } = parsed.data;
  if (company && company.length > 0) {
    return res.status(200).json({ ok: true }); // silently accept bots
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip || "";
  const now = Date.now();
  // naive rate limit: 1 per 30s per IP
  const windowMs = 30_000;
  const recent = submissions.filter((s) => s.ip === ip && now - s.at < windowMs).length;
  if (recent > 0) {
    return res.status(429).json({ error: "Too many requests" });
  }
  submissions.push({ ip, at: now });

  // Here you would enqueue an email/send to CRM. We just log for now.
  console.log("CONTACT_MESSAGE", {
    ip,
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    consent: parsed.data.consent,
    at: new Date().toISOString(),
  });

  return res.json({ ok: true });
};
