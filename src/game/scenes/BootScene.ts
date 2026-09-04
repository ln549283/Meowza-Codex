import Phaser from 'phaser';import { SaveService } from '../../services/SaveService';import { C } from '../theme';
export class BootScene extends Phaser.Scene{constructor(){super('Boot')}create(){this.cameras.main.setBackgroundColor(C.cream);void SaveService.load().then(()=>this.scene.start('Preload'));}}
