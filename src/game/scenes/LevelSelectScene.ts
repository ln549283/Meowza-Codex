import Phaser from 'phaser';
import { journeyId,journeySpec,nextSummit } from '../../core/journey';
import { treeY,treeFocus,treeLimit,visibleTreeLevels,TREE_STEP } from '../../core/treeLayout';
import { loadSummit } from '../../services/JourneyService';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { imageContain,label,press } from '../ui';
import { C } from '../theme';

export class LevelSelectScene extends Phaser.Scene {
 private busy=false;private offset=0;private current=1;
 private rows=new Map<number,Phaser.GameObjects.Container>();private mist!:Phaser.GameObjects.Container;
 private velocity=0;private dragging=false;private pendingOffset:number|undefined;
 constructor(){super('LevelSelect');}
 init(data:{offset?:number}={}){this.busy=false;this.pendingOffset=data.offset;this.velocity=0;this.dragging=false;this.rows.clear();}
 create(){
  this.add.image(540,960,'room-background').setDisplaySize(1080,1920).setDepth(-30);this.add.rectangle(540,960,1080,1920,0xfff5ea,.12).setDepth(-29);this.registry.set('mapDragging',false);
  this.current=nextSummit(SaveService.data.progress);const current=this.current;this.offset=this.pendingOffset??treeFocus(current);this.mist=this.add.container(0,0,[imageContain(this.add.image(540,0,'tree-cloud'),930,405)]).setDepth(25);this.refreshRows();
  const play=async(n:number)=>{if(this.busy)return;this.busy=true;try{const l=await loadSummit(n);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==l.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=l;this.scene.start('Game');}catch{this.busy=false;}};this.events.on('play-level',play);
  const currency=(x:number,key:string,value:string)=>{const c=this.add.container(x,92).setDepth(101),skin=this.add.image(0,0,'button-secondary').setDisplaySize(285,108),icon=imageContain(this.add.image(-88,0,key),72,72),txt=label(this,46,-1,value,34,C.ink,0);c.add([skin,icon,txt]);return c;};
  const iconButton=(x:number,y:number,key:string,onClick:()=>void,size=116)=>{const c=this.add.container(x,y).setDepth(103),skin=this.add.image(0,0,'button-square').setDisplaySize(size,size),icon=imageContain(this.add.image(0,0,key),size*.58,size*.58);c.add([skin,icon]);return press(this,c,size,size,onClick);};
  currency(225,'hub-kibble',String(SaveService.data.kibble));currency(520,'hub-diamond','0');iconButton(970,92,'hub-settings',()=>this.scene.start('Settings'),116);
  const navSkin=this.add.image(540,1810,'button-secondary').setDisplaySize(1030,176).setDepth(100);navSkin.setAlpha(.99);const nav=[{x:155,key:'hub-decorate',go:()=>this.scene.start('Customize')},{x:410,key:'hub-missions',go:()=>this.scene.start('Missions')},{x:670,key:'hub-daily',go:()=>{}},{x:925,key:'hub-shop',go:()=>this.scene.start('Shop')}];nav.forEach(item=>{const c=this.add.container(item.x,1810).setDepth(104),icon=imageContain(this.add.image(0,0,item.key),122,122);c.add(icon);press(this,c,205,150,item.go);});
  let previous=0,previousTime=0;this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);this.velocity=0;previous=p.y;previousTime=p.event.timeStamp;this.dragging=p.y>165&&p.y<1690;});this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!this.dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);const dy=p.y-previous;this.velocity=Phaser.Math.Clamp(dy/Math.max(16,p.event.timeStamp-previousTime),-2.5,2.5);this.offset=Phaser.Math.Clamp(this.offset+dy,0,treeLimit(current));previous=p.y;previousTime=p.event.timeStamp;this.refreshRows();});this.input.on('pointerup',()=>{this.dragging=false;});this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{this.velocity=0;this.offset=Phaser.Math.Clamp(this.offset-dy,0,treeLimit(current));this.refreshRows();});this.events.once('shutdown',()=>{this.input.removeAllListeners();this.events.off('play-level',play);this.rows.clear();this.registry.set('mapDragging',false);});
 }
 update(_time:number,delta:number){if(this.dragging||Math.abs(this.velocity)<.02)return;const dt=Math.min(delta,50);this.offset=Phaser.Math.Clamp(this.offset+this.velocity*dt,0,treeLimit(this.current));this.velocity*=Math.pow(.90,dt/16.67);if(this.offset===0||this.offset===treeLimit(this.current))this.velocity=0;this.refreshRows();}
 private refreshRows(){const visible=visibleTreeLevels(this.current,this.offset);for(const [n,row] of this.rows)if(!visible.includes(n)){row.destroy();this.rows.delete(n);}for(const n of visible){let row=this.rows.get(n);if(!row){row=this.makeRow(n);this.rows.set(n,row);}row.y=treeY(n,this.offset);}this.mist.y=treeY(this.current,this.offset)-385;}
 private makeRow(n:number){
  const row=this.add.container(0,0).setDepth(10),x=[355,690,395,675,345,710,410,660][(n-1)%8]!,progress=SaveService.data.progress[journeyId(n)],done=!!progress?.completed,spec=journeySpec(n),add=(o:Phaser.GameObjects.GameObject)=>{row.add(o);return o;},supportKey=n%2===0?'tree-support-cream':'tree-support-peach';
  if(n>1)add(imageContain(this.add.image(540,TREE_STEP/2+38,'tree-post-long'),104,TREE_STEP+145));else{add(imageContain(this.add.image(540,180,'tree-post-short'),104,390));add(imageContain(this.add.image(540,340,'tree-base'),470,220));}
  const beamMid=(540+x)/2,beamWidth=Math.abs(540-x)+90;add(imageContain(this.add.image(beamMid,92,'tree-hammock-bar'),beamWidth,58));add(imageContain(this.add.image(540,92,'tree-junction-t'),92,92));add(imageContain(this.add.image(x,92,'tree-junction-round'),72,72));add(imageContain(this.add.image(x,102,supportKey),255,120));
  const side=x<540?790:290,sideBeamMid=(540+side)/2,sideBeamWidth=Math.abs(side-540)+70;
  const attachSide=(key:string,y:number,w:number,h:number)=>{add(imageContain(this.add.image(sideBeamMid,y,'tree-hammock-bar'),sideBeamWidth,54));add(imageContain(this.add.image(540,y,'tree-junction-t'),82,82));add(imageContain(this.add.image(side,y,'tree-junction-round'),64,64));add(imageContain(this.add.image(side,y+18,key),w,h));};
  if(n%4===0)attachSide('tree-hammock',142,190,138);else if(n%3===0)attachSide('tree-cubby',128,145,145);else if(n%5===0)attachSide('tree-plant',138,105,125);
  const badgeKey=spec.timed?'badge-timed':spec.difficulty==='easy'?'badge-easy':spec.difficulty==='medium'?'badge-medium':spec.difficulty==='hard'?'badge-hard':'badge-extreme',badge=this.add.container(x,-58),skin=imageContain(this.add.image(0,0,badgeKey),245,104),number=label(this,0,-2,String(n),38,'#ffffff',0);badge.add([skin,number]);
  if(n===this.current&&!done){const ring=imageContain(this.add.image(0,0,'badge-current'),270,116).setAlpha(.9);badge.addAt(ring,0);if(!SaveService.data.settings.reducedMotion)this.tweens.add({targets:ring,alpha:.55,duration:900,yoyo:true,repeat:-1,ease:'Sine.InOut'});}press(this,badge,270,122,()=>{if(this.input.activePointer.y>165&&this.input.activePointer.y<1690)this.events.emit('play-level',n);});add(badge);
  if(done){const stars=progress.bestErrors===0?3:progress.bestErrors===1?2:1;add(imageContain(this.add.image(x,16,`stars-${stars}`),190,70));}
  return row;
 }
}
