import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RegisterForm from "@/components/forms/RegisterForm";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Regístrate - STGlobal";
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Placeholder: implement actual signup flow (Supabase, Neon, etc.)
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-extrabold">Crear cuenta</h1>
        <p className="mt-2 text-muted-foreground">Regístrate con tu correo para comenzar.</p>

        <div className="mt-6 rounded-xl border bg-card p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
