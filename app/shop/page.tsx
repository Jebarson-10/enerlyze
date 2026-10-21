import type {Metadata} from 'next';
import SiteHeader from '../site-header';
import ProductShop from './product-shop';
import {getPublishedState} from '@/lib/published';
import {contentValue} from '@/lib/content-fields';
import {pageMetadata,breadcrumbData} from '@/lib/seo';
import SeoJsonLd from '../seo-json-ld';
export async function generateMetadata():Promise<Metadata>{const {content}=await getPublishedState();return pageMetadata({title:contentValue(content,'seo.shop.title'),description:contentValue(content,'seo.shop.description'),path:'/shop'})}
export const dynamic='force-dynamic';
export default async function ShopPage(){const {catalog,content}=await getPublishedState();return <div className="site shop-page"><SeoJsonLd data={breadcrumbData([{name:'Home',path:'/'},{name:'Product previews',path:'/shop'}])}/><SiteHeader active="shop"/><main><ProductShop catalog={catalog} content={content}/></main><footer className="tool-footer"><a href="/">Enerlyze</a><a href="/guides/reduce-electricity-bill-india">Saving guide</a><a href="/guides/solar-panel-savings-calculator-india">Solar guide</a><a href="/calculator">Calculate your savings →</a></footer></div>}
