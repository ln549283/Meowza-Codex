import { challengeId,journeyId } from '../core/journey';
import type { Level } from '../core/model';
import { SaveService } from './SaveService';
export async function loadSummit(n:number,bonus=false):Promise<Level>{
 const id=bonus?challengeId(n):journeyId(n),saved=SaveService.data.journeyLevels[id];if(saved)return saved;
 const worker=new Worker(new URL('./level.worker.ts',import.meta.url),{type:'module'});
 return new Promise((resolve,reject)=>{
  const finish=()=>{clearTimeout(timeout);worker.terminate();};
  const timeout=setTimeout(()=>{finish();reject(new Error('La préparation prend trop de temps. Réessaie.'));},45000);
  worker.onerror=()=>{finish();reject(new Error('La grille n’a pas pu être préparée. Réessaie.'));};
  worker.onmessage=(event:MessageEvent<{level?:Level;error?:string}>)=>{finish();if(!event.data.level){reject(new Error(event.data.error));return;}const level=event.data.level;SaveService.data.journeyLevels[id]=level;void SaveService.persist();resolve(level);};
  worker.postMessage({n,bonus});
 });
}
