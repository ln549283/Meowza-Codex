import { cosmetics,starterCosmetics,unlockAt,cosmeticPrice } from '../core/cosmetics';
import { collectionCats,habitatMilestones } from '../core/cats';
import { journeyId,journeySpec,nextSummit } from '../core/journey';
import { STARTING_KIBBLE,rewardFor,hintCost,MAX_HINTS_PER_ATTEMPT } from '../core/economy';
import type { HumanStep } from '../core/humanSolver';
import type { Difficulty } from '../core/model';
import { Preferences } from '@capacitor/preferences';
import { isLevelUnlocked } from '../core/progression';
import { cloneGrid, type Grid, type Level } from '../core/model';

export interface Settings { music:boolean; sounds:boolean; vibrations:boolean; reducedMotion:boolean }
export interface LevelProgress { completed:boolean; bestErrors:number; bestHints:number }
export interface Session { id:string; grid:Grid; errors:number; hints:number; remaining?:number|undefined; started?:boolean|undefined; failed?:boolean; hintPositions?:string[] }
export interface LevelAnalytics { attempts:number;wins:number;abandons:number;failuresErrors:number;failuresTime:number;placements:number;wrongPlacements:number;hintsBought:number }
export type DailyMissionMetric='complete'|'max_one_error'|'no_hint'|'medium_plus'|'perfect'|'perfect_streak'|'clean'|'error_budget'|'timed'|'hard_plus'|'extreme_no_hint'|'hard_extreme_perfect'|'timed_perfect';
export interface DailyMission { id:string;family:'engagement'|'mastery'|'challenge';metric:DailyMissionMetric;title:string;subtitle:string;target:number;progress:number;claimed:boolean;reward:number; errorWindow?:number[] }
export interface DailyMissionState { date:string;missions:DailyMission[];perfectStreak:number }
export interface MissionState { daily:DailyMissionState|null;globalClaimed:Record<string,number>;diamonds:number }
export interface SaveData { saveVersion:4; tutorialCompleted:boolean; settings:Settings; progress:Record<string,LevelProgress>; stats:{levelsCompleted:number;totalHints:number;totalErrors:number}; analytics:Record<string,LevelAnalytics>; session:Session|null; journeyLevels:Record<string,Level>; refuges:Record<string,string>; kibble:number; purchasedHints:Record<string,HumanStep[]>; attemptPurchases:number; lastReward:number; logicVersion:number; ownedCosmetics:string[]; ownedCats:string[]; equipped:{background:string;cushion:string;wood:string}; cosmeticSeed:number; failures:Record<string,number>; lastUnlock:string|null; missions:MissionState }

