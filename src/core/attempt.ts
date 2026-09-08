import { EMPTY,type CellValue,type Grid,type Level,type Position } from './model';

export const MAX_ERRORS=3;
export type PlacementResult='ignored'|'accepted'|'error'|'defeat';

/** Pure validation shared by the board and tests. Accepted cats stay in place. */
export function judgePlacement(level:Level,grid:Grid,errors:number,position:Position,value:CellValue):PlacementResult {
 const [r,c]=position;
 if(errors>=MAX_ERRORS||!Number.isInteger(r)||!Number.isInteger(c)||
    grid[r]?.[c]!==EMPTY||level.initial[r]?.[c]!==EMPTY||
    (value!==1&&value!==2))return 'ignored';
 if(value===level.solution[r]?.[c])return 'accepted';
 return errors+1>=MAX_ERRORS?'defeat':'error';
}
