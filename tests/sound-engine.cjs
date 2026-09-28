const assert=require('node:assert/strict');const fs=require('node:fs');const ts=require('typescript');const Module=require('node:module');
const nodes=[];let contexts=0;const events=[];
class Parameter{value=0;setTargetAtTime(value){this.value=value;}setValueAtTime(value){this.value=value;}linearRampToValueAtTime(value){this.value=value;}exponentialRampToValueAtTime(value){this.value=value;}}
class Node{gain=new Parameter();frequency=new Parameter();Q=new Parameter();connect(to){return to;}disconnect(){}start(){}stop(){}}
class FakeContext{sampleRate=1000;currentTime=1;state='running';destination=new Node();constructor(){contexts++;}createGain(){const n=new Node();nodes.push(n);return n;}createOscillator(){return new Node();}createBiquadFilter(){return new Node();}createBufferSource(){return new Node();}createBuffer(){return {getChannelData:()=>new Float32Array(2000)}}async resume(){this.state='running'}async suspend(){this.state='suspended'}}
global.AudioContext=FakeContext;global.window={dispatchEvent:event=>events.push(event)};global.CustomEvent=class{constructor(type,options){this.type=type;this.detail=options.detail;}};
const filename=require('node:path').resolve('lib/sound.ts');const source=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m=new Module(filename,module);m._compile(source,filename);const sound=m.exports;
(async()=>{
 assert.equal(sound.soundEnabled(),false);sound.playCue();sound.introSound(7);assert.equal(contexts,0,'No audio context is created before explicit enable');
 await sound.enableSound(true);assert.equal(contexts,1);assert.equal(sound.soundEnabled(),true);assert.equal(events.at(-1).detail,true);
 sound.introSound(7);assert.ok(nodes[0].gain.value>0,'Enabled master is audible');assert.ok(nodes[2].gain.value>0,'Boiling flame sound participates in the intro');
 sound.introSound(-1);assert.equal(nodes[1].gain.value,0,'Water channel stops when the intro ends');assert.equal(nodes[3].gain.value,0,'Steam channel stops when the intro ends');
 sound.assemblySound('business',.5,false);assert.equal(nodes[4].gain.value,0,'Motor ambience stops outside its visible scene');
 await sound.enableSound(false);assert.equal(nodes[0].gain.value,0);assert.equal(sound.soundEnabled(),false);
 await sound.enableSound(true);assert.equal(contexts,1,'Enabling again reuses one graph instead of duplicating loops');
 sound.pauseSound(true);await sound.enableSound(false);assert.equal(nodes[0].gain.value,0);
 console.log('Passed audio gesture gate, reusable graph, intro cleanup, offscreen machinery silence, and mute checks.');
})().catch(error=>{console.error(error);process.exitCode=1});
