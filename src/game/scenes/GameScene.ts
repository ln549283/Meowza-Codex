import Phaser from 'phaser';
import { humanHint } from '../../core/humanSolver';
import { isWon,validateGrid } from '../../core/validator';
import { chapters } from '../../core/progression';
import { AudioService } from '../../services/AudioService';
import { HapticsService } from '../../services/HapticsService';
import { SaveService } from '../../services/SaveService';
import { BoardView } from '../BoardView';
import { GameRegistry } from '../registry';
import { backButton,button,catBadge,cozyBackground,fadeIn,imageContain,label,panel,press,roundButton,sparkles,title } from '../ui';
import { C } from '../theme';
export class GameScene extends Phaser.Scene {
 private hints=0;private won=false;
 constructor(){super('Game');}
 create(){
  this.hints=0;this.won=false;
  const level=GameRegistry.selected;if(!level||!SaveService.isUnlocked(level.id)){this.scene.start('LevelSelect');return;}
  fadeIn(this);cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));roundButton(this,985,105,'?',()=>{this.scene.pause();this.scene.launch('Rules',{fromGame:true});});
  title(this,`${level.id.startsWith('bonus-')?'Défi bonus':'Petit sommet'} ${Number(level.id.split('-')[1])}`,103,47);const chapter=chapters.find(c=>c.id===level.difficulty)!;catBadge(this,540,190,260,chapter.name,chapter.color);
  label(this,540,290,'Choisis un chat, puis touche une case.',28);
  const board=new BoardView(this,540,790,level,960);
  const saved=SaveService.data.session;if(saved?.id===level.id){board.restore(saved.grid,saved.errors);this.hints=Math.max(0,saved.hints);}
  const bar=this.add.graphics();
  panel(this,540,1430,960,195,0xfffaf7,.92);
  const selectors:Phaser.GameObjects.Graphics[]=[];
  const select=(value:1|2)=>{board.brush=value;selectors.forEach((g,i)=>{g.clear();if(i+1===value)g.lineStyle(5,C.teal).strokeRoundedRect(-205,-77,410,154,30);});};
  ([1,2] as const).forEach((value,i)=>{const c=this.add.container(305+i*465,1430),g=this.add.graphics();selectors.push(g);const cat=imageContain(this.add.image(-105,0,value===1?'grey-cat':'orange-cat'),112,112);c.add([g,cat,label(this,55,-22,value===1?'Nimbus':'Moka',34),label(this,55,29,value===1?'Chat gris':'Chat roux',30)]);press(this,c,420,170,()=>select(value));});select(1);
  const status=label(this,540,1560,'',29);const info=label(this,540,1830,'',26);
  const undo=button(this,205,1680,290,'↶ Annuler',()=>board.undo(),0x9a8aac);
  const hint=button(this,540,1680,310,'✦ Indice',()=>{if(this.won)return;const found=humanHint(board.grid,level.constraints,level.id.startsWith('trail-')&&(level.difficulty==='easy'||level.difficulty==='medium')?0:2);if(found){board.highlight([found.position,...found.sources]);this.scene.pause();this.scene.launch('Hint',{step:found,apply:()=>{if(this.won)return;this.hints++;board.reveal(found.position,found.value);AudioService.play('hint');}});}else status.setText('Pas de déduction disponible : vérifie tes derniers coups.');},C.teal);
  const reset=button(this,875,1680,290,'↻ Effacer',()=>{if(!this.won)board.reset();},0xb98597);
  const changed=()=>{
   const filled=board.grid.flat().filter(v=>v!==0).length,total=level.size**2;
   bar.clear().fillStyle(0xded1e8).fillRoundedRect(170,1287,740,12,6).fillStyle(chapter.color).fillRoundedRect(170,1287,740*filled/total,12,6);
   const valid=validateGrid(board.grid,level.constraints);status.setText(valid.valid?`${filled} / ${total} chats bien installés`:'Les cases roses indiquent une règle à vérifier.');
   info.setText(`${board.errors} erreur${board.errors>1?'s':''}  ·  ${this.hints} indice${this.hints>1?'s':''}  ·  Pas de chrono`);
   SaveService.remember(level.id,board.grid,board.errors,this.hints);
   if(isWon(board.grid,level.constraints)&&!this.won){this.won=true;board.locked=true;undo.disableInteractive();hint.disableInteractive();reset.disableInteractive();const stars=this.hints===0&&board.errors===0?3:this.hints<=1&&board.errors<=3?2:1;GameRegistry.result={level,stars,errors:board.errors,hints:this.hints};AudioService.play('victory');void HapticsService.victory();sparkles(this,540,790,24);status.setText('Tout le monde a trouvé sa place !');void SaveService.complete(level.id,stars,board.errors,this.hints).then(()=>{if(this.scene.isActive())this.time.delayedCall(SaveService.data.settings.reducedMotion?100:650,()=>this.scene.start('Victory'));});}
  };board.onChanged=changed;changed();
 }
}
