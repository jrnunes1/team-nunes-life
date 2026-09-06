"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const TZ = "America/New_York";
const COACH_PHONE = process.env.NEXT_PUBLIC_COACH_PHONE ?? "";
const COACH_EMAIL = process.env.NEXT_PUBLIC_COACH_EMAIL ?? "";

interface TeamEvent {
  uid: string;
  summary: string;
  start: string;
  end: string;
  location: string;
  type: "home" | "away" | "practice";
}

interface WeekData {
  events: TeamEvent[];
  weekDays: string[];
  today: string;
}

function isSameDay(a: Date, b: Date): boolean {
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { timeZone: TZ });
  return fmt(a) === fmt(b);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  });
}

function getArrivalTime(date: Date): string {
  return formatTime(new Date(date.getTime() - 20 * 60 * 1000));
}

function formatDayShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });
}

function getOpponent(summary: string): string {
  const match = summary.match(/vs\s+(.+?)\s*-\s*(Home|Away)/);
  return match ? match[1].trim() : "";
}

function formatWeekRange(weekDays: string[]): string {
  if (weekDays.length < 7) return "";
  const sun = new Date(weekDays[0]);
  const sat = new Date(weekDays[6]);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { timeZone: TZ, month: "numeric", day: "numeric" });
  return `Week of ${fmt(sun)} through ${fmt(sat)}`;
}

