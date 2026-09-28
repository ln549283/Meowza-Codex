export const EMPTY = 0 as const;
export const GREY = 1 as const;
export const ORANGE = 2 as const;
export type CellValue = typeof EMPTY | typeof GREY | typeof ORANGE;
export type FilledValue = typeof GREY | typeof ORANGE;
export type Grid = CellValue[][];
export type Position = readonly [row: number, col: number];
export type ConstraintType = 'same' | 'different';
export interface Constraint { a: Position; b: Position; type: ConstraintType }
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export interface Level { id: string; difficulty: Difficulty; size: 4|6|8; initial: Grid; solution: Grid; constraints: Constraint[]; timed?:boolean; timeLimit?:number }
export interface ValidationResult { valid: boolean; complete: boolean; errors: Position[]; reasons: string[] }
export const cloneGrid = (grid: Grid): Grid => grid.map(row => [...row]);
export const otherValue = (value: FilledValue): FilledValue => value === GREY ? ORANGE : GREY;
