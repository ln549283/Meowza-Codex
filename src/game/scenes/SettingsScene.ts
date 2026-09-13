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
   const y=270+i*156;panel(this,540,y,820,132);label(this,205,y-18,name,29,C.ink,20).setOrigin(0,.5);label(this,205,y+25,description,19,'#78647d',16).setOrigin(0,.5);
   const track=this.add.graphics(),knob=this.add.circle(0,0,27,0xffffff),holder=this.add.container(810,y,[track,knob]);
   const draw=()=>{const on=SaveService.data.settings[key];track.clear().fillStyle(on?C.teal:0xcfc2cc).fillRoundedRect(-66,-32,132,64,32);knob.x=on?31:-31;};draw();press(this,holder,156,94,()=>{SaveService.data.settings[key]=!SaveService.data.settings[key];draw();void SaveService.persist();AudioService.syncMusic();});
  });

  label(this,170,900,'Outils de test',32,C.ink,20).setOrigin(0,.5);label(this,170,940,'Pour tester rapidement l’économie et la progression.',19,'#78647d',16).setOrigin(0,.5);
  const testButton=(x:number,key:string,text:string,onClick:()=>void)=>{const c=this.add.container(x,1045),skin=this.add.image(0,0,'button-primary').setDisplaySize(235,96),icon=imageContain(this.add.image(-68,0,key),42,42),txt=label(this,20,0,text,21,'#ffffff',18);c.add([skin,icon,txt]);return press(this,c,235,96,onClick);};
  testButton(205,'hub-kibble','+1000',()=>{SaveService.addTestKibble(1000);this.scene.restart();});
  testButton(540,'hub-diamond','+500',()=>{SaveService.addTestDiamonds(500);this.scene.restart();});
  testButton(875,'star-full','Skip +10',()=>{void SaveService.skipTestLevels(10).then(()=>this.scene.start('LevelSelect'));});
  const status=this.add.container(540,1165),statusSkin=this.add.image(0,0,'button-secondary').setDisplaySize(820,92),k=imageContain(this.add.image(-300,0,'hub-kibble'),44,44),d=imageContain(this.add.image(-25,0,'hub-diamond'),44,44),s=imageContain(this.add.image(250,0,'star-full'),44,44);status.add([statusSkin,k,label(this,-240,0,String(SaveService.data.kibble),23,C.ink,18),d,label(this,35,0,String(SaveService.data.missions.diamonds),23,C.ink,18),s,label(this,310,0,`Niv. ${SaveService.trailCompletedCount()+1}`,23,C.ink,18)]);

  button(this,540,1325,560,'Nouvelle partie',()=>{
   const shade=this.add.rectangle(540,960,1080,1920,0x453c51,.72).setDepth(300).setInteractive(),card=panel(this,540,930,820,650).setDepth(301),heading=label(this,540,720,'Recommencer de zéro ?',47).setDepth(302),detail=label(this,540,900,'Toute ta progression, tes croquettes, tes diamants\net tes personnalisations seront réinitialisés.\nCette action est définitive.',30).setDepth(302);
   const cancel=button(this,540,1090,580,'Garder ma partie',()=>{[shade,card,heading,detail,cancel,confirm].forEach(o=>o.destroy());},C.teal).setDepth(302),confirm=button(this,540,1250,580,'Oui, nouvelle partie',()=>{void SaveService.newGame().then(()=>{AudioService.syncMusic();this.scene.start('Home');});},0xb398a5).setDepth(302);
  },0xb398a5);
  label(this,540,1485,'Ta progression reste sur cet appareil.',22,'#78647d',18);label(this,540,1545,'Meowza · 1.3',21,'#95869e',16);
 }
}
