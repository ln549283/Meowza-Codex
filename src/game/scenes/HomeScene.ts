import levels from '../../data/levels.json';
import type { Level } from '../../core/model';
import { nextSummit } from '../../core/journey';
import { loadSummit } from '../../services/JourneyService';
import { GameRegistry } from '../registry';
import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,imageContain,label,panel,roundButton } from '../ui';
import { C } from '../theme';
export class HomeScene extends Phaser.Scene {
 constructor(){super('Home');}
 create(){fadeIn(this);cozyBackground(this);imageContain(this.add.image(540,365,'logo-v5'),930,370);label(this,540,540,'Deux chats. Mille petits défis.',36);imageContain(this.add.image(540,960,'home-mascots-v4'),850,790);panel(this,540,1590,920,410,0xfffaf7,.96);let busy=false;
 button(this,540,1510,740,'Continuer',async()=>{if(busy)return;busy=true;try{const session=SaveService.data.session;const active=session&&!session.failed&&session.errors<3&&SaveService.isUnlocked(session.id)?session:null;const cached=active?(SaveService.data.journeyLevels[active.id]??(levels as unknown as Level[]).find(l=>l.id===active.id)):undefined;const n=active?.id.startsWith('trail-')?Number(active.id.slice(6)):nextSummit(SaveService.data.progress);GameRegistry.selected=cached??await loadSummit(n);if(SaveService.data.session?.id!==GameRegistry.selected.id||SaveService.data.session.failed||SaveService.data.session.errors>=3)SaveService.restartAttempt();if(this.scene.isActive())this.scene.start('Game');}catch{busy=false;this.scene.start('LevelSelect');}},C.teal);
 button(this,540,1680,740,'Explorer mon arbre',()=>this.scene.start('LevelSelect'),C.orange);
 roundButton(this,420,1840,'?',()=>this.scene.start('Rules'));roundButton(this,660,1840,'☷',()=>this.scene.start('Settings'));document.getElementById('startup')?.remove();
 }
}
