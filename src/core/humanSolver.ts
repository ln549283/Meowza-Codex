import { cloneGrid, otherValue, type Grid, type Constraint, type FilledValue, type Position } from './model';
import { validateGrid } from './validator';
export interface HumanStep {
 position: Position; value: FilledValue; rule: 'balance'|'triple'|'relation'|'contradiction';
 explanation: string; sources: Position[]; assumption?: FilledValue; consequences?: HumanStep[]; contradiction?: string;
}
const cat=(v:FilledValue)=>v===1?'gris':'roux';
const cell=([r,c]:Position)=>`L${r+1} · C${c+1}`;
/** Direct rules only. Never reads a solution or calls the backtracking solver. */
export function directHint(grid:Grid,constraints:readonly Constraint[]):HumanStep|null {
 const n=grid.length;
 for(const link of constraints){for(const [from,to] of [[link.a,link.b],[link.b,link.a]] as const){const v=grid[from[0]]![from[1]];if(v&&grid[to[0]]![to[1]]===0){const value=link.type==='same'?v:otherValue(v);return{position:to,value,rule:'relation',sources:[from],explanation:`${cell(from)} contient un chat ${cat(v)}. ${link.type==='same'?'Le cœur relie deux chats identiques':'Les griffes relient deux chats opposés'} : place un chat ${cat(value)} en ${cell(to)}.`};}}}
 for(const vertical of [false,true])for(let i=0;i<n;i++){
  const positions:Position[]=Array.from({length:n},(_,j)=>vertical?[j,i]:[i,j]);const values=positions.map(([r,c])=>grid[r]![c]!);const name=`${vertical?'colonne':'ligne'} ${i+1}`;
  for(const value of [1,2] as const)if(values.filter(v=>v===value).length===n/2){const j=values.indexOf(0);if(j>=0)return{position:positions[j]!,value:otherValue(value),rule:'balance',sources:positions.filter((_,k)=>values[k]===value),explanation:`La ${name} a déjà ses ${n/2} chats ${cat(value)}. Les cases restantes doivent être ${cat(otherValue(value))} : ${cell(positions[j]!)} en fait partie.`};}
  for(let j=0;j<n-2;j++){const trio=values.slice(j,j+3);if(trio.filter(v=>v===0).length!==1)continue;const filled=trio.filter((v):v is FilledValue=>v!==0);if(filled[0]===filled[1]){const pos=positions[j+trio.indexOf(0)]!,value=otherValue(filled[0]!);return{position:pos,value,rule:'triple',sources:positions.slice(j,j+3).filter(p=>p!==pos),explanation:`Dans la ${name}, ces deux chats ${cat(filled[0]!)} formeraient un trio. Il faut un chat ${cat(value)} en ${cell(pos)}.`};}}
 }
 return null;
}
function contradictionText(grid:Grid,constraints:readonly Constraint[]):string|null {
 const result=validateGrid(grid,constraints);if(result.valid)return null;
 const reason=result.reasons[0]??'';const [kind,index]=reason.split(':');
 if(kind==='constraint')return 'Le lien entre deux chats est contredit.';
 if(kind==='row'||kind==='column')return `La ${kind==='row'?'ligne':'colonne'} ${Number(index)+1} ne respecte plus l’équilibre ou contient trois chats identiques.`;
 return 'La grille contient une contradiction.';
}
export interface HumanResult { grid:Grid; steps:HumanStep[]; status:'solved'|'stuck'|'contradiction'|'budget'; contradiction?:string; }
interface Budget { left:number; maxChain?:number }
function propagate(initial:Grid,constraints:readonly Constraint[],depth:number,budget:Budget,maxSteps=Infinity):HumanResult {
 const grid=cloneGrid(initial),steps:HumanStep[]=[];
 while(budget.left-->0){
  const invalid=contradictionText(grid,constraints);if(invalid)return{grid,steps,status:'contradiction',contradiction:invalid};
  if(grid.every(row=>row.every(Boolean)))return{grid,steps,status:'solved'};
  if(steps.length>=maxSteps)return{grid,steps,status:'stuck'};
  let step=directHint(grid,constraints);
  if(!step&&depth>0)step=failedAssumption(grid,constraints,depth,budget);
  if(!step)return{grid,steps,status:budget.left<=0?'budget':'stuck'};
  grid[step.position[0]]![step.position[1]]=step.value;steps.push(step);
 }
 return{grid,steps,status:'budget'};
}
function failedAssumption(grid:Grid,constraints:readonly Constraint[],depth:number,budget:Budget):HumanStep|null {
 for(let r=0;r<grid.length;r++)for(let c=0;c<grid.length;c++)if(grid[r]![c]===0)for(const value of [1,2] as const){
  if(budget.left<=0)return null;
  const trial=cloneGrid(grid);trial[r]![c]=value;
  const result=propagate(trial,constraints,depth-1,budget,budget.maxChain);
  if(result.status==='contradiction'&&result.steps.length<=(budget.maxChain??Infinity))return{position:[r,c],value:otherValue(value),rule:'contradiction',sources:[],assumption:value,consequences:result.steps,contradiction:result.contradiction!,explanation:`Si ${cell([r,c])} était ${cat(value)}, ${result.steps.length} déduction${result.steps.length>1?'s':''} mènerai${result.steps.length>1?'ent':'t'} à une contradiction. Cette case est donc forcément ${cat(otherValue(value))}.`};
 }
 return null;
}
export function humanSolve(grid:Grid,constraints:readonly Constraint[]=[],maxDepth=1,maxWork=30000,maxChain=5):HumanResult{return propagate(grid,constraints,maxDepth,{left:maxWork,maxChain});}
export function humanHint(grid:Grid,constraints:readonly Constraint[]=[],maxDepth=1):HumanStep|null {
 if(contradictionText(grid,constraints))return null;
 return directHint(grid,constraints)??(maxDepth>0?failedAssumption(grid,constraints,maxDepth,{left:30000,maxChain:5}):null);
}
export function humanMetrics(grid:Grid,constraints:readonly Constraint[],depth=1){
 const result=humanSolve(grid,constraints,depth); const assumptions=result.steps.filter(s=>s.rule==='contradiction');
 return{solved:result.status==='solved',deductions:result.steps.length,assumptions:assumptions.length,maxChain:Math.max(0,...assumptions.map(s=>s.consequences?.length??0))};
}
