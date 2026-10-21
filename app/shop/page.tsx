import type {Metadata} from 'next';
import SiteHeader from '../site-header';
import ProductShop from './product-shop';
import {getPublishedState} from '@/lib/published';
import {contentValue} from '@/lib/content-fields';
const baseMetadata:Metadata={title:'Efficient Energy Products',description:'Explore Enerlyze sample concepts for efficient fans, solar and other lower-impact products. Product purchasing will be available when verified partner listings launch.',alternates:{canonical:'/shop'},openGraph:{title:'Efficient Energy Products | Enerlyze',description:'Explore practical choices for lower energy use and a lighter footprint.',url:'/shop',images:[{url:'/og-image.png',width:1200,height:630,alt:'Enerlyze energy intelligence'}]}};
export async function generateMetadata():Promise<Metadata>{const {content}=await getPublishedState();return {...baseMetadata,title:contentValue(content,'seo.shop.title'),description:contentValue(content,'seo.shop.description')}}
export const dynamic='force-dynamic';
export default async function ShopPage(){const {catalog,content}=await getPublishedState();return <div className="site shop-page"><SiteHeader active="shop"/><main><ProductShop catalog={catalog} content={content}/></main><footer className="tool-footer"><a href="/">Enerlyze</a><a href="/calculator">Calculate your savings →</a></footer></div>}
