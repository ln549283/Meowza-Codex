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

const levelX:Record<string,number[]>={
 'intro-vertical':[365,705,365],
 'branch-left':[285,430,300],
 'hammock-right':[790,650,790],
 'milestone-10':[330],
 'breather-right':[780,640,790],
 'branch-left-2':[300,445,300],
 split:[315,765,540],
 'milestone-20':[750],
 'outro-21':[405],
};

export function chunkSlot(level:number){
 const chunk=chunkForLevel(level);if(!chunk)return undefined;
 const i=chunk.levels.indexOf(level),count=chunk.levels.length;
 const xs=levelX[chunk.id]??[540];
 return {x:xs[Math.min(i,xs.length-1)]??540,y:0,chunk,index:i,count};
}

export const TREE_SLICE_MAX=21;