const missionDefaults=():MissionState=>({daily:null,globalClaimed:{},diamonds:0});
const defaults=():SaveData=>({saveVersion:4,tutorialCompleted:false,settings:{music:false,sounds:true,vibrations:true,reducedMotion:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches},progress:{},stats:{levelsCompleted:0,totalHints:0,totalErrors:0},analytics:{},session:null,journeyLevels:{},refuges:{},kibble:STARTING_KIBBLE,purchasedHints:{},attemptPurchases:0,lastReward:0,logicVersion:3,ownedCosmetics:[...starterCosmetics],ownedCats:[],equipped:{background:'cream',cushion:'peach',wood:'honey'},cosmeticSeed:Math.floor(Math.random()*4294967296),failures:{},lastUnlock:null,missions:missionDefaults()});
const emptyAnalytics=():LevelAnalytics=>({attempts:0,wins:0,abandons:0,failuresErrors:0,failuresTime:0,placements:0,wrongPlacements:0,hintsBought:0});
const localDate=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const hash=(s:string)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
const pools:{family:DailyMission['family'];items:Omit<DailyMission,'family'|'progress'|'claimed'|'reward'>[]}[]=[
 {family:'engagement',items:[
  {id:'climb5',metric:'complete',title:'Grimpe dans l’arbre',subtitle:'Termine 5 niveaux',target:5},
  {id:'smooth3',metric:'max_one_error',title:'Beau parcours',subtitle:'Termine 3 niveaux avec 1 erreur max.',target:3},
  {id:'net3',metric:'no_hint',title:'Sans filet',subtitle:'Termine 3 niveaux sans indice',target:3},
  {id:'serious3',metric:'medium_plus',title:'Échauffement sérieux',subtitle:'Termine 3 niveaux Medium ou +',target:3},
 ]},
 {family:'mastery',items:[
  {id:'perfect3',metric:'perfect',title:'Patte parfaite',subtitle:'Réussis 3 niveaux parfaits',target:3},
  {id:'streak2',metric:'perfect_streak',title:'Série parfaite',subtitle:'Réussis 2 parfaits d’affilée',target:2},
  {id:'solo2',metric:'clean',title:'Tout seul !',subtitle:'2 niveaux sans erreur ni indice',target:2},
  {id:'nohelp4',metric:'no_hint',title:'Sans coup de patte',subtitle:'Termine 4 niveaux sans indice',target:4},
  {id:'precision5',metric:'error_budget',title:'Précision féline',subtitle:'5 victoires de suite avec 2 erreurs max.',target:5},
 ]},
 {family:'challenge',items:[
  {id:'claw1',metric:'timed',title:'Coup de griffe',subtitle:'Réussis 1 Coup de griffe',target:1},
  {id:'hard2',metric:'hard_plus',title:'Griffes sorties',subtitle:'Réussis 2 niveaux Hard ou +',target:2},
  {id:'extreme_clean',metric:'extreme_no_hint',title:'Expert félin',subtitle:'Réussis 1 Extreme sans indice',target:1},
  {id:'hard_perfect',metric:'hard_extreme_perfect',title:'Impeccable',subtitle:'Réussis 1 Hard ou Extreme parfaitement',target:1},
  {id:'claw_perfect',metric:'timed_perfect',title:'Haute tension',subtitle:'Réussis 1 Coup de griffe sans erreur',target:1},
 ]},
];

export class SaveServiceImpl {
  constructor(private storage: Pick<typeof Preferences, "get"|"set"> = Preferences) {}
  data:SaveData=defaults(); private key='meowza-save-v1'; private pending=Promise.resolve();
  saveFailed=false;

  async load(){try{const{value}=await this.storage.get({key:this.key});if(value){const parsed=JSON.parse(value) as Partial<SaveData>&{progress?:Record<string,Partial<LevelProgress>&{stars?:number}>};const rawProgress=parsed.progress&&typeof parsed.progress==='object'?parsed.progress:{};const progress:Record<string,LevelProgress>={};for(const[id,p]of Object.entries(rawProgress))progress[id]={completed:!!p.completed,bestErrors:Number.isFinite(p.bestErrors)?Number(p.bestErrors):0,bestHints:Number.isFinite(p.bestHints)?Number(p.bestHints):0};const rawAnalytics=parsed.analytics&&typeof parsed.analytics==='object'?parsed.analytics:{};const analytics:Record<string,LevelAnalytics>={};for(const[id,a]of Object.entries(rawAnalytics))analytics[id]={...emptyAnalytics(),...a};this.data={...defaults(),...parsed,saveVersion:4,logicVersion:parsed.logicVersion??1,progress,analytics,settings:{...defaults().settings,...parsed.settings},stats:{...defaults().stats,...parsed.stats},missions:{...missionDefaults(),...parsed.missions,globalClaimed:{...parsed.missions?.globalClaimed}}};}}catch{this.data=defaults();}
   this.restoreCollection();
   this.data.equipped={...defaults().equipped,...this.data.equipped};
   this.data.ownedCats=(this.data.ownedCats??[]).filter(id=>collectionCats.some(cat=>cat.id===id));
   const cleared=this.trailCompletedCount(),supportCount=habitatMilestones(cleared);for(const[key,cat]of Object.entries(this.data.refuges)){const level=Number(key);if(!Number.isFinite(level)||level%10!==0||level/10>supportCount||!this.data.ownedCats.includes(cat))delete this.data.refuges[key];}
   for(const slot of ['background','cushion','wood'] as const)if(!cosmetics.some(c=>c.id===this.data.equipped[slot]&&c.slot===slot))this.data.equipped[slot]=defaults().equipped[slot];
   const owned=this.data.ownedCosmetics;const expected=Math.min(6,Math.floor(cleared/10));
   for(let i=owned.length-starterCosmetics.length;i<expected;i++){const id=unlockAt((i+1)*10,owned,this.data.cosmeticSeed^Math.imul((i+1)*10,2654435761));if(id)owned.push(id);}
   this.ensureDailyMissions();await this.persist();
  }

