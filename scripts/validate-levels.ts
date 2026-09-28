import { assessDifficulty } from '../src/core/difficulty';
import levelsData from '../src/data/levels.json';
import type { Level } from '../src/core/model';
import { countSolutions } from '../src/core/solver';
import { validateLevelShape } from '../src/core/validator';
const levels=levelsData as unknown as Level[];const ids=new Set<string>();const failures:string[]=[];
for(const level of levels){const errors=validateLevelShape(level);if(ids.has(level.id))errors.push('duplicate id');ids.add(level.id);if(level.difficulty==='extreme'&&!assessDifficulty(level).requiresLookahead)errors.push('extreme must require more than immediate deductions');const count=countSolutions(level.initial,level.constraints,2);if(count!==1)errors.push(`${count} solutions`);if(errors.length)failures.push(`${level.id}: ${errors.join(', ')}`);}
for(const [difficulty,expected,size] of [['easy',20,4],['medium',30,6],['hard',30,8],['extreme',30,8]] as const){const group=levels.filter(l=>l.difficulty===difficulty);if(group.length!==expected)failures.push(`${difficulty}: expected ${expected}`);if(group.some(l=>l.size!==size))failures.push(`${difficulty}: invalid size`);}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log(`Validated ${levels.length} levels: dimensions, rules, constraints and uniqueness OK.`);
