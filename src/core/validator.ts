import { EMPTY, type Constraint, type Grid, type Level, type Position, type ValidationResult } from './model';
import { affectedErrors, areAdjacent, constraintIsValid, lineIsValid } from './rules';

export function validateGrid(grid: Grid, constraints: readonly Constraint[] = [], requireComplete=false): ValidationResult {
  const reasons:string[]=[]; const size=grid.length;
  if (![4,6,8].includes(size) || grid.some(r=>r.length!==size)) reasons.push('dimension');
  if (grid.some(r=>r.some(v=>v!==0&&v!==1&&v!==2))) reasons.push('value');
  grid.forEach((r,i)=>{if(!lineIsValid(r,requireComplete))reasons.push(`row:${i}`)});
  for(let c=0;c<size;c++) if(!lineIsValid(grid.map(r=>r[c]??EMPTY),requireComplete)) reasons.push(`column:${c}`);
  constraints.forEach((x,i)=>{if(!areAdjacent(x.a,x.b)||!constraintIsValid(grid,x))reasons.push(`constraint:${i}`)});
  const complete=!grid.some(r=>r.includes(EMPTY));
  return {valid:reasons.length===0&&(!requireComplete||complete),complete,errors:affectedErrors(grid,constraints),reasons};
}
export function validateLevelShape(level:Level): string[] {
  const errors:string[]=[];
  if(level.initial.length!==level.size||level.solution.length!==level.size)errors.push('size mismatch');
  if(!validateGrid(level.solution,level.constraints,true).valid)errors.push('invalid solution');
  level.initial.forEach((row,r)=>row.forEach((v,c)=>{if(v!==EMPTY&&v!==level.solution[r]?.[c])errors.push(`bad clue ${r},${c}`)}));
  return errors;
}
export function isWon(grid:Grid,constraints:readonly Constraint[]):boolean{return validateGrid(grid,constraints,true).valid;}
export function includesPosition(list:readonly Position[],r:number,c:number):boolean{return list.some(([rr,cc])=>rr===r&&cc===c);}