  private restoreCollection(){
   const retired=['forest','blossom','autumn','winter','beach','garden','sunset','rain','moon-garden'];
   const removed=this.data.ownedCosmetics.filter(id=>retired.includes(id));
   this.data.kibble+=new Set(removed).size*180;
   this.data.ownedCosmetics=[...new Set([...starterCosmetics,...this.data.ownedCosmetics.filter(id=>cosmetics.some(c=>c.id===id))])];
   const count=Math.min(collectionCats.length,Math.floor(this.trailCompletedCount()/10));
   this.data.ownedCats=[...new Set([...(this.data.ownedCats??[]).filter(id=>collectionCats.some(c=>c.id===id)),...collectionCats.slice(0,count).map(c=>c.id)])];
  }
  buyCosmetic(id:string){
   const item=cosmetics.find(c=>c.id===id),price=cosmeticPrice(id);
   if(!item||price<=0||this.data.ownedCosmetics.includes(id)||this.data.kibble<price)return false;
   this.data.kibble-=price;this.data.ownedCosmetics.push(id);void this.persist();return true;
  }

  persist(){const value=JSON.stringify(this.data);this.pending=this.pending.then(()=>this.storage.set({key:this.key,value})).then(()=>{this.saveFailed=false;}).catch(()=>{this.saveFailed=true;});return this.pending;}
  isUnlocked(id:string){return isLevelUnlocked(id,this.data.progress);}
  completedCount(difficulty:string){return Object.entries(this.data.progress).filter(([id,p])=>id.startsWith(`${difficulty}-`)&&p.completed).length;}
  trailCompletedCount(){return Object.entries(this.data.progress).filter(([id,p])=>id.startsWith('trail-')&&p.completed).length;}
  private analyticsFor(id:string){return this.data.analytics[id]??(this.data.analytics[id]=emptyAnalytics());}
  trackAttemptStart(id:string){this.analyticsFor(id).attempts++;}
  trackPlacement(id:string,correct:boolean){const a=this.analyticsFor(id);a.placements++;if(!correct)a.wrongPlacements++;}
  trackHint(id:string){this.analyticsFor(id).hintsBought++;}
  trackAbandon(id:string){this.analyticsFor(id).abandons++;this.breakDailyStreak();}
  trackFailure(id:string,reason:'errors'|'time'){const a=this.analyticsFor(id);if(reason==='time')a.failuresTime++;else a.failuresErrors++;this.breakDailyStreak();}
  trackWin(id:string){this.analyticsFor(id).wins++;}

