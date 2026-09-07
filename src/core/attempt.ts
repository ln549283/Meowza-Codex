export type AttemptStatus = 'playing' | 'won' | 'lost';

export interface AttemptState {
  errors: number;
  hintsUsed: number;
  continuationUsed: boolean;
  status: AttemptStatus;
}

export function createAttemptState(errors = 0, hintsUsed = 0): AttemptState {
  const safeErrors = Math.max(0, Math.min(3, Math.floor(errors)));
  return {
    errors: safeErrors,
    hintsUsed: Math.max(0, Math.floor(hintsUsed)),
    continuationUsed: false,
    status: safeErrors >= 3 ? 'lost' : 'playing',
  };
}

export function registerMistake(state: AttemptState): AttemptState {
  if (state.status !== 'playing') return state;
  const errors = Math.min(3, state.errors + 1);
  return { ...state, errors, status: errors >= 3 ? 'lost' : 'playing' };
}

export function registerHint(state: AttemptState): AttemptState {
  if (state.status !== 'playing') return state;
  return { ...state, hintsUsed: state.hintsUsed + 1 };
}

export function markAttemptWon(state: AttemptState): AttemptState {
  if (state.status !== 'playing') return state;
  return { ...state, status: 'won' };
}

export function resetAttempt(): AttemptState {
  return createAttemptState();
}
