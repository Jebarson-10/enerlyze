import type { Metadata } from 'next';
import SiteHeader from '../site-header';

export const metadata: Metadata = {
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

const services = [
  ['01', 'Map energy use', 'Understand electricity consumption at the equipment and process level, from production lines to building systems.'],
  ['02', 'Find avoidable losses', 'Identify inefficient operating patterns and carbon-intensive equipment, then prioritize opportunities with a clear rationale.'],
  ['03', 'Plan better choices', 'Compare practical efficiency measures and renewable options, including relevant solutions from our partner ecosystem.'],
  ['04', 'Report with clarity', 'Organize energy and emissions evidence for carbon accounting and ESG governance reporting support.'],
];

const answers = [
  {
    question: 'What does an energy analysis cover?',
    answer: 'The scope is agreed for each site. It can include utility bills, an equipment inventory, operating hours and measurements of electrical loads. The goal is to locate material consumption and avoidable losses before recommending a change.',
  },
  {
    question: 'How do energy findings support carbon and ESG reporting?',
    answer: 'Documented electricity consumption provides a starting point for estimating purchased-electricity emissions. Enerlyze helps organize the inputs, assumptions and improvement actions so they can be reviewed for reporting. It does not replace independent assurance.',
  },
  {
    question: 'Which industries can use this approach?',
    answer: 'Equipment-level analysis can be adapted to manufacturing, textiles, hospitals, chemical operations and food production. The measurements and opportunities depend on the process, equipment and data available at each site.',
  },
];

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

export default function BusinessPage() {
  return <div className="site business-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }} />
    <SiteHeader active="business" />
    <main>
      <section className="business-hero">
        <span className="pathway-label">ENERLYZE FOR BUSINESS</span>
        <h1>See the energy behind every decision.</h1>
        <p>We help organizations measure electricity use, uncover waste and turn carbon insight into a practical plan. From individual machines to site-wide operations, the aim is simple: make better energy decisions easier to act on.</p>
        <a className="buy-button" href="mailto:enerlyze@gmail.com?subject=Business%20energy%20analysis%20enquiry">Discuss your operation ↗</a>
      </section>
      <section className="business-proof">
        <div><span>WHO WE WORK WITH</span><strong>Manufacturing · Textiles · Healthcare · Chemicals · Food production</strong></div>
        <div><span>WHAT WE CONNECT</span><strong>Equipment data · Energy losses · Carbon impact · Improvement options</strong></div>
      </section>
      <section className="business-process">
        <div className="section-heading"><span className="pathway-label">A CLEARER PATH</span><h2>From measurement to meaningful action.</h2></div>
        <div className="business-process-grid">{services.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>
      <section className="answer-section business-answers" aria-labelledby="business-answers-title">
        <div className="answer-heading"><span className="pathway-label">QUESTIONS WE HEAR</span><h2 id="business-answers-title">Clear scope. Useful evidence.</h2><p>Energy and emissions work is most valuable when the boundary, source data and assumptions are explicit.</p></div>
        <div className="answer-grid">{answers.map(({ question, answer }) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div>
      </section>
      <section className="business-cta"><h2>Start with what your operation already knows.</h2><p>Bring your bills, equipment inventory or operational questions. We can help define the next useful measurement and reporting step.</p><a href="mailto:enerlyze@gmail.com?subject=Business%20energy%20analysis%20enquiry">Contact Enerlyze ↗</a></section>
    </main>
    <footer className="tool-footer"><a href="/">Enerlyze</a><a href="/calculator">Explore Enerlyzer →</a></footer>
  </div>;
}
