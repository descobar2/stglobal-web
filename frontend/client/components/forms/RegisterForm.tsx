import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const notifyAuthChanged = () => window.dispatchEvent(new Event("auth-changed"));

  function validateEmail(value: string) {
    return /^\S+@\S+\.\S+$/.test(value);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);

    if (!name.trim()) {
      setErrors("El nombre es requerido.");
      return;
    }
    if (!validateEmail(email)) {
      setErrors("Introduce un correo válido.");
      return;
    }
    if (password.length < 8) {
      setErrors("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrors("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo crear la cuenta.");
      }

      toast({ title: "Cuenta creada", description: "Tu cuenta fue creada exitosamente." });
      notifyAuthChanged();
      navigate("/profile");
    } catch (err) {
      setErrors(err instanceof Error ? err.message : "No se pudo crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="text-sm font-medium">Nombre</label>
      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="Tu nombre completo" />

      <label className="text-sm font-medium">Correo</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="tucorreo@empresa.com" />

      <label className="text-sm font-medium">Contraseña</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-md border px-3 py-2" placeholder="••••••••" />

      <label className="text-sm font-medium">Confirmar contraseña</label>
      <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-full rounded-md border px-3 py-2" placeholder="••••••••" />

      {errors && <div className="text-sm text-red-600">{errors}</div>}

      <Button type="submit" disabled={loading}>{loading ? 'Creando…' : 'Crear cuenta'}</Button>

      <div className="text-xs text-muted-foreground">Al registrarte aceptas nuestros términos y condiciones.</div>
    </form>
  );
}
