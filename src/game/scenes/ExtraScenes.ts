import Phaser from 'phaser';
import { cosmetics,starterCosmetics } from '../../core/cosmetics';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,press,title } from '../ui';
import { C } from '../theme';

export class LostScene extends Phaser.Scene {
 constructor(){super('Lost');}
 create({reason='errors'}:{reason?:string}={}){cozyBackground(this);panel(this,540,1000,900,1180);title(this,'Chat alors…',410,72);imageContain(this.add.image(540,850,'duo-retry'),650,430).setDepth(30);label(this,540,1060,reason==='time'?'Le temps est écoulé.':'Trois erreurs mettent fin à cette tentative.',35);label(this,540,1160,'Tu peux recommencer gratuitement.\nLa grille, le cœur, le chrono et les indices repartent de zéro.',27);button(this,540,1390,690,'Recommencer',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.teal);button(this,540,1550,690,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.orange);}
}

type ShopTab='standard'|'rare';
export class ShopScene extends Phaser.Scene {
 private tab:ShopTab='standard';
 constructor(){super('Shop');}
 init(data:{tab?:ShopTab}={}){this.tab=data.tab??'standard';}
 create(){
  this.cameras.main.setBackgroundColor(0xfff7ef);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Boutique',90,58);label(this,540,150,'Des trouvailles pour personnaliser ton arbre',26,'#78647d',18);
  const wallet=this.add.container(540,250),walletSkin=this.add.image(0,0,'button-secondary').setDisplaySize(620,108),kibble=imageContain(this.add.image(-190,0,'hub-kibble'),66,66),amount=label(this,-85,0,String(SaveService.data.kibble),34,C.ink,20);wallet.add([walletSkin,kibble,amount]);label(this,675,250,'Croquettes',25,'#78647d',18);
  const tabY=370,tabW=520;[{key:'standard' as const,name:'Standards',skin:'button-primary'},{key:'rare' as const,name:'Rares',skin:'tile-lilac'}].forEach((t,i)=>{const c=this.add.container(20+tabW/2+i*tabW,tabY),skin=this.add.image(0,0,this.tab===t.key?'button-primary':t.skin).setDisplaySize(tabW+4,112),txt=label(this,0,0,t.name,30,'#ffffff',20);c.add([skin,txt]);if(this.tab!==t.key)c.setAlpha(.78);press(this,c,tabW,112,()=>this.scene.restart({tab:t.key}));});
  if(this.tab==='rare'){imageContain(this.add.image(540,760,'diamond-chest'),300,300);label(this,540,1010,'Les objets rares arriveront avec les diamants.',34,C.ink,20);label(this,540,1070,'La boutique ne révèle jamais toute la collection.',25,'#78647d',18);return;}
  const offers=cosmetics.filter(c=>!starterCosmetics.includes(c.id)).slice(0,6),prices=[80,100,120,140,160,180];
  offers.forEach((item,i)=>{const col=i%3,row=Math.floor(i/3),x=190+col*350,y=650+row*470;panel(this,x,y,310,410);if(item.slot==='background'){const texture=item.id==='night'?'background-night':'background-serre';imageContain(this.add.image(x,y-82,texture),210,150);}else if(item.slot==='cushion')imageContain(this.add.image(x,y-82,'tree-flower-cushion'),190,150).setTint(item.color);else{const texture=item.id==='birch'?'tree-cubby-cream':'tree-cubby';imageContain(this.add.image(x,y-82,texture),180,170);}label(this,x,y+38,item.name,25,C.ink,18).setWordWrapWidth(260);const owned=SaveService.data.ownedCosmetics.includes(item.id),price=prices[i]!,action=this.add.container(x,y+132),skin=this.add.image(0,0,owned?'button-disabled':'button-primary').setDisplaySize(250,92),icon=owned?null:imageContain(this.add.image(-68,0,'hub-kibble'),40,40),txt=label(this,owned?0:22,0,owned?'Possédé':String(price),25,'#ffffff',18);action.add(skin);if(icon)action.add(icon);action.add(txt);if(!owned)press(this,action,250,92,()=>{if(SaveService.data.kibble<price)return;SaveService.data.kibble-=price;SaveService.data.ownedCosmetics.push(item.id);void SaveService.persist();this.scene.restart({tab:this.tab});});});
  const footer=this.add.image(540,1670,'puzzle-panel').setDisplaySize(1000,190);imageContain(this.add.image(155,1670,'hub-shop'),110,110);label(this,610,1640,'Les objets standards s’achètent en croquettes.',27,C.ink,18);label(this,610,1690,'Les objets inconnus restent cachés dans la collection.',22,'#78647d',18);footer.setDepth(-1);
 }
}

