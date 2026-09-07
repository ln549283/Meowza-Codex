import Phaser from 'phaser';
import { SaveService,type Settings } from '../../services/SaveService';
import { AudioService } from '../../services/AudioService';
import { backButton,cozyBackground,fadeIn,label,panel,press,title } from '../ui';
import { C } from '../theme';
export class SettingsScene extends Phaser.Scene {
 constructor(){super('Settings');}
 create(){fadeIn(this);cozyBackground(this);backButton(this,()=>this.scene.start('Home'));title(this,'Ton petit cocon',155,58);panel(this,540,875,940,1130);
 const options:[keyof Settings,string,string][]=[['music','Musique','Une mélodie douce, composée pour le jeu'],['sounds','Petits sons','Des notes à chaque interaction'],['vibrations','Vibrations','Un retour léger sous les doigts'],['reducedMotion','Animations réduites','Moins de mouvements et de particules']];
 options.forEach(([key,name,description],i)=>{const y=470+i*240;label(this,145,y,name,38).setOrigin(0,.5);label(this,145,y+70,description,25).setOrigin(0,.5);const track=this.add.graphics(),knob=this.add.circle(0,0,32,0xffffff);const holder=this.add.container(850,y,[track,knob]);const draw=()=>{const on=SaveService.data.settings[key];track.clear().fillStyle(on?C.teal:0xbeb1c6).fillRoundedRect(-75,-40,150,80,40);knob.x=on?35:-35;};draw();press(this,holder,170,120,()=>{SaveService.data.settings[key]=!SaveService.data.settings[key];draw();void SaveService.persist();AudioService.syncMusic();});});
 label(this,540,1590,'Ta progression reste sur cet appareil.',30);label(this,540,1660,'Aucun compte, aucune publicité, aucun suivi.',27);label(this,540,1780,'Meowza · 1.2',26);
 }
}
