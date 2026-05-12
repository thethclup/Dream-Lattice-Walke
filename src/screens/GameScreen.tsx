import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import LatticeCanvas from '../components/LatticeCanvas';

export default function GameScreen() {
  const { harmonyScore, deepestLattice, setScreen, stabilized, setStabilized, updateDepth } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10"
    >
      <LatticeCanvas />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center pointer-events-none border-b border-white/5 bg-black/20 backdrop-blur-md">
         <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400/60">Deepest Lattice</span>
            <span className="text-2xl font-mono text-cyan-300">{deepestLattice} Layer{deepestLattice !== 1 ? 's' : ''}</span>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400/60">Harmony Score</span>
            <span className="text-2xl font-mono text-pink-400">{harmonyScore}</span>
         </div>
      </div>

       <div className="absolute bottom-6 left-6 pointer-events-auto">
          <button
            onClick={() => setScreen('TITLE')}
            className="px-6 py-2 border border-indigo-500/30 rounded-full bg-indigo-500/10 text-xs uppercase tracking-widest text-indigo-200 hover:bg-indigo-500/20 transition-all font-semibold"
          >
            Wake Up
          </button>
       </div>

      {/* Stabilization Complete Overlay */}
      {stabilized && (
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl"
         >
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
               <div className="text-left px-4">
                  <h3 className="text-indigo-200 uppercase tracking-[0.2em] text-xs font-bold mb-1">Lattice Stabilized</h3>
                  <p className="text-slate-400 text-[10px] tracking-widest font-light">Harmony recorded.</p>
               </div>
               <button
                  onClick={() => setScreen('LEADERBOARD')}
                  className="px-6 py-4 bg-white text-black rounded-xl transition-all shadow-lg text-xs uppercase tracking-widest font-bold"
               >
                  Record On-Chain
               </button>
               <button
                  onClick={() => {
                    setStabilized(false);
                    updateDepth(deepestLattice + 1);
                  }}
                  className="px-6 py-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-xl transition-all text-cyan-200 text-xs uppercase tracking-widest font-bold"
               >
                  Dive Deeper
               </button>
            </div>
         </motion.div>
      )}
    </motion.div>
  );
}
