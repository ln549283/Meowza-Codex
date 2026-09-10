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

export function preloadMotion(scene:Phaser.Scene){
 const loaded=new Set<string>();
 for(const spec of specs)for(const path of spec.frames){
  if(loaded.has(path))continue;
  loaded.add(path);
  scene.load.image(motionTextureKey(path),`assets/${path}`);
 }
}

export function registerMotion(scene:Phaser.Scene){
 for(const spec of specs){
  const key=animationKey(spec.name);
  if(scene.anims.exists(key))continue;
  scene.anims.create({
   key,
   frames:spec.frames.map(path=>({key:motionTextureKey(path)})),
   frameRate:spec.frameRate,
   repeat:spec.repeat
  });
 }
}

function originFor(name:string):[number,number]{
 const raw=byName.get(name)?.origin;
 return [raw?.[0]??.5,raw?.[1]??.5];
}

export function playFx(scene:Phaser.Scene,name:Fx,x:number,y:number,size:number,depth=60){
 if(SaveService.data.settings.reducedMotion)return null;
 const spec=byName.get(name);if(!spec)return null;
 const sprite=scene.add.sprite(x,y,motionTextureKey(spec.frames[0]!)).setDepth(depth).setOrigin(.5);
 const scale=size/Math.max(sprite.width,sprite.height);sprite.setScale(scale);
 sprite.play(animationKey(name));sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>sprite.destroy());
 return sprite;
}

export function playCatOnce(scene:Phaser.Scene,cat:Cat,action:Exclude<CatAction,'idle'|'sleep'|'walk'>,x:number,y:number,size:number,depth=30,delay=0){
 const name=`${cat}_${action}`;const spec=byName.get(name);if(!spec)return null;
 const sprite=scene.add.sprite(x,y,motionTextureKey(spec.frames[0]!)).setDepth(depth);
 const [ox,oy]=originFor(name);sprite.setOrigin(ox,oy);
 const scale=size/Math.max(sprite.width,sprite.height);sprite.setScale(scale);
 const play=()=>{if(scene.sys.isActive())sprite.play(animationKey(name));};
 if(SaveService.data.settings.reducedMotion){sprite.setTexture(motionTextureKey(spec.frames[Math.min(spec.frames.length-1,Math.floor(spec.frames.length*.45))]!));}
 else if(delay>0)scene.time.delayedCall(delay,play);else play();
 return sprite;
}

export function addAmbientCat(scene:Phaser.Scene,cat:Cat,x:number,y:number,size:number,mode:'idle'|'sleep'='idle',depth=15){
 const name=`${cat}_${mode}`;const spec=byName.get(name);if(!spec)return null;
 const sprite=scene.add.sprite(x,y,motionTextureKey(spec.frames[0]!)).setDepth(depth);
 const [ox,oy]=originFor(name);sprite.setOrigin(ox,oy);
 const scale=size/Math.max(sprite.width,sprite.height);sprite.setScale(scale);
 if(!SaveService.data.settings.reducedMotion)sprite.play(animationKey(name));
 if(mode==='idle'&&!SaveService.data.settings.reducedMotion){
  const blinkName=`${cat}_blink`;
  const schedule=()=>scene.time.delayedCall(2600+Math.random()*4200,()=>{
   if(!scene.sys.isActive()||!sprite.active)return;
   sprite.play(animationKey(blinkName));
   sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>{
    if(!scene.sys.isActive()||!sprite.active)return;
    sprite.play(animationKey(name));schedule();
   });
  });
  schedule();
 }
 return sprite;
}

export function playCatAction(scene:Phaser.Scene,sprite:Phaser.GameObjects.Sprite,cat:Cat,action:CatAction,returnTo:'idle'|'sleep'='idle'){
 if(SaveService.data.settings.reducedMotion)return;
 const name=`${cat}_${action}`,returnName=`${cat}_${returnTo}`;
 if(!byName.has(name))return;
 sprite.play(animationKey(name));
 if(byName.get(name)?.repeat===0)sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>{
  if(scene.sys.isActive()&&sprite.active&&byName.has(returnName))sprite.play(animationKey(returnName));
 });
}
