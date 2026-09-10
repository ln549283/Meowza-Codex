import { cosmetics } from '../../core/cosmetics';
import { loadSummit } from '../../services/JourneyService';
import { nextSummit } from '../../core/journey';
import Phaser from 'phaser';
import { GameRegistry } from '../registry';
import { SaveService } from '../../services/SaveService';
import { playCatOnce,playFx } from '../motion';
import { button,cozyBackground,fadeIn,label,panel,title } from '../ui';
import { C } from '../theme';

export class VictoryScene extends Phaser.Scene {
 constructor(){super('Victory');}
 create(){
  const result=GameRegistry.result;if(!result){this.scene.start('Home');return;}
  fadeIn(this);cozyBackground(this);
  panel(this,540,980,900,1210);
  title(this,'Bien joué !',385,66);
  label(this,540,455,`Niveau ${Number(result.level.id.split('-')[1])} terminé`,31);

  playCatOnce(this,'nimbus','victory',390,860,330,30);
  playCatOnce(this,'moka','victory',690,860,330,30,120);
  playFx(this,'etincelles',540,770,340,40);

  label(this,540,1050,result.errors===0?'Parfait · aucune erreur':result.errors===1?'Très joli parcours · 1 erreur':'Sommet réussi !',38);
  label(this,540,1145,`Erreurs : ${result.errors} · Indices : ${result.hints}`,27);
  const reward=SaveService.data.lastUnlock?`Nouveau décor : ${cosmetics.find(c=>c.id===SaveService.data.lastUnlock)?.name}`:SaveService.saveFailed?'Sauvegarde indisponible. Réessaie avant de quitter.':`+${SaveService.data.lastReward} croquettes`;
  label(this,540,1245,reward,29);
  if(SaveService.data.lastUnlock)playFx(this,'objet_debloque',540,1280,180,45);else if(SaveService.data.lastReward>0)playFx(this,'croquettes_gain',540,1280,180,45);

  button(this,540,1465,680,SaveService.saveFailed?'Réessayer la sauvegarde':'Niveau suivant',async()=>{if(SaveService.saveFailed){void SaveService.persist().then(()=>this.scene.restart());return;}const n=result.level.id.startsWith('trail-')?Number(result.level.id.split('-')[1])+1:nextSummit(SaveService.data.progress);try{GameRegistry.selected=await loadSummit(n);if(this.scene.isActive()){SaveService.restartAttempt();this.scene.start('Game');}}catch{this.scene.start('LevelSelect');}},C.teal);
  button(this,540,1615,680,'Rejouer ce niveau',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.orange);
  button(this,540,1760,680,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.orange);
 }
}
