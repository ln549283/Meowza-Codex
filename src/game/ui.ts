import Phaser from 'phaser';
import { cosmetics } from '../core/cosmetics';
import { C,FONT } from './theme';
import { AudioService } from '../services/AudioService';
import { SaveService } from '../services/SaveService';

export function label(scene:Phaser.Scene,x:number,y:number,text:string,size=32,color=C.ink,minimum=22){return scene.add.text(x,y,text,{fontFamily:FONT,fontSize:`${Math.max(minimum,size)}px`,fontStyle:'bold',color,align:'center',wordWrap:{width:980},lineSpacing:5,stroke:'#fff7ee',strokeThickness:size>=42?2:0}).setOrigin(.5);}

export function cozyBackground(scene:Phaser.Scene){
 scene.cameras.main.setBackgroundColor(C.cream);
 const theme=cosmetics.find(c=>c.id===SaveService.data.equipped.background);
 const key=theme?.id==='night'?'background-night':theme?.id==='mint'?'background-serre':'room-background';
 if(scene.textures.exists(key))scene.add.image(540,960,key).setDisplaySize(1080,1920).setDepth(-50);
 if(scene.scene.key==='Game'||scene.scene.key==='Hint'||scene.scene.key==='Rules')scene.add.rectangle(540,960,1080,1920,0xfff8ef,.42).setDepth(-49);
}

export function title(scene:Phaser.Scene,text:string,y:number,size=64){return label(scene,540,y,text,size);}
export function panel(scene:Phaser.Scene,x:number,y:number,w:number,h:number,_fill=C.panel,alpha=.98){return scene.add.image(x,y,'puzzle-panel').setDisplaySize(w,h).setAlpha(alpha);}

export function press(scene:Phaser.Scene,c:Phaser.GameObjects.Container,w:number,h:number,onClick:()=>void){
 c.setSize(w,h).setInteractive({useHandCursor:true});
 c.on('pointerdown',()=>{c.setScale(.97);c.setAlpha(.94);});
 c.on('pointerout',()=>{c.setScale(1);c.setAlpha(1);});
 c.on('pointerup',(p:Phaser.Input.Pointer)=>{c.setScale(1);c.setAlpha(1);if(p.getDistance()>32||scene.registry.get('mapDragging'))return;AudioService.play('button');onClick();});
 return c;
}

export function button(scene:Phaser.Scene,x:number,y:number,w:number,text:string,onClick:()=>void,color=C.teal){
 const primary=color===C.teal||color===C.pink;
 const c=scene.add.container(x,y),skin=scene.add.image(0,0,primary?'button-primary':'button-secondary').setDisplaySize(w,116);
 c.add([skin,label(scene,0,-1,text,32,primary?'#24445a':C.ink)]);
 return press(scene,c,w,116,onClick);
}

export function roundButton(scene:Phaser.Scene,x:number,y:number,text:string,onClick:()=>void,_color=0xfff9f2){const c=scene.add.container(x,y),skin=scene.add.image(0,0,'button-square').setDisplaySize(116,116);c.add([skin,label(scene,0,-3,text,42)]);return press(scene,c,116,116,onClick);}
export function backButton(scene:Phaser.Scene,onClick:()=>void){const c=scene.add.container(82,94).setDepth(120),skin=scene.add.image(0,0,'button-square').setDisplaySize(104,104),icon=imageContain(scene.add.image(0,0,'ui-back'),50,50);c.add([skin,icon]);return press(scene,c,110,110,onClick);}
export function catBadge(scene:Phaser.Scene,x:number,y:number,w:number,text:string,color:number){const c=scene.add.container(x,y);const g=scene.add.graphics().fillStyle(color,.14).fillRoundedRect(-w/2,-28,w,56,28);c.add([g,label(scene,0,0,text,29)]);return c;}
export function imageContain(image:Phaser.GameObjects.Image,maxW:number,maxH:number){return image.setScale(Math.min(maxW/image.width,maxH/image.height));}
export function imageCover(image:Phaser.GameObjects.Image,w:number,h:number){return image.setScale(Math.max(w/image.width,h/image.height));}
export function fadeIn(scene:Phaser.Scene){if(!SaveService.data.settings.reducedMotion)scene.cameras.main.fadeIn(220,255,246,238);}
export function float(scene:Phaser.Scene,target:Phaser.GameObjects.Image|Phaser.GameObjects.Container,amount=12){if(!SaveService.data.settings.reducedMotion)scene.tweens.add({targets:target,y:`-=${amount}`,duration:1500,yoyo:true,repeat:0,ease:'Sine.InOut'});}
export function sparkles(scene:Phaser.Scene,x:number,y:number,count=12){if(SaveService.data.settings.reducedMotion)return;for(let i=0;i<count;i++){const a=i/count*Math.PI*2;const p=scene.add.image(x,y,'ui-confetti').setDisplaySize(34,34).setDepth(150).setAngle(i*37);scene.tweens.add({targets:p,x:x+Math.cos(a)*190,y:y+Math.sin(a)*190,alpha:0,scale:.4,angle:p.angle+100,duration:700,onComplete:()=>p.destroy()});}}
export function cloud(scene:Phaser.Scene,x:number,y:number,w:number){return imageContain(scene.add.image(x,y,'tree-cloud'),w,Math.max(150,w*.52));}
export function relationIcon(scene:Phaser.Scene,x:number,y:number,size:number,same:boolean){return imageContain(scene.add.image(x,y,same?'ui-relation-heart':'ui-relation-claws'),size,size);}
