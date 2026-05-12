import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';

export default function CodexScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const dreamFragments = useGameStore((s) => s.dreamFragments);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col p-6 z-10"
    >
      <div className="flex-1 w-full max-w-md mx-auto pt-24">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase text-indigo-200 mb-8 text-center text-shadow-glow" style={{ textShadow: "0 0 15px rgba(255,255,255,0.2)"}}>
            Fragment Codex
        </h2>
        
        <p className="text-slate-400 text-[10px] uppercase tracking-widest text-center mb-12 font-light">
           Fragments collected: <span className="text-cyan-300 font-mono text-base ml-2">{dreamFragments}</span>
        </p>

        <div className="grid grid-cols-2 gap-4">
           {/* Mock Fragments */}
           {[...Array(4)].map((_, i) => (
             <div key={i} className={`aspect-square rounded-2xl border p-4 flex flex-col justify-between transition-all ${dreamFragments > i ? 'bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 opacity-50 grayscale'}`}>
                <div className={`w-8 h-8 rounded-full border border-current ${dreamFragments > i ? 'text-cyan-400 opacity-100' : 'text-slate-500 opacity-50'} mb-4`} />
                <div className={`text-[10px] tracking-[0.2em] uppercase ${dreamFragments > i ? 'text-indigo-200' : 'text-slate-500'}`}>
                   {dreamFragments > i ? `Memory Echo ${i+1}` : 'Unknown'}
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
