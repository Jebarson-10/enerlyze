import {env} from 'cloudflare:workers';
import {db,fail,requireAdmin,sameOrigin} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
const MAX_IMAGE=5*1024*1024;
function format(bytes:Uint8Array,mime:string){
 if(mime==='image/png'&&bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n))return 'png';
 if(mime==='image/jpeg'&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'jpg';
 if(mime==='image/webp'&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'webp';
 return null;
}
export async function GET(request:Request){
 if(!await requireAdmin(request))return fail('Admin access required',403);
 const result=await db().prepare('SELECT id,mime,byte_size,published,created_at FROM media_assets ORDER BY created_at DESC LIMIT 100').all();
 return Response.json({media:result.results},{headers:{'Cache-Control':'no-store'}})
}
export async function POST(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 const user=await requireAdmin(request);if(!user)return fail('Admin access required',403);
 if(!env.BUCKET)return fail('Image storage is unavailable',503);
 if(Number(request.headers.get('content-length')||0)>MAX_IMAGE)return fail('Image must be 5 MB or smaller',413);
 const mime=request.headers.get('content-type')?.split(';')[0]?.trim()??'';
 if(!['image/png','image/jpeg','image/webp'].includes(mime))return fail('Choose a PNG, JPEG or WebP image');
 const bytes=new Uint8Array(await request.arrayBuffer());
 if(!bytes.length||bytes.length>MAX_IMAGE)return fail('Choose an image up to 5 MB',413);
 const ext=format(bytes,mime);
 if(!ext)return fail('Image file type does not match its contents');
 const id=crypto.randomUUID(),objectKey=`cms/${id}.${ext}`;
 try{
  await env.BUCKET.put(objectKey,bytes,{httpMetadata:{contentType:mime}});
  await db().prepare('INSERT INTO media_assets (id,object_key,mime,byte_size,uploaded_by,published,created_at) VALUES (?,?,?,?,?,0,?)').bind(id,objectKey,mime,bytes.length,user.id,Date.now()).run();
  return Response.json({id,url:`/media/${id}`},{status:201,headers:{'Cache-Control':'no-store'}})
 }catch{return fail('Image upload failed',503)}
}
