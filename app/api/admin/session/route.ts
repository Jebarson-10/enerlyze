import {clearSessionCookie,createSession,db,derivePassword,fail,findUser,getAdmin,hashToken,jsonBody,passwordPolicy,sameOrigin,validUsername,verifyPassword} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function GET(request:Request){const user=await getAdmin(request);return Response.json({user},{headers:{'Cache-Control':'no-store'}})}
export async function POST(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 const input=await jsonBody(request) as {username?:unknown;password?:unknown}|null;
 const username=String(input?.username??'').trim().toLowerCase(),password=String(input?.password??'');
 if(!validUsername(username)||password.length>128)return fail('Invalid username or password',401);
 try{
  const now=Date.now(),ip=request.headers.get('cf-connecting-ip')||'local',limitKey=await hashToken(`${ip}:${username}`);
  const attempt=await db().prepare('SELECT attempts,window_start FROM login_attempts WHERE key=?').bind(limitKey).first<{attempts:number;window_start:number}>();
  if(attempt&&attempt.window_start>now-15*60_000&&attempt.attempts>=10)return fail('Too many attempts. Try again later.',429);
  const user=await findUser(username);
  const valid=Boolean(user&&user.active&&user.locked_until<=now&&await verifyPassword(password,user.salt,user.password_hash));
  if(!valid){
   await db().prepare('INSERT INTO login_attempts (key,attempts,window_start) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN window_start<? THEN 1 ELSE attempts+1 END,window_start=CASE WHEN window_start<? THEN excluded.window_start ELSE window_start END').bind(limitKey,1,now,now-15*60_000,now-15*60_000).run();
   if(user&&user.active){const failures=user.failed_attempts+1;await db().prepare('UPDATE admin_users SET failed_attempts=?,locked_until=? WHERE id=?').bind(failures,failures>=5?now+15*60_000:0,user.id).run()}
   return fail('Invalid username or password',401);
  }
  await db().batch([db().prepare('DELETE FROM login_attempts WHERE key=?').bind(limitKey),db().prepare('UPDATE admin_users SET failed_attempts=0,locked_until=0 WHERE id=?').bind(user!.id)]);
  return Response.json({user:{id:user!.id,username:user!.username,role:user!.role}},{headers:{'Set-Cookie':await createSession(user!.id),'Cache-Control':'no-store'}});
 }catch{return fail('Sign-in is temporarily unavailable',503)}
}
export async function DELETE(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 const token=request.headers.get('cookie')?.split(';').map(part=>part.trim()).find(part=>part.startsWith('enerlyze_admin='))?.slice(15);
 if(token){try{await db().prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await hashToken(token)).run()}catch{}}
 return Response.json({ok:true},{headers:{'Set-Cookie':clearSessionCookie(),'Cache-Control':'no-store'}})
}
export async function PATCH(request:Request){
 if(!sameOrigin(request))return fail('Invalid request origin',403);
 const user=await getAdmin(request);if(!user)return fail('Admin access required',403);
 const input=await jsonBody(request) as {currentPassword?:unknown;newPassword?:unknown}|null;
 if(!passwordPolicy(input?.newPassword as string))return fail('New password must have at least 14 characters with letters and a number or symbol');
 const stored=await findUser(user.username);
 if(!stored||!await verifyPassword(String(input?.currentPassword??''),stored.salt,stored.password_hash))return fail('Current password is incorrect',403);
 const value=await derivePassword(input!.newPassword as string);
 await db().batch([db().prepare('UPDATE admin_users SET password_hash=?,salt=?,failed_attempts=0,locked_until=0,updated_at=? WHERE id=?').bind(value.hash,value.salt,Date.now(),user.id),db().prepare('DELETE FROM admin_sessions WHERE user_id=?').bind(user.id)]);
 return Response.json({ok:true},{headers:{'Set-Cookie':await createSession(user.id),'Cache-Control':'no-store'}});
}
