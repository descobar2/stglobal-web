import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Database, Search, ServerCog, ChevronRight, Download } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";

export default function Servicios() {
  useEffect(() => {
    document.title = "Servicios · STGlobal";
  }, []);

  const services = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Gobierno y Buenas Prácticas",
      desc: "Políticas, procedimientos y gobernanza para controlar riesgos y aumentar la resiliencia organizacional.",
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "Evaluación de Riesgos y Cumplimiento",
      desc: "Identificamos y priorizamos riesgos tecnológicos con recomendaciones ejecutables alineadas a marcos normativos.",
    },
    {
      icon: <ServerCog className="h-5 w-5" />,
      title: "Pentesting & Gestión de Vulnerabilidades",
      desc: "Pruebas de intrusión, triage y planes de remediación para reducir la superficie de ataque.",
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Seguridad en la Nube",
      desc: "Hardening, configuración segura y arquitectura defensiva para AWS, Azure y GCP.",
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-accent/6" />
        <div className="container py-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-extrabold">Servicios</h1>
            <p className="mt-3 text-muted-foreground">Explora nuestro portafolio de ciberseguridad diseñado para proteger activos críticos y asegurar continuidad de negocio.</p>
            <div className="mt-6 flex gap-3">
              <Button asChild size="lg">
                <Link to="/agenda">Agendar consultoría <ChevronRight className="ml-1" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contacto">Contáctanos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.title} icon={s.icon} title={s.title} description={s.desc} />
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold">Recursos y guías</h2>
            <p className="mt-2 text-muted-foreground">Descarga nuestras guías prácticas y plantillas para comenzar a mejorar tu postura de seguridad.</p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center justify-between gap-4 rounded-md border bg-card p-4">
                <div>
                  <p className="font-medium">Checklist: Harden de Infraestructura</p>
                  <p className="text-sm text-muted-foreground">Lista práctica para revisar configuraciones críticas en servidores y servicios cloud.</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <a href="/placeholder.pdf" target="_blank" rel="noreferrer"><Download className="mr-2" /> Descargar</a>
                </Button>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold">¿No estás seguro por dónde empezar?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Solicita una evaluación inicial de 60 minutos para identificar prioridades y oportunidades de mejora.</p>
            <div className="mt-4">
              <Button asChild>
                <Link to="/agenda">Solicitar evaluación</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t">
        <div className="container">
          <h3 className="text-xl font-semibold">Cómo trabajamos</h3>
          <ol className="mt-4 grid gap-4 md:grid-cols-3">
            <li className="rounded-lg border bg-card p-4">
              <p className="font-semibold">Diagnóstico</p>
              <p className="text-sm text-muted-foreground">Análisis de brechas y mapeo de riesgos.</p>
            </li>
            <li className="rounded-lg border bg-card p-4">
              <p className="font-semibold">Priorización</p>
              <p className="text-sm text-muted-foreground">Planes de acción con impacto medible.</p>
            </li>
            <li className="rounded-lg border bg-card p-4">
              <p className="font-semibold">Ejecución</p>
              <p className="text-sm text-muted-foreground">Implementación y seguimiento continuo.</p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
