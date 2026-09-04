import { EMPTY, GREY, ORANGE, cloneGrid, type Constraint, type Difficulty, type FilledValue, type Grid, type Level } from './model';
import { countSolutions } from './solver';
import { validateGrid } from './validator';

export class SeededRandom { private state:number; constructor(seed:number){this.state=seed>>>0;} next(){this.state=(this.state*1664525+1013904223)>>>0;return this.state/4294967296;} int(max:number){return Math.floor(this.next()*max);} shuffle<T>(items:T[]):T[]{for(let i=items.length-1;i>0;i--){const j=this.int(i+1);[items[i],items[j]]=[items[j]!,items[i]!];}return items;} }

function makeSolution(size:4|6|8,rng:SeededRandom):Grid{
  const grid:Grid=Array.from({length:size},()=>Array<CellValueCompat>(size).fill(EMPTY) as Grid[number]);
  const walk=(at:number):boolean=>{if(at===size*size)return validateGrid(grid,[],true).valid;const r=Math.floor(at/size),c=at%size;const values=rng.shuffle<FilledValue>([GREY,ORANGE]);for(const v of values){grid[r]![c]=v;if(validateGrid(grid).valid&&walk(at+1))return true;}grid[r]![c]=EMPTY;return false;};
  if(!walk(0))throw new Error('Unable to generate solution');return grid;
}
type CellValueCompat=0|1|2;
function makeConstraints(solution:Grid,rng:SeededRandom,count:number):Constraint[]{
  const pairs:Constraint[]=[];const size=solution.length;
  for(let r=0;r<size;r++)for(let c=0;c<size;c++){if(c+1<size)pairs.push({a:[r,c],b:[r,c+1],type:solution[r]![c]===solution[r]![c+1]?'same':'different'});if(r+1<size)pairs.push({a:[r,c],b:[r+1,c],type:solution[r]![c]===solution[r+1]![c]?'same':'different'});}
  return rng.shuffle(pairs).slice(0,count);
}
export function generateLevel(id:string,difficulty:Difficulty,size:4|6|8,seed:number):Level{
  const rng=new SeededRandom(seed);const solution=makeSolution(size,rng);const constraints=makeConstraints(solution,rng,Math.max(2,Math.floor(size*0.7)));const initial=cloneGrid(solution);
  const cells=rng.shuffle(Array.from({length:size*size},(_,i)=>i));const minClues=Math.ceil(size*size*(difficulty==='easy'?.42:difficulty==='medium'?.34:.28));
  for(const cell of cells){if(initial.flat().filter(v=>v!==EMPTY).length<=minClues)break;const r=Math.floor(cell/size),c=cell%size,old=initial[r]![c]!;initial[r]![c]=EMPTY;if(countSolutions(initial,constraints,2)!==1)initial[r]![c]=old;}
  return{id,difficulty,size,initial,solution,constraints};
}
export function generateBank():Level[]{
  const specs:[Difficulty,4|6|8,number][]=[['easy',4,20],['medium',6,30],['hard',8,30]];const levels:Level[]=[];let seed=0x4d454f57;
  for(const [difficulty,size,count] of specs)for(let i=1;i<=count;i++){seed=(seed+0x9e3779b9)>>>0;levels.push(generateLevel(`${difficulty}-${String(i).padStart(2,'0')}`,difficulty,size,seed));}
  return levels;
}
