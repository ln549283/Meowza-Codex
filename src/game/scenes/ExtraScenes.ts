import Phaser from 'phaser';
import { cosmetics } from '../../core/cosmetics';
import { SaveService } from '../../services/SaveService';
import { backButton,button,cozyBackground,imageContain,label,panel,press,sparkles,title } from '../ui';
import { C } from '../theme';

export class LostScene extends Phaser.Scene {
 constructor(){super('Lost');}
 create({reason='errors'}:{reason?:string}={}){cozyBackground(this);panel(this,540,1000,900,1180);title(this,'Chat alors…',410,72);imageContain(this.add.image(540,850,'duo-retry'),650,430).setDepth(30);label(this,540,1060,reason==='time'?'Le temps est écoulé.':'Trois erreurs mettent fin à cette tentative.',35);label(this,540,1160,'Tu peux recommencer gratuitement.\nLa grille, le cœur, le chrono et les indices repartent de zéro.',27);button(this,540,1390,690,'Recommencer',()=>{SaveService.restartAttempt();this.scene.start('Game');},C.teal);button(this,540,1550,690,'Retour à l’arbre',()=>this.scene.start('LevelSelect'),C.orange);}
}

export {ShopScene} from './CustomizeScene';

type MissionTab='daily'|'global';
type GlobalDef={id:string;title:string;icon:string;value:()=>number;thresholds:number[];collection?:boolean};
type MissionReward={icon:string;amount:string;secondIcon?:string;secondAmount?:string};
const globalDefs:GlobalDef[]=[
 {id:'climb',title:'Grimpe toujours plus haut',icon:'ui-play',value:()=>SaveService.data.stats.levelsCompleted,thresholds:[10,20,30,50,75,100,150,200,300,500]},
 {id:'perfect',title:'Maître des étoiles',icon:'star-full',value:()=>Object.values(SaveService.data.progress).filter(p=>p.completed&&p.bestErrors===0).length,thresholds:[5,15,35,75,125,200,300]},
 {id:'claw',title:'Coup de griffe',icon:'ui-clock',value:()=>Object.entries(SaveService.data.progress).filter(([id,p])=>p.completed&&SaveService.data.journeyLevels[id]?.timed).length,thresholds:[1,3,5,10,20,30,50,75,100]},
 {id:'collection',title:'Collectionneur',icon:'hub-decorate',value:()=>SaveService.data.ownedCosmetics.length,thresholds:[3,5,10,15],collection:true},
];

