import Phaser from 'phaser';
import { cosmetics } from '../core/cosmetics';
import { C,FONT } from './theme';
import { AudioService } from '../services/AudioService';
import { SaveService } from '../services/SaveService';
export function label(scene:Phaser.Scene,x:number,y:number,text:string,size=32,color=C.ink,minimum=34){return scene.add.text(x,y,text,{fontFamily:FONT,fontSize:`${Math.max(minimum,size)}px`,fontStyle:'bold',color,align:'center',wordWrap:{width:980},lineSpacing:5}).setOrigin(.5);}
export function cozyBackground(scene:Phaser.Scene){
 scene.cameras.main.setBackgroundColor(C.cream);
 const theme=cosmetics.find(c=>c.id===SaveService.data.equipped.background)!;
 scene.cameras.main.setBackgroundColor(theme.color);
 if(scene.textures.exists('room-v5')){
  const room=scene.add.image(540,960,'room-v5').setDisplaySize(1080,1920);
  if(theme.id==='mint')room.setTint(0xd9f4df);else if(theme.id==='night')room.setTint(0xcfc8ed);
  if(scene.scene.key==='Game'||scene.scene.key==='Hint'||scene.scene.key==='Rules')scene.add.rectangle(540,960,1080,1920,theme.color,.77);
 }
}
export function title(scene:Phaser.Scene,text:string,y:number,size=64){return label(scene,540,y,text,size);}
/** File-backed panel: replace public/assets/ui/puzzle-panel.svg to reskin every scene using it. */
export function panel(scene:Phaser.Scene,x:number,y:number,w:number,h:number,_fill=C.panel,alpha=.97){return scene.add.image(x,y,'puzzle-panel').setDisplaySize(w,h).setAlpha(alpha);}
export function press(scene:Phaser.Scene,c:Phaser.GameObjects.Container,w:number,h:number,onClick:()=>void){
 c.setSize(w,h).setInteractive({useHandCursor:true});
 c.on('pointerdown',()=>{c.setScale(.965);c.setAlpha(.9);});
 c.on('pointerout',()=>{c.setScale(1);c.setAlpha(1);});
 c.on('pointerup',(p:Phaser.Input.Pointer)=>{c.setScale(1);c.setAlpha(1);if(p.getDistance()>32||scene.registry.get('mapDragging'))return;AudioService.play('button');onClick();});return c;
}
/** Asset-backed button. Text stays dynamic; the skin can be replaced without code changes. */
export function button(scene:Phaser.Scene,x:number,y:number,w:number,text:string,onClick:()=>void,color=C.teal){
 const primary=color===C.teal;
 const c=scene.add.container(x,y),skin=scene.add.image(0,0,primary?'button-primary':'button-secondary').setDisplaySize(w,116);
 c.add([skin,label(scene,0,-2,text,34,primary?'#ffffff':C.ink)]);return press(scene,c,w,116,onClick);
}
export function roundButton(scene:Phaser.Scene,x:number,y:number,text:string,onClick:()=>void,_color=0xfff9f2){const c=scene.add.container(x,y),skin=scene.add.image(0,0,'button-square').setDisplaySize(120,120);c.add([skin,label(scene,0,-4,text,46)]);return press(scene,c,120,120,onClick);}
export function backButton(scene:Phaser.Scene,onClick:()=>void){return roundButton(scene,95,105,'‹',onClick);}
export function catBadge(scene:Phaser.Scene,x:number,y:number,w:number,text:string,color:number){const c=scene.add.container(x,y);const g=scene.add.graphics().fillStyle(color,.14).fillRoundedRect(-w/2,-28,w,56,28);c.add([g,label(scene,0,0,text,29)]);return c;}
export function imageContain(image:Phaser.GameObjects.Image,maxW:number,maxH:number){return image.setScale(Math.min(maxW/image.width,maxH/image.height));}
export function imageCover(image:Phaser.GameObjects.Image,w:number,h:number){return image.setScale(Math.max(w/image.width,h/image.height));}
export function fadeIn(scene:Phaser.Scene){if(!SaveService.data.settings.reducedMotion)scene.cameras.main.fadeIn(220,255,246,238);}
export function float(scene:Phaser.Scene,target:Phaser.GameObjects.Image|Phaser.GameObjects.Container,amount=12){if(!SaveService.data.settings.reducedMotion)scene.tweens.add({targets:target,y:`-=${amount}`,duration:1600,yoyo:true,repeat:1,ease:'Sine.InOut'});}
export function sparkles(scene:Phaser.Scene,x:number,y:number,count=12){if(SaveService.data.settings.reducedMotion)return;for(let i=0;i<count;i++){const a=i/count*Math.PI*2;const p=scene.add.star(x,y,4,4,11,[C.gold,C.pink,C.teal][i%3]!).setDepth(50);scene.tweens.add({targets:p,x:x+Math.cos(a)*160,y:y+Math.sin(a)*160,alpha:0,scale:.25,angle:90,duration:650,onComplete:()=>p.destroy()});}}
export function cloud(scene:Phaser.Scene,x:number,y:number,w:number){const c=scene.add.container(x,y),g=scene.add.graphics();g.fillStyle(0xd6cbe9,.7).fillRoundedRect(-w/2,-15,w,105,52);g.fillStyle(0xf5efff).fillRoundedRect(-w/2,-30,w,105,52);g.fillCircle(-w*.23,-25,60).fillCircle(w*.04,-46,76).fillCircle(w*.29,-13,50);c.add(g);return c;}
/** Board relation symbols stay procedural because they must scale precisely with 4/6/8 grids. */
export function relationIcon(scene:Phaser.Scene,x:number,y:number,size:number,same:boolean){
 const c=scene.add.container(x,y),g=scene.add.graphics(),r=size/2;
 g.fillStyle(same?0xe84886:0x7350ba).fillCircle(0,0,r).lineStyle(2,0xffffff).strokeCircle(0,0,r);
 if(same){g.fillStyle(0xffffff).fillCircle(-r*.22,-r*.12,r*.26).fillCircle(r*.22,-r*.12,r*.26).fillTriangle(-r*.48,-r*.02,r*.48,-r*.02,0,r*.5);}else{g.lineStyle(Math.max(2,size*.075),0xffffff);for(let i=-1;i<=1;i++)g.lineBetween(i*r*.34-r*.12,r*.4,i*r*.34+r*.13,-r*.4);}
 c.add(g);return c;
}
