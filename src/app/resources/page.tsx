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
        title: "5-Minute Ball Mastery for Kids (No Space Needed)",
        url: "https://www.youtube.com/watch?v=9Kkj0qoMrSk",
        note: "Toe taps, sole rolls, inside-outside — follow along!",
      },
      {
        title: "Easy Cone Dribbling for Beginners",
        url: "https://www.youtube.com/watch?v=9Z2A5Z0XBDU",
        note: "Set up 5 cones and weave through them — both feet",
      },
      {
        title: "10 Easy Soccer Tricks for Kids",
        url: "https://www.youtube.com/watch?v=9xYWgflFzag",
        note: "Fun moves to try once you're comfortable with the ball",
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
        title: "Wall Passing Drill for Kids",
        url: "https://www.youtube.com/watch?v=MgaxOPQ8Jlg",
        note: "Pass with inside of foot, cushion it back — repeat 50 times each foot",
      },
      {
        title: "How to Trap a Soccer Ball (for Beginners)",
        url: "https://www.youtube.com/watch?v=DUKYOq1HJGU",
        note: "Learn to 'kill' the ball dead with your first touch",
      },
    ],
  },
  {
    emoji: "🛡️",
    title: "Defense & Footwork",
    description:
      "Good defense is about staying on your toes and being patient. These drills build quick feet.",
    videos: [
      {
        title: "Defensive Footwork for Young Players",
        url: "https://www.youtube.com/watch?v=3PnMJL_CXJY",
        note: "Lateral shuffles, staying low, and staying balanced",
      },
      {
        title: "Speed & Agility Ladder Drills (No Ladder Needed!)",
        url: "https://www.youtube.com/watch?v=bKf0UGXH5Hs",
        note: "Use chalk lines or tape — builds the quick feet you need for 1v1",
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
                key={video.url + video.title}
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
