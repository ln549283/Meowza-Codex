import { EMPTY, GREY, ORANGE, cloneGrid, type CellValue, type FilledValue, type Grid, type Level, type Position } from './model';
import { validateGrid } from './validator';

function candidates(grid:Grid,level:Pick<Level,'constraints'>,r:number,c:number):FilledValue[]{
  const values:FilledValue[]=[GREY,ORANGE];
  return values.filter(v=>{grid[r]![c]=v;const ok=validateGrid(grid,level.constraints).valid;grid[r]![c]=EMPTY;return ok;});
}
function choose(grid:Grid,level:Pick<Level,'constraints'>):{pos:Position;values:FilledValue[]}|null{
  let best:{pos:Position;values:FilledValue[]}|null=null;
  for(let r=0;r<grid.length;r++)for(let c=0;c<grid.length;c++)if(grid[r]![c]===EMPTY){const values=candidates(grid,level,r,c);if(!best||values.length<best.values.length)best={pos:[r,c],values};if(values.length<2)return best;}
  return best;
}
export function solveGrid(initial:Grid,constraints:Level['constraints']=[]):Grid|null{
  const grid=cloneGrid(initial);
  const walk=():boolean=>{const next=choose(grid,{constraints});if(!next)return validateGrid(grid,constraints,true).valid;const [r,c]=next.pos;for(const v of next.values){grid[r]![c]=v;if(walk())return true;}grid[r]![c]=EMPTY;return false;};
  return walk()?grid:null;
}
export function countSolutions(initial:Grid,constraints:Level['constraints']=[],limit=2):number{
  const grid=cloneGrid(initial);let total=0;
  const walk=()=>{if(total>=limit)return;const next=choose(grid,{constraints});if(!next){if(validateGrid(grid,constraints,true).valid)total++;return;}const [r,c]=next.pos;for(const v of next.values){grid[r]![c]=v;walk();}grid[r]![c]=EMPTY;};walk();return total;
}
export function findHint(grid:Grid,level:Level):{position:Position;value:CellValue}|null{
  for(let r=0;r<grid.length;r++)for(let c=0;c<grid.length;c++)if(grid[r]![c]===EMPTY){const possible=candidates(grid,{constraints:level.constraints},r,c);if(possible.length===1)return{position:[r,c],value:possible[0]!};}
  const solution=solveGrid(grid,level.constraints);if(!solution)return null;
  for(let r=0;r<grid.length;r++)for(let c=0;c<grid.length;c++)if(grid[r]![c]===EMPTY)return{position:[r,c],value:solution[r]![c]!};return null;
}
