import Phaser from 'phaser';
import { journeyId,journeySpec,nextSummit } from '../../core/journey';
import { cosmetics } from '../../core/cosmetics';
import { loadSummit } from '../../services/JourneyService';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { button,cloud,cozyBackground,imageContain,label,panel,press,roundButton } from '../ui';
import { C } from '../theme';
export class LevelSelectScene extends Phaser.Scene {
 private page=0;private busy=false;private decorating=false;private slot=0;
 constructor(){super('LevelSelect');}
 init(data:{page?:number;decorating?:boolean;slot?:number}={}){this.page=data.page??Math.floor((nextSummit(SaveService.data.progress)-1)/8);this.busy=false;this.decorating=!!data.decorating;this.slot=data.slot??0;}
 create(){
  cozyBackground(this);this.registry.set('mapDragging',false);
  const current=nextSummit(SaveService.data.progress),start=this.page*8+1,end=Math.min(start+7,current);
  const wood=cosmetics.find(c=>c.id===SaveService.data.equipped.wood)!.color,cushion=cosmetics.find(c=>c.id===SaveService.data.equipped.cushion)!.color;
  const count=end-start+1,height=Math.max(1920,count*350+1050),base=height-500;
  this.children.list.forEach(o=>(o as Phaser.GameObjects.Graphics).setScrollFactor?.(0));
  this.cameras.main.setBounds(0,0,1080,height);
  const xs=[380,700,420,650,350,680,450,650];
  const play=async(n:number)=>{if(this.busy)return;this.busy=true;ctaLabel.setText('Préparation…');try{const l=await loadSummit(n);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==l.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=l;this.scene.start('Game');}catch{if(this.scene.isActive()){ctaLabel.setText('Réessayer');this.busy=false;}}};
  const g=this.add.graphics();
  g.fillStyle(0x735344,.13).fillRoundedRect(260,base+144,560,58,25);
  g.fillStyle(wood).fillRoundedRect(240,base+120,600,60,24);
  g.fillStyle(wood).fillRoundedRect(510,base-(count-1)*350-160,60,(count-1)*350+300,22);
  g.lineStyle(3,0xfff5dc,.45);for(let y=base-(count-1)*350-135;y<base+120;y+=18)g.lineBetween(513,y,567,y+12);
  for(let n=start;n<=end;n++){
   const i=n-start,x=xs[(n-1)%8]!,y=base-i*350,done=!!SaveService.data.progress[journeyId(n)]?.completed,spec=journeySpec(n);
   g.lineStyle(24,wood).lineBetween(540,y+105,x,y+20);
   g.fillStyle(0x735344,.13).fillRoundedRect(x-155,y+59,310,38,18);
   g.fillStyle(wood).fillRoundedRect(x-165,y+35,330,40,18);
   g.fillStyle(cushion).fillRoundedRect(x-140,y+7,280,35,18);
   g.lineStyle(3,0xffffff,.5).lineBetween(x-110,y+16,x+110,y+16);
   if(n%3===0){g.fillStyle(wood).fillRoundedRect(x-113,y-160,226,177,58);g.fillStyle(0x655158).fillEllipse(x,y-70,112,130);}
   const node=this.add.container(x,y-68),bg=this.add.graphics();
   bg.fillStyle(done?0xfffcf5:0xffffff).fillCircle(0,0,84);bg.lineStyle(n===current?8:3,n===current?C.teal:0xe4d2bd).strokeCircle(0,0,84);
   node.add([bg,imageContain(this.add.image(0,-14,'atlas-v3',spec.difficulty),110,105),label(this,0,51,String(n),30,C.ink,0)]);
   press(this,node,174,174,()=>{void play(n);});
   if(done)label(this,x+119,y-84,'✓',38,'#348e84');
   if(spec.timed)label(this,x-121,y-94,'◷',46,'#7658a3');
   if(n===current)label(this,x,y+116,'À toi de jouer',28,'#327c79',0);
  }
  if(end===current){const top=base-(count-1)*350-300;cloud(this,450,top,500);cloud(this,780,top-35,360);}
  panel(this,540,130,1020,225).setScrollFactor(0).setDepth(100);
  label(this,540,80,'Mon arbre à chats',49).setScrollFactor(0).setDepth(101);
  label(this,540,156,`${current-1} niveaux réussis   ·   ${SaveService.data.kibble} croquettes`,27,C.ink,0).setScrollFactor(0).setDepth(101);
  roundButton(this,100,100,'‹',()=>this.scene.start('Home')).setScrollFactor(0).setDepth(101);
  panel(this,540,1755,1020,310).setScrollFactor(0).setDepth(100);
  const cta=button(this,540,1700,580,`Jouer · niveau ${current}`,()=>{void play(current);},C.teal).setScrollFactor(0).setDepth(101);
  const ctaLabel=cta.list.find(o=>o.type==='Text') as Phaser.GameObjects.Text;
  button(this,540,1830,410,'Décorer',()=>this.scene.restart({page:this.page,decorating:true}),0xb77ca0).setScrollFactor(0).setDepth(101);
  if(this.page>0)roundButton(this,130,1755,'↓',()=>this.scene.restart({page:this.page-1})).setScrollFactor(0).setDepth(101);
  if(end<current)roundButton(this,950,1755,'↑',()=>this.scene.restart({page:this.page+1})).setScrollFactor(0).setDepth(101);
  if(this.decorating){
   panel(this,540,1620,1060,595).setScrollFactor(0).setDepth(110);
   label(this,540,1375,'Personnaliser mon arbre',38).setScrollFactor(0).setDepth(111);
   const slots=['background','cushion','wood'] as const,slot=slots[this.slot]!;
   ['Ambiance','Coussins','Bois'].forEach((name,i)=>button(this,210+i*330,1470,300,name,()=>this.scene.restart({page:this.page,decorating:true,slot:i}),i===this.slot?C.teal:0xb398a5).setScrollFactor(0).setDepth(111));
   cosmetics.filter(c=>c.slot===slot).forEach((item,j)=>{
    const owned=SaveService.data.ownedCosmetics.includes(item.id),equipped=SaveService.data.equipped[slot]===item.id;
    const b=button(this,210+j*330,1610,300,equipped?'✓':owned?'Choisir':'Verrouillé',()=>{if(!owned)return;SaveService.data.equipped[slot]=item.id;void SaveService.persist();this.scene.restart({page:this.page,decorating:true,slot:this.slot});},item.color).setScrollFactor(0).setDepth(111);
    (b.list.find(o=>o.type==='Text') as Phaser.GameObjects.Text).setColor('#493d48');
    if(!owned)b.setAlpha(.55);label(this,210+j*330,1684,item.name,23,C.ink,0).setScrollFactor(0).setDepth(111);
   });
   label(this,540,1740,'Un décor surprise tous les 10 nouveaux niveaux.',25,C.ink,0).setScrollFactor(0).setDepth(111);
   button(this,540,1835,500,'Terminé',()=>this.scene.restart({page:this.page})).setScrollFactor(0).setDepth(111);
  }
  this.cameras.main.scrollY=Phaser.Math.Clamp(base-(count-1)*350-(this.decorating?1000:1080),0,height-1920);
  let previous=0,dragging=false;
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);previous=p.y;dragging=p.y>270&&p.y<(this.decorating?1290:1580);});
  this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);this.cameras.main.scrollY=Phaser.Math.Clamp(this.cameras.main.scrollY+previous-p.y,0,height-1920);previous=p.y;});
  this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{this.cameras.main.scrollY=Phaser.Math.Clamp(this.cameras.main.scrollY+dy,0,height-1920);});
  this.events.once('shutdown',()=>{this.input.removeAllListeners();this.registry.set('mapDragging',false);});
 }
}
