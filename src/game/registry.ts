import type { Level } from '../core/model';
export interface SessionResult {level:Level;stars:number;errors:number;hints:number}
export const GameRegistry:{selected?:Level;result?:SessionResult}={};
