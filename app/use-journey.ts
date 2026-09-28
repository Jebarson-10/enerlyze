'use client';
import {useEffect,type RefObject,type Dispatch,type SetStateAction} from 'react';
export function useJourney(story:RefObject<HTMLElement|null>,progress:RefObject<number>,mode:string,compact:boolean,setChapter:Dispatch<SetStateAction<number>>){
 useEffect(()=>{
  const element=story.current;if(!element||mode==='choose')return;
  let frame=0,lastChapter=-1,lastHeader=-1;
  const update=()=>{
   const header=document.querySelector('.topbar')?.getBoundingClientRect().height??80;
   if(header!==lastHeader){lastHeader=header;element.style.setProperty('--nav-height',header+'px');}
   const rect=element.getBoundingClientRect();
   progress.current=Math.min(1,Math.max(0,(header-rect.top)/Math.max(1,element.offsetHeight-innerHeight+header)));
   let chapter=0;
   if(compact){
    const line=header+(element.querySelector('.journey-sticky')?.getBoundingClientRect().height??300)+32;
    element.querySelectorAll('.mobile-story article').forEach((node,i)=>{if(node.getBoundingClientRect().top<=line)chapter=i;});
   }else chapter=Math.min(3,Math.floor(progress.current*4));
   if(chapter!==lastChapter){lastChapter=chapter;setChapter(chapter);}
   frame=requestAnimationFrame(update);
  };update();return()=>cancelAnimationFrame(frame);
 },[story,progress,mode,compact,setChapter]);
}
