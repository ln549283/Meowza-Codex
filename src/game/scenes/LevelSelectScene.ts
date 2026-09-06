import Phaser from 'phaser';
import levelsData from '../../data/levels.json';
import type { Level } from '../../core/model';
import { chapters } from '../../core/progression';
import { challengeId,journeyId,journeySpec,nextSummit,refugeNames } from '../../core/journey';
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
  this.add.image(540,960,'tree-bg').setDisplaySize(1080,1920).setScrollFactor(0);
  this.add.rectangle(540,960,1080,1920,0xfaf0ff,.12).setScrollFactor(0);
  const trunk=this.add.graphics();trunk.fillStyle(0xd6ad8e,.95).fillRoundedRect(485,400,110,base-260,45);
  trunk.lineStyle(5,0xf8e5d3,.8);for(let y=450;y<base+110;y+=27)trunk.lineBetween(490,y,590,y-20);
  const status=label(this,540,1730,'Glisse pour grimper • à ton rythme',28).setScrollFactor(0).setDepth(102);
  const play=async(n:number,bonus=false)=>{if(this.busy)return;this.busy=true;status.setText('Les chats préparent ta grille…');try{const level=await loadSummit(n,bonus);if(!this.scene.isActive())return;GameRegistry.selected=level;this.scene.start('Game');}catch{if(this.scene.isActive()){status.setText('Préparation interrompue. Retouche le niveau.');this.busy=false;}}};
  for(let n=start;n<=end;n++){
   const i=n-start,x=540+Math.sin(i*1.45)*185,y=base-i*290,progress=SaveService.data.progress[journeyId(n)],config=chapters.find(c=>c.id===journeySpec(n).difficulty)!;
   if(n>current){cloud(this,x,y,340);continue;}
   const shelf=this.add.graphics();shelf.lineStyle(18,0xc59b83).lineBetween(540,y+85,x,y+85);shelf.fillStyle(0xa478ac).fillRoundedRect(x-140,y+66,280,47,24);shelf.fillStyle(0xffb8d9).fillRoundedRect(x-143,y+49,286,40,22);shelf.lineStyle(4,0xfff4f8).strokeRoundedRect(x-143,y+49,286,40,22);
   const c=this.add.container(x,y-12),g=this.add.graphics();g.fillStyle(0x765685).fillCircle(0,10,72);g.fillStyle(progress?.completed?0xfff3cb:config.color).lineStyle(5,0xffffff).fillCircle(0,0,70).strokeCircle(0,0,70);g.fillStyle(0xffffff,.3).fillEllipse(0,-30,95,35);c.add([g,label(this,0,-4,String(n),43,progress?.completed?C.ink:'#ffffff')]);press(this,c,150,160,()=>{void play(n);});
   label(this,x,y+131,config.name,24,C.ink,0);
   if(progress?.completed)label(this,x,y+36,'★'.repeat(progress.stars),23,'#986018',0);
   if(n===current){const cat=imageContain(this.add.image(x-120,y-77,'grey-cat'),110,110);float(this,cat,8);if(this.reveal){const mist=cloud(this,x,y,350);if(SaveService.data.settings.reducedMotion)mist.destroy();else this.tweens.add({targets:mist,x:x+170,alpha:0,duration:1000,onComplete:()=>mist.destroy()});sparkles(this,x,y);}}
   if(n%6===0&&progress?.completed){
    const refuge=n/6,rx=x>540?200:875,choice=SaveService.data.refuges[refuge];
    const home=this.add.container(rx,y-10),bg=this.add.graphics();bg.fillStyle(0xffefd2).lineStyle(4,0xffffff).fillRoundedRect(-110,-83,220,150,34).strokeRoundedRect(-110,-83,220,150,34);home.add([bg,label(this,rx-rx,-38,choice==='hamac'?'⌣':choice==='cabane'?'⌂':'✿',62,C.ink,0),label(this,0,34,choice?'Mon refuge':'Aménager',23,C.ink,0)]);press(this,home,225,170,()=>this.scene.start('Refuge',{n:refuge}));
    const bonus=SaveService.data.progress[challengeId(refuge)];button(this,rx,y+139,265,bonus?.completed?'★ Défi réussi':'✦ Défi bonus',()=>{void play(refuge,true);},C.pink).setScale(.8);
   }
  }
  label(this,540,base+235,start===1?'Un arbre, mille petits bonheurs':`La suite de ton arbre · ${start} à ${end}`,32);
  panel(this,540,145,1040,280,0xfff9f4,.98).setScrollFactor(0).setDepth(100);
  roundButton(this,95,98,'‹',()=>this.scene.start('Home')).setScrollFactor(0).setDepth(101);
  label(this,540,87,'L’arbre des petits bonheurs',42).setScrollFactor(0).setDepth(101);
  label(this,540,153,`${current-1} sommets · prochain refuge au niveau ${Math.ceil(current/6)*6}`,27).setScrollFactor(0).setDepth(101);
  const name=refugeNames[Math.floor((current-1)/6)%refugeNames.length]!;label(this,540,225,name,29).setScrollFactor(0).setDepth(101);
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
