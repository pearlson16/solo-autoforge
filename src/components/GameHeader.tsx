import React, { useState } from 'react';
import type { GameState } from '../hooks/useAutoForge';
import { soundFx } from '../utils/audio';
import { Coins, Sparkles, TowerControl, Layers, Gem, Volume2, VolumeX, RotateCcw, Key, Cpu } from 'lucide-react';

interface GameHeaderProps {
  state: GameState;
  onReset?: () => void;
  onOpenShop?: () => void;
  onOpenDungeon?: () => void;
  onOpenTechTree?: () => void;
  onOpenRuneword?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  state,
  onReset,
  onOpenShop,
  onOpenDungeon,
  onOpenTechTree,
  onOpenRuneword,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to restart all stats from Era 1?')) {
      onReset?.();
    }
  };

  const goldRate = (state.forgeLevel * 1.5).toFixed(1);

  return (
    <header className="w-full max-w-4xl bg-zinc-900/90 backdrop-blur border border-zinc-800/90 p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <span className="text-base font-black text-amber-400">⚡</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-zinc-100 tracking-tight">SOLO AUTOFORGE</h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Civilization Blacksmith RPG</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Dungeon Portal Button */}
          {onOpenDungeon && (
            <button
              onClick={onOpenDungeon}
              className="flex items-center gap-1.5 bg-gradient-to-r from-sky-950/90 via-indigo-950/80 to-sky-950/90 hover:from-sky-900 hover:to-indigo-900 border border-sky-500/50 hover:border-sky-400 px-3 py-1.5 rounded-xl text-xs font-black text-sky-300 transition cursor-pointer shadow-lg shadow-sky-950/50 active:scale-95 group"
              title="Enter the Ancient Vault Dungeon"
            >
              <Key className="w-4 h-4 text-sky-400 group-hover:rotate-12 transition-transform" />
              <span className="font-extrabold">{state.dungeonKeys}</span>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] uppercase font-black px-1.5 py-0.5 rounded border border-sky-500/40">
                Dungeon
              </span>
            </button>
          )}

          {/* Tech Tree Button */}
          {onOpenTechTree && (
            <button
              onClick={onOpenTechTree}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-950/90 via-fuchsia-950/80 to-purple-950/90 hover:from-purple-900 hover:to-fuchsia-900 border border-purple-500/50 hover:border-purple-400 px-3 py-1.5 rounded-xl text-xs font-black text-purple-300 transition cursor-pointer shadow-lg shadow-purple-950/50 active:scale-95 group"
              title="Open Chrono Tech Matrix"
            >
              <Cpu className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="font-extrabold">{state.techCores}</span>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] uppercase font-black px-1.5 py-0.5 rounded border border-purple-500/40">
                Tech
              </span>
            </button>
          )}

          {/* Runewords Button */}
          {onOpenRuneword && (
            <button
              onClick={onOpenRuneword}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-amber-950/90 hover:from-amber-900 hover:to-orange-900 border border-amber-500/50 hover:border-amber-400 px-3 py-1.5 rounded-xl text-xs font-black text-amber-300 transition cursor-pointer shadow-lg shadow-amber-950/50 active:scale-95 group"
              title="Open Elemental Runeword Matrix"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-black px-1.5 py-0.5 rounded border border-amber-500/40">
                Runewords
              </span>
            </button>
          )}

          {/* Ruby Shop Button & Counter */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-950/90 via-pink-950/80 to-rose-950/90 hover:from-rose-900 hover:to-pink-900 border border-rose-500/50 hover:border-rose-400 px-3 py-1.5 rounded-xl text-xs font-black text-rose-300 transition cursor-pointer shadow-lg shadow-rose-950/50 active:scale-95 group"
            title="Open Ruby Merchant Bazaar"
          >
            <Gem className="w-4 h-4 text-rose-400 fill-rose-400 group-hover:scale-110 transition-transform" />
            <span className="font-extrabold">{state.gems}</span>
            <span className="bg-rose-500/20 text-rose-300 text-[10px] uppercase font-black px-1.5 py-0.5 rounded border border-rose-500/40">
              Shop
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-300 transition cursor-pointer text-xs flex items-center gap-1.5"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-xs font-semibold">SFX On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-zinc-500" />
                <span className="hidden sm:inline text-xs font-semibold text-zinc-500">Muted</span>
              </>
            )}
          </button>

          {/* Reset / Restart Game Button */}
          {onReset && (
            <button
              onClick={handleResetClick}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-rose-950/60 hover:border-rose-700/60 border border-zinc-700/60 text-zinc-400 hover:text-rose-300 transition cursor-pointer text-xs flex items-center gap-1.5"
              title="Restart game and reset all stats"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Resource Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Era */}
        <div className="bg-zinc-950/80 border border-amber-500/20 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider block">Civilization Era</span>
            <p className="text-base sm:text-lg font-black text-amber-400">Era {state.era}</p>
          </div>
        </div>

        {/* Gold */}
        <div className="bg-zinc-950/80 border border-yellow-500/20 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">Gold</span>
              <span className="text-[9px] font-bold text-yellow-500/80">+{goldRate}/s</span>
            </div>
            <p className="text-base sm:text-lg font-black text-yellow-400">{state.gold.toLocaleString()}</p>
          </div>
        </div>

        {/* Scrap */}
        <div className="bg-zinc-950/80 border border-teal-500/20 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider block">Scrap</span>
            <p className="text-base sm:text-lg font-black text-teal-400">{state.scrap.toLocaleString()}</p>
          </div>
        </div>

        {/* Floor */}
        <div className="bg-zinc-950/80 border border-indigo-500/20 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <TowerControl className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider block">Tower Floor</span>
            <p className="text-base sm:text-lg font-black text-indigo-400">Floor {state.currentFloor}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

