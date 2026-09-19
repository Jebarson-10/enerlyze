import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enerlyze — Energy in a different light.",
  description: "Equipment-level energy analytics, carbon and ESG reporting, and accessible home energy insights from Enerlyze.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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


