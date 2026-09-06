import Phaser from 'phaser';
import levels from '../../data/levels.json';
import type { Level } from '../../core/model';
import { SaveService } from '../../services/SaveService';
import { GameRegistry } from '../registry';
import { backButton,button,cozyBackground,label,title } from '../ui';
export class ArchiveScene extends Phaser.Scene {
 constructor(){super('Archive');}
 create({page=0}:{page?:number}={}){cozyBackground(this);backButton(this,()=>this.scene.start('LevelSelect'));title(this,'Mes anciens sommets',240,55);label(this,540,350,'Ta progression précédente est conservée.',30);const items=(levels as unknown as Level[]).filter(l=>SaveService.data.progress[l.id]?.completed);items.slice(page*8,page*8+8).forEach((level,i)=>button(this,540,510+i*135,750,`${level.id}  ·  ${'★'.repeat(SaveService.data.progress[level.id]!.stars)}`,()=>{GameRegistry.selected=level;this.scene.start('Game');}));if(page>0)button(this,300,1720,400,'Précédents',()=>this.scene.restart({page:page-1}));if((page+1)*8<items.length)button(this,780,1720,400,'Suivants',()=>this.scene.restart({page:page+1}));}
}