  ensureDailyMissions(){
   const date=localDate(),existing=this.data.missions.daily;
   if(existing?.date===date){
    let changed=false;
    for(const m of existing.missions){
     // The former progress counter did not record errors: do not invent them.
     if(m.metric==='error_budget'&&!Array.isArray(m.errorWindow)&&!m.claimed&&m.progress<m.target){m.progress=0;m.errorWindow=[];changed=true;}
    }
    if(changed)void this.persist();
    return existing;
   }
   const seed=hash(`${date}:${this.data.cosmeticSeed}`);
   // A prefetched grid is not necessarily playable. Include the actual next
   // summit even before its worker has produced a cached grid.
   const playable=Object.values(this.data.journeyLevels).filter(l=>this.isUnlocked(l.id));
   const available=[...playable,journeySpec(nextSummit(this.data.progress))];
   const hasMedium=available.some(l=>l.difficulty!=='easy');
   const hasTimed=available.some(l=>l.timed),hasExtreme=available.some(l=>l.difficulty==='extreme'),hasHard=available.some(l=>l.difficulty==='hard'||l.difficulty==='extreme');
   const eligible=(m:typeof pools[number]['items'][number])=>
    (m.metric!=='medium_plus'||hasMedium)&&
    (!m.metric.startsWith('timed')||hasTimed)&&
    (!m.metric.startsWith('extreme')||hasExtreme)&&
    (!['hard_plus','hard_extreme_perfect'].includes(m.metric)||hasHard);
   const selected=new Set<string>();
   const missions:DailyMission[]=pools.map((pool,i)=>{
    let choices=pool.items.filter(eligible);
    if(!choices.length)choices=pools[0]!.items.filter(eligible);
    choices=choices.filter(m=>!selected.has(m.id));
    const base=choices[(seed+i*2654435761)%choices.length]!;
    selected.add(base.id);
    return {...base,family:pool.family,progress:0,claimed:false,reward:1,...(base.metric==='error_budget'?{errorWindow:[]}: {})};
   });
   this.data.missions.daily={date,missions,perfectStreak:0};void this.persist();return this.data.missions.daily;
  }
  private breakDailyStreak(){
   const daily=this.ensureDailyMissions();daily.perfectStreak=0;
   for(const m of daily.missions)if(!m.claimed&&m.progress<m.target){if(m.metric==='error_budget'){m.errorWindow=[];m.progress=0;}else if(m.metric==='perfect_streak')m.progress=0;}
   void this.persist();
  }
  claimDaily(id:string){const daily=this.ensureDailyMissions(),m=daily.missions.find(x=>x.id===id);if(!m||m.claimed||m.progress<m.target)return false;m.claimed=true;this.data.missions.diamonds+=m.reward;void this.persist();return true;}
  claimGlobal(id:string,threshold:number,kibble:number,diamonds=0){const claimed=this.data.missions.globalClaimed[id]??0;if(threshold<=claimed)return false;this.data.missions.globalClaimed[id]=threshold;this.data.kibble+=kibble;this.data.missions.diamonds+=diamonds;void this.persist();return true;}
  assignCat(level:number,catId:string|null){if(level%10!==0||level>this.trailCompletedCount())return false;if(catId===null){delete this.data.refuges[String(level)];void this.persist();return true;}if(!this.data.ownedCats.includes(catId))return false;for(const[key,id]of Object.entries(this.data.refuges))if(id===catId&&key!==String(level))delete this.data.refuges[key];this.data.refuges[String(level)]=catId;void this.persist();return true;}
  private updateDailyOnWin(level:Level,errors:number,hints:number){const d=this.ensureDailyMissions();d.perfectStreak=errors===0?d.perfectStreak+1:0;for(const m of d.missions){if(m.progress>=m.target)continue;let ok=false;switch(m.metric){case'complete':ok=true;break;case'max_one_error':ok=errors<=1;break;case'no_hint':ok=hints===0;break;case'medium_plus':ok=level.difficulty!=='easy';break;case'perfect':ok=errors===0;break;case'perfect_streak':m.progress=Math.min(m.target,d.perfectStreak);continue;case'clean':ok=errors===0&&hints===0;break;case'error_budget':{
    // Keep the longest trailing run of wins within the two-error budget.
    // This also lets the player recover naturally after exceeding the budget.
    const window=[...(m.errorWindow??[]),errors].slice(-m.target);
    while(window.reduce((sum,value)=>sum+value,0)>2)window.shift();
    m.errorWindow=window;m.progress=window.length;continue;
   }case'timed':ok=!!level.timed;break;case'hard_plus':ok=level.difficulty==='hard'||level.difficulty==='extreme';break;case'extreme_no_hint':ok=level.difficulty==='extreme'&&hints===0;break;case'hard_extreme_perfect':ok=(level.difficulty==='hard'||level.difficulty==='extreme')&&errors===0;break;case'timed_perfect':ok=!!level.timed&&errors===0;break;}if(ok)m.progress=Math.min(m.target,m.progress+1);}}

