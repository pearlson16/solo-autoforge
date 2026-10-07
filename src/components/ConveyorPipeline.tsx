import { Cpu, Zap, ArrowRight, Sparkles, Filter, RefreshCw, Flame } from 'lucide-react';
import type { AutoDisenchanterRules } from '../types/automation';

interface ConveyorPipelineProps {
  autoEquip: boolean;
  onToggleAutoEquip: () => void;
  automationRules: AutoDisenchanterRules;
  onChangeRules: (updated: Partial<AutoDisenchanterRules>) => void;
}

export function ConveyorPipeline({
  autoEquip,
  onToggleAutoEquip,
  automationRules,
  onChangeRules,
}: ConveyorPipelineProps) {
  return (
    <div className="relative bg-stone-900/90 border border-amber-900/50 rounded-xl p-4 space-y-4 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Background Pipeline Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              Automated Forge Pipeline
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                AUTO-ACTIVE
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Conveyor sorting, smart disenchanting & auto-fusing engine
            </p>
          </div>
        </div>

        {/* Master Auto-Equip Switch */}
        <button
          onClick={onToggleAutoEquip}
          className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all shadow-md ${
            autoEquip
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {autoEquip ? 'Auto-Equip ON' : 'Auto-Equip OFF'}
        </button>
      </div>

      {/* Animated Conveyor Belt Graphic */}
      <div className="relative bg-stone-950 border border-stone-800 rounded-lg p-3 overflow-hidden">
        <div className="flex items-center justify-between gap-2 text-xs font-mono text-stone-400 mb-2">
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Furnace Ore Input
          </span>
          <ArrowRight className="w-4 h-4 text-stone-600 animate-bounce" />
          <span className="flex items-center gap-1 text-purple-400 font-semibold">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> Auto-Disenchanter
          </span>
          <ArrowRight className="w-4 h-4 text-stone-600 animate-bounce" />
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> Auto-Equip / Fuse
          </span>
        </div>

        {/* Conveyor Belt Track */}
        <div className="h-10 bg-stone-900 rounded border border-amber-950 relative flex items-center px-4 overflow-hidden">
          {/* Animated Track Lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 10px, transparent 10px, transparent 20px)',
              backgroundSize: '40px 40px',
              animation: 'conveyorMove 2s linear infinite',
            }}
          />

          {/* Animated Ore / Gear Items on Track */}
          <div className="relative w-full flex justify-between items-center z-10">
            <div className="flex items-center gap-1 bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-700/60 text-[11px] animate-pulse">
              <span>Raw Ingot</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded border border-purple-700/60 text-[11px] animate-pulse">
              <span>Magic Powder</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60 text-[11px] animate-pulse">
              <span>Mythic Essence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Disenchanter & Auto-Fuse Rule Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Disenchanter Rules */}
        <div className="bg-stone-950/70 border border-stone-800 rounded-lg p-3 space-y-2">
          <div className="font-semibold text-stone-200 flex items-center justify-between border-b border-stone-800 pb-1">
            <span>Auto-Scrap Rules</span>
            <Filter className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
            <input
              type="checkbox"
              checked={automationRules.autoScrapCommon}
              onChange={(e) => onChangeRules({ autoScrapCommon: e.target.checked })}
              className="rounded accent-amber-500 bg-stone-900 border-stone-700"
            />
            <span>Auto-scrap Common items</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
            <input
              type="checkbox"
              checked={automationRules.autoScrapRare}
              onChange={(e) => onChangeRules({ autoScrapRare: e.target.checked })}
              className="rounded accent-amber-500 bg-stone-900 border-stone-700"
            />
            <span>Auto-scrap Rare items</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
            <input
              type="checkbox"
              checked={automationRules.autoScrapEpic}
              onChange={(e) => onChangeRules({ autoScrapEpic: e.target.checked })}
              className="rounded accent-amber-500 bg-stone-900 border-stone-700"
            />
            <span>Auto-scrap Epic items</span>
          </label>
        </div>

        {/* Smart Fusion & Stat Filter Rules */}
        <div className="bg-stone-950/70 border border-stone-800 rounded-lg p-3 space-y-2">
          <div className="font-semibold text-stone-200 flex items-center justify-between border-b border-stone-800 pb-1">
            <span>Smart Fusion Engine</span>
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
            <input
              type="checkbox"
              checked={automationRules.autoFuseIdentical}
              onChange={(e) => onChangeRules({ autoFuseIdentical: e.target.checked })}
              className="rounded accent-indigo-500 bg-stone-900 border-stone-700"
            />
            <span>Auto-fuse 3 duplicate items $\rightarrow$ 1 Higher Rarity</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
            <input
              type="checkbox"
              checked={automationRules.autoScrapIfStatLower}
              onChange={(e) => onChangeRules({ autoScrapIfStatLower: e.target.checked })}
              className="rounded accent-indigo-500 bg-stone-900 border-stone-700"
            />
            <span>Auto-scrap if overall stats lower than equipped</span>
          </label>
        </div>
      </div>

      <style>{`
        @keyframes conveyorMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
      `}</style>
    </div>
  );
}
