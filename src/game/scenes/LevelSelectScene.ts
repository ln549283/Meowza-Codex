import Phaser from 'phaser';
import { journeyId,journeySpec,nextSummit } from '../../core/journey';
import { treeY,treeFocus,treeLimit,visibleTreeLevels,TREE_STEP } from '../../core/treeLayout';
import { cosmetics } from '../../core/cosmetics';
import { loadSummit } from '../../services/JourneyService';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { button,cozyBackground,imageContain,label,panel,press,roundButton } from '../ui';
import { C } from '../theme';
export class LevelSelectScene extends Phaser.Scene {
 private busy=false;private decorating=false;private slot=0;private offset=0;private current=1;
 private rows=new Map<number,Phaser.GameObjects.Container>();private mist!:Phaser.GameObjects.Container;
 private velocity=0;private dragging=false;private pendingOffset:number|undefined;
 constructor(){super('LevelSelect');}
 init(data:{offset?:number;decorating?:boolean;slot?:number}={}){this.busy=false;this.decorating=!!data.decorating;this.slot=data.slot??0;this.pendingOffset=data.offset;this.velocity=0;this.dragging=false;this.rows.clear();}
 create(){
  cozyBackground(this);this.registry.set('mapDragging',false);
  this.current=nextSummit(SaveService.data.progress);const current=this.current;
  this.offset=this.pendingOffset??treeFocus(current);
  this.mist=this.add.container(0,0,[imageContain(this.add.image(540,0,'cloud-v5'),1050,350)]).setDepth(20);
  this.refreshRows();
  const play=async(n:number)=>{if(this.busy||this.decorating)return;this.busy=true;ctaLabel.setText('Préparation…');try{const l=await loadSummit(n);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==l.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=l;this.scene.start('Game');}catch{if(this.scene.isActive()){ctaLabel.setText('Réessayer');this.busy=false;}}};
  this.events.on('play-level',play);
  panel(this,540,120,1000,205).setDepth(100);
  imageContain(this.add.image(540,79,'logo-v5'),330,130).setDepth(101);
  label(this,540,165,`${current-1} niveau${current>2?'x':''} réussi${current>2?'s':''} · ${SaveService.data.kibble} croquettes`,27,C.ink,0).setDepth(101);
  roundButton(this,100,100,'‹',()=>this.scene.start('Home')).setDepth(101);
  roundButton(this,980,100,'?',()=>this.scene.start('Rules')).setDepth(101);
  panel(this,540,1755,1000,310).setDepth(100);
  const cta=button(this,540,1700,680,`Jouer · niveau ${current}`,()=>{void play(current);},C.teal).setDepth(101);
  const ctaLabel=cta.list.find(o=>o.type==='Text') as Phaser.GameObjects.Text;
  button(this,360,1830,410,'Décorer',()=>this.scene.restart({offset:this.offset,decorating:true}),0xb77ca0).setDepth(101);
  button(this,795,1830,350,'Me retrouver',()=>{this.offset=treeFocus(current);this.velocity=0;this.refreshRows();},0xb99773).setDepth(101);
  if(this.decorating){
   panel(this,540,1620,1060,595).setScrollFactor(0).setDepth(110);
   label(this,540,1375,'Personnaliser mon arbre',38).setScrollFactor(0).setDepth(111);
   const slots=['background','cushion','wood'] as const,slot=slots[this.slot]!;
   ['Ambiance','Coussins','Bois'].forEach((name,i)=>button(this,210+i*330,1470,300,name,()=>this.scene.restart({offset:this.offset,decorating:true,slot:i}),i===this.slot?C.teal:0xb398a5).setScrollFactor(0).setDepth(111));
   cosmetics.filter(c=>c.slot===slot).forEach((item,j)=>{
    const owned=SaveService.data.ownedCosmetics.includes(item.id),equipped=SaveService.data.equipped[slot]===item.id;
    const b=button(this,210+j*330,1610,300,equipped?'✓':owned?'Choisir':'Verrouillé',()=>{if(!owned)return;SaveService.data.equipped[slot]=item.id;void SaveService.persist();this.scene.restart({offset:this.offset,decorating:true,slot:this.slot});},item.color).setScrollFactor(0).setDepth(111);
    (b.list.find(o=>o.type==='Text') as Phaser.GameObjects.Text).setColor('#493d48');
    if(!owned)b.setAlpha(.55);label(this,210+j*330,1684,item.name,23,C.ink,0).setScrollFactor(0).setDepth(111);
   });
   label(this,540,1740,'Un décor surprise tous les 10 nouveaux niveaux.',25,C.ink,0).setScrollFactor(0).setDepth(111);
   button(this,540,1835,500,'Terminé',()=>this.scene.restart({offset:this.offset})).setScrollFactor(0).setDepth(111);
  }

  let previous=0,previousTime=0;
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);this.velocity=0;previous=p.y;previousTime=p.event.timeStamp;this.dragging=p.y>235&&p.y<(this.decorating?1290:1580);});
  this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!this.dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);const dy=p.y-previous;this.velocity=Phaser.Math.Clamp(dy/Math.max(16,p.event.timeStamp-previousTime),-2.5,2.5);this.offset=Phaser.Math.Clamp(this.offset+dy,0,treeLimit(current));previous=p.y;previousTime=p.event.timeStamp;this.refreshRows();});
  this.input.on('pointerup',()=>{this.dragging=false;});
  this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{if(this.decorating)return;this.velocity=0;this.offset=Phaser.Math.Clamp(this.offset-dy,0,treeLimit(current));this.refreshRows();});
  this.events.once('shutdown',()=>{this.input.removeAllListeners();this.events.off('play-level',play);this.rows.clear();this.registry.set('mapDragging',false);});
 }
 update(_time:number,delta:number){if(this.dragging||Math.abs(this.velocity)<.02||this.decorating)return;const dt=Math.min(delta,50);this.offset=Phaser.Math.Clamp(this.offset+this.velocity*dt,0,treeLimit(this.current));this.velocity*=Math.pow(.90,dt/16.67);if(this.offset===0||this.offset===treeLimit(this.current))this.velocity=0;this.refreshRows();}
 private refreshRows(){
  const visible=visibleTreeLevels(this.current,this.offset);
  for(const [n,row] of this.rows)if(!visible.includes(n)){row.destroy();this.rows.delete(n);}
  for(const n of visible){let row=this.rows.get(n);if(!row){row=this.makeRow(n);this.rows.set(n,row);}row.y=treeY(n,this.offset);}
  this.mist.y=treeY(this.current,this.offset)-325;
 }
 private makeRow(n:number){
  const row=this.add.container(0,0).setDepth(10),x=[365,690,400,660,360,710,435,640][(n-1)%8]!,done=!!SaveService.data.progress[journeyId(n)]?.completed,spec=journeySpec(n);
  const add=(o:Phaser.GameObjects.GameObject)=>{row.add(o);return o;};
  const wood=SaveService.data.equipped.wood,tint=wood==='walnut'?0xd6b6a2:wood==='birch'?0xfff1d9:0xffffff;
  if(n>1){const post=this.add.image(540,TREE_STEP/2+60,'tree-modules-v5','post').setDisplaySize(96,TREE_STEP+30).setTint(tint);add(post);}
  else {add(this.add.image(540,135,'tree-modules-v5','post').setDisplaySize(96,240).setTint(tint));add(imageContain(this.add.image(540,225,'tree-modules-v5','base'),660,300).setTint(tint));}
  const support=this.add.graphics().lineStyle(28,0xae784c).lineBetween(540,105,x,70).lineStyle(9,0xf5cf9b).lineBetween(540,97,x,62);add(support);
  const cushion=SaveService.data.equipped.cushion;
  add(imageContain(this.add.image(x,74,'tree-modules-v5',cushion==='teal'?'teal':'peach'),440,270).setTint(cushion==='rose'?0xffd2e4:tint));
  if(n%3===0){add(imageContain(this.add.image(x<540?790:270,150,'tree-modules-v5','house'),210,220).setTint(tint));}
  else if(n%4===0)add(imageContain(this.add.image(x<540?790:265,180,'tree-modules-v5','hammock'),260,240).setTint(tint));
  const node=this.add.container(x,-62),bg=this.add.graphics();
  bg.fillStyle(0x6c4b51,.16).fillCircle(0,8,99).fillStyle(0xfffcf2).fillCircle(0,0,99);
  bg.lineStyle(n===this.current?8:4,n===this.current?C.teal:0xe2bc83).strokeCircle(0,0,99);
  node.add([bg,imageContain(this.add.image(0,-17,'atlas-v3',spec.difficulty),150,132),label(this,0,65,String(n),34,C.ink,0)]);
  press(this,node,210,210,()=>{if(this.input.activePointer.y>235&&this.input.activePointer.y<1580)this.events.emit('play-level',n);});add(node);
  if(done)add(label(this,x+115,-90,'✓',43,'#348e84'));
  if(spec.timed)add(label(this,x-122,-88,'◷',50,'#7658a3'));
  if(n===this.current)add(label(this,x,213,'À toi de jouer',29,'#397972',0));
  return row;
 }
}
