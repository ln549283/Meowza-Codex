import { HintScene } from './game/scenes/HintScene';
import { LostScene,ShopScene } from './game/scenes/ExtraScenes';
import { ArchiveScene } from './game/scenes/ArchiveScene';
import Phaser from 'phaser';
import { App } from '@capacitor/app';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import './style.css';
import { W,H } from './game/theme';
import { BootScene } from './game/scenes/BootScene';
import { PreloadScene } from './game/scenes/PreloadScene';
import { HomeScene } from './game/scenes/HomeScene';
import { LevelSelectScene } from './game/scenes/LevelSelectScene';
import { GameScene } from './game/scenes/GameScene';
import { RulesScene } from './game/scenes/RulesScene';
import { SettingsScene } from './game/scenes/SettingsScene';
import { VictoryScene } from './game/scenes/VictoryScene';
import { AudioService } from './services/AudioService';
import { SaveService } from './services/SaveService';
async function start(){
 // A slow or failed font download must not prevent the game from starting.
 await Promise.race([Promise.all([document.fonts.load('700 32px Nunito'),document.fonts.load('800 32px Nunito')]).catch(()=>undefined),new Promise(resolve=>setTimeout(resolve,2000))]);
 const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:W,height:H,backgroundColor:'#fff6ee',transparent:false,antialias:true,pixelArt:false,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[BootScene,PreloadScene,HomeScene,LevelSelectScene,GameScene,RulesScene,SettingsScene,VictoryScene,LostScene,ShopScene,ArchiveScene,HintScene],fps:{target:30,limit:30},render:{powerPreference:'low-power'}});
 const visibility=(active:boolean)=>{if(active){game.loop.wake();AudioService.resume();}else{game.loop.sleep();AudioService.suspend();void SaveService.persist();}};
 document.addEventListener('visibilitychange',()=>visibility(!document.hidden));
 void App.addListener('appStateChange',({isActive})=>visibility(isActive));
 void App.addListener('backButton',()=>{const active=game.scene.getScenes(true).at(-1);if(!active)return;const key=active.scene.key;if(key==='Hint'||key==='Rules'&&game.registry.get('rulesFromGame')){active.scene.stop();game.scene.resume('Game');}else if(key==='Game')active.scene.start('LevelSelect');else if(key==='Home')void App.minimizeApp();else if(key!=='Boot'&&key!=='Preload')active.scene.start('Home');});
 // Expose only in development for interaction and regression checks.
 if(import.meta.env.DEV)Object.assign(window,{meowza:game});
}
void start().catch(error=>{console.error('Meowza startup failed',error);const status=document.getElementById('startup-status');if(status)status.textContent='Le jeu n’a pas pu démarrer. Réessaie dans ton navigateur.';const retry=document.getElementById('startup-retry');if(retry)retry.hidden=false;});
