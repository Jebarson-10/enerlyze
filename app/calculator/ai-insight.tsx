'use client';
import {useEffect,useState} from 'react';
import type {Usage} from '@/lib/recommendations';
export default function AIInsight({items,rate,days}:{items:Usage[];rate:number;days:number}){
 const [available,setAvailable]=useState(false);const [text,setText]=useState('Recommendations use catalog matching and calculated savings. AI explanations are not connected yet.');const [loading,setLoading]=useState(false);
 useEffect(()=>{const controller=new AbortController();fetch('/api/energy-insights',{signal:controller.signal}).then(r=>r.json() as Promise<{enabled?:boolean}>).then(data=>setAvailable(data.enabled===true)).catch(()=>{});return()=>controller.abort()},[]);
 useEffect(()=>{if(!available)return;const controller=new AbortController();const timer=setTimeout(()=>{setLoading(true);fetch('/api/energy-insights',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items,rate,days}),signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json() as Promise<{text:string}>}).then(data=>setText(data.text)).catch(()=>{if(!controller.signal.aborted)setText('AI explanations are temporarily unavailable. The calculated product comparisons remain available.')}).finally(()=>{if(!controller.signal.aborted)setLoading(false)})},900);return()=>{clearTimeout(timer);controller.abort()}},[available,items,rate,days]);
 return <aside className="ai-insight" aria-live="polite"><strong>{available?'Energy insights':'How these recommendations work'}</strong><p>{loading?'Preparing an explanation of your updated comparisons…':text}</p></aside>;
}
