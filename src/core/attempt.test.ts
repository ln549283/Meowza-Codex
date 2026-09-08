import test from 'node:test';
import assert from 'node:assert/strict';
import { judgePlacement } from './attempt';
import { cloneGrid,type Level } from './model';
const level:Level={id:'trail-1',difficulty:'easy',size:4,constraints:[],initial:[[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],solution:[[1,2,1,2],[2,1,2,1],[1,1,2,2],[2,2,1,1]]};
test('wrong placement is rejected against the solution even without a visible conflict',()=>{
 const grid=cloneGrid(level.initial);
 assert.equal(judgePlacement(level,grid,0,[1,0],1),'error');
 assert.equal(judgePlacement(level,grid,1,[1,0],1),'error');
 assert.equal(judgePlacement(level,grid,2,[1,0],1),'defeat');
 assert.deepEqual(grid,level.initial);
 assert.equal(judgePlacement(level,grid,3,[1,0],2),'ignored');
});
test('accepted placements and presets cannot be erased, replaced or penalized',()=>{
 const grid=cloneGrid(level.initial);
 assert.equal(judgePlacement(level,grid,0,[0,1],2),'accepted');grid[0]![1]=2;
 for(const value of [0,1,2] as const){
  assert.equal(judgePlacement(level,grid,0,[0,1],value),'ignored');
  assert.equal(judgePlacement(level,grid,0,[0,0],value),'ignored');
 }
 assert.equal(judgePlacement(level,grid,0,[-1,0],1),'ignored');
 assert.equal(judgePlacement(level,grid,0,[9,0],1),'ignored');
});
