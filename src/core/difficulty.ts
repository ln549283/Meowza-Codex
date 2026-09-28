import { EMPTY, cloneGrid, type Grid, type Level, type FilledValue } from './model';
import { validateGrid } from './validator';
/** Measures deductions, not just board size. No solution is consulted. */
export function assessDifficulty(level: Level) {
  const grid = cloneGrid(level.initial);
  let rounds = 0, deductions = 0;
  while (true) {
    const forced: [number, number, FilledValue][] = [];
    for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid.length; c++) {
      if (grid[r]![c] !== EMPTY) continue;
      const values = ([1, 2] as const).filter(value => {
        grid[r]![c] = value;
        const valid = validateGrid(grid, level.constraints).valid;
        grid[r]![c] = EMPTY;
        return valid;
      });
      if (values.length === 1) forced.push([r, c, values[0]!]);
    }
    if (!forced.length) break;
    for (const [r, c, value] of forced) grid[r]![c] = value;
    rounds++; deductions += forced.length;
  }
  const remaining = (g: Grid) => g.flat().filter(v => v === EMPTY).length;
  return { rounds, deductions, requiresLookahead: remaining(grid) > 0, remaining: remaining(grid) };
}
