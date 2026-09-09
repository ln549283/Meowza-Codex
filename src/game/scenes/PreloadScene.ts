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

  // Existing production assets kept as fallbacks / legacy content.
  for(const key of ['logo-v5','tree-modules-v5','room-v5','cloud-v5'])this.load.image(key,`assets/${key}.webp`);
  this.load.image('home-mascots-v4','assets/home-mascots-v4.webp');
  this.load.image('atlas-v3','assets/atlas-v3.webp');
  this.load.image('extreme-timed','assets/extreme-timed-cat.svg');
  this.load.image('grey-cat','assets/cats/nimbus.webp');
  this.load.image('orange-cat','assets/cats/moka.webp');

  // Accueil / arbre V2.
  this.load.image('home-art-v2','assets/accueil.png');
  const treeAssets={
   'tree-base-v2':'base.png','tree-cloud-v2':'cloud.png','tree-cubby-cream':'cubby_cream.png','tree-cubby-wood':'cubby_wood.png',
   'tree-hammock-lilac':'hammock_lilac.png','tree-hammock-peach':'hammock_peach.png','tree-platform-lilac':'platform_lilac.png',
   'tree-platform-peach':'platform_peach.png','tree-post-long':'post_long.png','tree-post-short':'post_short.png','tree-round-platform':'round_platform.png','tree-shelf':'shelf.png'
  } as const;
  Object.entries(treeAssets).forEach(([key,file])=>this.load.image(key,`assets/tree/${file}`));

  // UI / icons from the extracted asset pack. PNG only on runtime paths: Android-safe.
  const uiAssets={
   'heart-full':'heart-full.png','heart-crack-1':'heart-crack-1.png','heart-crack-2':'heart-crack-2.png','heart-broken':'heart-broken.png',
   'hub-diamond':'diamond.png','hub-kibble':'kibble.png','hub-settings':'settings.png','hub-missions':'missions.png','hub-shop':'gift.png',
   'hub-decorate':'brush.png','hub-locate':'magnifier.png','ui-back':'back.png','ui-close':'close.png','ui-check':'check.png','ui-lock':'lock.png',
   'ui-play':'play.png','ui-pause':'pause.png','ui-clock':'clock.png','ui-relation-heart':'relation-heart.png','ui-relation-claws':'relation-claws.png'
  } as const;
  Object.entries(uiAssets).forEach(([key,file])=>this.load.image(key,`assets/ui/${file}`));

  // New board / progression skins.
  this.load.image('puzzle-board-frame','assets/board/board-frame-blue.png');
  const nodes={
   'node-current':'level_current.png','node-completed':'level_completed.png','node-locked':'level_locked.png','node-extreme':'level_extreme.png','node-timed':'level_timed.png','node-plaque':'level_plaque.png'
  } as const;
  Object.entries(nodes).forEach(([key,file])=>this.load.image(key,`assets/board_nodes/${file}`));

  // Nimbus + Moka animation library. Each sheet is authored on a 384x384 grid.
  const catAnimations=['idle','blink','happy','jump','walk','surprise','victory','sad'] as const;
  for(const cat of ['nimbus','moka'] as const)for(const anim of catAnimations)this.load.spritesheet(`${cat}-${anim}`,`assets/animations/${cat}/${anim}.png`,{frameWidth:384,frameHeight:384});
 }
 private rounded(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
 private makeRoundedTexture(key:string,w:number,h:number,fill:string,stroke:string,r:number,highlight?:string){const tex=this.textures.createCanvas(key,w,h);if(!tex)return;const ctx=tex.context;ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(111,81,72,.14)';this.rounded(ctx,8,14,w-16,h-18,r);ctx.fill();ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=6;this.rounded(ctx,8,6,w-16,h-18,r);ctx.fill();ctx.stroke();if(highlight){ctx.fillStyle=highlight;ctx.globalAlpha=.42;this.rounded(ctx,22,18,w-44,Math.max(22,h*.28),Math.max(12,r*.55));ctx.fill();ctx.globalAlpha=1;}tex.refresh();}
 private makeCell(key:string,fill:string,stroke:string,paw=false){const tex=this.textures.createCanvas(key,192,192);if(!tex)return;const ctx=tex.context;ctx.clearRect(0,0,192,192);ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=6;this.rounded(ctx,8,8,176,176,28);ctx.fill();ctx.stroke();if(paw){ctx.fillStyle='#d9b98f';ctx.globalAlpha=.5;ctx.beginPath();ctx.ellipse(96,108,24,20,0,0,Math.PI*2);ctx.fill();for(const [x,y] of [[72,76],[91,68],[111,70],[126,84]] as const){ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}tex.refresh();}
 create(){
  // Components that do not yet have final raster skins remain mobile-safe CanvasTextures.
  this.makeRoundedTexture('puzzle-panel',1000,260,'#fff8ee','#d8ad83',44,'#ffffff');
  this.makeRoundedTexture('button-primary',640,180,'#42c99b','#18836f',50,'#a8f0d9');
  this.makeRoundedTexture('button-secondary',640,180,'#fff7ed','#c99463',50,'#ffffff');
  this.makeRoundedTexture('button-square',180,180,'#fff7ed','#c99463',42,'#ffffff');
  this.makeCell('cell-empty','#fff8ed','#c99363',true);this.makeCell('cell-selected','#e9f8ff','#4ebcf2');this.makeCell('cell-hint','#fff0b8','#f2b84b');this.makeCell('cell-error','#ffd8d8','#ee6666');

  const rates:Record<string,number>={idle:16,blink:16,happy:24,jump:24,walk:20,surprise:24,victory:24,sad:20};
  for(const cat of ['nimbus','moka'] as const)for(const anim of ['idle','blink','happy','jump','walk','surprise','victory','sad'] as const){
   const source=`${cat}-${anim}`,key=`anim-${cat}-${anim}`;
   if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers(source),frameRate:rates[anim],repeat:anim==='idle'||anim==='walk'?-1:0});
  }

  const modules=this.textures.get('tree-modules-v5');for(const [name,x,y,w,h] of [['peach',0,270,430,290],['teal',430,270,425,290],['house',860,120,390,465],['hammock',0,690,510,390],['post',550,600,150,490],['base',760,740,494,350]] as const)modules.add(name,0,x,y,w,h);
  const t=this.textures.get('atlas-v3');['easy','medium','hard','extreme'].forEach((key,i)=>t.add(key,0,i*313,260,313,360));['platform','house','hammock','bridge'].forEach((key,i)=>t.add(key,0,i*313,630,313,400));
  this.scene.start('Home');
 }
}
