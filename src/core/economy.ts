import type { Difficulty } from './model';

export const STARTING_KIBBLE=60;
export const MAX_HINTS_PER_ATTEMPT=3;
export const rewardFor=(difficulty:Difficulty)=>({easy:5,medium:8,hard:12,extreme:15})[difficulty];
export const hintCost=(purchases:number)=>[15,25,40][Math.max(0,Math.floor(purchases))]??Infinity;
