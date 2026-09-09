import test from 'node:test';
import assert from 'node:assert/strict';
import { TapGesture } from './tapGesture';

test('a release on a different control never activates it',()=>{
 const origin=new TapGesture(32),destination=new TapGesture(32);
 origin.start(1);origin.cancel();
 assert.equal(destination.release(1,3),false);
 assert.equal(origin.release(1,3),false);
});
test('small finger movements are accepted once, drags and invalid distances rejected',()=>{
 const tap=new TapGesture(32);
 tap.start(1);assert.equal(tap.release(1,20),true);
 assert.equal(tap.release(1,20),false);
 for(const distance of [33,Infinity,NaN]){tap.start(1);assert.equal(tap.release(1,distance),false);}
 tap.start(1);tap.cancel();assert.equal(tap.release(1,0),false);
});
test('a second finger cannot complete or replace the first touch',()=>{
 const tap=new TapGesture(20);
 tap.start(1);tap.start(2);
 assert.equal(tap.release(2,0),false);
 assert.equal(tap.release(1,0),true);
});
