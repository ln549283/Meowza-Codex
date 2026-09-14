import Phaser from 'phaser';
import { journeyId,journeySpec,nextSummit } from '../../core/journey';
import { treeY,treeFocus,treeLimit,visibleTreeLevels,TREE_STEP } from '../../core/treeLayout';
import { staticTreeSlot } from '../../core/treeChunks';
import { catById,collectionCats,habitatStyleForLevel } from '../../core/cats';
import { loadSummit } from '../../services/JourneyService';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { equippedBackgroundKey,imageContain,label,press } from '../ui';
import { C } from '../theme';

export class LevelSelectScene extends Phaser.Scene {
 private busy=false;private offset=0;private current=1;
 private rows=new Map<number,Phaser.GameObjects.Container>();private mist!:Phaser.GameObjects.Container;
 private velocity=0;private dragging=false;private pendingOffset:number|undefined;
 constructor(){super('LevelSelect');}
 init(data:{offset?:number}={}){this.busy=false;this.pendingOffset=data.offset;this.velocity=0;this.dragging=false;this.rows.clear();}
 create(){
  const bg=equippedBackgroundKey();this.add.image(540,960,bg).setDisplaySize(1080,1920).setDepth(-30);this.add.rectangle(540,960,1080,1920,0xfff5ea,.045).setDepth(-29);this.registry.set('mapDragging',false);
  this.current=nextSummit(SaveService.data.progress);const current=this.current;this.offset=this.pendingOffset??Math.max(0,treeFocus(current)-210);this.mist=this.add.container(0,0,[imageContain(this.add.image(540,0,'tree-cloud'),620,255)]).setDepth(25);this.refreshRows();
  const play=async(n:number)=>{if(this.busy)return;this.busy=true;try{const l=await loadSummit(n);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==l.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=l;this.scene.start('Game');}catch{this.busy=false;}};this.events.on('play-level',play);
  const currency=(x:number,key:string,value:string)=>{const c=this.add.container(x,92).setDepth(101),skin=this.add.image(0,0,'button-secondary').setDisplaySize(285,108),icon=imageContain(this.add.image(-88,0,key),72,72),txt=label(this,46,-1,value,34,C.ink,0);c.add([skin,icon,txt]);return c;};
  const iconButton=(x:number,y:number,key:string,onClick:()=>void,size=116)=>{const c=this.add.container(x,y).setDepth(103),skin=this.add.image(0,0,'button-square').setDisplaySize(size,size),icon=imageContain(this.add.image(0,0,key),size*.58,size*.58);c.add([skin,icon]);return press(this,c,size,size,onClick);};
  currency(225,'hub-kibble',String(SaveService.data.kibble));currency(520,'hub-diamond',String(SaveService.data.missions.diamonds));iconButton(970,92,'hub-settings',()=>this.scene.start('Settings'),116);
  const navY=1754,navLeft=72,navWidth=936,navItemWidth=234;this.add.image(540,navY,'button-secondary').setDisplaySize(navWidth,166).setDepth(102);
  const nav=[{x:navLeft+navItemWidth*.5,key:'hub-decorate',label:'Collection',go:()=>this.scene.start('Customize')},{x:navLeft+navItemWidth*1.5,key:'hub-missions',label:'Missions',go:()=>this.scene.start('Missions')},{x:navLeft+navItemWidth*2.5,key:'hub-daily',label:'Défi du jour',go:()=>this.scene.start('Missions',{tab:'daily'})},{x:navLeft+navItemWidth*3.5,key:'hub-shop',label:'Boutique',go:()=>this.scene.start('Shop')}];nav.forEach((item,i)=>{if(i>0)this.add.rectangle(navLeft+i*navItemWidth,navY,2,108,0xd8cbd4,.9).setDepth(103);const c=this.add.container(item.x,navY).setDepth(104),icon=imageContain(this.add.image(0,-28,item.key),78,78),txt=label(this,0,38,item.label,20,C.ink,14);c.add([icon,txt]);press(this,c,navItemWidth,160,item.go);});
  let previous=0,previousTime=0;this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);this.velocity=0;previous=p.y;previousTime=p.event.timeStamp;this.dragging=p.y>165&&p.y<1645;});this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!this.dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);const dy=p.y-previous;this.velocity=Phaser.Math.Clamp(dy/Math.max(16,p.event.timeStamp-previousTime),-2.5,2.5);this.offset=Phaser.Math.Clamp(this.offset+dy,0,treeLimit(current));previous=p.y;previousTime=p.event.timeStamp;this.refreshRows();});this.input.on('pointerup',()=>{this.dragging=false;});this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{this.velocity=0;this.offset=Phaser.Math.Clamp(this.offset-dy,0,treeLimit(current));this.refreshRows();});this.events.once('shutdown',()=>{this.input.removeAllListeners();this.events.off('play-level',play);this.rows.clear();this.registry.set('mapDragging',false);});
 }
 update(_time:number,delta:number){if(this.dragging||Math.abs(this.velocity)<.02)return;const dt=Math.min(delta,50);this.offset=Phaser.Math.Clamp(this.offset+this.velocity*dt,0,treeLimit(this.current));this.velocity*=Math.pow(.90,dt/16.67);if(this.offset===0||this.offset===treeLimit(this.current))this.velocity=0;this.refreshRows();}
 private refreshRows(){const visible=visibleTreeLevels(this.current,this.offset);for(const [n,row] of this.rows)if(!visible.includes(n)){row.destroy();this.rows.delete(n);}for(const n of visible){let row=this.rows.get(n);if(!row){row=this.makeRow(n);this.rows.set(n,row);}row.y=treeY(n,this.offset);row.setAlpha(row.y>1570?Phaser.Math.Clamp((1670-row.y)/100,.08,1):row.y<210?Phaser.Math.Clamp((row.y-120)/90,.15,1):1);}this.mist.y=treeY(this.current,this.offset)-225;}
 private makeRow(n:number){
  const slot=staticTreeSlot(n),x=slot.x;
  const row=this.add.container(0,0).setDepth(10),progress=SaveService.data.progress[journeyId(n)],done=!!progress?.completed,spec=journeySpec(n),add=<T extends Phaser.GameObjects.GameObject>(o:T)=>{row.add(o);return o;};
  const addPost=(px:number,py:number,w:number,h:number,key='tree-post-long',alpha=1)=>add(imageContain(this.add.image(px,py,key),w,h).setAlpha(alpha));
  const addBeam=(x1:number,x2:number,y:number,h=44,alpha=1)=>add(imageContain(this.add.image((x1+x2)/2,y,'tree-hammock-bar'),Math.abs(x2-x1)+56,h).setAlpha(alpha));
  const addPlatform=(px:number,y:number,left:boolean,w=300,h=68,alpha=1)=>add(imageContain(this.add.image(px,y,left?'tree-support-cream':'tree-support-peach'),w,h).setAlpha(alpha));

  if(n===1){addPost(540,132,94,286,'tree-post-short');add(imageContain(this.add.image(540,244,'tree-base'),430,190));}
  else addPost(540,TREE_STEP/2+18,92,TREE_STEP+74);

  const supportY=96;
  if(slot.kind==='wide-left'||slot.kind==='wide-right'||slot.kind==='top'){
   addBeam(540,x,supportY,48,.98);addPlatform(x,supportY+18,x<540,360,78,1);
  }else if(slot.kind==='niche'){
   addBeam(540,x,supportY,46,.98);addPlatform(x,supportY+20,true,350,76,1);add(imageContain(this.add.image(x,supportY-6,'tree-cubby-wood'),210,170));
  }else if(slot.kind==='hammock'){
   addBeam(540,x-70,supportY,44,.95);addPlatform(x-70,supportY+18,false,270,66,.95);add(imageContain(this.add.image(x+10,supportY+8,'tree-hammock-peach'),230,120));
  }else{
   addBeam(540,x,supportY,44,.98);addPlatform(x,supportY+18,x<540,305,68,1);
  }

  if(slot.decor==='plant')add(imageContain(this.add.image(x<540?x-120:x+120,138,'tree-plant'),66,82).setAlpha(.8));
  if(slot.decor==='yarn')add(imageContain(this.add.image(x-104,132,'tree-yarn'),52,52).setAlpha(.82));
  if(slot.decor==='hanging-plant')add(imageContain(this.add.image(x<540?x-125:x+125,148,'tree-hanging-plant'),72,96).setAlpha(.78));

  const isMilestone=n%10===0;
  if(isMilestone){
   const side=x<540?805:275,sideBeamMid=(540+side)/2,sideBeamWidth=Math.abs(side-540)+58,unlocked=SaveService.trailCompletedCount()>=n,habitat=habitatStyleForLevel(n);
   add(imageContain(this.add.image(sideBeamMid,126,'tree-hammock-bar'),sideBeamWidth,44).setAlpha(unlocked?1:.28));
   add(imageContain(this.add.image(side,138,habitat.texture),habitat.w*.82,habitat.h*.82).setAlpha(unlocked?1:.28));
   const catId=SaveService.data.refuges[String(n)],cat=catId?catById(catId):undefined;
   if(unlocked){
    if(cat)add(imageContain(this.add.image(side,118+habitat.catY,cat.texture),136,136).setDepth(4));
    else{add(this.add.image(side,116,'ui-circle').setDisplaySize(56,56).setAlpha(.82));add(label(this,side,116,'+',28,C.ink,18));}
    const hit=this.add.container(side,132).setDepth(8),selected=catId?Math.max(0,collectionCats.findIndex(c=>c.id===catId)):0;add(hit);press(this,hit,210,158,()=>{if(this.registry.get('mapDragging'))return;this.scene.start('Customize',{tab:3,selected,targetLevel:n});});
   }else add(imageContain(this.add.image(side,118,'ui-lock'),40,40).setAlpha(.65).setDepth(5));
  }

  const badgeKey=spec.timed?'badge-timed':spec.difficulty==='easy'?'badge-easy':spec.difficulty==='medium'?'badge-medium':spec.difficulty==='hard'?'badge-hard':'badge-extreme',badge=this.add.container(x,-50),skin=imageContain(this.add.image(0,0,badgeKey),202,82),number=label(this,0,-2,String(n),32,'#ffffff',0);badge.add([skin,number]);
  if(n===this.current&&!done){const ring=imageContain(this.add.image(0,0,'badge-current'),228,94).setAlpha(.92);badge.addAt(ring,0);if(!SaveService.data.settings.reducedMotion)this.tweens.add({targets:ring,alpha:.6,duration:900,yoyo:true,repeat:-1,ease:'Sine.InOut'});}press(this,badge,230,100,()=>{if(this.input.activePointer.y>165&&this.input.activePointer.y<1645)this.events.emit('play-level',n);});add(badge);
  if(done){const stars=progress.bestErrors===0?3:progress.bestErrors===1?2:1;add(imageContain(this.add.image(x,10,`stars-${stars}`),144,50));}
  return row;
 }
}
