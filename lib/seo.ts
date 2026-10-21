import type {Metadata} from 'next';

export const SITE_URL='https://www.enerlyze.in';
export const OG_IMAGE='/og-image.png';

export function canonical(path:string){return `${SITE_URL}${path==='/'?'':path}`;}

export function pageMetadata({title,description,path,type='website'}:{title:string;description:string;path:string;type?:'website'|'article'}):Metadata{
  return {
    title:{absolute:title},description,
    alternates:{canonical:path},
    robots:{index:true,follow:true},
    openGraph:{type,siteName:'Enerlyze',locale:'en_IN',title,description,url:path,images:[{url:OG_IMAGE,width:1200,height:630,alt:'Enerlyze energy intelligence'}]},
    twitter:{card:'summary_large_image',title,description,images:[OG_IMAGE]},
  };
}

export function jsonLd(value:unknown){return JSON.stringify(value).replace(/</g,'\\u003c');}

export function breadcrumbData(items:{name:string;path:string}[]){
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:canonical(item.path)}))};
}
