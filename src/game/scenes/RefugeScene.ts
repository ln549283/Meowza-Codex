import Phaser from 'phaser';
import { nextSummit,refugeNames } from '../../core/journey';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,sparkles,title } from '../ui';
import { C } from '../theme';
export class RefugeScene extends Phaser.Scene {
 constructor(){super('Refuge');}
 create({n=1}:{n?:number}={}){
  if(n*6>=nextSummit(SaveService.data.progress)){this.scene.start('LevelSelect');return;}
  cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,refugeNames[(n-1)%refugeNames.length]!,250,52);label(this,540,345,'Six sommets. Un nouveau coin douillet.',30);
  panel(this,540,870,920,850);const decor=this.add.graphics();const cat=imageContain(this.add.image(540,790,n%2?'grey-cat':'orange-cat'),310,310);const name=label(this,540,1150,'',36);
  const draw=(choice:string)=>{decor.clear();if(choice==='hamac'){decor.lineStyle(18,0xb78660).lineBetween(225,620,340,970).lineBetween(855,620,740,970);decor.fillStyle(0xff87b4).fillEllipse(540,990,580,170);decor.fillStyle(0xffc4df).fillEllipse(540,964,520,100);}else{decor.fillStyle(0xbf8cdb).fillRoundedRect(290,590,500,440,55);decor.fillTriangle(240,610,540,425,840,610);decor.fillStyle(0xffeccc).fillRoundedRect(385,670,310,350,135);}cat.setDepth(2);name.setText(choice==='hamac'?'Un hamac pour les siestes':'Une cabane pour les ronrons');};
  draw(SaveService.data.refuges[n]??'hamac');
  const choose=(choice:string)=>{SaveService.data.refuges[n]=choice;void SaveService.persist();draw(choice);sparkles(this,540,850);};
  button(this,310,1410,400,'Hamac pêche',()=>choose('hamac'),C.orange);button(this,770,1410,400,'Cabane lilas',()=>choose('cabane'),C.pink);
  label(this,540,1540,'Touche ton préféré. Tu peux changer plus tard.',28);button(this,540,1710,650,'Continuer mon ascension',()=>this.scene.start('LevelSelect'),C.teal);
 }
}
