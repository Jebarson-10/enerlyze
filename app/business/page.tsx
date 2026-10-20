import type { Metadata } from 'next';
import SiteHeader from '../site-header';

export const metadata: Metadata = {
  title: 'Business Energy Analytics and Carbon Reporting',
  description: 'Enerlyze maps equipment-level electricity use, identifies avoidable losses, supports carbon and ESG reporting, and helps organizations prioritize practical efficiency improvements.',
  alternates: { canonical: '/business' },
  openGraph: { title: 'Business Energy Analytics | Enerlyze', description: 'See where your operation uses energy and where smarter equipment can cut waste and carbon impact.', url: '/business', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Enerlyze energy intelligence' }] },
};

export default function BusinessPage() {
  const services = [
    ['01', 'Map energy use', 'Understand electricity consumption at the equipment and process level, from production lines to building systems.'],
    ['02', 'Find avoidable losses', 'Identify inefficient operating patterns and carbon-intensive equipment, then prioritize opportunities with a clear rationale.'],
    ['03', 'Plan better choices', 'Compare practical efficiency measures and renewable options, including relevant solutions from our partner ecosystem.'],
    ['04', 'Report with clarity', 'Organize energy and emissions evidence for carbon accounting and ESG governance reporting support.'],
  ];
  return <div className="site business-page"><SiteHeader active="business"/><main><section className="business-hero"><span className="pathway-label">ENERLYZE FOR BUSINESS</span><h1>See the energy behind every decision.</h1><p>We help organizations measure electricity use, uncover waste and turn carbon insight into a practical plan. From individual machines to site-wide operations, the aim is simple: make better energy decisions easier to act on.</p><a className="buy-button" href="mailto:enerlyze@gmail.com?subject=Business%20energy%20analysis%20enquiry">Discuss your operation ↗</a></section><section className="business-proof"><div><span>WHO WE WORK WITH</span><strong>Manufacturing · Textiles · Healthcare · Chemicals · Food production</strong></div><div><span>WHAT WE CONNECT</span><strong>Equipment data · Energy losses · Carbon impact · Improvement options</strong></div></section><section className="business-process"><div className="section-heading"><span className="pathway-label">A CLEARER PATH</span><h2>From measurement to meaningful action.</h2></div><div className="business-process-grid">{services.map(([number,title,body])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section><section className="business-cta"><h2>Start with what your operation already knows.</h2><p>Bring your bills, equipment inventory or operational questions. We can help define the next useful measurement and reporting step.</p><a href="mailto:enerlyze@gmail.com?subject=Business%20energy%20analysis%20enquiry">Contact Enerlyze ↗</a></section></main><footer className="tool-footer"><a href="/">Enerlyze</a><a href="/calculator">Explore Enerlyzer →</a></footer></div>;
}
