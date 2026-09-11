import Phaser from 'phaser';
import { SaveService,type Settings } from '../../services/SaveService';
import { AudioService } from '../../services/AudioService';
import { backButton,button,fadeIn,imageContain,label,panel,press,title } from '../ui';
import { C } from '../theme';

export class SettingsScene extends Phaser.Scene {
 constructor(){super('Settings');}
 create(){
  fadeIn(this);this.cameras.main.setBackgroundColor(0xfff7ef);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Paramètres',125,58);label(this,540,190,'Ajuste le jeu à ton rythme',25,'#78647d',18);
  const options:[keyof Settings,string,string][]=[['music','Musique','Une mélodie douce, composée pour le jeu'],['sounds','Petits sons','Des notes à chaque interaction'],['vibrations','Vibrations','Un retour léger sous les doigts'],['reducedMotion','Animations réduites','Moins de mouvements et de particules']];
  options.forEach(([key,name,description],i)=>{
   const y=340+i*190;panel(this,540,y,970,158);label(this,145,y-22,name,30,C.ink,20).setOrigin(0,.5);label(this,145,y+30,description,20,'#78647d',16).setOrigin(0,.5);
   const track=this.add.graphics(),knob=this.add.circle(0,0,28,0xffffff),holder=this.add.container(865,y,[track,knob]);
   const draw=()=>{const on=SaveService.data.settings[key];track.clear().fillStyle(on?C.teal:0xcfc2cc).fillRoundedRect(-68,-34,136,68,34);knob.x=on?32:-32;};draw();press(this,holder,160,100,()=>{SaveService.data.settings[key]=!SaveService.data.settings[key];draw();void SaveService.persist();AudioService.syncMusic();});
  });

  label(this,110,1120,'Outils de test',34,C.ink,20).setOrigin(0,.5);label(this,110,1164,'Pour tester rapidement l’économie et la progression.',20,'#78647d',16).setOrigin(0,.5);
  const testButton=(x:number,key:string,text:string,onClick:()=>void)=>{const c=this.add.container(x,1285),skin=this.add.image(0,0,'button-primary').setDisplaySize(300,112),icon=imageContain(this.add.image(-94,0,key),52,52),txt=label(this,28,0,text,24,'#ffffff',18);c.add([skin,icon,txt]);return press(this,c,300,112,onClick);};
  testButton(190,'hub-kibble','+1000',()=>{SaveService.addTestKibble(1000);this.scene.restart();});
  testButton(540,'hub-diamond','+500',()=>{SaveService.addTestDiamonds(500);this.scene.restart();});
  testButton(890,'star-full','Skip +10',()=>{void SaveService.skipTestLevels(10).then(()=>this.scene.start('LevelSelect'));});
  const status=this.add.container(540,1405),statusSkin=this.add.image(0,0,'button-secondary').setDisplaySize(930,100),k=imageContain(this.add.image(-350,0,'hub-kibble'),48,48),d=imageContain(this.add.image(-40,0,'hub-diamond'),48,48),s=imageContain(this.add.image(270,0,'star-full'),48,48);status.add([statusSkin,k,label(this,-285,0,String(SaveService.data.kibble),25,C.ink,18),d,label(this,25,0,String(SaveService.data.missions.diamonds),25,C.ink,18),s,label(this,335,0,`Niv. ${SaveService.trailCompletedCount()+1}`,25,C.ink,18)]);

  button(this,540,1550,650,'Nouvelle partie',()=>{
   const shade=this.add.rectangle(540,960,1080,1920,0x453c51,.72).setDepth(300).setInteractive(),card=panel(this,540,930,900,650).setDepth(301),heading=label(this,540,720,'Recommencer de zéro ?',47).setDepth(302),detail=label(this,540,900,'Toute ta progression, tes croquettes, tes diamants\net tes personnalisations seront réinitialisés.\nCette action est définitive.',30).setDepth(302);
   const cancel=button(this,540,1090,660,'Garder ma partie',()=>{[shade,card,heading,detail,cancel,confirm].forEach(o=>o.destroy());},C.teal).setDepth(302),confirm=button(this,540,1250,660,'Oui, nouvelle partie',()=>{void SaveService.newGame().then(()=>{AudioService.syncMusic();this.scene.start('Home');});},0xb398a5).setDepth(302);
  },0xb398a5);
  label(this,540,1695,'Ta progression reste sur cet appareil.',23,'#78647d',18);label(this,540,1760,'Meowza · 1.3',22,'#95869e',16);
 }
}
