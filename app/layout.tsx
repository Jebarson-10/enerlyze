import type { Metadata } from "next";
import "./globals.css";
import "./revamp.css";

export const metadata: Metadata = {
  title: "Enerlyze — A greener way forward.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}


