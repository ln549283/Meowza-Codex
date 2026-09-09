import Phaser from 'phaser';
import type { HumanStep } from '../../core/humanSolver';
import { hintCost,MAX_HINTS_PER_ATTEMPT } from '../../core/economy';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
const ruleName=(s:HumanStep)=>({balance:'Équilibre',triple:'Jamais trois',relation:'Cœur / griffes',contradiction:'Déduction avancée'})[s.rule];
function proofPages(s:HumanStep):string[]{return s.rule==='contradiction'?[`On teste une possibilité : chat ${s.assumption===1?'gris':'roux'} en L${s.position[0]+1} · C${s.position[1]+1}.`,...(s.consequences??[]).map(x=>x.explanation),s.contradiction!,s.explanation]:[s.explanation];}
export class HintScene extends Phaser.Scene {
 constructor(){super('Hint');}
 create({step,levelId,apply,onRead,onPurchased,open=false}:{step:HumanStep|null;levelId:string;apply:()=>void;onRead:()=>void;onPurchased?:()=>void;open?:boolean}){
  cozyBackground(this);title(this,'Un petit coup de patte',235,56);panel(this,540,940,940,1040);
  const close=()=>{this.scene.stop();this.scene.resume('Game');};
  const owned=step&&(SaveService.data.purchasedHints[levelId]??[]).some(s=>s.position[0]===step.position[0]&&s.position[1]===step.position[1]);
  const used=SaveService.data.attemptPurchases,exhausted=used>=MAX_HINTS_PER_ATTEMPT;
  if(!open&&!owned){
   imageContain(this.add.image(540,610,'orange-cat'),230,230);
   label(this,540,825,step&&!exhausted?'Besoin d’un petit coup de patte ?':exhausted?'Plus d’indice pour cette tentative':'Aucune déduction disponible',43);
   const cost=hintCost(used),affordable=!exhausted&&SaveService.data.kibble>=cost;
   label(this,540,970,step&&!exhausted?`Cet indice coûte ${cost} croquettes.`:'Continue à observer la grille : la solution est toujours logique.',33);
   label(this,540,1080,step&&!exhausted?'Une règle, une raison, une case.':'Tu peux revenir au puzzle et poursuivre ta réflexion.',30);
   const text=!step||exhausted?'Revenir au jeu':affordable?`Voir l’indice · ${cost} croquettes`:`Il manque ${cost-SaveService.data.kibble} croquettes`;
   const buy=button(this,540,1350,770,text,()=>{if(!step||exhausted){close();return;}if(!affordable||!SaveService.buyHint(levelId,step))return;onPurchased?.();this.scene.restart({step,levelId,apply,onRead,onPurchased,open:true});},C.teal);
   if(step&&!exhausted&&!affordable)buy.disableInteractive().setAlpha(.5);
   button(this,540,1535,640,'Continuer à réfléchir',close,0xb398a5);return;
  }
  if(!step){close();return;}onRead();imageContain(this.add.image(540,535,step.value===1?'grey-cat':'orange-cat'),190,190);label(this,540,685,ruleName(step),28);label(this,540,735,`Ligne ${step.position[0]+1} · Colonne ${step.position[1]+1}`,36);
  const pages=proofPages(step);let i=0;const text=label(this,540,990,pages[0]!,34).setWordWrapWidth(780),counter=label(this,540,1260,'',28);
  const prev=button(this,310,1430,370,'Précédent',()=>{i--;refresh();}),next=button(this,770,1430,370,'Suite',()=>{i++;refresh();},C.pink);
  const refresh=()=>{text.setText(pages[i]!);counter.setText(pages.length>1?`${i+1} / ${pages.length}`:'');prev.setVisible(i>0);next.setVisible(i<pages.length-1);};refresh();
  button(this,540,1620,750,'Je place le chat moi-même',close);button(this,540,1790,750,'Placer ce chat · sans supplément',()=>{close();apply();},C.pink);
 }
}
