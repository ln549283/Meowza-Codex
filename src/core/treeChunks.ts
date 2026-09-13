export type ChunkSilhouette='vertical'|'left'|'right'|'wide'|'split';

export interface TreeChunkSpec{
 id:string;
 levels:number[];
 silhouette:ChunkSilhouette;
 variant:0|1|2;
 decor:string[];
 habitatSide?:'left'|'right';
}

const CHUNKS:TreeChunkSpec[]=[
 {id:'intro-vertical',levels:[1,2,3],silhouette:'vertical',variant:0,decor:['tree-plant']},
 {id:'branch-left',levels:[4,5,6],silhouette:'left',variant:1,decor:['tree-yarn']},
 {id:'hammock-right',levels:[7,8,9],silhouette:'right',variant:0,decor:['tree-hammock-lilac']},
 {id:'milestone-10',levels:[10],silhouette:'wide',variant:2,decor:['tree-plant'],habitatSide:'right'},
 {id:'breather-right',levels:[11,12,13],silhouette:'right',variant:1,decor:['tree-hanging-plant']},
 {id:'branch-left-2',levels:[14,15,16],silhouette:'left',variant:2,decor:['tree-yarn']},
 {id:'split',levels:[17,18,19],silhouette:'split',variant:0,decor:['tree-hammock-peach']},
 {id:'milestone-20',levels:[20],silhouette:'wide',variant:1,decor:['tree-hanging-plant'],habitatSide:'left'},
 {id:'outro-21',levels:[21],silhouette:'vertical',variant:2,decor:[]},
];

export const chunkForLevel=(level:number):TreeChunkSpec|undefined=>CHUNKS.find(c=>c.levels.includes(level));

export function chunkSlot(level:number){
 const chunk=chunkForLevel(level);if(!chunk)return undefined;
 const i=chunk.levels.indexOf(level),count=chunk.levels.length;
 const slotsBySilhouette:Record<ChunkSilhouette,Array<{x:number;y:number}>>={
  vertical:[{x:395,y:0},{x:685,y:6},{x:395,y:12},{x:685,y:18}],
  left:[{x:300,y:0},{x:430,y:6},{x:300,y:12},{x:440,y:18}],
  right:[{x:780,y:0},{x:650,y:6},{x:780,y:12},{x:640,y:18}],
  wide:[{x:330,y:0},{x:750,y:0},{x:540,y:10},{x:540,y:18}],
  split:[{x:320,y:0},{x:760,y:0},{x:540,y:10},{x:540,y:18}],
 };
 const slots=slotsBySilhouette[chunk.silhouette];
 return {...slots[Math.min(i,slots.length-1)]!,chunk,index:i,count};
}

export const TREE_SLICE_MAX=21;
