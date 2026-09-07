import Phaser from 'phaser';
import { createAttemptState,markAttemptWon,registerHint,registerMistake,type AttemptState } from '../../core/attempt';
import { findHint } from '../../core/solver';
import { chapters } from '../../core/progression';
import { AudioService } from '../../services/AudioService';
import { HapticsService } from '../../services/HapticsService';
import { SaveService } from '../../services/SaveService';
import { BoardView } from '../BoardView';
import { GameRegistry } from '../registry';
import { backButton,button,catBadge,cozyBackground,fadeIn,imageContain,label,panel,press,roundButton,sparkles,title } from '../ui';
import { C } from '../theme';

export class GameScene extends Phaser.Scene {
 private attempt:AttemptState=createAttemptState();
 constructor(){super('Game');}
 create(){
  const level=GameRegistry.selected;if(!level||!SaveService.isUnlocked(level.id)){this.scene.start('LevelSelect');return;}
  const saved=SaveService.data.session?.id===level.id?SaveService.data.session:null;
  this.attempt=createAttemptState(saved?.errors??0,saved?.hints??0);
  if(this.attempt.status==='lost'){SaveService.clearSession();this.attempt=createAttemptState();}
  fadeIn(this);cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));roundButton(this,985,105,'?',()=>{this.scene.pause();this.scene.launch('Rules',{fromGame:true});});
  title(this,`Petit sommet ${Number(level.id.split('-')[1])}`,103,47);const chapter=chapters.find(c=>c.id===level.difficulty)!;catBadge(this,540,190,260,chapter.name,chapter.color);
  label(this,540,290,'Choisis un chat, puis touche une case.',28);
  const board=new BoardView(this,540,790,level,960);if(saved)board.restore(saved.grid);
  const bar=this.add.graphics();panel(this,540,1430,960,195,0xfffaf7,.92);
  const selectors:Phaser.GameObjects.Graphics[]=[];
  const select=(value:1|2)=>{board.brush=value;selectors.forEach((g,i)=>{g.clear();if(i+1===value)g.lineStyle(5,C.teal).strokeRoundedRect(-205,-77,410,154,30);});};
  ([1,2] as const).forEach((value,i)=>{const c=this.add.container(305+i*465,1430),g=this.add.graphics();selectors.push(g);const cat=imageContain(this.add.image(-105,0,value===1?'grey-cat':'orange-cat'),112,112);c.add([g,cat,label(this,55,-22,value===1?'Nimbus':'Moka',34),label(this,55,29,value===1?'Chat gris':'Chat roux',30)]);press(this,c,420,170,()=>select(value));});select(1);

  const heart=this.add.text(540,1570,'♥',{fontFamily:'Nunito',fontSize:'104px',color:'#e35f7c'}).setOrigin(.5);
  const status=label(this,540,1650,'',29);
  const hint=button(this,540,1765,390,'✦ Indice',()=>{
   if(this.attempt.status!=='playing')return;const found=findHint(board.grid,level);
   if(found){this.attempt=registerHint(this.attempt);board.reveal(found.position,found.value);AudioService.play('hint');status.setText('Une case dévoilée pour te guider.');save();}
  },C.teal);

  const paintHeart=()=>{
   const remaining=3-this.attempt.errors;
   heart.setText(remaining===3?'♥':remaining===2?'♥̸':remaining===1?'♡':'♡');
   heart.setAlpha(remaining===0?.35:1);heart.setScale(remaining===1?1.08:1);
  };
  const save=()=>{if(this.attempt.status==='playing')SaveService.remember(level.id,board.grid,this.attempt.errors,this.attempt.hintsUsed);};
  const defeat=()=>{
   board.locked=true;hint.disableInteractive();SaveService.clearSession();AudioService.play('invalid');void HapticsService.error();
   panel(this,540,1040,820,520,0xfffaf7,.98).setDepth(50);label(this,540,890,'💔',100).setDepth(51);title(this,'Chat alors…',1010,58).setDepth(51);label(this,540,1090,'Ton cœur s’est brisé.',31).setDepth(51);
   button(this,540,1235,560,'Réessayer',()=>{SaveService.clearSession();this.scene.restart();},C.pink).setDepth(51);
  };
  const changed=()=>{
   const filled=board.grid.flat().filter(v=>v!==0).length,total=level.size**2;
   bar.clear().fillStyle(0xded1e8).fillRoundedRect(170,1287,740,12,6).fillStyle(chapter.color).fillRoundedRect(170,1287,740*filled/total,12,6);
   status.setText(`${filled} / ${total} chats bien installés · ${this.attempt.hintsUsed} indice${this.attempt.hintsUsed>1?'s':''}`);paintHeart();save();
   if(board.isComplete()&&this.attempt.status==='playing'){
    this.attempt=markAttemptWon(this.attempt);board.locked=true;hint.disableInteractive();GameRegistry.result={level,errors:this.attempt.errors,hints:this.attempt.hintsUsed};AudioService.play('victory');void HapticsService.victory();sparkles(this,540,790,24);status.setText('Tout le monde a trouvé sa place !');
    void SaveService.complete(level.id,this.attempt.errors,this.attempt.hintsUsed).then(()=>{if(this.scene.isActive())this.time.delayedCall(SaveService.data.settings.reducedMotion?100:650,()=>this.scene.start('Victory'));});
   }
  };
  board.onMistake=()=>{
   if(this.attempt.status!=='playing')return;this.attempt=registerMistake(this.attempt);paintHeart();
   if(!SaveService.data.settings.reducedMotion)this.tweens.add({targets:heart,scaleX:1.2,scaleY:1.2,duration:90,yoyo:true});
   if(this.attempt.status==='lost')defeat();else{status.setText(this.attempt.errors===1?'Aïe… le cœur se fissure.':'Encore une erreur et le cœur se brise.');save();}
  };
  board.onChanged=changed;changed();
 }
}
