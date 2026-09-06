import Phaser from 'phaser';
import levelsData from '../../data/levels.json';
import type { Difficulty,Level } from '../../core/model';
import { chapters } from '../../core/progression';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { button,cloud,fadeIn,float,imageContain,label,panel,press,roundButton,sparkles } from '../ui';
import { C } from '../theme';
const levels=levelsData as unknown as Level[];
export class LevelSelectScene extends Phaser.Scene {
 private chapter:Difficulty='easy'; private reveal=false;
 constructor(){super('LevelSelect');}
 init(data:{chapter?:Difficulty;reveal?:boolean}={}){this.chapter=data.chapter??GameRegistry.selected?.difficulty??(SaveService.data.session?.id.split('-')[0] as Difficulty|undefined)??'easy';this.reveal=data.reveal??false;}
 create(){
  fadeIn(this);this.registry.set('mapDragging',false);
  const config=chapters.find(c=>c.id===this.chapter)!;
  const group=levels.filter(l=>l.difficulty===this.chapter);
  const current=group.find(l=>SaveService.isUnlocked(l.id)&&!SaveService.data.progress[l.id]?.completed)??group[group.length-1]!;
  const height=group.length*250+1650,base=height-690;
  this.cameras.main.setBounds(0,0,1080,height);
  this.add.image(540,960,'tree-bg').setDisplaySize(1080,1920).setScrollFactor(0);
  this.add.rectangle(540,960,1080,1920,0xfaf0ff,.23).setScrollFactor(0);
  const trunk=this.add.graphics();trunk.fillStyle(0xe4c4b1,.88).fillRoundedRect(485,650,110,base-510,45);
  trunk.lineStyle(5,0xf8e5d3,.8);for(let y=690;y<base+100;y+=27)trunk.lineBetween(490,y,590,y-20);
  group.forEach((level,i)=>{
   const x=540+Math.sin(i*1.45)*235,y=base-i*250,unlocked=SaveService.isUnlocked(level.id),progress=SaveService.data.progress[level.id];
   if(!unlocked){cloud(this,x,y,360);return;}
   const shelf=this.add.graphics();shelf.lineStyle(18,0xd1ad99).lineBetween(540,y+85,x,y+85);shelf.fillStyle(0xb392b7,.65).fillRoundedRect(x-150,y+66,300,47,24);shelf.fillStyle(0xf8dae5).fillRoundedRect(x-153,y+49,306,40,22);shelf.lineStyle(4,0xfff4f8).strokeRoundedRect(x-153,y+49,306,40,22);
   const c=this.add.container(x,y-12),g=this.add.graphics();g.fillStyle(config.color).fillCircle(0,8,72);g.fillStyle(progress?.completed?0xfff9ed:config.color).lineStyle(5,0xffffff).fillCircle(0,0,70).strokeCircle(0,0,70);c.add([g,label(this,0,-4,String(i+1),49,progress?.completed?C.ink:'#ffffff')]);press(this,c,150,160,()=>{GameRegistry.selected=level;this.scene.start('Game');});
   if(progress?.completed)label(this,x,y+38,'★'.repeat(progress.stars),25,'#ac7439');
   if(level.id===current.id&&!progress?.completed){const cat=imageContain(this.add.image(x-116,y-80,'grey-cat'),110,110);float(this,cat,8);label(this,x+140,y-75,'À toi !',27);if(this.reveal){const mist=cloud(this,x,y,370);if(SaveService.data.settings.reducedMotion)mist.destroy();else this.tweens.add({targets:mist,x:x+170,alpha:0,duration:1100,onComplete:()=>mist.destroy()});sparkles(this,x,y);}}
  });
  label(this,540,base+195,config.subtitle,34);
  // Fixed HUD leaves the climb itself free to scroll.
  panel(this,540,130,1040,245,0xfff9f4,.97).setScrollFactor(0).setDepth(100);
  roundButton(this,95,102,'‹',()=>this.scene.start('Home')).setScrollFactor(0).setDepth(101);
  label(this,540,90,'L’arbre des petits bonheurs',44).setScrollFactor(0).setDepth(101);
  label(this,540,157,`${SaveService.completedCount(this.chapter)} / ${group.length}  ·  ${config.subtitle}`,27).setScrollFactor(0).setDepth(101);
  chapters.forEach((ch,i)=>button(this,150+i*260,284,242,ch.name,()=>this.scene.restart({chapter:ch.id}),ch.id===this.chapter?ch.color:0x9b8ca8).setScale(.92).setScrollFactor(0).setDepth(101));
  panel(this,540,1800,1040,245,0xfff9f4,.97).setScrollFactor(0).setDepth(100);
  const available=group.some(l=>SaveService.isUnlocked(l.id));
  const unlockText=this.chapter==='medium'?'Termine 10 niveaux Facile pour accéder aux cabanes.':this.chapter==='hard'?'Termine 15 niveaux Moyen pour atteindre les perchoirs.':'Termine les 30 niveaux Difficile pour percer les nuages.';
  label(this,540,1727,available?'Fais glisser pour explorer l’arbre':unlockText,available?28:25).setScrollFactor(0).setDepth(101);
  button(this,540,1830,620,available?'Revenir à mon perchoir':'Retour à mon parcours',()=>{if(available)this.focus(base-group.indexOf(current)*250);else this.scene.restart({chapter:chapters[Math.max(0,chapters.indexOf(config)-1)]!.id});},config.color).setScrollFactor(0).setDepth(101);
  this.focus(base-group.indexOf(current)*250);
  let previous=0,dragging=false;
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.registry.set('mapDragging',false);previous=p.y;dragging=p.y>355&&p.y<1660;});
  this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown||!dragging)return;if(p.getDistance()>18)this.registry.set('mapDragging',true);this.cameras.main.scrollY=Phaser.Math.Clamp(this.cameras.main.scrollY+previous-p.y,0,height-1920);previous=p.y;});
  this.input.on('wheel',(_p:unknown,_o:unknown,_x:number,dy:number)=>{this.cameras.main.scrollY=Phaser.Math.Clamp(this.cameras.main.scrollY+dy,0,height-1920);});
  this.events.once('shutdown',()=>{this.input.removeAllListeners();this.registry.set('mapDragging',false);});
 }
 private focus(y:number){this.cameras.main.scrollY=Phaser.Math.Clamp(y-1160,0,this.cameras.main.getBounds().height-1920);}
}
