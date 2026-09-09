import { GameRegistry } from '../registry';
import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';

export class LostScene extends Phaser.Scene {
 constructor(){super('Lost');}
 create({reason='errors'}:{reason?:string}={}){
  cozyBackground(this);this.add.circle(540,760,310,0xf6dde5,.7);title(this,'Chat alors…',355,80);
  const nimbus=this.add.sprite(420,820,'nimbus-sad',0).setOrigin(.5,.85).setDisplaySize(300,300);nimbus.play('anim-nimbus-sad');
  const moka=this.add.sprite(665,825,'moka-sad',0).setOrigin(.5,.85).setDisplaySize(300,300);moka.play('anim-moka-sad');
  label(this,540,1110,reason==='time'?'Le temps est écoulé. On réessaie ?':'Trois erreurs. Une nouvelle tentative ?',36);
  label(this,540,1210,'Nouvelle tentative : cœur, chrono et indices repartent de zéro.',28);
  button(this,540,1430,720,'Recommencer',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.pink);
  if(GameRegistry.selected?.timed&&(SaveService.data.failures[GameRegistry.selected.id]??0)>=3)button(this,540,1790,720,'Réessayer · temps +50 % offert',()=>{const l=GameRegistry.selected!;SaveService.restartAttempt();SaveService.remember(l.id,l.initial,0,0,(l.timeLimit??360)*1.5,false);this.scene.start('Game');},C.orange);
  button(this,540,1610,720,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.teal);
 }
}

export class ShopScene extends Phaser.Scene {
 constructor(){super('Shop');}
 create(){
  cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Boutique',300,60);
  this.add.circle(540,560,150,0xffead4,.75);imageContain(this.add.image(540,560,'hub-shop'),190,190);
  panel(this,540,1110,920,880);label(this,540,790,'Cosmétiques pour ton arbre\net tes chats',38);label(this,540,930,`${SaveService.data.kibble} croquettes`,38);
  label(this,540,1110,'Le catalogue arrive avec les diamants.\nIci, pas de hasard : tu choisis ce que tu achètes.',31);
  button(this,540,1420,650,'Personnaliser mon arbre',()=>this.scene.start('LevelSelect',{decorating:true}),C.orange);button(this,540,1580,650,'Retour à mon arbre',()=>this.scene.start('LevelSelect'),C.teal);
 }
}

export class MissionsScene extends Phaser.Scene {
 constructor(){super('Missions');}
 create(){
  cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Missions',300,60);
  this.add.circle(540,555,150,0xe2f2ee,.78);imageContain(this.add.image(540,555,'hub-missions'),190,190);
  panel(this,540,1110,920,880);label(this,540,800,'Tes prochains objectifs',40);label(this,540,940,'Jouer · progresser · collectionner',32);
  label(this,540,1120,'Les missions quotidiennes seront branchées\nsur tes actions de jeu et récompenseront\ndes diamants à collectionner.',31);
  button(this,540,1540,650,'Retour à mon arbre',()=>this.scene.start('LevelSelect'),C.teal);
 }
}
