import React from 'react';
import type { GameState } from '../hooks/useAutoForge';
import { getCivilizationProbabilities } from '../hooks/useAutoForge';
import {
  X,
  Axe,
  Sparkles,
  Shield,
  Crown,
  Sword,
  Feather,
  Cog,
  Crosshair,
  Cpu,
  Globe,
  Coins,
  Gem,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ForgeUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onUpgrade: () => void;
  upgradeCost: { gold: number; scrap: number };
}

export const ForgeUpgradeModal: React.FC<ForgeUpgradeModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpgrade,
  upgradeCost,
}) => {
  if (!isOpen) return null;

  const currentOdds = getCivilizationProbabilities(state.forgeLevel);
  const nextOdds = getCivilizationProbabilities(state.forgeLevel + 1);

  const canAffordGold = state.gold >= upgradeCost.gold;
  const canAffordScrap = state.scrap >= upgradeCost.scrap;
  const canAfford = canAffordGold && canAffordScrap;

  const getCivIcon = (iconName: string, color: string) => {
    const props = { className: 'w-4 h-4', style: { color } };
    switch (iconName) {
      case 'Axe':
        return <Axe {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Shield':
        return <Shield {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'Sword':
        return <Sword {...props} />;
      case 'Feather':
        return <Feather {...props} />;
      case 'Cog':
        return <Cog {...props} />;
      case 'Crosshair':
        return <Crosshair {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Globe':
        return <Globe {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  // 3-step segmented progress indicator (e.g. within current tier bracket)
  const segmentStep = ((state.forgeLevel - 1) % 3) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-stone-100 dark:bg-zinc-900 border-4 border-amber-900/30 dark:border-zinc-700 rounded-3xl shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 flex flex-col max-h-[92vh]">
        {/* Top Header Tab */}
        <div className="bg-amber-100 dark:bg-zinc-800/90 px-4 pt-3 pb-2 text-center relative border-b border-amber-200 dark:border-zinc-700/80">
          <h2 className="text-xl sm:text-2xl font-black tracking-wide text-stone-700 dark:text-zinc-100 uppercase">
            Forge Upgrade
          </h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Tracker in Modal */}
        <div className="p-3 bg-stone-200/70 dark:bg-zinc-950/60 border-b border-stone-300 dark:border-zinc-800 flex justify-center gap-2 sm:gap-3 flex-wrap">
          {/* Gems */}
          <div className="flex items-center gap-1.5 bg-stone-800/80 text-white px-3 py-1 rounded-full border border-stone-600 shadow-inner text-xs">
            <Gem className="w-3.5 h-3.5 text-fuchsia-400 fill-fuchsia-400" />
            <span className="font-black tracking-wide">{state.gems}</span>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-1.5 bg-stone-800/80 text-white px-3 py-1 rounded-full border border-stone-600 shadow-inner text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-black tracking-wide">{formatNumber(state.gold)}</span>
          </div>

          {/* Scrap */}
          <div className="flex items-center gap-1.5 bg-stone-800/80 text-white px-3 py-1 rounded-full border border-stone-600 shadow-inner text-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
            <span className="font-black tracking-wide">{formatNumber(state.scrap)}</span>
          </div>
        </div>

        {/* Probabilities Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Table Header with Level Comparison */}
          <div className="flex items-center justify-between font-bold text-stone-600 dark:text-zinc-400 text-xs sm:text-sm px-1">
            <span className="tracking-wide">Probability of forging</span>
            <div className="flex items-center gap-1.5 text-stone-800 dark:text-zinc-200 font-extrabold bg-stone-200 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
              <span>Level {state.forgeLevel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-500 dark:text-amber-400">Level {state.forgeLevel + 1}</span>
            </div>
          </div>

          {/* Civilization Rows */}
          <div className="space-y-1.5">
            {currentOdds.map((curr, idx) => {
              const next = nextOdds[idx];
              const civ = curr.civilization;
              const hasOdds = curr.percentage > 0 || next.percentage > 0;
              const isIncreased = next.percentage > curr.percentage;

              return (
                <div
                  key={civ.id}
                  className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all ${
                    hasOdds
                      ? 'bg-white dark:bg-zinc-800/70 border-stone-200 dark:border-zinc-700/80 shadow-sm'
                      : 'bg-stone-100/50 dark:bg-zinc-900/40 border-stone-200/50 dark:border-zinc-800/50 opacity-45'
                  }`}
                >
                  {/* Civilization Name & Icon */}
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-[120px]">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border shadow-sm shrink-0"
                      style={{
                        backgroundColor: `${civ.color}20`,
                        borderColor: `${civ.color}60`,
                      }}
                    >
                      {getCivIcon(civ.iconName, civ.color)}
                    </div>
                    <div>
                      <span className="font-black text-xs sm:text-sm block" style={{ color: civ.color }}>
                        T{civ.tier} · {civ.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold">Tier {civ.tier}</span>
                    </div>
                  </div>

                  {/* Chances: Current -> Next */}
                  <div className="flex items-center gap-3 text-right font-black text-xs sm:text-sm">
                    {/* Current % */}
                    <span className="min-w-[45px] text-stone-800 dark:text-zinc-100 font-bold">
                      {curr.percentage}%
                    </span>

                    {/* Next % */}
                    <div
                      className={`min-w-[50px] px-2 py-0.5 rounded-md text-xs font-black flex items-center justify-end gap-0.5 ${
                        isIncreased
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : next.percentage < curr.percentage
                          ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400'
                          : 'bg-stone-200/60 dark:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isIncreased && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                      <span>{next.percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Upgrade Action Panel */}
        <div className="p-4 bg-stone-200/90 dark:bg-zinc-950 border-t border-stone-300 dark:border-zinc-800 text-center space-y-3">
          <p className="text-xs font-medium text-stone-600 dark:text-zinc-400">
            Upgrade your forge to forge equipment from more advanced civilizations.
          </p>

          {/* 3-segment progress indicator bar */}
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-3.5 rounded-full border-2 border-stone-400 dark:border-zinc-700 overflow-hidden transition-all duration-300 ${
                  segmentStep >= step
                    ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                    : 'bg-stone-300 dark:bg-zinc-800'
                }`}
              />
            ))}
          </div>

          {/* Big Upgrade Button */}
          <button
            onClick={onUpgrade}
            disabled={!canAfford}
            className="w-full py-3.5 bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 hover:from-sky-300 hover:to-sky-500 active:scale-[0.98] disabled:from-stone-400 disabled:to-stone-500 dark:disabled:from-zinc-800 dark:disabled:to-zinc-800 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg border-2 border-sky-300/60 disabled:border-zinc-700 transition cursor-pointer disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1"
          >
            <span className="drop-shadow-sm tracking-wide">Upgrade Forge</span>
            <div className="flex items-center gap-2 text-xs font-black">
              <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full ${canAffordGold ? 'bg-sky-800/50 text-yellow-300' : 'bg-rose-950/70 text-rose-300'}`}>
                <Coins className="w-3.5 h-3.5 fill-current" />
                <span>{formatNumber(upgradeCost.gold)} Gold</span>
              </span>
              <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full ${canAffordScrap ? 'bg-sky-800/50 text-teal-300' : 'bg-rose-950/70 text-rose-300'}`}>
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{formatNumber(upgradeCost.scrap)} Scrap</span>
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
