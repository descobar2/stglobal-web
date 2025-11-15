import React from "react";
import { X } from "lucide-react";

export default function MediaModal({ open, onClose, videoUrl, title }: { open: boolean; onClose: () => void; videoUrl?: string; title?: string; }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between bg-card rounded-t-lg p-3 border">
          <h3 className="text-sm font-semibold">{title ?? "Reproduciendo"}</h3>
          <button aria-label="Cerrar" onClick={onClose} className="rounded-md p-1 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-black rounded-b-lg overflow-hidden aspect-video">
          {videoUrl ? (
            <iframe title={title} src={videoUrl} className="w-full h-full" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <div className="flex items-center justify-center h-full text-white">No hay video disponible</div>
          )}
        </div>
      </div>
    </div>
  );
}