type MissionTab='daily'|'global';
type GlobalDef={id:string;title:string;icon:string;value:()=>number;thresholds:number[];collection?:boolean};
const globalDefs:GlobalDef[]=[
 {id:'climb',title:'Grimpe toujours plus haut',icon:'ui-play',value:()=>SaveService.data.stats.levelsCompleted,thresholds:[10,20,30,50,75,100,150,200,300,500]},
 {id:'perfect',title:'Maître des étoiles',icon:'star-full',value:()=>Object.values(SaveService.data.progress).filter(p=>p.completed&&p.bestErrors===0).length,thresholds:[5,10,25,50,100,150,250]},
 {id:'claw',title:'Coup de griffe',icon:'ui-clock',value:()=>Object.entries(SaveService.data.progress).filter(([id,p])=>p.completed&&SaveService.data.journeyLevels[id]?.timed).length,thresholds:[1,3,5,10,20,30,50,75,100]},
 {id:'collection',title:'Collectionneur',icon:'hub-decorate',value:()=>SaveService.data.ownedCosmetics.length,thresholds:[3,5,10,15,20,30],collection:true},
];

export class MissionsScene extends Phaser.Scene {
 private tab:MissionTab='daily';
 constructor(){super('Missions');}
 init(data:{tab?:MissionTab}={}){this.tab=data.tab??'daily';}
 create(){
  this.cameras.main.setBackgroundColor(0xfff7ef);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Missions',90,58);label(this,540,150,'Relève des défis et fais grandir ta collection',26,'#78647d',18);
  const tabY=270,tabW=520;[{key:'daily' as const,name:'Missions du jour',skin:'button-primary'},{key:'global' as const,name:'Missions globales',skin:'tile-lilac'}].forEach((t,i)=>{const c=this.add.container(20+tabW/2+i*tabW,tabY),skin=this.add.image(0,0,this.tab===t.key?'button-primary':t.skin).setDisplaySize(tabW+4,118),txt=label(this,0,0,t.name,29,'#ffffff',20);c.add([skin,txt]);if(this.tab!==t.key)c.setAlpha(.78);press(this,c,tabW,118,()=>this.scene.restart({tab:t.key}));});
  if(this.tab==='daily')this.daily();else this.global();
 }
 private missionRow(y:number,icon:string,name:string,subtitle:string,current:number,target:number,rewardText:string,ready:boolean,claimed:boolean,onClaim?:()=>void){
  panel(this,540,y,1000,230);imageContain(this.add.image(135,y,icon),100,100);label(this,230,y-54,name,29,C.ink,18).setOrigin(0,.5);label(this,230,y-8,subtitle,21,'#78647d',17).setOrigin(0,.5);const ratio=Phaser.Math.Clamp(current/target,0,1),track=this.add.image(430,y+65,'button-disabled').setDisplaySize(400,42),fill=this.add.image(230+200*ratio,y+65,'button-primary').setDisplaySize(Math.max(8,400*ratio),42);track.setAlpha(.7);fill.setOrigin(1,.5);label(this,430,y+65,`${Math.min(current,target)} / ${target}`,20,'#ffffff',16);label(this,825,y-15,rewardText,23,C.ink,18).setOrigin(0,.5);const action=this.add.container(855,y+68),skin=this.add.image(0,0,ready&&!claimed?'button-primary':'button-disabled').setDisplaySize(240,72),txt=label(this,0,0,claimed?'Récupéré':ready?'Récupérer':'En cours',20,'#ffffff',16);action.add([skin,txt]);if(ready&&!claimed&&onClaim)press(this,action,240,72,onClaim);
 }
 private daily(){
  const daily=SaveService.ensureDailyMissions();
  daily.missions.forEach((m,i)=>this.missionRow(560+i*300,m.family==='challenge'?'ui-clock':m.family==='mastery'?'star-full':'ui-play',m.title,m.subtitle,m.progress,m.target,'◆ 1 diamant',m.progress>=m.target,m.claimed,()=>{if(SaveService.claimDaily(m.id))this.scene.restart({tab:'daily'});}));
  const claimed=daily.missions.filter(m=>m.claimed).length;label(this,540,1510,`${claimed} / 3 récompenses récupérées`,25,'#78647d',18);imageContain(this.add.image(790,1510,'hub-diamond'),52,52);label(this,835,1510,String(SaveService.data.missions.diamonds),28,C.ink,18).setOrigin(0,.5);
 }
 private global(){
  const maxCollection=cosmetics.length;
  globalDefs.forEach((def,i)=>{const value=def.value(),claimed=SaveService.data.missions.globalClaimed[def.id]??0,thresholds=def.collection?[...def.thresholds.filter(n=>n<maxCollection),maxCollection]:def.thresholds,next=thresholds.find(n=>n>claimed),y=500+i*310;if(!next){this.missionRow(y,def.icon,def.title,'Tous les paliers sont terminés',value,Math.max(1,thresholds.at(-1)??1),'✓ Terminé',true,true);return;}const milestoneIndex=thresholds.indexOf(next),diamonds=(milestoneIndex+1)%4===0?2:0,kibble=50+milestoneIndex*25,rewardText=diamonds?`${kibble} croq. + ${diamonds} ◆`:`${kibble} croquettes`;this.missionRow(y,def.icon,def.title,def.collection?`Découvre ${next} objets`:`Atteins le palier ${next}`,value,next,rewardText,value>=next,false,()=>{if(SaveService.claimGlobal(def.id,next,kibble,diamonds))this.scene.restart({tab:'global'});});});
  imageContain(this.add.image(790,1745,'hub-diamond'),52,52);label(this,835,1745,String(SaveService.data.missions.diamonds),28,C.ink,18).setOrigin(0,.5);
 }
}
