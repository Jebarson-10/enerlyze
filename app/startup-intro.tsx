'use client';
import {useEffect,useRef,useState} from 'react';
import type * as Three from 'three';
import {introSound,playCue} from '@/lib/sound';
const chapters=[['01 / WATER','A simple beginning.','Water flows into the vessel.'],['02 / HEAT','Energy changes form.','An LPG flame heats the water.'],['03 / MOTION','Steam becomes movement.','Expanding steam drives the turbine.'],['04 / ELECTRICITY','Movement becomes power.','A generator turns rotation into electricity.'],['05 / IDENTITY','Every connection matters.','Power gathers into our point-cloud identity.'],['06 / ENERLYZE','Your personal partner','for a greener lifestyle.']];

function IntroScene({onStep,onFinish}:{onStep:(n:number)=>void;onFinish:()=>void}){
 const host=useRef<HTMLDivElement>(null);const callbacks=useRef({onStep,onFinish});callbacks.current={onStep,onFinish};
 useEffect(()=>{
  let disposed=false;let cleanup=()=>{};
  Promise.all([import('three'),import('three/addons/geometries/RoundedBoxGeometry.js'),import('three/addons/environments/RoomEnvironment.js')]).then(([T,{RoundedBoxGeometry},{RoomEnvironment}])=>{
   if(disposed||!host.current)return;const node=host.current;
   let renderer:Three.WebGLRenderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{callbacks.current.onFinish();return;}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x070d16,1);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;node.appendChild(renderer.domElement);
   const scene=new T.Scene();const camera=new T.PerspectiveCamera(36,1,.1,60);const pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
   scene.add(new T.HemisphereLight(0xc7ddff,0x172338,1.2));for(const [x,y,z,intensity,color] of [[-3,4,4,4,0xffffff],[4,1,-3,3,0x568cff]]){const light=new T.DirectionalLight(color,intensity);light.position.set(x,y,z);scene.add(light);}
   const metal=new T.MeshPhysicalMaterial({color:0xc6d3e2,metalness:.96,roughness:.2,clearcoat:.5});const blue=new T.MeshPhysicalMaterial({color:0x224f87,metalness:.62,roughness:.26,clearcoat:1});const dark=new T.MeshStandardMaterial({color:0x192535,metalness:.7,roughness:.4});const copper=new T.MeshStandardMaterial({color:0xbf7744,metalness:.9,roughness:.25});
   const glass=new T.MeshPhysicalMaterial({color:0xb9d7e8,metalness:0,roughness:.12,transmission:.7,transparent:true,opacity:.32,thickness:.08,side:T.DoubleSide});const waterMat=new T.MeshPhysicalMaterial({color:0x6fb6de,metalness:.05,roughness:.10,transparent:true,opacity:.68,clearcoat:1});
   const flameMat=new T.MeshBasicMaterial({color:0x428dff,transparent:true,opacity:.72,blending:T.AdditiveBlending,depthWrite:false});const tipMat=new T.MeshBasicMaterial({color:0xb8e9ff,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false});const materials:Three.Material[]=[metal,blue,dark,copper,glass,waterMat,flameMat,tipMat];
   const box=(p:Three.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,m:Three.Material)=>{const mesh=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,.035),m);mesh.position.set(x,y,z);p.add(mesh);return mesh;};
   const cyl=(p:Three.Object3D,r:number,h:number,x:number,y:number,z:number,m:Three.Material,axis='y')=>{const mesh=new T.Mesh(new T.CylinderGeometry(r,r,h,64),m);if(axis==='x')mesh.rotation.z=Math.PI/2;if(axis==='z')mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,z);p.add(mesh);return mesh;};
   const tube=(p:Three.Object3D,points:Three.Vector3[],r:number,m:Three.Material)=>{const mesh=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),48,r,10,false),m);p.add(mesh);return mesh;};
   const ring=(p:Three.Object3D,r:number,t:number,x:number,y:number,z:number,m:Three.Material,axis='y')=>{const mesh=new T.Mesh(new T.TorusGeometry(r,t,16,96),m);if(axis==='y')mesh.rotation.x=Math.PI/2;if(axis==='x')mesh.rotation.y=Math.PI/2;mesh.position.set(x,y,z);p.add(mesh);return mesh;};
   const boiler=new T.Group();scene.add(boiler);boiler.rotation.y=-.25;
   box(boiler,0,-1.00,0,2.3,.17,1.7,dark);cyl(boiler,.57,.10,0,-.80,0,metal);ring(boiler,.49,.055,0,-.70,0,dark);
   for(let i=0;i<4;i++){const a=i*Math.PI/2;const support=box(boiler,Math.cos(a)*.65,-.63,Math.sin(a)*.65,.45,.08,.08,dark);support.rotation.y=-a;}
   const fire=new T.Group();boiler.add(fire);for(let i=0;i<32;i++){const a=i*Math.PI/16;const flame=new T.Mesh(new T.ConeGeometry(.039,.27,12),flameMat);flame.position.set(Math.cos(a)*.43,-.53,Math.sin(a)*.43);fire.add(flame);const tip=new T.Mesh(new T.ConeGeometry(.018,.18,10),tipMat);tip.position.copy(flame.position);tip.position.y-=.03;fire.add(tip);}fire.visible=false;
   tube(boiler,[new T.Vector3(-.7,-.85,0),new T.Vector3(-1.5,-.85,.15),new T.Vector3(-1.65,-.5,.15)],.035,dark);
   const gas=new T.Group();gas.position.set(-1.72,-.55,.15);cyl(gas,.23,.62,0,0,0,blue);cyl(gas,.09,.13,0,.37,0,metal);ring(gas,.20,.025,0,.33,0,metal);box(gas,0,0,.225,.28,.18,.012,metal);boiler.add(gas);
   cyl(boiler,.76,.09,0,-.37,0,metal);const wall=new T.Mesh(new T.CylinderGeometry(.76,.76,.75,80,1,true),glass);wall.position.y=.05;boiler.add(wall);ring(boiler,.76,.035,0,.43,0,metal);
   for(const sign of [-1,1])tube(boiler,[new T.Vector3(sign*.74,.18,0),new T.Vector3(sign*1.05,.28,0),new T.Vector3(sign*1.03,.02,0),new T.Vector3(sign*.74,-.05,0)],.05,metal);
   const liquid=cyl(boiler,.72,.45,0,-.14,0,waterMat);const surface=new T.Mesh(new T.CircleGeometry(.714,80),waterMat);surface.rotation.x=-Math.PI/2;surface.position.y=.10;boiler.add(surface);
   const pour=new T.Group();boiler.add(pour);pour.position.set(-.9,1.32,0);pour.rotation.z=-.82;cyl(pour,.27,.68,0,.0,0,glass);cyl(pour,.25,.37,0,-.12,0,waterMat);ring(pour,.28,.017,0,.34,0,metal);ring(pour,.24,.038,-.35,.03,0,metal,'z');
   const stream=tube(boiler,[new T.Vector3(-.57,1.36,0),new T.Vector3(-.42,.86,0),new T.Vector3(-.26,.35,0)],.032,waterMat);
   const drops:Array<Three.Mesh>=[];for(let i=0;i<30;i++){const drop=new T.Mesh(new T.SphereGeometry(.025,10,8),waterMat);boiler.add(drop);drops.push(drop);}
   const bubbles:Array<Three.Mesh>=[];for(let i=0;i<30;i++){const bubble=new T.Mesh(new T.SphereGeometry(.013+(i%4)*.005,10,8),glass);boiler.add(bubble);bubbles.push(bubble);}
   const turbine=new T.Group();scene.add(turbine);turbine.rotation.y=-.30;
   const wheel=new T.Group();turbine.add(wheel);ring(wheel,.83,.055,0,0,0,metal,'x');cyl(wheel,.23,.4,0,0,0,metal,'x');cyl(wheel,.06,2.8,0,0,0,metal,'x');
   for(let i=0;i<24;i++){const a=i*Math.PI/12;const blade=box(wheel,0,Math.cos(a)*.55,Math.sin(a)*.55,.19,.52,.095,metal);blade.rotation.x=a+.38;}
   ring(turbine,1.02,.075,0,0,0,blue,'x');for(let i=0;i<12;i++){const a=i*Math.PI/6;cyl(turbine,.032,.13,.02,Math.cos(a)*1.02,Math.sin(a)*1.02,metal,'x');}
   box(turbine,0,-1.08,0,1.6,.12,1.0,dark);box(turbine,0,-.95,0,.45,.42,.4,blue);
   tube(turbine,[new T.Vector3(-2,.6,0),new T.Vector3(-1.3,.6,0),new T.Vector3(-.4,.7,0)],.10,metal);ring(turbine,.18,.035,-1.85,.6,0,metal,'x');
   const generator=new T.Group();scene.add(generator);generator.rotation.set(.16,-.4,0);cyl(generator,.59,1.3,0,0,0,blue,'x');for(let i=0;i<24;i++){const a=i*Math.PI/12;const fin=box(generator,0,Math.cos(a)*.62,Math.sin(a)*.62,1.1,.055,.04,blue);fin.rotation.x=a;}
   for(const sign of [-1,1]){cyl(generator,.64,.10,sign*.69,0,0,metal,'x');ring(generator,.5,.024,sign*.76,0,0,copper,'x');}const shaft=cyl(generator,.10,2.0,0,0,0,metal,'x');box(generator,0,-.78,0,1.4,.12,1.0,dark);box(generator,0,.79,0,.5,.25,.4,blue);
   // Soft steam sprites travel along a curved jet; no external assets required.
   const smokeCanvas=document.createElement('canvas');smokeCanvas.width=64;smokeCanvas.height=64;const smokeCtx=smokeCanvas.getContext('2d')!;const gradient=smokeCtx.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'rgba(232,243,255,.7)');gradient.addColorStop(.45,'rgba(220,236,255,.25)');gradient.addColorStop(1,'rgba(220,236,255,0)');smokeCtx.fillStyle=gradient;smokeCtx.fillRect(0,0,64,64);const smokeTexture=new T.CanvasTexture(smokeCanvas);
   const steam:Array<Three.Sprite>=[];for(let i=0;i<100;i++){const mat=new T.SpriteMaterial({map:smokeTexture,color:0xe3edff,transparent:true,opacity:0,depthWrite:false});materials.push(mat);const sprite=new T.Sprite(mat);scene.add(sprite);steam.push(sprite);}
   const arcs=new T.Group();scene.add(arcs);const arcMaterial=new T.LineBasicMaterial({color:0x98d8ff,transparent:true,opacity:.8});materials.push(arcMaterial);for(let j=0;j<12;j++){const points=[];for(let i=0;i<18;i++){const a=j*Math.PI/6;const r=.3+i*.1;points.push(new T.Vector3(Math.cos(a)*r,Math.sin(a)*r,Math.sin(i*2.3+j)*.12));}const arc=new T.Line(new T.BufferGeometry().setFromPoints(points),arcMaterial);arcs.add(arc);}
   const pointCount=1500;const positions=new Float32Array(pointCount*3);const globe=new Float32Array(pointCount*3);const electric=new Float32Array(pointCount*3);const word=new Float32Array(pointCount*3);
   const textCanvas=document.createElement('canvas');textCanvas.width=1200;textCanvas.height=240;const ctx=textCanvas.getContext('2d')!;ctx.font='700 170px Space Grotesk, sans-serif';ctx.fillStyle='white';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('enerlyze',600,120);const pixels=ctx.getImageData(0,0,1200,240).data;const letters:number[][]=[];for(let y=0;y<240;y+=5)for(let x=0;x<1200;x+=5)if(pixels[(y*1200+x)*4+3]>120)letters.push([(x-600)/180,(120-y)/180,0]);
   for(let i=0;i<pointCount;i++){const y=1-i/(pointCount-1)*2,r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5));globe.set([Math.cos(a)*r*1.3,y*1.3,Math.sin(a)*r*1.3],i*3);electric.set([Math.cos(a)*2.6,Math.sin(a)*2.0,(i%21-10)*.14],i*3);word.set(letters[i%letters.length]??[0,0,0],i*3);}
   const pointGeometry=new T.BufferGeometry();pointGeometry.setAttribute('position',new T.BufferAttribute(positions,3));const pointMaterial=new T.PointsMaterial({color:0x96c9ff,size:.043,transparent:true,opacity:1,depthWrite:false});materials.push(pointMaterial);const identity=new T.Points(pointGeometry,pointMaterial);scene.add(identity);

   // The components inhabit one continuous world, connected by pipework and cables.
   turbine.position.x=5;generator.position.x=10;arcs.position.x=10;identity.position.x=15;
   const gauge=new T.Group();gauge.position.set(.72,.55,0);cyl(gauge,.14,.04,0,0,0,metal,'z');cyl(gauge,.12,.045,0,0,.012,ceramicMaterial(),'z');
   function ceramicMaterial(){const m=new T.MeshStandardMaterial({color:0xe8edf2,roughness:.5});materials.push(m);return m;}
   const needle=box(gauge,0,.025,.046,.012,.11,.008,dark);boiler.add(gauge);
   for(let i=0;i<9;i++){const a=(i/8)*Math.PI*1.4-.2;const tick=box(gauge,Math.cos(a)*.095,Math.sin(a)*.095,.041,.018,.005,.005,dark);tick.rotation.z=a;}
   const outlet=tube(boiler,[new T.Vector3(.70,.35,0),new T.Vector3(1.18,.65,0),new T.Vector3(1.62,.65,0)],.06,metal);ring(boiler,.1,.025,1.6,.65,0,metal,'x');
   const ripples:Three.Mesh[]=[];for(let i=0;i<3;i++){const ripple=ring(boiler,.14+i*.13,.008,0,.1,0,waterMat);ripples.push(ripple);}
   for(let j=0;j<2;j++)for(let i=0;i<24;i++){const a=i*Math.PI/12;const vane=box(wheel,(j-.5)*.23,Math.cos(a)*.70,Math.sin(a)*.70,.10,.17,.04,copper);vane.rotation.x=a+.3;}
   ring(turbine,.9,.02,.16,0,0,copper,'x');ring(turbine,.9,.02,-.16,0,0,copper,'x');
   for(const side of [-1,1]){ring(generator,.46,.04,side*.82,0,0,copper,'x');for(let i=0;i<8;i++){const a=i*Math.PI/4;cyl(generator,.033,.08,side*.78,Math.cos(a)*.55,Math.sin(a)*.55,dark,'x');}}
   tube(generator,[new T.Vector3(.2,.82,0),new T.Vector3(1.0,.85,.1),new T.Vector3(1.5,.5,.1)],.022,copper);
   cyl(generator,.055,2.55,-2.23,0,0,metal,'x');ring(generator,.16,.05,-3.45,0,0,copper,'x');ring(generator,.16,.05,-1.02,0,0,copper,'x');
   const nameplate=box(generator,0,.05,.62,.48,.24,.015,metal);for(let i=0;i<4;i++)box(generator,0,.11-i*.04,.633,.34-i*.025,.009,.004,dark);
   const arcObjects=arcs.children as Three.Line[];
   stream.material=waterMat.clone();materials.push(stream.material);
   const fades=new Map<Three.Object3D,{mat:Three.Material;opacity:number}[]>();
   for(const group of [boiler,turbine,generator]){
    const map=new Map<Three.Material,Three.Material>();const list:{mat:Three.Material;opacity:number}[]=[];
    group.traverse(object=>{const mesh=object as Three.Mesh;if(!mesh.material)return;const clone=(old:Three.Material)=>{let mat=map.get(old);if(!mat){mat=old.clone();map.set(old,mat);materials.push(mat);list.push({mat,opacity:mat.opacity});}return mat;};mesh.material=Array.isArray(mesh.material)?mesh.material.map(clone):clone(mesh.material);});fades.set(group,list);
   }
   const fade=(group:Three.Object3D,alpha:number)=>{group.visible=alpha>.001;for(const item of fades.get(group)??[]){item.mat.transparent=alpha<.999||item.opacity<1;item.mat.opacity=item.opacity*alpha;item.mat.depthWrite=alpha>.5;}};
   const clockStart=performance.now();let frame=0;let stage=-1;let aspect=1;let lastTime=0;let identityCue=false;
   const resize=()=>{const w=node.clientWidth,h=node.clientHeight;aspect=w/Math.max(1,h);renderer.setSize(w,h);camera.aspect=aspect;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(node);resize();
   const smooth=(t:number,a:number,b:number)=>T.MathUtils.smoothstep(t,a,b);
   const animate=()=>{
    if(disposed)return;const t=(performance.now()-clockStart)/1000,dt=Math.min(.05,t-lastTime);lastTime=t;
    if(t>=30){introSound(-1);callbacks.current.onFinish();return;}
    const next=t<4?0:t<9?1:t<14?2:t<19?3:t<24?4:5;
    if(next!==stage){stage=next;callbacks.current.onStep(stage);node.dataset.stage=String(stage);}
    node.dataset.time=t.toFixed(1);introSound(t);
    const heat=smooth(t,3,5)*(1-smooth(t,10,13));
    const boilerAlpha=1-smooth(t,10,13),turbineAlpha=smooth(t,8,10)*(1-smooth(t,15,18)),generatorAlpha=smooth(t,13,15)*(1-smooth(t,19,22));
    fade(boiler,boilerAlpha);fade(turbine,turbineAlpha);fade(generator,generatorAlpha);
    const pourAlpha=1-smooth(t,3.5,5);pour.visible=stream.visible=pourAlpha>.001;pour.scale.setScalar(.85+.15*pourAlpha);pour.position.x=-.9-(1-pourAlpha)*.8;
    (stream.material as Three.Material).opacity=.68*pourAlpha*boilerAlpha;
    drops.forEach((drop,i)=>{drop.visible=pourAlpha>.1;const k=(t*.8+i/30)%1;drop.position.set(-.57+k*.31,.1+(1-k)*1.25,Math.sin(i*3)*.06);drop.scale.set(1,1.7,1);});
    const fill=Math.min(1,t/3.5);liquid.scale.y=Math.max(.04,fill);liquid.position.y=-.36+fill*.225;surface.position.y=-.36+fill*.45;surface.scale.setScalar(1+Math.sin(t*7)*.008);ripples.forEach((r,i)=>{r.position.y=surface.position.y+.007;r.scale.setScalar(.7+((t*.8+i/3)%1)*1.5);r.visible=t<7;});
    fire.visible=heat>.001;fire.children.forEach((f,i)=>f.scale.y=(.9+Math.sin(t*9+i)*.18)*heat);needle.rotation.z=-.8+smooth(t,4,10)*1.7;
    bubbles.forEach((b,i)=>{b.visible=heat>.2;const a=i*2.399;b.position.set(Math.cos(a)*.53,-.33+((t*.24+i/30)%1)*.42,Math.sin(a)*.53);});
    wheel.rotation.x+=dt*6*smooth(t,9,12);shaft.rotation.x+=dt*8*smooth(t,13,16);
    const jet=smooth(t,7,11);steam.forEach((sprite,i)=>{const k=(t*.3+i/100)%1,a=i*2.399;const boilX=Math.cos(a)*(.16+k*.35),boilY=.42+k*1.6;const jetX=1.55+k*3.4,jetY=.65+Math.sin(k*Math.PI)*.32; sprite.position.set(T.MathUtils.lerp(boilX,jetX,jet),T.MathUtils.lerp(boilY,jetY,jet),Math.sin(a)*(.12+k*.2));sprite.scale.setScalar(.16+k*.36);(sprite.material as Three.SpriteMaterial).opacity=Math.sin(k*Math.PI)*.32*smooth(t,4,7)*(1-smooth(t,13,16));sprite.visible=t>4&&t<16;});
    arcs.visible=t>16&&t<23;arcMaterial.opacity=.65*smooth(t,16,18)*(1-smooth(t,21,23));arcs.rotation.z=t*.10;
    arcObjects.forEach((arc,j)=>{const attr=arc.geometry.attributes.position;for(let i=0;i<attr.count;i++){const a=j*Math.PI/6,r=.3+i*.1;attr.setXYZ(i,Math.cos(a)*r,Math.sin(a)*r,Math.sin(i*2.3+j+t*4)*.13);}attr.needsUpdate=true;});
    identity.visible=t>18;const morph=smooth(t,24,27),gather=smooth(t,19,23);identity.position.x=T.MathUtils.lerp(10,15,smooth(t,18,22));
    for(let i=0;i<pointCount*3;i++)positions[i]=(electric[i]+(globe[i]-electric[i])*gather)*(1-morph)+word[i]*morph;
    pointGeometry.attributes.position.needsUpdate=true;identity.rotation.y=(1-morph)*t*.14;pointMaterial.opacity=smooth(t,18,20)*(1-smooth(t,29,30));
    if(t>25&&!identityCue){identityCue=true;playCue('identity');}
    const focus=5*smooth(t,8,12)+5*smooth(t,13,17)+5*smooth(t,18,22),front=smooth(t,18,24);
    const distance=Math.max(7.5,7.7/(2*Math.tan(Math.PI/10)*aspect));camera.position.set(focus+3.2*(1-front),1.6*(1-front),distance);camera.lookAt(focus,.20,0);
    renderer.render(scene,camera);frame=requestAnimationFrame(animate);
   };animate();cleanup=()=>{introSound(-1);cancelAnimationFrame(frame);observer.disconnect();const geometries=new Set<Three.BufferGeometry>();scene.traverse(o=>{const m=o as Three.Mesh;if(m.geometry)geometries.add(m.geometry)});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());smokeTexture.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
  }).catch(()=>callbacks.current.onFinish());return()=>{disposed=true;cleanup()};
 },[]);
 return <div ref={host} className="intro-3d" role="img" aria-label="Water is heated by an LPG flame, steam spins a turbine, electricity becomes the Enerlyze point cloud and name"/>;
}
export default function StartupIntro(){
 const [visible,setVisible]=useState(false);const [step,setStep]=useState(0);const skip=useRef<HTMLButtonElement>(null);const complete=()=>{try{sessionStorage.setItem('enerlyze-intro-v2','seen')}catch{}setVisible(false)};
 useEffect(()=>{try{if(sessionStorage.getItem('enerlyze-intro-v2'))return}catch{}if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;setVisible(true);},[]);
 useEffect(()=>{const replay=()=>{setStep(0);setVisible(true);};window.addEventListener('enerlyze-replay-intro',replay);return()=>window.removeEventListener('enerlyze-replay-intro',replay);},[]);
 useEffect(()=>{if(!visible)return;const previousOverflow=document.body.style.overflow;const content=document.getElementById('site-content');const previousFocus=document.activeElement as HTMLElement|null;document.body.style.overflow='hidden';document.body.classList.add('intro-active');if(content)content.inert=true;skip.current?.focus();return()=>{document.body.style.overflow=previousOverflow;document.body.classList.remove('intro-active');introSound(-1);if(content)content.inert=false;previousFocus?.focus();}},[visible]);
 if(!visible)return null;const chapter=chapters[step];return <div className="startup-intro" role="dialog" aria-modal="true" aria-label="Enerlyze introduction" onKeyDown={e=>{if(e.key==='Escape')complete()}}><div className="intro-top"><span>enerlyze</span><div className="intro-actions"><button ref={skip} onClick={complete}>Skip intro ↗</button></div></div><IntroScene onStep={setStep} onFinish={complete}/><div className="intro-caption" key={step}><h2>{chapter[1]}</h2><p>{chapter[2]}</p></div><div className="intro-timeline" aria-hidden="true"><i/></div><small className="intro-scope">A visual energy-conversion story · illustrative sequence</small></div>;
}
