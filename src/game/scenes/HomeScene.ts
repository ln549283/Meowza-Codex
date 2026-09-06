import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { button,fadeIn,float,imageContain,label,panel,roundButton } from '../ui';
import { C } from '../theme';
export class HomeScene extends Phaser.Scene {
 constructor(){super('Home');}
 create(){fadeIn(this);this.add.image(540,960,'tree-bg').setDisplaySize(1080,1920);label(this,540,155,'UN PETIT DÉFI. BEAUCOUP DE DOUCEUR.',26);label(this,540,300,'meowza',142);label(this,540,420,'La tête dans les nuages',37);panel(this,540,925,740,625,0xfffaf7,.8);const grey=imageContain(this.add.image(375,825,'grey-cat'),325,330),orange=imageContain(this.add.image(705,935,'orange-cat'),330,340);grey.setAngle(-8);orange.setAngle(8);float(this,grey);float(this,orange,18);label(this,540,1140,'Deux chats. Un équilibre parfait.',32);button(this,540,1360,700,SaveService.data.stats.levelsCompleted?'Continuer mon ascension':'Grimper dans l’arbre',()=>{this.scene.start(SaveService.data.tutorialCompleted?'LevelSelect':'Rules',{first:true});},C.pink);label(this,540,1470,`${SaveService.data.stats.levelsCompleted} / 110 petits sommets conquis`,28);roundButton(this,410,1600,'?',()=>this.scene.start('Rules'));roundButton(this,670,1600,'☷',()=>this.scene.start('Settings'));label(this,410,1690,'Les règles',25);label(this,670,1690,'Préférences',25);label(this,540,1820,'À ton rythme, une patte après l’autre.',27);}
}
