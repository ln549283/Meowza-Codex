import { chapters } from '../../core/progression';
import Phaser from 'phaser';
import { GameRegistry } from '../registry';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,float,imageContain,label,panel,sparkles,title } from '../ui';
import { C } from '../theme';
export class VictoryScene extends Phaser.Scene {
 constructor(){super('Victory');}
 create(){const result=GameRegistry.result;if(!result){this.scene.start('Home');return;}fadeIn(this);cozyBackground(this);panel(this,540,925,900,1370);label(this,540,350,'UN PETIT SOMMET DE PLUS',27);title(this,'Ronronnement mérité !',450,57);const grey=imageContain(this.add.image(360,740,'grey-cat'),320,340),orange=imageContain(this.add.image(720,740,'orange-cat'),320,340);float(this,grey);float(this,orange,18);label(this,540,1010,'★'.repeat(result.stars)+'☆'.repeat(3-result.stars),110,'#c89541');label(this,540,1150,result.stars===3?'Trois étoiles, quelle patte !':'Chaque petit pas compte.',36);label(this,540,1230,SaveService.saveFailed?'Sauvegarde indisponible. Réessaie avant de quitter.':'Les nuages s’écartent. On continue ?',29);button(this,540,1390,680,SaveService.saveFailed?'Réessayer la sauvegarde':'Découvrir la suite',()=>{if(SaveService.saveFailed){void SaveService.persist().then(()=>this.scene.restart());return;}const index=chapters.findIndex(c=>c.id===result.level.difficulty),chapter=chapters[index]!,next=chapters[index+1];const advance=Number(result.level.id.split('-')[1])===chapter.count&&next&&SaveService.isUnlocked(`${next.id}-01`);this.scene.start('LevelSelect',{chapter:advance?next.id:chapter.id,reveal:true});},C.pink);button(this,540,1540,680,'Rejouer ce sommet',()=>this.scene.start('Game'),C.teal);sparkles(this,540,960,24);}
}
