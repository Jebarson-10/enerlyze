import {env} from 'cloudflare:workers';
import {db,getAdmin} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!/^[0-9a-f-]{36}$/.test(id)||!env.BUCKET)return new Response('Not found',{status:404});
 const record=await db().prepare('SELECT object_key,mime,published FROM media_assets WHERE id=?').bind(id).first<{object_key:string;mime:string;published:number}>();
 if(!record||(!record.published&&!await getAdmin(request)))return new Response('Not found',{status:404});
 const object=await env.BUCKET.get(record.object_key);if(!object)return new Response('Not found',{status:404});
 return new Response(object.body,{headers:{'Content-Type':record.mime,'Content-Disposition':'inline','X-Content-Type-Options':'nosniff','Cache-Control':record.published?'public, max-age=3600':'private, no-store'}})
}
