import assert from 'node:assert/strict';
import { it } from 'node:test';
import { isLevelUnlocked } from './progression';
import { assessDifficulty } from './difficulty';
import { generateLevel } from './generator';
import { SaveServiceImpl } from '../services/SaveService';
const completed=(prefix:string,count:number)=>Object.fromEntries(Array.from({length:count},(_,i)=>[`${prefix}-${String(i+1).padStart(2,'0')}`,{completed:true}]));
it('starts with one easy puzzle and rejects malformed IDs',()=>{assert.equal(isLevelUnlocked('easy-01',{}),true);for(const id of ['easy-02','medium-01','hard-01','extreme-01','easy-00','easy-21','extreme-31','unknown-01'])assert.equal(isLevelUnlocked(id,{}),false,id);});
it('preserves original chapter gates and opens extreme only after all hard puzzles',()=>{assert.equal(isLevelUnlocked('medium-01',completed('easy',9)),false);assert.equal(isLevelUnlocked('medium-01',completed('easy',10)),true);assert.equal(isLevelUnlocked('hard-01',completed('medium',15)),true);assert.equal(isLevelUnlocked('extreme-01',completed('hard',29)),false);assert.equal(isLevelUnlocked('extreme-01',completed('hard',30)),true);assert.equal(isLevelUnlocked('extreme-02',completed('hard',30)),false);});
it('finished levels remain replayable even with a partial legacy save',()=>assert.equal(isLevelUnlocked('hard-12',{'hard-12':{completed:true}}),true));
it('generation is deterministic',()=>assert.deepEqual(generateLevel('easy-01','easy',4,123),generateLevel('easy-01','easy',4,123)));
it('extreme candidate requires more than immediate deductions',()=>assert.equal(assessDifficulty(generateLevel('extreme-01','extreme',8,(0x43415453+0x9e3779b9)>>>0)).requiresLookahead,true));
it('loads v1 saves, preserves best scores and serializes writes',async()=>{
 const writes:string[]=[];
 const save=new SaveServiceImpl({get:async()=>({value:JSON.stringify({saveVersion:1,tutorialCompleted:true,settings:{sounds:false},progress:{'easy-01':{completed:true,stars:3,bestErrors:0,bestHints:0}},stats:{levelsCompleted:1,totalHints:0,totalErrors:0}})}),set:async({value})=>{writes.push(value);}});
 await save.load();assert.equal(save.data.session,null);assert.equal(save.data.settings.sounds,false);await save.complete('easy-01',1,5,3);assert.equal(save.data.progress['easy-01']?.stars,3);assert.equal(save.data.stats.levelsCompleted,1);save.remember('easy-02',[[0]],0,0);await save.persist();assert.equal(JSON.parse(writes.at(-1)!).session.id,'easy-02');
});
it('recovers persistence after a transient storage failure',async()=>{
 let fail=true;const save=new SaveServiceImpl({get:async()=>({value:null}),set:async()=>{if(fail)throw new Error('disk');}});
 await save.complete('easy-01',3,0,0);assert.equal(save.saveFailed,true);assert.equal(save.data.progress['easy-01']?.completed,true);fail=false;await save.persist();assert.equal(save.saveFailed,false);
});
