import type { Difficulty } from './model';
export const STARTING_KIBBLE=60;
export const rewardFor=(difficulty:Difficulty)=>({easy:5,medium:8,hard:12,extreme:15})[difficulty];
export const HINT_PRICES = [15, 25, 40] as const;
export const MAX_HINTS = HINT_PRICES.length;
/** null means exhausted or invalid, never a fourth purchasable hint. */
export function hintCost(purchases:number):number|null {
 return Number.isInteger(purchases)&&purchases>=0&&purchases<MAX_HINTS?HINT_PRICES[purchases]!:null;
}
