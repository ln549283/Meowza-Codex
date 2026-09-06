import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
export class RulesScene extends Phaser.Scene {
 constructor(){super('Rules');}
 create(data:{first?:boolean;fromGame?:boolean}={}){
  this.registry.set('rulesFromGame',Boolean(data.fromGame));fadeIn(this);cozyBackground(this);title(this,data.first?'Bienvenue, petite patte !':'L’équilibre des chats',155,56);
  panel(this,540,875,940,1240);
  imageContain(this.add.image(385,430,'grey-cat'),205,210);imageContain(this.add.image(695,430,'orange-cat'),205,210);
  label(this,540,610,'1 · Choisis la bonne famille',38);label(this,540,685,'Choisis Nimbus ou Moka, puis touche une case.',29);
  label(this,540,840,'2 · Un équilibre parfait',38);label(this,540,930,'Autant de gris que de roux\ndans chaque ligne ET chaque colonne.',31);
  label(this,540,1080,'3 · Jamais trois à la suite',38);label(this,540,1150,'Ni horizontalement, ni verticalement.',30);
  label(this,540,1315,'=  Même famille       ×  Familles différentes',31);
  label(this,540,1410,'Retouche le même chat pour vider sa case.',25);
  button(this,540,1630,730,data.first?'Mon premier sommet':data.fromGame?'Reprendre ma partie':'Retour à l’accueil',()=>{
   if(data.first){SaveService.data.tutorialCompleted=true;void SaveService.persist();this.scene.start('LevelSelect');}
   else if(data.fromGame){this.scene.stop();this.scene.resume('Game');}else this.scene.start('Home');
  },C.pink);label(this,540,1775,'Pas de chronomètre. Prends ton temps.',29);
 }
}
