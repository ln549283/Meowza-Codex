import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveServiceImpl } from '../services/SaveService';
import { generateJourneyLevel } from './journey';
import { humanSolve } from './humanSolver';
const memory=()=>new SaveServiceImpl({get:async()=>({value:null}),set:async()=>{}});
test('every distinct level earns kibble once, replay does not',async()=>{const s=memory();await s.complete('easy-01',0,0);assert.equal(s.data.kibble,65);await s.complete('easy-02',0,0);assert.equal(s.data.kibble,70);s.remember('easy-01',[[0]],0,0);await s.complete('easy-01',0,0);assert.equal(s.data.kibble,70);assert.equal(s.data.lastReward,0);});
test('extreme proofs are short, single-depth, limited and genuinely needed',()=>{for(let n=1;n<=12;n++){const l=generateJourneyLevel(n,true),r=humanSolve(l.initial,l.constraints,1);assert.equal(r.status,'solved',String(n));assert.equal(humanSolve(l.initial,l.constraints,0).status,'stuck');const hypotheses=r.steps.filter(s=>s.rule==='contradiction');assert.ok(hypotheses.length<=3);for(const h of hypotheses){assert.ok(h.consequences!.length<=5);assert.ok(h.consequences!.every(s=>s.rule!=='contradiction'));}}});

test('completion callbacks cannot duplicate rewards, statistics or cosmetic receipts',async()=>{const s=memory();s.remember('easy-01',[[0]],2,1);await s.complete('easy-01',2,1);await s.complete('easy-01',2,1);assert.equal(s.data.kibble,65);assert.equal(s.data.lastReward,5);assert.equal(s.data.stats.totalErrors,2);assert.equal(s.data.stats.totalHints,1);assert.equal(s.data.progress['easy-01']?.stars,undefined);});
