import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Practice Resources | Team Nunes — SYA Soccer",
  description:
    "Solo soccer drills for kids: ball control, first touch, and 1v1 defense. All you need is a ball, a wall, and 15 minutes.",
};

const sections = [
  {
    emoji: "🏃",
    title: "Ball Control & Dribbling",
    description:
      "All you need is a ball and a few cones (or shoes/water bottles as markers). Do these in your backyard or driveway!",
    videos: [
      {
        title: "Best Soccer Drills at Home — Kids Soccer! ⚽",
        url: "https://www.youtube.com/watch?v=NXsvVpnCWJ4",
        note: "Simple drills you can do by yourself in any small space",
      },
      {
        title: "The Ultimate Indoor Soccer Workout for Kids",
        url: "https://www.youtube.com/watch?v=X9f_c6LHoTI",
        note: "Follow along — great for rainy days or small spaces",
      },
      {
        title: "5 Easy Soccer Drills for Beginners",
        url: "https://www.youtube.com/watch?v=79-7SEVb5Ss",
        note: "Basic moves to get comfortable with the ball at your feet",
      },
      {
        title: "Important Soccer Training for Kids",
        url: "https://www.youtube.com/watch?v=RMiQSRNXAwI",
        note: "Touches and control — do this every day!",
      },
    ],
  },
  {
    emoji: "⚽",
    title: "First Touch & Passing",
    description:
      "Find a wall (garage door, school wall, anything flat). Pass the ball and control the return.",
    videos: [
      {
        title: "Top 3 Wall Drills to Improve Your Skills",
        url: "https://www.youtube.com/watch?v=W3OEl4_v6Bw",
        note: "Simple wall passing — inside of foot, cushion it back",
      },
      {
        title: "1000 Touch Workout — 10-Minute Wall Passing",
        url: "https://www.youtube.com/watch?v=1oxaF_Mx6Ok",
        note: "Follow along and get tons of touches against a wall",
      },
    ],
  },
  {
    emoji: "🛡️",
    title: "Defense & Footwork",
    description:
      "Good defense is about staying on your toes and being patient. Watch how to position your body.",
    videos: [
      {
        title: "10 Best Soccer Defending Drills for Kids (MOJO)",
        url: "https://www.youtube.com/watch?v=MDF6tB5foI0",
        note: "Fun drills made for youth players — learn to stay balanced",
      },
      {
        title: "All About Soccer Skills: Defending (MOJO)",
        url: "https://www.youtube.com/watch?v=yREWtO19RQc",
        note: "Body position, jockeying, and when to step in",
      },
    ],
  },
];

export default function Resources() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-sya-red hover:underline">
        ← Back to schedule
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-sya-red">Practice Resources</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Grab a ball, find a wall, and practice 15 minutes a day. All of these
          are solo drills — no partner needed. Just you and the ball! ⚽
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="mb-10">
          <h2 className="text-lg font-semibold">
            {section.emoji} {section.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {section.description}
          </p>
          <ul className="mt-3 space-y-3">
            {section.videos.map((video) => (
              <li
                key={video.url}
                className="rounded-lg border border-gray-200 dark:border-gray-700 p-3"
              >
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sya-red hover:underline"
                >
                  ▶ {video.title}
                </a>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {video.note}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="mt-8 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium">🎯 Coach&apos;s tip:</p>
        <p className="mt-1">
          15 minutes every day beats 1 hour once a week. Touch the ball daily
          and you&apos;ll be amazed how fast you improve!
        </p>
      </footer>
    </main>
  );
}
