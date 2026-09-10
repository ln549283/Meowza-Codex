import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { fadeIn,imageContain,label,press } from '../ui';
import { C } from '../theme';

export class HomeScene extends Phaser.Scene {
 constructor(){super('Home');}
 create(){
  fadeIn(this);
  this.add.image(540,960,'home-background').setDisplaySize(1080,1920);

  imageContain(this.add.image(540,245,'meowza-logo'),670,260).setDepth(10);
  imageContain(this.add.image(540,925,'duo-home'),700,700).setDepth(9);

  const cta=this.add.container(540,1510).setDepth(20);
  const skin=this.add.image(0,0,'button-primary').setDisplaySize(760,132);
  const text=label(this,0,-2,'Continuer',39,'#21475a');
  cta.add([skin,text]);
  press(this,cta,780,142,()=>{
   if(!SaveService.data.tutorialCompleted){this.scene.start('Rules',{first:true});return;}
   this.scene.start('LevelSelect');
  });

  const tree=this.add.container(380,1690).setDepth(20);
  const treeSkin=this.add.image(0,0,'button-secondary').setDisplaySize(430,105);
  const treeText=label(this,0,-1,'Mon arbre',29,C.ink);
  tree.add([treeSkin,treeText]);
  press(this,tree,440,112,()=>this.scene.start('LevelSelect'));

  const settings=this.add.container(825,1690).setDepth(20);
  const settingsSkin=this.add.image(0,0,'button-square').setDisplaySize(108,108);
  const settingsIcon=imageContain(this.add.image(0,0,'hub-settings'),58,58);
  settings.add([settingsSkin,settingsIcon]);
  press(this,settings,116,116,()=>this.scene.start('Settings'));

  document.getElementById('startup')?.remove();
 }
}
