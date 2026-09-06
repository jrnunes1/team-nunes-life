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

/** Get the current date parts in Eastern Time */
function nowInET(): { year: number; month: number; day: number; dayOfWeek: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    dayOfWeek: dayMap[get("weekday")] ?? 0,
  };
}

/** Build a Date for midnight ET on a given date */
function midnightET(year: number, month: number, day: number): Date {
  // Create date string and parse in ET by using a known offset approach
  const str = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`;
  // Get the ET offset for this date
  const tmp = new Date(str + "Z");
  const etStr = tmp.toLocaleString("en-US", { timeZone: TZ });
  const etDate = new Date(etStr);
  const offset = tmp.getTime() - etDate.getTime();
  return new Date(new Date(str + "Z").getTime() + offset);
}

function getWeekRange(): { start: Date; end: Date; sundayDate: { year: number; month: number; day: number } } {
  const now = nowInET();
  // Go back to Sunday
  const sundayJS = new Date(now.year, now.month - 1, now.day - now.dayOfWeek);
  const sunday = { year: sundayJS.getFullYear(), month: sundayJS.getMonth() + 1, day: sundayJS.getDate() };
  const saturdayJS = new Date(now.year, now.month - 1, now.day - now.dayOfWeek + 6);

  const start = midnightET(sunday.year, sunday.month, sunday.day);
  const end = new Date(midnightET(saturdayJS.getFullYear(), saturdayJS.getMonth() + 1, saturdayJS.getDate()).getTime() + 24 * 60 * 60 * 1000 - 1);

  return { start, end, sundayDate: sunday };
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
  const arrival = new Date(date.getTime() - 20 * 60 * 1000);
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

  const { start, end, sundayDate } = getWeekRange();

  const events: TeamEvent[] = vevents
    .map((ve) => {
      const event = new ICAL.Event(ve);
      const eventStart = event.startDate.toJSDate();
      const eventEnd = event.endDate.toJSDate();
      return {
        uid: event.uid,
        summary: event.summary,
        start: eventStart,
        end: eventEnd,
        location: event.location || "",
        type: parseEventType(event.summary),
      };
    })
    .filter((e) => e.start >= start && e.start <= end)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const weekDays: Date[] = [];
  const base = new Date(sundayDate.year, sundayDate.month - 1, sundayDate.day, 12);
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  return { events, weekDays, today: new Date() };
}
