import type { Metadata } from "next";
import "./globals.css";
import "./revamp.css";
import "./blue.css";
import "./carbon.css";
import "./intro.css";
import SoundControl from './sound-control';
import './motion.css';
import './premium.css';
import './material-refresh.css';
import './theme.css';
import SiteEffects from './site-effects';
import {getPublishedState} from '@/lib/published';
import {contentValue} from '@/lib/content-fields';
import {jsonLd} from '@/lib/seo';
import './info.css';
import './services.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.enerlyze.in'),
  title: { default: 'Enerlyze India | Energy Analysis & Carbon Footprint Calculator', template: '%s | Enerlyze' },
  description: 'Analyse electricity consumption, estimate associated carbon emissions and discover energy-saving opportunities with Enerlyze, an energy intelligence company in Kerala, India.',
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
      name: 'Enerlyze Private Limited',
      alternateName: 'Enerlyze',
      url: 'https://www.enerlyze.in/',
      logo: 'https://www.enerlyze.in/favicon.svg',
      sameAs: ['https://startups.startupmission.in/startups/pzvOl'],
      description: 'Energy intelligence and electricity-consumption analysis for homes and businesses in India.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {content}=await getPublishedState();
  const email=contentValue(content,'home.contact.email'),telephone=contentValue(content,'home.contact.phone');
  const organization={...structuredData['@graph'][0],email,telephone,contactPoint:{'@type':'ContactPoint',contactType:'business enquiries',email,telephone,availableLanguage:'English'}};
  const liveStructuredData={...structuredData,'@graph':[organization,structuredData['@graph'][1]]};
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.theme=localStorage.getItem('enerlyze-theme')==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}"}}/></head>
      <body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLd(liveStructuredData)}}/><div id="site-content">{children}<SiteEffects/></div><SoundControl/></body>
    </html>
  );
}


