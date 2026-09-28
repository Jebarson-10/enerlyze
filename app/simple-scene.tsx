'use client';
import {useEffect,useRef,useState,type MutableRefObject} from 'react';
import type * as Three from 'three';
import {assemblySound} from '@/lib/sound';

export default function SimpleScene({mode,progress,motion}:{mode:'home'|'business';progress:MutableRefObject<number>;motion:boolean}){
 const host=useRef<HTMLDivElement>(null);const active=useRef(motion);const [error,setError]=useState(false);
 useEffect(()=>{active.current=motion},[motion]);
 useEffect(()=>{
  let disposed=false;let cleanup=()=>{};
  Promise.all([import('three'),import('three/addons/geometries/RoundedBoxGeometry.js'),import('three/addons/environments/RoomEnvironment.js')]).then(([T,{RoundedBoxGeometry},{RoomEnvironment}])=>{
   if(disposed||!host.current)return;const element=host.current;
   let renderer:Three.WebGLRenderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true});}catch{setError(true);return}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x0b1019,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;element.appendChild(renderer.domElement);
   const scene=new T.Scene();const camera=new T.PerspectiveCamera(35,1,.1,50);
   const pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
   scene.add(new T.HemisphereLight(0xe5efff,0x17202f,1.4));const light=new T.DirectionalLight(0xffffff,3);light.position.set(4,5,6);scene.add(light);
   const fill=new T.DirectionalLight(0x7aaaff,1.8);fill.position.set(-4,1,-3);scene.add(fill);
   const root=new T.Group();scene.add(root);root.rotation.set(.42,-.45,-.12);
   const silver=new T.MeshPhysicalMaterial({color:0xd2dce8,metalness:.9,roughness:.23,clearcoat:.35});
   const blue=new T.MeshPhysicalMaterial({color:0x275084,metalness:.55,roughness:.3,clearcoat:.8,clearcoatRoughness:.22});
   const dark=new T.MeshStandardMaterial({color:0x202c39,metalness:.75,roughness:.3});
   const copper=new T.MeshPhysicalMaterial({color:0xc67a43,metalness:.95,roughness:.25});
   const rubber=new T.MeshStandardMaterial({color:0x121922,roughness:.8});
   const ceramic=new T.MeshPhysicalMaterial({color:0xcdd2d9,metalness:.3,roughness:.28,clearcoat:.8});
   const led=new T.MeshStandardMaterial({color:0x77baff,emissive:0x4d99ff,emissiveIntensity:1.8});
   const materials=[silver,blue,dark,copper,rubber,ceramic,led];
   const parts:{object:Three.Object3D;base:Three.Vector3;offset:Three.Vector3}[]=[];
   const part=(object:Three.Object3D,x:number,y:number,z:number,dx:number,dy:number,dz:number,parent:Three.Object3D=root)=>{object.position.set(x,y,z);parent.add(object);parts.push({object,base:object.position.clone(),offset:new T.Vector3(dx,dy,dz)});return object;};
   const cylinder=(radius:number,height:number,material:Three.Material,segments=64)=>new T.Mesh(new T.CylinderGeometry(radius,radius,height,segments),material);
   const box=(x:number,y:number,z:number,material:Three.Material,r=.02)=>new T.Mesh(new RoundedBoxGeometry(x,y,z,3,r),material);
   const ring=(radius:number,tube:number,material:Three.Material)=>{const mesh=new T.Mesh(new T.TorusGeometry(radius,tube,12,80),material);mesh.rotation.x=Math.PI/2;return mesh;};
   const screw=(parent:Three.Object3D,x:number,y:number,z:number)=>{const bolt=cylinder(.032,.023,silver,6);bolt.position.set(x,y,z);parent.add(bolt);const slot=box(.034,.005,.007,dark,.001);slot.position.set(x,y+.014,z);parent.add(slot);};
   const bearing=(radius:number)=>{const group=new T.Group();group.add(ring(radius,.026,silver),ring(radius*.67,.023,dark));for(let i=0;i<12;i++){const a=i*Math.PI/6;const ball=new T.Mesh(new T.SphereGeometry(.022,12,8),silver);ball.position.set(Math.cos(a)*radius*.83,0,Math.sin(a)*radius*.83);group.add(ball);}return group;};
   const coil=(radius:number,length:number,turns:number)=>{const points=[];for(let i=0;i<=turns*16;i++){const a=i/16*Math.PI*2;points.push(new T.Vector3(Math.cos(a)*radius,(i/(turns*16)-.5)*length,Math.sin(a)*radius));}return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),turns*16,.009,6,false),copper);};
   const rotor=new T.Group();root.add(rotor);
   if(mode==='home'){
    // Stationary housing, visible seams, wiring slots, and a machined stator.
    const housing=new T.Group();housing.add(cylinder(.57,.25,blue));housing.add(ring(.574,.011,silver));for(let i=0;i<24;i++){const a=i*Math.PI/12;const vent=box(.026,.08,.012,rubber,.004);vent.position.set(Math.cos(a)*.571,.01,Math.sin(a)*.571);vent.rotation.y=-a+Math.PI/2;housing.add(vent);}part(housing,0,0,0,0,.2,0);
    const stator=new T.Group();stator.add(cylinder(.34,.17,dark));for(let i=0;i<12;i++){const a=i*Math.PI/6;const winding=coil(.044,.17,11);winding.position.set(Math.cos(a)*.395,0,Math.sin(a)*.395);stator.add(winding);const tooth=box(.08,.19,.10,dark,.007);tooth.position.set(Math.cos(a)*.33,0,Math.sin(a)*.33);tooth.rotation.y=-a;stator.add(tooth);}part(stator,0,.18,0,0,.72,0);
    const cover=new T.Group();cover.add(cylinder(.60,.06,ceramic),ring(.57,.012,silver));for(let i=0;i<6;i++){const a=i*Math.PI/3;screw(cover,Math.cos(a)*.50,.04,Math.sin(a)*.50);}part(cover,0,.31,0,0,1.15,0);
    part(bearing(.12),0,.37,0,0,1.35,0);part(cylinder(.045,.74,silver),0,.68,0,0,.9,0);
    const neck=new T.Group();neck.add(cylinder(.10,.32,blue),ring(.105,.018,silver));part(neck,0,.87,0,0,.75,0);
    const hub=new T.Group();hub.add(cylinder(.37,.21,blue),ring(.37,.012,silver));const dome=new T.Mesh(new T.SphereGeometry(.36,48,24,0,Math.PI*2,0,Math.PI/2),ceramic);dome.rotation.x=Math.PI;dome.scale.y=.45;dome.position.y=-.09;hub.add(dome);part(hub,0,-.20,0,0,-.72,0,rotor);
    // Swept, tapered blades with a curved aerofoil instead of flat boxes.
    const bladeShape=new T.Shape();bladeShape.moveTo(.30,-.08);bladeShape.bezierCurveTo(.70,-.10,1.25,-.27,1.77,-.22);bladeShape.quadraticCurveTo(1.88,-.17,1.78,-.07);bladeShape.bezierCurveTo(1.25,.18,.66,.15,.30,.09);bladeShape.closePath();
    const bladeGeometry=new T.ExtrudeGeometry(bladeShape,{depth:.022,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.018,bevelThickness:.01,curveSegments:24});bladeGeometry.rotateX(-Math.PI/2);
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const assembly=new T.Group();const blade=new T.Mesh(bladeGeometry,ceramic);blade.rotation.z=.035;assembly.add(blade);const mount=box(.38,.045,.17,silver);mount.position.x=.43;assembly.add(mount);screw(assembly,.37,.04,0);screw(assembly,.52,.04,0);assembly.rotation.y=-a;part(assembly,0,-.15,0,Math.cos(a)*.62,-.22,Math.sin(a)*.62,rotor);}
   }else{
    // Ribbed cast housing with cooling fins, flange bolts, winding cage and shaft.
    const shell=new T.Group();const body=cylinder(.64,1.16,blue);body.rotation.z=Math.PI/2;shell.add(body);part(shell,0,0,0,0,0,0);
    for(let i=0;i<28;i++){const a=i/28*Math.PI*2;const fin=box(1.05,.07,.04,blue,.008);fin.rotation.x=-a;part(fin,0,Math.sin(a)*.69,Math.cos(a)*.69,0,Math.sin(a)*.21,Math.cos(a)*.21);}
    const flange=(radius:number)=>{const group=new T.Group();group.add(cylinder(radius,.13,blue),ring(radius-.025,.014,silver));const collar=cylinder(.28,.20,silver);collar.position.y=.06;group.add(collar);for(let i=0;i<8;i++){const a=i*Math.PI/4;screw(group,Math.cos(a)*(radius-.085),.075,Math.sin(a)*(radius-.085));}group.rotation.z=Math.PI/2;return group;};
    part(flange(.71),.67,0,0,.90,0,0);part(flange(.66),-.67,0,0,-.90,0,0);
    const winding=new T.Group();for(let i=0;i<18;i++){const a=i*Math.PI/9;const c=coil(.046,.87,15);c.rotation.z=Math.PI/2;c.position.set(0,Math.cos(a)*.37,Math.sin(a)*.37);winding.add(c);}part(winding,0,0,0,1.40,.10,0);
    const armature=new T.Group();const core=cylinder(.26,.98,dark);core.rotation.z=Math.PI/2;armature.add(core);for(let i=0;i<14;i++){const a=i*Math.PI/7;const bar=box(.95,.027,.035,copper,.003);bar.position.set(0,Math.cos(a)*.266,Math.sin(a)*.266);bar.rotation.x=a;armature.add(bar);}part(armature,0,0,0,1.66,0,0,rotor);
    const shaft=cylinder(.105,1.9,silver);shaft.rotation.z=Math.PI/2;part(shaft,.31,0,0,1.3,0,0,rotor);const key=box(.34,.035,.065,dark,.005);part(key,1.08,.11,0,1.3,0,0,rotor);
    for(const sign of [-1,1]){const b=bearing(.18);b.rotation.z=Math.PI/2;part(b,sign*.56,0,0,sign*.85,0,0);}
    const cooling=new T.Group();const disk=cylinder(.48,.065,dark);disk.rotation.z=Math.PI/2;cooling.add(disk);for(let i=0;i<10;i++){const a=i*Math.PI/5;const vane=box(.15,.11,.28,dark,.012);vane.position.set(0,Math.sin(a)*.32,Math.cos(a)*.32);vane.rotation.x=-a+.25;cooling.add(vane);}part(cooling,-.81,0,0,-1.3,0,0,rotor);
    const terminal=new T.Group();terminal.add(box(.45,.28,.5,blue,.035));for(const x of [-.15,.15])for(const z of [-.18,.18])screw(terminal,x,.16,z);const cable=new T.Mesh(new T.CylinderGeometry(.045,.045,.12,24),rubber);cable.rotation.z=Math.PI/2;cable.position.set(.27,0,0);terminal.add(cable);const indicator=new T.Mesh(new T.SphereGeometry(.018,12,8),led);indicator.position.set(0,.15,0);terminal.add(indicator);part(terminal,-.12,.85,0,0,.75,0);
    const base=new T.Group();base.add(box(1.48,.11,1.04,blue));for(const x of [-.5,.5])for(const z of [-.36,.36]){screw(base,x,.07,z);const foot=box(.29,.16,.30,dark);foot.position.set(x,.12,z);base.add(foot);}part(base,0,-.83,0,0,-.65,0);
    const plate=box(.40,.20,.013,silver,.008);part(plate,-.10,.16,.654,0,.08,.28);for(let i=0;i<5;i++){const label=box(.29-i*.022,.008,.004,dark,.001);part(label,-.1,.22-i*.03,.665,0,.08,.28);}
   }
   let aspect=1;const resize=()=>{const w=Math.max(1,element.clientWidth),h=Math.max(1,element.clientHeight);aspect=w/h;renderer.setSize(w,h);camera.aspect=aspect;camera.updateProjectionMatrix();};
   let visible=false;const visibility=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;},{threshold:.1});visibility.observe(element);
   const observer=new ResizeObserver(resize);observer.observe(element);resize();let frame=0;let expansion=0;let phase=0;let last=performance.now();
   const draw=()=>{if(disposed)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;const p=Math.max(0,Math.min(1,progress.current));const target=Math.sin(p*Math.PI);
    expansion=active.current?expansion+(target-expansion)*(1-Math.exp(-dt*7)):target;parts.forEach(({object,base,offset})=>object.position.copy(base).addScaledVector(offset,expansion));
    if(active.current)phase+=dt*(mode==='home'?.85:1.7);if(mode==='home')rotor.rotation.y=phase;else rotor.rotation.x=phase;
    root.rotation.y=-.45+p*.5;root.rotation.x=(mode==='home'?.50:.25)+p*.12;
    element.dataset.running=String(active.current);element.dataset.expansion=expansion.toFixed(2);
    assemblySound(mode,expansion,visible);
    const extent=mode==='home'?6.0:6.7;camera.position.set(0,0,Math.max(extent/(2*Math.tan(35*Math.PI/360)*aspect),5.4/(2*Math.tan(35*Math.PI/360))));camera.lookAt(0,0,0);renderer.render(scene,camera);frame=requestAnimationFrame(draw);
   };draw();cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();assemblySound(mode,0,false);const geometries=new Set<Three.BufferGeometry>();scene.traverse(o=>{const m=o as Three.Mesh;if(m.geometry)geometries.add(m.geometry)});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());environment.dispose();renderer.dispose();renderer.domElement.remove();};
  }).catch(()=>setError(true));return()=>{disposed=true;cleanup()};
 },[mode,progress]);
 return <div className="immersive-canvas simple-scene" ref={host} role="img" aria-label={mode==='home'?'Running BLDC fan with curved blades, copper windings and bearings, separating as you scroll':'Running industrial motor with cooling fins, copper windings and rotating shaft, separating as you scroll'}>{error&&<div className="webgl-fallback"><p>The 3D view is unavailable. All content and tools are still available.</p></div>}</div>;
}
