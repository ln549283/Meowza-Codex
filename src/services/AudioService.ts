import { SaveService } from './SaveService';
class AudioServiceImpl {
 private context?:AudioContext;private timer:ReturnType<typeof setInterval>|undefined;private step=0;private hidden=false;private voices=new Set<OscillatorNode>();
 private ready(){this.context??=new AudioContext();if(this.context.state==='suspended')void this.context.resume();return this.context;}
 private tone(frequency:number,seconds:number,volume:number,delay=0){const ctx=this.ready(),o=ctx.createOscillator(),g=ctx.createGain(),at=ctx.currentTime+delay;o.type='sine';o.frequency.value=frequency;g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(volume,at+.02);g.gain.exponentialRampToValueAtTime(.0001,at+seconds);o.connect(g).connect(ctx.destination);o.onended=()=>{this.voices.delete(o);o.disconnect();g.disconnect();};this.voices.add(o);o.start(at);o.stop(at+seconds+.02);}
 play(kind:'button'|'place'|'invalid'|'hint'|'victory'){if(this.hidden)return;try{if(!this.timer&&SaveService.data.settings.music)this.syncMusic();if(!SaveService.data.settings.sounds)return;const notes={button:[523],place:[659],invalid:[220,196],hint:[659,880],victory:[523,659,784,1047]}[kind];notes.forEach((n,i)=>this.tone(n,kind==='victory'?.5:.17,.025,i*.09));}catch{/* Audio must never block the puzzle. */}}
 syncMusic(){if(this.timer){clearInterval(this.timer);this.timer=undefined;}if(!SaveService.data.settings.music||this.hidden){this.voices.forEach(v=>{try{v.stop();}catch{/* already ended */}});return;}try{this.ready();const notes=[261.63,329.63,392,329.63,293.66,349.23,440,349.23,261.63,392,523.25,392,293.66,349.23,392,329.63];this.timer=setInterval(()=>{this.tone(notes[this.step++%notes.length]!,1.4,.012);},600);}catch{/* unavailable web audio */}}
 suspend(){this.hidden=true;if(this.timer){clearInterval(this.timer);this.timer=undefined;}void this.context?.suspend();}
 resume(){this.hidden=false;this.syncMusic();}
}
export const AudioService=new AudioServiceImpl();
