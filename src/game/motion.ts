import Phaser from 'phaser';
import { SaveService } from '../services/SaveService';

type Fx='objet_debloque'|'etincelles'|'chrono_alerte'|'coeur_perdu';

const fxTextures:Record<Fx,string>={
 objet_debloque:'effects/animations/objet_debloque/001.png',
 etincelles:'effects/animations/etincelles/001.png',
 chrono_alerte:'effects/animations/chrono_alerte/001.png',
 coeur_perdu:'effects/animations/coeur_perdu/001.png'
};
const textureKey=(name:Fx)=>`motion-fx:${name}`;

// Keep motion outside the animation manifest: only the four approved lightweight FX
// load one still frame each. Removed character/placement/error sequences stay as
// repository assets but are no longer referenced by runtime code.
export function preloadMotion(scene:Phaser.Scene){
 (Object.entries(fxTextures) as [Fx,string][]).forEach(([name,path])=>scene.load.image(textureKey(name),`assets/${path}`));
}

export function registerMotion(_scene:Phaser.Scene){/* retained for the preload scene API; no frame animations are registered */}

export function playFx(scene:Phaser.Scene,name:Fx,x:number,y:number,size:number,depth=60){
 if(SaveService.data.settings.reducedMotion)return null;
 const key=textureKey(name);if(!scene.textures.exists(key))return null;
 const sprite=scene.add.sprite(x,y,key).setDepth(depth).setOrigin(.5),scale=size/Math.max(sprite.width,sprite.height);sprite.setScale(scale);
 scene.tweens.add({targets:sprite,alpha:0,scaleX:scale*1.1,scaleY:scale*1.1,duration:220,onComplete:()=>sprite.destroy()});
 return sprite;
}