  addTestKibble(amount=1000){this.data.kibble+=Math.max(0,Math.floor(amount));void this.persist();}
  addTestDiamonds(amount=500){this.data.missions.diamonds+=Math.max(0,Math.floor(amount));void this.persist();}
  async skipTestLevels(count=10){
   const before=this.trailCompletedCount(),start=nextSummit(this.data.progress),safeCount=Math.max(0,Math.floor(count));let added=0,n=start;
   while(added<safeCount){const id=journeyId(n);if(!this.data.progress[id]?.completed){this.data.progress[id]={completed:true,bestErrors:0,bestHints:0};added++;}n++;}
   this.data.stats.levelsCompleted+=added;const after=this.trailCompletedCount();
   for(let cleared=before+1;cleared<=after;cleared++){if(cleared%10!==0)continue;const unlock=unlockAt(cleared,this.data.ownedCosmetics,this.data.cosmeticSeed^Math.imul(cleared,2654435761));if(unlock&&!this.data.ownedCosmetics.includes(unlock))this.data.ownedCosmetics.push(unlock);}
   this.restoreCollection();this.data.session=null;this.data.attemptPurchases=0;this.data.purchasedHints={};await this.persist();return added;
  }

  restartAttempt(){this.data.session=null;this.data.attemptPurchases=0;this.data.purchasedHints={};void this.persist();}
  async newGame(){const settings={...this.data.settings};this.data=defaults();this.data.settings=settings;await this.persist();}

  buyHint(id:string,step:HumanStep){
   if(this.data.attemptPurchases>=MAX_HINTS_PER_ATTEMPT)return false;
   const saved=this.data.purchasedHints[id]??=[];
   if(saved.some(s=>s.position[0]===step.position[0]&&s.position[1]===step.position[1]))return true;
   const cost=hintCost(this.data.attemptPurchases);if(!Number.isFinite(cost)||this.data.kibble<cost)return false;
   this.data.kibble-=cost;this.data.attemptPurchases++;saved.push(step);this.data.purchasedHints={[id]:saved};void this.persist();return true;
  }

  remember(id:string,grid:Grid,errors:number,hints:number,remaining?:number,started?:boolean,failed=false,hintPositions?:string[]){const used=hintPositions??(this.data.session?.id===id?this.data.session.hintPositions:[])??[];this.data.session={id,grid:cloneGrid(grid),errors,hints,remaining,started,failed,hintPositions:used};void this.persist();}

  async complete(id:string,errors:number,hints:number){
   const trail=/^trail-([1-9]\d*)$/.exec(id);
   const spec=trail?journeySpec(Number(trail[1])):undefined;
   const difficulty=this.data.journeyLevels[id]?.difficulty??spec?.difficulty??id.split('-')[0] as Difficulty;
   const level=this.data.journeyLevels[id]??{id,difficulty,size:spec?.size??4,initial:[],solution:[],constraints:[],...(spec?.timed?{timed:true}:{})};
   // Daily goals count wins, including replays. First-clear currency and
   // cosmetic unlocks remain strictly inside the first-completion branch.
   this.updateDailyOnWin(level??{id,difficulty,size:4,initial:[],solution:[],constraints:[]},errors,hints);
   const old=this.data.progress[id];this.data.progress[id]={completed:true,bestErrors:old?.completed?Math.min(errors,old.bestErrors):errors,bestHints:old?.completed?Math.min(hints,old.bestHints):hints};this.data.lastReward=0;this.data.lastUnlock=null;if(!old?.completed){this.data.stats.levelsCompleted++;this.data.lastReward=level?.timed?18:rewardFor(difficulty)||5;this.data.kibble+=this.data.lastReward;
   const cleared=this.trailCompletedCount();
   const unlock=id.startsWith('trail-')?unlockAt(cleared,this.data.ownedCosmetics,this.data.cosmeticSeed^Math.imul(cleared,2654435761)):null;
   if(unlock){this.data.ownedCosmetics.push(unlock);this.data.lastUnlock=unlock;}}
   this.restoreCollection();this.data.stats.totalErrors+=errors;this.data.stats.totalHints+=hints;this.data.session=null;this.data.attemptPurchases=0;this.data.purchasedHints={};await this.persist();}
}

export const SaveService=new SaveServiceImpl();