export default function Home() {
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeek = useCallback(async (weekOffset: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events?offset=${weekOffset}`);
      const json: WeekData = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeek(offset);
  }, [offset, fetchWeek]);

  const goBack = () => setOffset((o) => o - 1);
  const goForward = () => setOffset((o) => o + 1);
  const goToday = () => setOffset(0);

  if (!data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 text-center">
        <p className="text-gray-500">Loading…</p>
      </main>
    );
  }

  const { events, weekDays, today } = data;
  const todayDate = new Date(today);
  const isOffseason = events.length === 0;
  const isCurrentWeek = offset === 0;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      {isOffseason && isCurrentWeek ? (
        <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="text-4xl">⚽</p>
          <p className="mt-4 text-xl font-medium">
            Nothing scheduled this week — enjoy the time off and watch some
            futebol!
          </p>

          {/* Week navigation on offseason */}
          <nav aria-label="Week navigation" className="mt-8 w-full max-w-md">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={goBack}
                aria-label="Previous week"
                className="rounded-lg px-3 py-2 text-lg font-bold text-sya-red hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ‹
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatWeekRange(weekDays)}
              </p>
              <button
                onClick={goForward}
                aria-label="Next week"
                className="rounded-lg px-3 py-2 text-lg font-bold text-sya-red hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ›
              </button>
            </div>
          </nav>

          <div className="mt-8 flex gap-3">
            <a
              href={`sms:${COACH_PHONE}`}
              className="rounded-lg bg-sya-red px-5 py-2.5 text-sm font-medium text-sya-white"
            >
              Text Coach
            </a>
            <a
              href={`mailto:${COACH_EMAIL}`}
              className="rounded-lg bg-sya-black px-5 py-2.5 text-sm font-medium text-sya-white"
            >
              Email Coach
            </a>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold">At-home Resources</h2>
            <a
              href="/resources"
              className="mt-2 inline-block text-sm text-sya-red hover:underline"
            >
              Practice Drills
            </a>
          </div>
        </section>
      ) : (
        <>
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-sya-red">Team Nunes</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              SYA Soccer
            </p>
          </header>

          {/* Week navigation arrows */}
          <nav aria-label="Week navigation" className="mb-2">
            <div className="flex items-center justify-between">
              <button
                onClick={goBack}
                aria-label="Previous week"
                className="rounded-lg px-3 py-2 text-lg font-bold text-sya-red hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ‹
              </button>
              <div className="grid grid-cols-7 gap-1 text-center text-sm flex-1 mx-2">
                {weekDays.map((dayStr) => {
                  const day = new Date(dayStr);
                  const isToday = isSameDay(day, todayDate);
                  const dayLabel = day.toLocaleDateString("en-US", {
                    timeZone: TZ,
                    weekday: "short",
                  });
                  const dateNum = day.toLocaleDateString("en-US", {
                    timeZone: TZ,
                    day: "numeric",
                  });
                  return (
                    <div
                      key={dayStr}
                      className={`rounded-lg py-2 ${
                        isToday
                          ? "bg-sya-red text-sya-white font-bold"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <span className="block text-xs">{dayLabel}</span>
                      <span className="block text-lg">{dateNum}</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={goForward}
                aria-label="Next week"
                className="rounded-lg px-3 py-2 text-lg font-bold text-sya-red hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ›
              </button>
            </div>
          </nav>

          {/* Week label + Today button */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatWeekRange(weekDays)}
            </p>
            {!isCurrentWeek && (
              <button
                onClick={goToday}
                className="mt-1 text-xs font-medium text-sya-red hover:underline"
              >
                Today
              </button>
            )}
          </div>

          {/* Schedule */}
          {isOffseason ? (
            <section className="rounded-xl bg-gray-50 dark:bg-gray-800 p-8 text-center">
              <p className="text-xl">⚽</p>
              <p className="mt-2 text-lg font-medium">
                Nothing scheduled this week
              </p>
            </section>
          ) : (
            <section aria-label="This week's schedule">
              <ul className="space-y-4">
                {events.map((event) => {
                  const start = new Date(event.start);
                  return (
                    <li
                      key={event.uid}
                      className={`rounded-xl border p-4 ${
                        event.type === "home"
                          ? "border-sya-red/30 bg-red-50 dark:bg-red-950/30"
                          : event.type === "away"
                            ? "border-sya-black/30 bg-gray-200 dark:border-gray-600 dark:bg-gray-800"
                            : "border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDayShort(start)} · {formatTime(start)}
                          </p>
                          {event.type === "practice" ? (
                            <p className="mt-1 font-medium">Practice</p>
                          ) : (
                            <p className="mt-1 font-medium">
                              <span
                                className={`inline-block rounded px-2 py-0.5 text-xs font-bold text-sya-white ${
                                  event.type === "home"
                                    ? "bg-sya-red"
                                    : "bg-sya-black"
                                }`}
                              >
                                {event.type === "home" ? "HOME" : "AWAY"}
                              </span>{" "}
                              {event.type === "home" ? "vs" : "at"}{" "}
                              {getOpponent(event.summary)}
                            </p>
                          )}
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-xs text-gray-500 dark:text-gray-400 underline"
                          >
                            {event.location}
                          </a>
                        </div>

                        {event.type !== "practice" && (
                          <div className="shrink-0 flex gap-2">
                            <Image
                              src={
                                event.type === "home"
                                  ? "/images/Home_jersey.jpg"
                                  : "/images/Away_jersey.jpg"
                              }
                              alt={`${event.type === "home" ? "Red home" : "Black away"} jersey`}
                              width={48}
                              height={60}
                              className="rounded"
                            />
                            <Image
                              src="/images/Shorts.jpg"
                              alt="Shorts"
                              width={48}
                              height={60}
                              className="rounded"
                            />
                          </div>
                        )}
                      </div>

                      {event.type !== "practice" && (
                        <div className="mt-4 rounded-lg bg-white/60 dark:bg-gray-900/60 p-4 text-sm leading-relaxed">
                          <p>
                            Please arrive by{" "}
                            <span className="font-bold underline">
                              {getArrivalTime(start)}
                            </span>{" "}
                            so we can warm up and stretch together.
                          </p>
                          <p className="mt-3">
                            Your player should have a water bottle and:
                          </p>
                          <ul className="mt-1 ml-5 list-disc">
                            <li>
                              {event.type === "home" ? "Red" : "Black"} jersey
                            </li>
                            <li>Shinguards</li>
                            <li>Cleats</li>
                            <li>No jewelry</li>
                          </ul>
                          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                            Failure to comply with the above uniform requirements
                            will prevent your child from participating in the game
                            until the issue has been rectified.
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Contact Coach */}
          <section className="mt-10 text-center">
            <h2 className="mb-3 text-lg font-semibold">Contact Coach</h2>
            <div className="flex justify-center gap-3">
              <a
                href={`sms:${COACH_PHONE}`}
                className="rounded-lg bg-sya-red px-5 py-2.5 text-sm font-medium text-sya-white"
              >
                Text
              </a>
              <a
                href={`mailto:${COACH_EMAIL}`}
                className="rounded-lg bg-sya-black px-5 py-2.5 text-sm font-medium text-sya-white"
              >
                Email
              </a>
            </div>
          </section>

          {/* At-home Resources */}
          <section className="mt-10 text-center">
            <h2 className="mb-3 text-lg font-semibold">At-home Resources</h2>
            <a
              href="/resources"
              className="text-sm text-sya-red hover:underline"
            >
              Practice Drills
            </a>
          </section>
        </>
      )}
    </main>
  );
}
