import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';

export type AdminRole='super_admin'|'admin';
export type AdminIdentity={id:string;username:string;role:AdminRole};
type UserRow=AdminIdentity&{password_hash:string;salt:string;active:number;failed_attempts:number;locked_until:number};
const COOKIE='enerlyze_admin';
const SESSION_MS=12*60*60*1000;
const encoder=new TextEncoder();
const hex=(bytes:Uint8Array)=>[...bytes].map(byte=>byte.toString(16).padStart(2,'0')).join('');
export const db=()=>{if(!env.DB)throw new Error('Admin storage is unavailable');return env.DB};
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return Boolean(origin&&origin===new URL(request.url).origin)}
export function fail(message:string,status=400){return Response.json({error:message},{status,headers:{'Cache-Control':'no-store'}})}
export function randomToken(){return hex(crypto.getRandomValues(new Uint8Array(32)))}
export async function hashToken(value:string){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))))}
export function passwordPolicy(value:string){return typeof value==='string'&&value.length>=14&&value.length<=128&&/[A-Za-z]/.test(value)&&/[^A-Za-z]/.test(value)}
export function validUsername(value:string){return typeof value==='string'&&/^[a-z][a-z0-9.@_-]{3,31}$/.test(value)}
export async function derivePassword(password:string,salt?:string){
 const saltBytes=salt?Uint8Array.from(salt.match(/.{2}/g)!.map(part=>parseInt(part,16))):crypto.getRandomValues(new Uint8Array(24));
 let input=new Uint8Array(encoder.encode(password));
 for(let round=0;round<4;round++){
  const roundSalt=new Uint8Array(saltBytes.length+1);roundSalt.set(saltBytes);roundSalt[saltBytes.length]=round;
  const material=await crypto.subtle.importKey('raw',input,'PBKDF2',false,['deriveBits']);
  input=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:roundSalt,iterations:100000,hash:'SHA-256'},material,256));
 }
 return {salt:hex(saltBytes),hash:hex(input)};
}
export async function verifyPassword(password:string,salt:string,expected:string){
 const {hash}=await derivePassword(password,salt);let diff=hash.length^expected.length;
 for(let i=0;i<Math.max(hash.length,expected.length);i++)diff|=(hash.charCodeAt(i)||0)^(expected.charCodeAt(i)||0);
 return diff===0;
}
export async function createSession(userId:string){
 const token=randomToken(),tokenHash=await hashToken(token),now=Date.now();
 await db().prepare('INSERT INTO admin_sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)').bind(tokenHash,userId,now+SESSION_MS,now).run();
 return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_MS/1000}`;
}
export function clearSessionCookie(){return `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`}
function cookieValue(request:Request){return request.headers.get('cookie')?.split(';').map(part=>part.trim()).find(part=>part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1)??null}
export async function getAdmin(request:Request):Promise<AdminIdentity|null>{
 const token=cookieValue(request);if(!token||!env.DB)return null;
 const tokenHash=await hashToken(token);
 const user=await db().prepare('SELECT u.id,u.username,u.role FROM admin_sessions s JOIN admin_users u ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1').bind(tokenHash,Date.now()).first<AdminIdentity>();
 return user??null;
}
export async function requireAdmin(request:Request,superOnly=false){const user=await getAdmin(request);if(!user)return null;if(superOnly&&user.role!=='super_admin')return null;return user}
export async function ownerMayBootstrap(){
 const ownerEmail=(env as Cloudflare.Env&{ADMIN_OWNER_EMAIL?:string}).ADMIN_OWNER_EMAIL?.trim().toLowerCase();
 const visitor=await getChatGPTUser();
 return Boolean(ownerEmail&&visitor?.email.trim().toLowerCase()===ownerEmail);
}
export async function findUser(username:string){return db().prepare('SELECT id,username,role,password_hash,salt,active,failed_attempts,locked_until FROM admin_users WHERE username=?').bind(username).first<UserRow>()}
export function jsonBody(request:Request){return request.json().catch(()=>null) as Promise<unknown>}
