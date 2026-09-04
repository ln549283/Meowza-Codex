import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { button,fadeIn,imageContain } from '../ui';
import { C } from '../theme';
export class HomeScene extends Phaser.Scene {
  constructor(){super('Home');}
  create(){
    fadeIn(this);this.cameras.main.setBackgroundColor(C.cream);
    this.add.image(540,960,'home').setDisplaySize(1080,1920).setAlpha(.88);
    this.add.rectangle(540,960,1080,1920,0xfff4e8,.15).setBlendMode(Phaser.BlendModes.SCREEN);
    imageContain(this.add.image(540,345,'logo'),720,330);
    const grey=imageContain(this.add.image(360,970,'grey-cat'),310,390);
    const orange=imageContain(this.add.image(720,970,'orange-cat'),310,390);
    this.tweens.add({targets:[grey,orange],y:'-=18',duration:1700,yoyo:true,repeat:-1,ease:'Sine.InOut',delay:220});
    button(this,540,1390,560,'🐾  Jouer',()=>{if(!SaveService.data.tutorialCompleted)this.scene.start('Rules',{first:true});else this.scene.start('LevelSelect');});
    button(this,390,1525,300,'⚙ Paramètres',()=>this.scene.start('Settings'),0xd99c6d);
    button(this,690,1525,240,'?  Règles',()=>this.scene.start('Rules'),0x28a9c7);
    this.add.text(540,1810,'Un puzzle doux pour les esprits affûtés',{fontFamily:'Arial',fontSize:'26px',color:'#6f5a62'}).setOrigin(.5);
  }
}
