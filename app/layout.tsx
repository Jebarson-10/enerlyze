import type { Metadata } from "next";
import "./globals.css";
import "./revamp.css";
import "./blue.css";
import "./carbon.css";
import "./intro.css";
import StartupIntro from './startup-intro';
import SoundControl from './sound-control';
import './motion.css';
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
      <body className="antialiased"><div id="site-content">{children}<SiteEffects/></div><SoundControl/><StartupIntro/></body>
    </html>
  );
}


