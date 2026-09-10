import Phaser from 'phaser';
import animationManifest from '../../public/assets/animations.json';
import { SaveService } from '../services/SaveService';

type AnimationSpec={name:string;frameRate:number;repeat:number;origin?:number[];frames:string[]};
type Fx='objet_debloque'|'etincelles'|'chrono_alerte'|'coeur_perdu';

const specs=animationManifest as AnimationSpec[];
const keptFx=new Set<Fx>(['objet_debloque','etincelles','chrono_alerte','coeur_perdu']);
const byName=new Map(specs.filter(spec=>keptFx.has(spec.name as Fx)).map(spec=>[spec.name,spec]));
export const motionTextureKey=(path:string)=>`motion:${path}`;
const animationKey=(name:string)=>`motion-anim:${name}`;

// Only the retained lightweight FX participate in startup motion loading.
export function preloadMotion(scene:Phaser.Scene){
 const loaded=new Set<string>();
 for(const spec of byName.values()){const path=spec.frames[0];if(!path||loaded.has(path))continue;loaded.add(path);scene.load.image(motionTextureKey(path),`assets/${path}`);}
}

export function registerMotion(scene:Phaser.Scene){
 for(const spec of byName.values()){
  const key=animationKey(spec.name);if(scene.anims.exists(key))continue;
  const frames=spec.frames.filter(path=>scene.textures.exists(motionTextureKey(path)));
  if(frames.length<2)continue;
  scene.anims.create({key,frames:frames.map(path=>({key:motionTextureKey(path)})),frameRate:spec.frameRate,repeat:spec.repeat});
 }
}

function firstTexture(scene:Phaser.Scene,name:Fx){const path=byName.get(name)?.frames[0];return path&&scene.textures.exists(motionTextureKey(path))?motionTextureKey(path):null;}

export function playFx(scene:Phaser.Scene,name:Fx,x:number,y:number,size:number,depth=60){
 if(SaveService.data.settings.reducedMotion)return null;const texture=firstTexture(scene,name);if(!texture)return null;
 const sprite=scene.add.sprite(x,y,texture).setDepth(depth).setOrigin(.5),scale=size/Math.max(sprite.width,sprite.height);sprite.setScale(scale);
 const key=animationKey(name);if(scene.anims.exists(key)){sprite.play(key);sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>sprite.destroy());}
 else scene.tweens.add({targets:sprite,alpha:0,scaleX:scale*1.1,scaleY:scale*1.1,duration:220,onComplete:()=>sprite.destroy()});return sprite;
}
