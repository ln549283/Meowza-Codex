import Phaser from 'phaser';
import type { HumanStep } from '../../core/humanSolver';
import { hintCost,MAX_HINTS } from '../../core/economy';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
function proofPages(s:HumanStep):string[]{return s.rule==='contradiction'?[`Imagine un chat ${s.assumption===1?'gris':'roux'} en L${s.position[0]+1} · C${s.position[1]+1}. Ce test reste dans notre tête.`,...(s.consequences??[]).map(x=>x.explanation),s.contradiction!,s.explanation]:[s.explanation];}
export class HintScene extends Phaser.Scene {
 constructor(){super('Hint');}
 create({step,levelId,apply,open=false}:{step:HumanStep|null;levelId:string;apply:()=>void;open?:boolean}){
  cozyBackground(this);title(this,'Un petit coup de patte',235,56);panel(this,540,940,940,1120);
  const close=()=>{const proof=step&&SaveService.ownedHint(levelId,step);this.scene.stop();this.scene.resume('Game');if(proof)this.scene.get('Game').events.emit('show-proof',proof);};
  this.events.once('close-hint',close);
  this.events.once('shutdown',()=>this.events.off('close-hint',close));
  const owned=step&&SaveService.ownedHint(levelId,step);
  const used=SaveService.data.session?.hints??0,cost=hintCost(used),exhausted=cost===null;
  if(!open&&!owned){
   imageContain(this.add.image(540,590,'orange-cat'),230,230);
   label(this,540,835,exhausted?'3/3 indices utilisés':step?(used===2?'Dernier indice':`Indice ${used+1}/${MAX_HINTS}`):'Aucune déduction disponible',45);
   const affordable=cost!==null&&SaveService.data.kibble>=cost;
   label(this,540,1030,SaveService.data.session?.hintMigrationNotice?'Nouvelle règle : 3 indices par tentative.\nLes anciens indices ne sont plus conservés.':exhausted?'Tu as utilisé tes trois indices précis.\nLes règles restent accessibles gratuitement.':step?'3 indices précis maximum par tentative.\nUne déduction expliquée, étape par étape.':'Tu peux consulter les règles ou revenir au jeu.',34);
   label(this,540,1180,`${SaveService.data.kibble} croquettes disponibles`,32);
   const buy=button(this,540,1400,770,exhausted?'3/3 utilisés':!step?'Revenir au jeu':affordable?`${used===2?'Dernier indice':`Indice ${used+1}/3`} · ${cost} croquettes`:`Il manque ${(cost??0)-SaveService.data.kibble} croquettes`,()=>{if(!step){close();return;}if(!affordable||!SaveService.buyHint(levelId,step))return;this.scene.restart({step,levelId,apply,open:true});},C.teal);
   if(exhausted||(step&&!affordable))buy.disableInteractive().setAlpha(.5);
   button(this,540,1590,640,'Continuer à réfléchir',close,0xb398a5);
   button(this,540,1760,540,'Consulter les règles',()=>{this.scene.stop();this.scene.start('Rules',{fromGame:true});},0xb99773);return;
  }
  if(!step){close();return;}imageContain(this.add.image(540,535,step.value===1?'grey-cat':'orange-cat'),190,190);label(this,540,700,`Ligne ${step.position[0]+1} · Colonne ${step.position[1]+1}`,36);
  const pages=proofPages(step);let i=0;const text=label(this,540,975,pages[0]!,36).setWordWrapWidth(780),counter=label(this,540,1260,'',28);
  const prev=button(this,310,1430,370,'Précédent',()=>{i--;refresh();}),next=button(this,770,1430,370,'Suite',()=>{i++;refresh();},C.pink);
  const refresh=()=>{text.setText(pages[i]!);counter.setText(`${i+1} / ${pages.length}`);prev.setVisible(i>0);next.setVisible(i<pages.length-1);};refresh();
  button(this,540,1620,750,'Je place le chat moi-même',close);button(this,540,1790,750,'Placer ce chat · sans supplément',()=>{close();apply();},C.pink);
 }
}
