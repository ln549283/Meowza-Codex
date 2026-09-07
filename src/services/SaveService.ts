import { Preferences } from '@capacitor/preferences';
import { isLevelUnlocked } from '../core/progression';
import { cloneGrid, type Grid } from '../core/model';
export interface Settings { music:boolean; sounds:boolean; vibrations:boolean; reducedMotion:boolean }
export interface LevelProgress { completed:boolean; bestErrors:number; bestHints:number }
export interface Session { id:string; grid:Grid; errors:number; hints:number }
export interface SaveData { saveVersion:2; tutorialCompleted:boolean; settings:Settings; progress:Record<string,LevelProgress>; stats:{levelsCompleted:number;totalHints:number;totalErrors:number}; session:Session|null }
const defaults=():SaveData=>({saveVersion:2,tutorialCompleted:false,settings:{music:false,sounds:true,vibrations:true,reducedMotion:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches},progress:{},stats:{levelsCompleted:0,totalHints:0,totalErrors:0},session:null});
export class SaveServiceImpl {
  constructor(private storage: Pick<typeof Preferences, "get"|"set"> = Preferences) {}
  data:SaveData=defaults(); private key='meowza-save-v1'; private pending=Promise.resolve();
  saveFailed=false;
  async load(){try{const{value}=await this.storage.get({key:this.key});if(value){const parsed=JSON.parse(value) as Partial<SaveData>&{progress?:Record<string,Partial<LevelProgress>&{stars?:number}>};const progress:Record<string,LevelProgress>={};if(parsed.progress&&typeof parsed.progress==='object')for(const[id,p]of Object.entries(parsed.progress))progress[id]={completed:p.completed===true,bestErrors:Number.isFinite(p.bestErrors)?p.bestErrors!:Infinity,bestHints:Number.isFinite(p.bestHints)?p.bestHints!:Infinity};this.data={...defaults(),...parsed,saveVersion:2,progress,settings:{...defaults().settings,...parsed.settings},stats:{...defaults().stats,...parsed.stats}};}}catch{this.data=defaults();}}
  persist(){const value=JSON.stringify(this.data);this.pending=this.pending.then(()=>this.storage.set({key:this.key,value})).then(()=>{this.saveFailed=false;}).catch(()=>{this.saveFailed=true;});return this.pending;}
  isUnlocked(id:string){return isLevelUnlocked(id,this.data.progress);}
  completedCount(difficulty:string){return Object.entries(this.data.progress).filter(([id,p])=>id.startsWith(`${difficulty}-`)&&p.completed).length;}
  remember(id:string,grid:Grid,errors:number,hints:number){this.data.session={id,grid:cloneGrid(grid),errors,hints};void this.persist();}
  clearSession(){this.data.session=null;void this.persist();}
  async complete(id:string,errors:number,hints:number){const old=this.data.progress[id];this.data.progress[id]={completed:true,bestErrors:Math.min(errors,old?.bestErrors??Infinity),bestHints:Math.min(hints,old?.bestHints??Infinity)};if(!old?.completed)this.data.stats.levelsCompleted++;this.data.stats.totalErrors+=errors;this.data.stats.totalHints+=hints;this.data.session=null;await this.persist();}
}
export const SaveService=new SaveServiceImpl();
