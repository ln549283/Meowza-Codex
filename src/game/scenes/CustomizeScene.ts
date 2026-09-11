import Phaser from 'phaser';
import { cosmetics,type Slot } from '../../core/cosmetics';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';

const tabs:{slot:Slot;label:string}[]=[
 {slot:'background',label:'Fonds'},
 {slot:'cushion',label:'Coussins'},
 {slot:'wood',label:'Structure'}
];

export class CustomizeScene extends Phaser.Scene{
 private tab=0;
 constructor(){super('Customize');}
 init(data:{tab?:number}={}){this.tab=Math.max(0,Math.min(tabs.length-1,data.tab??0));}
 create(){
  cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Personnaliser',130,52);
  label(this,540,220,'Ma collection',30,'#775f68',22);
  label(this,540,268,'Les objets inconnus restent cachés jusqu’à leur découverte.',23,'#775f68',20);
  tabs.forEach((tab,i)=>button(this,190+i*350,365,300,tab.label,()=>this.scene.restart({tab:i}),i===this.tab?C.teal:C.orange));
  const slot=tabs[this.tab]!.slot,items=cosmetics.filter(item=>item.slot===slot);
  items.forEach((item,i)=>{
   const y=620+i*330,owned=SaveService.data.ownedCosmetics.includes(item.id),equipped=SaveService.data.equipped[slot]===item.id;
   panel(this,540,y,900,270);
   if(owned){
    if(slot==='background'){
     const key=item.id==='night'?'background-night':item.id==='mint'?'background-serre':'room-background';
     const preview=imageContain(this.add.image(300,y,key),190,175);preview.setCrop(0,0,preview.width,preview.height);
    }else{
     const swatch=this.add.rectangle(300,y,165,165,item.color,1).setStrokeStyle(5,0xffffff,.9);swatch.setDepth(3);
    }
    label(this,545,y-42,item.name,32,C.ink,22);
    label(this,545,y+18,equipped?'Sélection actuelle':'Débloqué',24,'#775f68',20);
    button(this,760,y+72,270,equipped?'✓ Équipé':'Équiper',()=>{if(equipped)return;SaveService.data.equipped[slot]=item.id;void SaveService.persist();this.scene.restart({tab:this.tab});},equipped?C.teal:C.orange);
   }else{
    imageContain(this.add.image(300,y,'ui-lock'),92,92).setAlpha(.7);
    label(this,545,y-15,'???',38,C.ink,22);
    label(this,545,y+38,'Objet inconnu',23,'#775f68',20);
   }
  });
  label(this,540,1660,'Chaque catégorie garde un ordre fixe : les découvertes apparaissent à leur place.',22,'#775f68',20).setWordWrapWidth(820);
  button(this,540,1780,650,'Retour à mon arbre',()=>this.scene.start('LevelSelect'),C.teal);
 }
}
