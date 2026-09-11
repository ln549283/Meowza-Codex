import Phaser from 'phaser';
import { cosmetics,type Slot } from '../../core/cosmetics';
import { SaveService } from '../../services/SaveService';
import { imageContain,label,press } from '../ui';
import { C } from '../theme';

type TabKey=Slot|'cats';
const tabs:{key:TabKey;label:string;skin:string}[]=[
 {key:'background',label:'Fonds',skin:'button-primary'},
 {key:'cushion',label:'Coussins',skin:'button-secondary'},
 {key:'wood',label:'Structure',skin:'tile-peach'},
 {key:'cats',label:'Chats',skin:'tile-lilac'}
];
const catSlots=['noisette','domino','astre','opale','orion','perle'].map(id=>({id,name:'???',texture:`collection-${id}`,owned:false}));

export class CustomizeScene extends Phaser.Scene{
 private tab=0;private selected=0;
 constructor(){super('Customize');}
 init(data:{tab?:number;selected?:number}={}){this.tab=Phaser.Math.Clamp(data.tab??0,0,tabs.length-1);this.selected=Math.max(0,data.selected??0);}
 create(){
  this.cameras.main.setBackgroundColor(0xfff7ef);
  const back=this.add.container(72,86).setDepth(20),backSkin=this.add.image(0,0,'button-square').setDisplaySize(96,96),backIcon=imageContain(this.add.image(0,0,'ui-back'),46,46);back.add([backSkin,backIcon]);press(this,back,100,100,()=>this.scene.start('LevelSelect'));
  label(this,540,76,'Ma collection',58,C.ink,24);label(this,540,140,'Personnalise ton arbre',28,'#78647d',20);

  const tabY=252,tabH=118,tabW=270;
  tabs.forEach((tab,i)=>{const c=this.add.container(i*tabW+tabW/2,tabY),skin=this.add.image(0,0,i===this.tab?'button-primary':tab.skin).setDisplaySize(tabW+4,tabH),txt=label(this,0,0,tab.label,30,'#ffffff',20);c.add([skin,txt]);if(i!==this.tab)c.setAlpha(.82);press(this,c,tabW,tabH,()=>this.scene.restart({tab:i,selected:0}));});

  const key=tabs[this.tab]!.key,gridTop=342,gridX=20,cell=(1080-gridX*2)/4,totalSlots=16;
  const regular=key==='cats'?[]:cosmetics.filter(item=>item.slot===key),count=key==='cats'?catSlots.length:regular.length;
  this.selected=Math.min(this.selected,Math.max(0,count-1));
  for(let i=0;i<totalSlots;i++){
   const col=i%4,row=Math.floor(i/4),x=gridX+cell/2+col*cell,y=gridTop+cell/2+row*cell,isActual=i<count;
   const owned=key==='cats'?(isActual?catSlots[i]!.owned:false):(isActual?SaveService.data.ownedCosmetics.includes(regular[i]!.id):false),selected=isActual&&owned&&i===this.selected,equipped=key!=='cats'&&isActual&&SaveService.data.equipped[key]===regular[i]!.id;
   const cellSkin=this.add.image(x,y,owned?'button-square':'tile-lilac').setDisplaySize(cell+2,cell+2).setAlpha(owned?1:.62);
   if(owned&&isActual){
    if(key==='background'){const item=regular[i]!,texture=item.id==='night'?'background-night':item.id==='mint'?'background-serre':'room-background';imageContain(this.add.image(x,y,texture),cell*.84,cell*.84);}
    else if(key==='cushion'){const item=regular[i]!;imageContain(this.add.image(x,y,'tree-flower-cushion'),cell*.73,cell*.6).setTint(item.color);}
    else if(key==='wood'){const item=regular[i]!,texture=item.id==='birch'?'tree-cubby-cream':item.id==='walnut'?'tree-cubby':'tree-cubby-wood';imageContain(this.add.image(x,y,texture),cell*.72,cell*.72);}
    if(equipped||selected)imageContain(this.add.image(x+cell*.34,y-cell*.34,'ui-check'),48,48).setDepth(5);
    const hit=this.add.container(x,y).setDepth(8);press(this,hit,cell,cell,()=>this.scene.restart({tab:this.tab,selected:i}));
   }else{imageContain(this.add.image(x,y-18,'ui-lock'),62,62).setAlpha(.82).setDepth(2);label(this,x,y+58,'???',27,'#ffffff',18).setDepth(3);}
   cellSkin.setDepth(-1);
  }

  const detailY=1680,detail=this.add.image(540,detailY,'puzzle-panel').setDisplaySize(1030,300).setAlpha(.98);detail.setDepth(-1);
  if(key==='cats'){label(this,540,detailY-20,'Les compagnons restent secrets jusqu’à leur découverte.',28,'#78647d',20).setWordWrapWidth(760);label(this,540,detailY+50,'Nimbus et Moka vivent déjà dans Meowza : ils ne font pas partie de la collection.',22,'#95869e',18).setWordWrapWidth(820);}
  else{
   const item=regular[this.selected],owned=item&&SaveService.data.ownedCosmetics.includes(item.id);
   if(item&&owned){
    if(key==='background'){const texture=item.id==='night'?'background-night':item.id==='mint'?'background-serre':'room-background';imageContain(this.add.image(150,detailY,texture),150,150);}else if(key==='cushion'){imageContain(this.add.image(150,detailY,'tree-flower-cushion'),150,130).setTint(item.color);}else{const texture=item.id==='birch'?'tree-cubby-cream':item.id==='walnut'?'tree-cubby':'tree-cubby-wood';imageContain(this.add.image(150,detailY,texture),150,150);}
    label(this,280,detailY-34,item.name,32,C.ink,20).setOrigin(0,.5);label(this,280,detailY+22,SaveService.data.equipped[key]===item.id?'Sélection actuelle':'Débloqué dans ta collection',22,'#78647d',18).setOrigin(0,.5);
    const equipped=SaveService.data.equipped[key]===item.id,action=this.add.container(855,detailY),skin=this.add.image(0,0,equipped?'button-disabled':'button-primary').setDisplaySize(270,100),txt=label(this,0,0,equipped?'Équipé':'Équiper',27,'#ffffff',20);action.add([skin,txt]);if(!equipped)press(this,action,270,100,()=>{SaveService.data.equipped[key]=item.id;void SaveService.persist();this.scene.restart({tab:this.tab,selected:this.selected});});
   }else label(this,540,detailY,'Cet objet reste caché jusqu’à sa découverte.',27,'#78647d',20);
  }
 }
}
