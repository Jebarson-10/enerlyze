'use client';
import {useEffect,useRef,useState} from 'react';
import {introSound,playCue} from '@/lib/sound';

const DURATION=7.45;
const labels=['WASTED ENERGY ADDS UP','FIND THE HIDDEN LOSSES','SAVE ENERGY. CUT CARBON.','enerlyze'];
const descriptions=['At home and at work, every lost unit has a cost.','A clearer view reveals where the energy goes.','Better choices shrink the carbon cloud.','Your personal partner for a greener lifestyle.'];
const colors=['#365cff','#00aa99','#ec4e78','#f4bc25','#9968e6'];
const smooth=(v:number)=>{const x=Math.max(0,Math.min(1,v));return x*x*(3-2*x)};
const phase=(t:number)=>t<1.5?0:t<3.15?1:t<5.25?2:3;

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
   const narrow=width<620,W=narrow?440:800,H=460;
   const artWidth=width*(narrow?.96:.93),artHeight=height*(narrow?.61:.63);
   const scale=Math.min(artWidth/W,artHeight/H),artLeft=(width-W*scale)/2,artTop=height*(narrow?.14:.12)+(artHeight-H*scale)/2;
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   ctx.setTransform(dpr*scale,0,0,dpr*scale,dpr*artLeft,dpr*artTop);ctx.imageSmoothingEnabled=false;
   const dark=document.documentElement.dataset.theme==='dark',ink=dark?'#e7e9f2':'#242931',soft=dark?'#5d6473':'#bdc4d0';
   const homeX=narrow?112:265,factoryX=narrow?326:560,center=W/2;
   const sceneA=1-smooth((t-5.08)/.78),buildA=smooth(t/.38)*sceneA;
   const scanA=smooth((t-1.42)/.2)*(1-smooth((t-3.12)/.28))*sceneA;
   const solution=smooth((t-3.05)/.8),logoA=smooth((t-5.12)/.82);
   for(let x=24;x<W;x+=28)for(let y=24;y<H;y+=28)dot(x,y,2,soft,dark?.12:.17);
   if(buildA>0){
    // One artboard holds both audiences: household energy and industrial energy.
    const hx=homeX,fx=factoryX,base=312;
    rect(hx-74,base-101,148,101,ink,buildA*.08);rect(hx-76,base-102,7,105,ink,buildA);
    rect(hx+69,base-102,7,105,ink,buildA);rect(hx-76,base-3,152,7,ink,buildA);
    for(let row=0;row<9;row++){const roofY=base-110-row*8,roofWidth=162-row*18;rect(hx-roofWidth/2,roofY,roofWidth,7,ink,buildA)}
    rect(hx-45,base-76,29,29,colors[3],buildA*.8);rect(hx+14,base-76,29,29,colors[3],buildA*.8);
    rect(hx-10,base-57,20,54,soft,buildA);
    rect(fx-89,base-113,178,113,ink,buildA*.08);rect(fx-92,base-113,7,116,ink,buildA);
    rect(fx+85,base-113,7,116,ink,buildA);rect(fx-92,base-3,184,7,ink,buildA);
    for(let i=0;i<3;i++){const px=fx-91+i*58;rect(px,base-114,32,7,ink,buildA);rect(px+27,base-137,7,30,ink,buildA);rect(px+27,base-137,31,7,ink,buildA)}
    rect(fx+48,base-173,20,54,soft,buildA);rect(fx+44,base-177,28,7,ink,buildA);
    for(let i=0;i<3;i++)rect(fx-65+i*52,base-70,28,34,colors[3],buildA*.8);
    rect(20,base+12,W-40,4,soft,buildA*.65);
    ctx.globalAlpha=buildA*.8;ctx.fillStyle=soft;ctx.font='700 12px Space Grotesk, Arial, sans-serif';ctx.textAlign='center';ctx.fillText('HOME',hx,base+40);ctx.fillText('WORK',fx,base+40);ctx.globalAlpha=1;
    const wasteA=(1-solution)*buildA;
    for(let i=0;i<36;i++){
     const sourceX=i%2?hx:fx,originY=i%2?base-124:base-155;
     const drift=(t*.72+i*.139)%1;
     dot(sourceX+Math.sin(i*17.3)*54+Math.sin(drift*5+i)*13,originY-drift*107,4+i%3,i%3?colors[2]:colors[3],wasteA*(.24+.65*(1-drift)));
    }
    // The carbon cloud is a visible consequence, then contracts as the scene improves.
    const cloudA=buildA*(1-solution*.86),cloudX=center,cloudY=96,cloudR=1-solution*.38;
    for(let i=0;i<85;i++){const a=i*2.399,r=Math.sqrt(i/85)*63*cloudR;dot(cloudX+Math.cos(a)*r,cloudY+Math.sin(a)*r*.62,5+i%3,i%4?colors[2]:colors[3],cloudA*(.28+i%4*.13))}
    ctx.globalAlpha=buildA;ctx.fillStyle=solution>.5?colors[1]:(dark?'#fff5f7':'#442c34');ctx.font='700 22px Space Grotesk, Arial, sans-serif';ctx.textAlign='center';ctx.fillText(solution>.5?'CO₂ ↓':'CO₂',cloudX,cloudY+8);ctx.globalAlpha=1;
    // Enerlyze identifies the losses with a crisp moving pixel scan.
    if(scanA>0){const progress=smooth((t-1.5)/1.55),sx=32+progress*(W-64);
     rect(sx-2,139,4,200,colors[0],scanA*.7);
     for(let y=139;y<339;y+=17){dot(sx-12,y,5,colors[1],scanA);dot(sx+8,y,5,colors[1],scanA)}
     for(const target of [hx,fx]){const close=1-Math.min(1,Math.abs(sx-target)/80);if(close>0){rect(target-25,base+14,50,5,colors[1],scanA*close);dot(target-2,base+8,7,colors[0],scanA*close)}}
    }
    if(solution>0){
     // Solar roofs and a continuously turning efficient motor replace the red leaks.
     for(let i=0;i<5;i++){rect(hx-49+i*19,base-173+i*7,17,8,colors[0],solution*buildA);rect(fx-79+i*34,base-163,27,13,colors[0],solution*buildA)}
     const motorX=fx,motorY=base-52;for(let blade=0;blade<4;blade++){const a=t*13+blade*Math.PI/2;rect(motorX+Math.cos(a)*19-5,motorY+Math.sin(a)*19-5,10,10,colors[1],solution*buildA)}
     dot(motorX-6,motorY-6,12,ink,solution*buildA);
     for(let i=0;i<24;i++){const x=(i%2?hx:fx)+Math.sin(i*2.3)*45,y=135+(i*37%83);dot(x,y,4+i%2,colors[i%2?1:0],solution*buildA*.65)}
    }
   }
   const turn=t*.4,transfer=smooth((t-6.12)/1.15),introSphereA=1-smooth((t-6.12)/.12);
   for(let i=0;i<420;i++){
    const y=1-(i+.5)/420*2,r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5))+turn,z=Math.sin(a)*r;
    const destX=center+Math.cos(a)*r*(narrow?91:104),destY=205+y*(narrow?91:104),gather=smooth((t-5.1)/.86);
    const originX=i%2?homeX:factoryX,originY=140+(i*37%180);
    dot(originX+(destX-originX)*gather,originY+(destY-originY)*gather,z>0?4:3,colors[(i*7+Math.floor(i/31))%5],logoA*introSphereA*(.45+(z+1)*.22));
   }
   if(logoA>0)for(let i=0;i<4;i++){const a=t*.8+i*Math.PI/2,r=narrow?105:119;dot(center+Math.cos(a)*r,205+Math.sin(a)*r,7,colors[i],logoA*introSphereA*.75)}
   if(t>=6.12){
    // Carry the last sphere into the already-rendered homepage, then let its dots resolve into the real UI.
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const stage=document.querySelector('.hero-glow-stage')?.getBoundingClientRect();
    const headline=document.querySelector('.entrance .intro h1')?.getBoundingClientRect();
    const header=document.querySelector('.topbar')?.getBoundingClientRect();
    const sphereX=stage?stage.left+stage.width/2:width*.7;
    const sphereY=stage?stage.top+stage.height/2:height*.55;
    const sphereRadius=stage?Math.min(stage.width,stage.height)*.29:Math.min(width,height)*.19;
    const fade=1-smooth((t-6.72)/.67),spread=Math.sin(transfer*Math.PI)*Math.min(width,height)*.07;
    for(let i=0;i<420;i+=2){
     const y=1-(i+.5)/420*2,r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5))+turn,z=Math.sin(a)*r;
     const fromX=artLeft+scale*(center+Math.cos(a)*r*(narrow?91:104));
     const fromY=artTop+scale*(205+y*(narrow?91:104));
     let toX=sphereX+Math.cos(a)*r*sphereRadius,toY=sphereY+y*sphereRadius;
     if(i%9===3&&headline){toX=headline.left+headline.width*((i*37%101)/101);toY=headline.top+headline.height*((i*53%97)/97)}
     if(i%9===5&&header){toX=header.left+header.width*((i*31%103)/103);toY=header.top+header.height*((i*41%89)/89)}
     const x=fromX+(toX-fromX)*transfer+Math.cos(i*2.399)*spread;
     const py=fromY+(toY-fromY)*transfer+Math.sin(i*2.399)*spread;
     dot(x,py,z>0?3:2,colors[(i*7+Math.floor(i/31))%5],fade*(.32+(z+1)*.16));
    }
   }
  };
  const animate=()=>{
   const t=Math.min(DURATION,(performance.now()-started)/1000);
   if(t>=DURATION){introSound(-1);if(!finished){finished=true;callbacks.current.onFinish()}return}
   const p=phase(t);if(p!==lastPhase){lastPhase=p;callbacks.current.onPhase(p)}
   introSound(t);draw(t);frame=requestAnimationFrame(animate);
  };animate();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);introSound(-1)};
 },[]);
 return <canvas ref={canvasRef} className="pixel-intro__canvas" role="img" aria-label="Pixel animation: energy waste rises from a home and factory, Enerlyze reveals it, efficient choices reduce the carbon cloud, and pixels form the Enerlyze sphere"/>;
}

