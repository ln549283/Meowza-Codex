import Phaser from 'phaser';

/** Keep the authored portrait UI intact while the canvas fills the available viewport. */
export class ResponsivePlugin extends Phaser.Plugins.ScenePlugin {
 boot(){
  this.systems!.events.on('create',this.layout,this);
  this.systems!.events.on('shutdown',()=>this.scene!.scale.off('resize',this.layout,this));
  this.systems!.events.on('create',()=>this.scene!.scale.on('resize',this.layout,this));
 }
 private layout(){
  const scene=this.scene!,w=scene.scale.width,h=scene.scale.height;
  scene.cameras.main.setScroll(-(w-1080)/2,scene.scene.key==='LevelSelect'?0:-(h-1920)/2);
  // Only scenery expands; hit targets and the puzzle retain their proportions.
  for(const object of scene.children.list){
   if(object instanceof Phaser.GameObjects.Image&&(object.getData('viewportBackdrop')||object.displayWidth===1080&&object.displayHeight===1920)){
    object.setData('viewportBackdrop',true);
    if(scene.scene.key==='Home'&&w>1080)continue; // This illustration includes the logo and characters.
    object.setPosition(540,scene.scene.key==='LevelSelect'?h/2:960);
    object.setScale(Math.max(w/object.width,h/object.height));
   }
   if(object instanceof Phaser.GameObjects.Rectangle&&(object.getData('viewportBackdrop')||object.width===1080&&object.height===1920)){object.setData('viewportBackdrop',true);object.setSize(w,h);}
  }
 }
}
