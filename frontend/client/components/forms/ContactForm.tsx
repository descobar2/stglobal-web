import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Correo inválido"),
  message: z.string().min(10, "Cuéntanos un poco más"),
  consent: z.literal(true, { errorMap: () => ({ message: "Requerimos tu consentimiento" }) }),
  // Honeypot
  company: z.string().max(0).optional(),
});

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
      consent: form.get("consent") === "on",
      company: String(form.get("company") || ""),
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Datos inválidos");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Error enviando mensaje");
      setSuccess("¡Mensaje enviado! Te escribiremos pronto.");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium" htmlFor="name">Nombre</label>
          <input id="name" name="name" className="mt-1 w-full rounded-md border bg-background px-3 py-2" placeholder="Tu nombre" />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" className="mt-1 w-full rounded-md border bg-background px-3 py-2" placeholder="tucorreo@empresa.com" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="message">Mensaje</label>
        <textarea id="message" name="message" className="mt-1 w-full rounded-md border bg-background px-3 py-2 min-h-32" placeholder="Cuéntanos sobre tus necesidades de ciberseguridad" />
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input name="consent" type="checkbox" className="mt-1" />
        <span>
          Acepto el tratamiento de mis datos según la política de privacidad y deseo ser contactado por STGlobal.
        </span>
      </label>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>{loading ? "Enviando…" : "Enviar mensaje"}</Button>
        {success && <span className="text-green-600 text-sm">{success}</span>}
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
    </form>
  );
}
