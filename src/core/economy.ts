import type { Difficulty } from './model';
export const STARTING_KIBBLE=60;
export const rewardFor=(difficulty:Difficulty)=>({easy:20,medium:30,hard:40,extreme:60})[difficulty];
export const hintCost=(purchases:number)=>10*(Math.max(0,purchases)+1);
export const BIOMES=[{name:'Salon',key:'salon',tint:0xfff1de},{name:'Cuisine',key:'cuisine',tint:0xe9fff5},{name:'Jardin',key:'jardin',tint:0xf1fbd9}] as const;
export function biomeFor(n:number){const index=Math.floor((Math.max(1,n)-1)/100);return{...BIOMES[index%BIOMES.length]!,index,start:index*100+1,end:(index+1)*100};}
