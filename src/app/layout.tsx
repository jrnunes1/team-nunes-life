import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Nunes | SYA Soccer Schedule",
  description:
    "Weekly schedule for Team Nunes — SYA soccer practices and games in Centreville, Virginia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-sya-white text-sya-black dark:bg-[#111111] dark:text-gray-100">{children}</body>
    </html>
  );
}
