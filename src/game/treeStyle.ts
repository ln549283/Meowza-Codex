import Phaser from 'phaser';
import type { ChunkKind } from '../core/treeChunks';

/** Palette swaps retain the illustration's grain, highlights, alpha and geometry. */
export function treeTexture(scene:Phaser.Scene,kind:ChunkKind,wood='honey',cushion='peach',thumbnail=false){
 const original=`tree-chunk-${kind}`;
 if(wood==='honey'&&cushion==='peach')return original;
 const key=`styled-tree-${thumbnail?'thumb':'full'}-${kind}-${wood}-${cushion}`;
 if(scene.textures.exists(key))return key;
 const source=scene.textures.get(original).getSourceImage() as HTMLImageElement;
 const width=thumbnail?256:source.width,height=Math.round(source.height*width/source.width);
 const texture=scene.textures.createCanvas(key,width,height)!;
 const ctx=texture.context;ctx.drawImage(source,0,0,width,height);
 const pixels=ctx.getImageData(0,0,width,height),data=pixels.data;
 for(let i=0;i<data.length;i+=4){
  if(!data[i+3])continue;
  const r=data[i]!/255,g=data[i+1]!/255,b=data[i+2]!/255,max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
  if(delta<.035||max===0)continue;
  let hue=(max===r?(g-b)/delta+(g<b?6:0):max===g?(b-r)/delta+2:(r-g)/delta+4)*60;
  let sat=delta/max,value=max,change=false;
  if(wood!=='honey'&&hue>18&&hue<62&&sat>.22){
   hue=wood==='walnut'?27:40;sat*=wood==='walnut'?.72:.42;value=wood==='walnut'?value*.78:Math.min(1,value*.96+.07);change=true;
  }else if(cushion!=='peach'&&(hue>265||hue<18)&&sat>.12){hue=cushion==='teal'?172:337;sat=Math.min(.62,sat*.85);change=true;}
  if(!change)continue;
  const c=value*sat,x=c*(1-Math.abs(hue/60%2-1)),m=value-c;
  const rgb=hue<60?[c,x,0]:hue<120?[x,c,0]:hue<180?[0,c,x]:hue<240?[0,x,c]:hue<300?[x,0,c]:[c,0,x];
  for(let j=0;j<3;j++)data[i+j]=Math.round((rgb[j]!+m)*255);
 }
 ctx.putImageData(pixels,0,0);texture.refresh();return key;
}
