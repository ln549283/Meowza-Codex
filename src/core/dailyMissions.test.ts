import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveServiceImpl, type DailyMission, type DailyMissionMetric } from '../services/SaveService';
import type { Level } from './model';
import { STARTING_KIBBLE } from './economy';

function memory(){
 let value:string|null=null;
 const storage={get:async()=>({value}),set:async(next:{key:string;value:string})=>{value=next.value;}};
 return {service:new SaveServiceImpl(storage),storage};
}
function install(s:SaveServiceImpl,metric:DailyMissionMetric,target:number,extra:Partial<DailyMission>={}){
 const date=s.ensureDailyMissions().date;
 const m:DailyMission={id:metric,family:'mastery',metric,title:'Test',subtitle:'Test',target,progress:0,claimed:false,reward:1,...extra};
 s.data.missions.daily={date,missions:[m],perfectStreak:0};
 return m;
}
function level(id:string,difficulty:Level['difficulty']='easy',timed=false):Level{
 return {id,difficulty,size:4,initial:[],solution:[],constraints:[],timed};
}
function reach(s:SaveServiceImpl,n:number){
 for(let i=1;i<n;i++)s.data.progress['trail-'+i]={completed:true,bestErrors:0,bestHints:0};
}
async function wins(s:SaveServiceImpl,errors:number[]){
 for(const e of errors)await s.complete('easy-01',e,0);
}

