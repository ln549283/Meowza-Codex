import Phaser from 'phaser';
import { journeyId,journeySpec,nextSummit } from '../../core/journey';
import { treeY,treeFocus,treeLimit,visibleTreeLevels,TREE_STEP } from '../../core/treeLayout';
import { cosmetics } from '../../core/cosmetics';
import { loadSummit } from '../../services/JourneyService';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { button,cozyBackground,imageContain,label,panel,press } from '../ui';
import { C } from '../theme';

export class LevelSelectScene extends Phaser.Scene {
 private busy=false;private decorating=false;private slot=0;private offset=0;private current=1;
 private rows=new Map<number,Phaser.GameObjects.Container>();private mist!:Phaser.GameObjects.Container;
 private velocity=0;private dragging=false;private pendingOffset:number|undefined;
 constructor(){super('LevelSelect');}
 init(data:{offset?:number;decorating?:boolean;slot?:number}={}){this.busy=false;this.decorating=!!data.decorating;this.slot=data.slot??0;this.pendingOffset=data.offset;this.velocity=0;this.dragging=false;this.rows.clear();}
 create(){
  cozyBackground(this);this.registry.set('mapDragging',false);
  // Gentle room-like glow behind the continuous tree.
  this.add.circle(170,310,310,0xffeed9,.52).setDepth(0);this.add.circle(940,650,360,0xe7dff4,.34).setDepth(0);
  this.current=nextSummit(SaveService.data.progress);const current=this.current;
  this.offset=this.pendingOffset??treeFocus(current);
  this.mist=this.add.container(0,0,[imageContain(this.add.image(540,0,'tree-cloud-v2'),1080,380)]).setDepth(20);
  this.refreshRows();
  const play=async(n:number)=>{if(this.busy||this.decorating)return;this.busy=true;try{const l=await loadSummit(n);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==l.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=l;this.scene.start('Game');}catch{this.busy=false;}};
  this.events.on('play-level',play);

  const currency=(x:number,key:string,value:string)=>{
   const c=this.add.container(x,92).setDepth(101),skin=this.add.image(0,0,'button-secondary').setDisplaySize(245,92),icon=imageContain(this.add.image(-76,0,key),62,62),txt=label(this,38,-1,value,31,C.ink,0);c.add([skin,icon,txt]);return c;
  };
  const iconButton=(x:number,y:number,key:string,onClick:()=>void,size=112)=>{
   const c=this.add.container(x,y).setDepth(103),skin=this.add.image(0,0,'button-square').setDisplaySize(size,size),icon=imageContain(this.add.image(0,-2,key),size*.62,size*.62);c.add([skin,icon]);return press(this,c,size,size,onClick);
  };
  const bottomAction=(x:number,w:number,key:string,text:string,onClick:()=>void)=>{
   const c=this.add.container(x,1815).setDepth(103),skin=this.add.image(0,0,'button-secondary').setDisplaySize(w,112),icon=imageContain(this.add.image(-w*.30,0,key),62,62),txt=label(this,25,-1,text,30,C.ink,0);c.add([skin,icon,txt]);return press(this,c,w,112,onClick);
  };

  currency(245,'hub-diamond','0');currency(520,'hub-kibble',String(SaveService.data.kibble));iconButton(960,92,'hub-settings',()=>this.scene.start('Settings'),108);
  iconButton(88,780,'hub-missions',()=>this.scene.start('Missions'),104);iconButton(88,920,'hub-shop',()=>this.scene.start('Shop'),104);

  panel(this,540,1815,930,155,.94).setDepth(100);
  bottomAction(330,390,'hub-decorate','Décorer',()=>this.scene.restart({offset:this.offset,decorating:true}));
  bottomAction(750,390,'hub-locate','Me retrouver',()=>{this.offset=treeFocus(current);this.velocity=0;this.refreshRows();});

  if(this.decorating){
   this.add.image(540,1605,'button-secondary').setDisplaySize(1040,620).setDepth(109).setAlpha(.98);
   label(this,540,1370,'Personnaliser mon arbre',38).setDepth(111);
   const slots=['background','cushion','wood'] as const,slot=slots[this.slot]!;
   ['Ambiance','Coussins','Bois'].forEach((name,i)=>button(this,210+i*330,1470,300,name,()=>this.scene.restart({offset:this.offset,decorating:true,slot:i}),i===this.slot?C.teal:0xb398a5).setDepth(111));
   cosmetics.filter(c=>c.slot===slot).forEach((item,j)=>{
    const owned=SaveService.data.ownedCosmetics.includes(item.id),equipped=SaveService.data.equipped[slot]===item.id;
    const b=button(this,210+j*330,1610,300,equipped?'✓ Équipé':owned?'Équiper':'Verrouillé',()=>{if(!owned)return;SaveService.data.equipped[slot]=item.id;void SaveService.persist();this.scene.restart({offset:this.offset,decorating:true,slot:this.slot});},item.color).setDepth(111);
    (b.list.find(o=>o.type==='Text') as Phaser.GameObjects.Text).setColor('#493d48');if(!owned)b.setAlpha(.55);label(this,210+j*330,1684,item.name,23,C.ink,0).setDepth(111);
   });
   label(this,540,1740,'Prévisualise ton arbre, puis équipe ton décor.',25,C.ink,0).setDepth(111);
   button(this,540,1835,500,'Terminé',()=>this.scene.restart({offset:this.offset})).setDepth(111);
  }

  let previous=0,previousTime=0;
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);this.velocity=0;previous=p.y;previousTime=p.event.timeStamp;this.dragging=p.y>170&&p.y<(this.decorating?1290:1690);});
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
  const row=this.add.container(0,0).setDepth(10),x=[345,700,390,675,350,715,420,650][(n-1)%8]!,done=!!SaveService.data.progress[journeyId(n)]?.completed,spec=journeySpec(n);
  const add=(o:Phaser.GameObjects.GameObject)=>{row.add(o);return o;};
  const platformKey=n%2===0?'tree-platform-lilac':'tree-platform-peach';
  const hammockKey=n%2===0?'tree-hammock-lilac':'tree-hammock-peach';

  if(n>1)add(imageContain(this.add.image(540,TREE_STEP/2+70,n%3===0?'tree-post-long':'tree-post-short'),150,TREE_STEP+90));
  else {add(imageContain(this.add.image(540,145,'tree-post-short'),150,280));add(imageContain(this.add.image(540,265,'tree-base-v2'),720,330));}

  // Real V2 platform modules replace the former Phaser-drawn wooden branch.
  add(imageContain(this.add.image(x,82,platformKey),470,245));
  if(n%3===0)add(imageContain(this.add.image(x<540?805:265,128,n%2===0?'tree-cubby-cream':'tree-cubby-wood'),260,270));
  else if(n%4===0)add(imageContain(this.add.image(x<540?805:265,165,hammockKey),310,250));
  else if(n%5===0)add(imageContain(this.add.image(x<540?790:280,120,'tree-round-platform'),260,230));

  const future=n>this.current;
  const nodeKey=future?'node-locked':spec.timed?'node-timed':spec.difficulty==='extreme'?'node-extreme':n===this.current?'node-current':done?'node-completed':'node-plaque';
  const node=this.add.container(x,-62),skin=imageContain(this.add.image(0,0,nodeKey),205,205),number=label(this,0,5,String(n),38,future?'#8d8190':C.ink,0);
  node.add([skin,number]);
  if(!future){const difficulty=label(this,0,77,spec.timed?'5 min':spec.difficulty==='extreme'?'Extrême':'',20,'#755f68',0);node.add(difficulty);}
  press(this,node,220,220,()=>{if(!future&&this.input.activePointer.y>170&&this.input.activePointer.y<1690)this.events.emit('play-level',n);});add(node);

  if(n===this.current){
   const catX=x<540?x+225:x-225,cat=this.add.sprite(catX,42,'nimbus-idle',0).setOrigin(.5,.85).setDisplaySize(150,150);cat.play('anim-nimbus-idle');add(cat);
   const moka=this.add.sprite(catX+(x<540?115:-115),67,'moka-blink',0).setOrigin(.5,.85).setDisplaySize(120,120);moka.play('anim-moka-blink');add(moka);
   add(label(this,x,202,'À toi de jouer',28,'#397972',0));
  }
  return row;
 }
}
