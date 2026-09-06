import { cosmetics,starterCosmetics,unlockAt } from '../core/cosmetics';
import { STARTING_KIBBLE,rewardFor,hintCost } from '../core/economy';
import type { HumanStep } from '../core/humanSolver';
import type { Difficulty } from '../core/model';
import { Preferences } from '@capacitor/preferences';
import { isLevelUnlocked } from '../core/progression';
import { cloneGrid, type Grid, type Level } from '../core/model';
export interface Settings { music:boolean; sounds:boolean; vibrations:boolean; reducedMotion:boolean }
export interface LevelProgress { stars:number; completed:boolean; bestErrors:number; bestHints:number }
export interface Session { id:string; grid:Grid; errors:number; hints:number; remaining?:number|undefined; started?:boolean|undefined; failed?:boolean }
export interface SaveData { saveVersion:1; tutorialCompleted:boolean; settings:Settings; progress:Record<string,LevelProgress>; stats:{levelsCompleted:number;totalHints:number;totalErrors:number}; session:Session|null; journeyLevels:Record<string,Level>; refuges:Record<string,string>; kibble:number; purchasedHints:Record<string,HumanStep[]>; attemptPurchases:number; lastReward:number; logicVersion:number; ownedCosmetics:string[]; equipped:{background:string;cushion:string;wood:string}; cosmeticSeed:number; failures:Record<string,number>; lastUnlock:string|null }
const defaults=():SaveData=>({saveVersion:1,tutorialCompleted:false,settings:{music:false,sounds:true,vibrations:true,reducedMotion:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches},progress:{},stats:{levelsCompleted:0,totalHints:0,totalErrors:0},session:null,journeyLevels:{},refuges:{},kibble:STARTING_KIBBLE,purchasedHints:{},attemptPurchases:0,lastReward:0,logicVersion:3,ownedCosmetics:[...starterCosmetics],equipped:{background:'cream',cushion:'peach',wood:'honey'},cosmeticSeed:Math.floor(Math.random()*4294967296),failures:{},lastUnlock:null});
export class SaveServiceImpl {
  constructor(private storage: Pick<typeof Preferences, "get"|"set"> = Preferences) {}
  data:SaveData=defaults(); private key='meowza-save-v1'; private pending=Promise.resolve();
  saveFailed=false;
  async load(){try{const{value}=await this.storage.get({key:this.key});if(value){const parsed=JSON.parse(value) as Partial<SaveData>;this.data={...defaults(),...parsed,logicVersion:parsed.logicVersion??1,progress:parsed.progress&&typeof parsed.progress==='object'?parsed.progress:{},settings:{...defaults().settings,...parsed.settings},stats:{...defaults().stats,...parsed.stats}};}}catch{this.data=defaults();}
 this.data.equipped={...defaults().equipped,...this.data.equipped};
 for(const slot of ['background','cushion','wood'] as const)if(!cosmetics.some(c=>c.id===this.data.equipped[slot]&&c.slot===slot))this.data.equipped[slot]=defaults().equipped[slot];
 const owned=this.data.ownedCosmetics;const cleared=Object.entries(this.data.progress).filter(([id,p])=>id.startsWith('trail-')&&p.completed).length;
 const expected=Math.min(6,Math.floor(cleared/10));
 for(let i=owned.length-starterCosmetics.length;i<expected;i++){const id=unlockAt((i+1)*10,owned,this.data.cosmeticSeed^Math.imul((i+1)*10,2654435761));if(id)owned.push(id);}
 }
  persist(){const value=JSON.stringify(this.data);this.pending=this.pending.then(()=>this.storage.set({key:this.key,value})).then(()=>{this.saveFailed=false;}).catch(()=>{this.saveFailed=true;});return this.pending;}
  isUnlocked(id:string){return isLevelUnlocked(id,this.data.progress);}
  completedCount(difficulty:string){return Object.entries(this.data.progress).filter(([id,p])=>id.startsWith(`${difficulty}-`)&&p.completed).length;}
  restartAttempt(){this.data.session=null;this.data.attemptPurchases=0;void this.persist();}
  buyHint(id:string,step:HumanStep){const saved=this.data.purchasedHints[id]??=[];if(saved.some(s=>s.position[0]===step.position[0]&&s.position[1]===step.position[1]))return true;const cost=hintCost(this.data.attemptPurchases);if(this.data.kibble<cost)return false;this.data.kibble-=cost;this.data.attemptPurchases++;saved.push(step);void this.persist();return true;}
  remember(id:string,grid:Grid,errors:number,hints:number,remaining?:number,started?:boolean,failed=false){this.data.session={id,grid:cloneGrid(grid),errors,hints,remaining,started,failed};void this.persist();}
  async complete(id:string,stars:number,errors:number,hints:number){const old=this.data.progress[id];this.data.progress[id]={completed:true,stars:Math.max(stars,old?.stars??0),bestErrors:Math.min(errors,old?.bestErrors??Infinity),bestHints:Math.min(hints,old?.bestHints??Infinity)};this.data.lastReward=0;this.data.lastUnlock=null;if(!old?.completed){this.data.stats.levelsCompleted++;const difficulty=this.data.journeyLevels[id]?.difficulty??id.split('-')[0] as Difficulty;this.data.lastReward=this.data.journeyLevels[id]?.timed?18:rewardFor(difficulty)||5;this.data.kibble+=this.data.lastReward;
 const cleared=Object.entries(this.data.progress).filter(([key,p])=>key.startsWith('trail-')&&p.completed).length;
 const unlock=id.startsWith('trail-')?unlockAt(cleared,this.data.ownedCosmetics,this.data.cosmeticSeed^Math.imul(cleared,2654435761)):null;
 if(unlock){this.data.ownedCosmetics.push(unlock);this.data.lastUnlock=unlock;}}this.data.stats.totalErrors+=errors;this.data.stats.totalHints+=hints;this.data.session=null;this.data.attemptPurchases=0;await this.persist();}
}
export const SaveService=new SaveServiceImpl();
