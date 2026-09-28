import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveServiceImpl } from '../services/SaveService';
import { collectionCats } from './cats';
import { cosmeticPrice } from './cosmetics';
import { treeLimit,treeY,visibleTreeLevels } from './treeLayout';

test('catalogue purchase has a stable price and cannot debit twice',()=>{
 const save=new SaveServiceImpl({get:async()=>({value:null}),set:async()=>{}});save.data.kibble=1000;
 const price=cosmeticPrice('mint');assert.equal(save.buyCosmetic('mint'),true);assert.equal(save.data.kibble,1000-price);
 assert.equal(save.buyCosmetic('mint'),false);assert.equal(save.buyCosmetic('invalid'),false);assert.equal(save.data.kibble,1000-price);
 save.data.kibble=0;assert.equal(save.buyCosmetic('night'),false);
});
test('retired backgrounds are compensated once and cats catch up to earned milestones',async()=>{
 let value:string|null=null;const storage={get:async()=>({value}),set:async(data:{value:string})=>{value=data.value;}};
 const save=new SaveServiceImpl(storage);save.data.ownedCosmetics.push('forest','forest');save.data.equipped.background='forest';
 for(let n=1;n<=20;n++)save.data.progress[`trail-${n}`]={completed:true,bestErrors:0,bestHints:0};
 const balance=save.data.kibble;await save.persist();await save.load();assert.equal(save.data.kibble,balance+180);
 assert.equal(save.data.equipped.background,'cream');assert.deepEqual(save.data.ownedCats,collectionCats.slice(0,2).map(c=>c.id));
 assert.equal(save.assignCat(10,'noisette'),true);assert.equal(save.assignCat(20,'noisette'),true);assert.equal(save.data.refuges['10'],undefined);
 await save.persist();await save.load();assert.equal(save.data.kibble,balance+180);assert.equal(save.data.refuges['20'],'noisette');
 assert.ok(!(save.data.ownedCats as string[]).includes('moka')&&!(save.data.ownedCats as string[]).includes('nimbus'));
});
test('upper scroll stops with current level visible and tall screens retain their levels',()=>{
 for(const current of [1,10,100,1000000]){
  const y=treeY(current,treeLimit(current))+80;assert.ok(y>=440&&y<=1120);
  const levels=visibleTreeLevels(current,treeLimit(current),2600);assert.ok(levels.includes(current));assert.ok(levels.every(n=>n<=current));
 }
});
