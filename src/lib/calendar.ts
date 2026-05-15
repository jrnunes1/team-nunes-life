import ICAL from "ical.js";

const ICS_URL =
  "https://cdn.ottosport.ai/_calendars/6659d527fb112000617dfacf/av2rf1n589.ics";

const TZ = "America/New_York";

export interface TeamEvent {
  uid: string;
  summary: string;
  start: Date;
  end: Date;
  location: string;
  type: "home" | "away" | "practice";
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getSunday(monday: Date): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

function parseEventType(summary: string): TeamEvent["type"] {
  if (summary.includes("Home Game")) return "home";
  if (summary.includes("Away Game")) return "away";
  return "practice";
}

function parseOpponent(summary: string): string {
  const match = summary.match(/vs\s+(.+?)\s*-\s*(Home|Away)/);
  return match ? match[1].trim() : "";
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getArrivalTime(date: Date): string {
  const arrival = new Date(date.getTime() - 15 * 60 * 1000);
  return formatTime(arrival);
}

export function formatDayShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });
}

export function getOpponent(event: TeamEvent): string {
  return parseOpponent(event.summary);
}

export async function getWeekEvents(): Promise<{
  events: TeamEvent[];
  weekDays: Date[];
  today: Date;
}> {
  const res = await fetch(ICS_URL, { next: { revalidate: 3600 } });
  const text = await res.text();

  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);
  const vevents = comp.getAllSubcomponents("vevent");

  const now = new Date();
  const monday = getMonday(now);
  const sunday = getSunday(monday);

  const events: TeamEvent[] = vevents
    .map((ve) => {
      const event = new ICAL.Event(ve);
      const start = event.startDate.toJSDate();
      const end = event.endDate.toJSDate();
      return {
        uid: event.uid,
        summary: event.summary,
        start,
        end,
        location: event.location || "",
        type: parseEventType(event.summary),
      };
    })
    .filter((e) => e.start >= monday && e.start <= sunday)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  return { events, weekDays, today: now };
}