export class MissionsScene extends Phaser.Scene {
 private tab:MissionTab='daily';
 constructor(){super('Missions');}
 init(data:{tab?:MissionTab}={}){this.tab=data.tab??'daily';}
 create(){
  this.cameras.main.setBackgroundColor(0xfff7ef);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Missions',90,58);label(this,540,150,'Relève des défis et fais grandir ta collection',26,'#78647d',18);
  const tabY=270,tabW=478,gap=24,startX=50;([{key:'daily' as const,name:'Missions du jour'},{key:'global' as const,name:'Missions globales'}]).forEach((t,i)=>{const active=this.tab===t.key,x=startX+tabW/2+i*(tabW+gap),c=this.add.container(x,tabY),skin=this.add.image(0,0,active?'button-primary':'button-secondary').setDisplaySize(tabW,112),txt=label(this,0,0,t.name,29,active?'#ffffff':C.ink,20);c.add([skin,txt]);if(!active)c.setAlpha(.88);press(this,c,tabW,112,()=>this.scene.restart({tab:t.key}));});if(this.tab==='daily')this.daily();else this.global();
 }
 private reward(x:number,y:number,reward:MissionReward){imageContain(this.add.image(x,y,reward.icon),46,46);if(reward.amount)label(this,x+38,y,reward.amount,26,C.ink,18).setOrigin(0,.5);if(reward.secondIcon&&reward.secondAmount){imageContain(this.add.image(x+90,y,reward.secondIcon),42,42);label(this,x+125,y,reward.secondAmount,21,C.ink,18).setOrigin(0,.5);}}
 private missionRow(y:number,icon:string,name:string,subtitle:string,current:number,target:number,reward:MissionReward,ready:boolean,claimed:boolean,onClaim?:()=>void){const card=panel(this,540,y,980,250);if(ready&&!claimed)card.setTint(0xfff1cf);imageContain(this.add.image(135,y,icon),84,84);label(this,220,y-66,name,30,C.ink,18).setOrigin(0,.5).setWordWrapWidth(490);label(this,220,y-6,subtitle,26,'#78647d',17).setOrigin(0,.5).setWordWrapWidth(485);if(ready||claimed)imageContain(this.add.image(700,y-43,'ui-check'),36,36).setAlpha(claimed?.68:1);const ratio=Phaser.Math.Clamp(current/target,0,1),barX=220,barY=y+76,barW=410,barH=36,barCenter=barX+barW/2;this.add.image(barCenter,barY,'button-disabled').setDisplaySize(barW,barH).setAlpha(.7);if(ratio>0){const fill=this.add.image(barX,barY,'button-primary').setOrigin(0,.5).setDisplaySize(barW,barH);fill.setCrop(0,0,fill.width*ratio,fill.height);}label(this,barCenter,barY,`${Math.min(current,target)} / ${target}`,19,ratio>.56?'#ffffff':C.ink,16);this.reward(785,y-12,reward);const action=this.add.container(850,y+76),completeState=claimed&&reward.icon==='ui-check',light=claimed||!ready,skin=this.add.image(0,0,ready&&!claimed?'button-primary':'button-disabled').setDisplaySize(230,66),txt=label(this,completeState?12:0,0,completeState?'Terminé':claimed?'Récupéré':ready?'Récupérer':'En cours',25,light?C.ink:'#ffffff',16);action.add(skin);if(completeState)action.add(imageContain(this.add.image(-72,0,'ui-check'),30,30));else if(ready&&!claimed)action.add(imageContain(this.add.image(-78,0,'ui-gift'),30,30));action.add(txt);if(ready&&!claimed&&onClaim)press(this,action,230,66,()=>{action.disableInteractive();sparkles(this,850,y+20,8);this.time.delayedCall(240,()=>onClaim());});}
 private daily(){const daily=SaveService.ensureDailyMissions();label(this,540,410,`${daily.missions.filter(m=>m.claimed).length} / 3 récompenses récupérées`,28,'#78647d');label(this,540,1675,'De nouveaux objectifs chaque jour.\nLes niveaux rejoués comptent aussi.',26,'#78647d');daily.missions.forEach((m,i)=>this.missionRow(600+i*310,m.family==='challenge'?'ui-clock':m.family==='mastery'?'star-full':'ui-play',m.title,m.metric==='error_budget'?(m.progress>=m.target?'Série validée · 2 erreurs max.':`${m.target} victoires de suite · erreurs : ${(m.errorWindow??[]).reduce((sum,value)=>sum+value,0)}/2`):m.subtitle,m.progress,m.target,{icon:'hub-diamond',amount:String(m.reward)},m.progress>=m.target,m.claimed,()=>{if(SaveService.claimDaily(m.id))this.scene.restart({tab:'daily'});}));}
 private global(){const maxCollection=cosmetics.length;globalDefs.forEach((def,i)=>{const value=def.value(),claimed=SaveService.data.missions.globalClaimed[def.id]??0,thresholds=def.collection?[...def.thresholds.filter(n=>n<maxCollection),maxCollection]:def.thresholds,next=thresholds.find(n=>n>claimed),y=510+i*300;if(!next){this.missionRow(y,def.icon,def.title,def.collection?'Collection complète':'Tous les paliers atteints',value,Math.max(1,thresholds.at(-1)??1),{icon:'ui-check',amount:''},true,true);return;}const milestoneIndex=thresholds.indexOf(next),diamonds=(milestoneIndex+1)%4===0?2:0,kibble=50+milestoneIndex*25,reward:MissionReward=diamonds?{icon:'hub-kibble',amount:String(kibble),secondIcon:'hub-diamond',secondAmount:String(diamonds)}:{icon:'hub-kibble',amount:String(kibble)},subtitle=def.collection?`Découvre ${next} objets`:def.id==='perfect'?`Réussis ${next} niveaux parfaits`:`Atteins le palier ${next}`;this.missionRow(y,def.icon,def.title,subtitle,value,next,reward,value>=next,false,()=>{if(SaveService.claimGlobal(def.id,next,kibble,diamonds))this.scene.restart({tab:'global'});});});}
}
