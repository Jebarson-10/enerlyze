'use client';
import {useMemo} from 'react';
import {ArrowUpRight,TrendingDown} from 'lucide-react';
import {recommendUpgrades,solarScenario,type Usage} from '@/lib/recommendations';
import {money,products} from '@/lib/products';
import AIInsight from './ai-insight';

export default function Recommendations({items,rate,days,units}:{items:Usage[];rate:number;days:number;units:number}){
 const suggestions=useMemo(()=>recommendUpgrades(items,rate,days),[items,rate,days]);
 const solar=products.find(p=>p.category==='Solar')!;
 const solarResult=solarScenario(units,days,rate,solar.capacityKw!,solar.price,4,80);
 return <section className="recommendations" aria-labelledby="recommendation-title"><div className="recommendation-heading"><TrendingDown aria-hidden="true"/><div><h3 id="recommendation-title">Your next efficient move</h3><p>Matched to your appliances and usage. Relevant partner catalog options take priority.</p></div></div><p className="sample-notice">Sample catalog: all products, prices, and specifications below are illustrative. Savings use your entered wattage and hours, not verified performance or live prices.</p>
 <AIInsight items={items} rate={rate} days={days}/>
 <div className="upgrade-list" aria-live="polite">{suggestions.length===0?<p className="empty-recommendations">No lower-power catalog match for this usage. Add a fan, AC, or light, or enter your current device’s wattage. Lower hours and an appropriate tariff are needed to estimate savings.</p>:suggestions.map(s=><article key={s.appliance.id} className="upgrade-card"><div><span className="recommendation-tag">Sample partner option</span><h4>{s.appliance.name} → {s.product.name}</h4><p>{s.appliance.watts} W to {s.product.watts} W, with the same {s.appliance.hours} hours/day and {s.appliance.quantity} device{s.appliance.quantity===1?'':'s'}.</p>{s.product.category==='Cooling'&&<p className="note">AC usage is highly variable. The 850 W figure is an assumed average, not a rated or certified saving. Match cooling capacity before comparing.</p>}</div><dl><div><dt>Replacement cost</dt><dd>{money(s.totalCost)}</dd></div><div><dt>Save per {days} days</dt><dd>{money(s.periodSavings)}</dd></div><div><dt>Annual savings</dt><dd>{money(s.annualSavings)}</dd></div><div><dt>Simple payback</dt><dd>{s.paybackYears.toFixed(1)} years</dd></div></dl><a className="action-link" href={`/shop#${s.product.id}`}>View this option <ArrowUpRight size={18}/></a></article>)}</div>
 {solarResult.annualSavings>0&&<article className="solar-suggestion"><div><span className="recommendation-tag">A renewable alternative</span><h4>{solar.name}</h4><p>At 4 peak sun hours/day, 20% system losses, and 80% self-consumption, capped by your current billed usage.</p></div><dl><div><dt>Sample installed cost</dt><dd>{money(solar.price)}</dd></div><div><dt>Annual savings</dt><dd>{money(solarResult.annualSavings)}</dd></div><div><dt>Simple payback</dt><dd>{solarResult.paybackYears?.toFixed(1)} years</dd></div></dl><a className="action-link" href={`/shop#${solar.id}`}>Explore solar <ArrowUpRight size={18}/></a></article>}
 <p className="note">Each option is a separate scenario. Do not add solar and equipment savings together without recalculating the reduced load. Payback excludes maintenance, financing, degradation, and tariff changes. Wind needs a site assessment before any savings estimate.</p></section>;
}
