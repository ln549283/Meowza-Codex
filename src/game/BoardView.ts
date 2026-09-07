import Phaser from 'phaser';
import { EMPTY,GREY,ORANGE,cloneGrid,type CellValue,type Grid,type Level,type Position } from '../core/model';
import { validateGrid } from '../core/validator';
import { AudioService } from '../services/AudioService';
import { HapticsService } from '../services/HapticsService';
import { SaveService } from '../services/SaveService';
import { label,sparkles } from './ui';

interface CellView {container:Phaser.GameObjects.Container;bg:Phaser.GameObjects.Graphics;cat:Phaser.GameObjects.Image|undefined;preset:boolean;r:number;c:number}

export class BoardView extends Phaser.GameObjects.Container {
 readonly grid:Grid;
 private cells:CellView[]=[];
 private readonly tile:number;
 locked=false;
 brush:CellValue=GREY;
 onChanged?:()=>void;
 onMistake?:(position:Position)=>void;

 constructor(scene:Phaser.Scene,x:number,y:number,readonly level:Level,private readonly boardSize:number){
  super(scene,x,y);scene.add.existing(this);this.grid=cloneGrid(level.initial);this.tile=(boardSize-44)/level.size;
  const frame=scene.add.graphics();frame.fillStyle(0x776484,.18).fillRoundedRect(-boardSize/2,-boardSize/2+18,boardSize,boardSize,44).fillStyle(0xd8c7e7).fillRoundedRect(-boardSize/2,-boardSize/2,boardSize,boardSize,44).lineStyle(5,0xffffff).strokeRoundedRect(-boardSize/2,-boardSize/2,boardSize,boardSize,44);this.add(frame);
  this.buildCells();this.buildConstraints();
 }

 private buildCells(){
  const start=-this.boardSize/2+22;
  for(let r=0;r<this.level.size;r++)for(let c=0;c<this.level.size;c++){
   const holder=this.scene.add.container(start+c*this.tile+this.tile/2,start+r*this.tile+this.tile/2),bg=this.scene.add.graphics();holder.add(bg);
   const preset=this.level.initial[r]![c]!==EMPTY,cell:CellView={container:holder,bg,cat:undefined,preset,r,c};this.cells.push(cell);this.add(holder);this.paintCell(cell,false);this.setCat(cell,this.grid[r]![c]!,false);
   if(!preset)holder.setSize(this.tile*.94,this.tile*.94).setInteractive({useHandCursor:true}).on('pointerup',(p:Phaser.Input.Pointer)=>{if(p.getDistance()<20)this.place(cell);});
  }
 }

 private paintCell(cell:CellView,hint=false){
  const value=this.grid[cell.r]![cell.c]!,s=this.tile*.92;const fill=hint?0xffedb4:value===GREY?0xeee8f7:value===ORANGE?0xffe9d4:0xfffbf7;
  cell.bg.clear().fillStyle(0x9580a1,.2).fillRoundedRect(-s/2,-s/2+4,s,s,18).fillStyle(fill).lineStyle(2,0xffffff).fillRoundedRect(-s/2,-s/2,s,s,18).strokeRoundedRect(-s/2,-s/2,s,s,18);
  if(cell.preset){cell.bg.lineStyle(3,0x82708d).strokeRoundedRect(s*.3-5,-s*.39,10,9,3);cell.bg.fillStyle(0x82708d).fillRoundedRect(s*.3-8,-s*.34,16,12,3);}
 }

 private setCat(cell:CellView,value:CellValue,animate=true){
  cell.cat?.destroy();cell.cat=undefined;if(value===EMPTY)return;
  const image=this.scene.add.image(0,2,value===GREY?'grey-cat':'orange-cat');const scale=this.tile*.76/Math.max(image.width,image.height);image.setScale(scale);cell.container.add(image);cell.cat=image;
  if(animate&&!SaveService.data.settings.reducedMotion){image.setScale(scale*.65);this.scene.tweens.add({targets:image,scaleX:scale,scaleY:scale,duration:230,ease:'Back.Out'});}
 }

 private place(cell:CellView){
  if(this.locked||cell.preset||this.grid[cell.r]![cell.c]!==EMPTY)return;
  const value=this.brush;
  if(value!==this.level.solution[cell.r]![cell.c]){
   AudioService.play('invalid');void HapticsService.error();
   if(!SaveService.data.settings.reducedMotion)this.scene.tweens.add({targets:cell.container,angle:5,duration:65,yoyo:true,repeat:1});
   this.onMistake?.([cell.r,cell.c]);
   return;
  }
  this.grid[cell.r]![cell.c]=value;this.setCat(cell,value);this.paintCell(cell);AudioService.play('place');void HapticsService.light();this.onChanged?.();
 }

 private buildConstraints(){
  const start=-this.boardSize/2+22;
  for(const constraint of this.level.constraints){const [ar,ac]=constraint.a,[br,bc]=constraint.b,x=start+((ac+bc)/2+.5)*this.tile,y=start+((ar+br)/2+.5)*this.tile;const bg=this.scene.add.circle(x,y,this.tile*.14,0x796488).setStrokeStyle(2,0xffffff);const t=label(this.scene,x,y-1,constraint.type==='same'?'=':'×',this.tile*.23,'#ffffff',0);this.add([bg,t]);}
 }

 restore(grid:Grid){
  if(grid.length!==this.level.size||grid.some((row,r)=>row.length!==this.level.size||row.some((v,c)=>![0,1,2].includes(v)||(this.level.initial[r]![c]!==EMPTY&&v!==this.level.initial[r]![c])||(v!==EMPTY&&v!==this.level.solution[r]![c]))))return;
  for(const cell of this.cells){this.grid[cell.r]![cell.c]=grid[cell.r]![cell.c]!;this.setCat(cell,this.grid[cell.r]![cell.c]!,false);this.paintCell(cell);}
 }

 reveal(position:Position,value:CellValue){
  const cell=this.cells.find(x=>x.r===position[0]&&x.c===position[1]);if(!cell||cell.preset||this.locked||this.grid[cell.r]![cell.c]!==EMPTY)return;
  this.grid[cell.r]![cell.c]=value;this.paintCell(cell,true);this.setCat(cell,value);sparkles(this.scene,this.x+cell.container.x,this.y+cell.container.y,6);this.onChanged?.();
 }

 isComplete(){return validateGrid(this.grid,this.level.constraints,true).valid&&this.grid.flat().every(v=>v!==EMPTY);}
}
