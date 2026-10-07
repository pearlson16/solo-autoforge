import React, { useState, useEffect, useRef } from 'react';
import type { GameState, ForgeResult, Equipment } from '../hooks/useAutoForge';
import { getCivilizationProbabilities, CIVILIZATIONS } from '../hooks/useAutoForge';
import { soundFx } from '../utils/audio';
import {
  Hammer,
  Flame,
  ArrowUpCircle,
  CheckCircle2,
  RefreshCw,
  BarChart2,
  ToggleLeft,
  ToggleRight,
  Zap,
  Layers,
  Lock,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { RARITY_CONFIGS } from './RarityTheme';
import { ForgeUpgradeModal } from './ForgeUpgradeModal';
import { ItemComparisonModal } from './ItemComparisonModal';
import type { ComparisonPair } from './ItemComparisonModal';
import { GearItemVisual } from './GearVisuals';
import { ForgeEmberCanvas } from './ForgeEmberCanvas';
import { ConveyorPipeline } from './ConveyorPipeline';
import type { AutoDisenchanterRules } from '../types/automation';

interface Spark {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
}

interface ForgeWorkshopProps {
  state: GameState;
  onForge: (options?: { count?: number; forceManualUpgrade?: boolean; autoScrapNonUpgrade?: boolean }) => ForgeResult | null;
  onEquip: (item: Equipment) => void;
  onEquipMultiple?: (items: Equipment[]) => void;
  onScrap: (item: Equipment) => void;
  onScrapMultiple?: (items: Equipment[]) => void;
  onToggleAutoEquip: () => void;
  onUpgrade: () => void;
  getUpgradeCost: (level: number) => { gold: number; scrap: number };
  onOpenShop?: () => void;
  onOpenRuneword?: () => void;
  onChangeAutomationRules?: (updated: Partial<AutoDisenchanterRules>) => void;
}

export const ForgeWorkshop: React.FC<ForgeWorkshopProps> = ({
  state,
  onForge,
  onEquip,
  onEquipMultiple,
  onScrap,
  onScrapMultiple,
  onToggleAutoEquip,
  onUpgrade,
  getUpgradeCost,
  onOpenShop,
  onOpenRuneword,
  onChangeAutomationRules,
}) => {
  const [isStriking, setIsStriking] = useState(false);
  const [isAutoForging, setIsAutoForging] = useState(false);
  const [autoForgedCount, setAutoForgedCount] = useState(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [lastForged, setLastForged] = useState<ForgeResult | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [forgedChoicePairs, setForgedChoicePairs] = useState<ComparisonPair[] | null>(null);
  const [batchSize, setBatchSize] = useState(1);
  const [showPipeline, setShowPipeline] = useState(false);
  const [sparkTriggerCount, setSparkTriggerCount] = useState(0);

  const maxBatch = Math.max(1, Math.min(5, state.multiForgeLevel || 1));
  const activeBatch = Math.min(batchSize, maxBatch);

  const autoForgeActiveRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;
  const onForgeRef = useRef(onForge);
  onForgeRef.current = onForge;
  const activeBatchRef = useRef(activeBatch);
  activeBatchRef.current = activeBatch;

  const singleForgeCost = Math.max(10, state.forgeLevel * 15);
  const batchCost = singleForgeCost * activeBatch;
  const upgradeCost = getUpgradeCost(state.forgeLevel);
  const canForge = state.gold >= batchCost;
  const canUpgrade = state.gold >= upgradeCost.gold && state.scrap >= upgradeCost.scrap;

  useEffect(() => {
    return () => {
      autoForgeActiveRef.current = false;
    };
  }, []);

  const triggerSparkAnimation = (count = 1, rarity?: string) => {
    setIsStriking(true);
    soundFx.playHammer(rarity);
    setSparkTriggerCount((c) => c + 1);

    const sparkCount = Math.min(30, 8 + count * 4);
    const newSparks: Spark[] = Array.from({ length: sparkCount }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() * 20 - 10),
      y: 60 + (Math.random() * 10 - 5),
      tx: (Math.random() - 0.5) * (100 + count * 15),
      ty: -Math.random() * (70 + count * 10) - 20,
      color: Math.random() > 0.35 ? '#f59e0b' : '#ef4444',
    }));
    setSparks(newSparks);

    setTimeout(() => setIsStriking(false), 200);
    setTimeout(() => setSparks([]), 550);
  };

  const handleHammerStrike = () => {
    if (!canForge || isAutoForging) return;

    const result = onForge({ count: activeBatch });
    const topRarity = result?.item?.rarity || result?.items?.[0]?.item?.rarity;
    triggerSparkAnimation(activeBatch, topRarity);

    if (result) {
      setLastForged(result);

      if (state.autoEquip) {
        if (result.isUpgrade) {
          soundFx.playEquip(topRarity);
        }
      } else {
        // Collect all forged items into a choices list so user can choose between different types (e.g. boots and helmet)
        const pairs: ComparisonPair[] = [];
        if (result.items && result.items.length > 0) {
          result.items.forEach((fi) => {
            pairs.push({ newItem: fi.item, equippedItem: fi.currentEquipped });
          });
        } else {
          pairs.push({ newItem: result.item, equippedItem: result.currentEquipped });
        }

        if (pairs.length > 0) {
          setForgedChoicePairs(pairs);
        }
      }
    }
  };

  const toggleAutoForge = () => {
    if (isAutoForging) {
      setIsAutoForging(false);
      autoForgeActiveRef.current = false;
      return;
    }

    if (!canForge) return;

    setIsAutoForging(true);
    autoForgeActiveRef.current = true;
    setAutoForgedCount(0);
    runAutoForgeLoop();
  };

  const runAutoForgeLoop = async () => {
    while (autoForgeActiveRef.current) {
      const curBatch = activeBatchRef.current;
      const curCost = Math.max(10, stateRef.current.forgeLevel * 15) * curBatch;
      if (stateRef.current.gold < curCost) {
        setIsAutoForging(false);
        autoForgeActiveRef.current = false;
        break;
      }

      // Force manual on upgrade so it stops and presents options for the user to choose
      const result = onForgeRef.current({
        count: curBatch,
        forceManualUpgrade: true,
        autoScrapNonUpgrade: true,
      });

      const topRarity = result?.item?.rarity || result?.items?.[0]?.item?.rarity;
      triggerSparkAnimation(curBatch, topRarity);

      if (result) {
        setLastForged(result);
        setAutoForgedCount((c) => c + curBatch);

        if (result.isUpgrade) {
          // Stop auto-forge on upgrade found!
          setIsAutoForging(false);
          autoForgeActiveRef.current = false;
          soundFx.playUpgrade();

          const pairs: ComparisonPair[] = [];
          if (result.items && result.items.length > 0) {
            // Present upgrades (or all items) for choice
            const upgrades = result.items.filter((fi) => fi.isUpgrade);
            const itemsToPresent = upgrades.length > 0 ? upgrades : result.items;
            itemsToPresent.forEach((fi) => {
              pairs.push({ newItem: fi.item, equippedItem: fi.currentEquipped });
            });
          } else {
            pairs.push({ newItem: result.item, equippedItem: result.currentEquipped });
          }

          if (pairs.length > 0) {
            setForgedChoicePairs(pairs);
          }
          break;
        }
      } else {
        setIsAutoForging(false);
        autoForgeActiveRef.current = false;
        break;
      }

      // Interval delay between strikes
      await new Promise((r) => setTimeout(r, 280));
    }
  };

  const handleManualEquip = (item: Equipment) => {
    soundFx.playEquip(item.rarity);
    onEquip(item);
  };

  const handleManualScrap = (item: Equipment) => {
    soundFx.playSalvage();
    onScrap(item);
  };

  const handleEquipAll = (itemsToEquip: Equipment[]) => {
    soundFx.playEquip();
    if (onEquipMultiple) {
      onEquipMultiple(itemsToEquip);
    } else {
      itemsToEquip.forEach((it) => onEquip(it));
    }
  };

  const handleScrapAll = (itemsToScrap: Equipment[]) => {
    soundFx.playSalvage();
    if (onScrapMultiple) {
      onScrapMultiple(itemsToScrap);
    } else {
      itemsToScrap.forEach((it) => onScrap(it));
    }
  };

  const handleUpgrade = () => {
    if (!canUpgrade) return;
    soundFx.playForgeLevelUp();
    onUpgrade();
  };

  const currentOdds = getCivilizationProbabilities(state.forgeLevel).filter(
    (o) => o.percentage > 0
  );

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
        {/* Top Banner */}
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-zinc-100">Molten Workshop</h2>
                <p className="text-xs text-zinc-400">Craft equipment & upgrade your civilization forge</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Pipeline Engine Toggle */}
              <button
                onClick={() => setShowPipeline((prev) => !prev)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                  showPipeline
                    ? 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                }`}
                title="Toggle Automated Conveyor & Disenchanter Pipeline"
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Pipeline</span>
              </button>

              {/* Runeword Forge Button */}
              {onOpenRuneword && (
                <button
                  onClick={onOpenRuneword}
                  className="px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border bg-amber-950/80 border-amber-500/50 text-amber-300 hover:border-amber-400 shadow-sm"
                  title="Open Runeword Matrix & Gem Socketing"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Runewords</span>
                </button>
              )}

              {/* Auto-Equip Toggle */}
              <button
                onClick={onToggleAutoEquip}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                  state.autoEquip
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
                }`}
                title="Toggle Auto-Equip: Automatically equip upgrades or prompt for manual choice"
              >
                {state.autoEquip ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Auto-Equip: ON</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-zinc-500" />
                    <span>Auto-Equip: OFF</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 px-3 py-1 rounded-full text-xs font-black shadow-md transition cursor-pointer active:scale-95"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Forge Lv.{state.forgeLevel}</span>
              </button>
            </div>
          </div>

          {/* Optional Collapsible Conveyor Pipeline */}
          {showPipeline && (
            <div className="mb-3 animate-fade-in">
              <ConveyorPipeline
                autoEquip={state.autoEquip}
                onToggleAutoEquip={onToggleAutoEquip}
                automationRules={state.automationRules || {
                  autoScrapCommon: true,
                  autoScrapRare: false,
                  autoScrapEpic: false,
                  autoScrapIfStatLower: false,
                  autoFuseIdentical: true,
                  conveyorSpeedLevel: 1,
                }}
                onChangeRules={(updated) => onChangeAutomationRules?.(updated)}
              />
            </div>
          )}

          {/* Forge & Anvil Visual Display Stage */}
          <div className="relative w-full h-44 sm:h-48 bg-gradient-to-b from-stone-950 via-zinc-900 to-black rounded-xl border border-zinc-800/90 flex flex-col items-center justify-center overflow-hidden mb-3 select-none shadow-2xl">
            {/* Interactive Particle & Ember Canvas */}
            <ForgeEmberCanvas
              isForging={isStriking || isAutoForging}
              activeRarity={lastForged?.item?.rarity}
              triggerSparkCount={sparkTriggerCount}
            />
            {/* Stone Furnace Arch & Hearth Silhouette */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Brick masonry subtle pattern */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #f59e0b22 1px, transparent 1px), linear-gradient(#f59e0b22 1px, transparent 1px)',
                  backgroundSize: '24px 12px',
                }}
              />
              {/* Central Molten Crucible Hearth Arch */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 rounded-t-full bg-gradient-to-t from-orange-600/30 via-amber-500/15 to-transparent blur-md" />
              {/* Molten Magma Coals Glow */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-red-600/40 via-amber-500/30 to-transparent animate-pulse" />
            </div>

            {/* Ambient Rising Embers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <span className="absolute bottom-2 left-1/4 w-1 h-1 rounded-full bg-amber-400 opacity-70 animate-[floatEmbers_3s_ease-out_infinite] [--drift:10px]" />
              <span className="absolute bottom-4 left-1/3 w-1.5 h-1.5 rounded-full bg-orange-500 opacity-60 animate-[floatEmbers_4s_ease-out_infinite_1s] [--drift:-12px]" />
              <span className="absolute bottom-1 right-1/3 w-1 h-1 rounded-full bg-yellow-300 opacity-80 animate-[floatEmbers_3.5s_ease-out_infinite_1.5s] [--drift:15px]" />
              <span className="absolute bottom-3 right-1/4 w-1 h-1 rounded-full bg-red-400 opacity-75 animate-[floatEmbers_4.5s_ease-out_infinite_2s] [--drift:-8px]" />
            </div>

            {/* Spark Particles on Strike */}
            {sparks.map((s) => (
              <span
                key={s.id}
                className="absolute w-1.5 h-1.5 rounded-full animate-spark pointer-events-none z-30"
                style={
                  {
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    backgroundColor: s.color,
                    boxShadow: `0 0 8px ${s.color}`,
                    '--tx': `${s.tx}px`,
                    '--ty': `${s.ty}px`,
                  } as React.CSSProperties
                }
              />
            ))}

            {/* Hammer SVG */}
            <div
              className={`absolute top-3 transition-transform duration-150 origin-bottom-right z-20 ${
                isStriking ? 'animate-hammer' : 'transform -rotate-12'
              }`}
            >
              <div className="relative">
                <Hammer className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              </div>
            </div>

            {/* Anvil SVG with Base Platform */}
            <div
              className={`relative z-10 transition-transform ${
                isStriking ? 'animate-anvil-hit scale-105' : ''
              }`}
            >
              <svg
                viewBox="0 0 100 60"
                className="w-28 sm:w-32 h-18 fill-zinc-700 stroke-zinc-900 stroke-2 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
              >
                {/* Anvil Base */}
                <path
                  d="M 15 50 L 85 50 L 75 42 L 60 35 L 75 25 L 95 25 Q 98 15 80 15 L 20 15 Q 5 15 5 25 L 30 25 L 40 35 L 25 42 Z"
                  fill="url(#anvilGradient)"
                />
                {/* Glowing hot iron bar on top */}
                <rect
                  x="30"
                  y="11"
                  width="38"
                  height="6"
                  rx="2"
                  fill="#f59e0b"
                  className="animate-pulse shadow-[0_0_15px_#f59e0b]"
                />
                <defs>
                  <linearGradient id="anvilGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#52525b" />
                    <stop offset="60%" stopColor="#27272a" />
                    <stop offset="100%" stopColor="#18181b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="absolute bottom-2 text-center z-10">
              <span className="text-[10px] font-bold text-amber-400/90 tracking-wider uppercase drop-shadow flex items-center gap-1">
                {isAutoForging ? (
                  <>
                    <Zap className="w-3 h-3 text-amber-300 animate-pulse" />
                    <span>Auto-Forging ({activeBatch}x)... ({autoForgedCount} Crafted)</span>
                  </>
                ) : isStriking ? (
                  `⚡ Hammering Steel! (${activeBatch}x Batch)`
                ) : (
                  `Ready to Craft (${activeBatch}x Batch)`
                )}
              </span>
            </div>
          </div>

          {/* Civilization Probabilities Bar Mini Preview */}
          <div
            onClick={() => setIsUpgradeModalOpen(true)}
            className="mb-3 p-2 bg-zinc-950/70 hover:bg-zinc-950 border border-zinc-800 rounded-xl cursor-pointer transition group"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 mb-1 px-1">
              <span className="group-hover:text-amber-300 transition">Forging Probabilities</span>
              <span className="text-amber-400 underline text-[10px]">View Full Odds</span>
            </div>
            {/* Multi-color probability segment bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-zinc-800">
              {currentOdds.map((odd) => (
                <div
                  key={odd.civilization.id}
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${odd.percentage}%`,
                    backgroundColor: odd.civilization.color,
                  }}
                  title={`T${odd.civilization.tier} ${odd.civilization.name}: ${odd.percentage}%`}
                />
              ))}
            </div>
            {/* Badges preview */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {currentOdds.slice(0, 4).map((odd) => (
                <span
                  key={odd.civilization.id}
                  className="text-[9px] font-black px-1.5 py-0.5 rounded border flex items-center gap-1"
                  style={{
                    color: odd.civilization.color,
                    borderColor: `${odd.civilization.color}40`,
                    backgroundColor: `${odd.civilization.color}15`,
                  }}
                >
                  T{odd.civilization.tier} {odd.civilization.name}: {odd.percentage}%
                </span>
              ))}
            </div>
          </div>

          {/* Forge Craft Outcome Notification (Single or Multi-Item Batch) */}
          {lastForged && (
            <div className="mb-3 space-y-1.5 transition-all duration-300">
              {lastForged.items && lastForged.items.length > 1 ? (
                <div className="p-2.5 rounded-xl border bg-zinc-950/90 border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-black text-zinc-200">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Forged {lastForged.items.length} Items ({lastForged.items.length}x Batch)</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                      {lastForged.isUpgrade && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Upgrade
                        </span>
                      )}
                      <span className="text-[11px] text-teal-400">+{lastForged.scrapGained} Scrap</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                    {lastForged.items.map((forged, idx) => {
                      const itemCiv = CIVILIZATIONS.find((c) => c.id === forged.item.civilization);
                      const rConf = RARITY_CONFIGS[forged.item.rarity] || RARITY_CONFIGS.Common;
                      return (
                        <div
                          key={forged.item.id || idx}
                          className={`p-2 rounded-lg border flex items-center justify-between text-xs transition ${
                            forged.isUpgrade
                              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/10'
                              : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <div className={`w-6 h-6 p-0.5 rounded border ${rConf.badgeBg} shrink-0`}>
                              <GearItemVisual item={forged.item} className="w-full h-full" glow={false} />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-[11px] font-bold truncate ${rConf.text}`}>
                                {forged.item.name}
                              </p>
                              <span
                                className="text-[9px] font-black px-1 rounded border"
                                style={{
                                  color: itemCiv?.color,
                                  borderColor: `${itemCiv?.color}40`,
                                  backgroundColor: `${itemCiv?.color}15`,
                                }}
                              >
                                T{itemCiv?.tier || 1} {forged.item.civilization}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            {forged.isUpgrade ? (
                              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Upgrade
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-teal-400">
                                +{forged.scrapGained} Scrap
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all duration-300 ${
                    lastForged.isUpgrade
                      ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 p-0.5 rounded-lg border bg-zinc-900 border-zinc-700 shrink-0">
                      <GearItemVisual item={lastForged.item} className="w-full h-full" glow={false} />
                    </div>
                    <div>
                      <span className="font-bold flex items-center gap-1.5">
                        {lastForged.isUpgrade ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Better Gear Discovered!</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Scrapped for Material</span>
                          </>
                        )}
                      </span>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        Forged <span className={RARITY_CONFIGS[lastForged.item.rarity]?.text}>{lastForged.item.name}</span> ({CIVILIZATIONS.find((c) => c.id === lastForged.item.civilization)?.tier ? `T${CIVILIZATIONS.find((c) => c.id === lastForged.item.civilization)?.tier} · ` : ''}{lastForged.item.civilization})
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {lastForged.isUpgrade ? (
                      <span className="font-bold text-emerald-400">Upgrade Found</span>
                    ) : (
                      <span className="font-bold text-teal-400">+{lastForged.scrapGained} Scrap</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Multi-Forge Quantity Selector & Buttons */}
        <div className="space-y-2.5">
          {/* Multiplier Selector */}
          <div className="flex items-center justify-between bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-1.5 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-zinc-300">Forge Quantity:</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((multiplier) => {
                const isUnlocked = multiplier <= maxBatch;
                const isSelected = activeBatch === multiplier;

                return (
                  <button
                    key={multiplier}
                    onClick={() => {
                      if (isUnlocked) {
                        setBatchSize(multiplier);
                      } else if (onOpenShop) {
                        onOpenShop();
                      }
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm'
                        : isUnlocked
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                        : 'bg-zinc-900/60 text-zinc-500 border-zinc-800/80 hover:border-amber-500/50 hover:text-amber-300 opacity-70'
                    }`}
                    title={isUnlocked ? `Forge ${multiplier}x items per strike` : `Unlock ${multiplier}x Multi-Forge in Ruby Shop`}
                  >
                    {!isUnlocked && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                    <span>{multiplier}x</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Manual Strike Button */}
            <button
              onClick={handleHammerStrike}
              disabled={!canForge || isAutoForging}
              className="py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-[0.98] disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-zinc-950 font-black text-xs sm:text-sm rounded-xl transition-all duration-150 shadow-lg shadow-amber-600/20 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Hammer className="w-4 h-4" />
              <span>Forge {activeBatch}x ({batchCost.toLocaleString()}g)</span>
            </button>

            {/* Auto Forge Button */}
            <button
              onClick={toggleAutoForge}
              disabled={!canForge && !isAutoForging}
              className={`py-3 active:scale-[0.98] font-black text-xs sm:text-sm rounded-xl transition-all duration-150 shadow-lg cursor-pointer flex items-center justify-center gap-1.5 border ${
                isAutoForging
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 animate-pulse shadow-rose-600/30'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white border-indigo-400/30 shadow-indigo-600/20 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:border-transparent disabled:cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isAutoForging ? `Stop Auto Forge (${activeBatch}x)` : `Auto Forge ${activeBatch}x`}</span>
            </button>
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full py-2 bg-zinc-800/90 hover:bg-zinc-700 active:scale-[0.98] text-xs font-bold text-zinc-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-zinc-700/50"
          >
            <ArrowUpCircle className="w-4 h-4 text-sky-400" />
            <span>Upgrade Forge & Probabilities</span>
          </button>
        </div>
      </div>

      {/* Forge Upgrade Modal Popup */}
      <ForgeUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        state={state}
        onUpgrade={handleUpgrade}
        upgradeCost={upgradeCost}
      />

      {/* Item Choice & Comparison Modal (Shows all crafted options like Boots, Helmet, etc.) */}
      {forgedChoicePairs && forgedChoicePairs.length > 0 && (
        <ItemComparisonModal
          isOpen={true}
          onClose={() => setForgedChoicePairs(null)}
          items={forgedChoicePairs}
          onEquip={handleManualEquip}
          onScrap={handleManualScrap}
          onEquipAll={handleEquipAll}
          onScrapAll={handleScrapAll}
        />
      )}
    </>
  );
};

