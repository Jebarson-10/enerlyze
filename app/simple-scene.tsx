'use client';
import {useEffect,useRef,useState,type MutableRefObject} from 'react';
import type * as Three from 'three';

export default function SimpleScene({mode,progress,motion}:{mode:'home'|'business';progress:MutableRefObject<number>;motion:boolean}){
 const host=useRef<HTMLDivElement>(null);const active=useRef(motion);const [error,setError]=useState(false);
 useEffect(()=>{active.current=motion},[motion]);
 useEffect(()=>{
  let disposed=false;let cleanup=()=>{};
  Promise.all([import('three'),import('three/addons/geometries/RoundedBoxGeometry.js')]).then(([T,{RoundedBoxGeometry}])=>{
   if(disposed||!host.current)return;const element=host.current;
   let renderer:Three.WebGLRenderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true});}catch{setError(true);return}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x0b1019,0);element.appendChild(renderer.domElement);
   const scene=new T.Scene();const camera=new T.PerspectiveCamera(35,1,.1,50);
   scene.add(new T.HemisphereLight(0xddeaff,0x17202f,3));const light=new T.DirectionalLight(0xffffff,4);light.position.set(4,5,6);scene.add(light);
   const fill=new T.DirectionalLight(0x518bff,3);fill.position.set(-4,1,2);scene.add(fill);
   const root=new T.Group();scene.add(root);root.rotation.set(.25,-.45,-.08);
   const silver=new T.MeshStandardMaterial({color:0xd2dce8,metalness:.55,roughness:.3});
   const blue=new T.MeshStandardMaterial({color:0x477dce,metalness:.55,roughness:.28});
   const dark=new T.MeshStandardMaterial({color:0x273748,metalness:.65,roughness:.32});
   const copper=new T.MeshStandardMaterial({color:0xc39264,metalness:.6,roughness:.35});
   const parts:{object:Three.Object3D;base:Three.Vector3;offset:Three.Vector3}[]=[];
   const part=(object:Three.Object3D,x:number,y:number,z:number,dx:number,dy:number,dz:number)=>{object.position.set(x,y,z);root.add(object);parts.push({object,base:object.position.clone(),offset:new T.Vector3(dx,dy,dz)});return object;};
   const cylinder=(radius:number,height:number,material:Three.Material)=>new T.Mesh(new T.CylinderGeometry(radius,radius,height,48),material);
   if(mode==='home'){
    part(cylinder(.57,.26,blue),0,0,0,0,.3,0);
    part(cylinder(.44,.16,copper),0,.16,0,0,.8,0);
    part(cylinder(.60,.07,silver),0,.30,0,0,1.3,0);
    part(cylinder(.34,.22,dark),0,-.24,0,0,-.9,0);
    const shaft=cylinder(.045,.55,silver);part(shaft,0,.56,0,0,.9,0);
    for(let i=0;i<3;i++){
     const angle=i*Math.PI*2/3;const blade=new T.Mesh(new RoundedBoxGeometry(1.3,.055,.33,3,.045),silver);
     blade.rotation.y=-angle;blade.rotation.z=.06;const x=Math.cos(angle)*.91,z=Math.sin(angle)*.91;
     part(blade,x,-.07,z,Math.cos(angle)*.8,-.45,Math.sin(angle)*.8);
     const bolt=cylinder(.035,.16,dark);part(bolt,Math.cos(angle)*.42,.15,Math.sin(angle)*.42,Math.cos(angle)*.4,.7,Math.sin(angle)*.4);
    }
   }else{
    const body=cylinder(.65,1.15,blue);body.rotation.z=Math.PI/2;part(body,0,0,0,0,0,0);
    for(let i=0;i<20;i++){const a=i/20*Math.PI*2;const fin=new T.Mesh(new RoundedBoxGeometry(.96,.07,.055,2,.012),dark);fin.rotation.x=-a;part(fin,0,Math.sin(a)*.67,Math.cos(a)*.67,0,Math.sin(a)*.35,Math.cos(a)*.35);}
    const end=cylinder(.68,.13,silver);end.rotation.z=Math.PI/2;part(end,.68,0,0,1,0,0);
    const cap=cylinder(.65,.13,dark);cap.rotation.z=Math.PI/2;part(cap,-.68,0,0,-1,0,0);
    const rotor=cylinder(.29,1.15,copper);rotor.rotation.z=Math.PI/2;part(rotor,0,0,0,1.65,.15,0);
    const shaft=cylinder(.11,1.8,silver);shaft.rotation.z=Math.PI/2;part(shaft,.35,0,0,1.3,0,0);
    const terminal=new T.Mesh(new RoundedBoxGeometry(.45,.28,.5,3,.04),blue);part(terminal,-.12,.82,0,0,.9,0);
    const base=new T.Mesh(new RoundedBoxGeometry(1.5,.12,1.05,3,.04),dark);part(base,0,-.79,0,0,-.7,0);
   }
   let aspect=1;const resize=()=>{const w=Math.max(1,element.clientWidth),h=Math.max(1,element.clientHeight);aspect=w/h;renderer.setSize(w,h);camera.aspect=aspect;camera.updateProjectionMatrix();};
   const observer=new ResizeObserver(resize);observer.observe(element);resize();let frame=0;let expansion=0;let last=performance.now();
   const draw=()=>{if(disposed)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;const p=Math.max(0,Math.min(1,progress.current));const target=Math.sin(p*Math.PI);
    expansion=active.current?expansion+(target-expansion)*(1-Math.exp(-dt*7)):target;
    parts.forEach(({object,base,offset})=>object.position.copy(base).addScaledVector(offset,expansion));
    root.rotation.y=-.45+p*.5;root.rotation.x=.25+p*.12;
    const extent=mode==='home'?5.8:6.7;camera.position.set(0,0,Math.max(extent/(2*Math.tan(35*Math.PI/360)*aspect),5.6/(2*Math.tan(35*Math.PI/360))));camera.lookAt(0,0,0);renderer.render(scene,camera);frame=requestAnimationFrame(draw);
   };draw();cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();const geometries=new Set<Three.BufferGeometry>();scene.traverse(o=>{const m=o as Three.Mesh;if(m.geometry)geometries.add(m.geometry)});geometries.forEach(g=>g.dispose());[silver,blue,dark,copper].forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
  }).catch(()=>setError(true));return()=>{disposed=true;cleanup()};
 },[mode,progress]);
 return <div className="immersive-canvas simple-scene" ref={host} role="img" aria-label={mode==='home'?'BLDC fan assembly that separates and reassembles as you scroll':'Industrial drive assembly that separates and reassembles as you scroll'}>{error&&<div className="webgl-fallback"><p>The 3D view is unavailable. All content and tools are still available.</p></div>}</div>;
}
