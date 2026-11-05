import { format, addMinutes } from "date-fns";

export function generateSlots(date: Date) {
  // Example availability: 08:00-12:00 and 15:00-18:00 every day in 30-min intervals
  type Slot = { label: string; time: Date; endLimit: Date };
  const slots: Slot[] = [];
  const dayStart1 = new Date(date);
  dayStart1.setHours(8, 0, 0, 0);
  const dayEnd1 = new Date(date);
  dayEnd1.setHours(12, 0, 0, 0);
  const dayStart2 = new Date(date);
  dayStart2.setHours(15, 0, 0, 0);
  const dayEnd2 = new Date(date);
  dayEnd2.setHours(18, 0, 0, 0);

  for (let t = dayStart1.getTime(); t < dayEnd1.getTime(); t += 30 * 60 * 1000) {
    const d = new Date(t);
    slots.push({ label: format(d, "hh:mm a"), time: d, endLimit: dayEnd1 });
  }
  for (let t = dayStart2.getTime(); t < dayEnd2.getTime(); t += 30 * 60 * 1000) {
    const d = new Date(t);
    slots.push({ label: format(d, "hh:mm a"), time: d, endLimit: dayEnd2 });
  }
  return slots;
}


export function canFitSlot(slot: { time: Date; endLimit: Date }, duration: number) {
  return Number.isFinite(duration) && duration > 0 && addMinutes(slot.time, duration).getTime() <= slot.endLimit.getTime();
}
