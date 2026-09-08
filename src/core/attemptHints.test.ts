import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveServiceImpl } from '../services/SaveService';
import { hintCost } from './economy';
import type { Grid } from './model';
import type { HumanStep } from './humanSolver';

const grid=():Grid=>Array.from({length:4},()=>[0,0,0,0]);
const step=(col=0):HumanStep=>({position:[0,col],value:1,rule:'balance',sources:[],explanation:'La ligne a déjà ses deux chats roux.'});
function fixture(){
 let saved:string|null=null;
 const storage={get:async()=>({value:saved}),set:async({value}:{value:string})=>{saved=value;}};
 const service=new SaveServiceImpl(storage);
 service.data.kibble=100;
 service.remember('trail-1',grid(),0,0);
 return {service,storage};
}

test('three purchases cost 15/25/40; a fourth is rejected by the service',()=>{
 const {service:s}=fixture();
 for(const [col,balance] of [[0,85],[1,60],[2,20]]){
  assert.equal(s.buyHint('trail-1',step(col)),true);
  assert.equal(s.data.kibble,balance);
 }
 assert.equal(s.data.session?.hints,3);
 assert.equal(s.buyHint('trail-1',step(3)),false);
 assert.equal(s.data.kibble,20);
 assert.equal(s.data.session?.hintSteps?.length,3);
 for(const invalid of [-1,0.5,3,4,NaN,Infinity])assert.equal(hintCost(invalid),null);
});

test('double click and reread consume one purchase, including after reload',async()=>{
 const {service:s,storage}=fixture();
 assert.equal(s.buyHint('trail-1',step()),true);
 assert.equal(s.buyHint('trail-1',step()),true);
 // A stale scene save cannot lower the purchased quota.
 s.remember('trail-1',grid(),1,0,123,true);
 await s.persist();
 const reloaded=new SaveServiceImpl(storage);await reloaded.load();
 assert.equal(reloaded.data.session?.hints,1);
 assert.equal(reloaded.data.session?.remaining,123);
 assert.equal(reloaded.buyHint('trail-1',step()),true);
 assert.equal(reloaded.data.kibble,85);
 assert.equal(hintCost(reloaded.data.session!.hints),25);
});

test('failure then retry clears all precise hints and restores first price, not money',async()=>{
 const {service:s,storage}=fixture();
 s.buyHint('trail-1',step());
 s.remember('trail-1',grid(),3,1,0,true,true);
 assert.equal(s.buyHint('trail-1',step(1)),false);
 s.restartAttempt();
 assert.equal(s.data.session,null);
 assert.equal(s.buyHint('trail-1',step()),false);
 s.remember('trail-1',grid(),0,0,360,false);
 assert.equal(s.ownedHint('trail-1',step()),undefined);
 assert.equal(hintCost(s.data.session!.hints),15);
 assert.equal(s.buyHint('trail-1',step()),true);
 assert.equal(s.data.kibble,70);
 await s.persist();
 const reloaded=new SaveServiceImpl(storage);await reloaded.load();
 assert.equal(reloaded.data.session?.hints,1);
 assert.equal(reloaded.data.session?.hintSteps?.length,1);
});

test('insufficient funds, wrong level, fixed/filled cell and bad coordinates do not debit',()=>{
 const {service:s}=fixture();s.data.kibble=14;
 assert.equal(s.buyHint('trail-1',step()),false);
 s.data.kibble=100;
 assert.equal(s.buyHint('trail-2',step()),false);
 assert.equal(s.buyHint('trail-1',step(-1)),false);
 assert.equal(s.buyHint('trail-1',step(4)),false);
 s.data.session!.grid[0]![0]=1;
 assert.equal(s.buyHint('trail-1',step()),false);
 assert.equal(s.data.kibble,100);assert.equal(s.data.session?.hints,0);
});

test('legacy migration preserves session/progress/balance, drops historical libraries, runs once',async()=>{
 const old={saveVersion:1,kibble:37,attemptPurchases:5,purchasedHints:{'trail-1':[step()]},session:{id:'trail-1',grid:grid(),errors:1,hints:4,remaining:99,started:true},progress:{'easy-01':{completed:true,stars:3,bestErrors:0,bestHints:0}}};
 let saved=JSON.stringify(old);
 const storage={get:async()=>({value:saved}),set:async({value}:{value:string})=>{saved=value;}};
 const s=new SaveServiceImpl(storage);await s.load();
 assert.equal(s.data.kibble,37);assert.equal(s.data.progress['easy-01']?.completed,true);
 assert.equal(s.data.session?.hints,3);assert.equal(s.data.session?.remaining,99);
 assert.deepEqual(s.data.session?.grid,old.session.grid);
 assert.deepEqual(s.data.session?.hintSteps,[]);
 assert.equal(s.data.session?.hintMigrationNotice,true);
 assert.equal(s.buyHint('trail-1',step()),false);
 await s.persist();
 assert.equal('purchasedHints' in JSON.parse(saved),false);
 assert.equal('attemptPurchases' in JSON.parse(saved),false);
 s.restartAttempt();s.remember('trail-1',grid(),0,0);
 assert.equal(s.buyHint('trail-1',step()),true);await s.persist();
 const copy=new SaveServiceImpl(storage);await copy.load();
 assert.equal(copy.data.session?.hints,1);assert.equal(copy.data.kibble,22);
 assert.ok(copy.ownedHint('trail-1',step()));
});

test('changing level and completing a level do not leak deductions into the next attempt',async()=>{
 const {service:s}=fixture();s.buyHint('trail-1',step());
 s.remember('trail-2',grid(),0,0);
 assert.equal(s.ownedHint('trail-1',step()),undefined);
 assert.equal(s.data.session?.hints,0);
 assert.deepEqual(s.data.session?.hintSteps,[]);
 await s.complete('easy-01',1,0,0);
 assert.equal(s.data.session,null);
});
