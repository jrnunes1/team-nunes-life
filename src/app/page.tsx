import Image from "next/image";
import {
  getWeekEvents,
  formatTime,
  formatDayShort,
  getOpponent,
} from "@/lib/calendar";

const TZ = "America/New_York";

function isSameDay(a: Date, b: Date): boolean {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { timeZone: TZ });
  return fmt(a) === fmt(b);
}

export default async function Home() {
  const { events, weekDays, today } = await getWeekEvents();
  const isOffseason = events.length === 0;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-sya-red">Team Nunes</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">SYA Soccer</p>
      </header>

      {/* Week strip */}
      <nav aria-label="Current week" className="mb-8">
        <ol className="grid grid-cols-7 gap-1 text-center text-sm">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, today);
            const dayLabel = day.toLocaleDateString("en-US", {
              timeZone: TZ,
              weekday: "short",
            });
            const dateNum = day.toLocaleDateString("en-US", {
              timeZone: TZ,
              day: "numeric",
            });
            return (
              <li
                key={day.toISOString()}
                className={`rounded-lg py-2 ${
                  isToday
                    ? "bg-sya-red text-sya-white font-bold"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <span className="block text-xs">{dayLabel}</span>
                <span className="block text-lg">{dateNum}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Schedule or offseason */}
      {isOffseason ? (
        <section className="rounded-xl bg-gray-50 dark:bg-gray-800 p-8 text-center">
          <p className="text-xl">⚽</p>
          <p className="mt-2 text-lg font-medium">
            Nothing scheduled, enjoy the offseason and watch some futebol!
          </p>
        </section>
      ) : (
        <section aria-label="This week's schedule">
          <h2 className="mb-4 text-lg font-semibold">This Week</h2>
          <ul className="space-y-4">
            {events.map((event) => (
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
                      {formatDayShort(event.start)} · {formatTime(event.start)}
                    </p>
                    {event.type === "practice" ? (
                      <p className="mt-1 font-medium">Practice</p>
                    ) : (
                      <p className="mt-1 font-medium">
                        vs {getOpponent(event)}{" "}
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-bold text-sya-white ${
                            event.type === "home"
                              ? "bg-sya-red"
                              : "bg-sya-black"
                          }`}
                        >
                          {event.type === "home" ? "HOME" : "AWAY"}
                        </span>
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {event.location}
                    </p>
                  </div>

                  {/* Jersey indicator */}
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
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* Contact Coach */}
      <section className="mt-10 text-center">
        <h2 className="mb-3 text-lg font-semibold">Contact Coach</h2>
        <div className="flex justify-center gap-3">
          <a
            href={`sms:${process.env.COACH_PHONE}`}
            className="rounded-lg bg-sya-red px-5 py-2.5 text-sm font-medium text-sya-white"
          >
            Text
          </a>
          <a
            href={`mailto:${process.env.COACH_EMAIL}`}
            className="rounded-lg bg-sya-black px-5 py-2.5 text-sm font-medium text-sya-white"
          >
            Email
          </a>
        </div>
      </section>
    </main>
  );
}
