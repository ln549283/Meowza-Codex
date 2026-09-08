import Phaser from 'phaser';
import { humanHint } from '../../core/humanSolver';
import { MAX_HINTS_PER_ATTEMPT } from '../../core/economy';
import { isWon } from '../../core/validator';
import { AudioService } from '../../services/AudioService';
import { HapticsService } from '../../services/HapticsService';
import { SaveService } from '../../services/SaveService';
import { BoardView } from '../BoardView';
import { GameRegistry } from '../registry';
import { backButton,button,cozyBackground,fadeIn,imageContain,label,panel,roundButton,sparkles,title } from '../ui';
import { C } from '../theme';

export class GameScene extends Phaser.Scene {
 private hints=0;private won=false;
 constructor(){super('Game');}
 create(){
  this.hints=0;this.won=false;
  this.registry.set('mapDragging',false);const level=GameRegistry.selected;if(!level||!SaveService.isUnlocked(level.id)){this.scene.start('LevelSelect');return;}
  fadeIn(this);cozyBackground(this);
  title(this,`${level.id.startsWith('bonus-')?'Défi bonus':'Petit sommet'} ${Number(level.id.split('-')[1])}`,103,47);
  const onboarding=level.id.startsWith('trail-')?Number(level.id.split('-')[1]):0;
  if(onboarding>=1&&onboarding<=5){
   const chip=(x:number,y:number,w:number,text:string)=>{panel(this,x,y,w,74,0xfffaf7,.95);label(this,x,y,text,23);};
   panel(this,540,238,900,104,0xfffaf7,.96);
   imageContain(this.add.image(170,238,'grey-cat'),54,54);
   imageContain(this.add.image(235,238,'orange-cat'),54,54);
   label(this,585,238,'Autant de chats gris que de chats roux\npar ligne et par colonne.',25);
   if(onboarding>=2)chip(285,334,420,'♥  Deux chats identiques');
   if(onboarding>=3)chip(795,334,420,'Jamais 3 identiques à la suite');
   if(onboarding>=4)chip(285,420,420,'Griffes : deux chats différents');
   if(onboarding>=5)chip(795,420,420,'Combine toutes les règles');
  }
  const board=new BoardView(this,540,onboarding>=1&&onboarding<=5?870:790,level,onboarding>=1&&onboarding<=5?840:960);
  const saved=SaveService.data.session;if(saved?.id===level.id&&saved.failed){this.scene.start('Lost',{reason:saved.remaining===0?'time':'errors'});return;}if(saved?.id===level.id){board.restore(saved.grid,saved.errors);this.hints=Math.max(0,saved.hints);}
  let remaining=saved?.id===level.id?saved.remaining??level.timeLimit??360:level.timeLimit??360;
  let started=saved?.id===level.id?!!saved.started:false;
  const quit=()=>{SaveService.restartAttempt();this.scene.start('LevelSelect');};
  const confirmQuit=()=>{
   if(!started){quit();return;}
   const shade=this.add.rectangle(540,960,1080,1920,0x453c51,.72).setDepth(300).setInteractive();
   const card=panel(this,540,930,900,620).setDepth(301);
   const heading=label(this,540,730,'Quitter ce niveau ?',48).setDepth(302);
   const detail=label(this,540,900,'Ta progression sur cette tentative sera perdue :\ngrille, erreurs, chrono et indices.',32).setDepth(302);
   const stay=button(this,540,1080,690,'Continuer la partie',()=>{[shade,card,heading,detail,stay,leave].forEach(o=>o.destroy());},C.teal).setDepth(302);
   const leave=button(this,540,1240,690,'Quitter et recommencer plus tard',quit,0xb398a5).setDepth(302);
  };
  backButton(this,confirmQuit);roundButton(this,985,105,'?',()=>{this.scene.pause();this.scene.launch('Rules',{fromGame:true});});
  const clock=label(this,540,198,'',38);board.onAttempt=()=>{started=true;};
  const lose=(reason:string)=>{board.locked=true;SaveService.data.failures[level.id]=(SaveService.data.failures[level.id]??0)+1;SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started,true);this.scene.start('Lost',{reason});};
  if(level.timed){
   const clockText=()=>clock.setText(`◷ ${Math.floor(remaining/60)}:${String(Math.ceil(remaining%60)).padStart(2,'0')}${started?'':' · au premier chat'}`);
   clockText();
   this.time.addEvent({delay:1000,loop:true,callback:()=>{if(!started||this.won||document.hidden)return;remaining=Math.max(0,remaining-1);clockText();SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started);if(remaining===0){this.won=true;lose('time');}}});
  }
  panel(this,540,1430,960,195,0xfffaf7,.92);
  const selectors:Phaser.GameObjects.Graphics[]=[];
  const select=(value:1|2)=>{board.brush=value;selectors.forEach((g,i)=>{g.clear();if(i+1===value)g.lineStyle(5,C.teal).strokeRoundedRect(-205,-77,410,154,30);});};
  ([1,2] as const).forEach((value,i)=>{const c=this.add.container(305+i*465,1430),g=this.add.graphics();selectors.push(g);const cat=imageContain(this.add.image(-105,0,value===1?'grey-cat':'orange-cat'),112,112);c.add([g,cat,label(this,55,-22,value===1?'Nimbus':'Moka',34),label(this,55,29,value===1?'Chat gris':'Chat roux',30)]);c.setSize(440,190).setInteractive({useHandCursor:true}).on('pointerdown',()=>{if(!this.won)select(value);});});select(1);

  const usedHints=new Set<string>(saved?.id===level.id?saved.hintPositions:[]);
  const status=label(this,540,1560,'',29);const info=label(this,770,1830,'',30);const heart=this.add.graphics();const hintQuota=this.add.graphics();let previousErrors=board.errors;
  const drawHeart=()=>{
   const x=205,y=1822;heart.clear();const broken=board.errors>=3;heart.fillStyle(broken?0xd9a7b1:0xe97589,1);heart.fillCircle(x-34,y-18,43).fillCircle(x+34,y-18,43).fillTriangle(x-77,y-7,x+77,y-7,x,y+78);heart.lineStyle(6,0xffffff,.92);
   if(board.errors>=1)heart.lineBetween(x+4,y-58,x-13,y-8).lineBetween(x-13,y-8,x+13,y+14);
   if(board.errors>=2)heart.lineBetween(x+13,y+14,x-8,y+48).lineBetween(x-8,y+48,x+7,y+70);
   if(broken)heart.lineStyle(9,0x9b6674,.75).lineBetween(x-13,y-8,x+13,y+14);
  };
  const drawHintQuota=()=>{hintQuota.clear();for(let i=0;i<MAX_HINTS_PER_ATTEMPT;i++){const used=i<SaveService.data.attemptPurchases;hintQuota.fillStyle(used?0xc9bcc7:0xffffff,used ? .55 : 1).fillCircle(505+i*35,1753,9);}};

  const hint=button(this,540,1680,390,'Indice',()=>{if(this.won||SaveService.data.attemptPurchases>=MAX_HINTS_PER_ATTEMPT)return;const found=humanHint(board.grid,level.constraints,1);this.scene.pause();this.scene.launch('Hint',{step:found,levelId:level.id,onPurchased:()=>{started=true;SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started,false,[...usedHints]);},onRead:()=>{const key=found?found.position.join(','):'';if(key&&!usedHints.has(key)){usedHints.add(key);this.hints++;SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started,false,[...usedHints]);}},apply:()=>{if(this.won||!found)return;board.reveal(found.position,found.value);AudioService.play('hint');}});},C.teal);
  const magnifier=this.add.graphics().lineStyle(6,0xffffff).strokeCircle(462,1674,18);magnifier.lineBetween(475,1687,493,1705);
  const updateHintButton=()=>{const exhausted=SaveService.data.attemptPurchases>=MAX_HINTS_PER_ATTEMPT;if(exhausted){hint.disableInteractive().setAlpha(.42);magnifier.setAlpha(.42);}else{hint.setInteractive({useHandCursor:true}).setAlpha(1);magnifier.setAlpha(1);}};

  const changed=()=>{
   status.setText('');info.setText(`${SaveService.data.kibble} croquettes`);drawHeart();drawHintQuota();updateHintButton();
   if(board.errors>previousErrors&&!SaveService.data.settings.reducedMotion){this.tweens.add({targets:heart,scaleX:1.14,scaleY:1.14,duration:120,yoyo:true});}previousErrors=board.errors;
   if(!started&&board.grid.some((row,r)=>row.some((v,c)=>v!==level.initial[r]![c])))started=true;
   SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started);
   if(board.errors>=3&&!this.won){this.won=true;board.locked=true;this.time.delayedCall(SaveService.data.settings.reducedMotion?50:320,()=>{if(this.scene.isActive())lose('errors');});return;}
   if(isWon(board.grid,level.constraints)&&!this.won){this.won=true;board.locked=true;hint.disableInteractive();GameRegistry.result={level,errors:board.errors,hints:this.hints};AudioService.play('victory');void HapticsService.victory();sparkles(this,540,790,24);status.setText('Tout le monde a trouvé sa place !');void SaveService.complete(level.id,board.errors,this.hints).then(()=>{if(this.scene.isActive())this.time.delayedCall(SaveService.data.settings.reducedMotion?100:650,()=>this.scene.start('Victory'));});}
  };
  if(level.timed&&!started){
   board.locked=true;
   const cover=this.add.rectangle(540,960,1080,1920,0x453c51,.7).setDepth(200).setInteractive();
   const card=panel(this,540,930,920,690).setDepth(201);
   const heading=label(this,540,710,'Défi coup de griffe',52).setDepth(202);
   const detail=label(this,540,940,`${Math.round(remaining/60)} minutes · 3 erreurs maximum\n\nLe chrono démarre au premier placement.\nTu peux recommencer gratuitement.`,34).setDepth(202);
   const go=button(this,540,1160,660,'Je suis prêt',()=>{[cover,card,heading,detail,go].forEach(o=>o.destroy());board.locked=false;}).setDepth(202);
  }
  board.onChanged=changed;this.events.on('resume',changed);this.events.once('shutdown',()=>this.events.off('resume',changed));changed();
 }
}
