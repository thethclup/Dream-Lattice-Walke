import { create } from 'zustand';

export type ScreenState = 'TITLE' | 'GAME' | 'CODEX' | 'LEADERBOARD';

interface GameState {
  currentScreen: ScreenState;
  harmonyScore: number;
  deepestLattice: number;
  dreamFragments: number;
  stabilized: boolean; // True when puzzle is 'solved' for a level
  
  // Actions
  setScreen: (screen: ScreenState) => void;
  updateScore: (harmonyDelta: number) => void;
  updateDepth: (depth: number) => void;
  collectFragment: () => void;
  setStabilized: (val: boolean) => void;
  resetRun: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentScreen: 'TITLE',
  harmonyScore: 0,
  deepestLattice: 1,
  dreamFragments: 0,
  stabilized: false,

  setScreen: (screen) => set({ currentScreen: screen }),
  
  updateScore: (delta) => set((state) => ({ 
    harmonyScore: Math.max(0, state.harmonyScore + delta) 
  })),
  
  updateDepth: (depth) => set((state) => ({ 
    deepestLattice: Math.max(state.deepestLattice, depth) 
  })),
  
  collectFragment: () => set((state) => ({ 
    dreamFragments: state.dreamFragments + 1 
  })),

  setStabilized: (val) => set({ stabilized: val }),

  resetRun: () => set({
    harmonyScore: 0,
    deepestLattice: 1,
    stabilized: false,
    currentScreen: 'GAME'
  })
}));
