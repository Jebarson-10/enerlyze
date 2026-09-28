import type { Metadata } from "next";
import "./globals.css";
import "./revamp.css";
import "./blue.css";
import SiteEffects from './site-effects';

export const metadata: Metadata = {
  title: "Enerlyze — Your personal partner for a greener lifestyle.",
  description: "Save energy, explore greener products and reduce your footprint. Accessible energy analytics, renewable solutions, and carbon and ESG reporting from Enerlyze.",
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
      <body className="antialiased">{children}<SiteEffects/></body>
    </html>
  );
}


