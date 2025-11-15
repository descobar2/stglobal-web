import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Placeholder({ title, description }: { title: string; description?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.1),transparent_40%)]" />
      <div className="container py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-3 text-muted-foreground">
            {description || "Esta sección estará disponible pronto. ¿Quieres que la construyamos ahora?"}
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild>
              <Link to="/agenda">Agendar consultoría</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
