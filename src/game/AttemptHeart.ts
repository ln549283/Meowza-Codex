import type Phaser from 'phaser';

/** One persistent health symbol; cracks convey damage even without animation. */
export function drawAttemptHeart(g:Phaser.GameObjects.Graphics,x:number,y:number,errors:number,scale=1){
 g.clear();
 const heart=(dx:number,dy:number,color:number)=>{
  g.fillStyle(color);
  g.fillCircle(x+dx-24*scale,y+dy-15*scale,33*scale);
  g.fillCircle(x+dx+24*scale,y+dy-15*scale,33*scale);
  g.fillTriangle(x+dx-56*scale,y+dy-4*scale,x+dx+56*scale,y+dy-4*scale,x+dx,y+dy+61*scale);
 };
 heart(0,7*scale,0xb95877);heart(0,0,errors>=3?0xc2a5b2:0xf18ba2);
 g.fillStyle(0xffd9e2,.85).fillEllipse(x-30*scale,y-25*scale,15*scale,22*scale);
 if(errors>0){
  g.lineStyle((errors>=3?12:6)*scale,0x75485f,1);
  g.beginPath();g.moveTo(x+5*scale,y-25*scale);g.lineTo(x-9*scale,y-2*scale);
  g.lineTo(x+12*scale,y+12*scale);g.lineTo(x-6*scale,y+36*scale);
  if(errors>=2)g.lineTo(x,y+59*scale);
  g.strokePath();
  if(errors>=2){g.beginPath();g.moveTo(x-9*scale,y-2*scale);g.lineTo(x-31*scale,y+5*scale);g.lineTo(x-41*scale,y-5*scale);g.strokePath();}
 }
}
