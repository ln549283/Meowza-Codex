import Phaser from 'phaser';
import { cosmetics,cosmeticPrice,type Slot } from '../../core/cosmetics';
import { collectionCats } from '../../core/cats';
import { SaveService } from '../../services/SaveService';
import { backgroundTextureForId,backButton,button,imageContain,label,panel,press } from '../ui';
import { treeTexture } from '../treeStyle';
import { C } from '../theme';

const tabs=[{key:'background',label:'Fonds'},{key:'cushion',label:'Coussins'},{key:'wood',label:'Structure'},{key:'cats',label:'Chats'}] as const;
/** The same catalogue and previews drive both discovery and purchases. */
export class CatalogScene extends Phaser.Scene {
 private tab=0;private selected=0;private target=10;
 constructor(private shop=false){super(shop?'Shop':'Customize');}
 init(data:{tab?:number;selected?:number;targetLevel?:number}={}){this.tab=Phaser.Math.Clamp(typeof data.tab==='number'?data.tab:0,0,this.shop?2:3);this.selected=data.selected??0;this.target=data.targetLevel??10;}
 private restart(){this.scene.restart({tab:this.tab,selected:this.selected,targetLevel:this.target});}
 create(){
  this.cameras.main.setBackgroundColor(0xfff7ef);backButton(this,()=>this.scene.start('LevelSelect'));
  label(this,560,90,this.shop?'La petite boutique':'Ma collection',54);label(this,540,162,this.shop?'Des décors à garder, un arbre à ton image':'Des trouvailles et des compagnons pour ton arbre',28,'#78647d');
  const available=tabs.slice(0,this.shop?3:4),width=960/available.length;
  available.forEach((tab,i)=>{const c=this.add.container(60+width*(i+.5),280),active=i===this.tab;c.add([this.add.image(0,0,active?'button-primary':'button-secondary').setDisplaySize(width-12,96),label(this,0,0,tab.label,27,active?'#21475a':C.ink)]);press(this,c,width-12,96,()=>{this.tab=i;this.selected=0;this.restart();});});
  const key=tabs[this.tab]!.key,isCats=key==='cats',items=isCats?collectionCats:cosmetics.filter(c=>c.slot===key);
  this.selected=Phaser.Math.Clamp(this.selected,0,items.length-1);
  const ownedCount=items.filter(c=>(isCats?SaveService.data.ownedCats:SaveService.data.ownedCosmetics).includes(c.id)).length;
  label(this,110,390,`${ownedCount} / ${items.length} découverts`,26,'#78647d').setOrigin(0,.5);
  imageContain(this.add.image(805,390,'hub-kibble'),44,44);label(this,900,390,String(SaveService.data.kibble),30);
  const thumbnail=(id:string,x:number,y:number,w:number,h:number)=>{
   if(isCats){const cat=collectionCats.find(c=>c.id===id)!;return imageContain(this.add.image(x,y,cat.texture),w,h);}
   const item=cosmetics.find(c=>c.id===id)!;
   if(item.slot==='background')return imageContain(this.add.image(x,y,backgroundTextureForId(id)),w,h);
   const texture=treeTexture(this,'b',item.slot==='wood'?id:SaveService.data.equipped.wood,item.slot==='cushion'?id:SaveService.data.equipped.cushion,true);
   return imageContain(this.add.image(x,y,texture),w,h);
  };
  items.forEach((item,i)=>{
   const x=210+(i%3)*330,y=675+Math.floor(i/3)*400,owned=(isCats?SaveService.data.ownedCats:SaveService.data.ownedCosmetics).includes(item.id),selected=i===this.selected;
   panel(this,x,y,306,368);if(selected)this.add.graphics().lineStyle(4,0xb68c52).strokeRoundedRect(x-143,y-169,286,338,28);
   thumbnail(item.id,x,y-52,245,220).setAlpha(owned?1:.7);
   label(this,x,y+83,item.name,30).setWordWrapWidth(265);
   label(this,x,y+128,owned?'Découvert':isCats?`Niveau ${(i+1)*10}`:`${cosmeticPrice(item.id)} croquettes`,26,'#78647d');
   const hit=this.add.container(x,y);press(this,hit,300,358,()=>{this.selected=i;this.restart();});
  });
  const item=items[this.selected]!,owned=(isCats?SaveService.data.ownedCats:SaveService.data.ownedCosmetics).includes(item.id);
  if(isCats){
   panel(this,540,1475,970,390);thumbnail(item.id,225,1450,215,255);
   label(this,410,1355,item.name,35).setOrigin(0,.5);
   const levels=Array.from({length:Math.floor(SaveService.trailCompletedCount()/10)},(_,i)=>(i+1)*10);
   if(!levels.includes(this.target))this.target=levels[0]??10;
   const assigned=Object.entries(SaveService.data.refuges).find(([,id])=>id===item.id);
   label(this,410,1415,owned?(assigned?`Installé au niveau ${assigned[0]}`:'Prêt à rejoindre ton arbre'):`Se découvre au niveau ${(this.selected+1)*10}`,24,'#78647d').setOrigin(0,.5).setWordWrapWidth(540);
   if(owned&&levels.length){
    const place=button(this,650,1500,500,`Support ${this.target}  ›`,()=>{this.target=levels[(levels.indexOf(this.target)+1)%levels.length]!;this.restart();},C.orange);place.setScale(.9);
    button(this,650,1600,500,assigned?.[0]===String(this.target)?'Retirer':'Installer ici',()=>{SaveService.assignCat(this.target,assigned?.[0]===String(this.target)?null:item.id);this.scene.start('LevelSelect');}).setScale(.9);
   }
   label(this,540,1760,'Moka et Nimbus t’accompagnent dans les grilles.\nCes compagnons habitent les supports de ton arbre.',24,'#78647d');
  }else{
   const cosmetic=cosmetics.find(c=>c.id===item.id)!;
   panel(this,540,1295,970,670);thumbnail(item.id,255,1270,305,470);
   label(this,480,1080,item.name,36).setOrigin(0,.5).setWordWrapWidth(490);
   label(this,480,1165,key==='background'?'Une nouvelle ambiance pour le jeu.':key==='wood'?'Une nouvelle teinte de bois\npour toutes les plateformes.':'Une nouvelle palette textile\npour les coussins et les hamacs.',28,'#78647d').setOrigin(0,.5).setWordWrapWidth(480);
   const equipped=SaveService.data.equipped[cosmetic.slot]===item.id,price=cosmeticPrice(item.id),afford=SaveService.data.kibble>=price;
   label(this,480,1300,equipped?'Actuellement équipé':owned?'Prêt à équiper':`À débloquer · ${price} croquettes`,26).setOrigin(0,.5);
   if(!equipped)button(this,700,1430,450,owned?'Équiper':afford?'Adopter ce décor':'Croquettes insuffisantes',()=>{
    if(!owned&&!SaveService.buyCosmetic(item.id))return;
    SaveService.data.equipped[cosmetic.slot as Slot]=item.id;void SaveService.persist();this.restart();
   },owned||afford?C.teal:C.orange);
   label(this,540,1760,this.shop?'Gagne des croquettes en résolvant les grilles.':'Un décor se découvre aussi à chaque palier de 10 niveaux.',28,'#78647d');
  }
 }
}
export class CustomizeScene extends CatalogScene {constructor(){super(false);}}
export class ShopScene extends CatalogScene {constructor(){super(true);}}
