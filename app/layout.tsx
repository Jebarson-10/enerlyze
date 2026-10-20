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
import './material-refresh.css';
import SiteEffects from './site-effects';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.enerlyze.in'),
  title: { default: 'Enerlyze | Energy Analytics, Carbon Insights & Enerlyzer', template: '%s | Enerlyze' },
  description: 'Enerlyze helps Indian homes and businesses understand electricity use and carbon impact. Try Enerlyzer for bill and appliance estimates, or explore equipment-level energy analytics and ESG reporting support.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  verification: { google: 'VI7rdSZ5aYnM0ZYLBknrTijCpQttlT_dM8mcKxHA6Tg' },
  openGraph: { type: 'website', siteName: 'Enerlyze', locale: 'en_IN', title: 'Enerlyze | Your personal partner for a greener lifestyle', description: 'Understand energy use. Find practical savings. Make greener choices for your home or business.', url: '/', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Enerlyze energy intelligence' }] },
  twitter: { card: 'summary_large_image', title: 'Enerlyze | Energy Intelligence', description: 'Your personal partner for a greener lifestyle.', images: ['/og-image.png'] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.enerlyze.in/#organization',
      name: 'Enerlyze',
      url: 'https://www.enerlyze.in/',
      logo: 'https://www.enerlyze.in/favicon.svg',
      description: 'Energy analytics, carbon insights, and practical efficiency support for homes and businesses in India.',
      email: 'enerlyze@gmail.com',
      telephone: '+91 70068 14925',
      contactPoint: { '@type': 'ContactPoint', contactType: 'business enquiries', email: 'enerlyze@gmail.com', telephone: '+91 70068 14925', availableLanguage: 'English' },
      areaServed: { '@type': 'Country', name: 'India' },
      address: { '@type': 'PostalAddress', addressLocality: 'Thiruvananthapuram', addressRegion: 'Kerala', addressCountry: 'IN' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.enerlyze.in/#website',
      name: 'Enerlyze',
      alternateName: 'enerlyze.in',
      url: 'https://www.enerlyze.in/',
      publisher: { '@id': 'https://www.enerlyze.in/#organization' },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}/><div id="site-content">{children}<SiteEffects/></div><SoundControl/><StartupIntro/></body>
    </html>
  );
}


