/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from 'motion/react';
import { Web3Provider } from './components/Web3Provider';
import { useGameStore } from './store/gameStore';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';
import { Sun } from 'lucide-react';
import { withAttribution } from './lib/erc8021/utils';

// Placeholders for screens
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import CodexScreen from './screens/CodexScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

function GlobalUI() {
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = async () => {
    try {
      // "0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7" is the GM contract
      // Calling with withAttribution from ERC-8021
      await withAttribution(async () => {
        // Just sending an empty transaction or generic GM call to the contract
        // The ERC-8021 implementation might append it into calldata, but for now we just log it and send empty data or "sayGM()" encoding
        // If the contract has a sayGM() function, the signature is 0x89cbe655.
        sendTransaction({
          to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
          data: '0x89cbe655', // Keccak256("sayGM()").slice(0,10)
        });
      }, "DREAM_LATTICE_GM");
    } catch (error) {
      console.error("GM Failed", error);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="absolute top-4 right-4 z-50">
      <button 
        onClick={sendGMTransaction}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
      >
        <Sun size={16} />
        Say GM
      </button>
    </div>
  );
}

function GameCoordinator() {
  const currentScreen = useGameStore((s) => s.currentScreen);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#05060f] text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <GlobalUI />

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

