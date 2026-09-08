import test from 'node:test';
import assert from 'node:assert/strict';
import { generateJourneyLevel } from './journey';
import { currentLesson,lessonPlan } from './onboarding';
import { cloneGrid } from './model';
import { validateGrid } from './validator';

test('tutorial explains balance, same, triples, then different using visible premises',()=>{
 for(let n=1;n<=4;n++){
  const level=generateJourneyLevel(n),initial=cloneGrid(level.initial),plan=lessonPlan(level),grid=cloneGrid(initial);
  assert.ok(plan.length>0,`lesson ${n}`);
  assert.equal(plan[0]!.rule,n===1?'balance':n===3?'triple':'relation');
  if(n===4)assert.ok(plan.at(-1)!.explanation.includes('griffes'));
  for(const s of plan){
   assert.deepEqual(currentLesson(plan,grid),s);
   assert.ok(s.sources.every(([r,c])=>grid[r]![c]!==0));
   assert.equal(s.value,level.solution[s.position[0]]![s.position[1]]);
   grid[s.position[0]]![s.position[1]]=s.value;
   assert.ok(validateGrid(grid,level.constraints).valid);
  }
  assert.equal(currentLesson(plan,grid),null);assert.deepEqual(level.initial,initial);
 }
});
test('guidance never reads the hidden solution and stops at the independent fifth grid',()=>{
 const level=generateJourneyLevel(1);
 Object.defineProperty(level,'solution',{get(){throw new Error('hidden solution read');}});
 assert.ok(lessonPlan(level).length>0);
 for(const n of [5,6,24,33])assert.deepEqual(lessonPlan(generateJourneyLevel(n)),[]);
});
test('resume or solving a different cell skips already completed tutorial targets',()=>{
 const level=generateJourneyLevel(1),plan=lessonPlan(level),grid=cloneGrid(level.initial);
 const last=plan.at(-1)!;grid[last.position[0]]![last.position[1]]=last.value;
 assert.deepEqual(currentLesson(plan,grid),plan[0]);
 for(const s of plan.slice(0,-1))grid[s.position[0]]![s.position[1]]=s.value;
 assert.equal(currentLesson(plan,grid),null);
});

test('authored difficulty proportions use explicit rounding and timed recovery',async()=>{
 const {journeySpec}=await import('./journey');
 const tally=(start:number,end:number)=>{const counts={easy:0,medium:0,hard:0,extreme:0,timed:0};for(let n=start;n<=end;n++){const s=journeySpec(n);counts[s.timed?'timed':s.difficulty]++;}return counts;};
 assert.deepEqual(tally(6,20),{easy:5,medium:9,hard:1,extreme:0,timed:0});
 assert.deepEqual(tally(21,50),{easy:2,medium:15,hard:7,extreme:4,timed:2});
 assert.deepEqual(tally(51,100),{easy:0,medium:10,hard:23,extreme:12,timed:5});
 assert.deepEqual(tally(101,150),tally(51,100));
 let seenExtreme=false;
 for(let n=1;n<=1000;n++){const s=journeySpec(n);if(s.timed){assert.ok(seenExtreme);assert.equal(journeySpec(n+1).difficulty,'medium');assert.ok(!journeySpec(n+1).timed);}else if(s.difficulty==='extreme')seenExtreme=true;}
});
