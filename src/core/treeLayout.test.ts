import test from 'node:test';
import assert from 'node:assert/strict';
import {treeY,treeFocus,treeLimit,visibleTreeLevels,TREE_STEP} from './treeLayout';
test('continuous tree keeps a bounded render window at one million levels',()=>{
 for(const current of [1,8,9,49,50,51,100,1000000])for(const offset of [0,treeFocus(current),treeLimit(current)]){
  const levels=visibleTreeLevels(current,offset);assert.ok(levels.length<=7);assert.ok(levels.every(n=>n>=1&&n<=current));
  const actuallyVisible=levels.filter(n=>treeY(n,offset)>235&&treeY(n,offset)<1580);
  for(let i=1;i<actuallyVisible.length;i++)assert.equal(actuallyVisible[i]! - actuallyVisible[i-1]!,1);
 }
});
test('no page boundary or position jump at 8, 50 or 100',()=>{for(const n of [8,50,100]){const offset=treeFocus(n+1);assert.equal(treeY(n,offset)-treeY(n+1,offset),TREE_STEP);assert.ok(visibleTreeLevels(n+1,offset).includes(n));assert.ok(visibleTreeLevels(n+1,offset).includes(n+1));}assert.ok(visibleTreeLevels(100,0).includes(1));});
