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
    description: "Solo drills — just you, a ball, and a small space.",
    videos: [
      {
        title: "10-Minute Ball Mastery Workout",
        url: "https://www.youtube.com/watch?v=U3N_qXaqrtI",
        note: "Follow along — great for daily practice",
      },
      {
        title: "10-Minute Footwork Workout",
        url: "https://www.youtube.com/watch?v=nHxClhfQjlM",
        note: "Fast feet and close control",
      },
      {
        title: "Individual Training Exercises (Part 1)",
        url: "https://www.youtube.com/watch?v=deh07Qar5wI",
        note: "Dribbling moves and turns",
      },
      {
        title: "Individual Training Exercises (Part 2)",
        url: "https://www.youtube.com/watch?v=78P-OMMJ8jQ",
        note: "More moves to add to your toolkit",
      },
    ],
  },
  {
    emoji: "⚽",
    title: "First Touch",
    description: "Find a wall, pass the ball, and control the return. Repeat!",
    videos: [
      {
        title: "Wall Passing & First Touch Drill",
        url: "https://www.youtube.com/watch?v=deh07Qar5wI",
        note: "Pass against a wall, cushion it back — inside of foot",
      },
      {
        title: "5-Minute Ball Mastery (No Space Needed)",
        url: "https://www.youtube.com/watch?v=U3N_qXaqrtI",
        note: "Receiving and redirecting in tight areas",
      },
    ],
  },
  {
    emoji: "🛡️",
    title: "1v1 Defense",
    description: "Footwork and body position — practice staying balanced.",
    videos: [
      {
        title: "10 Explosive Speed Exercises",
        url: "https://www.youtube.com/watch?v=FYJJbwG_i8U",
        note: "Lateral movement and quick reactions",
      },
      {
        title: "10-Minute Footwork Workout",
        url: "https://www.youtube.com/watch?v=nHxClhfQjlM",
        note: "Shuffles and direction changes — key for defending",
      },
    ],
  },
];

export default function Resources() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="text-sm text-sya-red hover:underline"
      >
        ← Back to schedule
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-sya-red">Practice Resources</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Grab a ball, find a wall, and practice 15 minutes a day. These are all
          solo drills — no partner needed!
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
        <p>🎯 Consistency beats intensity. 15 minutes every day &gt; 1 hour once a week.</p>
      </footer>
    </main>
  );
}
