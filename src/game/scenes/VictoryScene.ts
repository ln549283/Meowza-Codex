import { cosmetics } from '../../core/cosmetics';
import { loadSummit } from '../../services/JourneyService';
import { nextSummit } from '../../core/journey';
import Phaser from 'phaser';
import { GameRegistry } from '../registry';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,imageContain,label,panel,sparkles,title } from '../ui';
import { C } from '../theme';

export class VictoryScene extends Phaser.Scene {
 constructor(){super('Victory');}
 create(){
  const result=GameRegistry.result;if(!result){this.scene.start('Home');return;}
  fadeIn(this);cozyBackground(this);
  panel(this,540,980,900,1210);
  title(this,'Bien joué !',385,66);
  label(this,540,455,`Niveau ${Number(result.level.id.split('-')[1])} terminé`,31);
  imageContain(this.add.image(540,760,'duo-victory'),650,500);
  label(this,540,1030,result.errors===0?'Parfait · aucune erreur':result.errors===1?'Très joli parcours · 1 erreur':'Sommet réussi !',38);
  const stars=result.errors===0?3:result.errors===1?2:1;
  imageContain(this.add.image(540,1145,`stars-${stars}`),260,96);
  label(this,540,1245,`Erreurs : ${result.errors} · Indices : ${result.hints}`,27);
  label(this,540,1320,SaveService.data.lastUnlock?`Nouveau décor : ${cosmetics.find(c=>c.id===SaveService.data.lastUnlock)?.name}`:SaveService.saveFailed?'Sauvegarde indisponible. Réessaie avant de quitter.':`+${SaveService.data.lastReward} croquettes`,27);
  button(this,540,1465,680,SaveService.saveFailed?'Réessayer la sauvegarde':'Niveau suivant',async()=>{if(SaveService.saveFailed){void SaveService.persist().then(()=>this.scene.restart());return;}const n=result.level.id.startsWith('trail-')?Number(result.level.id.split('-')[1])+1:nextSummit(SaveService.data.progress);try{GameRegistry.selected=await loadSummit(n);if(this.scene.isActive()){SaveService.restartAttempt();this.scene.start('Game');}}catch{this.scene.start('LevelSelect');}},C.teal);
  button(this,540,1615,680,'Rejouer ce niveau',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.orange);
  button(this,540,1760,680,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.orange);
  sparkles(this,540,790,18);
 }
}
