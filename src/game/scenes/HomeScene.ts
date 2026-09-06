import { nextSummit } from '../../core/journey';
import { loadSummit } from '../../services/JourneyService';
import { GameRegistry } from '../registry';
import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,imageContain,label,panel,roundButton } from '../ui';
import { C } from '../theme';
export class HomeScene extends Phaser.Scene {
 constructor(){super('Home');}
 create(){fadeIn(this);cozyBackground(this);label(this,540,390,'Meowza',150,'#f2a343').setStroke('#754858',12).setShadow(0,10,'#d6bca5',0,true,true);label(this,540,540,'Deux chats. Mille petits défis.',36);imageContain(this.add.image(540,960,'home-mascots-v4'),850,790);panel(this,540,1590,920,410,0xfffaf7,.96);let busy=false;
 button(this,540,1510,740,'Continuer',async()=>{if(busy)return;if(!SaveService.data.tutorialCompleted){this.scene.start('Rules',{first:true});return;}busy=true;try{const n=nextSummit(SaveService.data.progress);GameRegistry.selected=await loadSummit(n);if(SaveService.data.session?.id!==GameRegistry.selected.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();if(this.scene.isActive())this.scene.start('Game');}catch{busy=false;this.scene.start('LevelSelect');}},C.teal);
 button(this,540,1680,740,'Explorer mon arbre',()=>this.scene.start('LevelSelect'),C.orange);
 roundButton(this,420,1840,'?',()=>this.scene.start('Rules'));roundButton(this,660,1840,'☷',()=>this.scene.start('Settings'));document.getElementById('startup')?.remove();
 }
}
