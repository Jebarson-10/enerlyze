"use client";
import {useEffect,useRef} from 'react';
export default function PointLogo({motion=true}:{motion?:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current!,ctx=canvas.getContext('2d')!;
  canvas.width=112;canvas.height=112;
  const points:number[][]=[];
  for(let i=0;i<145;i++){
   const y=1-(i+.5)/145*2,r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5));
   points.push([Math.cos(a)*r,y,Math.sin(a)*r]);
  }
  let frame=0;
  const draw=(time:number)=>{
   ctx.clearRect(0,0,112,112);
   const angle=motion?time*.00016:.25;
   const rotated=points.map(([x,y,z])=>[x*Math.cos(angle)+z*Math.sin(angle),y,-x*Math.sin(angle)+z*Math.cos(angle)]).sort((a,b)=>a[2]-b[2]);
   const dotColor=document.documentElement.dataset.theme==='dark'?'#ffffff':'#173b70';
   for(const [x,y,z] of rotated){
    ctx.globalAlpha=.6+(z+1)*.19;
    ctx.fillStyle=dotColor;
    ctx.beginPath();ctx.arc(56+x*44,56+y*44,1.7+(z+1)*.5,0,Math.PI*2);ctx.fill();
   }
   ctx.globalAlpha=1;
   if(motion)frame=requestAnimationFrame(draw);
  };
  const themeObserver=new MutationObserver(()=>{if(!motion)draw(performance.now())});
  themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  draw(0);return()=>{cancelAnimationFrame(frame);themeObserver.disconnect()};
 },[motion]);
 return <span className="point-logo-wrap" aria-hidden="true"><canvas ref={ref} className="point-logo"/></span>;
}

