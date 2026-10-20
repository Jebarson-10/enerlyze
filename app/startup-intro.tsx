'use client';
import {useEffect,useRef,useState} from 'react';
import {introSound,playCue} from '@/lib/sound';

const DURATION=4.6;
const labels=['WATER + HEAT','STEAM + MOTION','ELECTRICITY','enerlyze'];
const descriptions=['Water meets an LPG flame.','Steam spins the turbine.','Rotation generates electricity.','Your personal partner for a greener lifestyle.'];
const colors=['#365cff','#00aa99','#ec4e78','#f4bc25','#9968e6'];
const smooth=(v:number)=>{const x=Math.max(0,Math.min(1,v));return x*x*(3-2*x)};
const phase=(t:number)=>t<1.2?0:t<2.45?1:t<3.55?2:3;

function PixelScene({onPhase,onFinish}:{onPhase:(n:number)=>void;onFinish:()=>void}){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const callbacks=useRef({onPhase,onFinish});callbacks.current={onPhase,onFinish};
 useEffect(()=>{
  const canvas=canvasRef.current,ctx=canvas?.getContext('2d',{alpha:true});
  if(!canvas||!ctx){callbacks.current.onFinish();return}
  let width=1,height=1,dpr=1,frame=0,lastPhase=-1,finished=false;
  const started=performance.now();
  const resize=()=>{width=Math.max(1,canvas.clientWidth);height=Math.max(1,canvas.clientHeight);dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)};
  window.addEventListener('resize',resize,{passive:true});resize();
  const rect=(x:number,y:number,w:number,h:number,color:string,alpha=1)=>{ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));ctx.globalAlpha=1};
  const dot=(x:number,y:number,size:number,color:string,alpha=1)=>rect(x,y,size,size,color,alpha);
  const draw=(t:number)=>{
   const narrow=width<620,W=narrow?440:800,H=460,scale=Math.min(width/W,height/H);
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   ctx.setTransform(dpr*scale,0,0,dpr*scale,dpr*(width-W*scale)/2,dpr*(height-H*scale)/2);ctx.imageSmoothingEnabled=false;
   const dark=document.documentElement.dataset.theme==='dark',ink=dark?'#e7e9f2':'#242931',soft=dark?'#5d6473':'#bdc4d0';
   const potX=narrow?143:245,rotorX=narrow?330:560,center=W/2;
   const potA=1-smooth((t-2.55)/.5),rotorA=smooth((t-.85)/.3)*(1-smooth((t-2.7)/.4)),logoA=smooth((t-2.55)/.6);
   for(let x=24;x<W;x+=28)for(let y=24;y<H;y+=28)dot(x,y,2,soft,dark?.12:.17);
   if(potA>0){
    const x=potX,y=236;
    rect(x-92,y+76,184,7,soft,potA*.7);rect(x-76,y+62,152,7,ink,potA);
    rect(x-70,y-38,8,100,ink,potA);rect(x+62,y-38,8,100,ink,potA);
    rect(x-70,y+55,140,8,ink,potA);rect(x-78,y-41,156,8,ink,potA);
    rect(x-89,y-14,18,7,ink,potA);rect(x+71,y-14,18,7,ink,potA);
    const fill=smooth(t/.62);
    for(let row=0;row<7;row++)for(let col=0;col<17;col++){
     if(row>6*fill||(col+row)%5===0)continue;
     dot(x-57+col*7,y+47-row*7+Math.sin(t*8+col*.4)*2,5,colors[(col+row)%2],potA*.72);
    }
    const pouring=1-smooth((t-.65)/.35);
    for(let i=0;i<11;i++){const fall=(t*310+i*27)%150;dot(x-8+Math.sin(i*2.4)*12,y-194+fall,5+i%3,colors[i%2],pouring*potA)}
    const flame=smooth((t-.28)/.2);
    for(let i=0;i<13;i++)dot(x-53+i*9,y+90-(i%3)*4+Math.sin(t*22+i*1.9)*7,7,i%3===0?colors[2]:colors[3],flame*potA);
    rect(x-86,y+111,172,7,soft,potA);
   }
   const steam=smooth((t-.72)/.36)*(1-smooth((t-2.57)/.5)),travel=smooth((t-.78)/.95);
   for(let i=0;i<46;i++){
    const u=(i/46+t*.2)%1;if(u>travel)continue;
    const x=potX+26+(rotorX-potX-70)*u,y=164-46*Math.sin(Math.PI*u)+Math.sin(i*1.8+t*9)*7;
    dot(x,y,4+i%3,colors[i%4===0?0:1],steam*(.28+.72*Math.sin(Math.PI*u)));
   }
   if(rotorA>0){
    const y=199,rotation=Math.max(0,t-.8)*(3+t*5);
    for(let i=0;i<32;i++){const a=i/32*Math.PI*2;dot(rotorX+Math.cos(a)*69,y+Math.sin(a)*69,5,soft,rotorA*.75)}
    for(let blade=0;blade<4;blade++)for(let radius=14;radius<65;radius+=7){const a=rotation+blade*Math.PI/2+radius*.004;dot(rotorX+Math.cos(a)*radius,y+Math.sin(a)*radius,radius<43?10:7,colors[blade],rotorA)}
    dot(rotorX-9,y-9,18,ink,rotorA);dot(rotorX-3,y-3,6,colors[3],rotorA);
    rect(rotorX-4,y+76,8,54,soft,rotorA);rect(rotorX-40,y+126,80,7,ink,rotorA);
   }
   const pulse=smooth((t-2.15)/.34)*(1-smooth((t-3.05)/.3));
   for(let i=0;i<35;i++){const u=(t-2.15)*1.6-i*.023;if(u<0||u>1)continue;dot(rotorX+(center-rotorX)*u,198+Math.sin(u*Math.PI*3+i)*(7+i%4*4),5+i%3,colors[i%5],pulse*(1-u*.3))}
   const turn=t*.4;
   for(let i=0;i<420;i++){
    const y=1-(i+.5)/420*2,r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5))+turn,z=Math.sin(a)*r;
    const destX=center+Math.cos(a)*r*(narrow?91:104),destY=205+y*(narrow?91:104),gather=smooth((t-2.55)/.62);
    dot(rotorX+(destX-rotorX)*gather,198+(destY-198)*gather,z>0?4:3,colors[(i*7+Math.floor(i/31))%5],logoA*(.45+(z+1)*.22));
   }
   if(logoA>0)for(let i=0;i<4;i++){const a=t*.8+i*Math.PI/2,r=narrow?105:119;dot(center+Math.cos(a)*r,205+Math.sin(a)*r,7,colors[i],logoA*.75)}
  };
  const animate=()=>{
   const t=Math.min(DURATION,(performance.now()-started)/1000);
   if(t>=DURATION){introSound(-1);if(!finished){finished=true;callbacks.current.onFinish()}return}
   const p=phase(t);if(p!==lastPhase){lastPhase=p;callbacks.current.onPhase(p)}
   introSound(t);draw(t);frame=requestAnimationFrame(animate);
  };animate();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);introSound(-1)};
 },[]);
 return <canvas ref={canvasRef} className="pixel-intro__canvas" role="img" aria-label="Pixel animation: water is heated, steam turns a turbine, and electricity forms the colorful Enerlyze point-cloud sphere"/>;
}

