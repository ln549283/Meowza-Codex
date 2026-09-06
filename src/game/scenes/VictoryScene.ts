import { cosmetics } from '../../core/cosmetics';
import { loadSummit } from '../../services/JourneyService';
import { nextSummit } from '../../core/journey';

import Phaser from 'phaser';
import { GameRegistry } from '../registry';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,float,imageContain,label,panel,sparkles,title } from '../ui';
import { C } from '../theme';
export class VictoryScene extends Phaser.Scene {
 constructor(){super('Victory');}
 create(){const result=GameRegistry.result;if(!result){this.scene.start('Home');return;}fadeIn(this);cozyBackground(this);panel(this,540,925,900,1370);label(this,540,350,'UN PETIT SOMMET DE PLUS',27);title(this,'Ronronnement mérité !',450,57);const grey=imageContain(this.add.image(360,740,'grey-cat'),320,340),orange=imageContain(this.add.image(720,740,'orange-cat'),320,340);float(this,grey);float(this,orange,18);label(this,540,1010,'★'.repeat(result.stars)+'☆'.repeat(3-result.stars),110,'#c89541');label(this,540,1150,SaveService.data.lastUnlock?`Nouveau décor : ${cosmetics.find(c=>c.id===SaveService.data.lastUnlock)?.name}`:result.stars===3?'Trois étoiles, bravo !':'Chaque petit pas compte.',32);label(this,540,1230,SaveService.saveFailed?'Sauvegarde indisponible. Réessaie avant de quitter.':`+${SaveService.data.lastReward} croquettes · Total ${SaveService.data.kibble}`,29);button(this,540,1390,680,SaveService.saveFailed?'Réessayer la sauvegarde':'Niveau suivant',async()=>{if(SaveService.saveFailed){void SaveService.persist().then(()=>this.scene.restart());return;}const n=result.level.id.startsWith('trail-')?Number(result.level.id.split('-')[1])+1:nextSummit(SaveService.data.progress);try{GameRegistry.selected=await loadSummit(n);if(this.scene.isActive()){SaveService.restartAttempt();this.scene.start('Game');}}catch{this.scene.start('LevelSelect');}},C.pink);button(this,540,1540,680,'Rejouer ce sommet',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.teal);button(this,540,1730,680,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.orange);sparkles(this,540,960,12);}
}
