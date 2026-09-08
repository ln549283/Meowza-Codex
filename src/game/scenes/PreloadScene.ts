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
 private makeRoundedTexture(key:string,w:number,h:number,fill:number,stroke:number,r:number,highlight?:number){
  const g=this.add.graphics();
  g.fillStyle(0x6f5148,.14).fillRoundedRect(8,14,w-16,h-18,r);
  g.fillStyle(fill,1).lineStyle(6,stroke,1).fillRoundedRect(8,6,w-16,h-18,r).strokeRoundedRect(8,6,w-16,h-18,r);
  if(highlight!==undefined)g.fillStyle(highlight,.42).fillRoundedRect(22,18,w-44,Math.max(22,h*.28),Math.max(12,r*.55));
  g.generateTexture(key,w,h);g.destroy();
 }
 private makeHeart(key:string,damage:0|1|2|3){
  const g=this.add.graphics(),x=128,y=124;
  if(damage===3){
   g.fillStyle(0xd7a0ac,1).lineStyle(7,0x9d5365,1);
   g.beginPath().moveTo(x,y+94).lineTo(40,y+8).cubicBezierTo(5,y-28,26,y-83,73,y-83).cubicBezierTo(101,y-83,120,y-62,x,y-43).lineTo(x-13,y+4).lineTo(x+10,y+25).lineTo(x-10,y+56).lineTo(x,y+94).closePath().fillPath().strokePath();
   g.beginPath().moveTo(x+18,y+73).lineTo(x+38,y+47).lineTo(x+22,y+23).lineTo(x+39,y+2).lineTo(x+26,y-42).cubicBezierTo(143,y-63,164,y-83,192,y-83).cubicBezierTo(239,y-83,251,y-28,216,y+8).lineTo(x+18,y+73).closePath().fillPath().strokePath();
  }else{
   g.fillStyle(0xf35d78,1).lineStyle(7,0xa62f4e,1);
   g.beginPath().moveTo(x,y+94).lineTo(39,y+5).cubicBezierTo(6,y-28,14,y-79,58,y-93).cubicBezierTo(87,y-102,112,y-89,x,y-66).cubicBezierTo(144,y-89,169,y-102,198,y-93).cubicBezierTo(242,y-79,250,y-28,217,y+5).lineTo(x,y+94).closePath().fillPath().strokePath();
   g.lineStyle(10,0xffd5de,.82).beginPath().moveTo(59,65).cubicBezierTo(78,47,103,48,116,60).strokePath();
   if(damage>=1)g.lineStyle(9,0xfff2f3,1).beginPath().moveTo(132,55).lineTo(116,103).lineTo(139,123).strokePath();
   if(damage>=2)g.lineStyle(9,0xfff2f3,1).beginPath().moveTo(139,123).lineTo(119,157).lineTo(136,188).strokePath();
  }
  g.generateTexture(key,256,256);g.destroy();
 }
 create(){
  // Runtime-generated raster textures avoid an Android/WebView SVG-alpha issue that rendered the first visual-slice skins black.
  // Keep these keys stable: GameScene/BoardView remain asset-driven and can later swap to final WebP art without layout changes.
  this.makeRoundedTexture('puzzle-board-frame',1024,1024,0xfff8ef,0xb97a4d,76,0xf3d7ba);
  this.makeRoundedTexture('puzzle-panel',1000,260,0xfff8ee,0xd8ad83,44,0xffffff);
  this.makeRoundedTexture('button-primary-skin',640,180,0x54a46f,0x2d704a,50,0x8fd197);
  this.makeRoundedTexture('button-secondary-skin',640,180,0xfff7ed,0xc9a47d,50,0xffffff);
  this.makeHeart('heart-full',0);this.makeHeart('heart-crack-1',1);this.makeHeart('heart-crack-2',2);this.makeHeart('heart-broken',3);
  const modules=this.textures.get('tree-modules-v5');
  for(const [name,x,y,w,h] of [['peach',0,270,430,290],['teal',430,270,425,290],['house',860,120,390,465],['hammock',0,690,510,390],['post',550,600,150,490],['base',760,740,494,350]] as const)modules.add(name,0,x,y,w,h);
  const t=this.textures.get('atlas-v3');
  ['easy','medium','hard','extreme'].forEach((key,i)=>t.add(key,0,i*313,260,313,360));
  ['platform','house','hammock','bridge'].forEach((key,i)=>t.add(key,0,i*313,630,313,400));
  this.scene.start('Home');
 }
}
