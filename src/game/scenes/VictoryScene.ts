import Phaser from 'phaser';
import levelsData from '../../data/levels.json';
import type { Level } from '../../core/model';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { button,cozyBackground,fadeIn,float,imageContain,label,panel,sparkles,title } from '../ui';
import { C } from '../theme';
const levels=levelsData as unknown as Level[];

export class VictoryScene extends Phaser.Scene {
 constructor(){super('Victory');}
 create(){
  const result=GameRegistry.result;if(!result){this.scene.start('Home');return;}
  fadeIn(this);cozyBackground(this);panel(this,540,925,900,1370);label(this,540,350,'UN PETIT SOMMET DE PLUS',27);title(this,'Ronronnement mérité !',450,57);
  const grey=imageContain(this.add.image(360,740,'grey-cat'),320,340),orange=imageContain(this.add.image(720,740,'orange-cat'),320,340);float(this,grey);float(this,orange,18);
  label(this,540,1040,result.errors===0?'Parcours parfait !':'Sommet conquis !',44);label(this,540,1125,`${result.errors} erreur${result.errors>1?'s':''} · ${result.hints} indice${result.hints>1?'s':''}`,30);
  label(this,540,1210,SaveService.saveFailed?'Sauvegarde indisponible. Réessaie avant de quitter.':'Les nuages s’écartent. On continue ?',29);
  button(this,540,1390,680,SaveService.saveFailed?'Réessayer la sauvegarde':'Niveau suivant',()=>{
   if(SaveService.saveFailed){void SaveService.persist().then(()=>this.scene.restart());return;}
   const index=levels.findIndex(l=>l.id===result.level.id),next=levels[index+1];
   if(next&&SaveService.isUnlocked(next.id)){GameRegistry.selected=next;this.scene.start('Game');}else this.scene.start('LevelSelect',{reveal:true});
  },C.pink);
  button(this,540,1540,680,'Retour à l’arbre',()=>this.scene.start('LevelSelect',{chapter:result.level.difficulty,reveal:true}),C.teal);sparkles(this,540,960,24);
 }
}
