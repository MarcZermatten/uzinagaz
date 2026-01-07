import { create } from 'zustand';
import type { Game, Console } from '../types';

interface GameState {
  games: Game[];
  consoles: Console[];
  currentGame: Game | null;
  isPlaying: boolean;
  setGames: (games: Game[]) => void;
  setConsoles: (consoles: Console[]) => void;
  launchGame: (game: Game) => void;
  exitGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  games: [],
  consoles: [],
  currentGame: null,
  isPlaying: false,

  setGames: (games) => set({ games }),
  setConsoles: (consoles) => set({ consoles }),

  launchGame: (game) => set({ currentGame: game, isPlaying: true }),
  exitGame: () => set({ currentGame: null, isPlaying: false }),
}));
