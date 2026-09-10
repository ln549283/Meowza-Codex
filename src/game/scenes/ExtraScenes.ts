import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';

export class LostScene extends Phaser.Scene {
 constructor(){super('Lost');}
 create({reason='errors'}:{reason?:string}={}){
  cozyBackground(this);
  panel(this,540,1000,900,1180);
  title(this,'Chat alors…',410,72);
  imageContain(this.add.image(540,850,'duo-retry'),650,430).setDepth(30);
  label(this,540,1060,reason==='time'?'Le temps est écoulé.':'Trois erreurs mettent fin à cette tentative.',35);
  label(this,540,1160,'Tu peux recommencer gratuitement.\nLa grille, le cœur, le chrono et les indices repartent de zéro.',27);
  button(this,540,1390,690,'Recommencer',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.teal);
  button(this,540,1550,690,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.orange);
 }
}

export class ShopScene extends Phaser.Scene {
 constructor(){super('Shop');}
 create(){
  cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Boutique',145,50);
  label(this,540,245,'De nouveaux compagnons',31);
  const offers=[
   {name:'Domino',key:'collection-domino',currency:'Croquettes'},
   {name:'Orion',key:'collection-orion',currency:'Diamants'},
   {name:'Opale',key:'collection-opale',currency:'Diamants'}
  ];
  offers.forEach((offer,i)=>{const y=500+i*330;panel(this,540,y,900,275);imageContain(this.add.image(285,y,offer.key),180,180);label(this,570,y-55,offer.name,36);label(this,570,y+5,offer.currency,25,'#775f68',22);button(this,700,y+80,330,'Découvrir',()=>{},C.teal);});
  panel(this,540,1570,720,100);label(this,540,1570,'Chats  ·  Décors  ·  Diamants',26);
  button(this,540,1745,650,'Retour à mon arbre',()=>this.scene.start('LevelSelect'),C.orange);
 }
}

export class MissionsScene extends Phaser.Scene {
 constructor(){super('Missions');}
 create(){
  cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Missions du jour',145,48);
  imageContain(this.add.image(540,300,'hub-missions'),120,120);label(this,540,410,'Trois rendez-vous avec tes chats',29);
  const missions=[
   {title:'Terminer des grilles',progress:'2 / 3',done:false},
   {title:'Réussir sans erreur',progress:'1 / 1',done:true},
   {title:'Jouer le Défi du jour',progress:'0 / 1',done:false}
  ];
  missions.forEach((m,i)=>{const y=650+i*300;panel(this,540,y,920,235);label(this,320,y-45,m.title,31);label(this,250,y+35,m.progress,27,'#775f68',22);imageContain(this.add.image(650,y+20,'hub-diamond'),70,70);button(this,820,y+25,240,m.done?'Recevoir':'Voir',()=>{},m.done?C.teal:C.orange);});
  label(this,540,1650,'De nouvelles missions chaque jour',23,'#775f68',20);
  button(this,540,1775,650,'Retour à mon arbre',()=>this.scene.start('LevelSelect'),C.orange);
 }
}
