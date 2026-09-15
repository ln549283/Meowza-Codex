/** Authored anchors measured on the approved artwork. Coordinates are source pixels. */
export type ChunkKind='base'|'a'|'b';
export const CHUNK_SCALE=.9;
export const CHUNK_X=90; // Source trunk x=500 -> stage x=540.
export const CHUNKS={
 base:{height:1536,slots:[{x:275,y:822},{x:842,y:716},{x:780,y:310},{x:212,y:182}]},
 a:{height:1280,slots:[{x:275,y:978},{x:752,y:580},{x:253,y:262}]},
 b:{height:1152,slots:[{x:188,y:748},{x:776,y:493},{x:713,y:189}]},
} as const;
export const BASE_TOP=-CHUNKS.base.slots[0].y*CHUNK_SCALE;
const PAIR_HEIGHT=(CHUNKS.a.height+CHUNKS.b.height)*CHUNK_SCALE;
export function chunkForIndex(index:number){
 const kind:ChunkKind=index===0?'base':index%2?'a':'b';
 const pair=Math.floor((index-1)/2);
 const top=index===0?BASE_TOP:BASE_TOP-pair*PAIR_HEIGHT-(kind==='a'?CHUNKS.a.height:CHUNKS.a.height+CHUNKS.b.height)*CHUNK_SCALE;
 return {index,kind,top,height:CHUNKS[kind].height*CHUNK_SCALE,first:index===0?1:5+(index-1)*3};
}
export function treeAnchor(level:number){
 if(!Number.isSafeInteger(level)||level<1)throw new Error('Invalid tree level');
 const index=level<=4?0:Math.floor((level-5)/3)+1,chunk=chunkForIndex(index);
 const slot=CHUNKS[chunk.kind].slots[level-chunk.first]!;
 return {x:CHUNK_X+slot.x*CHUNK_SCALE,y:chunk.top+slot.y*CHUNK_SCALE,chunk:index};
}
/** O(1) window lookup; never iterates over completed levels. */
export function visibleChunks(offset:number,current:number,height=1920){
 const focusIndex=treeAnchor(current).chunk;
 const approximate=Math.max(0,Math.floor((offset+BASE_TOP)/PAIR_HEIGHT)*2);
 const indices:number[]=[];
 for(let i=Math.max(0,approximate-4);i<=Math.min(focusIndex+2,approximate+8);i++){
  const c=chunkForIndex(i),top=1040+c.top+offset;
  if(top<height+100&&top+c.height>-250)indices.push(i);
 }
 return indices;
}
