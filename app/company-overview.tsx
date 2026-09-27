'use client';

import { ArrowUpRight, Leaf, ScanLine, Sun } from 'lucide-react';
import type { Mode } from './page';

export default function CompanyOverview({ choose }: { choose: (mode: Mode) => void }) {
  return <>
    <section className="purpose-section" aria-labelledby="purpose-title">
      <h2 id="purpose-title">Less wasted.<br/><span>More possible.</span></h2>
      <div className="purpose-body"><p>Energy is only the beginning. We connect what you consume, what it costs, and what it means for the planet.</p><p>From everyday appliances to entire operations, Enerlyze makes energy intelligence accessible. Understand your impact and find practical ways to reduce it.</p></div>
    </section>
    <section className="pathways" aria-label="Explore Enerlyze services">
      <article className="pathway pathway-home">
        <div className="pathway-image"><img src="/home-energy.webp" alt="Illustrative solar-powered home surrounded by tropical greenery" loading="lazy" width="1536" height="1024"/></div>
        <div className="pathway-copy"><span className="pathway-label">For your home</span><h2>Small changes.<br/>Everyday impact.</h2><p>Understand your electricity bill, explore appliance consumption, and see where efficient products or solar could make a difference.</p><button className="action-link" onClick={()=>choose('home')}>Explore your energy <ArrowUpRight size={20}/></button></div>
      </article>
      <article className="pathway pathway-business">
        <div className="pathway-image"><img src="/industry.png" alt="Illustrative manufacturing facility with rooftop solar" loading="lazy" width="1536" height="1024"/></div>
        <div className="pathway-copy"><span className="pathway-label">For your business</span><h2>Better operations.<br/>Lighter footprint.</h2><p>Find energy losses at equipment level. Turn consumption and carbon insights into an efficiency plan and evidence for ESG reporting.</p><button className="action-link" onClick={()=>choose('business')}>Power your business <ArrowUpRight size={20}/></button></div>
      </article>
    </section>
    <section className="approach-section" aria-labelledby="approach-title">
      <div className="approach-heading"><h2 id="approach-title">Clarity that leads<br/>to change.</h2><p>A practical path from understanding your energy to using it better.</p></div>
      <div className="approach-list">
        <details open><summary><ScanLine aria-hidden="true"/><h3>Understand your impact</h3><span aria-hidden="true">+</span></summary><p>Map electrical consumption and identify carbon-heavy equipment, processes, and avoidable losses. Build a clearer picture of where your energy goes.</p></details>
        <details><summary><Sun aria-hidden="true"/><h3>Find a better option</h3><span aria-hidden="true">+</span></summary><p>Explore operational improvements, efficient equipment, and renewable solutions. Compare potential savings and payback before making an investment.</p></details>
        <details><summary><Leaf aria-hidden="true"/><h3>Turn insight into progress</h3><span aria-hidden="true">+</span></summary><p>Bring energy and emissions evidence into carbon and ESG reporting. Our future pipeline adds IoT monitoring and connected green solutions.</p></details>
      </div>
    </section>
  </>;
}
