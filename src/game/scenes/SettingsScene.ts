import Phaser from 'phaser';
import { SaveService,type Settings } from '../../services/SaveService';
import { AudioService } from '../../services/AudioService';
import { backButton,button,cozyBackground,fadeIn,label,panel,press,title } from '../ui';
import { C } from '../theme';
export class SettingsScene extends Phaser.Scene {
 constructor(){super('Settings');}
 create(){fadeIn(this);cozyBackground(this);backButton(this,()=>this.scene.start('Home'));title(this,'Ton petit cocon',155,58);panel(this,540,875,940,1130);
 const options:[keyof Settings,string,string][]=[['music','Musique','Une mélodie douce, composée pour le jeu'],['sounds','Petits sons','Des notes à chaque interaction'],['vibrations','Vibrations','Un retour léger sous les doigts'],['reducedMotion','Animations réduites','Moins de mouvements et de particules']];
 options.forEach(([key,name,description],i)=>{const y=430+i*205;label(this,145,y,name,38).setOrigin(0,.5);label(this,145,y+62,description,25).setOrigin(0,.5);const track=this.add.graphics(),knob=this.add.circle(0,0,32,0xffffff);const holder=this.add.container(850,y,[track,knob]);const draw=()=>{const on=SaveService.data.settings[key];track.clear().fillStyle(on?C.teal:0xbeb1c6).fillRoundedRect(-75,-40,150,80,40);knob.x=on?35:-35;};draw();press(this,holder,170,120,()=>{SaveService.data.settings[key]=!SaveService.data.settings[key];draw();void SaveService.persist();AudioService.syncMusic();});});
 button(this,540,1390,650,'Nouvelle partie',()=>{
  const shade=this.add.rectangle(540,960,1080,1920,0x453c51,.72).setDepth(300).setInteractive();const card=panel(this,540,930,900,650).setDepth(301);const heading=label(this,540,720,'Recommencer de zéro ?',47).setDepth(302);const detail=label(this,540,900,'Toute ta progression, tes croquettes, tes indices\net tes personnalisations seront réinitialisés.\nCette action est définitive.',30).setDepth(302);
  const cancel=button(this,540,1090,660,'Garder ma partie',()=>{[shade,card,heading,detail,cancel,confirm].forEach(o=>o.destroy());},C.teal).setDepth(302);const confirm=button(this,540,1250,660,'Oui, nouvelle partie',()=>{void SaveService.newGame().then(()=>{AudioService.syncMusic();this.scene.start('Home');});},0xb398a5).setDepth(302);
 },0xb398a5);
 label(this,540,1540,'Ta progression reste sur cet appareil.',30);label(this,540,1610,'Aucun compte, aucune publicité, aucun suivi.',27);label(this,540,1740,'Meowza · 1.3',26);
 }
}
