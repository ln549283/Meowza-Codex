import assert from 'node:assert/strict';
import { describe,it } from 'node:test';
import { countSolutions,solveGrid } from './solver';
import { isWon,validateGrid } from './validator';
import type { Grid,Level } from './model';
const solution:Grid=[[1,1,2,2],[1,2,1,2],[2,1,2,1],[2,2,1,1]];
const level:Level={id:'test',difficulty:'easy',size:4,initial:[[1,0,0,2],[0,2,1,0],[2,1,0,0],[0,0,1,1]],solution,constraints:[{a:[0,0],b:[0,1],type:'same'},{a:[1,1],b:[1,2],type:'different'}]};
describe('Meowza core',()=>{
  it('validates complete grids',()=>assert.equal(isWon(solution,level.constraints),true));
  it('detects triples',()=>assert.equal(validateGrid([[1,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]).valid,false));
  it('solves a puzzle',()=>assert.deepEqual(solveGrid(level.initial,level.constraints),solution));
  it('counts unique solutions',()=>assert.equal(countSolutions(level.initial,level.constraints),1));
  it('rejects impossible grids',()=>assert.equal(solveGrid([[1,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]),null));
});
