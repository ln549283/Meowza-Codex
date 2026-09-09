import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { fadeIn,label,press } from '../ui';
import { C } from '../theme';

export class HomeScene extends Phaser.Scene {
 constructor(){super('Home');}
 create(){
  fadeIn(this);
  this.cameras.main.setBackgroundColor('#f7ead9');
  // The V2 accueil artwork is authored at almost exactly the game's 9:16 ratio.
  this.add.image(540,960,'home-art-v2').setDisplaySize(1080,1920);

  const cta=this.add.container(540,1604).setDepth(20);
  const shadow=this.add.graphics().fillStyle(0x6b493c,.18).fillRoundedRect(-382,-48,764,116,54);
  const skin=this.add.image(0,-8,'button-primary').setDisplaySize(760,116);
  const text=label(this,0,-10,'Continuer',36,'#ffffff');
  cta.add([shadow,skin,text]);
  press(this,cta,780,132,()=>{
   if(!SaveService.data.tutorialCompleted){this.scene.start('Rules',{first:true});return;}
   this.scene.start('LevelSelect');
  });

  const tree=this.add.container(410,1768).setDepth(20),treeSkin=this.add.image(0,0,'button-secondary').setDisplaySize(330,98),treeIcon=this.add.image(-106,0,'hub-locate').setDisplaySize(54,54),treeText=label(this,35,-1,'Mon arbre',27,C.ink);tree.add([treeSkin,treeIcon,treeText]);press(this,tree,340,108,()=>this.scene.start('LevelSelect'));
  const settings=this.add.container(870,1768).setDepth(20),settingsSkin=this.add.image(0,0,'button-square').setDisplaySize(100,100),settingsIcon=this.add.image(0,0,'hub-settings').setDisplaySize(60,60);settings.add([settingsSkin,settingsIcon]);press(this,settings,108,108,()=>this.scene.start('Settings'));

  document.getElementById('startup')?.remove();
 }
}
