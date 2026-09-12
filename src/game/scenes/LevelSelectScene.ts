import Phaser from 'phaser';
import { journeyId,journeySpec,nextSummit } from '../../core/journey';
import { treeY,treeFocus,treeLimit,visibleTreeLevels,TREE_STEP } from '../../core/treeLayout';
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
  const bg=equippedBackgroundKey();this.add.image(540,960,bg).setDisplaySize(1080,1920).setDepth(-30);this.add.rectangle(540,960,1080,1920,0xfff5ea,.08).setDepth(-29);this.registry.set('mapDragging',false);
  this.current=nextSummit(SaveService.data.progress);const current=this.current;this.offset=this.pendingOffset??Math.max(0,treeFocus(current)-90);this.mist=this.add.container(0,0,[imageContain(this.add.image(540,0,'tree-cloud'),760,315)]).setDepth(25);this.refreshRows();
  const play=async(n:number)=>{if(this.busy)return;this.busy=true;try{const l=await loadSummit(n);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==l.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=l;this.scene.start('Game');}catch{this.busy=false;}};this.events.on('play-level',play);
  const currency=(x:number,key:string,value:string)=>{const c=this.add.container(x,92).setDepth(101),skin=this.add.image(0,0,'button-secondary').setDisplaySize(285,108),icon=imageContain(this.add.image(-88,0,key),72,72),txt=label(this,46,-1,value,34,C.ink,0);c.add([skin,icon,txt]);return c;};
  const iconButton=(x:number,y:number,key:string,onClick:()=>void,size=116)=>{const c=this.add.container(x,y).setDepth(103),skin=this.add.image(0,0,'button-square').setDisplaySize(size,size),icon=imageContain(this.add.image(0,0,key),size*.58,size*.58);c.add([skin,icon]);return press(this,c,size,size,onClick);};
  currency(225,'hub-kibble',String(SaveService.data.kibble));currency(520,'hub-diamond',String(SaveService.data.missions.diamonds));iconButton(970,92,'hub-settings',()=>this.scene.start('Settings'),116);
  const navSkin=this.add.image(540,1810,'button-secondary').setDisplaySize(1030,176).setDepth(100);navSkin.setAlpha(.99);const nav=[{x:150,key:'hub-decorate',label:'Collection',go:()=>this.scene.start('Customize')},{x:405,key:'hub-missions',label:'Missions',go:()=>this.scene.start('Missions')},{x:675,key:'hub-daily',label:'Défi du jour',go:()=>{}},{x:930,key:'hub-shop',label:'Boutique',go:()=>this.scene.start('Shop')}];nav.forEach(item=>{const c=this.add.container(item.x,1794).setDepth(104),icon=imageContain(this.add.image(0,-16,item.key),104,104),txt=label(this,0,57,item.label,19,C.ink,15);c.add([icon,txt]);press(this,c,210,150,item.go);});
  let previous=0,previousTime=0;this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);this.velocity=0;previous=p.y;previousTime=p.event.timeStamp;this.dragging=p.y>165&&p.y<1670;});this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!this.dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);const dy=p.y-previous;this.velocity=Phaser.Math.Clamp(dy/Math.max(16,p.event.timeStamp-previousTime),-2.5,2.5);this.offset=Phaser.Math.Clamp(this.offset+dy,0,treeLimit(current));previous=p.y;previousTime=p.event.timeStamp;this.refreshRows();});this.input.on('pointerup',()=>{this.dragging=false;});this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{this.velocity=0;this.offset=Phaser.Math.Clamp(this.offset-dy,0,treeLimit(current));this.refreshRows();});this.events.once('shutdown',()=>{this.input.removeAllListeners();this.events.off('play-level',play);this.rows.clear();this.registry.set('mapDragging',false);});
 }
 update(_time:number,delta:number){if(this.dragging||Math.abs(this.velocity)<.02)return;const dt=Math.min(delta,50);this.offset=Phaser.Math.Clamp(this.offset+this.velocity*dt,0,treeLimit(this.current));this.velocity*=Math.pow(.90,dt/16.67);if(this.offset===0||this.offset===treeLimit(this.current))this.velocity=0;this.refreshRows();}
 private refreshRows(){const visible=visibleTreeLevels(this.current,this.offset);for(const [n,row] of this.rows)if(!visible.includes(n)){row.destroy();this.rows.delete(n);}for(const n of visible){let row=this.rows.get(n);if(!row){row=this.makeRow(n);this.rows.set(n,row);}row.y=treeY(n,this.offset);}this.mist.y=treeY(this.current,this.offset)-315;}
 private makeRow(n:number){
  const row=this.add.container(0,0).setDepth(10),x=[355,690,395,675,345,710,410,660][(n-1)%8]!,progress=SaveService.data.progress[journeyId(n)],done=!!progress?.completed,spec=journeySpec(n),add=<T extends Phaser.GameObjects.GameObject>(o:T)=>{row.add(o);return o;},supportKey=n%2===0?'tree-support-cream':'tree-support-peach';
  if(n>1)add(imageContain(this.add.image(540,TREE_STEP/2+28,'tree-post-long'),100,TREE_STEP+118));else{add(imageContain(this.add.image(540,180,'tree-post-short'),100,370));add(imageContain(this.add.image(540,330,'tree-base'),440,205));}
  const beamMid=(540+x)/2,beamWidth=Math.abs(540-x)+86;add(imageContain(this.add.image(beamMid,88,'tree-hammock-bar'),beamWidth,54));add(imageContain(this.add.image(540,88,'tree-junction-t'),86,86));add(imageContain(this.add.image(x,88,'tree-junction-round'),68,68));add(imageContain(this.add.image(x,98,supportKey),245,114));
  const side=x<540?790:290,sideBeamMid=(540+side)/2,sideBeamWidth=Math.abs(side-540)+70;
  const attachSide=(key:string,y:number,w:number,h:number,alpha=1)=>{add(imageContain(this.add.image(sideBeamMid,y,'tree-hammock-bar'),sideBeamWidth,50).setAlpha(alpha));add(imageContain(this.add.image(540,y,'tree-junction-t'),78,78).setAlpha(alpha));add(imageContain(this.add.image(side,y,'tree-junction-round'),60,60).setAlpha(alpha));return add(imageContain(this.add.image(side,y+16,key),w,h).setAlpha(alpha));};
  if(n%10===0){
   const unlocked=SaveService.trailCompletedCount()>=n,habitat=habitatStyleForLevel(n);attachSide(habitat.texture,128,habitat.w,habitat.h,unlocked?1:.3);const catId=SaveService.data.refuges[String(n)],cat=catId?catById(catId):undefined;
   if(unlocked){
    if(cat)add(imageContain(this.add.image(side,112+habitat.catY,cat.texture),156,156).setDepth(4));
    else{add(this.add.image(side,108,'ui-circle').setDisplaySize(78,78).setAlpha(.74));add(label(this,side,108,'+',40,C.ink,18));}
    const hit=this.add.container(side,124).setDepth(8),selected=catId?Math.max(0,collectionCats.findIndex(c=>c.id===catId)):0;add(hit);press(this,hit,250,190,()=>{if(this.registry.get('mapDragging'))return;this.scene.start('Customize',{tab:3,selected,targetLevel:n});});
   }else add(imageContain(this.add.image(side,112,'ui-lock'),56,56).setAlpha(.72).setDepth(5));
  }else if(n%6===0){
   const decoX=x<540?610:470;add(imageContain(this.add.image(decoX,170,n%12===0?'tree-hanging-plant':'tree-plant'),82,102).setAlpha(.82));
  }else if(n%7===0){
   const decoX=x<540?615:465;add(imageContain(this.add.image(decoX,166,'tree-yarn'),58,58).setAlpha(.8));
  }
  const badgeKey=spec.timed?'badge-timed':spec.difficulty==='easy'?'badge-easy':spec.difficulty==='medium'?'badge-medium':spec.difficulty==='hard'?'badge-hard':'badge-extreme',badge=this.add.container(x,-58),skin=imageContain(this.add.image(0,0,badgeKey),235,100),number=label(this,0,-2,String(n),37,'#ffffff',0);badge.add([skin,number]);
  if(n===this.current&&!done){const ring=imageContain(this.add.image(0,0,'badge-current'),260,112).setAlpha(.9);badge.addAt(ring,0);if(!SaveService.data.settings.reducedMotion)this.tweens.add({targets:ring,alpha:.55,duration:900,yoyo:true,repeat:-1,ease:'Sine.InOut'});}press(this,badge,260,118,()=>{if(this.input.activePointer.y>165&&this.input.activePointer.y<1670)this.events.emit('play-level',n);});add(badge);
  if(done){const stars=progress.bestErrors===0?3:progress.bestErrors===1?2:1;add(imageContain(this.add.image(x,14,`stars-${stars}`),180,66));}
  return row;
 }
}
