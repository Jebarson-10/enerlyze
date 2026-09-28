import type {Metadata} from 'next';
import SiteHeader from '../site-header';
import ProductShop from './product-shop';
export const metadata:Metadata={title:'Efficient products | Enerlyze',description:'Explore sample efficient appliances and renewable energy products, connected to energy-saving comparisons.'};
export default function ShopPage(){return <div className="site shop-page"><SiteHeader active="shop"/><main><ProductShop/></main><footer className="tool-footer"><a href="/">Enerlyze</a><a href="/calculator">Calculate your savings →</a></footer></div>}
