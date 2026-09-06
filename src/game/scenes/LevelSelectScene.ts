import { biomeFor } from '../../core/economy';
import Phaser from 'phaser';
import levelsData from '../../data/levels.json';
import type { Level } from '../../core/model';
import { chapters } from '../../core/progression';
import { journeyId,journeySpec,nextSummit } from '../../core/journey';
import { loadSummit } from '../../services/JourneyService';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { button,cloud,fadeIn,float,imageContain,label,panel,press,roundButton,sparkles } from '../ui';
import { C } from '../theme';
export class LevelSelectScene extends Phaser.Scene {
 private page=0;private reveal=false;private busy=false;
 constructor(){super('LevelSelect');}
 init(data:{page?:number;reveal?:boolean}={}){this.page=data.page??Math.floor((nextSummit(SaveService.data.progress)-1)/24);this.reveal=data.reveal??false;this.busy=false;}
 create(){
  fadeIn(this);this.registry.set('mapDragging',false);
  const current=nextSummit(SaveService.data.progress),start=this.page*24+1,end=Math.min(start+23,current+5),count=end-start+1;
  const height=count*290+1700,base=height-750;
  this.cameras.main.setBounds(0,0,1080,height);
  this.add.image(540,960,biomeFor(Math.min(current,end)).key).setDisplaySize(1080,1920).setScrollFactor(0);
  this.add.rectangle(540,960,1080,1920,0xfaf0ff,.12).setScrollFactor(0);
  const xAt=(n:number)=>260+((Math.imul(n,2654435761)>>>8)%560);
  const status=label(this,540,1730,'Glisse pour grimper • à ton rythme',28).setScrollFactor(0).setDepth(102);
  const play=async(n:number,bonus=false)=>{if(this.busy)return;this.busy=true;status.setText('Les chats préparent ta grille…');try{const level=await loadSummit(n,bonus);if(!this.scene.isActive())return;if(SaveService.data.session?.id!==level.id||SaveService.data.session.errors>=3)SaveService.restartAttempt();GameRegistry.selected=level;this.scene.start('Game');}catch{if(this.scene.isActive()){status.setText('Préparation interrompue. Retouche le niveau.');this.busy=false;}}};
  for(let n=start;n<=end;n++){
   const i=n-start,x=xAt(n),y=base-i*290,progress=SaveService.data.progress[journeyId(n)],config=chapters.find(c=>c.id===journeySpec(n).difficulty)!;
   if(n>current){cloud(this,x,y,340);continue;}
   const shelf=this.add.graphics();if(n>start){shelf.lineStyle(22,0xb7855b).lineBetween(xAt(n-1),y+290,x,y);shelf.lineStyle(7,0xf1d4a6).lineBetween(xAt(n-1),y+290,x,y);}
   imageContain(this.add.image(x,y+80,'atlas-v3',['platform','house','hammock','platform'][n%4]!),350,240);
   const c=this.add.container(x,y-12),g=this.add.graphics();g.fillStyle(0xfff5db).fillRoundedRect(-52,27,104,55,22);const face=imageContain(this.add.image(0,-28,'atlas-v3',config.id),145,135);c.add([face,g,label(this,0,53,String(n),35,C.ink,0)]);press(this,c,150,160,()=>{void play(n);});
   label(this,x,y+131,config.name,24,C.ink,0);
   if(progress?.completed)label(this,x,y+170,'★'.repeat(progress.stars),23,'#986018',0);
   if(n===current){const cat=imageContain(this.add.image(x-120,y-77,'grey-cat'),110,110);float(this,cat,8);if(this.reveal){const mist=cloud(this,x,y,350);if(SaveService.data.settings.reducedMotion)mist.destroy();else this.tweens.add({targets:mist,x:x+170,alpha:0,duration:1000,onComplete:()=>mist.destroy()});sparkles(this,x,y);}}
   if(n%6===0&&progress?.completed){const bonus=n/6;button(this,x<540?860:210,y-30,260,'Défi Extrême',()=>{void play(bonus,true);},C.pink).setScale(.8);}
  }
  label(this,540,base+235,start===1?'Un arbre, mille petits bonheurs':`La suite de ton arbre · ${start} à ${end}`,32);
  panel(this,540,145,1040,280,0xfff9f4,.98).setScrollFactor(0).setDepth(100);
  roundButton(this,95,98,'‹',()=>this.scene.start('Home')).setScrollFactor(0).setDepth(101);
  label(this,540,87,'L’arbre des petits bonheurs',42).setScrollFactor(0).setDepth(101);
  label(this,540,153,`${current-1} sommets · ${SaveService.data.kibble} croquettes`,27).setScrollFactor(0).setDepth(101);
  const biome=biomeFor(Math.min(current,end));const name=`${biome.name} · ${biome.start}–${biome.end}`;label(this,540,225,name,29).setScrollFactor(0).setDepth(101);
  panel(this,540,1800,1040,245,0xfff9f4,.98).setScrollFactor(0).setDepth(100);
  button(this,540,1830,570,'Mon prochain sommet',()=>{if(Math.floor((current-1)/24)!==this.page)this.scene.restart({});else this.focus(base-(current-start)*290);},C.teal).setScrollFactor(0).setDepth(101);
  if(this.page>0)roundButton(this,130,1830,'↓',()=>this.scene.restart({page:this.page-1})).setScrollFactor(0).setDepth(101);
  if(end<current)roundButton(this,950,1830,'↑',()=>this.scene.restart({page:this.page+1})).setScrollFactor(0).setDepth(101);
  const legacy=(levelsData as unknown as Level[]).filter(l=>SaveService.data.progress[l.id]?.completed);
  if(legacy.length)button(this,540,350,680,'Mes anciens sommets',()=>{this.scene.start('Archive');},C.orange).setScrollFactor(0).setDepth(101).setScale(.8);
  this.focus(base-(Math.min(current,end)-start)*290);
  let previous=0,dragging=false;
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);previous=p.y;dragging=p.y>410&&p.y<1660;});
  this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);this.cameras.main.scrollY=Phaser.Math.Clamp(this.cameras.main.scrollY+previous-p.y,0,height-1920);previous=p.y;});
  this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{this.cameras.main.scrollY=Phaser.Math.Clamp(this.cameras.main.scrollY+dy,0,height-1920);});
  this.events.once('shutdown',()=>{this.input.removeAllListeners();this.registry.set('mapDragging',false);});
 }
 private focus(y:number){this.cameras.main.scrollY=Phaser.Math.Clamp(y-1120,0,this.cameras.main.getBounds().height-1920);}
}
