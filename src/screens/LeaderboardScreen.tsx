import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { useAccount, useSignMessage, useSendTransaction } from 'wagmi';
import { parseEther, toHex } from 'viem';
import { generateAttributionPayload } from '../lib/erc8021/utils';
import confetti from 'canvas-confetti';
import { useState } from 'react';

export default function LeaderboardScreen() {
  const { harmonyScore, deepestLattice, setScreen, resetRun } = useGameStore();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { sendTransactionAsync } = useSendTransaction();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleRecordRun = async () => {
    if (!isConnected) return;
    try {
      const message = `I, ${address}, have reached Layer ${deepestLattice} with a Harmony Score of ${harmonyScore} in the Dream Lattice.`;
      await signMessageAsync({ account: address, message });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#818cf8', '#c084fc', '#e879f9']
      });
      // Optionally reset the run so they can play again fresh
      resetRun();
      setScreen('TITLE');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSayGM = async () => {
    if (!isConnected || !address) return;
    try {
      const attribution = generateAttributionPayload('GM_INTERACTION');
      // Sending a 0 value transaction to self with hex data (basic attribution mock)
      // In a real ERC-8021, you'd call a specific contract method
      const hash = await sendTransactionAsync({
        to: address,
        value: parseEther('0'),
        data: toHex(`GM | builder:${attribution.builderCode}`)
      });
      setTxHash(hash);
      confetti({
        particleCount: 50,
        spread: 40,
        colors: ['#4ade80']
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col p-6 z-10"
    >
      <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto pt-24 flex flex-col gap-8">
        
        <div className="text-center">
            <h2 className="text-2xl font-light tracking-[0.2em] uppercase text-indigo-200 mb-2">Greatest Walkers</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400/60 font-light">Base Mainnet Hybrid Leaderboard</p>
        </div>

        {isConnected ? (
           <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Your Current Run</span>
                    <span className="text-lg text-cyan-300 font-mono">Layer {deepestLattice}</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Harmony</span>
                    <span className="text-lg text-pink-400 font-mono">{harmonyScore}</span>
                 </div>
              </div>

              <button
                 onClick={handleRecordRun}
                 className="w-full py-4 px-6 bg-white text-black rounded-xl transition-all shadow-lg text-xs uppercase tracking-widest font-bold mt-2"
              >
                 Record Dream Walk via SIWE
              </button>

              <div className="pt-4 mt-2 border-t border-white/5">
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">On-Chain Interaction</p>
                 <button
                    onClick={handleSayGM}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="w-full group py-4 px-6 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-xl transition-all flex items-center justify-center gap-2"
                 >
                    <span className="text-xs uppercase tracking-widest font-bold text-cyan-200">
                       {isHovering ? "Send 0 ETH + Attribution Data" : "Say GM on Base"}
                    </span>
                 </button>
                 {txHash && (
                    <p className="text-[9px] text-green-400/80 font-mono mt-2 break-all text-center">
                       Tx: {txHash}
                    </p>
                 )}
              </div>
           </div>
        ) : (
           <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-slate-400 text-sm">Connect wallet to view the global lattice resonance and submit your journey.</p>
           </div>
        )}

        {/* Dummy Leaderboard Data */}
        <div className="flex flex-col gap-3 pb-24">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-indigo-300/80 mb-2">Global Resonance</h3>
            {[
               { id: 1, address: 'aera.eth', depth: 42, score: 9400 },
               { id: 2, address: 'nomad.base', depth: 38, score: 8120 },
               { id: 3, address: 'void_ptr', depth: 35, score: 7900 },
            ].map((walker, idx) => (
               <div key={walker.id} className={`flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl opacity-${idx === 0 ? '90' : idx === 1 ? '70' : '50'}`}>
                  <div className="flex items-center gap-4">
                     <span className="text-cyan-400 font-mono text-sm">{walker.score}</span>
                     <span className="text-slate-400 font-mono text-xs">{walker.id}. {walker.address}</span>
                  </div>
                  <div className="text-right">
                     <div className="text-indigo-400/60 text-[10px] uppercase tracking-wider">L{walker.depth}</div>
                  </div>
               </div>
            ))}
        </div>

      </div>

       <div className="absolute top-6 left-6 pointer-events-auto">
          <button
            onClick={() => setScreen('TITLE')}
            className="px-6 py-2 border border-indigo-500/30 rounded-full bg-indigo-500/10 text-xs uppercase tracking-widest text-indigo-200 hover:bg-indigo-500/20 transition-all font-semibold"
          >
            Return
          </button>
       </div>
    </motion.div>
  );
}
