import Phaser from 'phaser';
import { C,FONT } from '../theme';
export class PreloadScene extends Phaser.Scene{
 constructor(){super('Preload');}
 preload(){
  this.cameras.main.setBackgroundColor(C.cream);
  this.add.text(540,800,'meowza',{fontFamily:FONT,fontSize:'100px',fontStyle:'bold',color:C.ink}).setOrigin(.5);
  const bar=this.add.graphics();
  this.add.text(540,1080,'Un petit instant, les chats arrivent…',{fontFamily:FONT,fontSize:'30px',color:C.ink}).setOrigin(.5);
  this.load.on('progress',(v:number)=>bar.clear().fillStyle(C.pink).fillRoundedRect(220,990,640*v,18,9));
  for(const key of ['logo-v5','tree-modules-v5','room-v5','cloud-v5'])this.load.image(key,`assets/${key}.webp`);
  this.load.image('home-mascots-v4','assets/home-mascots-v4.webp');
  this.load.image('atlas-v3','assets/atlas-v3.webp');
  this.load.image('extreme-timed','assets/extreme-timed-cat.svg');
  this.load.image('grey-cat','assets/cats/nimbus.webp');
  this.load.image('orange-cat','assets/cats/moka.webp');
 }
 private rounded(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
 private makeRoundedTexture(key:string,w:number,h:number,fill:string,stroke:string,r:number,highlight?:string){const tex=this.textures.createCanvas(key,w,h);if(!tex)return;const ctx=tex.context;ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(111,81,72,.14)';this.rounded(ctx,8,14,w-16,h-18,r);ctx.fill();ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=6;this.rounded(ctx,8,6,w-16,h-18,r);ctx.fill();ctx.stroke();if(highlight){ctx.fillStyle=highlight;ctx.globalAlpha=.42;this.rounded(ctx,22,18,w-44,Math.max(22,h*.28),Math.max(12,r*.55));ctx.fill();ctx.globalAlpha=1;}tex.refresh();}
 private makeCell(key:string,fill:string,stroke:string,paw=false){const tex=this.textures.createCanvas(key,192,192);if(!tex)return;const ctx=tex.context;ctx.clearRect(0,0,192,192);ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=6;this.rounded(ctx,8,8,176,176,28);ctx.fill();ctx.stroke();if(paw){ctx.fillStyle='#d9b98f';ctx.globalAlpha=.5;ctx.beginPath();ctx.ellipse(96,108,24,20,0,0,Math.PI*2);ctx.fill();for(const [x,y] of [[72,76],[91,68],[111,70],[126,84]] as const){ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}tex.refresh();}
 private heartPath(ctx:CanvasRenderingContext2D){ctx.beginPath();ctx.moveTo(128,218);ctx.lineTo(39,129);ctx.bezierCurveTo(6,96,14,45,58,31);ctx.bezierCurveTo(87,22,112,35,128,58);ctx.bezierCurveTo(144,35,169,22,198,31);ctx.bezierCurveTo(242,45,250,96,217,129);ctx.lineTo(128,218);ctx.closePath();}
 private makeHeart(key:string,damage:0|1|2|3){const tex=this.textures.createCanvas(key,256,256);if(!tex)return;const ctx=tex.context;ctx.clearRect(0,0,256,256);ctx.lineJoin='round';ctx.lineCap='round';if(damage===3){ctx.fillStyle='#d7a0ac';ctx.strokeStyle='#9d5365';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(128,218);ctx.lineTo(40,132);ctx.bezierCurveTo(5,96,26,41,73,41);ctx.bezierCurveTo(101,41,120,62,128,81);ctx.lineTo(115,128);ctx.lineTo(138,149);ctx.lineTo(118,180);ctx.lineTo(128,218);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(146,197);ctx.lineTo(166,171);ctx.lineTo(150,147);ctx.lineTo(167,126);ctx.lineTo(154,82);ctx.bezierCurveTo(143,61,164,41,192,41);ctx.bezierCurveTo(239,41,251,96,216,132);ctx.lineTo(146,197);ctx.closePath();ctx.fill();ctx.stroke();}else{ctx.fillStyle='#f35d78';ctx.strokeStyle='#a62f4e';ctx.lineWidth=7;this.heartPath(ctx);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(255,213,222,.82)';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(59,65);ctx.bezierCurveTo(78,47,103,48,116,60);ctx.stroke();if(damage>=1){ctx.strokeStyle='#fff2f3';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(132,55);ctx.lineTo(116,103);ctx.lineTo(139,123);ctx.stroke();}if(damage>=2){ctx.beginPath();ctx.moveTo(139,123);ctx.lineTo(119,157);ctx.lineTo(136,188);ctx.stroke();}}tex.refresh();}
 create(){
  // Runtime SVG skins are intentionally avoided: several Android/WebView GPUs rendered them as opaque black textures.
  // These CanvasTextures are a reliable fallback until final raster PNG/WebP skins replace the same texture keys.
  this.makeRoundedTexture('puzzle-board-frame',1024,1024,'#fff8ef','#b97a4d',76,'#f3d7ba');
  this.makeRoundedTexture('puzzle-panel',1000,260,'#fff8ee','#d8ad83',44,'#ffffff');
  this.makeRoundedTexture('button-primary',640,180,'#42c99b','#18836f',50,'#a8f0d9');
  this.makeRoundedTexture('button-secondary',640,180,'#fff7ed','#c99463',50,'#ffffff');
  this.makeRoundedTexture('button-square',180,180,'#fff7ed','#c99463',42,'#ffffff');
  this.makeCell('cell-empty','#fff8ed','#c99363',true);this.makeCell('cell-selected','#e9f8ff','#4ebcf2');this.makeCell('cell-hint','#fff0b8','#f2b84b');this.makeCell('cell-error','#ffd8d8','#ee6666');
  this.makeHeart('heart-full',0);this.makeHeart('heart-crack-1',1);this.makeHeart('heart-crack-2',2);this.makeHeart('heart-broken',3);
  const modules=this.textures.get('tree-modules-v5');for(const [name,x,y,w,h] of [['peach',0,270,430,290],['teal',430,270,425,290],['house',860,120,390,465],['hammock',0,690,510,390],['post',550,600,150,490],['base',760,740,494,350]] as const)modules.add(name,0,x,y,w,h);
  const t=this.textures.get('atlas-v3');['easy','medium','hard','extreme'].forEach((key,i)=>t.add(key,0,i*313,260,313,360));['platform','house','hammock','bridge'].forEach((key,i)=>t.add(key,0,i*313,630,313,400));this.scene.start('Home');
 }
}
