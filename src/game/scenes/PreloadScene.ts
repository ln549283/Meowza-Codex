import Phaser from 'phaser';
import { C,FONT } from '../theme';
export class PreloadScene extends Phaser.Scene{
 constructor(){super('Preload');}
 preload(){this.cameras.main.setBackgroundColor(C.cream);this.add.text(540,800,'meowza',{fontFamily:FONT,fontSize:'100px',fontStyle:'bold',color:C.ink}).setOrigin(.5);const bar=this.add.graphics();this.add.text(540,1080,'Un petit instant, les chats arrivent…',{fontFamily:FONT,fontSize:'30px',color:C.ink}).setOrigin(.5);this.load.on('progress',(v:number)=>bar.clear().fillStyle(C.pink).fillRoundedRect(220,990,640*v,18,9));this.load.image('tree-bg','assets/backgrounds/cat-tree.webp');this.load.image('grey-cat','assets/cats/nimbus.webp');this.load.image('orange-cat','assets/cats/moka.webp');}
 create(){this.scene.start('Home');}
}
