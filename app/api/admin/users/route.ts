import {db,derivePassword,fail,jsonBody,passwordPolicy,requireAdmin,sameOrigin,validUsername} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await requireAdmin(request,true))return fail('Super-admin access required',403);
 const result=await db().prepare('SELECT id,username,role,active,created_at,updated_at FROM admin_users ORDER BY created_at').all();
 return Response.json({users:result.results},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 if(!await requireAdmin(request,true))return fail('Super-admin access required',403);
 const input=await jsonBody(request) as {username?:unknown;password?:unknown}|null;
 const username=String(input?.username??'').trim().toLowerCase(),password=input?.password;
 if(!validUsername(username)||!passwordPolicy(password as string))return fail('Use a valid username and a password of at least 14 characters with letters and a number or symbol');
 try{const now=Date.now(),derived=await derivePassword(password as string);await db().prepare("INSERT INTO admin_users (id,username,password_hash,salt,role,active,failed_attempts,locked_until,created_at,updated_at) VALUES (?,?,?,?,'admin',1,0,0,?,?)").bind(crypto.randomUUID(),username,derived.hash,derived.salt,now,now).run();return Response.json({ok:true},{status:201})}
 catch{return fail('Username already exists or storage is unavailable',409)}
}
export async function PATCH(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 if(!await requireAdmin(request,true))return fail('Super-admin access required',403);
 const input=await jsonBody(request) as {id?:unknown;action?:unknown;password?:unknown}|null;
 const id=String(input?.id??''),action=String(input?.action??'');
 const target=await db().prepare('SELECT id,role,active FROM admin_users WHERE id=?').bind(id).first<{id:string;role:string;active:number}>();
 if(!target||target.role==='super_admin')return fail('Only ordinary admin accounts can be changed',403);
 if(action==='revoke'||action==='restore'){
  await db().batch([db().prepare('UPDATE admin_users SET active=?,updated_at=? WHERE id=?').bind(action==='restore'?1:0,Date.now(),id),db().prepare('DELETE FROM admin_sessions WHERE user_id=?').bind(id)]);
  return Response.json({ok:true});
 }
 if(action==='password'&&passwordPolicy(input?.password as string)){
  const value=await derivePassword(input!.password as string);
  await db().batch([db().prepare('UPDATE admin_users SET password_hash=?,salt=?,failed_attempts=0,locked_until=0,updated_at=? WHERE id=?').bind(value.hash,value.salt,Date.now(),id),db().prepare('DELETE FROM admin_sessions WHERE user_id=?').bind(id)]);
  return Response.json({ok:true});
 }
 return fail('Invalid account action');
}
