import { readFileSync, writeFileSync } from 'node:fs';
import { generateLevel } from '../src/core/generator';
import { assessDifficulty } from '../src/core/difficulty';
import type { Level } from '../src/core/model';
const path = new URL('../src/data/levels.json', import.meta.url);
const levels = (JSON.parse(readFileSync(path, 'utf8')) as Level[]).filter(l => l.difficulty !== 'extreme');
let seed = 0x43415453, attempts = 0;
const seen = new Set(levels.map(l => JSON.stringify(l.initial)));
while (levels.length < 110 && attempts < 3000) {
  attempts++; seed = (seed + 0x9e3779b9) >>> 0;
  const level = generateLevel(`extreme-${String(levels.length - 79).padStart(2, '0')}`, 'extreme', 8, seed);
  if (!assessDifficulty(level).requiresLookahead || seen.has(JSON.stringify(level.initial))) continue;
  seen.add(JSON.stringify(level.initial)); levels.push(level);
  console.log(level.id, assessDifficulty(level));
}
if (levels.length !== 110) throw new Error('Could not find 30 sufficiently challenging unique puzzles');
writeFileSync(path, JSON.stringify(levels, null, 2) + '\n');
console.log(`Preserved 80 original puzzles; added 30 extreme puzzles in ${attempts} attempts.`);
