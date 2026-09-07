import Phaser from 'phaser';
import type { HumanStep } from '../../core/humanSolver';
import { hintCost } from '../../core/economy';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
function proofPages(s:HumanStep):string[]{return s.rule==='contradiction'?[`Imagine un chat ${s.assumption===1?'gris':'roux'} en L${s.position[0]+1} · C${s.position[1]+1}. Ce test reste dans notre tête.`,...(s.consequences??[]).map(x=>x.explanation),s.contradiction!,s.explanation]:[s.explanation];}
export class HintScene extends Phaser.Scene {
 constructor(){super('Hint');}
 create({step,levelId,apply,onRead,open=false}:{step:HumanStep|null;levelId:string;apply:()=>void;onRead:()=>void;open?:boolean}){
  cozyBackground(this);title(this,'Un petit coup de patte',235,56);panel(this,540,940,940,1120);
  const close=()=>{this.scene.stop();this.scene.resume('Game');};
  const owned=step&&(SaveService.data.purchasedHints[levelId]??[]).some(s=>s.position[0]===step.position[0]&&s.position[1]===step.position[1]);
  if(!open&&!owned){
   imageContain(this.add.image(540,590,'orange-cat'),230,230);
   label(this,540,835,step?'Un indice pour cette grille':'Aucune déduction disponible',45);
   const cost=hintCost(SaveService.data.attemptPurchases),affordable=SaveService.data.kibble>=cost;
   label(this,540,1030,step?'Une case expliquée, étape par étape.':'Tu peux consulter les règles ou revenir au jeu.',34);
   label(this,540,1180,`${SaveService.data.kibble} croquettes disponibles`,32);
   const buy=button(this,540,1400,770,!step?'Revenir au jeu':affordable?`Voir l’indice · ${cost} croquettes`:`Il manque ${cost-SaveService.data.kibble} croquettes`,()=>{if(!step){close();return;}if(!affordable||!SaveService.buyHint(levelId,step))return;this.scene.restart({step,levelId,apply,onRead,open:true});},C.teal);
   if(step&&!affordable)buy.disableInteractive().setAlpha(.5);
   button(this,540,1590,640,'Continuer à réfléchir',close,0xb398a5);
   button(this,540,1760,540,'Consulter les règles',()=>{this.scene.stop();this.scene.start('Rules',{fromGame:true});},0xb99773);return;
  }
  if(!step){close();return;}onRead();imageContain(this.add.image(540,535,step.value===1?'grey-cat':'orange-cat'),190,190);label(this,540,700,`Ligne ${step.position[0]+1} · Colonne ${step.position[1]+1}`,36);
  const pages=proofPages(step);let i=0;const text=label(this,540,975,pages[0]!,36).setWordWrapWidth(780),counter=label(this,540,1260,'',28);
  const prev=button(this,310,1430,370,'Précédent',()=>{i--;refresh();}),next=button(this,770,1430,370,'Suite',()=>{i++;refresh();},C.pink);
  const refresh=()=>{text.setText(pages[i]!);counter.setText(`${i+1} / ${pages.length}`);prev.setVisible(i>0);next.setVisible(i<pages.length-1);};refresh();
  button(this,540,1620,750,'Je place le chat moi-même',close);button(this,540,1790,750,'Placer ce chat · sans supplément',()=>{close();apply();},C.pink);
 }
}
