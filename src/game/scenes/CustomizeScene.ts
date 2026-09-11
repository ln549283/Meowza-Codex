import Phaser from 'phaser';
import { cosmetics,type Slot } from '../../core/cosmetics';
import { collectionCats,habitatMilestones,habitatLevel } from '../../core/cats';
import { SaveService } from '../../services/SaveService';
import { imageContain,label,press } from '../ui';
import { C } from '../theme';

type TabKey=Slot|'cats';
const tabs:{key:TabKey;label:string}[]=[
 {key:'background',label:'Fonds'},
 {key:'cushion',label:'Coussins'},
 {key:'wood',label:'Structure'},
 {key:'cats',label:'Chats'}
];

export class CustomizeScene extends Phaser.Scene{
 private tab=0;private selected=0;
 constructor(){super('Customize');}
 init(data:{tab?:number;selected?:number}={}){this.tab=Phaser.Math.Clamp(data.tab??0,0,tabs.length-1);this.selected=Math.max(0,data.selected??0);}
 create(){
  this.cameras.main.setBackgroundColor(0xfff7ef);
  const back=this.add.container(72,86).setDepth(20),backSkin=this.add.image(0,0,'button-square').setDisplaySize(96,96),backIcon=imageContain(this.add.image(0,0,'ui-back'),46,46);back.add([backSkin,backIcon]);press(this,back,100,100,()=>this.scene.start('LevelSelect'));
  label(this,540,76,'Ma collection',58,C.ink,24);label(this,540,140,'Personnalise ton arbre',28,'#78647d',20);

  const tabY=252,tabH=118,tabW=270;
  tabs.forEach((tab,i)=>{const active=i===this.tab,c=this.add.container(i*tabW+tabW/2,tabY),skin=this.add.image(0,0,active?'button-primary':'button-secondary').setDisplaySize(tabW+4,tabH),txt=label(this,0,0,tab.label,30,active?'#ffffff':C.ink,20);c.add([skin,txt]);if(!active)c.setAlpha(.9);press(this,c,tabW,tabH,()=>this.scene.restart({tab:i,selected:0}));});

  const key=tabs[this.tab]!.key,gridTop=342,gridX=20,cell=(1080-gridX*2)/4,totalSlots=16;
  const regular=key==='cats'?[]:cosmetics.filter(item=>item.slot===key),count=key==='cats'?collectionCats.length:regular.length;
  this.selected=Math.min(this.selected,Math.max(0,count-1));
  for(let i=0;i<totalSlots;i++){
   const col=i%4,row=Math.floor(i/4),x=gridX+cell/2+col*cell,y=gridTop+cell/2+row*cell,isActual=i<count;
   const owned=key==='cats'?(isActual?SaveService.data.ownedCats.includes(collectionCats[i]!.id):false):(isActual?SaveService.data.ownedCosmetics.includes(regular[i]!.id):false),selected=isActual&&owned&&i===this.selected,equipped=key!=='cats'&&isActual&&SaveService.data.equipped[key]===regular[i]!.id;
   const cellSkin=this.add.image(x,y,owned?'button-square':'tile-lilac').setDisplaySize(cell+2,cell+2).setAlpha(owned?1:.58);
   if(owned&&isActual){
    if(key==='cats')imageContain(this.add.image(x,y,collectionCats[i]!.texture),cell*.78,cell*.78);
    else if(key==='background'){const item=regular[i]!,texture=item.id==='night'?'background-night':item.id==='mint'?'background-serre':'room-background';imageContain(this.add.image(x,y,texture),cell*.84,cell*.84);}
    else if(key==='cushion'){const item=regular[i]!;imageContain(this.add.image(x,y,'tree-flower-cushion'),cell*.73,cell*.6).setTint(item.color);}
    else if(key==='wood'){const item=regular[i]!,texture=item.id==='birch'?'tree-cubby-cream':item.id==='walnut'?'tree-cubby':'tree-cubby-wood';imageContain(this.add.image(x,y,texture),cell*.72,cell*.72);}
    if(equipped||selected)imageContain(this.add.image(x+cell*.34,y-cell*.34,'ui-check'),48,48).setDepth(5);
    const hit=this.add.container(x,y).setDepth(8);press(this,hit,cell,cell,()=>this.scene.restart({tab:this.tab,selected:i}));
   }else{imageContain(this.add.image(x,y-18,'ui-lock'),54,54).setAlpha(.66).setDepth(2);label(this,x,y+54,'???',25,'#ffffff',18).setDepth(3);}
   cellSkin.setDepth(-1);
  }

  const detailY=1680,detail=this.add.image(540,detailY,'puzzle-panel').setDisplaySize(1030,260).setAlpha(.98);detail.setDepth(-1);
  if(key==='cats'){
   const cat=collectionCats[this.selected],owned=cat&&SaveService.data.ownedCats.includes(cat.id),assigned=cat?Object.entries(SaveService.data.refuges).find(([,id])=>id===cat.id):undefined,supports=habitatMilestones(SaveService.data.stats.levelsCompleted),freeLevel=Array.from({length:supports},(_,i)=>habitatLevel(i)).find(level=>!SaveService.data.refuges[String(level)]);
   if(cat&&owned){
    imageContain(this.add.image(150,detailY,cat.texture),150,150);label(this,280,detailY-34,cat.name,32,C.ink,20).setOrigin(0,.5);label(this,280,detailY+22,assigned?`Installé au support du niveau ${assigned[0]}`:supports?`${supports} support${supports>1?'s':''} débloqué${supports>1?'s':''}`:'Premier support au niveau 10',22,'#78647d',18).setOrigin(0,.5);
    const canPlace=!!freeLevel,action=this.add.container(855,detailY),skin=this.add.image(0,0,assigned?'button-disabled':canPlace?'button-primary':'button-disabled').setDisplaySize(270,100),txt=label(this,0,0,assigned?'Retirer':canPlace?'Placer':'Aucune place',25,assigned||!canPlace?C.ink:'#ffffff',18);action.add([skin,txt]);press(this,action,270,100,()=>{if(assigned)SaveService.assignCat(Number(assigned[0]),null);else if(freeLevel)SaveService.assignCat(freeLevel,cat.id);this.scene.restart({tab:this.tab,selected:this.selected});});
   }else{label(this,540,detailY-22,'Les compagnons restent secrets jusqu’à leur découverte.',27,'#78647d',20).setWordWrapWidth(760);label(this,540,detailY+38,'Tous les 10 niveaux, ton arbre gagne une nouvelle place pour accueillir un chat.',21,'#95869e',18).setWordWrapWidth(820);}
  }else{
   const item=regular[this.selected],owned=item&&SaveService.data.ownedCosmetics.includes(item.id);
   if(item&&owned){
    if(key==='background'){const texture=item.id==='night'?'background-night':item.id==='mint'?'background-serre':'room-background';imageContain(this.add.image(150,detailY,texture),150,150);}else if(key==='cushion'){imageContain(this.add.image(150,detailY,'tree-flower-cushion'),150,130).setTint(item.color);}else{const texture=item.id==='birch'?'tree-cubby-cream':item.id==='walnut'?'tree-cubby':'tree-cubby-wood';imageContain(this.add.image(150,detailY,texture),150,150);}
    label(this,280,detailY-34,item.name,32,C.ink,20).setOrigin(0,.5);label(this,280,detailY+22,SaveService.data.equipped[key]===item.id?'Sélection actuelle':'Débloqué dans ta collection',22,'#78647d',18).setOrigin(0,.5);
    const equipped=SaveService.data.equipped[key]===item.id,action=this.add.container(855,detailY),skin=this.add.image(0,0,equipped?'button-disabled':'button-primary').setDisplaySize(270,100),txt=label(this,0,0,equipped?'Équipé':'Équiper',27,equipped?C.ink:'#ffffff',20);action.add([skin,txt]);if(!equipped)press(this,action,270,100,()=>{SaveService.data.equipped[key]=item.id;void SaveService.persist();this.scene.restart({tab:this.tab,selected:this.selected});});
   }else label(this,540,detailY,'Cet objet reste caché jusqu’à sa découverte.',27,'#78647d',20);
  }
 }
}
