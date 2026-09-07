import assert from 'node:assert/strict';
import { describe,it } from 'node:test';
import { createAttemptState,markAttemptWon,registerHint,registerMistake,resetAttempt } from './attempt';

describe('Attempt state',()=>{
  it('starts clean',()=>assert.deepEqual(createAttemptState(),{errors:0,hintsUsed:0,continuationUsed:false,status:'playing'}));
  it('loses on the third mistake',()=>{
    let state=createAttemptState();
    state=registerMistake(state);state=registerMistake(state);state=registerMistake(state);
    assert.equal(state.errors,3);assert.equal(state.status,'lost');
    assert.deepEqual(registerMistake(state),state);
  });
  it('tracks hints independently',()=>{
    const state=registerHint(registerHint(createAttemptState()));
    assert.equal(state.hintsUsed,2);assert.equal(state.errors,0);
  });
  it('can be won only while playing',()=>assert.equal(markAttemptWon(createAttemptState()).status,'won'));
  it('retry resets the whole attempt',()=>{
    let state=createAttemptState();state=registerMistake(registerHint(state));
    assert.deepEqual(resetAttempt(),{errors:0,hintsUsed:0,continuationUsed:false,status:'playing'});
  });
});
