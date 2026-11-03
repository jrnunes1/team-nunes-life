import { NextRequest, NextResponse } from "next/server";
import ICAL from "ical.js";

const ICS_URL =
  "https://cdn.ottosport.ai/_calendars/6659d527fb112000617dfacf/av2rf1n589.ics";

const TZ = "America/New_York";

// Last day of the season (ET, YYYY-MM-DD). Events after this date are hidden,
// and the week navigation stops at the last week that has an in-season event.
// Update this when the next season's schedule is posted.
const SEASON_END = "2026-11-08";

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
  const requested = Number(offsetParam ?? 0);

  const res = await fetch(ICS_URL, { next: { revalidate: 3600 } });
  const text = await res.text();

  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);
  const vevents = comp.getAllSubcomponents("vevent");

  const now = nowInET();
  const DAY = 24 * 60 * 60 * 1000;
  const toUTC = (ymd: string) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const ymd = (t: number) => new Date(t).toISOString().slice(0, 10);

  // All in-season events, tagged with their ET calendar date
  const allEvents = vevents
    .map((ve) => {
      const event = new ICAL.Event(ve);
      const start = event.startDate.toJSDate();
      const end = event.endDate.toJSDate();
      return {
        uid: event.uid,
        summary: event.summary,
        start: start.toISOString(),
        end: end.toISOString(),
        location: event.location || "",
        type: parseEventType(event.summary),
        _dateET: start.toLocaleDateString("en-CA", { timeZone: TZ }), // YYYY-MM-DD
      };
    })
    .filter((e) => e._dateET <= SEASON_END);

  // Sunday of the current week (ET), as a UTC-midnight timestamp
  const todayUTC = Date.UTC(now.year, now.month - 1, now.day);
  const currentSunday = todayUTC - now.dayOfWeek * DAY;

  // Furthest week you can scroll to: the week of the last in-season event
  const lastDate = allEvents.reduce((max, e) => (e._dateET > max ? e._dateET : max), "");
  let maxOffset = 0;
  if (lastDate) {
    const last = toUTC(lastDate);
    const lastSunday = last - new Date(last).getUTCDay() * DAY;
    maxOffset = Math.max(0, Math.round((lastSunday - currentSunday) / (7 * DAY)));
  }
  const offset = Math.min(Number.isFinite(requested) ? requested : 0, maxOffset);

  const baseSunday = currentSunday + offset * 7 * DAY;
  const sundayStr = ymd(baseSunday);
  const saturdayStr = ymd(baseSunday + 6 * DAY);

  // Week day timestamps (noon ET-ish so they never slip a day) for the client
  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(new Date(baseSunday + i * DAY + 17 * 60 * 60 * 1000).toISOString());
  }

  const events: TeamEvent[] = allEvents
    .filter((e) => e._dateET >= sundayStr && e._dateET <= saturdayStr)
    .map(({ _dateET, ...e }) => e)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return NextResponse.json({
    events,
    weekDays,
    today: new Date().toISOString(),
    offset,
    maxOffset,
  });
}
