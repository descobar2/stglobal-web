import { ReactElement, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

type Status = "checking" | "authorized" | "unauthorized";

interface ProtectedRouteProps {
  children: ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let active = true;

    async function validateSession() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!active) return;
        setStatus(res.ok ? "authorized" : "unauthorized");
      } catch (err) {
        console.error("No se pudo validar la sesión", err);
        if (active) setStatus("unauthorized");
      }
    }

    validateSession();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        Validando sesión…
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
