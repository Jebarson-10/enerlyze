'use client';

import { ArrowUpRight, Leaf, ScanLine, Sun } from 'lucide-react';
import {contentValue,type PublicContent} from '@/lib/content-fields';

export default function CompanyOverview({content}:{content:PublicContent}) {
  const c=(key:string)=>contentValue(content,key);
  return <>
    <section className="purpose-section" aria-labelledby="purpose-title">
      <h2 id="purpose-title">{c('home.purpose.title1')}<br/><span>{c('home.purpose.title2')}</span></h2>
      <div className="purpose-body"><p>{c('home.purpose.intro')}</p><p>{c('home.purpose.body')}</p></div>
    </section>
    <section className="pathways" aria-label="Explore Enerlyze services">
      <article className="pathway pathway-home">
        <div className="pathway-image"><img src={c('home.home.image')} alt="Solar-powered home and greener lifestyle" loading="lazy" width="1536" height="1024"/></div>
        <div className="pathway-copy"><span className="pathway-label">For your home</span><h2>{c('home.home.title')}</h2><p>{c('home.home.body')}</p><a className="action-link" href="/calculator">Open Enerlyzer <ArrowUpRight size={20}/></a></div>
      </article>
      <article className="pathway pathway-business">
        <div className="pathway-image"><img src={c('home.business.image')==='/industry.png'?'/industry.webp':c('home.business.image')} alt="Manufacturing facility with cleaner energy" loading="lazy" width="1536" height="864"/></div>
        <div className="pathway-copy"><span className="pathway-label">For your business</span><h2>{c('home.business.title')}</h2><p>{c('home.business.body')}</p><a className="action-link" href="/business">Explore business analytics <ArrowUpRight size={20}/></a></div>
      </article>
    </section>
    <section className="approach-section" aria-labelledby="approach-title">
      <div className="approach-heading"><h2 id="approach-title">{c('home.approach.title')}</h2><p>{c('home.approach.body')}</p></div>
      <div className="approach-list">
        <details open><summary><ScanLine aria-hidden="true"/><h3>{c('home.approach.1.title')}</h3><span aria-hidden="true">+</span></summary><p>{c('home.approach.1.body')}</p></details>
        <details><summary><Sun aria-hidden="true"/><h3>{c('home.approach.2.title')}</h3><span aria-hidden="true">+</span></summary><p>{c('home.approach.2.body')}</p></details>
        <details><summary><Leaf aria-hidden="true"/><h3>{c('home.approach.3.title')}</h3><span aria-hidden="true">+</span></summary><p>{c('home.approach.3.body')}</p></details>
      </div>
    </section>
    <section className="home-knowledge" aria-labelledby="home-knowledge-title">
      <span className="pathway-label">ENERGY INTELLIGENCE, MADE ACCESSIBLE</span>
      <h2 id="home-knowledge-title">Understand your energy. Reduce your impact.</h2>
      <p>Enerlyze Private Limited is based in Thiruvananthapuram, Kerala. Enerlyzer helps households in India estimate electricity use from a bill, understand associated CO₂ and compare practical savings scenarios. For businesses, we discuss scoped equipment-level electricity analysis and reporting evidence. Every estimate states its assumptions and limits.</p>
      <div className="home-knowledge-links"><a href="/enerlyzer">What Enerlyzer does ↗</a><a href="/guides">Explore energy guides ↗</a><a href="/about">About Enerlyze ↗</a><a href="/methodology">How we calculate ↗</a></div>
    </section>
  </>;
}
