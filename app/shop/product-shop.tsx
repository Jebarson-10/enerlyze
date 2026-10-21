'use client';
import {useState} from 'react';
import {Fan,Sun,Wind,Snowflake,Lightbulb,ArrowUpRight} from 'lucide-react';
import {money,type Product,type ProductCategory} from '@/lib/products';
import {contentValue,type PublicContent} from '@/lib/content-fields';
import ProductCarbon from './product-carbon';
import {CarbonSources} from '../calculator/carbon-visuals';
const icons={Fans:Fan,Solar:Sun,Wind:Wind,Cooling:Snowflake,Lighting:Lightbulb};
export default function ProductShop({catalog,content}:{catalog:Product[];content:PublicContent}){
 const [category,setCategory]=useState('All');
 const filtered=catalog.filter(p=>category==='All'||p.category===category);
 const hasAvailable=catalog.some(p=>p.buyUrl&&!p.sample);
 return <><div className="shop-intro"><span className="pathway-label">Enerlyze products</span><h1>{contentValue(content,'shop.hero.title')}</h1><p>{contentValue(content,'shop.hero.body')}</p><div className="shop-availability">{hasAvailable?'Verified partner listings show an active Buy link. Preview products remain unavailable until their details are confirmed.':'Buying is coming soon. Explore our upcoming range below. Product specifications and indicative prices will be confirmed when partner listings launch.'}</div></div><div className="shop-toolbar"><nav aria-label="Product categories">{['All','Fans','Cooling','Lighting','Solar','Wind'].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</nav><span>{filtered.length} options</span></div><section className="product-grid" aria-label="Products">{filtered.map(p=>{const Icon=icons[p.category as ProductCategory];const available=Boolean(p.buyUrl&&!p.sample);return <article id={p.id} key={p.id} className="product-card"><div className={`product-art art-${p.category.toLowerCase()}`}>{p.imageUrl?<img src={p.imageUrl} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<Icon size={88} strokeWidth={1} aria-hidden="true"/>}</div><div className="product-copy"><span className="recommendation-tag">{available?'Partner product':'Preview · coming soon'}</span><h2>{p.name}</h2><p>{p.description}</p><span className="product-spec">{p.spec}</span><ProductCarbon product={p}/><div className="product-price"><strong>{money(p.price)}</strong><span>{p.sample?'indicative price':''}</span></div>{available?<a className="buy-button" href={p.buyUrl} target="_blank" rel="noopener noreferrer">Buy <ArrowUpRight size={18}/></a>:<button className="buy-button" disabled title="Buying will be available when partner listings launch">Buy <ArrowUpRight size={18}/></button>}<a href="/calculator" className="calculate-link">Compare savings with Enerlyzer</a></div></article>})}</section><section className="shop-carbon-sources"><CarbonSources/></section></>;
}
