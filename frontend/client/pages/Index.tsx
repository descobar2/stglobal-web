import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Shield, BrainCircuit, Cloud, ChevronRight, PlayCircle } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";

export default function Index() {
  useEffect(() => {
    document.title = "STGlobal · Ciberseguridad, Riesgos y Vulnerabilidades";
  }, []);

  return (
    <div>
      {/* Hero */}
      <section data-loc="home-hero" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.2),transparent_40%)]" />
        <div className="container pt-10 pb-12 md:pt-10 md:pb-20 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs text-muted-foreground">
              Consultora en ciberseguridad · On‑prem y nube
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
              Seguridad y Tecnología Global
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Adopción de buenas prácticas, gestión de riesgos tecnológicos y análisis de vulnerabilidades para proteger tu negocio y acelerar la confianza digital.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link to="/agenda" className="inline-flex items-center">
                  Agendar consultoría <ChevronRight className="ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/servicios">Ver servicios</Link>
              </Button>
            </div>
            <ul className="mt-6 grid gap-2 text-sm text-muted-foreground">
              {[
                "Marco de seguridad alineado a mejores prácticas",
                "Evaluaciones de riesgo y cumplimiento",
                "Pentesting y gestión de vulnerabilidades",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-xl border bg-card p-2 shadow-sm">
              <div className="h-full w-full rounded-lg bg-[conic-gradient(at_70%_20%,hsl(var(--primary)/0.2),transparent_30%,hsl(var(--accent)/0.2)_60%,transparent_80%)] flex items-center justify-center">
                <button className="group inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-2 text-sm shadow-sm">
                  <PlayCircle className="h-5 w-5 text-primary group-hover:scale-110 transition" />
                  Ver video de 60s
                </button>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden md:block rounded-lg border bg-background/80 p-4 backdrop-blur">
              <p className="text-xs text-muted-foreground">Confianza de equipos en banca, retail y tecnología</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="container py-16 md:py-24">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Servicios clave</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Portafolio orientado a resultados medibles y reducción de superficie de ataque.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link to="/servicios">Ver todos</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Shield className="h-5 w-5" />, title: "Gobierno y Buenas Prácticas",
              desc: "Diseño e implementación de políticas, controles y concientización."
            },
            {
              icon: <BrainCircuit className="h-5 w-5" />, title: "Gestión de Riesgos",
              desc: "Evaluación, priorización y planes de tratamiento alineados al negocio."
            },
            {
              icon: <Cloud className="h-5 w-5" />, title: "Vulnerabilidades y Nube",
              desc: "Pentesting, hardening y seguridad en proveedores cloud líderes."
            },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                {s.icon}
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <Button asChild variant="link" className="mt-1 px-0">
                <Link to="/servicios">Conocer más</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Confianza / logos */}
      <section className="py-10 border-y bg-muted/20">
        <div className="container flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-xs">
          <span>ISO 27001 ready</span>
          <span>OWASP aligned</span>
          <span>NIST CSF</span>
          <span>Azure · AWS · GCP</span>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="container py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Conversemos sobre tu seguridad</h2>
            <p className="mt-2 text-muted-foreground">
              Escríbenos y agenda una llamada exploratoria. Implementamos antispam y consentimiento explícito para cuidar tus datos.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold">Por qué STGlobal</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Enfoque colaborativo con el equipo del cliente.</li> 
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Enfoque integral: procesos, personas y tecnología.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Acompañamiento desde diagnóstico hasta remediación.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Metodologías alineadas a marcos internacionales.</li>  
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Reportes claros con hallazgos y recomendaciones accionables.</li>  
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Confidencialidad y ética profesional garantizadas.</li>  
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Actualización continua frente a nuevas amenazas y tecnologías.</li>  
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Soporte post-consultoría y seguimiento de mejoras.</li>  
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Equipo certificado y con experiencia internacional.</li> 
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Soluciones personalizadas según las necesidades del cliente.</li>  
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Compromiso con la mejora continua y la innovación.</li>  
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Reducción efectiva de riesgos y fortalecimiento de la seguridad.</li>
            </ul>
            <div className="mt-6">
              <Button asChild>
                <Link to="/agenda">Agendar consultoría</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
