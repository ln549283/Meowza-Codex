import test from 'node:test';
import assert from 'node:assert/strict';
import { directHint,humanHint,humanSolve } from './humanSolver';
import { countSolutions } from './solver';
import { generateJourneyLevel,journeySpec,nextSummit } from './journey';
import { cloneGrid } from './model';
import levels from '../data/levels.json';
import type { Level } from './model';
test('human deductions are explicit, immutable and never read a solution',()=>{
 const grid=cloneGrid((levels[0] as unknown as Level).initial),before=cloneGrid(grid);const hint=directHint(grid,(levels[0] as unknown as Level).constraints);assert.ok(hint);assert.ok(hint.explanation.length>20);assert.deepEqual(grid,before);
});
test('contradiction proof eliminates a value with direct consequences',()=>{
 const level=(levels as unknown as Level[]).find(l=>humanSolve(l.initial,l.constraints,0).status==='stuck'&&humanSolve(l.initial,l.constraints,1).steps.some(s=>s.rule==='contradiction'))!;assert.ok(level);
 const result=humanSolve(level.initial,level.constraints,1);assert.equal(result.status,'solved');assert.deepEqual(result.grid,level.solution);
 for(const step of result.steps){assert.equal(step.value,level.solution[step.position[0]]![step.position[1]]);if(step.rule==='contradiction'){assert.ok(step.contradiction);assert.ok(step.assumption);}}
});
test('ambiguous grids do not produce guesses; invalid grids do not produce hints',()=>{
 const empty=Array.from({length:4},()=>[0,0,0,0] as (0|1|2)[]);assert.equal(humanHint(empty,[],1),null);assert.equal(humanSolve(empty,[],1).status,'stuck');empty[0]=[1,1,1,0];assert.equal(humanHint(empty,[]),null);
});
test('journey samples are unique, deterministic, human-solvable and calibrated',()=>{
 for(const n of [1,3,5,13,17,20,23,38,41,73,1001]){
  const level=generateJourneyLevel(n),spec=journeySpec(n),result=humanSolve(level.initial,level.constraints,spec.depth);
  assert.equal(result.status,'solved',`summit ${n}`);assert.deepEqual(result.grid,level.solution);assert.equal(countSolutions(level.initial,level.constraints),1);assert.deepEqual(generateJourneyLevel(n),level);
  if(spec.depth===0)assert.ok(result.steps.every(s=>s.rule!=='contradiction'));
 }
 const bonus=generateJourneyLevel(1,true);assert.equal(humanSolve(bonus.initial,bonus.constraints,1).status,'solved');assert.equal(humanSolve(bonus.initial,bonus.constraints,0).status,'stuck');assert.equal(countSolutions(bonus.initial,bonus.constraints),1);
 assert.equal(journeySpec(3).size,4);assert.equal(journeySpec(20).size,6);assert.equal(nextSummit({'trail-1':{completed:true},'bonus-1':{completed:true}}),2);
});

test('one tree unlocks sequentially, bonuses are optional and old progress survives',async()=>{
 const {isLevelUnlocked}=await import('./progression');const p=Object.fromEntries(Array.from({length:6},(_,i)=>[`trail-${i+1}`,{completed:true}]));
 assert.equal(isLevelUnlocked('trail-7',p),true);assert.equal(isLevelUnlocked('trail-8',p),false);assert.equal(isLevelUnlocked('bonus-1',p),true);assert.equal(isLevelUnlocked('bonus-2',p),false);assert.equal(isLevelUnlocked('trail-1',{}),true);
});
