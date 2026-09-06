import type { Difficulty } from './model';
export const chapters: { id: Difficulty; name: string; subtitle: string; count: number; color: number }[] = [
  { id: 'easy', name: 'Facile', subtitle: 'Le jardin des coussinets', count: 20, color: 0x639f94 },
  { id: 'medium', name: 'Moyen', subtitle: 'Les cabanes moelleuses', count: 30, color: 0xd5905f },
  { id: 'hard', name: 'Difficile', subtitle: 'Les perchoirs suspendus', count: 30, color: 0xb27dba },
  { id: 'extreme', name: 'Extrême', subtitle: 'Au-dessus des nuages', count: 30, color: 0x7970b6 },
];
export function isLevelUnlocked(id: string, progress: Record<string, { completed: boolean }>): boolean {
  const match = /^(easy|medium|hard|extreme)-(\d{2})$/.exec(id);
  if (!match) return false;
  const difficulty = match[1] as Difficulty, n = Number(match[2]);
  const chapter = chapters.find(c => c.id === difficulty)!;
  if (n < 1 || n > chapter.count) return false;
  if (progress[id]?.completed) return true;
  if (n > 1) return progress[`${difficulty}-${String(n - 1).padStart(2, '0')}`]?.completed === true;
  if (difficulty === 'easy') return true;
  // Keep the original unlock thresholds so existing players lose no access.
  const previous = difficulty === 'medium' ? 'easy' : difficulty === 'hard' ? 'medium' : 'hard';
  const threshold = difficulty === 'medium' ? 10 : difficulty === 'hard' ? 15 : 30;
  return Object.entries(progress).filter(([key, value]) => key.startsWith(`${previous}-`) && value.completed).length >= threshold;
}
