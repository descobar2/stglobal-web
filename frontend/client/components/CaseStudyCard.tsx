import React from "react";
import { PlayCircle, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CaseStudyCard({
  title,
  summary,
  image,
  tags,
  videoUrl,
  reportUrl,
  onOpen,
}: {
  title: string;
  summary: string;
  image?: string;
  tags?: string[];
  videoUrl?: string;
  reportUrl?: string;
  onOpen?: (video?: string) => void;
}) {
  return (
    <article className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="relative rounded-md overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        {videoUrl && (
          <button
            aria-label={`Ver video de ${title}`}
            onClick={() => onOpen && onOpen(videoUrl)}
            className="absolute inset-0 m-auto flex h-12 w-44 items-center justify-center gap-2 rounded-full bg-background/80 backdrop-blur-sm text-sm shadow-md left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          >
            <PlayCircle className="h-5 w-5 text-primary" /> Ver video
          </button>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tags?.map((t) => (
            <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{t}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          {reportUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={reportUrl} target="_blank" rel="noreferrer"><Download className="mr-2" /> Descargar informe</a>
            </Button>
          )}
          {videoUrl && (
            <Button size="sm" onClick={() => onOpen && onOpen(videoUrl)}>
              <PlayCircle className="mr-2" /> Ver caso
            </Button>
          )}
          <Button asChild variant="ghost" size="sm">
            <a onClick={(e) => { e.preventDefault(); navigator.clipboard?.writeText(window.location.href + "#" + title.replace(/\s+/g, "-").toLowerCase()); }} href="#"> <Share2 className="mr-2" /> Compartir</a>
          </Button>
        </div>
      </div>
    </article>
  );
}
