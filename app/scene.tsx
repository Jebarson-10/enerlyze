"use client";
import {useEffect, useRef, useState, type MutableRefObject} from 'react';
import type {Mode} from './page';
import type * as Three from 'three';

const letters: Record<string,string[]> = {
 E:['11111','10000','10000','11110','10000','10000','11111'],
 N:['10001','11001','11001','10101','10011','10011','10001'],
 R:['11110','10001','10001','11110','10100','10010','10001'],
 L:['10000','10000','10000','10000','10000','10000','11111'],
 Y:['10001','10001','01010','00100','00100','00100','00100'],
 Z:['11111','00001','00010','00100','01000','10000','11111'],
};
export default function EnergyScene({mode,progress,motion,burst=false}:{mode:Mode;progress:MutableRefObject<number>;motion:boolean;burst?:boolean}) {
 const host=useRef<HTMLDivElement>(null);
 const [error,setError]=useState(false);
 const motionRef=useRef(motion), burstRef=useRef(burst);
 useEffect(()=>{motionRef.current=motion},[motion]);
 useEffect(()=>{burstRef.current=burst},[burst]);
 useEffect(()=>{
  let disposed=false;
  let cleanup=()=>{};
  setError(false);
  Promise.all([import('three'),import('three/addons/geometries/RoundedBoxGeometry.js'),import('three/addons/environments/RoomEnvironment.js')]).then(([T,{RoundedBoxGeometry},{RoomEnvironment}])=>{
   if(disposed||!host.current)return;
   const el=host.current;
   let renderer:Three.WebGLRenderer;
   try { renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); } catch {setError(true);return}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
   renderer.setClearColor(0x090c0b,0);
   renderer.toneMapping=T.ACESFilmicToneMapping;
   renderer.toneMappingExposure=1.25;
   el.appendChild(renderer.domElement);
   const scene=new T.Scene();
   const camera=new T.PerspectiveCamera(38,1,.1,60);
   const generator=new T.PMREMGenerator(renderer);
   const environment=new RoomEnvironment();
   const env=generator.fromScene(environment,.05);
   scene.environment=env.texture;
   environment.dispose();generator.dispose();
   scene.add(new T.HemisphereLight(0xe8ffee,0x13231b,2.4));
   const light=new T.DirectionalLight(0xf4fff7,4);light.position.set(4,6,5);scene.add(light);
   const accentLight=new T.PointLight(0xa5ff38,24,16);accentLight.position.set(-3,2,3);scene.add(accentLight);
   const steel=new T.MeshStandardMaterial({color:0xc7d0cc,metalness:.9,roughness:.24});
   const dark=new T.MeshStandardMaterial({color:0x222c28,metalness:.72,roughness:.3});
   const cellMaterial=new T.MeshStandardMaterial({color:0x153146,metalness:.62,roughness:.17});
   const green=new T.MeshStandardMaterial({color:0x9cff3b,metalness:.15,roughness:.36});
   const leafMaterial=new T.MeshStandardMaterial({color:0x61ba36,metalness:.08,roughness:.4,side:T.DoubleSide});
   const glow=new T.MeshBasicMaterial({color:0xa5ff38});
   const textures:Three.Texture[]=[];
   const root=new T.Group();scene.add(root);
   const disc=document.createElement('canvas');disc.width=64;disc.height=64;
   const context=disc.getContext('2d')!;
   context.fillStyle='#fff';context.beginPath();context.arc(32,32,27,0,Math.PI*2);context.fill();
   const dotTexture=new T.CanvasTexture(disc);textures.push(dotTexture);
   function pointSphere(count:number,radius:number,color:number,size:number) {
    const coordinates=new Float32Array(count*3);
    const phi=Math.PI*(3-Math.sqrt(5));
    for(let i=0;i<count;i++){
     const y=1-(i+.5)/count*2, r=Math.sqrt(1-y*y), a=i*phi;
     coordinates.set([Math.cos(a)*r*radius,y*radius,Math.sin(a)*r*radius],i*3);
    }
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(coordinates,3));
    const material=new T.PointsMaterial({color,size,map:dotTexture,alphaTest:.35,transparent:true,opacity:.93,sizeAttenuation:true});
    return new T.Points(geometry,material);
   }
   function box(parent:Three.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,material:Three.Material,r=.035){
    const m=new T.Mesh(new RoundedBoxGeometry(w,h,d,2,r),material);m.position.set(x,y,z);parent.add(m);return m;
   }
   function cylinder(parent:Three.Object3D,r:number,h:number,x:number,y:number,z:number,material:Three.Material,axis='y'){
    const m=new T.Mesh(new T.CylinderGeometry(r,r,h,40),material);
    if(axis==='x')m.rotation.z=Math.PI/2;
    if(axis==='z')m.rotation.x=Math.PI/2;
    m.position.set(x,y,z);parent.add(m);return m;
   }
   function tube(parent:Three.Object3D,points:Three.Vector3[],radius:number,material:Three.Material){
    const curve=new T.CatmullRomCurve3(points);
    const m=new T.Mesh(new T.TubeGeometry(curve,28,radius,6,false),material);parent.add(m);return m;
   }
   const sphere=pointSphere(850,1.45,0xeaffdc,.075);
   const base=(sphere.geometry.attributes.position.array as Float32Array).slice();
   const word:number[][]=[];
   'ENERLYZE'.split('').forEach((char,ci)=>letters[char].forEach((row,yi)=>row.split('').forEach((on,xi)=>{
    if(on==='1')word.push([(ci*6+xi-23.5)*.125,(3-yi)*.125,0]);
   })));
   sphere.visible=mode==='choose';scene.add(sphere);
   const targets=new Float32Array(base.length);
   for(let i=0;i<base.length/3;i++)targets.set(word[i%word.length],i*3);
   const globe=pointSphere(650,.86,0xa5ff38,.038);
   globe.visible=mode!=='choose';root.add(globe);
   const inner=new T.Mesh(new T.SphereGeometry(.8,40,32),new T.MeshStandardMaterial({color:0x142c21,metalness:.65,roughness:.32}));
   if(mode==='home')root.add(inner);
   const orbitMaterial=new T.MeshBasicMaterial({color:0x66885d,transparent:true,opacity:.32});
   if(mode!=='choose'){
    for(let i=0;i<2;i++){
     const orbit=new T.Mesh(new T.TorusGeometry(2.0+i*.12,.009,5,140),orbitMaterial);
     orbit.rotation.set(.3+i*.65,.25+i*.4,.1);root.add(orbit);
    }
   }
   // Renewable generation: a framed array, individual cells, and supporting legs.
   const solar=new T.Group();solar.position.set(1.73,.45,.15);
   if(mode!=='choose')root.add(solar);
   box(solar,1.25,.93,.06,0,0,0,steel);
   for(let x=0;x<4;x++)for(let y=0;y<3;y++){
    box(solar,.278,.254,.026,-.447+x*.299,-.282+y*.282,.048,cellMaterial,.008);
    box(solar,.005,.244,.003,-.447+x*.299,-.282+y*.282,.064,steel,.001);
   }
   cylinder(solar,.025,.7,-.46,-.51,-.19,steel);
   cylinder(solar,.025,.7,.46,-.51,-.19,steel);
   solar.rotation.set(-.28,-.3,.1);
   // Wind generation: tapered blades rotate around the hub.
   const wind=new T.Group();wind.position.set(-1.55,.52,0);
   if(mode!=='choose')root.add(wind);
   const tower=new T.Mesh(new T.CylinderGeometry(.043,.09,1.18,32),steel);tower.position.y=-.2;wind.add(tower);
   cylinder(wind,.3,.055,0,-.8,0,dark);
   cylinder(wind,.12,.25,0,.39,0,steel,'z');
   const rotor=new T.Group();rotor.position.set(0,.39,.16);wind.add(rotor);
   for(let i=0;i<3;i++){
    const blade=new T.Shape();blade.moveTo(.03,.05);blade.lineTo(.11,.18);blade.lineTo(.065,.73);blade.quadraticCurveTo(0,.83,-.025,.74);blade.lineTo(-.05,.18);blade.closePath();
    const mesh=new T.Mesh(new T.ExtrudeGeometry(blade,{depth:.026,bevelEnabled:true,bevelSize:.007,bevelThickness:.007,bevelSegments:2,steps:1}),steel);
    mesh.rotation.z=i*Math.PI*2/3;rotor.add(mesh);
   }
   cylinder(rotor,.092,.07,0,0,.04,green,'z');
   // A curved leaf represents lower environmental impact and responsible products.
   const leaf=new T.Group();leaf.position.set(.1,-1.68,.25);
   if(mode!=='choose')root.add(leaf);
   const vertices:number[]=[],indices:number[]=[];
   const rows=20,columns=12;
   for(let y=0;y<=rows;y++){
    const v=y/rows,w=Math.sin(Math.PI*v)*.42;
    for(let x=0;x<=columns;x++){
     const u=x/columns*2-1;
     vertices.push(u*w,(v-.5)*1.42,Math.sin(v*Math.PI)*.2*(1-u*u));
    }
   }
   for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
    const a=y*(columns+1)+x,b=a+columns+1;indices.push(a,b,a+1,a+1,b,b+1);
   }
   const leafGeometry=new T.BufferGeometry();
   leafGeometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));leafGeometry.setIndex(indices);leafGeometry.computeVertexNormals();
   leaf.add(new T.Mesh(leafGeometry,leafMaterial));
   tube(leaf,[new T.Vector3(0,-.85,0),new T.Vector3(0,0,.205),new T.Vector3(0,.7,0)],.013,green);
   for(let i=1;i<6;i++){
    const v=i/7,y=(v-.5)*1.42;
    for(const direction of [-1,1])tube(leaf,[new T.Vector3(0,y,Math.sin(v*Math.PI)*.21),new T.Vector3(direction*Math.sin(v*Math.PI)*.34,y+.15,.055)],.004,green);
   }
   leaf.rotation.set(.15,-.2,-.5);
   // Business efficiency remains represented by a compact industrial drive.
   const motor=new T.Group();
   if(mode==='business'){
    globe.scale.setScalar(1.2);root.add(motor);
    cylinder(motor,.48,1.06,0,0,0,dark,'x');
    for(let i=0;i<24;i++){
     const a=i/24*Math.PI*2;
     const fin=box(motor,.95,.07,.026,0,Math.sin(a)*.51,Math.cos(a)*.51,steel,.005);fin.rotation.x=-a;
    }
    cylinder(motor,.53,.1,.58,0,0,steel,'x');
    cylinder(motor,.12,.45,.83,0,0,steel,'x');
    box(motor,.4,.22,.42,-.1,.57,0,dark);
    box(motor,1.3,.08,.85,0,-.6,0,dark);
    motor.rotation.y=-.38;
   }
   if(mode==='choose')root.visible=false;
   let width=1,height=1,aspect=1;
   const resize=()=>{
    width=Math.max(1,el.clientWidth);height=Math.max(1,el.clientHeight);
    aspect=width/height;renderer.setSize(width,height);camera.aspect=aspect;camera.updateProjectionMatrix();
   };
   const observer=new ResizeObserver(resize);observer.observe(el);resize();
   let pointerX=0,pointerY=0,px=0,py=0;
   const onPointer=(e:PointerEvent)=>{
    const rect=el.getBoundingClientRect();
    pointerX=Math.max(-1,Math.min(1,(e.clientX-rect.left)/rect.width*2-1));
    pointerY=Math.max(-1,Math.min(1,(e.clientY-rect.top)/rect.height*2-1));
   };
   const reset=()=>{pointerX=0;pointerY=0};
   el.addEventListener('pointermove',onPointer,{passive:true});el.addEventListener('pointerleave',reset);
   let frame=0,reveal=0,p=0,last=performance.now(),elapsed=0;
   const lerp=(a:number,b:number,k:number)=>a+(b-a)*k;
   function draw(){
    if(disposed)return;
    const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
    const active=motionRef.current;if(active)elapsed+=dt;
    const speed=1-Math.exp(-dt*7);
    px=lerp(px,active?pointerX:0,speed);py=lerp(py,active?pointerY:0,speed);
    reveal=active?lerp(reveal,burstRef.current?1:0,speed):Number(burstRef.current);
    p=active?lerp(p,progress.current,speed):progress.current;
    if(mode==='choose'){
     const positions=sphere.geometry.attributes.position.array as Float32Array;
     const a=active?elapsed*.13:0;
     for(let i=0;i<positions.length;i+=3){
      const sx=base[i]*Math.cos(a)+base[i+2]*Math.sin(a);
      const sz=-base[i]*Math.sin(a)+base[i+2]*Math.cos(a);
      const scatter=Math.sin(reveal*Math.PI)*.18;
      positions[i]=lerp(sx,targets[i],reveal)+Math.sin(i*.43)*scatter;
      positions[i+1]=lerp(base[i+1],targets[i+1],reveal)+Math.cos(i*.71)*scatter;
      positions[i+2]=lerp(sz,0,reveal);
     }
     sphere.geometry.attributes.position.needsUpdate=true;
     sphere.rotation.set(py*.12*(1-reveal),px*.16*(1-reveal),0);
     sphere.material.color.set(reveal>.55?0x80beff:0xdbeaff);
     sphere.material.size=.13+reveal*.13;
    } else {
     root.rotation.y=Math.sin(elapsed*.12)*.07+px*.12+p*.24;
     root.rotation.x=py*.055;
     globe.rotation.y=elapsed*.07+p*.8;
     rotor.rotation.z=-elapsed*.8-p*3;
     solar.rotation.y=-.3+Math.sin(p*Math.PI)*.25;
     leaf.rotation.z=-.5+Math.sin(elapsed*.3)*.06;
     const focus=Math.min(3,Math.floor(p*4));
     solar.scale.setScalar(focus===1?1.12:1);
     wind.scale.setScalar(focus===2?1.08:1);
     leaf.scale.setScalar(focus===3?1.12:1);
    }
    // Fit the complete scene to its own panel; never move a model into the text column.
    const halfFov=Math.tan(38*Math.PI/360);
    const fitWidth=mode==='choose'?lerp(3.6,6.45,reveal):5.95;
    const fitHeight=mode==='choose'?3.6:5.3;
    const distance=Math.max(fitWidth/(2*halfFov*aspect),fitHeight/(2*halfFov))*1.04;
    camera.position.set(0,0,distance);camera.lookAt(0,0,0);
    renderer.render(scene,camera);
    frame=requestAnimationFrame(draw);
   }
   draw();
   cleanup=()=>{
    cancelAnimationFrame(frame);observer.disconnect();
    el.removeEventListener('pointermove',onPointer);el.removeEventListener('pointerleave',reset);
    const geometries=new Set<Three.BufferGeometry>(),materials=new Set<Three.Material>();
    scene.traverse(object=>{const mesh=object as Three.Mesh;if(mesh.geometry)geometries.add(mesh.geometry);const m=mesh.material;if(m)(Array.isArray(m)?m:[m]).forEach(mat=>materials.add(mat))});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
    env.dispose();renderer.dispose();renderer.domElement.remove();
   };
  }).catch(()=>setError(true));
  return ()=>{disposed=true;cleanup()};
 },[mode,progress]);
 return <div className="immersive-canvas" ref={host} role="img" aria-label={mode==='choose'?'Bold spherical point cloud that transforms into the word Enerlyze':mode==='home'?'Connected sustainability ecosystem with solar panels, wind power and a green leaf around a dotted globe':'Efficient industrial drive connected to solar, wind and lower-impact choices'}>
  {error&&<div className="webgl-fallback"><strong>Connected for a greener future.</strong><p>The 3D view is unavailable on this device. All content and tools remain available.</p></div>}
 </div>;
}



