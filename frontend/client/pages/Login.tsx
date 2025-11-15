import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function notifyAuthChanged() {
    window.dispatchEvent(new Event("auth-changed"));
  }

  async function onGoogleSuccess(cred: CredentialResponse) {
    try {
      const id_token = cred.credential;
      if (!id_token) throw new Error("No se recibió credential de Google");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_token }),
      });

      if (!res.ok) throw new Error("Backend no autorizó");
      notifyAuthChanged();
      navigate("/profile"); // Redirigir a perfil después de login
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar sesión con Google");
    }
  }

  function onGoogleError() {
    console.error("Google Login error");
    alert("Error al iniciar sesión con Google");
  }
    
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Credenciales incorrectas");
      }
      notifyAuthChanged();
      navigate("/profile"); // Redirigir a perfil después de login
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-extrabold">Iniciar sesión</h1>
        <p className="mt-2 text-muted-foreground">Accede con correo o con tu cuenta de Google.</p>

        <div className="mt-6 rounded-xl border bg-card p-6">
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">Correo</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 rounded-md border px-3 py-2"
                placeholder="tucorreo@empresa.com"
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 rounded-md border px-3 py-2"
                placeholder="••••••••"
                required
                aria-required="true"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</Button>
              <Link to="/signup" className="text-sm text-primary underline">¿No tienes cuenta?</Link>
            </div>

            {/* Divider with centered "o" */}
            <div className="flex items-center gap-3 my-2">
              <span className="flex-1 h-px bg-muted" aria-hidden></span>
              <span className="text-sm text-muted-foreground">o</span>
              <span className="flex-1 h-px bg-muted" aria-hidden></span>
            </div>

            {/* Google login area: compact and centered */}
            <div className="grid gap-3 items-center justify-items-center">
              <div className="flex justify-center">
                <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
