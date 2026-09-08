import { cosmetics,starterCosmetics,unlockAt } from '../core/cosmetics';
import { STARTING_KIBBLE,rewardFor,hintCost,MAX_HINTS } from '../core/economy';
import type { HumanStep } from '../core/humanSolver';
import type { Difficulty } from '../core/model';
import { Preferences } from '@capacitor/preferences';
import { isLevelUnlocked } from '../core/progression';
import { cloneGrid, type Grid, type Level } from '../core/model';
export interface Settings { music:boolean; sounds:boolean; vibrations:boolean; reducedMotion:boolean }
export interface LevelProgress { stars?:number; completed:boolean; bestErrors:number; bestHints:number }
export interface Session { id:string; grid:Grid; errors:number; hints:number; remaining?:number|undefined; started?:boolean|undefined; failed?:boolean; hintSteps?:HumanStep[]; hintMigrationNotice?:boolean }
export interface SaveData { saveVersion:1; tutorialCompleted:boolean; settings:Settings; progress:Record<string,LevelProgress>; stats:{levelsCompleted:number;totalHints:number;totalErrors:number}; session:Session|null; journeyLevels:Record<string,Level>; refuges:Record<string,string>; kibble:number; hintRulesVersion:number; lastReward:number; logicVersion:number; ownedCosmetics:string[]; equipped:{background:string;cushion:string;wood:string}; cosmeticSeed:number; failures:Record<string,number>; lastUnlock:string|null }
const defaults=():SaveData=>({saveVersion:1,tutorialCompleted:false,settings:{music:false,sounds:true,vibrations:true,reducedMotion:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches},progress:{},stats:{levelsCompleted:0,totalHints:0,totalErrors:0},session:null,journeyLevels:{},refuges:{},kibble:STARTING_KIBBLE,hintRulesVersion:1,lastReward:0,logicVersion:3,ownedCosmetics:[...starterCosmetics],equipped:{background:'cream',cushion:'peach',wood:'honey'},cosmeticSeed:Math.floor(Math.random()*4294967296),failures:{},lastUnlock:null});
export class SaveServiceImpl {
  constructor(private storage: Pick<typeof Preferences, "get"|"set"> = Preferences) {}
  data:SaveData=defaults(); private key='meowza-save-v1'; private pending=Promise.resolve();
  saveFailed=false;
  async load(){try{const{value}=await this.storage.get({key:this.key});if(value){const parsed=JSON.parse(value) as Partial<SaveData>;this.data={...defaults(),...parsed,logicVersion:parsed.logicVersion??1,hintRulesVersion:parsed.hintRulesVersion??0,progress:parsed.progress&&typeof parsed.progress==='object'?parsed.progress:{},settings:{...defaults().settings,...parsed.settings},stats:{...defaults().stats,...parsed.stats}};}}catch{this.data=defaults();}
 // Old multi-attempt hint libraries are intentionally not carried into this contract.
 const legacy=this.data as unknown as Record<string,unknown>;
 if(this.data.hintRulesVersion!==1){
  const session=this.data.session;
  if(session){
   const count=Math.max(Number.isFinite(session.hints)?session.hints:0,typeof legacy.attemptPurchases==='number'&&Number.isFinite(legacy.attemptPurchases)?legacy.attemptPurchases:0);
   session.hints=Math.min(MAX_HINTS,Math.max(0,Math.floor(count)));
   session.hintSteps=[];
   session.hintMigrationNotice=session.hints>0;
  }
  this.data.hintRulesVersion=1;
 }
 delete legacy.purchasedHints;
 delete legacy.attemptPurchases;
 this.data.equipped={...defaults().equipped,...this.data.equipped};
 for(const slot of ['background','cushion','wood'] as const)if(!cosmetics.some(c=>c.id===this.data.equipped[slot]&&c.slot===slot))this.data.equipped[slot]=defaults().equipped[slot];
 const owned=this.data.ownedCosmetics;const cleared=Object.entries(this.data.progress).filter(([id,p])=>id.startsWith('trail-')&&p.completed).length;
 const expected=Math.min(6,Math.floor(cleared/10));
 for(let i=owned.length-starterCosmetics.length;i<expected;i++){const id=unlockAt((i+1)*10,owned,this.data.cosmeticSeed^Math.imul((i+1)*10,2654435761));if(id)owned.push(id);}
 }
  persist(){const value=JSON.stringify(this.data);this.pending=this.pending.then(()=>this.storage.set({key:this.key,value})).then(()=>{this.saveFailed=false;}).catch(()=>{this.saveFailed=true;});return this.pending;}
  isUnlocked(id:string){return isLevelUnlocked(id,this.data.progress);}
  completedCount(difficulty:string){return Object.entries(this.data.progress).filter(([id,p])=>id.startsWith(`${difficulty}-`)&&p.completed).length;}
  restartAttempt(){this.data.session=null;void this.persist();}
  ownedHint(id:string,step:HumanStep){
   const session=this.data.session;
   if(!session||session.id!==id||session.failed||session.errors>=3)return undefined;
   return session.hintSteps?.find(s=>s.position[0]===step.position[0]&&s.position[1]===step.position[1]&&s.value===step.value);
  }
  buyHint(id:string,step:HumanStep){
   const session=this.data.session;
   if(!session||session.id!==id||session.failed||session.errors>=3)return false;
   if(this.ownedHint(id,step))return true;
   const cost=hintCost(session.hints),[r,c]=step.position;
   if(cost===null||!Number.isFinite(this.data.kibble)||this.data.kibble<cost||!Number.isInteger(r)||!Number.isInteger(c)||session.grid[r]?.[c]!==0||![1,2].includes(step.value))return false;
   this.data.kibble-=cost;
   session.hints++;
   (session.hintSteps??=[]).push(JSON.parse(JSON.stringify(step)) as HumanStep);
   void this.persist();
   return true;
  }
  remember(id:string,grid:Grid,errors:number,hints:number,remaining?:number,started?:boolean,failed=false){
   const previous=this.data.session?.id===id?this.data.session:null;
   this.data.session={id,grid:cloneGrid(grid),errors,hints:previous?Math.max(previous.hints,hints):hints,remaining,started,failed,hintSteps:previous?.hintSteps??[],hintMigrationNotice:previous?.hintMigrationNotice??false};
   void this.persist();
  }
  async complete(id:string,errors:number,hints:number){const old=this.data.progress[id];if(old?.completed&&this.data.session?.id!==id){await this.persist();return;}this.data.progress[id]={completed:true,...(old?.stars!==undefined?{stars:old.stars}:{}),bestErrors:Math.min(errors,old?.bestErrors??Infinity),bestHints:Math.min(hints,old?.bestHints??Infinity)};this.data.lastReward=0;this.data.lastUnlock=null;if(!old?.completed){this.data.stats.levelsCompleted++;const difficulty=this.data.journeyLevels[id]?.difficulty??id.split('-')[0] as Difficulty;this.data.lastReward=this.data.journeyLevels[id]?.timed?18:rewardFor(difficulty)||5;this.data.kibble+=this.data.lastReward;
 const cleared=Object.entries(this.data.progress).filter(([key,p])=>key.startsWith('trail-')&&p.completed).length;
 const unlock=id.startsWith('trail-')?unlockAt(cleared,this.data.ownedCosmetics,this.data.cosmeticSeed^Math.imul(cleared,2654435761)):null;
 if(unlock){this.data.ownedCosmetics.push(unlock);this.data.lastUnlock=unlock;}}this.data.stats.totalErrors+=errors;this.data.stats.totalHints+=hints;this.data.session=null;await this.persist();}
}
export const SaveService=new SaveServiceImpl();
