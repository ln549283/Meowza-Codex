import { cosmetics } from '../../core/cosmetics';
import { loadSummit } from '../../services/JourneyService';
import { nextSummit } from '../../core/journey';
import Phaser from 'phaser';
import { GameRegistry } from '../registry';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,label,panel,sparkles,title } from '../ui';
import { C } from '../theme';

export class VictoryScene extends Phaser.Scene {
 constructor(){super('Victory');}
 create(){
  const result=GameRegistry.result;if(!result){this.scene.start('Home');return;}
  fadeIn(this);cozyBackground(this);this.add.circle(540,770,390,0xffefd7,.66);panel(this,540,1010,900,1240);
  label(this,540,330,'UN PETIT SOMMET DE PLUS',27);title(this,'Ronronnement mérité !',425,57);
  const grey=this.add.sprite(350,800,'nimbus-victory',0).setOrigin(.5,.85).setDisplaySize(330,330),orange=this.add.sprite(725,800,'moka-victory',0).setOrigin(.5,.85).setDisplaySize(330,330);grey.play('anim-nimbus-victory');orange.play('anim-moka-victory');
  label(this,540,1040,result.errors===0&&result.hints===0?'Parfaitement logique !':result.errors===0?'Sans une seule erreur !':'Sommet réussi !',42);
  label(this,540,1145,`Erreurs : ${result.errors} · Indices : ${result.hints}`,31);
  label(this,540,1230,SaveService.data.lastUnlock?`Nouveau décor : ${cosmetics.find(c=>c.id===SaveService.data.lastUnlock)?.name}`:SaveService.saveFailed?'Sauvegarde indisponible. Réessaie avant de quitter.':`+${SaveService.data.lastReward} croquettes · Total ${SaveService.data.kibble}`,29);
  button(this,540,1390,680,SaveService.saveFailed?'Réessayer la sauvegarde':'Niveau suivant',async()=>{if(SaveService.saveFailed){void SaveService.persist().then(()=>this.scene.restart());return;}const n=result.level.id.startsWith('trail-')?Number(result.level.id.split('-')[1])+1:nextSummit(SaveService.data.progress);try{GameRegistry.selected=await loadSummit(n);if(this.scene.isActive()){SaveService.restartAttempt();this.scene.start('Game');}}catch{this.scene.start('LevelSelect');}},C.pink);
  button(this,540,1540,680,'Rejouer ce sommet',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.teal);button(this,540,1730,680,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.orange);sparkles(this,540,820,20);
 }
}
