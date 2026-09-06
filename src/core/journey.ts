import type { Difficulty,Level } from './model';
import { generateLevel,SeededRandom } from './generator';
import { humanSolve } from './humanSolver';
export const JOURNEY_VERSION=3;
export const journeyId=(n:number)=>`trail-${n}`;
export const challengeId=(refuge:number)=>`bonus-${refuge}`;
export function nextSummit(progress:Record<string,{completed:boolean}>){let n=1;while(progress[journeyId(n)]?.completed)n++;return n;}
type Kind=Difficulty|'timed';
// Authored sequences preserve quotas while separating intense levels with recovery.
const EARLY:Kind[]=['medium','easy','medium','medium','easy','medium','medium','easy','medium','hard','medium','easy','medium','easy','medium'];
const MIDDLE:Kind[]=['medium','hard','medium','extreme','medium','hard','medium','easy','medium','hard','extreme','medium','timed','medium','hard','medium','extreme','medium','hard','medium','easy','hard','medium','extreme','medium','hard','medium','medium','timed','medium'];
const LATE:Kind[]=['hard','extreme','hard','timed','medium','hard','extreme','hard','hard','medium','extreme','hard','extreme','hard','medium','hard','extreme','timed','medium','hard','extreme','hard','hard','extreme','hard','timed','medium','hard','extreme','hard','medium','hard','extreme','hard','timed','medium','hard','extreme','hard','hard','medium','extreme','hard','extreme','hard','timed','medium','hard','hard','medium'];
export function journeySpec(n:number,bonus=false):{difficulty:Difficulty;size:4|6|8;depth:number;clueRatio:number;timed?:boolean}{
 if(!Number.isSafeInteger(n)||n<1)throw new Error('Invalid summit');
 const kind:Kind=bonus?'extreme':n<=5?'easy':n<=20?EARLY[n-6]!:n<=50?MIDDLE[n-21]!:LATE[(n-51)%50]!;
 const difficulty=kind==='timed'?'extreme':kind;
 return difficulty==='easy'?{difficulty,size:4,depth:0,clueRatio:n===1?.75:.56}:difficulty==='medium'?{difficulty,size:n<20?4:6,depth:0,clueRatio:n<20?.44:.56}:difficulty==='hard'?{difficulty,size:6,depth:1,clueRatio:.32}:{difficulty,size:8,depth:1,clueRatio:.28,timed:kind==='timed'};
}
/** Versioned seed + saved output keep replay stable. Every removed clue is human-solvable. */
function candidate(n:number,bonus:boolean,attempt:number):Level{
 const spec=journeySpec(n,bonus),seed=(Math.imul(n,0x9e3779b1)^(bonus?0x43415453:0x4d454f57)^Math.imul(attempt,0x85ebca6b))>>>0;
 const base=generateLevel(bonus?challengeId(n):journeyId(n),spec.difficulty,spec.size,seed);
 if(!bonus&&n<=5){
  const pairs:typeof base.constraints=[];
  for(let r=0;r<4;r++)for(let c=0;c<3;c++)pairs.push({a:[r,c],b:[r,c+1],type:base.solution[r]![c]===base.solution[r]![c+1]?'same':'different'});
  base.constraints=n===1?[]:n<=3?pairs.filter(p=>p.type==='same').slice(0,n-1):[...pairs.filter(p=>p.type==='same').slice(0,2),...pairs.filter(p=>p.type==='different').slice(0,n-3)];
 }
 const initial=base.solution.map(row=>[...row]),rng=new SeededRandom(seed^0x50415753);
 const cells=rng.shuffle(Array.from({length:spec.size**2},(_,i)=>i));let clues=cells.length;
 for(const index of cells){if(clues<=Math.ceil(cells.length*spec.clueRatio))break;const r=Math.floor(index/spec.size),c=index%spec.size,old=initial[r]![c]!;initial[r]![c]=0;
  const proof=humanSolve(initial,base.constraints,spec.depth,12000);
  if(proof.status==='solved'&&proof.steps.filter(s=>s.rule==='contradiction').length<=3)clues--;else initial[r]![c]=old;
 }
 return{...base,initial,...(spec.timed?{timed:true,timeLimit:360}:{})};
}
export const refugeNames=['Le hamac pêche','La cabane lavande','Le coussin nuage','Le balcon des ronrons'];

export function generateJourneyLevel(n:number,bonus=false):Level{
 const extreme=journeySpec(n,bonus).difficulty==='extreme';
 for(let attempt=0;attempt<(extreme?64:1);attempt++){const level=candidate(n,bonus,attempt);if(!extreme||humanSolve(level.initial,level.constraints,0).status!=='solved')return level;}
 throw new Error('Aucun défi suffisamment corsé trouvé pour cette graine.');
}
