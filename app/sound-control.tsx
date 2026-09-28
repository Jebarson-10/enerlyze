'use client';
import {useEffect} from 'react';
import {enableSound,playCue,soundEnabled,pauseSound} from '@/lib/sound';
export default function SoundControl(){
 useEffect(()=>{
  let starting=false;
  const activate=(event:Event)=>{
   if(!event.isTrusted||starting||soundEnabled())return;
   starting=true;void enableSound(true).finally(()=>{starting=false;});
  };
  const interactive=(event:Event)=>(event.target as Element)?.closest?.('button:not(:disabled),a,input,select,summary,[role=combobox],[role=tab]');
  const click=(event:Event)=>{if(interactive(event))playCue('tap');};
  const hover=(event:PointerEvent)=>{if(event.pointerType!=='touch'&&interactive(event)&&!interactive(event)?.contains(event.relatedTarget as Node|null))playCue('hover');};
  const change=()=>playCue('change');const visibility=()=>pauseSound(document.hidden);
  document.addEventListener('pointerdown',activate,true);document.addEventListener('keydown',activate,true);
  document.addEventListener('click',click);document.addEventListener('pointerover',hover);document.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);
  return()=>{document.removeEventListener('pointerdown',activate,true);document.removeEventListener('keydown',activate,true);document.removeEventListener('click',click);document.removeEventListener('pointerover',hover);document.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility)};
 },[]);return null;
}
