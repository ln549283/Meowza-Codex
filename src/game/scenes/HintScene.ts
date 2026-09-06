import Phaser from 'phaser';
import type { HumanStep } from '../../core/humanSolver';
import { hintCost } from '../../core/economy';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
function proofPages(s:HumanStep):string[]{return s.rule==='contradiction'?[`Imagine un chat ${s.assumption===1?'gris':'roux'} en L${s.position[0]+1} · C${s.position[1]+1}. Ce test reste dans notre tête.`,...(s.consequences??[]).map(x=>x.explanation),s.contradiction!,s.explanation]:[s.explanation];}
export class HintScene extends Phaser.Scene {
 constructor(){super('Hint');}
 create({step,levelId,apply,open=false}:{step:HumanStep|null;levelId:string;apply:()=>void;open?:boolean}){
  cozyBackground(this);title(this,'Un petit coup de patte',235,56);panel(this,540,940,940,1120);
  const close=()=>{this.scene.stop();this.scene.resume('Game');};
  const owned=step&&(SaveService.data.purchasedHints[levelId]??[]).some(s=>s.position[0]===step.position[0]&&s.position[1]===step.position[1]);
  if(!open){label(this,540,540,'Un rappel gratuit',42);label(this,540,820,'Autant de gris que de roux.\nJamais trois identiques à la suite.\nCœur : identiques. Griffes : opposés.\n\nCherche d’abord une ligne presque remplie.',35).setWordWrapWidth(780);label(this,540,1120,`${SaveService.data.kibble} croquettes disponibles`,34);
   const cost=owned?0:hintCost(SaveService.data.attemptPurchases);const free=!owned&&SaveService.data.kibble<cost;
   label(this,540,1280,free?'Solde insuffisant. Le rappel reste gratuit.':'Les indices achetés restent accessibles\naprès un échec sur cette grille.',30);
   button(this,540,1470,790,!step?'Grille terminée':owned?'Relire cet indice · gratuit':free?`${cost} croquettes nécessaires`:`Expliquer une case · ${cost} croquettes`,()=>{if(!step||free)return;if(!SaveService.buyHint(levelId,step))return;this.scene.restart({step,levelId,apply,open:true});},C.pink);
   button(this,540,1700,720,'Je continue à réfléchir',close,C.teal);return;
  }
  if(!step){close();return;}imageContain(this.add.image(540,535,step.value===1?'grey-cat':'orange-cat'),190,190);label(this,540,700,`Ligne ${step.position[0]+1} · Colonne ${step.position[1]+1}`,36);
  const pages=proofPages(step);let i=0;const text=label(this,540,975,pages[0]!,36).setWordWrapWidth(780),counter=label(this,540,1260,'',28);
  const prev=button(this,310,1430,370,'Précédent',()=>{i--;refresh();}),next=button(this,770,1430,370,'Suite',()=>{i++;refresh();},C.pink);
  const refresh=()=>{text.setText(pages[i]!);counter.setText(`${i+1} / ${pages.length}`);prev.setVisible(i>0);next.setVisible(i<pages.length-1);};refresh();
  button(this,540,1620,750,'Je place le chat moi-même',close);button(this,540,1790,750,'Placer ce chat · sans supplément',()=>{close();apply();},C.pink);
 }
}
