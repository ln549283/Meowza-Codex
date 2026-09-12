export const TREE_STEP=370;
export const treeY=(level:number,offset:number)=>1080-(level-1)*TREE_STEP+offset;
export const treeLimit=(current:number)=>Math.max(0,(current-1)*TREE_STEP+120);
export const treeFocus=(current:number)=>Math.max(0,(current-1)*TREE_STEP);
export function visibleTreeLevels(current:number,offset:number){
 const first=Math.max(1,Math.ceil((1080+offset-2120)/TREE_STEP)+1);
 const last=Math.min(current,Math.floor((1080+offset+300)/TREE_STEP)+1);
 return Array.from({length:Math.max(0,last-first+1)},(_,i)=>first+i);
}
