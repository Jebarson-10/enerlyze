import type { Metadata } from "next";
import "./globals.css";
import "./revamp.css";
import "./blue.css";
import "./carbon.css";
import "./intro.css";
import StartupIntro from './startup-intro';
import SoundControl from './sound-control';
import './motion.css';
import './premium.css';
import SiteEffects from './site-effects';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.enerlyze.in'),
  title: { default: 'Enerlyze | Energy Intelligence for Homes and Businesses', template: '%s | Enerlyze' },
  description: 'Enerlyze helps homes and businesses understand electricity use, reduce carbon impact, and make smarter energy decisions. Explore Enerlyzer, our home energy tool, and business energy analytics.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', siteName: 'Enerlyze', locale: 'en_IN', title: 'Enerlyze | Your personal partner for a greener lifestyle', description: 'Understand energy use. Find practical savings. Make greener choices for your home or business.', url: '/', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Enerlyze energy intelligence' }] },
  twitter: { card: 'summary_large_image', title: 'Enerlyze | Energy Intelligence', description: 'Your personal partner for a greener lifestyle.', images: ['/og-image.png'] },
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
      <body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({ '@context':'https://schema.org', '@type':'Organization', name:'Enerlyze', url:'https://www.enerlyze.in', logo:'https://www.enerlyze.in/favicon.svg', description:'Energy analytics, carbon insights, and practical efficiency support for homes and businesses.', email:'enerlyze@gmail.com', telephone:'+91 70068 14925', address:{'@type':'PostalAddress', addressLocality:'Thiruvananthapuram', addressRegion:'Kerala', addressCountry:'IN'} })}}/><div id="site-content">{children}<SiteEffects/></div><SoundControl/><StartupIntro/></body>
    </html>
  );
}


