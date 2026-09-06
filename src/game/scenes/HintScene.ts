import Phaser from 'phaser';
import type { HumanStep } from '../../core/humanSolver';
import { button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
function proofPages(step:HumanStep):string[]{
 if(step.rule!=='contradiction')return[step.explanation];
 const pos=`L${step.position[0]+1} · C${step.position[1]+1}`;
 return[`Testons temporairement un chat ${step.assumption===1?'gris':'roux'} en ${pos}.\nLa grille réelle ne change pas.`,...(step.consequences??[]).flatMap(proofPages),`${step.contradiction}\nL’hypothèse est impossible.`,step.explanation];
}
export class HintScene extends Phaser.Scene {
 constructor(){super('Hint');}
 create({step,apply}:{step:HumanStep;apply:()=>void}){
  cozyBackground(this);title(this,'Un petit coup de patte',235,56);panel(this,540,930,940,1120);
  imageContain(this.add.image(540,570,step.value===1?'grey-cat':'orange-cat'),220,220);
  label(this,540,735,`Ligne ${step.position[0]+1} · Colonne ${step.position[1]+1}`,37);
  const pages=proofPages(step);let index=0;const text=label(this,540,980,pages[0]!,38).setWordWrapWidth(770);const counter=label(this,540,1290,'',28);let previous:Phaser.GameObjects.Container,next:Phaser.GameObjects.Container;
  const refresh=()=>{text.setText(pages[index]!);counter.setText(pages.length>1?`Le raisonnement · ${index+1} / ${pages.length}`:'Une déduction directe, sans deviner.');previous?.setVisible(index>0);next?.setVisible(index<pages.length-1);};
  previous=button(this,320,1430,370,'Précédent',()=>{index--;refresh();},C.teal);next=button(this,760,1430,370,'Suite',()=>{index++;refresh();},C.pink);refresh();
  const close=()=>{this.scene.stop();this.scene.resume('Game');};
  button(this,540,1620,720,'Je place le chat moi-même',close,C.teal);
  button(this,540,1780,720,'Placer ce chat pour moi',()=>{close();apply();},C.pink);
 }
}
