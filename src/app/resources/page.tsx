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
    description: "Just you, a ball, and your backyard. Set up cones with shoes or water bottles!",
    videos: [
      {
        title: "Soccer Drills for Kids — Ball Mastery & Toe Taps (U10)",
        url: "https://www.youtube.com/watch?v=KaktBhbJUyg",
        note: "Quick drills you can do solo in any small space",
      },
      {
        title: "[Advanced] Dribbling Tricks (3 min)",
        url: "https://www.youtube.com/watch?v=-JWG43D66qI",
        note: "Fun moves to try once you're comfortable with the ball",
      },
    ],
  },
  {
    emoji: "⚽",
    title: "First Touch & Passing",
    description: "Find a wall (garage door works great). Pass and control — that's it!",
    videos: [
      {
        title: "Top 3 Wall Drills to Improve Your Skills (4 min)",
        url: "https://www.youtube.com/watch?v=W3OEl4_v6Bw",
        note: "Pass with inside of foot, cushion it back — both feet!",
      },
    ],
  },
  {
    emoji: "🎯",
    title: "Shooting",
    description: "Plant your foot, lock your ankle, and follow through!",
    videos: [
      {
        title: "How to Get More Power on Your Shot (short)",
        url: "https://www.youtube.com/shorts/nR0_cd6vQiM",
        note: "Plant foot next to the ball, strike with your laces — not your toe!",
      },
    ],
  },
  {
    emoji: "🛡️",
    title: "1v1 Defense",
    description: "Stay on your toes, stay patient, don't dive in!",
    videos: [
      {
        title: "Defending Technique — Body Position (1 min)",
        url: "https://www.youtube.com/watch?v=aOi2_xeYHTQ",
        note: "Super quick — shows exactly how to stand when defending",
      },
      {
        title: "How to Stop Fast Attackers (3 min)",
        url: "https://www.youtube.com/watch?v=K17wDaDcuyY",
        note: "Stay low, stay sideways, force them to the outside",
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
          Grab a ball, find a wall, and practice 15 minutes a day. All solo — no
          partner needed. Just you and the ball! ⚽
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
          15 minutes every day beats 1 hour once a week. Touch the ball daily!
        </p>
      </footer>
    </main>
  );
}
