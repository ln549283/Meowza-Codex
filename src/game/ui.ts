import Phaser from 'phaser';
import { C } from './theme';
import { AudioService } from '../services/AudioService';

export function cozyBackground(scene:Phaser.Scene){
  scene.cameras.main.setBackgroundColor(C.cream);
  const bands=[0xfff8ee,0xfff2e5,0xffeadc,0xffe2d3];
  bands.forEach((color,i)=>scene.add.ellipse(540,300+i*520,1500,950,color,.48));
  scene.add.image(100,1680,'plant').setScale(1.8).setAlpha(.62);
  scene.add.image(980,1760,'pillow').setScale(1.5).setAngle(12).setAlpha(.65);
}
export function title(scene:Phaser.Scene,text:string,y:number,size=64){
  return scene.add.text(540,y,text,{fontFamily:'Arial Rounded MT Bold, sans-serif',fontSize:`${size}px`,fontStyle:'bold',color:C.ink,align:'center',stroke:'#fff8ef',strokeThickness:9,shadow:{offsetY:5,color:'#d59f8b',blur:3,fill:true}}).setOrigin(.5);
}
export function panel(scene:Phaser.Scene,x:number,y:number,w:number,h:number,fill=C.panel,alpha=.97){
  const g=scene.add.graphics();
  g.fillStyle(0x734b51,.12).fillRoundedRect(x-w/2+8,y-h/2+14,w,h,48);
  g.fillStyle(fill,alpha).lineStyle(5,0xf0c9a4,1).fillRoundedRect(x-w/2,y-h/2,w,h,48).strokeRoundedRect(x-w/2,y-h/2,w,h,48);
  g.lineStyle(3,0xffffff,.72).strokeRoundedRect(x-w/2+10,y-h/2+10,w-20,h-20,39);
  return g;
}
export function button(scene:Phaser.Scene,x:number,y:number,w:number,label:string,onClick:()=>void,color=C.teal){
  const c=scene.add.container(x,y),g=scene.add.graphics();
  g.fillStyle(0x563845,.18).fillRoundedRect(-w/2+5,-43+12,w,86,32);
  g.fillStyle(color,1).lineStyle(4,0xffffff,.55).fillRoundedRect(-w/2,-43,w,86,32).strokeRoundedRect(-w/2,-43,w,86,32);
  g.fillStyle(0xffffff,.16).fillRoundedRect(-w/2+12,-34,w-24,28,18);
  const t=scene.add.text(0,-2,label,{fontFamily:'Arial Rounded MT Bold, sans-serif',fontSize:'32px',fontStyle:'bold',color:'#ffffff',shadow:{offsetY:3,color:'#4a2d38',blur:1,fill:true}}).setOrigin(.5);
  c.add([g,t]).setSize(w,92).setInteractive({useHandCursor:true}).on('pointerdown',()=>{AudioService.play('button');scene.tweens.add({targets:c,scale:.94,duration:70,yoyo:true,ease:'Sine.Out'});onClick();});return c;
}
export function roundButton(scene:Phaser.Scene,x:number,y:number,label:string,onClick:()=>void,color=0xffd9bb){
  const c=scene.add.container(x,y),g=scene.add.graphics();g.fillStyle(0x563845,.15).fillCircle(4,7,49);g.fillStyle(color).lineStyle(4,0xffffff,.8).fillCircle(0,0,47).strokeCircle(0,0,47);
  c.add([g,scene.add.text(0,-2,label,{fontFamily:'Arial Rounded MT Bold',fontSize:'42px',fontStyle:'bold',color:C.ink}).setOrigin(.5)]).setSize(100,100).setInteractive({useHandCursor:true}).on('pointerdown',()=>{AudioService.play('button');scene.tweens.add({targets:c,scale:.9,duration:70,yoyo:true});onClick();});return c;
}
export function catBadge(scene:Phaser.Scene,x:number,y:number,w:number,label:string,color:number){
  const c=scene.add.container(x,y),g=scene.add.graphics();g.fillStyle(color).fillTriangle(-w/2+28,-30,-w/2+58,-77,-w/2+84,-27).fillTriangle(w/2-84,-27,w/2-58,-77,w/2-28,-30);g.fillStyle(0x000000,.14).fillRoundedRect(-w/2+5,-29,w,68,30);g.fillStyle(color).lineStyle(4,0xffffff,.55).fillRoundedRect(-w/2,-36,w,68,30).strokeRoundedRect(-w/2,-36,w,68,30);c.add([g,scene.add.text(0,-3,label,{fontFamily:'Arial Rounded MT Bold',fontSize:'31px',fontStyle:'bold',color:'#fff'}).setOrigin(.5)]);return c;
}
export function levelTile(scene:Phaser.Scene,x:number,y:number,n:number,color:number,locked:boolean,stars:number,onClick:()=>void){
  const c=scene.add.container(x,y),g=scene.add.graphics(),s=112;g.fillStyle(0x5a3b43,.13).fillRoundedRect(-s/2+4,-s/2+8,s,s,25);g.fillStyle(locked?0xc9bcb5:color).lineStyle(4,0xffffff,.55).fillRoundedRect(-s/2,-s/2,s,s,25).strokeRoundedRect(-s/2,-s/2,s,s,25);g.fillStyle(0xffffff,.15).fillRoundedRect(-s/2+9,-s/2+8,s-18,32,16);const label=scene.add.text(0,-7,locked?'🔒':String(n),{fontFamily:'Arial Rounded MT Bold',fontSize:locked?'33px':'40px',fontStyle:'bold',color:'#fff',shadow:{offsetY:3,color:'#6d3b43',fill:true}}).setOrigin(.5);const starText=scene.add.text(0,39,stars?'★'.repeat(stars):'· · ·',{fontSize:stars?'20px':'18px',color:stars?'#ffe273':'#ffffff',stroke:'#a8683a',strokeThickness:2}).setOrigin(.5);c.add([g,label,starText]);if(!locked)c.setSize(s,s).setInteractive({useHandCursor:true}).on('pointerdown',()=>{AudioService.play('button');scene.tweens.add({targets:c,scale:.9,duration:70,yoyo:true});onClick();});return c;
}
export function backButton(scene:Phaser.Scene,onClick:()=>void){return roundButton(scene,88,105,'‹',onClick);}
export function imageContain(image:Phaser.GameObjects.Image,maxW:number,maxH:number){const scale=Math.min(maxW/image.width,maxH/image.height);return image.setScale(scale);}
export function imageCover(image:Phaser.GameObjects.Image,w:number,h:number){const scale=Math.max(w/image.width,h/image.height);return image.setScale(scale);}
export function fadeIn(scene:Phaser.Scene){scene.cameras.main.fadeIn(220,255,246,236);}
