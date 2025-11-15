import { useEffect, useState } from "react";
import CaseStudyCard from "@/components/CaseStudyCard";
import MediaModal from "@/components/MediaModal";
import { Button } from "@/components/ui/button";

export default function Experiencia() {
  useEffect(() => {
    document.title = "Experiencia · STGlobal";
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [video, setVideo] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  const studies = [
    {
      title: "Seguridad en plataforma bancaria",
      summary: "Reducción de vulnerabilidades críticas en una plataforma transaccional con alta disponibilidad.",
      image: "/placeholder.svg",
      tags: ["Fintech", "Alta disponibilidad"],
      video: "https://www.youtube.com/embed/ysz5S6PUM-U",
      report: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      title: "Hardening de infraestructura cloud",
      summary: "Mejoramos la postura de seguridad en la nube para una compañía de retail con múltiples proveedores.",
      image: "/placeholder.svg",
      tags: ["Retail", "Cloud"],
      video: "https://www.youtube.com/embed/ysz5S6PUM-U",
      report: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      title: "Programa de concienciación y gobernanza",
      summary: "Implementación de políticas, playbooks y formación para equipos técnicos y de negocio.",
      image: "/placeholder.svg",
      tags: ["Gobierno", "Formación"],
      video: undefined,
      report: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ];

  function openVideo(v?: string, t?: string) {
    setVideo(v);
    setTitle(t);
    setModalOpen(true);
  }

  return (
    <div>
      <section className="container py-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-extrabold">Experiencia & Casos de éxito</h1>
          <p className="mt-3 text-muted-foreground">Casos reales que muestran nuestro enfoque técnico y resultados medibles.</p>
        </div>
      </section>

      <section className="container py-6">
        <div className="grid gap-6 md:grid-cols-3">
          {studies.map((s) => (
            <CaseStudyCard
              key={s.title}
              title={s.title}
              summary={s.summary}
              image={s.image}
              tags={s.tags}
              videoUrl={s.video}
              reportUrl={s.report}
              onOpen={(v) => openVideo(v, s.title)}
            />
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="rounded-xl border bg-card p-6 flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">¿Quieres ver más casos o solicitar un piloto?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Contáctanos para obtener casos más específicos según tu sector y requerimientos.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <a href="/contacto">Contáctanos</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/agenda">Agendar evaluación</a>
            </Button>
          </div>
        </div>
      </section>

      <MediaModal open={modalOpen} onClose={() => setModalOpen(false)} videoUrl={video} title={title} />
    </div>
  );
}
