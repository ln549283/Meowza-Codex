import { mkdir, writeFile } from 'node:fs/promises';
import { generateBank } from '../src/core/generator';
const levels=generateBank();await mkdir(new URL('../src/data/',import.meta.url),{recursive:true});await writeFile(new URL('../src/data/levels.json',import.meta.url),JSON.stringify(levels,null,2)+'\n');console.log(`Generated ${levels.length} unique Meowza levels.`);
