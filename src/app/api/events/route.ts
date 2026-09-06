import { NextRequest, NextResponse } from "next/server";
import ICAL from "ical.js";

const ICS_URL =
  "https://cdn.ottosport.ai/_calendars/6659d527fb112000617dfacf/av2rf1n589.ics";

const TZ = "America/New_York";

interface TeamEvent {
  uid: string;
  summary: string;
  start: string;
  end: string;
  location: string;
  type: "home" | "away" | "practice";
}

function nowInET() {
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

function parseEventType(summary: string): TeamEvent["type"] {
  if (summary.includes("Home Game")) return "home";
  if (summary.includes("Away Game")) return "away";
  return "practice";
}

export async function GET(req: NextRequest) {
  const offsetParam = req.nextUrl.searchParams.get("offset");
  const offset = Number(offsetParam ?? 0);

  const res = await fetch(ICS_URL, { next: { revalidate: 3600 } });
  const text = await res.text();

  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);
  const vevents = comp.getAllSubcomponents("vevent");

  const now = nowInET();
  // Sunday of current week, then shift by offset weeks
  const baseSunday = new Date(now.year, now.month - 1, now.day - now.dayOfWeek + offset * 7);
  const baseSaturday = new Date(baseSunday.getFullYear(), baseSunday.getMonth(), baseSunday.getDate() + 6);

  // Build week day strings (ISO) for the client
  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseSunday.getFullYear(), baseSunday.getMonth(), baseSunday.getDate() + i, 12);
    weekDays.push(d.toISOString());
  }

  // Filter events: compare in ET by formatting both dates
  const sundayStr = `${baseSunday.getFullYear()}-${String(baseSunday.getMonth() + 1).padStart(2, "0")}-${String(baseSunday.getDate()).padStart(2, "0")}`;
  const saturdayStr = `${baseSaturday.getFullYear()}-${String(baseSaturday.getMonth() + 1).padStart(2, "0")}-${String(baseSaturday.getDate()).padStart(2, "0")}`;

  const events: TeamEvent[] = vevents
    .map((ve) => {
      const event = new ICAL.Event(ve);
      const start = event.startDate.toJSDate();
      const end = event.endDate.toJSDate();
      const startET = start.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
      return {
        uid: event.uid,
        summary: event.summary,
        start: start.toISOString(),
        end: end.toISOString(),
        location: event.location || "",
        type: parseEventType(event.summary),
        _dateET: startET,
      };
    })
    .filter((e) => e._dateET >= sundayStr && e._dateET <= saturdayStr)
    .map(({ _dateET, ...e }) => e)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return NextResponse.json({ events, weekDays, today: new Date().toISOString() });
}
