import { EMPTY, type CellValue, type Constraint, type Grid, type Position } from './model';

const key = ([r,c]: Position) => `${r}:${c}`;
export function lineIsValid(line: readonly CellValue[], complete = false): boolean {
  const half = line.length / 2;
  const grey = line.filter(v => v === 1).length;
  const orange = line.filter(v => v === 2).length;
  if (grey > half || orange > half) return false;
  for (let i=0;i<=line.length-3;i++) if (line[i] !== EMPTY && line[i] === line[i+1] && line[i] === line[i+2]) return false;
  return !complete || (grey === half && orange === half && !line.includes(EMPTY));
}
export function constraintIsValid(grid: Grid, constraint: Constraint): boolean {
  const av = grid[constraint.a[0]]?.[constraint.a[1]] ?? EMPTY;
  const bv = grid[constraint.b[0]]?.[constraint.b[1]] ?? EMPTY;
  if (av === EMPTY || bv === EMPTY) return true;
  return constraint.type === 'same' ? av === bv : av !== bv;
}
export function affectedErrors(grid: Grid, constraints: readonly Constraint[]): Position[] {
  const bad = new Map<string, Position>();
  grid.forEach((row,r) => { if (!lineIsValid(row)) row.forEach((_,c)=>bad.set(key([r,c]),[r,c])); });
  for (let c=0;c<grid.length;c++) { const col=grid.map(row=>row[c] ?? EMPTY); if(!lineIsValid(col)) col.forEach((_,r)=>bad.set(key([r,c]),[r,c])); }
  constraints.forEach(x=>{if(!constraintIsValid(grid,x)){bad.set(key(x.a),x.a);bad.set(key(x.b),x.b);}});
  return [...bad.values()];
}
export function areAdjacent(a: Position,b: Position): boolean { return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1; }
