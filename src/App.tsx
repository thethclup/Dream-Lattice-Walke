/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from 'motion/react';
import { Web3Provider } from './components/Web3Provider';
import { useGameStore } from './store/gameStore';

// Placeholders for screens
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import CodexScreen from './screens/CodexScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

function GameCoordinator() {
  const currentScreen = useGameStore((s) => s.currentScreen);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#05060f] text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <AnimatePresence mode="wait">
        {currentScreen === 'TITLE' && <TitleScreen key="title" />}
        {currentScreen === 'GAME' && <GameScreen key="game" />}
        {currentScreen === 'CODEX' && <CodexScreen key="codex" />}
        {currentScreen === 'LEADERBOARD' && <LeaderboardScreen key="leaderboard" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameCoordinator />
    </Web3Provider>
  );
}

