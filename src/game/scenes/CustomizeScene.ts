import Phaser from 'phaser';
import { cosmetics,type Slot } from '../../core/cosmetics';
import { collectionCats,habitatMilestones,habitatLevel,habitatStyleForLevel } from '../../core/cats';
import { SaveService } from '../../services/SaveService';
import { backgroundTextureForId,imageContain,label,press } from '../ui';
import { C } from '../theme';

type TabKey=Slot|'cats';
const tabs:{key:TabKey;label:string}[]=[
 {key:'background',label:'Fonds'},
 {key:'cushion',label:'Coussins'},
 {key:'wood',label:'Structure'},
 {key:'cats',label:'Chats'}
];

export class CustomizeScene extends Phaser.Scene{
 private tab=0;private selected=0;private targetLevel:number|undefined;
 constructor(){super('Customize');}
 init(data:{tab?:number;selected?:number;targetLevel?:number}={}){this.tab=Phaser.Math.Clamp(data.tab??0,0,tabs.length-1);this.selected=Math.max(0,data.selected??0);this.targetLevel=data.targetLevel;}
 create(){
  this.cameras.main.setBackgroundColor(0xfff7ef);
  const back=this.add.container(72,86).setDepth(20),backSkin=this.add.image(0,0,'button-square').setDisplaySize(96,96),backIcon=imageContain(this.add.image(0,0,'ui-back'),46,46);back.add([backSkin,backIcon]);press(this,back,100,100,()=>this.scene.start('LevelSelect'));
  label(this,540,76,'Ma collection',58,C.ink,24);label(this,540,140,'Personnalise ton arbre',28,'#78647d',20);

  const tabY=252,tabH=112,tabW=270;
  tabs.forEach((tab,i)=>{const active=i===this.tab,c=this.add.container(i*tabW+tabW/2,tabY),skin=this.add.image(0,0,active?'button-primary':'button-secondary').setDisplaySize(tabW+4,tabH),txt=label(this,0,0,tab.label,29,active?'#ffffff':C.ink,20);c.add([skin,txt]);if(!active)c.setAlpha(.9);press(this,c,tabW,tabH,()=>this.scene.restart({tab:i,selected:0,targetLevel:i===3?this.targetLevel:undefined}));});

  const key=tabs[this.tab]!.key,gridTop=338,gridX=20,cell=(1080-gridX*2)/4;
  const regular=key==='cats'?[]:cosmetics.filter(item=>item.slot===key),count=key==='cats'?collectionCats.length:regular.length,totalSlots=Math.max(12,Math.ceil(count/4)*4);
  this.selected=Math.min(this.selected,Math.max(0,count-1));
  for(let i=0;i<totalSlots;i++){
   const col=i%4,row=Math.floor(i/4),x=gridX+cell/2+col*cell,y=gridTop+cell/2+row*cell,isActual=i<count;
   const owned=key==='cats'?(isActual?SaveService.data.ownedCats.includes(collectionCats[i]!.id):false):(isActual?SaveService.data.ownedCosmetics.includes(regular[i]!.id):false),selected=isActual&&owned&&i===this.selected,equipped=key!=='cats'&&isActual&&SaveService.data.equipped[key]===regular[i]!.id;
   const cellSkin=this.add.image(x,y,owned?'button-square':'tile-lilac').setDisplaySize(cell+2,cell+2).setAlpha(owned?1:.28);
   if(owned&&isActual){
    if(key==='cats')imageContain(this.add.image(x,y,collectionCats[i]!.texture),cell*.78,cell*.78);
    else if(key==='background'){const item=regular[i]!;imageContain(this.add.image(x,y,backgroundTextureForId(item.id)),cell*.84,cell*.84);}
    else if(key==='cushion'){const item=regular[i]!;imageContain(this.add.image(x,y,'tree-flower-cushion'),cell*.73,cell*.6).setTint(item.color);}
    else if(key==='wood'){const item=regular[i]!,texture=item.id==='birch'?'tree-cubby-cream':item.id==='walnut'?'tree-cubby':'tree-cubby-wood';imageContain(this.add.image(x,y,texture),cell*.72,cell*.72);}
    if(equipped||selected)imageContain(this.add.image(x+cell*.34,y-cell*.34,'ui-check'),48,48).setDepth(5);
    const hit=this.add.container(x,y).setDepth(8);press(this,hit,cell,cell,()=>this.scene.restart({tab:this.tab,selected:i,targetLevel:this.targetLevel}));
   }else{
    imageContain(this.add.image(x,y-4,'ui-lock'),28,28).setAlpha(.34).setDepth(2);label(this,x,y+34,'???',19,'#9c90a3',15).setAlpha(.68).setDepth(3);
   }
   cellSkin.setDepth(-1);
  }

  const detailY=1698,detail=this.add.image(540,detailY,'puzzle-panel').setDisplaySize(1030,180).setAlpha(.98);detail.setDepth(-1);
  if(key==='cats'){
   const cat=collectionCats[this.selected],owned=cat&&SaveService.data.ownedCats.includes(cat.id),assigned=cat?Object.entries(SaveService.data.refuges).find(([,id])=>id===cat.id):undefined,completed=SaveService.trailCompletedCount(),supports=habitatMilestones(completed),levels=Array.from({length:supports},(_,i)=>habitatLevel(i)),target=this.targetLevel&&levels.includes(this.targetLevel)?this.targetLevel:undefined,freeLevel=levels.find(level=>!SaveService.data.refuges[String(level)]),placementLevel=target??freeLevel;
   if(cat&&owned){
    imageContain(this.add.image(150,detailY,cat.texture),118,118);label(this,280,detailY-25,cat.name,31,C.ink,20).setOrigin(0,.5);
    if(target){const style=habitatStyleForLevel(target);label(this,280,detailY+14,`${style.name} · niveau ${target}`,21,'#78647d',17).setOrigin(0,.5);}
    else label(this,280,detailY+16,assigned?`Installé au niveau ${assigned[0]}`:supports?`${supports} place${supports>1?'s':''} disponible${supports>1?'s':''}`:'Premier support au niveau 10',21,'#78647d',17).setOrigin(0,.5);
    const sameTarget=!!target&&assigned?.[0]===String(target),canPlace=!!placementLevel,action=this.add.container(855,detailY),skin=this.add.image(0,0,sameTarget?'button-disabled':canPlace?'button-primary':'button-disabled').setDisplaySize(270,86),txt=label(this,0,0,sameTarget?'Retirer':target?'Installer ici':assigned?'Déplacer':'Placer',24,sameTarget||!canPlace?C.ink:'#ffffff',18);action.add([skin,txt]);
    if(sameTarget)press(this,action,270,86,()=>{SaveService.assignCat(target!,null);this.scene.start('LevelSelect');});
    else if(canPlace)press(this,action,270,86,()=>{SaveService.assignCat(placementLevel!,cat.id);this.scene.start('LevelSelect');});
   }else{
    label(this,540,detailY-14,'Les compagnons restent secrets jusqu’à leur découverte.',23,'#78647d',18).setWordWrapWidth(760);label(this,540,detailY+24,target?`Le support du niveau ${target} attend un chat débloqué.`:'Une nouvelle place pour chat se débloque tous les 10 niveaux.',18,'#95869e',16).setWordWrapWidth(820);
   }
  }else{
   const item=regular[this.selected],owned=item&&SaveService.data.ownedCosmetics.includes(item.id);
   if(item&&owned){
    if(key==='background')imageContain(this.add.image(145,detailY,backgroundTextureForId(item.id)),112,112);else if(key==='cushion')imageContain(this.add.image(145,detailY,'tree-flower-cushion'),120,102).setTint(item.color);else{const texture=item.id==='birch'?'tree-cubby-cream':item.id==='walnut'?'tree-cubby':'tree-cubby-wood';imageContain(this.add.image(145,detailY,texture),112,112);}
    label(this,265,detailY-24,item.name,29,C.ink,20).setOrigin(0,.5);label(this,265,detailY+18,SaveService.data.equipped[key]===item.id?'Sélection actuelle':'Débloqué',20,'#78647d',17).setOrigin(0,.5);
    const equipped=SaveService.data.equipped[key]===item.id,action=this.add.container(855,detailY),skin=this.add.image(0,0,equipped?'button-disabled':'button-primary').setDisplaySize(270,86),txt=label(this,0,0,equipped?'Équipé':'Équiper',25,equipped?C.ink:'#ffffff',18);action.add([skin,txt]);if(!equipped)press(this,action,270,86,()=>{SaveService.data.equipped[key]=item.id;void SaveService.persist();this.scene.start('LevelSelect');});
   }else label(this,540,detailY,'Cet objet reste caché jusqu’à sa découverte.',23,'#78647d',18);
  }
 }
}
