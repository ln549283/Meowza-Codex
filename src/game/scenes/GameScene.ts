
import Phaser from 'phaser';
import { humanHint } from '../../core/humanSolver';
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
  fadeIn(this);cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));roundButton(this,985,105,'?',()=>{this.scene.pause();this.scene.launch('Rules',{fromGame:true});});
  title(this,`${level.id.startsWith('bonus-')?'Défi bonus':'Petit sommet'} ${Number(level.id.split('-')[1])}`,103,47);
  label(this,540,290,level.id==='trail-1'?'Autant de gris que de roux.':level.id==='trail-2'?'Le cœur relie deux chats identiques.':level.id==='trail-3'?'Jamais trois chats identiques à la suite.':level.id==='trail-4'?'Les griffes relient deux chats différents.':level.id==='trail-5'?'À toi de combiner les règles !':'',28);
  const board=new BoardView(this,540,790,level,960);
  const saved=SaveService.data.session;if(saved?.id===level.id&&saved.failed){this.scene.start('Lost',{reason:saved.remaining===0?'time':'errors'});return;}if(saved?.id===level.id){board.restore(saved.grid,saved.errors);this.hints=Math.max(0,saved.hints);}
  let remaining=saved?.id===level.id?saved.remaining??level.timeLimit??360:level.timeLimit??360;
  let started=saved?.id===level.id?!!saved.started:false;
  const clock=label(this,540,198,'',38);board.onAttempt=()=>{started=true;};
  const lose=(reason:string)=>{this.won=true;board.locked=true;SaveService.data.failures[level.id]=(SaveService.data.failures[level.id]??0)+1;SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started,true);this.scene.start('Lost',{reason});};
  if(level.timed){
   const clockText=()=>clock.setText(`◷ ${Math.floor(remaining/60)}:${String(Math.ceil(remaining%60)).padStart(2,'0')}${started?'':' · au premier chat'}`);
   clockText();
   this.time.addEvent({delay:1000,loop:true,callback:()=>{if(!started||this.won||document.hidden)return;remaining=Math.max(0,remaining-1);clockText();SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started);if(remaining===0)lose('time');}});
  }
  panel(this,540,1430,960,195,0xfffaf7,.92);
  const selectors:Phaser.GameObjects.Graphics[]=[];
  const select=(value:1|2)=>{board.brush=value;selectors.forEach((g,i)=>{g.clear();if(i+1===value)g.lineStyle(5,C.teal).strokeRoundedRect(-205,-77,410,154,30);});};
  ([1,2] as const).forEach((value,i)=>{const c=this.add.container(305+i*465,1430),g=this.add.graphics();selectors.push(g);const cat=imageContain(this.add.image(-105,0,value===1?'grey-cat':'orange-cat'),112,112);c.add([g,cat,label(this,55,-22,value===1?'Nimbus':'Moka',34),label(this,55,29,value===1?'Chat gris':'Chat roux',30)]);c.setSize(440,190).setInteractive({useHandCursor:true}).on('pointerdown',()=>{if(!this.won)select(value);});});select(1);
  const usedHints=new Set<string>(saved?.id===level.id?saved.hintPositions:[]);
  const status=label(this,540,1560,'',29);const info=label(this,710,1830,'',32);const lives=this.add.graphics();
  const undo=button(this,205,1680,290,'↶ Annuler',()=>board.undo(),0x9a8aac);
  const hint=button(this,540,1680,310,'⌕',()=>{if(this.won)return;const found=humanHint(board.grid,level.constraints,1);this.scene.pause();this.scene.launch('Hint',{step:found,levelId:level.id,onRead:()=>{const key=found?found.position.join(','):'';if(key&&!usedHints.has(key)){usedHints.add(key);this.hints++;SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started,false,[...usedHints]);}},apply:()=>{if(this.won||!found)return;board.reveal(found.position,found.value);AudioService.play('hint');}});},C.teal);
  const magnifier=this.add.graphics().lineStyle(7,0xffffff).strokeCircle(532,1674,22);magnifier.lineBetween(548,1690,570,1712);(hint.list.find(o=>o.type==='Text') as Phaser.GameObjects.Text).setText('');
  const reset=button(this,875,1680,290,'↻ Effacer',()=>{if(!this.won)board.reset();},0xb98597);
  const changed=()=>{
   status.setText('');
   info.setText(`${SaveService.data.kibble} croquettes`);
   lives.clear();for(let i=0;i<3;i++){const x=180+i*82,y=1830;lives.fillStyle(i<3-board.errors?0xe97589:0xd9cdd3);lives.fillCircle(x-12,y-8,17).fillCircle(x+12,y-8,17).fillTriangle(x-29,y-4,x+29,y-4,x,y+30);} 
   if(!started&&board.grid.some((row,r)=>row.some((v,c)=>v!==level.initial[r]![c])))started=true;
   SaveService.remember(level.id,board.grid,board.errors,this.hints,remaining,started);
   if(board.errors>=3&&!this.won){this.won=true;board.locked=true;lose('errors');return;}
   if(isWon(board.grid,level.constraints)&&!this.won){this.won=true;board.locked=true;undo.disableInteractive();hint.disableInteractive();reset.disableInteractive();const stars=this.hints===0&&board.errors===0?3:this.hints<=1&&board.errors<=3?2:1;GameRegistry.result={level,stars,errors:board.errors,hints:this.hints};AudioService.play('victory');void HapticsService.victory();sparkles(this,540,790,24);status.setText('Tout le monde a trouvé sa place !');void SaveService.complete(level.id,stars,board.errors,this.hints).then(()=>{if(this.scene.isActive())this.time.delayedCall(SaveService.data.settings.reducedMotion?100:650,()=>this.scene.start('Victory'));});}
  };
  if(level.timed&&!started){
   board.locked=true;
   const cover=this.add.rectangle(540,960,1080,1920,0x453c51,.7).setDepth(200).setInteractive();
   const card=panel(this,540,930,920,690).setDepth(201);
   const heading=label(this,540,710,'Défi coup de griffe',52).setDepth(202);
   const detail=label(this,540,940,`${Math.round(remaining/60)} minutes · 3 cœurs\n\nLe chrono démarre au premier placement.\nTu peux recommencer gratuitement.`,34).setDepth(202);
   const go=button(this,540,1160,660,'Je suis prêt',()=>{[cover,card,heading,detail,go].forEach(o=>o.destroy());board.locked=false;}).setDepth(202);
  }
  board.onChanged=changed;this.events.on('resume',changed);this.events.once('shutdown',()=>this.events.off('resume',changed));changed();
 }
}
