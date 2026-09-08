import type { Level } from '../core/model';
export interface SessionResult {level:Level;errors:number;hints:number}
export const GameRegistry:{selected?:Level;result?:SessionResult}={};
