import { Link } from "react-router-dom";
import { Users, Flag, Award, Download, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Acerca() {
  useEffect(() => {
    document.title = "Acerca de STGlobal";
  }, []);

  return (
    <div>
      <section className="container py-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-extrabold">Acerca de STGlobal</h1>
          <p className="mt-4 text-muted-foreground">Somos una consultora especializada en ciberseguridad, enfocada en crear confianza digital mediante buenas prácticas, gestión de riesgos y remediación de vulnerabilidades en entornos on‑premises y nube.</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6">
            <Flag className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">Misión</h3>
            <p className="mt-2 text-sm text-muted-foreground">Ayudar a organizaciones a proteger sus activos críticos y reducir el riesgo operativo mediante controles técnicos, procesos y capacitación.</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">Visión</h3>
            <p className="mt-2 text-sm text-muted-foreground">Ser el socio de confianza para la transformación segura de infraestructura y servicios digitales en la región.</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <Award className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">Valores</h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>Integridad y transparencia</li>
              <li>Orientación a resultados</li>
              <li>Colaboración y aprendizaje continuo</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-8 md:grid-cols-2 items-start">
          <div>
            <h2 className="text-2xl font-semibold">Equipo</h2>
            <p className="mt-2 text-muted-foreground">Nuestro equipo combina experiencia en seguridad ofensiva, defensiva y gestión de riesgos. Combinamos pensamiento estratégico con ejecución técnica.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <p className="font-semibold">María López</p>
                <p className="text-sm text-muted-foreground">Directora de Consultoría — 12 años en seguridad aplicada</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <p className="font-semibold">Carlos Ruiz</p>
                <p className="text-sm text-muted-foreground">Líder de Pentesting — Ex‑ingeniero de infraestructuras en banca</p>
              </div>
            </div>
          </div>

          <aside className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold">Certificaciones & Partners</h3>
            <ul className="mt-3 text-sm text-muted-foreground space-y-2">
              <li>ISO 27001 (implementación & asesoría)</li>
              <li>Socio de arquitectura segura para AWS, Azure y GCP</li>
              <li>Alineado a NIST CSF y OWASP Top 10</li>
            </ul>
            <div className="mt-6">
              <Button asChild variant="outline">
                <a href="/company-brochure.pdf" target="_blank" rel="noreferrer"><Download className="mr-2" /> Descargar brochure</a>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-12 border-t">
        <div className="container">
          <h3 className="text-2xl font-semibold">Nuestro enfoque</h3>
          <p className="mt-3 text-muted-foreground">Adoptamos un enfoque pragmático: diagnóstico, priorización y ejecución con transferencias de conocimiento para que nuestros clientes queden en mejor posición para gestionar riesgos a largo plazo.</p>

          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            <li className="rounded-lg border bg-card p-4">
              <p className="font-semibold">1. Diagnóstico</p>
              <p className="text-sm text-muted-foreground">Mapeo de activos y evaluación de amenazas.</p>
            </li>
            <li className="rounded-lg border bg-card p-4">
              <p className="font-semibold">2. Priorización</p>
              <p className="text-sm text-muted-foreground">Planes de mitigación alineados al negocio.</p>
            </li>
            <li className="rounded-lg border bg-card p-4">
              <p className="font-semibold">3. Ejecución</p>
              <p className="text-sm text-muted-foreground">Remediación, pruebas y transferencia de conocimiento.</p>
            </li>
          </ol>

          <div className="mt-6 flex gap-3">
            <Button asChild>
              <Link to="/agenda">Agendar consultoría</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contacto">Contáctanos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="rounded-xl border bg-card p-6 text-center">
          <Globe className="mx-auto h-6 w-6 text-primary" />
          <h4 className="mt-3 font-semibold">Presencia y clientes</h4>
          <p className="mt-2 text-sm text-muted-foreground">Atendemos a empresas de distintos sectores: banca, retail, tecnología y servicios. Trabajamos con equipos técnicos y liderazgo para alinear seguridad y estrategia.</p>
        </div>
      </section>
    </div>
  );
}
