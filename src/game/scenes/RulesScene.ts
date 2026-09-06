import Phaser from 'phaser';
import { SaveService } from '../../services/SaveService';
import { button,cozyBackground,fadeIn,imageContain,label,panel,press,relationIcon,sparkles,title } from '../ui';
import { C } from '../theme';
export class RulesScene extends Phaser.Scene {
 constructor(){super('Rules');}
 create(data:{first?:boolean;fromGame?:boolean;page?:number}={}){
  const page=data.page??0;this.registry.set('rulesFromGame',Boolean(data.fromGame));fadeIn(this);cozyBackground(this);
  const headings=['Une patte, un chat','Moitié gris, moitié roux','Deux, oui. Trois, non !','Les liens des petits chats'];
  title(this,headings[page]!,235,57);label(this,540,340,`${page+1} / 4 · Une règle, un petit essai`,30);
  panel(this,540,925,940,1030);
  const cat=(x:number,y:number,v:number)=>imageContain(this.add.image(x,y,v===1?'grey-cat':'orange-cat'),150,150);
  const slot=(x:number,y:number,v:number)=>{const g=this.add.graphics().fillStyle(v===1?0xeadcfa:v===2?0xffdfbb:0xffffff).lineStyle(4,0xd6b9e8).fillRoundedRect(x-85,y-85,170,170,28).strokeRoundedRect(x-85,y-85,170,170,28);if(v)cat(x,y,v);return g;};
  const feedback=label(this,540,1280,'',32);const done=()=>{feedback.setText('Voilà ! Tu as compris.');sparkles(this,540,950,9);};
  const demo=(values:number[],answer:number)=>{values.forEach((v,i)=>slot(240+i*200,850,v));const index=values.indexOf(0),x=240+index*200;let used=false;const c=this.add.container(x,850);c.add(label(this,0,0,'?',66));press(this,c,175,175,()=>{if(used)return;used=true;c.removeAll(true);cat(x,850,answer);done();});};
  if(page===0){label(this,540,510,'Choisis ton chat, puis touche une case.',34);let brush=1;const marker=this.add.graphics();const select=(v:number)=>{brush=v;marker.clear().lineStyle(6,C.teal).strokeRoundedRect((v===1?350:730)-110,580,220,205,35);};
   [1,2].forEach((v,i)=>{const x=350+i*380,c=this.add.container(x,680);c.add(imageContain(this.add.image(0,0,v===1?'grey-cat':'orange-cat'),150,150));press(this,c,220,205,()=>select(v));});select(1);
   slot(540,990,0);const c=this.add.container(540,990);let image:Phaser.GameObjects.Image|undefined;press(this,c,175,175,()=>{if(image){image.destroy();image=undefined;feedback.setText('La case est vide. Tu peux changer d’avis.');}else{image=cat(540,990,brush);done();}});label(this,540,1150,'Retouche le même chat pour effacer.',30);
  }else if(page===1){label(this,540,540,'Sur une ligne de 4 : 2 gris + 2 roux.',36);demo([1,2,1,0],2);label(this,540,1070,'Touche « ? » : le dernier chat est roux.\nMême équilibre dans chaque colonne.',31);
  }else if(page===2){label(this,540,540,'Jamais trois chats identiques à la suite.',35);demo([1,1,0,2],2);label(this,540,1070,'Deux gris côte à côte ? Le suivant est roux.\nCela marche aussi de haut en bas.',31);
  }else{label(this,540,520,'Cœur : identiques. Griffes : opposés.',34);slot(340,740,1);slot(740,740,1);relationIcon(this,540,740,78,true);slot(340,1010,1);slot(740,1010,2);relationIcon(this,540,1010,78,false);label(this,540,1190,'Lis le lien entre les deux cases voisines.',30);feedback.setText('Besoin d’aide ? « Indice » explique le pourquoi.');}
  for(let i=0;i<4;i++)this.add.circle(468+i*48,1500,i===page?12:8,i===page?C.pink:0xd8c5e7);
  const leave=()=>{if(data.first){SaveService.data.tutorialCompleted=true;void SaveService.persist();this.scene.start('LevelSelect');}else if(data.fromGame){this.scene.stop();this.scene.resume('Game');}else this.scene.start('Home');};
  if(page>0)button(this,290,1640,390,'Précédent',()=>this.scene.restart({...data,page:page-1}),C.teal);
  button(this,page>0?760:540,1640,page>0?390:650,page===3?'À moi de jouer':'Suivant',()=>{if(page===3)leave();else this.scene.restart({...data,page:page+1});},C.pink);
  button(this,540,1800,650,data.fromGame?'Reprendre ma partie':'J’ai compris, jouer',leave,C.teal);
 }
}
