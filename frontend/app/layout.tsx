import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spy Words - Codenames Multiplayer",
  description: "A real-time multiplayer Codenames-inspired party game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
