import Phaser from 'phaser';
import { C,FONT } from '../theme';
export class PreloadScene extends Phaser.Scene{
 constructor(){super('Preload');}
 preload(){this.cameras.main.setBackgroundColor(C.cream);this.add.text(540,800,'meowza',{fontFamily:FONT,fontSize:'100px',fontStyle:'bold',color:C.ink}).setOrigin(.5);const bar=this.add.graphics();this.add.text(540,1080,'Un petit instant, les chats arrivent…',{fontFamily:FONT,fontSize:'30px',color:C.ink}).setOrigin(.5);this.load.on('progress',(v:number)=>bar.clear().fillStyle(C.pink).fillRoundedRect(220,990,640*v,18,9));this.load.image('home-mascots-v4','assets/home-mascots-v4.webp');this.load.image('atlas-v3','assets/atlas-v3.webp');this.load.image('grey-cat','assets/cats/nimbus.webp');this.load.image('orange-cat','assets/cats/moka.webp');}
 create(){const t=this.textures.get('atlas-v3');['easy','medium','hard','extreme'].forEach((key,i)=>t.add(key,0,i*313,260,313,360));['platform','house','hammock','bridge'].forEach((key,i)=>t.add(key,0,i*313,630,313,400));this.scene.start('Home');}
}
