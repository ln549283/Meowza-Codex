import { drawAttemptHeart } from '../AttemptHeart';
import { GameRegistry } from '../registry';
import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
export class LostScene extends Phaser.Scene {
 constructor(){super('Lost');}
 create({reason='errors'}:{reason?:string}={}){
  cozyBackground(this);panel(this,540,820,950,1190,0xfffaf5);
  title(this,'Chat alors…',315,72);
  drawAttemptHeart(this.add.graphics(),540,450,3,.65);
  imageContain(this.add.image(540,840,'retry-mascots-v6'),650,650);
  label(this,540,1230,reason==='time'?'Le temps est écoulé.':'Trois erreurs, mais tu progresses.',35);
  label(this,540,1305,'On reprend ensemble ?',34);
  button(this,540,1490,760,'Recommencer · gratuit',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.teal);
  button(this,540,1640,720,'Retour à mon arbre',()=>this.scene.start('LevelSelect'),0xb398a5);
  if(GameRegistry.selected?.timed&&(SaveService.data.failures[GameRegistry.selected.id]??0)>=3){
   button(this,540,1800,760,'Réessayer · temps +50 % offert',()=>{const l=GameRegistry.selected!;SaveService.restartAttempt();SaveService.remember(l.id,l.initial,0,0,(l.timeLimit??360)*1.5,false);this.scene.start('Game');},C.orange);
  }else label(this,540,1800,'Même grille · 3 indices disponibles',27);
 }

}
export class ShopScene extends Phaser.Scene {
 constructor(){super('Shop');}
 create(){cozyBackground(this);backButton(this,()=>this.scene.start('Home'));title(this,'Le comptoir des croquettes',340,52);panel(this,540,940,920,870);label(this,540,710,`${SaveService.data.kibble} croquettes`,54);label(this,540,980,'Les croquettes se gagnent en terminant\nde nouveaux niveaux.\n\nLa boutique ouvrira plus tard.',36);button(this,540,1570,650,'Retour',()=>this.scene.start('Home'));}
}
