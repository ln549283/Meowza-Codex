import { GameRegistry } from '../registry';
import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,title } from '../ui';
import { C } from '../theme';
export class LostScene extends Phaser.Scene {
 constructor(){super('Lost');}
 create({reason='errors'}:{reason?:string}={}){cozyBackground(this);title(this,'Chat alors…',390,80);imageContain(this.add.image(540,770,'grey-cat'),340,340);label(this,540,1110,reason==='time'?'Le temps est écoulé. On réessaie ?':'Trois erreurs. Une nouvelle tentative ?',36);label(this,540,1210,'Nouvelle tentative : cœur, chrono et indices repartent de zéro.',28);button(this,540,1430,720,'Recommencer',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.pink);if(GameRegistry.selected?.timed&&(SaveService.data.failures[GameRegistry.selected.id]??0)>=3)button(this,540,1790,720,'Réessayer · temps +50 % offert',()=>{const l=GameRegistry.selected!;SaveService.restartAttempt();SaveService.remember(l.id,l.initial,0,0,(l.timeLimit??360)*1.5,false);this.scene.start('Game');},C.orange);button(this,540,1610,720,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.teal);}
}
export class ShopScene extends Phaser.Scene {
 constructor(){super('Shop');}
 create(){cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Boutique',300,60);panel(this,540,930,920,980);label(this,540,570,'Cosmétiques pour ton arbre\net tes chats',38);label(this,540,760,`${SaveService.data.kibble} croquettes`,42);label(this,540,940,'Le shell Boutique est en place.\n\nLe catalogue, les diamants et les achats\nseront activés dans les prochains blocs.',32);button(this,540,1420,650,'Personnaliser mon arbre',()=>this.scene.start('LevelSelect',{decorating:true}),C.orange);button(this,540,1580,650,'Retour à mon arbre',()=>this.scene.start('LevelSelect'),C.teal);}
}
export class MissionsScene extends Phaser.Scene {
 constructor(){super('Missions');}
 create(){cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Missions',300,60);panel(this,540,930,920,980);label(this,540,590,'Tes prochains objectifs',40);label(this,540,820,'Jouer · progresser · collectionner',34);label(this,540,1010,'Le shell Missions est prêt.\n\nLes missions quotidiennes et leurs récompenses\nseront branchées sur l’économie au prochain bloc.',32);button(this,540,1540,650,'Retour à mon arbre',()=>this.scene.start('LevelSelect'),C.teal);}
}
