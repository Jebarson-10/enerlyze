import {db,fail,jsonBody,requireAdmin,sameOrigin} from '@/lib/admin-auth';
import {contentFieldMap} from '@/lib/content-fields';
import type {Product,ProductCategory} from '@/lib/products';
export const dynamic='force-dynamic';

const categories:ProductCategory[]=['Fans','Cooling','Lighting','Solar','Wind'];
const mediaId=(value:string)=>/^\/media\/([0-9a-f-]{36})$/.exec(value)?.[1]??null;
const text=(value:unknown,max:number)=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
function validateProduct(value:unknown):value is Product{
 if(!value||typeof value!=='object')return false;
 const p=value as Partial<Product>;
 if(!text(p.id,50)||!/^[a-z0-9][a-z0-9-]{2,49}$/.test(p.id!))return false;
 if(!text(p.name,140)||!categories.includes(p.category as ProductCategory)||!text(p.description,600)||!text(p.spec,300))return false;
 if(typeof p.price!=='number'||!Number.isFinite(p.price)||p.price<0||p.price>10_000_000)return false;
 if(p.watts!==undefined&&(!Number.isFinite(p.watts)||p.watts<=0||p.watts>100_000))return false;
 if(p.capacityKw!==undefined&&(!Number.isFinite(p.capacityKw)||p.capacityKw<=0||p.capacityKw>100_000))return false;
 if(['Fans','Cooling','Lighting'].includes(p.category!)&&!p.watts)return false;
 if(['Solar','Wind'].includes(p.category!)&&!p.capacityKw)return false;
 if(p.replaces!==undefined&&!text(p.replaces,100))return false;
 if(typeof p.sample!=='boolean'||typeof p.affiliate!=='boolean')return false;
 if(p.buyUrl){try{const url=new URL(p.buyUrl);if(url.protocol!=='https:'||url.username||url.password)return false}catch{return false}}
 if(p.imageUrl!==undefined&&!mediaId(p.imageUrl))return false;
 return true;
}
async function mediaExists(id:string){return Boolean(await db().prepare('SELECT id FROM media_assets WHERE id=?').bind(id).first())}
export async function GET(request:Request){
 if(!await requireAdmin(request))return fail('Admin access required',403);
 const result=await db().prepare("SELECT c.id,c.kind,c.target_key,c.payload_json,c.base_change_id,c.status,c.created_at,c.reviewed_at,a.username AS author_name,r.username AS reviewer_name FROM content_changes c JOIN admin_users a ON c.author_id=a.id LEFT JOIN admin_users r ON c.reviewer_id=r.id ORDER BY CASE c.status WHEN 'pending' THEN 0 ELSE 1 END,c.created_at DESC LIMIT 150").all();
 return Response.json({changes:result.results},{headers:{'Cache-Control':'no-store'}})
}
export async function POST(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 const user=await requireAdmin(request);if(!user)return fail('Admin access required',403);
 const input=await jsonBody(request) as {kind?:unknown;key?:unknown;value?:unknown}|null;
 const kind=String(input?.kind??''),key=String(input?.key??'');let targetKey='';
 if(kind==='content'){
  const field=contentFieldMap.get(key),value=input?.value;
  if(!field||!text(value,field.type==='multiline'?5000:500))return fail('Invalid content field');
  if(field.type==='image'){
   const id=mediaId(value as string);if(!id&&!['/home-energy.webp','/industry.png'].includes(value as string))return fail('Upload an image first');
   if(id&&!await mediaExists(id))return fail('Image is unavailable');
  }
  if(key==='home.contact.email'&&!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value as string))return fail('Invalid email');
  if(key==='home.contact.phone'&&!/^\+?[0-9 ()-]{8,24}$/.test(value as string))return fail('Invalid phone');
  targetKey=`copy:${key}`;
 }else if(kind==='product'){
  if(!/^[a-z0-9][a-z0-9-]{2,49}$/.test(key))return fail('Invalid product ID');
  if(input?.value!==null&&(!validateProduct(input?.value)||(input.value as Product).id!==key))return fail('Invalid product details');
  const image=(input?.value as Product|null)?.imageUrl;
  if(image&&!await mediaExists(mediaId(image)!))return fail('Image is unavailable');
  targetKey=`product:${key}`;
 }else return fail('Invalid change type');
 try{
  const current=await db().prepare('SELECT change_id FROM published_records WHERE key=?').bind(targetKey).first<{change_id:string}>();
  await db().prepare("INSERT INTO content_changes (id,target_key,kind,payload_json,base_change_id,status,author_id,created_at) VALUES (?,?,?,?,?,'pending',?,?)").bind(crypto.randomUUID(),targetKey,kind,JSON.stringify(input!.value),current?.change_id??null,user.id,Date.now()).run();
  return Response.json({ok:true,message:'Submitted for super-admin approval'},{status:201,headers:{'Cache-Control':'no-store'}})
 }catch{return fail('Could not save the draft',503)}
}
export async function PATCH(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 const reviewer=await requireAdmin(request,true);if(!reviewer)return fail('Super-admin access required',403);
 const input=await jsonBody(request) as {id?:unknown;decision?:unknown}|null;
 const id=String(input?.id??''),decision=String(input?.decision??'');
 if(!/^[0-9a-f-]{36}$/.test(id)||!['approve','reject'].includes(decision))return fail('Invalid review action');
 const change=await db().prepare('SELECT target_key,payload_json,status,base_change_id FROM content_changes WHERE id=?').bind(id).first<{target_key:string;payload_json:string;status:string;base_change_id:string|null}>();
 if(!change||change.status!=='pending')return fail('This change is no longer pending',409);
 if(decision==='reject'){
  const result=await db().prepare("UPDATE content_changes SET status='rejected',reviewer_id=?,reviewed_at=? WHERE id=? AND status='pending'").bind(reviewer.id,Date.now(),id).run();
  return result.meta.changes?Response.json({ok:true}):fail('Already reviewed',409);
 }
 const current=await db().prepare('SELECT change_id FROM published_records WHERE key=?').bind(change.target_key).first<{change_id:string}>();
 if((current?.change_id??null)!==change.base_change_id)return fail('A newer version is live. Submit this change again before approval.',409);
 const now=Date.now(),nonce=crypto.randomUUID();
 const statements=[
  db().prepare("UPDATE content_changes SET status='approved',reviewer_id=?,review_nonce=?,reviewed_at=? WHERE id=? AND status='pending' AND COALESCE((SELECT change_id FROM published_records WHERE key=target_key),'')=COALESCE(base_change_id,'')").bind(reviewer.id,nonce,now,id),
  db().prepare("INSERT INTO published_records (key,payload_json,updated_at,change_id) SELECT target_key,payload_json,?,id FROM content_changes WHERE id=? AND status='approved' AND review_nonce=? ON CONFLICT(key) DO UPDATE SET payload_json=excluded.payload_json,updated_at=excluded.updated_at,change_id=excluded.change_id").bind(now,id,nonce),
 ];
 const match=/\/media\/([0-9a-f-]{36})/.exec(change.payload_json);
 if(match)statements.push(db().prepare("UPDATE media_assets SET published=1 WHERE id=? AND EXISTS (SELECT 1 FROM content_changes WHERE id=? AND review_nonce=?)").bind(match[1],id,nonce));
 const result=await db().batch(statements);
 return result[0].meta.changes?Response.json({ok:true,message:'Published immediately'}):fail('This draft became outdated before approval',409);
}
