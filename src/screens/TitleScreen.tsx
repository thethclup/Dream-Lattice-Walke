import { motion } from 'motion/react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useGameStore } from '../store/gameStore';

export default function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6"
    >
      {/* Decorative center geometric element */}
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 border border-indigo-400/20 rounded-full"
        />
        <motion.div
           animate={{ rotate: -360 }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute inset-4 border border-fuchsia-400/20 rounded-full"
        />
        <motion.div
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="w-16 h-16 bg-white/10 blur-xl rounded-full"
        />
        <div className="absolute w-8 h-8 rotate-45 border-2 border-indigo-300 pointer-events-none" />
      </div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase text-white/90 text-center mb-4 text-shadow-glow"
        style={{ textShadow: "0 0 20px rgba(165,180,252,0.3)" }}
      >
        Dream Lattice <br/>
        <span className="font-semibold text-indigo-300">Walker</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-slate-400 text-center max-w-sm mb-16 tracking-wide font-light"
      >
        Wander the infinite geometric structures of light and memory.
      </motion.p>

      <div className="flex flex-col gap-6 items-center w-full max-w-xs z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setScreen('GAME')}
          className="w-full py-4 px-6 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-xl uppercase tracking-widest text-xs font-bold text-cyan-200 backdrop-blur-sm transition-all"
        >
          Enter the Dream
        </motion.button>

        {!isConnected ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => connect({ connector: injected() })}
            className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs uppercase tracking-widest text-slate-300 transition-all font-semibold"
          >
            Connect Wallet
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 w-full"
          >
            <button
               onClick={() => setScreen('CODEX')}
               className="flex-1 py-4 px-2 border border-indigo-500/30 rounded-xl bg-indigo-500/10 text-[10px] uppercase tracking-[0.2em] text-indigo-200 hover:bg-indigo-500/20 transition-all font-semibold text-center"
            >
              Codex
            </button>
            <button
               onClick={() => setScreen('LEADERBOARD')}
               className="flex-1 py-4 px-2 border border-indigo-500/30 rounded-xl bg-indigo-500/10 text-[10px] uppercase tracking-[0.2em] text-indigo-200 hover:bg-indigo-500/20 transition-all font-semibold text-center"
            >
              Leaderboard
            </button>
          </motion.div>
        )}
      </div>

       <div className="absolute bottom-6 flex flex-col gap-2 items-center opacity-50 grayscale">
          <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400">Powered by ERC-8021 & 8004</div>
          <div className="flex gap-4">
             <div className="text-[9px] font-mono tracking-tighter text-slate-500">APP_ID: 691a548c669aee60603bdddd</div>
             <div className="text-[9px] font-mono tracking-tighter text-slate-500">BUILDER_CODE: bc_f7elc34o</div>
          </div>
       </div>
    </motion.div>
  );
}
