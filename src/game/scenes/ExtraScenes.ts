import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
export class LostScene extends Phaser.Scene {
 constructor(){super('Lost');}
 create(){cozyBackground(this);title(this,'Chat alors…',390,80);imageContain(this.add.image(540,770,'grey-cat'),340,340);label(this,540,1110,'Trois erreurs. Une nouvelle tentative ?',36);label(this,540,1210,'Tes indices achetés restent disponibles.',30);button(this,540,1430,720,'Recommencer',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.pink);button(this,540,1610,720,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.teal);}
}
export class ShopScene extends Phaser.Scene {
 constructor(){super('Shop');}
 create(){cozyBackground(this);backButton(this,()=>this.scene.start('Home'));title(this,'Le comptoir des croquettes',340,52);panel(this,540,940,920,870);label(this,540,710,`${SaveService.data.kibble} croquettes`,54);label(this,540,980,'Les croquettes se gagnent en terminant\nde nouveaux niveaux.\n\nLa boutique ouvrira plus tard.',36);button(this,540,1570,650,'Retour',()=>this.scene.start('Home'));}
}
