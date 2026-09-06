import { Preferences } from '@capacitor/preferences';
import { isLevelUnlocked } from '../core/progression';
import { cloneGrid, type Grid, type Level } from '../core/model';
export interface Settings { music:boolean; sounds:boolean; vibrations:boolean; reducedMotion:boolean }
export interface LevelProgress { stars:number; completed:boolean; bestErrors:number; bestHints:number }
export interface Session { id:string; grid:Grid; errors:number; hints:number }
export interface SaveData { saveVersion:1; tutorialCompleted:boolean; settings:Settings; progress:Record<string,LevelProgress>; stats:{levelsCompleted:number;totalHints:number;totalErrors:number}; session:Session|null; journeyLevels:Record<string,Level>; refuges:Record<string,string> }
const defaults=():SaveData=>({saveVersion:1,tutorialCompleted:false,settings:{music:false,sounds:true,vibrations:true,reducedMotion:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches},progress:{},stats:{levelsCompleted:0,totalHints:0,totalErrors:0},session:null,journeyLevels:{},refuges:{}});
export class SaveServiceImpl {
  constructor(private storage: Pick<typeof Preferences, "get"|"set"> = Preferences) {}
  data:SaveData=defaults(); private key='meowza-save-v1'; private pending=Promise.resolve();
  saveFailed=false;
  async load(){try{const{value}=await this.storage.get({key:this.key});if(value){const parsed=JSON.parse(value) as Partial<SaveData>;this.data={...defaults(),...parsed,progress:parsed.progress&&typeof parsed.progress==='object'?parsed.progress:{},settings:{...defaults().settings,...parsed.settings},stats:{...defaults().stats,...parsed.stats}};}}catch{this.data=defaults();}}
  persist(){const value=JSON.stringify(this.data);this.pending=this.pending.then(()=>this.storage.set({key:this.key,value})).then(()=>{this.saveFailed=false;}).catch(()=>{this.saveFailed=true;});return this.pending;}
  isUnlocked(id:string){return isLevelUnlocked(id,this.data.progress);}
  completedCount(difficulty:string){return Object.entries(this.data.progress).filter(([id,p])=>id.startsWith(`${difficulty}-`)&&p.completed).length;}
  remember(id:string,grid:Grid,errors:number,hints:number){this.data.session={id,grid:cloneGrid(grid),errors,hints};void this.persist();}
  async complete(id:string,stars:number,errors:number,hints:number){const old=this.data.progress[id];this.data.progress[id]={completed:true,stars:Math.max(stars,old?.stars??0),bestErrors:Math.min(errors,old?.bestErrors??Infinity),bestHints:Math.min(hints,old?.bestHints??Infinity)};if(!old?.completed)this.data.stats.levelsCompleted++;this.data.stats.totalErrors+=errors;this.data.stats.totalHints+=hints;this.data.session=null;await this.persist();}
}
export const SaveService=new SaveServiceImpl();
