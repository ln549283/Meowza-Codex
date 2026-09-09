import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,imageContain,label,panel,roundButton } from '../ui';
import { C } from '../theme';
export class HomeScene extends Phaser.Scene {
 constructor(){super('Home');}
 create(){fadeIn(this);cozyBackground(this);imageContain(this.add.image(540,365,'logo-v5'),930,370);label(this,540,540,'Deux chats. Mille petits défis.',36);imageContain(this.add.image(540,960,'home-mascots-v4'),850,790);panel(this,540,1590,920,410,0xfffaf7,.96);
 button(this,540,1550,740,'Continuer',()=>{if(!SaveService.data.tutorialCompleted){this.scene.start('Rules',{first:true});return;}this.scene.start('LevelSelect');},C.teal);
 roundButton(this,420,1770,'?',()=>this.scene.start('Rules'));roundButton(this,660,1770,'☷',()=>this.scene.start('Settings'));document.getElementById('startup')?.remove();
 }
}
