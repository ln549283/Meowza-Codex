import Phaser from 'phaser';
import { humanHint } from '../../core/humanSolver';
import { MAX_HINTS_PER_ATTEMPT } from '../../core/economy';
import { isWon } from '../../core/validator';
import { AudioService } from '../../services/AudioService';
import { HapticsService } from '../../services/HapticsService';
import { SaveService } from '../../services/SaveService';
import { BoardView } from '../BoardView';
import { GameRegistry } from '../registry';
import { button,cozyBackground,fadeIn,imageContain,label,panel,press,sparkles } from '../ui';
import { C } from '../theme';

export class GameScene extends Phaser.Scene {
 private hints=0;private won=false;
 constructor(){super('Game');}
 create(){
  this.hints=0;this.won=false;this.registry.set('mapDragging',false);const level=GameRegistry.selected;
  if(!level||!SaveService.isUnlocked(level.id)){this.scene.start('LevelSelect');return;}
  fadeIn(this);cozyBackground(this);
  const artPanel=(x:number,y:number,w:number,h:number)=>this.add.image(x,y,'puzzle-panel').setDisplaySize(w,h);
  const iconButton=(x:number,y:number,key:string,onClick:()=>void)=>{const c=this.add.container(x,y).setDepth(30),skin=this.add.image(0,0,'button-square').setDisplaySize(104,104),icon=imageContain(this.add.image(0,0,key),52,52);c.add([skin,icon]);return press(this,c,110,110,onClick);};
  const artButton=(x:number,y:number,w:number,text:string,onClick:()=>void,primary=true)=>{const c=this.add.container(x,y),skin=this.add.image(0,0,primary?'button-primary':'button-secondary').setDisplaySize(w,112),txt=label(this,0,-2,text,31,primary?'#24445a':C.ink);c.add([skin,txt]);return press(this,c,w,120,onClick);};

  const levelNumber=Number(level.id.split('-')[1]);
  artPanel(540,108,620,112);
  label(this,540,88,`${level.id.startsWith('bonus-')?'Défi bonus':'Niveau'} ${levelNumber}`,39);
  label(this,540,132,level.timed?'Coup de griffe · 5 min':'Puzzle des chats',21,'#775F68',20);

  const saved=SaveService.data.session;let remaining=saved?.id===level.id?saved.remaining??level.timeLimit??360:level.timeLimit??360;let started=saved?.id===level.id?!!saved.started:false;
  const markStarted=()=>{if(!started){started=true;SaveService.trackAttemptStart(level.id);}};
  const quit=()=>{SaveService.restartAttempt();this.scene.start('LevelSelect');};
  const confirmQuit=()=>{if(!started){quit();return;}const shade=this.add.rectangle(540,960,1080,1920,0x453c51,.68).setDepth(300).setInteractive();const card=panel(this,540,930,900,600).setDepth(301);const heading=label(this,540,730,'Quitter ce niveau ?',47).setDepth(302);const detail=label(this,540,900,'Ta progression sur cette tentative sera perdue :\ngrille, erreurs, chrono et indices.',30).setDepth(302);const stay=button(this,540,1070,690,'Continuer la partie',()=>{[shade,card,heading,detail,stay,leave].forEach(o=>o.destroy());},C.teal).setDepth(302);const leave=button(this,540,1215,690,'Quitter et recommencer plus tard',()=>{SaveService.trackAbandon(level.id);quit();},C.orange).setDepth(302);};
  iconButton(78,106,'ui-back',confirmQuit);iconButton(1002,106,'hub-settings',()=>{this.scene.pause();this.scene.launch('Rules',{fromGame:true});});

  const clock=label(this,540,190,'',29);
  const onboarding=level.id.startsWith('trail-')?levelNumber:0;const isOnboarding=onboarding>=1&&onboarding<=5;let ruleBottom=220;
  if(isOnboarding){const lines=['Autant de chats gris que de chats roux dans chaque ligne et chaque colonne.'];if(onboarding>=2)lines.push('♥  Le cœur relie deux chats identiques.');if(onboarding>=3)lines.push('Jamais trois chats identiques à la suite.');if(onboarding>=4)lines.push('Griffes : les deux chats sont différents.');const ruleH=onboarding>=4?250:onboarding>=3?205:onboarding>=2?170:135,ruleY=250+ruleH/2;ruleBottom=ruleY+ruleH/2+18;artPanel(540,ruleY,930,ruleH);const text=label(this,540,ruleY,lines.join('\n'),onboarding>=4?22:24);text.setLineSpacing(8).setWordWrapWidth(760,true);}

  const boardSize=isOnboarding?Math.min(820,1760-ruleBottom-430):level.size===8?930:870;
  const boardY=ruleBottom+boardSize/2+16;
  const board=new BoardView(this,540,boardY,level,boardSize);
  if(saved?.id===level.id&&saved.failed){this.scene.start('Lost',{reason:saved.remaining===0?'time':'errors'});return;}
  if(saved?.id===level.id){board.restore(saved.grid,saved.errors);this.hints=Math.max(0,saved.hints);}board.onAttempt=markStarted;board.onPlacement=(correct)=>SaveService.trackPlacement(level.id,correct);

  const lose=(reason:'errors'|'time')=>{board.locked=true;SaveService.data.failures[level.id]=(SaveService.data.failures[level.id]??0)+1;SaveService.trackFailure(level.id,reason);SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started,true);this.scene.start('Lost',{reason});};
  if(level.timed){const clockText=()=>clock.setText(`◷ ${Math.floor(remaining/60)}:${String(Math.ceil(remaining%60)).padStart(2,'0')}${started?'':' · démarre au premier chat'}`);clockText();this.time.addEvent({delay:1000,loop:true,callback:()=>{if(!started||this.won||document.hidden)return;remaining=Math.max(0,remaining-1);clockText();SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started);if(remaining===0){this.won=true;lose('time');}}});}

  const selectorY=boardY+boardSize/2+98;
  const selectorCards:Phaser.GameObjects.Container[]=[];
  const select=(value:1|2)=>{board.brush=value;selectorCards.forEach((c,i)=>{const skin=c.list[0] as Phaser.GameObjects.Image;skin.setTexture(i+1===value?(value===1?'tile-lilac':'tile-peach'):'button-square');c.setScale(i+1===value?1.05:1).setAlpha(i+1===value?1:.82);});};
  ([1,2] as const).forEach((value,i)=>{const c=this.add.container(395+i*290,selectorY),bg=this.add.image(0,0,'button-square').setDisplaySize(170,170),cat=imageContain(this.add.image(0,-8,value===1?'grey-cat':'orange-cat'),120,120),name=label(this,0,68,value===1?'Nimbus':'Moka',21,value===1?'#5f4a70':'#8b4c3d',20);c.add([bg,cat,name]);press(this,c,185,185,()=>{if(!this.won)select(value);});selectorCards.push(c);});select(1);

  const usedHints=new Set<string>(saved?.id===level.id?saved.hintPositions:[]);const footerY=Math.min(1790,selectorY+185);
  const heart=this.add.image(845,footerY-15,'heart-full').setDisplaySize(102,102);
  imageContain(this.add.image(770,footerY+55,'hub-kibble'),38,38);const kibble=label(this,860,footerY+56,'',23,C.ink,0);
  const status=label(this,540,footerY-115,'',25);const hintQuota=this.add.container(0,0);
  let previousErrors=board.errors;
  const setHeart=()=>heart.setTexture(board.errors<=0?'heart-full':board.errors===1?'heart-crack-1':board.errors===2?'heart-crack-2':'heart-broken');
  const drawHintQuota=()=>{hintQuota.removeAll(true);for(let i=0;i<MAX_HINTS_PER_ATTEMPT;i++){const used=i<SaveService.data.attemptPurchases;hintQuota.add(imageContain(this.add.image(575+i*34,footerY+60,used?'star-empty':'star-full'),20,20));}};
  const hintLabel=()=>SaveService.data.attemptPurchases>=MAX_HINTS_PER_ATTEMPT?'Indices épuisés':'Indice';
  const openHint=()=>{if(this.won||SaveService.data.attemptPurchases>=MAX_HINTS_PER_ATTEMPT)return;const found=humanHint(board.grid,level.constraints,1);this.scene.pause();this.scene.launch('Hint',{step:found,levelId:level.id,onPurchased:()=>{markStarted();SaveService.trackHint(level.id);SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started,false,[...usedHints]);},onRead:()=>{const key=found?found.position.join(','):'';if(key&&!usedHints.has(key)){usedHints.add(key);this.hints++;SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started,false,[...usedHints]);}},apply:()=>{if(this.won||!found)return;board.reveal(found.position,found.value);AudioService.play('hint');}});};
  const hint=artButton(320,footerY,420,hintLabel(),openHint,true);imageContain(this.add.image(155,footerY,'ui-hint'),52,52).setDepth(5);
  const hintText=hint.list.find(o=>o instanceof Phaser.GameObjects.Text) as Phaser.GameObjects.Text;
  const updateHintButton=()=>{const exhausted=SaveService.data.attemptPurchases>=MAX_HINTS_PER_ATTEMPT;hintText.setText(hintLabel());if(exhausted){hint.disableInteractive().setAlpha(.44);}else{hint.setInteractive({useHandCursor:true}).setAlpha(1);}};

  const changed=()=>{status.setText('');kibble.setText(`${SaveService.data.kibble}`);setHeart();drawHintQuota();updateHintButton();if(board.errors>previousErrors&&!SaveService.data.settings.reducedMotion){heart.setScale(1);this.tweens.add({targets:heart,scaleX:1.16,scaleY:1.16,duration:120,yoyo:true,ease:'Sine.Out'});}previousErrors=board.errors;if(!started&&board.grid.some((row,r)=>row.some((v,c)=>v!==level.initial[r]![c])))markStarted();SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started);if(board.errors>=3&&!this.won){this.won=true;board.locked=true;this.time.delayedCall(SaveService.data.settings.reducedMotion?50:360,()=>{if(this.scene.isActive())lose('errors');});return;}if(isWon(board.grid,level.constraints)&&!this.won){this.won=true;board.locked=true;hint.disableInteractive();SaveService.trackWin(level.id);GameRegistry.result={level,errors:board.errors,hints:this.hints};AudioService.play('victory');void HapticsService.victory();sparkles(this,540,boardY,20);status.setText('Tout le monde a trouvé sa place !');void SaveService.complete(level.id,board.errors,this.hints).then(()=>{if(this.scene.isActive())this.time.delayedCall(SaveService.data.settings.reducedMotion?100:650,()=>this.scene.start('Victory'));});}};

  if(level.timed&&!started){board.locked=true;const cover=this.add.rectangle(540,960,1080,1920,0x453c51,.67).setDepth(200).setInteractive();const card=panel(this,540,930,900,650).setDepth(201);imageContain(this.add.image(540,710,'ui-clock'),78,78).setDepth(202);const heading=label(this,540,790,'Coup de griffe',50).setDepth(202);const detail=label(this,540,970,`${Math.round(remaining/60)} minutes · 3 erreurs maximum\n\nLe chrono démarre au premier placement.\nRetry toujours gratuit.`,31).setDepth(202);const go=button(this,540,1165,650,'Je suis prêt',()=>{[cover,card,heading,detail,go].forEach(o=>o.destroy());board.locked=false;}).setDepth(202);}
  board.onChanged=changed;this.events.on('resume',changed);this.events.once('shutdown',()=>this.events.off('resume',changed));changed();
 }
}
