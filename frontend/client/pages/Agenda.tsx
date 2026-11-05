import { useEffect, useMemo, useState } from "react";
import { addDays, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, addMinutes } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { generateSlots, canFitSlot } from "@/lib/agenda";

const DURATIONS = [30, 45, 60, 75, 90];
const PENDING_KEY = "stglobal_consult_pending";
const RESCHEDULE_KEY = "stglobal_consult_reschedule";

export default function Agenda() {
  useEffect(() => {
    document.title = "Agenda · STGlobal";
  }, []);
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState(30);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // ISO string of start time
  const [submitting, setSubmitting] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weeks = useMemo(() => {
    const days: Date[] = [];
    for (let d = startDate; d <= endDate; d = addDays(d, 1)) days.push(d);
    const rows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    return rows;
  }, [startDate, endDate]);

  const slots = useMemo(() => (selectedDate ? generateSlots(selectedDate) : []), [selectedDate]);

  async function getSessionUser() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  }

  async function onConfirm() {
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    try {
      const user = await getSessionUser();
      if (!user) {
        navigate("/login", { state: { from: "/agenda" } });
        return;
      }

      const start = new Date(selectedSlot);
      const end = addMinutes(start, duration);
      const payload = {
        start: start.toISOString(),
        end: end.toISOString(),
        duration,
      };
      const rescheduleInfoRaw = localStorage.getItem(RESCHEDULE_KEY);
      if (rescheduleInfoRaw) {
        const rescheduleInfo = JSON.parse(rescheduleInfoRaw);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/consultations/${rescheduleInfo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("No se pudo re-agendar");
        localStorage.removeItem(RESCHEDULE_KEY);
        window.dispatchEvent(new Event("consultations-updated"));
        navigate("/profile", { state: { rescheduled: true } });
        return;
      }

      localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
      window.dispatchEvent(new Event("consultation-pending"));
      navigate("/profile", { state: { booked: true } });
    } catch (err) {
      console.error(err);
      alert("No se pudo procesar la consultoría");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container py-16">
      <div className="w-full max-w-full px-4">
        <h1 className="text-2xl font-extrabold">Agenda de Consultorías</h1>
        <p className="mt-2 text-muted-foreground">Selecciona una fecha, elige duración y confirma el horario. Recibirás correo de confirmación.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Calendar */}
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Prev month" onClick={() => setCurrentMonth((m) => subMonths(m, 1))} className="rounded-md p-2 hover:bg-accent">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button aria-label="Next month" onClick={() => setCurrentMonth((m) => addMonths(m, 1))} className="rounded-md p-2 hover:bg-accent">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 text-xs text-muted-foreground">
              {['M','T','W','T','F','S','S'].map((d, idx) => (
                <div key={idx} className="text-center py-1">{d}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
              {weeks.map((week, i) => (
                <div key={i} className="contents">
                  {week.map((day) => {
                    const disabled = !isSameMonth(day, monthStart);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedSlot(null);
                        }}
                        className={`h-10 w-full rounded-md p-1 text-center ${disabled ? 'text-muted-foreground' : isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                      >
                        <div className="text-xs">{format(day, 'd')}</div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Side panel: duration, slots */}
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Hora y disponibilidad</h3>
              <div className="text-sm text-muted-foreground">Duración</div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => setDuration((d) => Math.max(30, d - 15))} className="rounded-full bg-accent/10 px-3 py-1">-</button>
              <div className="rounded-md border px-3 py-2">{duration} min.</div>
              <button onClick={() => setDuration((d) => Math.min(180, d + 15))} className="rounded-full bg-accent/10 px-3 py-1">+</button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Disponibilidad para {selectedDate ? format(selectedDate, 'PPP') : '—'}</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slots.length === 0 && <p className="text-sm text-muted-foreground">Selecciona una fecha para ver horarios.</p>}
                {slots.map((slot) => {
                  const endTime = addMinutes(slot.time, duration);
                  const disabled = !canFitSlot(slot, duration);
                  const iso = slot.time.toISOString();
                  return (
                    <button
                      key={iso}
                      onClick={() => !disabled && setSelectedSlot(iso)}
                      disabled={disabled}
                      className={`w-full text-left rounded-full px-4 py-2 ${selectedSlot === iso ? 'bg-primary text-primary-foreground' : disabled ? 'bg-muted/30 text-muted-foreground cursor-not-allowed' : 'bg-muted/40 hover:bg-muted/60'}`}
                    >
                      <div className="text-center w-full">
                        <div className="font-medium text-base">{slot.label} <span className="mx-2">-</span> {format(endTime, 'hh:mm a')}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={onConfirm} disabled={!selectedDate || !selectedSlot || submitting}>
                {submitting ? "Procesando…" : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
