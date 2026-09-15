import Phaser from 'phaser';
import {treeTexture} from '../treeStyle';
import {catById} from '../../core/cats';
import {journeyId,journeySpec,nextSummit} from '../../core/journey';
import {treeY,treeFocus,treeLimit,visibleTreeLevels} from '../../core/treeLayout';
import {CHUNK_SCALE,CHUNK_X,chunkForIndex,treeAnchor,visibleChunks} from '../../core/treeChunks';
import {loadSummit} from '../../services/JourneyService';
import {SaveService} from '../../services/SaveService';
import {GameRegistry} from '../registry';
import {equippedBackgroundKey,imageContain,label} from '../ui';
import {C} from '../theme';

const TOP=218;
/** The illustration owns the furniture. Only buttons and milestones are separate objects. */
export class LevelSelectScene extends Phaser.Scene {
 private busy=false;private offset=0;private current=1;
 private rows=new Map<number,Phaser.GameObjects.Container>();
 private chunks=new Map<number,Phaser.GameObjects.Container>();
 private world!:Phaser.GameObjects.Container;private bottom=1630;
 private locate!:Phaser.GameObjects.Container;private status!:Phaser.GameObjects.Text;
 private velocity=0;private dragging=false;private pendingOffset:number|undefined;
 constructor(){super('LevelSelect');}
 init(data:{offset?:number}={}){this.busy=false;this.pendingOffset=data.offset;this.velocity=0;this.dragging=false;this.rows.clear();this.chunks.clear();}
 create(){
  const height=this.scale.height,BOTTOM=height-320;this.bottom=BOTTOM;
  for(const key of this.textures.getTextureKeys())if(key.startsWith('styled-tree-full-'))this.textures.remove(key);
  this.cameras.main.setBackgroundColor(0xfff8ed);
  this.add.image(540,960,equippedBackgroundKey()).setDisplaySize(1080,1920).setAlpha(.30).setDepth(-30);
  this.registry.set('mapDragging',false);
  this.current=nextSummit(SaveService.data.progress);
  this.offset=Phaser.Math.Clamp(this.pendingOffset??treeFocus(this.current),0,treeLimit(this.current));
  this.world=this.add.container(0,0).setDepth(10);
  const clip=this.make.graphics({x:0,y:0}).fillStyle(0xffffff).fillRect(0,TOP,1080,BOTTOM-TOP);
  const mask=clip.createGeometryMask();this.world.setMask(mask);
  this.add.graphics().fillStyle(0xfffaf3,.98).fillRect(0,0,1080,210).lineStyle(2,0xe7d9c8).lineBetween(60,209,1020,209).setDepth(100);
  const wallet=(x:number,key:string,value:number)=>{
   const c=this.add.container(x,82).setDepth(101);
   c.add([this.add.graphics().fillStyle(0xf2e7d9).fillRoundedRect(-130,-42,260,84,30),imageContain(this.add.image(-78,0,key),60,60),label(this,28,0,String(value),31,C.ink,0)]);
  };
  wallet(205,'hub-kibble',SaveService.data.kibble);wallet(495,'hub-diamond',SaveService.data.missions.diamonds);
  const settings=this.add.container(963,82).setDepth(102);settings.add(imageContain(this.add.image(0,0,'hub-settings'),62,62));this.tap(settings,116,116,()=>this.scene.start('Settings'));
  const milestone=Math.ceil(this.current/10)*10,cleared=this.current-1;
  this.add.image(85,165,'ui-gift').setDisplaySize(44,44).setDepth(101);
  label(this,350,166,`Prochain palier · niveau ${milestone}`,26,C.ink,0).setDepth(101);
  const meter=this.add.graphics().setDepth(101).fillStyle(0xe8ddcf).fillRoundedRect(710,153,270,20,10);
  const ratio=((cleared%10)/10);if(ratio>0)meter.fillStyle(0x7fae8c).fillRoundedRect(710,153,270*ratio,20,10);
  this.status=label(this,540,height-268,'',27,C.ink,0).setDepth(105);
  this.locate=this.add.container(540,height-268).setDepth(105);
  this.locate.add([this.add.graphics().fillStyle(0xfffaf3,.97).lineStyle(2,0xddcdb9).fillRoundedRect(-150,-35,300,70,28).strokeRoundedRect(-150,-35,300,70,28),label(this,0,0,'Mon niveau ↑',26,C.ink,0)]);
  this.tap(this.locate,320,90,()=>{this.offset=treeLimit(this.current);this.velocity=0;this.refreshRows();});
  const navY=height-120,navWidth=984,left=48,itemW=246;
  this.add.graphics().fillStyle(0xfffaf3,.99).fillRoundedRect(left,height-220,navWidth,190,36).lineStyle(2,0xe1d1c0).strokeRoundedRect(left,height-220,navWidth,190,36).setDepth(102);
  const nav=[{key:'hub-decorate',text:'Collection',go:()=>this.scene.start('Customize')},{key:'hub-missions',text:'Missions',go:()=>this.scene.start('Missions')},{key:'hub-daily',text:'Défi du jour',go:()=>this.scene.start('Missions',{tab:'daily'})},{key:'hub-shop',text:'Boutique',go:()=>this.scene.start('Shop')}];
  nav.forEach((item,i)=>{const c=this.add.container(left+(i+.5)*itemW,navY).setDepth(104);c.add([imageContain(this.add.image(0,-24,item.key),74,74),label(this,0,39,item.text,30,C.ink,0)]);this.tap(c,itemW,164,item.go);});
  let previous=0,previousTime=0;
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);this.velocity=0;previous=p.y;previousTime=p.event.timeStamp;this.dragging=p.y>TOP&&p.y<BOTTOM;});
  this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!this.dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);const dy=p.y-previous;this.velocity=Phaser.Math.Clamp(dy/Math.max(16,p.event.timeStamp-previousTime),-2.5,2.5);this.offset=Phaser.Math.Clamp(this.offset+dy,0,treeLimit(this.current));previous=p.y;previousTime=p.event.timeStamp;this.refreshRows();});
  this.input.on('pointerup',()=>{this.dragging=false;});this.input.on('gameout',()=>{this.dragging=false;this.velocity=0;});
  this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{this.velocity=0;this.offset=Phaser.Math.Clamp(this.offset-dy,0,treeLimit(this.current));this.refreshRows();});
  const resized=()=>{if(this.scene.isActive())this.scene.restart({offset:this.offset});};this.scale.on('resize',resized);
  this.events.once('shutdown',()=>{this.scale.off('resize',resized);this.input.removeAllListeners();this.rows.clear();this.chunks.clear();mask.destroy();clip.destroy();this.registry.set('mapDragging',false);});
  this.refreshRows();
 }
 private tap(c:Phaser.GameObjects.Container,w:number,h:number,action:()=>void){
  c.setSize(w,h).setInteractive({useHandCursor:true});
  c.on('pointerup',(p:Phaser.Input.Pointer)=>{if(p.getDistance()>18||this.registry.get('mapDragging')||this.busy)return;action();});
 }
 update(_time:number,delta:number){if(this.dragging||Math.abs(this.velocity)<.02)return;const dt=Math.min(delta,50);this.offset=Phaser.Math.Clamp(this.offset+this.velocity*dt,0,treeLimit(this.current));this.velocity*=Math.pow(.90,dt/16.67);if(this.offset===0||this.offset===treeLimit(this.current))this.velocity=0;this.refreshRows();}
 private refreshRows(){
  const displayOffset=this.offset+Math.max(0,this.scale.height-1920)*.7;
  const visible=visibleChunks(displayOffset,this.current,this.scale.height);
  for(const [i,c]of this.chunks)if(!visible.includes(i)){c.destroy();this.chunks.delete(i);}
  for(const i of visible){let c=this.chunks.get(i);const chunk=chunkForIndex(i);if(!c){
   c=this.add.container(CHUNK_X,0);c.add(this.add.image(0,0,treeTexture(this,chunk.kind,SaveService.data.equipped.wood,SaveService.data.equipped.cushion)).setOrigin(0).setScale(CHUNK_SCALE));
   // A quiet secondary accent on B, physically resting on the shelf.
   if(chunk.kind==='b'){
    c.add(imageContain(this.add.image(827*CHUNK_SCALE,116*CHUNK_SCALE,'tree-yarn'),62,62));
    const hook=this.add.graphics().lineStyle(13,0x94643d).lineBetween(500*CHUNK_SCALE,870*CHUNK_SCALE,690*CHUNK_SCALE,870*CHUNK_SCALE).lineStyle(7,0xdcb77f).lineBetween(500*CHUNK_SCALE,866*CHUNK_SCALE,690*CHUNK_SCALE,866*CHUNK_SCALE);
    c.add([hook,imageContain(this.add.image(682*CHUNK_SCALE,1020*CHUNK_SCALE,'tree-hanging-plant'),162,280)]);
   }
   if(chunk.kind==='a'){
    c.add(this.add.graphics().lineStyle(3,0xab8054).lineBetween(320*CHUNK_SCALE,1000*CHUNK_SCALE,320*CHUNK_SCALE,1100*CHUNK_SCALE));
    c.add(imageContain(this.add.image(320*CHUNK_SCALE,1130*CHUNK_SCALE,'tree-pompon'),65,100));
   }
   for(let n=chunk.first;n<chunk.first+(chunk.kind==='base'?4:3);n++){
    const cat=catById(SaveService.data.refuges[String(n)]??'');if(!cat||n>=this.current)continue;
    const anchor=treeAnchor(n);c.add(imageContain(this.add.image((anchor.x-CHUNK_X),(anchor.y-chunk.top)-90,cat.texture),160,190));
   }
   this.world.addAt(c,0);this.chunks.set(i,c);
  }c.y=1040+chunk.top+displayOffset;}
  const levels=visibleTreeLevels(this.current,displayOffset,this.scale.height);
  for(const [n,row]of this.rows)if(!levels.includes(n)){row.destroy();this.rows.delete(n);}
  for(const n of levels){let row=this.rows.get(n);if(!row){row=this.makeRow(n);this.world.add(row);this.rows.set(n,row);}row.y=treeY(n,displayOffset)+80;if(row.input)row.input.enabled=row.y>TOP+50&&row.y<this.bottom-50;}
  if(this.locate)this.locate.setVisible(treeY(this.current,displayOffset)<TOP+70||treeY(this.current,displayOffset)>this.bottom-140);
 }
 private makeRow(n:number){
  const anchor=treeAnchor(n),row=this.add.container(anchor.x,0),progress=SaveService.data.progress[journeyId(n)],done=!!progress?.completed,spec=journeySpec(n);
  const key=spec.timed?'badge-timed':`badge-${spec.difficulty}`;
  const current=n===this.current&&!done;
  if(current)row.add(this.add.graphics().fillStyle(0xfffcf4).lineStyle(3,0xb08a52).fillRoundedRect(-109,-45,218,90,20).strokeRoundedRect(-109,-45,218,90,20));
  row.add([imageContain(this.add.image(0,0,key),194,72),label(this,0,-1,String(n),34,'#ffffff',0)]);
  if(done)row.add(imageContain(this.add.image(0,57,`stars-${progress.bestErrors===0?3:progress.bestErrors===1?2:1}`),125,42));
  else if(current)row.add(label(this,0,63,'À toi !',24,'#664f38',0));
  if(n%10===0){
   const plaque=this.add.graphics().fillStyle(0xfff9e9).lineStyle(2,0xc59b5d).fillRoundedRect(-124,-103,248,49,16).strokeRoundedRect(-124,-103,248,49,16);
   row.add([plaque,imageContain(this.add.image(-92,-79,'ui-gift'),34,34),label(this,14,-79,`Palier ${n}`,24,'#76572d',0)]);
  }
  this.tap(row,230,112,()=>{if(row.y>TOP+50&&row.y<this.bottom-50)void this.play(n);});
  return row;
 }
 private async play(n:number){
  if(this.busy)return;this.busy=true;this.status.setText('Préparation du niveau…');
  try{const l=await loadSummit(n);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==l.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=l;this.scene.start('Game');}
  catch{if(!this.scene.isActive())return;this.busy=false;this.status.setText('Chargement impossible. Touche le niveau pour réessayer.');}
 }
}
