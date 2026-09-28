import { generateJourneyLevel } from '../core/journey';
self.onmessage=(event:MessageEvent<{n:number;bonus:boolean}>)=>{
 try{self.postMessage({level:generateJourneyLevel(event.data.n,event.data.bonus)});}catch(error){self.postMessage({error:String(error)});}
};
