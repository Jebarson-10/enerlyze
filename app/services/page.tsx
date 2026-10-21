import type {Metadata} from 'next';
import InfoShell from '../info-shell';
import SeoJsonLd from '../seo-json-ld';
import {getPublishedState} from '@/lib/published';
import {contentValue} from '@/lib/content-fields';
import {serviceOffers} from '@/lib/service-offers';
import {breadcrumbData,canonical,pageMetadata} from '@/lib/seo';

export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{
 const {content}=await getPublishedState();
 return pageMetadata({title:contentValue(content,'seo.services.title'),description:contentValue(content,'seo.services.description'),path:'/services'});
}

export default async function ServicesPage(){
 const {content}=await getPublishedState();
 const c=(key:string)=>contentValue(content,key);
 const email=c('home.contact.email');
 const enquiry=(subject:string)=>`mailto:${email}?subject=${encodeURIComponent(subject)}`;
 const structuredServices=serviceOffers.map(offer=>({
  '@context':'https://schema.org','@type':'Service','@id':canonical(`/services#${offer.id}`),
  name:c(`services.${offer.id}.title`),description:c(`services.${offer.id}.body`),
  serviceType:offer.title,provider:{'@id':canonical('/#organization')},
  areaServed:{'@type':'Country',name:'India'},url:canonical(`/services#${offer.id}`),
 }));
 return <InfoShell active="services">
  <SeoJsonLd data={[breadcrumbData([{name:'Home',path:'/'},{name:'Business',path:'/business'},{name:'Services',path:'/services'}]),...structuredServices]}/>
  <nav className="info-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/business">Business</a><span>/</span><span>Services</span></nav>
  <section className="info-hero services-hero" aria-labelledby="services-title">
   <span className="pathway-label">ENERLYZE / BUSINESS SERVICES</span>
   <h1 id="services-title">{c('services.hero.title')}</h1>
   <p>{c('services.hero.body')}</p>
   <div className="services-hero-actions"><a className="buy-button" href={enquiry('Enerlyze business services enquiry')}>Discuss a project ↗</a><a className="services-text-link" href="#services-list">Explore services ↓</a></div>
  </section>
  <div className="services-overview" aria-label="How we work"><span><b>01</b> Measure what matters</span><span><b>02</b> Find practical changes</span><span><b>03</b> Track the result</span></div>
  <section className="services-list" id="services-list" aria-labelledby="services-list-title">
   <div className="services-section-heading"><span className="pathway-label">THE WORK</span><h2 id="services-list-title">Choose the right starting point.</h2><p>Each engagement is scoped around the data you have and the decision you need to make.</p></div>
   <div className="services-grid">{serviceOffers.map(offer=><article className="service-offer" id={offer.id} key={offer.id}>
    <div className="service-offer-top"><span>{offer.number} / {offer.category}</span><span aria-hidden="true">↗</span></div>
    <h3>{c(`services.${offer.id}.title`)}</h3>
    <p>{c(`services.${offer.id}.body`)}</p>
    <h4>What you receive</h4>
    <ul>{offer.deliverables.map((_,index)=><li key={index}>{c(`services.${offer.id}.deliverable.${index+1}`)}</li>)}</ul>
    <div className="service-offer-foot"><span>{offer.format}</span><a href={enquiry(`Enerlyze enquiry: ${c(`services.${offer.id}.title`)}`)}>Enquire about this service ↗</a></div>
   </article>)}</div>
  </section>
  <section className="services-scope" aria-labelledby="scope-title"><div><span className="pathway-label">CARBON AUDIT / ENERGY AUDIT</span><h2 id="scope-title">Know what an assessment includes.</h2></div><div><p>Our carbon footprint work prepares a documented emissions inventory and evidence for review. Independent verification or assurance is a separate engagement by a qualified third party. Likewise, our operational energy assessment is not a statutory energy audit by a BEE-accredited energy auditor.</p><p>Where a formal audit or assurance is required, we can define the data handover and help you identify the appropriate accredited provider. Any such arrangement is agreed during scoping.</p></div></section>
  <section className="info-cta services-cta"><span className="pathway-label">START A CONVERSATION</span><h2>{c('services.cta.title')}</h2><p>{c('services.cta.body')}</p><a className="buy-button" href={enquiry('Enerlyze services: scope a project')}>Request a scope and proposal ↗</a><small>Engagements are quoted after scoping; no fixed price or guaranteed savings are implied.</small></section>
 </InfoShell>;
}
