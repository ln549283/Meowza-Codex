import test from 'node:test';
import assert from 'node:assert/strict';
import {generateJourneyLevel,journeySpec} from './journey';
import {humanSolve} from './humanSolver';
import {SaveServiceImpl} from '../services/SaveService';
import {hintCost,rewardFor} from './economy';
import {starterCosmetics,unlockAt} from './cosmetics';
test('first hundred authored puzzles have bounded human proofs including every timed challenge',()=>{
 const counts:Record<string,number>={};
 for(let n=1;n<=100;n++){
  const l=generateJourneyLevel(n),s=journeySpec(n),proof=humanSolve(l.initial,l.constraints,s.depth);
  assert.equal(proof.status,'solved',`level ${n}`);assert.deepEqual(proof.grid,l.solution);
  const key=l.timed?'timed':l.difficulty;counts[key]=(counts[key]??0)+1;
  if(l.difficulty==='extreme'){assert.equal(humanSolve(l.initial,l.constraints,0).status,'stuck',`extreme ${n}`);assert.ok(proof.steps.filter(s=>s.rule==='contradiction').length<=3);}
  if(n===1)assert.equal(l.constraints.length,0);
  if(n===2||n===3)assert.ok(l.constraints.length>0&&l.constraints.every(c=>c.type==='same'));
  if(n===4||n===5)assert.ok(['same','different'].every(t=>l.constraints.some(c=>c.type===t)));
  if(l.timed){assert.ok(l.timeLimit!>0);assert.equal(journeySpec(n+1).difficulty,'medium');}
 }
 assert.deepEqual(counts,{easy:12,medium:34,hard:31,extreme:16,timed:7});
 assert.equal(journeySpec(101).difficulty,'hard');
});
test('cosmetics are earned only at milestones without duplicates',()=>{const owned=[...starterCosmetics];assert.equal(unlockAt(9,owned,1),null);for(let n=10;n<=60;n+=10){const id=unlockAt(n,owned,1234+n);assert.ok(id);assert.ok(!owned.includes(id));owned.push(id);}assert.equal(unlockAt(70,owned,1),null);});
test('timed reward, failed attempts and timer survive reload without charging a life',async()=>{
 let stored:string|null=null;const storage={get:async()=>({value:stored}),set:async({value}:{value:string})=>{stored=value;}};
 const s=new SaveServiceImpl(storage),l=generateJourneyLevel(33);assert.equal(l.timed,true);s.data.journeyLevels[l.id]=l;
 s.remember(l.id,l.initial,2,1,123,true,true);await s.persist();const copy=new SaveServiceImpl(storage);await copy.load();assert.equal(copy.data.session?.remaining,123);assert.equal(copy.data.session?.failed,true);copy.restartAttempt();assert.equal(copy.data.kibble,60);await copy.complete(l.id,1,2,1);assert.equal(copy.data.lastReward,18);assert.equal(copy.data.kibble,78);await copy.complete(l.id,3,0,0);assert.equal(copy.data.kibble,78);
 assert.deepEqual([0,1,2,3,20].map(hintCost),[20,35,50,50,50]);assert.deepEqual(['easy','medium','hard','extreme'].map(d=>rewardFor(d as 'easy')),[5,8,12,15]);
});
