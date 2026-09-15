// Separate QA entry: synthetic progress in memory, never reads or writes a player's save.
import {SaveService} from './services/SaveService';
import {cosmetics} from './core/cosmetics';
import {collectionCats} from './core/cats';
const level=Math.min(101,Math.max(1,Number(new URLSearchParams(location.search).get('level'))||11));
SaveService.load=async()=>{};
SaveService.persist=async()=>{};
SaveService.data.tutorialCompleted=true;
SaveService.data.kibble=1500;
SaveService.data.ownedCosmetics=cosmetics.map(c=>c.id);
SaveService.data.ownedCats=collectionCats.map(c=>c.id);
for(let n=1;n<level;n++)SaveService.data.progress[`trail-${n}`]={completed:true,bestErrors:n%3,bestHints:0};
SaveService.data.stats.levelsCompleted=level-1;
for(let n=10;n<level;n+=10)SaveService.data.refuges[String(n)]=collectionCats[(n/10-1)%collectionCats.length]!.id;
await import('./main');
