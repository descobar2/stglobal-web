import React from "react";

export default function AgendaPreview() {
  const img = "https://cdn.builder.io/api/v1/image/assets%2F639458cafda44e61bce3e43be597309c%2F866ac5038cc246b9887d610e6b10354b?format=webp&width=800";

  return (
    <div className="container py-6">
      <div className="mx-auto max-w-md md:hidden">
        <div className="rounded-xl border bg-card p-4 shadow">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5"/></svg>
            Schedule
          </h4>
          <p className="mt-2 text-xs text-muted-foreground">Vista móvil de agenda: selecciona fecha y horario.</p>
          <img src={img} alt="Agenda móvil preview" className="mt-3 w-full rounded-md border" />
        </div>
      </div>

      <div className="hidden md:block">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h4 className="text-lg font-semibold">Agenda de Consultorías (Vista previa)</h4>
          <p className="mt-2 text-sm text-muted-foreground">En móvil se muestra una interfaz optimizada para selección rápida de fecha y franjas horarias. En escritorio se habilitará calendario interactivo y panel lateral para horarios y confirmación.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-md border bg-background p-4">
              <p className="text-sm font-medium">Calendario</p>
              <div className="mt-3 h-32 rounded bg-muted/40" />
            </div>
            <div className="rounded-md border bg-background p-4">
              <p className="text-sm font-medium">Disponibilidad</p>
              <div className="mt-3 space-y-2">
                <div className="rounded-full bg-primary/10 px-3 py-1 text-sm inline-block">08:00 a.m. - 08:30 a.m.</div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-sm inline-block">10:00 a.m. - 10:30 a.m.</div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-sm inline-block">11:00 a.m. - 11:30 a.m.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
