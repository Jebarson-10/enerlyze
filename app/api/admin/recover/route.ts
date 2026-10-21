import {createSession,db,derivePassword,fail,jsonBody,ownerMayBootstrap,passwordPolicy,sameOrigin} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 if(!await ownerMayBootstrap())return fail('Only the verified site owner can recover this account',403);
 const input=await jsonBody(request) as {password?:unknown}|null;
 if(!passwordPolicy(input?.password as string))return fail('Use at least 14 characters with letters and a number or symbol');
 const superAdmin=await db().prepare("SELECT id,username FROM admin_users WHERE role='super_admin' AND active=1 LIMIT 1").first<{id:string;username:string}>();
 if(!superAdmin)return fail('Super-admin account is not initialized',404);
 const value=await derivePassword(input!.password as string);
 await db().batch([db().prepare('UPDATE admin_users SET password_hash=?,salt=?,failed_attempts=0,locked_until=0,updated_at=? WHERE id=?').bind(value.hash,value.salt,Date.now(),superAdmin.id),db().prepare('DELETE FROM admin_sessions WHERE user_id=?').bind(superAdmin.id)]);
 return Response.json({user:{id:superAdmin.id,username:superAdmin.username,role:'super_admin'}},{headers:{'Set-Cookie':await createSession(superAdmin.id),'Cache-Control':'no-store'}});
}
