import Phaser from 'phaser';
import { cosmetics,type Slot } from '../../core/cosmetics';
import { SaveService } from '../../services/SaveService';
import { imageContain,label,press } from '../ui';
import { C } from '../theme';

type TabKey=Slot|'cats';
const tabs:{key:TabKey;label:string;color:number}[]=[
 {key:'background',label:'Fonds',color:0x2ba8a8},
 {key:'cushion',label:'Coussins',color:0xc66f91},
 {key:'wood',label:'Structure',color:0xb78667},
 {key:'cats',label:'Chats',color:0x8a72b3}
];
const catSlots=[
 {id:'nimbus',name:'Nimbus',texture:'grey-cat',owned:true,description:'Toujours prêt pour une sieste.'},
 {id:'moka',name:'Moka',texture:'orange-cat',owned:true,description:'Curieux, gourmand et plein d’énergie.'},
 ...['noisette','domino','astre','opale','orion','perle'].map(id=>({id,name:'???',texture:`collection-${id}`,owned:false,description:'Compagnon inconnu'}))
];

export class CustomizeScene extends Phaser.Scene{
 private tab=0;private selected=0;
 constructor(){super('Customize');}
 init(data:{tab?:number;selected?:number}={}){this.tab=Phaser.Math.Clamp(data.tab??0,0,tabs.length-1);this.selected=Math.max(0,data.selected??0);}
 create(){
  this.cameras.main.setBackgroundColor(0xfff7ef);
  this.add.rectangle(540,960,1080,1920,0xfff7ef,1);
  const back=this.add.container(72,86).setDepth(20),backSkin=this.add.rectangle(0,0,92,92,0xf4dfcd,1).setStrokeStyle(3,0xd9b89f,1),backIcon=imageContain(this.add.image(0,0,'ui-back'),44,44);back.add([backSkin,backIcon]);press(this,back,100,100,()=>this.scene.start('LevelSelect'));
  label(this,540,76,'Ma collection',54,C.ink,24);
  label(this,540,132,'Personnalise ton arbre',27,'#78647d',20);

  const tabY=245,tabH=116,tabW=270;
  tabs.forEach((tab,i)=>{
   const c=this.add.container(i*tabW+tabW/2,tabY),bg=this.add.rectangle(0,0,tabW,tabH,tab.color,i===this.tab?1:.82),txt=label(this,0,0,tab.label,29,'#ffffff',20);c.add([bg,txt]);press(this,c,tabW,tabH,()=>this.scene.restart({tab:i,selected:0}));
   if(i===this.tab)this.add.rectangle(i*tabW+tabW/2,tabY+tabH/2-5,tabW,10,0xffffff,.92);
  });

  const key=tabs[this.tab]!.key,gridTop=345,gridX=24,cell=(1080-gridX*2)/4,totalSlots=16;
  const regular=key==='cats'?[]:cosmetics.filter(item=>item.slot===key);
  const count=key==='cats'?catSlots.length:regular.length;
  this.selected=Math.min(this.selected,Math.max(0,count-1));

  for(let i=0;i<totalSlots;i++){
   const col=i%4,row=Math.floor(i/4),x=gridX+cell/2+col*cell,y=gridTop+cell/2+row*cell;
   const isActual=i<count;
   const owned=key==='cats'?(isActual?catSlots[i]!.owned:false):(isActual?SaveService.data.ownedCosmetics.includes(regular[i]!.id):false);
   const selected=isActual&&owned&&i===this.selected;
   const equipped=key!=='cats'&&isActual&&SaveService.data.equipped[key]===regular[i]!.id;
   this.add.rectangle(x,y,cell,cell,owned?0xfff3e7:0x565353,1).setStrokeStyle(selected?7:2,selected?C.teal:0xe7d5c7,1);
   if(owned&&isActual){
    if(key==='background'){
     const item=regular[i]!,texture=item.id==='night'?'background-night':item.id==='mint'?'background-serre':'room-background';
     const preview=this.add.image(x,y,texture),scale=Math.max((cell-14)/preview.width,(cell-14)/preview.height);preview.setScale(scale).setCrop(0,0,preview.width,preview.height);
     const mask=this.add.graphics().fillStyle(0xffffff).fillRect(x-cell/2+7,y-cell/2+7,cell-14,cell-14).createGeometryMask();preview.setMask(mask);
    }else if(key==='cushion'){
     const item=regular[i]!,preview=imageContain(this.add.image(x,y,'tree-flower-cushion'),cell*.73,cell*.6).setTint(item.color);preview.setDepth(2);
    }else if(key==='wood'){
     const item=regular[i]!,texture=item.id==='birch'?'tree-cubby-cream':item.id==='walnut'?'tree-cubby':'tree-cubby-wood';imageContain(this.add.image(x,y,texture),cell*.72,cell*.72).setDepth(2);
    }else{
     const cat=catSlots[i]!;imageContain(this.add.image(x,y,cat.texture),cell*.72,cell*.72).setDepth(2);
    }
    if(equipped||selected){this.add.circle(x+cell*.34,y-cell*.34,28,C.teal,1).setDepth(4);imageContain(this.add.image(x+cell*.34,y-cell*.34,'ui-check'),32,32).setDepth(5);}
    const hit=this.add.container(x,y).setDepth(8);press(this,hit,cell,cell,()=>this.scene.restart({tab:this.tab,selected:i}));
   }else{
    imageContain(this.add.image(x,y-18,'ui-lock'),64,64).setAlpha(.82).setDepth(2);label(this,x,y+58,'???',27,'#ffffff',18).setDepth(3);
   }
  }

  const detailY=1690;this.add.rectangle(540,detailY,1032,310,0xfff1e6,1).setStrokeStyle(2,0xe7d5c7,1);
  if(key==='cats'){
   const cat=catSlots[this.selected];
   if(cat?.owned){imageContain(this.add.image(150,detailY,cat.texture),150,150);label(this,280,detailY-34,cat.name,31,C.ink,20).setOrigin(0,.5);label(this,280,detailY+22,cat.description,22,'#78647d',18).setOrigin(0,.5);this.add.rectangle(845,detailY,270,96,C.teal,.72);label(this,845,detailY,'Disponible',25,'#ffffff',18);}
   else{label(this,540,detailY,'Continue à jouer pour découvrir de nouveaux compagnons.',27,'#78647d',20).setWordWrapWidth(760);}
  }else{
   const item=regular[this.selected],owned=item&&SaveService.data.ownedCosmetics.includes(item.id);
   if(item&&owned){
    if(key==='background'){const texture=item.id==='night'?'background-night':item.id==='mint'?'background-serre':'room-background';imageContain(this.add.image(150,detailY,texture),150,150);}else if(key==='cushion'){imageContain(this.add.image(150,detailY,'tree-flower-cushion'),150,130).setTint(item.color);}else{const texture=item.id==='birch'?'tree-cubby-cream':item.id==='walnut'?'tree-cubby':'tree-cubby-wood';imageContain(this.add.image(150,detailY,texture),150,150);}
    label(this,280,detailY-34,item.name,31,C.ink,20).setOrigin(0,.5);label(this,280,detailY+22,SaveService.data.equipped[key]===item.id?'Sélection actuelle':'Débloqué dans ta collection',22,'#78647d',18).setOrigin(0,.5);
    const equipped=SaveService.data.equipped[key]===item.id,action=this.add.container(855,detailY),skin=this.add.rectangle(0,0,270,100,equipped?0x9eb9c0:C.teal,1),txt=label(this,0,0,equipped?'Équipé':'Équiper',27,'#ffffff',20);action.add([skin,txt]);if(!equipped)press(this,action,270,100,()=>{SaveService.data.equipped[key]=item.id;void SaveService.persist();this.scene.restart({tab:this.tab,selected:this.selected});});
   }else label(this,540,detailY,'Cet objet reste caché jusqu’à sa découverte.',27,'#78647d',20);
  }
 }
}
