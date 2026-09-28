import test from 'node:test';
import assert from 'node:assert/strict';
import {treeY,treeFocus,treeLimit,visibleTreeLevels} from './treeLayout';
import {CHUNKS,CHUNK_SCALE,chunkForIndex,treeAnchor,visibleChunks} from './treeChunks';
test('approved chunks join without a gap and the base never repeats',()=>{
 for(let i=1;i<500;i++){
  const below=chunkForIndex(i-1),above=chunkForIndex(i);
  assert.ok(Math.abs(above.top+above.height-below.top)<.000001);
  assert.notEqual(above.kind,'base');
  if(i>1)assert.notEqual(above.kind,below.kind);
 }
});
test('levels sit on authored platforms and ascend monotonically',()=>{
 for(let n=1;n<10000;n++){
  const a=treeAnchor(n),c=chunkForIndex(a.chunk),s=CHUNKS[c.kind].slots[n-c.first]!;
  assert.equal(a.y,c.top+s.y*CHUNK_SCALE);
  assert.ok(a.x>170&&a.x<910);
  assert.ok(treeAnchor(n+1).y<a.y);
 }
});
test('render window stays bounded at a million levels, including deep history',()=>{
 for(const current of [1,4,5,8,10,50,81,100,1000000])for(const offset of [0,treeFocus(current),treeLimit(current),treeFocus(Math.max(1,Math.floor(current/2)))]){
  const chunks=visibleChunks(offset,current),levels=visibleTreeLevels(current,offset);
  assert.ok(chunks.length<=4);assert.ok(levels.length<=10);
  assert.ok(levels.every(n=>n>=1&&n<=current));
  if(offset===treeFocus(current))assert.ok(levels.includes(current));
  // Independently locate every rectangle intersecting the viewport around this level.
  const around=offset===0?1:offset===treeFocus(Math.max(1,Math.floor(current/2)))?Math.max(1,Math.floor(current/2)):current;
  for(let n=Math.max(1,around-20);n<=Math.min(current,around+20);n++)if(treeY(n,offset)>220&&treeY(n,offset)<1630)assert.ok(levels.includes(n),`missing ${n}`);
 }
});
test('all palier and slice boundaries preserve level continuity',()=>{
 for(const n of [4,7,10,49,50,80,81,90,99,100]){
  const offset=treeFocus(n+1);
  assert.equal(treeY(n+1,offset),1040);
  assert.ok(visibleTreeLevels(n+1,offset).includes(n));
 }
});
