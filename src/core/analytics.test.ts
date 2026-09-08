import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveServiceImpl } from '../services/SaveService';

const memory=()=>new SaveServiceImpl({get:async()=>({value:null}),set:async()=>{}});

test('core attempt analytics distinguish probing, hints and outcomes',()=>{
 const s=memory(),id='trail-21';
 s.trackAttemptStart(id);
 s.trackPlacement(id,true);
 s.trackPlacement(id,false);
 s.trackPlacement(id,true);
 s.trackHint(id);
 s.trackFailure(id,'errors');
 s.trackAttemptStart(id);
 s.trackPlacement(id,true);
 s.trackAbandon(id);
 s.trackAttemptStart(id);
 s.trackHint(id);
 s.trackFailure(id,'time');
 s.trackAttemptStart(id);
 s.trackPlacement(id,true);
 s.trackWin(id);
 assert.deepEqual(s.data.analytics[id],{attempts:4,wins:1,abandons:1,failuresErrors:1,failuresTime:1,placements:5,wrongPlacements:1,hintsBought:2});
});

test('old saves load with analytics safely defaulted',async()=>{
 const storage={get:async()=>({value:JSON.stringify({saveVersion:2,progress:{'trail-1':{completed:true,bestErrors:0,bestHints:0}}})}),set:async()=>{}};
 const s=new SaveServiceImpl(storage);await s.load();
 assert.deepEqual(s.data.analytics,{});
 s.trackAttemptStart('trail-2');
 assert.equal(s.data.analytics['trail-2']?.attempts,1);
});
