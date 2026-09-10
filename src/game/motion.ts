import Phaser from 'phaser';
import animationManifest from '../../public/assets/animations.json';
import { SaveService } from '../services/SaveService';

type AnimationSpec={name:string;frameRate:number;repeat:number;origin?:number[];frames:string[]};
type Cat='nimbus'|'moka';
type CatAction='idle'|'blink'|'happy'|'jump'|'walk'|'surprise'|'victory'|'sad'|'sleep';
type Fx='placement_correct'|'erreur'|'croquettes_gain'|'objet_debloque'|'etincelles'|'chrono_alerte'|'coeur_perdu';

const specs=animationManifest as AnimationSpec[];
const byName=new Map(specs.map(spec=>[spec.name,spec]));
export const motionTextureKey=(path:string)=>`motion:${path}`;
const animationKey=(name:string)=>`motion-anim:${name}`;

// Startup only loads the first frame of each motion asset. Full frame sequences stay out
// of the critical PWA boot path; helpers below gracefully fall back to these stills.
export function preloadMotion(scene:Phaser.Scene){
 const loaded=new Set<string>();
 for(const spec of specs){const path=spec.frames[0];if(!path||loaded.has(path))continue;loaded.add(path);scene.load.image(motionTextureKey(path),`assets/${path}`);}
}

export function registerMotion(scene:Phaser.Scene){
 for(const spec of specs){
  const key=animationKey(spec.name);if(scene.anims.exists(key))continue;
  const frames=spec.frames.filter(path=>scene.textures.exists(motionTextureKey(path)));
  if(frames.length<2)continue;
  scene.anims.create({key,frames:frames.map(path=>({key:motionTextureKey(path)})),frameRate:spec.frameRate,repeat:spec.repeat});
 }
}

function originFor(name:string):[number,number]{const raw=byName.get(name)?.origin;return [raw?.[0]??.5,raw?.[1]??.5];}
function firstTexture(scene:Phaser.Scene,name:string){const path=byName.get(name)?.frames[0];return path&&scene.textures.exists(motionTextureKey(path))?motionTextureKey(path):null;}

export function playFx(scene:Phaser.Scene,name:Fx,x:number,y:number,size:number,depth=60){
 if(SaveService.data.settings.reducedMotion)return null;const texture=firstTexture(scene,name);if(!texture)return null;
 const sprite=scene.add.sprite(x,y,texture).setDepth(depth).setOrigin(.5),scale=size/Math.max(sprite.width,sprite.height);sprite.setScale(scale);
 const key=animationKey(name);if(scene.anims.exists(key)){sprite.play(key);sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>sprite.destroy());}
 else scene.tweens.add({targets:sprite,alpha:0,scaleX:scale*1.1,scaleY:scale*1.1,duration:220,onComplete:()=>sprite.destroy()});return sprite;
}

export function playCatOnce(scene:Phaser.Scene,cat:Cat,action:Exclude<CatAction,'idle'|'sleep'|'walk'>,x:number,y:number,size:number,depth=30,delay=0){
 const name=`${cat}_${action}`,texture=firstTexture(scene,name);if(!texture)return null;const sprite=scene.add.sprite(x,y,texture).setDepth(depth),[ox,oy]=originFor(name);sprite.setOrigin(ox,oy);const scale=size/Math.max(sprite.width,sprite.height);sprite.setScale(scale);
 const play=()=>{const key=animationKey(name);if(scene.sys.isActive()&&scene.anims.exists(key))sprite.play(key);};if(!SaveService.data.settings.reducedMotion){if(delay>0)scene.time.delayedCall(delay,play);else play();}return sprite;
}

export function addAmbientCat(scene:Phaser.Scene,cat:Cat,x:number,y:number,size:number,mode:'idle'|'sleep'='idle',depth=15){
 const name=`${cat}_${mode}`,texture=firstTexture(scene,name);if(!texture)return null;const sprite=scene.add.sprite(x,y,texture).setDepth(depth),[ox,oy]=originFor(name);sprite.setOrigin(ox,oy);const scale=size/Math.max(sprite.width,sprite.height);sprite.setScale(scale);const key=animationKey(name);if(!SaveService.data.settings.reducedMotion&&scene.anims.exists(key))sprite.play(key);return sprite;
}

export function playCatAction(scene:Phaser.Scene,sprite:Phaser.GameObjects.Sprite,cat:Cat,action:CatAction,returnTo:'idle'|'sleep'='idle'){
 if(SaveService.data.settings.reducedMotion)return;const key=animationKey(`${cat}_${action}`),returnKey=animationKey(`${cat}_${returnTo}`);if(!scene.anims.exists(key))return;sprite.play(key);if(byName.get(`${cat}_${action}`)?.repeat===0&&scene.anims.exists(returnKey))sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>{if(scene.sys.isActive()&&sprite.active)sprite.play(returnKey);});
}
