import type {Metadata} from 'next';
import SiteHeader from '../site-header';
import ProductShop from './product-shop';
export const metadata:Metadata={title:'Efficient Energy Products',description:'Explore Enerlyze sample concepts for efficient fans, solar and other lower-impact products. Product purchasing will be available when verified partner listings launch.',alternates:{canonical:'/shop'},openGraph:{title:'Efficient Energy Products | Enerlyze',description:'Explore practical choices for lower energy use and a lighter footprint.',url:'/shop',images:[{url:'/og-image.png',width:1200,height:630,alt:'Enerlyze energy intelligence'}]}};
export default function ShopPage(){return <div className="site shop-page"><SiteHeader active="shop"/><main><ProductShop/></main><footer className="tool-footer"><a href="/">Enerlyze</a><a href="/calculator">Calculate your savings →</a></footer></div>}
