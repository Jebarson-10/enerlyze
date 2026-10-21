import {env} from 'cloudflare:workers';
import {defaultContent,type PublicContent} from './content-fields';
import {products,type Product} from './products';

type RecordRow={key:string;payload_json:string};
async function rows():Promise<RecordRow[]>{
 if(!env.DB)return [];
 try{return (await env.DB.prepare('SELECT key, payload_json FROM published_records').all<RecordRow>()).results??[]}catch{return []}
}
export async function getPublishedState():Promise<{content:PublicContent;catalog:Product[]}>{
 const content={...defaultContent},catalog=new Map<string,Product>(products.map(product=>[product.id,product]));
 for(const row of await rows()){
  try{
   const value=JSON.parse(row.payload_json);
   if(row.key.startsWith('copy:')&&typeof value==='string')content[row.key.slice(5)]=value;
   if(row.key.startsWith('product:')){const id=row.key.slice(8);if(value===null)catalog.delete(id);else if(value&&typeof value==='object')catalog.set(id,value as Product)}
  }catch{}
 }
 return {content,catalog:[...catalog.values()]};
}
