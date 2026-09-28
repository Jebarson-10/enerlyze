'use client';
import {useEffect,useState} from 'react';
import {Volume2,VolumeX} from 'lucide-react';
import {enableSound,playCue,soundEnabled,pauseSound} from '@/lib/sound';
export function SoundButton({className='sound-control'}:{className?:string}){
 const [on,setOn]=useState(false);
 useEffect(()=>{setOn(soundEnabled());const update=(event:Event)=>setOn((event as CustomEvent<boolean>).detail);window.addEventListener('enerlyze-sound',update);return()=>window.removeEventListener('enerlyze-sound',update)},[]);
 return <button className={className} aria-pressed={on} aria-label={on?'Mute sound effects':'Enable sound effects'} title={on?'Mute sound effects':'Enable water, steam, machinery and interaction sounds'} onClick={()=>void enableSound(!soundEnabled())}>{on?<Volume2 aria-hidden="true"/>:<VolumeX aria-hidden="true"/>}<span>Sound {on?'on':'off'}</span></button>;
}
export default function SoundControl(){
 useEffect(()=>{
  const interactive=(event:Event)=>(event.target as Element)?.closest?.('button:not(:disabled),a,input,select,summary,[role=combobox],[role=tab]');
  const click=(event:Event)=>{if(interactive(event))playCue('tap');};
  const hover=(event:PointerEvent)=>{if(event.pointerType!=='touch'&&interactive(event)&&!interactive(event)?.contains(event.relatedTarget as Node|null))playCue('hover');};
  const change=()=>playCue('change');const visibility=()=>pauseSound(document.hidden);
  document.addEventListener('click',click);document.addEventListener('pointerover',hover);document.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);
  return()=>{document.removeEventListener('click',click);document.removeEventListener('pointerover',hover);document.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility)};
 },[]);return <SoundButton/>;
}