export default function StartupIntro(){
 const [visible,setVisible]=useState(false),[currentPhase,setCurrentPhase]=useState(0),[run,setRun]=useState(0);
 const skip=useRef<HTMLButtonElement>(null);
 const complete=()=>{try{sessionStorage.setItem('enerlyze-intro-v3','seen')}catch{}setVisible(false)};
 useEffect(()=>{try{if(sessionStorage.getItem('enerlyze-intro-v3'))return}catch{}if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setVisible(true)},[]);
 useEffect(()=>{const replay=()=>{setRun(value=>value+1);setCurrentPhase(0);setVisible(true)};window.addEventListener('enerlyze-replay-intro',replay);return()=>window.removeEventListener('enerlyze-replay-intro',replay)},[]);
 useEffect(()=>{
  if(!visible)return;
  const overflow=document.body.style.overflow,prior=document.activeElement as HTMLElement|null,content=document.getElementById('site-content');
  document.body.style.overflow='hidden';document.body.classList.add('intro-active');if(content)content.inert=true;skip.current?.focus();
  const fallback=window.setTimeout(complete,4800);
  return()=>{window.clearTimeout(fallback);document.body.style.overflow=overflow;document.body.classList.remove('intro-active');introSound(-1);if(content)content.inert=false;prior?.focus()};
 },[visible,run]);
 if(!visible)return null;
 return <div key={run} className="startup-intro pixel-intro" data-phase={currentPhase} role="dialog" aria-modal="true" aria-label="Enerlyze introduction" onKeyDown={e=>{if(e.key==='Escape')complete()}}>
  <div className="intro-top pixel-intro__top"><span>enerlyze</span><div className="intro-actions"><button ref={skip} onClick={complete}>Skip intro ↗</button></div></div>
  <div className="pixel-intro__art"><PixelScene onPhase={n=>{setCurrentPhase(n);if(n===3)playCue('identity')}} onFinish={complete}/></div>
  <div className="pixel-intro__copy" aria-live="polite"><p className="pixel-intro__eyebrow">{currentPhase===3?'ENERGY, MADE CLEAR':'ENERGY CHANGES FORM'}</p><h2 key={currentPhase}>{labels[currentPhase]}</h2><p>{descriptions[currentPhase]}</p></div>
  <div className="pixel-intro__footer" aria-hidden="true"><span>WATER</span><span>HEAT</span><span>MOTION</span><span>ENERGY</span><i/></div>
 </div>;
}
