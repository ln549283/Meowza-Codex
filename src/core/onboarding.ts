import { directHint, humanSolve, type HumanStep } from './humanSolver';
import { cloneGrid, otherValue, type Grid, type Level, type Position } from './model';

type LessonLevel=Pick<Level,'id'|'initial'|'constraints'>;
/** Tutorial deductions use visible givens only; no solution is accepted here. */
export function lessonPlan(level:LessonLevel):HumanStep[]{
 const n=Number(level.id.replace('trail-',''));
 if(!level.id.startsWith('trail-')||n<1||n>4)return [];
 if(n===1)return humanSolve(level.initial,level.constraints,0).steps;
 if(n===2){const s=directHint(level.initial,level.constraints.filter(c=>c.type==='same'));return s?.rule==='relation'?[s]:[];}
 if(n===3){
  const grid=level.initial,size=grid.length;
  for(const vertical of [false,true])for(let line=0;line<size;line++)for(let start=0;start<size-2;start++){
   const cells:Position[]=Array.from({length:3},(_,j)=>vertical?[start+j,line]:[line,start+j]);
   const empty=cells.filter(([r,c])=>grid[r]![c]===0),sources=cells.filter(([r,c])=>grid[r]![c]!==0);
   if(empty.length!==1||sources.length!==2)continue;
   const value=grid[sources[0]![0]]![sources[0]![1]];
   if(!value||value!==grid[sources[1]![0]]![sources[1]![1]])continue;
   return [{position:empty[0]!,value:otherValue(value),rule:'triple',sources,explanation:`Ces deux chats ${value===1?'gris':'roux'} ne peuvent pas être suivis d’un troisième. La case encadrée accueille un chat ${value===1?'roux':'gris'}.`}];
  }
  return [];
 }
 const grid=cloneGrid(level.initial),plan:HumanStep[]=[];
 for(let i=0;i<grid.length**2;i++){
  const different=directHint(grid,level.constraints.filter(c=>c.type==='different'));
  const step=different?.rule==='relation'?different:directHint(grid,level.constraints);
  if(!step)break;
  plan.push(step);grid[step.position[0]]![step.position[1]]=step.value;
  if(different?.rule==='relation')break;
 }
 return plan;
}
export function currentLesson(plan:readonly HumanStep[],grid:Grid){return plan.find(s=>grid[s.position[0]]?.[s.position[1]]===0)??null;}
export function lessonText(step:HumanStep,n:number){
 const name=step.value===1?'Nimbus':'Moka';
 const row=step.sources.every(p=>p[0]===step.position[0]);
 const line=`${row?'ligne':'colonne'} ${step.position[row?0:1]+1}`;
 return n===1?`2 gris + 2 roux par ligne et colonne.
La ${line} a déjà 2 chats ${step.value===1?'roux':'gris'}.
Choisis ${name}, puis la case encadrée.`:step.explanation;
}
