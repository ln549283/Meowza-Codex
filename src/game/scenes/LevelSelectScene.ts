import Phaser from 'phaser';
import { journeyId,journeySpec,nextSummit } from '../../core/journey';
import { treeY,treeFocus,treeLimit,visibleTreeLevels,TREE_STEP } from '../../core/treeLayout';
import { cosmetics } from '../../core/cosmetics';
import { loadSummit } from '../../services/JourneyService';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { button,imageContain,label,panel,press } from '../ui';
import { C } from '../theme';

export class LevelSelectScene extends Phaser.Scene {
 private busy=false;private decorating=false;private slot=0;private offset=0;private current=1;
 private rows=new Map<number,Phaser.GameObjects.Container>();private mist!:Phaser.GameObjects.Container;
 private velocity=0;private dragging=false;private pendingOffset:number|undefined;
 constructor(){super('LevelSelect');}
 init(data:{offset?:number;decorating?:boolean;slot?:number}={}){this.busy=false;this.decorating=!!data.decorating;this.slot=data.slot??0;this.pendingOffset=data.offset;this.velocity=0;this.dragging=false;this.rows.clear();}
 create(){
  this.add.image(540,960,'room-background').setDisplaySize(1080,1920).setDepth(-30);
  this.add.rectangle(540,960,1080,1920,0xfff5ea,.12).setDepth(-29);
  this.registry.set('mapDragging',false);
  this.current=nextSummit(SaveService.data.progress);const current=this.current;
  this.offset=this.pendingOffset??treeFocus(current);
  this.mist=this.add.container(0,0,[imageContain(this.add.image(540,0,'tree-cloud'),1080,470)]).setDepth(25);
  this.refreshRows();

  const play=async(n:number)=>{if(this.busy||this.decorating)return;this.busy=true;try{const l=await loadSummit(n);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==l.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=l;this.scene.start('Game');}catch{this.busy=false;}};
  this.events.on('play-level',play);

  const currency=(x:number,key:string,value:string)=>{const c=this.add.container(x,86).setDepth(101),skin=this.add.image(0,0,'button-secondary').setDisplaySize(245,86),icon=imageContain(this.add.image(-75,0,key),52,52),txt=label(this,38,-1,value,29,C.ink,0);c.add([skin,icon,txt]);return c;};
  const iconButton=(x:number,y:number,key:string,onClick:()=>void,size=96)=>{const c=this.add.container(x,y).setDepth(103),skin=this.add.image(0,0,'button-square').setDisplaySize(size,size),icon=imageContain(this.add.image(0,0,key),size*.54,size*.54);c.add([skin,icon]);return press(this,c,size,size,onClick);};
  currency(215,'hub-kibble',String(SaveService.data.kibble));currency(485,'hub-diamond','0');iconButton(970,86,'hub-settings',()=>this.scene.start('Settings'),94);

  panel(this,540,1818,1040,160,.98).setDepth(100);
  const nav=[
   {x:150,key:'hub-decorate',text:'Décorer',go:()=>this.scene.restart({offset:this.offset,decorating:true})},
   {x:410,key:'hub-missions',text:'Missions',go:()=>this.scene.start('Missions')},
   {x:670,key:'hub-daily',text:'Défi du jour',go:()=>{}},
   {x:930,key:'hub-shop',text:'Boutique',go:()=>this.scene.start('Shop')}
  ];
  nav.forEach(item=>{const c=this.add.container(item.x,1805).setDepth(104),icon=imageContain(this.add.image(0,-22,item.key),62,62),txt=label(this,0,42,item.text,20,C.ink,0);c.add([icon,txt]);press(this,c,210,130,item.go);});

  if(this.decorating){
   const shade=this.add.rectangle(540,960,1080,1920,0x4c3344,.28).setDepth(108).setInteractive();
   panel(this,540,1480,1010,790).setDepth(109);
   label(this,540,1160,'Décorer',44).setDepth(111);
   const close=iconButton(950,1158,'ui-close',()=>this.scene.restart({offset:this.offset}),72);close.setDepth(112);
   const slots=['background','cushion','wood'] as const,slot=slots[this.slot]!;
   ['Fonds','Décors','Structure'].forEach((name,i)=>button(this,210+i*330,1265,290,name,()=>this.scene.restart({offset:this.offset,decorating:true,slot:i}),i===this.slot?C.teal:C.orange).setDepth(111));
   cosmetics.filter(c=>c.slot===slot).slice(0,3).forEach((item,j)=>{
    const owned=SaveService.data.ownedCosmetics.includes(item.id),equipped=SaveService.data.equipped[slot]===item.id;
    const y=1440+j*125;
    panel(this,540,y,850,105).setDepth(110);
    label(this,300,y,item.name,26,C.ink,0).setDepth(111);
    const b=button(this,760,y,300,equipped?'✓ Équipé':owned?'Équiper':'Verrouillé',()=>{if(!owned)return;SaveService.data.equipped[slot]=item.id;void SaveService.persist();this.scene.restart({offset:this.offset,decorating:true,slot:this.slot});},equipped?C.teal:C.orange).setDepth(111);
    if(!owned)b.setAlpha(.55);
   });
   shade.on('pointerup',()=>{});
  }

  let previous=0,previousTime=0;
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);this.velocity=0;previous=p.y;previousTime=p.event.timeStamp;this.dragging=!this.decorating&&p.y>155&&p.y<1690;});
  this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!this.dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);const dy=p.y-previous;this.velocity=Phaser.Math.Clamp(dy/Math.max(16,p.event.timeStamp-previousTime),-2.5,2.5);this.offset=Phaser.Math.Clamp(this.offset+dy,0,treeLimit(current));previous=p.y;previousTime=p.event.timeStamp;this.refreshRows();});
  this.input.on('pointerup',()=>{this.dragging=false;});
  this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{if(this.decorating)return;this.velocity=0;this.offset=Phaser.Math.Clamp(this.offset-dy,0,treeLimit(current));this.refreshRows();});
  this.events.once('shutdown',()=>{this.input.removeAllListeners();this.events.off('play-level',play);this.rows.clear();this.registry.set('mapDragging',false);});
 }
 update(_time:number,delta:number){if(this.dragging||Math.abs(this.velocity)<.02||this.decorating)return;const dt=Math.min(delta,50);this.offset=Phaser.Math.Clamp(this.offset+this.velocity*dt,0,treeLimit(this.current));this.velocity*=Math.pow(.90,dt/16.67);if(this.offset===0||this.offset===treeLimit(this.current))this.velocity=0;this.refreshRows();}
 private refreshRows(){const visible=visibleTreeLevels(this.current,this.offset);for(const [n,row] of this.rows)if(!visible.includes(n)){row.destroy();this.rows.delete(n);}for(const n of visible){let row=this.rows.get(n);if(!row){row=this.makeRow(n);this.rows.set(n,row);}row.y=treeY(n,this.offset);}this.mist.y=treeY(this.current,this.offset)-365;}
 private makeRow(n:number){
  const row=this.add.container(0,0).setDepth(10),x=[355,690,395,675,345,710,410,660][(n-1)%8]!,progress=SaveService.data.progress[journeyId(n)],done=!!progress?.completed,spec=journeySpec(n);
  const add=(o:Phaser.GameObjects.GameObject)=>{row.add(o);return o;};
  const supportKey=n%2===0?'tree-support-cream':'tree-support-peach';
  if(n>1)add(imageContain(this.add.image(540,TREE_STEP/2+50,'tree-post'),105,TREE_STEP+100));
  else {add(imageContain(this.add.image(540,145,'tree-post'),105,300));add(imageContain(this.add.image(540,285,'tree-base'),590,270));}

  add(imageContain(this.add.image(x,88,supportKey),330,160));
  const side=x<540?790:290;
  if(n%4===0)add(imageContain(this.add.image(side,130,'tree-hammock'),230,170));
  else if(n%3===0)add(imageContain(this.add.image(side,112,'tree-cubby'),180,180));
  else if(n%5===0)add(imageContain(this.add.image(side,125,'tree-plant'),135,155));

  const badgeKey=spec.timed?'badge-timed':spec.difficulty==='easy'?'badge-easy':spec.difficulty==='medium'?'badge-medium':spec.difficulty==='hard'?'badge-hard':'badge-extreme';
  const badge=this.add.container(x,-45),skin=imageContain(this.add.image(0,0,badgeKey),205,92),number=label(this,0,-2,String(n),34,'#4b3149',0);badge.add([skin,number]);
  if(n===this.current&&!done){const ring=imageContain(this.add.image(0,0,'badge-current'),230,104).setAlpha(.88);badge.addAt(ring,0);}
  press(this,badge,225,110,()=>{if(this.input.activePointer.y>155&&this.input.activePointer.y<1690)this.events.emit('play-level',n);});add(badge);

  if(done){const stars=progress.bestErrors===0?3:progress.bestErrors===1?2:1;add(imageContain(this.add.image(x,34,`stars-${stars}`),135,52));}
  else if(n===this.current){add(label(this,x,30,spec.timed?'Coup de griffe':'À toi de jouer',22,spec.timed?'#7a3e8e':'#397972',0));}
  return row;
 }
}
