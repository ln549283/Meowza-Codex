import {CHUNKS,chunkForIndex,treeAnchor,visibleChunks} from './treeChunks';
export const treeY=(level:number,offset:number)=>1040+treeAnchor(level).y+offset;
export const treeFocus=(current:number)=>Math.max(0,-treeAnchor(current).y);
export const treeLimit=(current:number)=>treeFocus(current)+180;
export function visibleTreeLevels(current:number,offset:number){
 return visibleChunks(offset,current).flatMap(i=>{const c=chunkForIndex(i);return CHUNKS[c.kind].slots.map((_,j)=>c.first+j);}).filter(n=>n<=current&&treeY(n,offset)>-150&&treeY(n,offset)<1950);
}
