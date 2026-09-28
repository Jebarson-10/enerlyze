// Locally synthesized effects. Audio is initialized only by a visitor gesture.
let context:AudioContext|null=null,master:GainNode|null=null,enabled=false,intro=false;
let assemblyVisible=false,assemblyMode='home',assemblyExpansion=0;
const channels=new Map<string,GainNode>();let lastCue=0,lastMix=0;
function tone(frequency:number,type:OscillatorType,channel:string){
 const oscillator=context!.createOscillator(),gain=context!.createGain();oscillator.type=type;oscillator.frequency.value=frequency;gain.gain.value=0;oscillator.connect(gain).connect(master!);oscillator.start();channels.set(channel,gain);return oscillator;
}
function noise(frequency:number,type:BiquadFilterType,channel:string){
 const buffer=context!.createBuffer(1,context!.sampleRate*2,context!.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
 const source=context!.createBufferSource(),filter=context!.createBiquadFilter(),gain=context!.createGain();source.buffer=buffer;source.loop=true;filter.type=type;filter.frequency.value=frequency;filter.Q.value=.5;gain.gain.value=0;source.connect(filter).connect(gain).connect(master!);source.start();channels.set(channel,gain);
}
function gain(name:string,value:number){const node=channels.get(name);if(context&&node)node.gain.setTargetAtTime(value,context.currentTime,.15);}
export function soundEnabled(){return enabled;}
export async function enableSound(next:boolean){
 try{
  if(next&&!context){context=new AudioContext();master=context.createGain();master.gain.value=0;master.connect(context.destination);noise(1100,'bandpass','water');noise(300,'lowpass','fire');noise(2800,'highpass','steam');tone(105,'sine','motor');tone(210,'sine','motor-high');tone(440,'sine','electric');}
  if(next)await context?.resume();enabled=next;master?.gain.setTargetAtTime(next?.22:0,context!.currentTime,.08);
  window.dispatchEvent(new CustomEvent('enerlyze-sound',{detail:enabled}));if(next)playCue('on');
 }catch{enabled=false;window.dispatchEvent(new CustomEvent('enerlyze-sound',{detail:false}));}
}
export function playCue(kind:'tap'|'hover'|'change'|'on'|'identity'='tap'){
 if(!enabled||!context||context.state!=='running'||!master)return;
 const now=context.currentTime;if(kind==='hover'&&now-lastCue<.25)return;lastCue=now;
 const frequencies=kind==='identity'?[523.25,659.25,783.99]:[kind==='hover'?660:kind==='change'?880:kind==='on'?440:520];
 frequencies.forEach((frequency,i)=>{const osc=context!.createOscillator(),envelope=context!.createGain();const start=now+i*.10;osc.type='sine';osc.frequency.setValueAtTime(frequency,start);osc.frequency.exponentialRampToValueAtTime(frequency*.92,start+.15);envelope.gain.setValueAtTime(0,start);envelope.gain.linearRampToValueAtTime(kind==='hover'?.04:.12,start+.01);envelope.gain.exponentialRampToValueAtTime(.0001,start+(kind==='identity'?.8:.16));osc.connect(envelope).connect(master!);osc.start(start);osc.stop(start+1);osc.onended=()=>{osc.disconnect();envelope.disconnect();};});
}
const smooth=(t:number,a:number,b:number)=>{const p=Math.max(0,Math.min(1,(t-a)/(b-a)));return p*p*(3-2*p);};
export function introSound(t:number){
 intro=t>=0;if(!context||!enabled)return;
 if(!intro){['water','fire','steam','electric'].forEach(name=>gain(name,0));assemblySound(assemblyMode,assemblyExpansion,assemblyVisible);return;}
 gain('water',.40*(1-smooth(t,3,5)));gain('fire',.22*smooth(t,3,5)*(1-smooth(t,9,12)));gain('steam',.13*smooth(t,6,9)*(1-smooth(t,13,17)));gain('motor',.16*smooth(t,10,13)*(1-smooth(t,18,22)));gain('motor-high',.05*smooth(t,11,15)*(1-smooth(t,18,22)));gain('electric',.04*smooth(t,16,19)*(1-smooth(t,22,24)));
}
export function assemblySound(mode:string,expansion:number,visible:boolean){
 assemblyMode=mode;assemblyExpansion=expansion;assemblyVisible=visible;
 if(intro||!enabled||!context||(visible&&performance.now()-lastMix<100))return;lastMix=performance.now();gain('motor',visible?(mode==='business'?.09:.035)*(1-expansion*.5):0);gain('motor-high',visible&&mode==='business'?.025:0);
}
export function pauseSound(hidden:boolean){if(hidden)void context?.suspend();else if(enabled)void context?.resume();}