export default function StartupIntro(){
 const [visible,setVisible]=useState(false),[currentPhase,setCurrentPhase]=useState(0),[run,setRun]=useState(0);
 const skip=useRef<HTMLButtonElement>(null);
 const complete=()=>{try{sessionStorage.setItem('enerlyze-intro-v4','seen')}catch{}setVisible(false)};
 useEffect(()=>{if(location.pathname.startsWith('/admin'))return;try{if(sessionStorage.getItem('enerlyze-intro-v4'))return}catch{}if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setVisible(true)},[]);
 useEffect(()=>{const replay=()=>{setRun(value=>value+1);setCurrentPhase(0);setVisible(true)};window.addEventListener('enerlyze-replay-intro',replay);return()=>window.removeEventListener('enerlyze-replay-intro',replay)},[]);
 useEffect(()=>{
  if(!visible)return;
  const overflow=document.body.style.overflow,prior=document.activeElement as HTMLElement|null,content=document.getElementById('site-content');
  window.scrollTo({top:0,behavior:'instant'});
  document.body.style.overflow='hidden';document.body.classList.add('intro-active');if(content)content.inert=true;skip.current?.focus();
  const fallback=window.setTimeout(complete,7900);
  return()=>{window.clearTimeout(fallback);document.body.style.overflow=overflow;document.body.classList.remove('intro-active');introSound(-1);if(content)content.inert=false;prior?.focus({preventScroll:true})};
 },[visible,run]);
 if(!visible)return null;
 return <div key={run} className="startup-intro pixel-intro" data-phase={currentPhase} role="dialog" aria-modal="true" aria-label="Enerlyze introduction" onKeyDown={e=>{if(e.key==='Escape')complete()}}>
  <div className="intro-top pixel-intro__top"><span>enerlyze</span><div className="intro-actions"><button ref={skip} onClick={complete}>Skip intro ↗</button></div></div>
  <div className="pixel-intro__art"><PixelScene onPhase={n=>{setCurrentPhase(n);if(n===3)playCue('identity')}} onFinish={complete}/></div>
  <div className="pixel-intro__copy" aria-live="polite"><p className="pixel-intro__eyebrow">ENERGY, MADE CLEAR</p><h2 key={currentPhase}>{labels[currentPhase]}</h2><p>{descriptions[currentPhase]}</p></div>
  <div className="pixel-intro__footer" aria-hidden="true"><span>WASTE</span><span>INSIGHT</span><span>ACTION</span><span>IMPACT</span><i/></div>
 </div>;
}
