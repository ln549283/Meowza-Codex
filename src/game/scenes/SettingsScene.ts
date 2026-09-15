import Phaser from 'phaser';
import { SaveService,type Settings } from '../../services/SaveService';
import { AudioService } from '../../services/AudioService';
import { backButton,button,fadeIn,imageContain,label,panel,press,title } from '../ui';
import { C } from '../theme';

export class SettingsScene extends Phaser.Scene {
 constructor(){super('Settings');}
 create(){
  fadeIn(this);this.cameras.main.setBackgroundColor(0xfff7ef);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Paramètres',105,56);label(this,540,160,'Ajuste le jeu à ton rythme',24,'#78647d',18);
  const options:[keyof Settings,string,string][]=[['music','Musique','Une mélodie douce, composée pour le jeu'],['sounds','Petits sons','Des notes à chaque interaction'],['vibrations','Vibrations','Un retour léger sous les doigts'],['reducedMotion','Animations réduites','Moins de mouvements et de particules']];
  options.forEach(([key,name,description],i)=>{
   const y=340+i*160;panel(this,540,y,900,142);label(this,205,y-18,name,29,C.ink,20).setOrigin(0,.5);label(this,205,y+25,description,19,'#78647d',16).setOrigin(0,.5);
   const track=this.add.graphics(),knob=this.add.circle(0,0,27,0xffffff),holder=this.add.container(810,y,[track,knob]);
   const draw=()=>{const on=SaveService.data.settings[key];track.clear().fillStyle(on?C.teal:0xcfc2cc).fillRoundedRect(-66,-32,132,64,32);knob.x=on?31:-31;};draw();press(this,holder,156,94,()=>{SaveService.data.settings[key]=!SaveService.data.settings[key];draw();void SaveService.persist();AudioService.syncMusic();});
  });

  panel(this,540,1050,880,240);
  imageContain(this.add.image(205,1040,'ui-hint'),85,85);
  label(this,330,990,'Besoin d’un rappel ?',32).setOrigin(0,.5);
  label(this,330,1045,'Les règles et les exemples restent à portée de patte.',22,'#78647d').setOrigin(0,.5).setWordWrapWidth(550);
  button(this,540,1240,620,'Revoir les règles',()=>this.scene.start('Rules'),C.orange);
  if(import.meta.env.DEV){button(this,540,1390,620,'Test : avancer de 10 niveaux',()=>{void SaveService.skipTestLevels(10).then(()=>this.scene.start('LevelSelect'));});}
  button(this,540,1620,560,'Nouvelle partie',()=>{
   const shade=this.add.rectangle(540,960,1080,1920,0x453c51,.72).setDepth(300).setInteractive(),card=panel(this,540,930,820,650).setDepth(301),heading=label(this,540,720,'Recommencer de zéro ?',47).setDepth(302),detail=label(this,540,900,'Toute ta progression, tes croquettes, tes diamants\net tes personnalisations seront réinitialisés.\nCette action est définitive.',30).setDepth(302);
   const cancel=button(this,540,1090,580,'Garder ma partie',()=>{[shade,card,heading,detail,cancel,confirm].forEach(o=>o.destroy());},C.teal).setDepth(302),confirm=button(this,540,1250,580,'Oui, nouvelle partie',()=>{void SaveService.newGame().then(()=>{AudioService.syncMusic();this.scene.start('Home');});},0xb398a5).setDepth(302);
  },0xb398a5);
  label(this,540,1480,'Ta progression reste sur cet appareil.',22,'#78647d',18);label(this,540,1760,'Meowza · Un bonheur à chaque niveau',21,'#95869e',16);
 }
}
