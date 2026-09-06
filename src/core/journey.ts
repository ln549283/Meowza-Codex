import type { Difficulty,Level } from './model';
import { generateLevel,SeededRandom } from './generator';
import { humanSolve } from './humanSolver';
export const JOURNEY_VERSION=1;
export const journeyId=(n:number)=>`trail-${n}`;
export const challengeId=(refuge:number)=>`bonus-${refuge}`;
export function nextSummit(progress:Record<string,{completed:boolean}>){let n=1;while(progress[journeyId(n)]?.completed)n++;return n;}
export function journeySpec(n:number,bonus=false):{difficulty:Difficulty;size:4|6|8;depth:number;clueRatio:number}{
 if(!Number.isSafeInteger(n)||n<1)throw new Error('Invalid summit');
 if(bonus)return{difficulty:'extreme',size:8,depth:1,clueRatio:.16};
 const cycle:Difficulty[]=n<=12?['easy','easy','medium','easy','medium','easy']:n<=36?['easy','medium','medium','easy','hard','easy']:['medium','medium','hard','easy','hard','medium'];
 const difficulty=cycle[(n-1)%6]!;
 return difficulty==='easy'?{difficulty,size:4,depth:0,clueRatio:.56}:difficulty==='medium'?{difficulty,size:n<=18?4:6,depth:0,clueRatio:n<=18?.44:.56}:{difficulty,size:6,depth:1,clueRatio:.32};
}
/** Versioned seed + saved output keep replay stable. Every removed clue is human-solvable. */
function candidate(n:number,bonus:boolean,attempt:number):Level{
 const spec=journeySpec(n,bonus),seed=(Math.imul(n,0x9e3779b1)^(bonus?0x43415453:0x4d454f57)^Math.imul(attempt,0x85ebca6b))>>>0;
 const base=generateLevel(bonus?challengeId(n):journeyId(n),spec.difficulty,spec.size,seed);
 const initial=base.solution.map(row=>[...row]),rng=new SeededRandom(seed^0x50415753);
 const cells=rng.shuffle(Array.from({length:spec.size**2},(_,i)=>i));let clues=cells.length;
 for(const index of cells){if(clues<=Math.ceil(cells.length*spec.clueRatio))break;const r=Math.floor(index/spec.size),c=index%spec.size,old=initial[r]![c]!;initial[r]![c]=0;
  const proof=humanSolve(initial,base.constraints,spec.depth,12000);
  if(proof.status==='solved')clues--;else initial[r]![c]=old;
 }
 return{...base,initial};
}
export const refugeNames=['Le hamac pêche','La cabane lavande','Le coussin nuage','Le balcon des ronrons'];

export function generateJourneyLevel(n:number,bonus=false):Level{
 for(let attempt=0;attempt<(bonus?32:1);attempt++){const level=candidate(n,bonus,attempt);if(!bonus||humanSolve(level.initial,level.constraints,0).status!=='solved')return level;}
 throw new Error('Aucun défi suffisamment corsé trouvé pour cette graine.');
}