test('precision mission completes after five perfect wins (previously stuck at 3/5)',async()=>{
 const {service:s}=memory(),m=install(s,'error_budget',5,{errorWindow:[]});
 await wins(s,[0,0,0,0,0]);assert.equal(m.progress,5);
 assert.equal(s.claimDaily(m.id),true);assert.equal(s.data.missions.diamonds,1);
});
test('precision tracks errors separately from the number of wins',async()=>{
 const {service:s}=memory(),m=install(s,'error_budget',5,{errorWindow:[]});
 await wins(s,[1,0,1,0,0]);assert.equal(m.progress,5);assert.deepEqual(m.errorWindow,[1,0,1,0,0]);
});
test('precision keeps a valid trailing sequence after the error budget is exceeded',async()=>{
 const {service:s}=memory(),m=install(s,'error_budget',5,{errorWindow:[]});
 await wins(s,[2,0,1]);assert.equal(m.progress,2);assert.deepEqual(m.errorWindow,[0,1]);
 await wins(s,[0,0,0]);assert.equal(m.progress,5);
});
test('partial precision state survives a save and reload',async()=>{
 const {service:s,storage}=memory();install(s,'error_budget',5,{errorWindow:[]});
 await wins(s,[1,0,1]);const loaded=new SaveServiceImpl(storage);await loaded.load();
 const m=loaded.data.missions.daily!.missions[0]!;assert.equal(m.progress,3);
 assert.deepEqual(m.errorWindow,[1,0,1]);await wins(loaded,[0,0]);assert.equal(m.progress,5);
});
test('legacy partial precision is reset once without inventing historical errors',async()=>{
 const {service:s}=memory(),m=install(s,'error_budget',5,{progress:3});
 s.ensureDailyMissions();assert.equal(m.progress,0);assert.deepEqual(m.errorWindow,[]);
 await wins(s,[0]);s.ensureDailyMissions();assert.equal(m.progress,1);
});
test('migration preserves earned and already claimed precision rewards',()=>{
 for(const claimed of [false,true]){
  const {service:s}=memory(),m=install(s,'error_budget',5,{progress:5,claimed});
  s.ensureDailyMissions();assert.equal(m.progress,5);assert.equal(m.claimed,claimed);
 }
});
test('replays advance daily goals but never duplicate first-clear rewards or milestones',async()=>{
 const {service:s}=memory(),m=install(s,'complete',5),before=[...s.data.ownedCosmetics];
 await wins(s,[0,0,0,0,0]);assert.equal(m.progress,5);
 assert.equal(s.data.kibble,STARTING_KIBBLE+5);assert.equal(s.data.stats.levelsCompleted,1);
 assert.equal(s.data.lastReward,0);assert.deepEqual(s.data.ownedCosmetics,before);
});
test('a previously completed level can complete a later daily objective',async()=>{
 const {service:s}=memory();await wins(s,[0]);const m=install(s,'perfect',1);
 await wins(s,[0]);assert.equal(m.progress,1);assert.equal(s.data.lastReward,0);
});
test('failed and abandoned attempts break perfect streaks',async()=>{
 for(const outcome of ['errors','time','abandon'] as const){
  const {service:s}=memory(),m=install(s,'perfect_streak',2);
  await wins(s,[0]);assert.equal(m.progress,1);
  if(outcome==='abandon')s.trackAbandon('easy-01');else s.trackFailure('easy-01',outcome);
  assert.equal(s.data.missions.daily!.perfectStreak,0);
  await wins(s,[0]);assert.equal(m.progress,1);await wins(s,[0]);assert.equal(m.progress,2);
 }
});
test('a non-perfect replay breaks a perfect streak',async()=>{
 const {service:s}=memory(),m=install(s,'perfect_streak',2);
 await wins(s,[0,1,0]);assert.equal(m.progress,1);await wins(s,[0]);assert.equal(m.progress,2);
});
test('failures and abandonment clear partial precision attempts',async()=>{
 for(const outcome of ['errors','time','abandon'] as const){
  const {service:s}=memory(),m=install(s,'error_budget',5,{errorWindow:[]});
  await wins(s,[1,0]);
  if(outcome==='abandon')s.trackAbandon('easy-01');else s.trackFailure('easy-01',outcome);
  assert.equal(m.progress,0);assert.deepEqual(m.errorWindow,[]);
 }
});
test('earned daily rewards remain claimable after a later defeat',async()=>{
 const {service:s}=memory(),m=install(s,'error_budget',5,{errorWindow:[]});
 await wins(s,[0,0,0,0,0]);s.trackFailure('easy-01','errors');
 assert.equal(m.progress,5);assert.equal(s.claimDaily(m.id),true);
});
test('claim is idempotent and respects the stored mission reward',async()=>{
 const {service:s}=memory(),m=install(s,'complete',1,{reward:2});
 assert.equal(s.claimDaily(m.id),false);assert.equal(s.claimDaily('unknown'),false);
 await wins(s,[0]);assert.equal(s.claimDaily(m.id),true);assert.equal(s.claimDaily(m.id),false);
 assert.equal(s.data.missions.diamonds,2);
});
test('new players receive three distinct achievable daily missions across 256 seeds',()=>{
 for(let seed=0;seed<256;seed++){
  const {service:s}=memory();s.data.cosmeticSeed=seed;
  const ms=s.ensureDailyMissions().missions;
  assert.equal(ms.length,3);assert.equal(new Set(ms.map(m=>m.id)).size,3);
  assert.ok(ms.every(m=>['complete','max_one_error','no_hint','perfect','perfect_streak','clean','error_budget'].includes(m.metric)),String(seed));
 }
});
test('cached locked challenges do not unlock challenge missions',()=>{
 for(let seed=0;seed<128;seed++){
  const {service:s}=memory();s.data.cosmeticSeed=seed;
  s.data.journeyLevels['trail-33']=level('trail-33','extreme',true);
  assert.ok(s.ensureDailyMissions().missions.every(m=>!['timed','timed_perfect','hard_plus','extreme_no_hint','hard_extreme_perfect'].includes(m.metric)));
 }
});
test('the next playable hard summit enables challenges before grid generation',()=>{
 const {service:s}=memory();reach(s,15);
 const m=s.ensureDailyMissions().missions.find(m=>m.family==='challenge')!;
 assert.ok(['hard_plus','hard_extreme_perfect'].includes(m.metric));
 assert.deepEqual(s.data.journeyLevels,{});
});
test('the next playable timed summit is eligible before grid generation',()=>{
 const metrics=new Set<string>();
 for(let seed=0;seed<64;seed++){
  const {service:s}=memory();reach(s,33);s.data.cosmeticSeed=seed;
  metrics.add(s.ensureDailyMissions().missions.find(m=>m.family==='challenge')!.metric);
 }
 assert.ok(metrics.has('timed'));assert.ok(metrics.has('timed_perfect'));
});
test('mission selection remains deterministic and stable throughout the day',()=>{
 const {service:a}=memory(),{service:b}=memory();a.data.cosmeticSeed=123;b.data.cosmeticSeed=123;
 const first=a.ensureDailyMissions();assert.deepEqual(first,b.ensureDailyMissions());
 reach(a,33);assert.strictEqual(a.ensureDailyMissions(),first);
});
test('a new day replaces the previous objectives and resets partial streaks',()=>{
 const {service:s}=memory();install(s,'perfect_streak',2,{progress:1});
 s.data.missions.daily!.date='2000-01-01';s.data.missions.daily!.perfectStreak=1;
 const d=s.ensureDailyMissions();assert.notEqual(d.date,'2000-01-01');
 assert.equal(d.perfectStreak,0);assert.equal(d.missions.length,3);assert.ok(d.missions.every(m=>m.progress===0&&!m.claimed));
});
test('claimed rewards and streak interruption survive reload',async()=>{
 const {service:s,storage}=memory(),m=install(s,'perfect_streak',2);
 await wins(s,[0,0]);assert.equal(s.claimDaily(m.id),true);s.trackAbandon('easy-01');await s.persist();
 const restored=new SaveServiceImpl(storage);await restored.load();
 assert.equal(restored.data.missions.daily!.perfectStreak,0);
 assert.equal(restored.data.missions.diamonds,1);assert.equal(restored.claimDaily(m.id),false);
});
test('difficulty objectives use the actual replayed level',async()=>{
 const {service:s}=memory(),m=install(s,'timed',1);
 await wins(s,[0]);assert.equal(m.progress,0);
 s.data.journeyLevels['trail-33']=level('trail-33','extreme',true);
 s.data.progress['trail-33']={completed:true,bestErrors:0,bestHints:0};
 await s.complete('trail-33',0,0);assert.equal(m.progress,1);assert.equal(s.data.lastReward,0);
});
test('uncached trail ids derive their real difficulty instead of the word trail',async()=>{
 const {service:s}=memory(),m=install(s,'medium_plus',1);
 await s.complete('trail-1',0,0);assert.equal(m.progress,0);
 await s.complete('trail-6',0,0);assert.equal(m.progress,1);
});

test('partial perfect streak display resets immediately on failure and imperfect wins',async()=>{
 for(const outcome of ['errors','abandon','imperfect'] as const){
  const {service:s}=memory(),m=install(s,'perfect_streak',2);
  await wins(s,[0]);assert.equal(m.progress,1);
  if(outcome==='errors')s.trackFailure('easy-01','errors');
  else if(outcome==='abandon')s.trackAbandon('easy-01');
  else await wins(s,[1]);
  assert.equal(m.progress,0);
 }
});
test('uncached timed summit retains timed missions and first-win reward',async()=>{
 const {service:s}=memory(),m=install(s,'timed',1);
 await s.complete('trail-33',0,0);
 assert.equal(m.progress,1);assert.equal(s.data.lastReward,18);
});
test('completed perfect streak remains claimable after a failure',async()=>{
 const {service:s}=memory(),m=install(s,'perfect_streak',2);
 await wins(s,[0,0]);s.trackFailure('easy-01','errors');
 assert.equal(m.progress,2);assert.equal(s.claimDaily(m.id),true);
});
