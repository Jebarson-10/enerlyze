import {createSession,db,derivePassword,fail,jsonBody,ownerMayBootstrap,passwordPolicy,sameOrigin,validUsername} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function GET(){
 try{const row=await db().prepare('SELECT COUNT(*) AS count FROM admin_users').first<{count:number}>();return Response.json({setupRequired:!row?.count,ownerVerified:await ownerMayBootstrap()},{headers:{'Cache-Control':'no-store'}})}
 catch{return fail('Admin storage is not ready',503)}
}
export async function POST(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 if(!await ownerMayBootstrap())return fail('Only the site owner can initialize the console',403);
 const input=await jsonBody(request) as {username?:unknown;password?:unknown}|null;
 const username=String(input?.username??'').trim().toLowerCase(),password=input?.password;
 if(!validUsername(username)||!passwordPolicy(password as string))return fail('Use a valid username and a password of at least 14 characters with letters and a number or symbol');
 try{
  const now=Date.now(),id=crypto.randomUUID(),derived=await derivePassword(password as string);
  const result=await db().prepare("INSERT INTO admin_users (id,username,password_hash,salt,role,active,failed_attempts,locked_until,created_at,updated_at) SELECT ?,?,?,?,'super_admin',1,0,0,?,? WHERE NOT EXISTS (SELECT 1 FROM admin_users)").bind(id,username,derived.hash,derived.salt,now,now).run();
  if(!result.meta.changes)return fail('The super-admin account has already been created',409);
  return Response.json({ok:true,username,role:'super_admin'},{headers:{'Set-Cookie':await createSession(id),'Cache-Control':'no-store'}});
 }catch(error){console.error('Admin bootstrap failed',error);return fail('Could not create the super-admin account',503)}
}
