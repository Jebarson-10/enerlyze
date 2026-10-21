import type { Metadata } from 'next';
import SiteHeader from '../site-header';
import {getPublishedState} from '@/lib/published';
import {contentValue} from '@/lib/content-fields';

const baseMetadata: Metadata = {
  title: 'Business Energy Analytics, Carbon & ESG Reporting',
  description: 'Enerlyze helps manufacturers and other organizations map equipment-level electricity use, identify avoidable losses, estimate associated emissions and organize evidence for ESG reporting.',
  alternates: { canonical: '/business' },
  openGraph: {
    title: 'Business Energy Analytics and ESG Support | Enerlyze',
    description: 'Measure equipment-level energy use, identify waste and turn carbon insights into practical efficiency priorities.',
    url: '/business',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Enerlyze energy intelligence' }],
  },
};
export async function generateMetadata():Promise<Metadata>{const {content}=await getPublishedState();return {...baseMetadata,title:contentValue(content,'seo.business.title'),description:contentValue(content,'seo.business.description')}}

const services=['01','02','03','04'];
const answers=[1,2,3];

const serviceData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://www.enerlyze.in/business#service',
  name: 'Business energy analytics and carbon reporting support',
  serviceType: 'Equipment-level energy analysis and ESG reporting support',
  description: 'Map electricity use at equipment and process level, identify avoidable losses, estimate associated emissions and prioritize efficiency measures.',
  provider: { '@id': 'https://www.enerlyze.in/#organization' },
  areaServed: { '@type': 'Country', name: 'India' },
  url: 'https://www.enerlyze.in/business',
};

export const dynamic='force-dynamic';
export default async function BusinessPage() {const {content}=await getPublishedState();const c=(key:string)=>contentValue(content,key);
  return <div className="site business-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }} />
    <SiteHeader active="business" />
    <main>
      <section className="business-hero">
        <span className="pathway-label">ENERLYZE FOR BUSINESS</span>
        <h1>{c('business.hero.title')}</h1>
        <p>{c('business.hero.body')}</p>
        <a className="buy-button" href={`mailto:${c('home.contact.email')}?subject=Business%20energy%20analysis%20enquiry`}>Discuss your operation ↗</a>
      </section>
      <section className="business-proof">
        <div><span>WHO WE WORK WITH</span><strong>{c('business.industries')}</strong></div>
        <div><span>WHAT WE CONNECT</span><strong>Equipment data · Energy losses · Carbon impact · Improvement options</strong></div>
      </section>
      <section className="business-process">
        <div className="section-heading"><span className="pathway-label">A CLEARER PATH</span><h2>{c('business.process.title')}</h2></div>
        <div className="business-process-grid">{services.map(number => <article key={number}><span>{number}</span><h3>{c(`business.service.${number}.title`)}</h3><p>{c(`business.service.${number}.body`)}</p></article>)}</div>
      </section>
      <section className="answer-section business-answers" aria-labelledby="business-answers-title">
        <div className="answer-heading"><span className="pathway-label">QUESTIONS WE HEAR</span><h2 id="business-answers-title">Clear scope. Useful evidence.</h2><p>Energy and emissions work is most valuable when the boundary, source data and assumptions are explicit.</p></div>
        <div className="answer-grid">{answers.map(index => <article key={index}><h3>{c(`business.faq.${index}.question`)}</h3><p>{c(`business.faq.${index}.answer`)}</p></article>)}</div>
      </section>
      <section className="business-cta"><h2>{c('business.cta.title')}</h2><p>{c('business.cta.body')}</p><a href={`mailto:${c('home.contact.email')}?subject=Business%20energy%20analysis%20enquiry`}>Contact Enerlyze ↗</a></section>
    </main>
    <footer className="tool-footer"><a href="/">Enerlyze</a><a href="/calculator">Explore Enerlyzer →</a></footer>
  </div>;
}
