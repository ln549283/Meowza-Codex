import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { fadeIn,label,press } from '../ui';

export class HomeScene extends Phaser.Scene {
 constructor(){super('Home');}
 create(){
  fadeIn(this);
  // The welcome artwork already contains the logo and both cats: never overlay them here.
  this.add.image(540,960,'home-background').setDisplaySize(1080,1920);

  const cta=this.add.container(540,1510).setDepth(20);
  const skin=this.add.image(0,0,'button-primary').setDisplaySize(760,132);
  const text=label(this,0,-2,'Continuer',39,'#21475a');
  cta.add([skin,text]);
  press(this,cta,780,142,()=>{
   if(!SaveService.data.tutorialCompleted){this.scene.start('Rules',{first:true});return;}
   this.scene.start('LevelSelect');
  });

  const settings=this.add.container(540,1695).setDepth(20);
  const settingsSkin=this.add.image(0,0,'button-square').setDisplaySize(100,100);
  const settingsIcon=this.add.image(0,0,'hub-settings').setDisplaySize(54,54);
  settings.add([settingsSkin,settingsIcon]);
  press(this,settings,110,110,()=>this.scene.start('Settings'));

  document.getElementById('startup')?.remove();
 }
}
