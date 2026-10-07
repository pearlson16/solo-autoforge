import React, { useState, useEffect } from 'react';
import type { Equipment } from '../hooks/useAutoForge';
import { CIVILIZATIONS } from '../hooks/useAutoForge';
import { RARITY_CONFIGS } from './RarityTheme';
import { GearItemVisual } from './GearVisuals';
import { soundFx } from '../utils/audio';
import {
  X,
  Shield,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  Trash2,
  Zap,
  Flame,
  Wind,
  Skull,
  HeartHandshake,
  Crosshair,
  Heart,
  Check,
  CheckCheck,
  Gauge,
} from 'lucide-react';

export interface ComparisonPair {
  newItem: Equipment;
  equippedItem: Equipment | undefined;
}

export interface ItemComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  equippedItem?: Equipment | undefined;
  newItem?: Equipment;
  items?: ComparisonPair[];
  onEquip: (item: Equipment) => void;
  onScrap: (item: Equipment) => void;
  onEquipAll?: (items: Equipment[]) => void;
  onScrapAll?: (items: Equipment[]) => void;
  queueIndex?: number;
  queueTotal?: number;
}

export const ItemComparisonModal: React.FC<ItemComparisonModalProps> = ({
  isOpen,
  onClose,
  equippedItem,
  newItem,
  items,
  onEquip,
  onScrap,
  onEquipAll,
  onScrapAll,
  queueIndex,
  queueTotal,
}) => {
  // Normalize items list into pairs array
  const pairList: ComparisonPair[] = React.useMemo(() => {
    if (items && items.length > 0) return items;
    if (newItem) return [{ newItem, equippedItem }];
    return [];
  }, [items, newItem, equippedItem]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [statuses, setStatuses] = useState<Record<string, 'pending' | 'equipped' | 'scrapped'>>({});

  // Reset selected index & statuses when new items are provided
  useEffect(() => {
    setSelectedIndex(0);
    setStatuses({});
  }, [pairList]);

  if (!isOpen || pairList.length === 0) return null;

  const currentPair = pairList[selectedIndex] || pairList[0];
  const activeNewItem = currentPair.newItem;
  const activeEquippedItem = currentPair.equippedItem;

  const isWeapon = activeNewItem.slot === 'weapon';

  const equippedConfig = activeEquippedItem ? RARITY_CONFIGS[activeEquippedItem.rarity] || RARITY_CONFIGS.Common : RARITY_CONFIGS.Common;
  const newConfig = RARITY_CONFIGS[activeNewItem.rarity] || RARITY_CONFIGS.Common;

  const equippedCiv = activeEquippedItem ? CIVILIZATIONS.find((c) => c.id === activeEquippedItem.civilization) || CIVILIZATIONS[0] : CIVILIZATIONS[0];
  const newCiv = CIVILIZATIONS.find((c) => c.id === activeNewItem.civilization) || CIVILIZATIONS[0];

  const atkDiff = activeNewItem.attack - (activeEquippedItem?.attack || 0);
  const defDiff = activeNewItem.defense - (activeEquippedItem?.defense || 0);
  const hpDiff = activeNewItem.health - (activeEquippedItem?.health || 0);

  const equippedMods = activeEquippedItem?.modifiers || [];
  const newMods = activeNewItem.modifiers || [];

  const newModPower = newMods.reduce((s, m) => s + m.value, 0);
  const equippedModPower = equippedMods.reduce((s, m) => s + m.value, 0);

  const isOverallUpgrade = isWeapon
    ? (activeNewItem.attack * (1 + newModPower / 100)) > ((activeEquippedItem?.attack || 0) * (1 + equippedModPower / 100))
    : ((activeNewItem.defense + activeNewItem.health + activeNewItem.attack) * (1 + newModPower / 100)) > (((activeEquippedItem?.defense || 0) + (activeEquippedItem?.health || 0) + (activeEquippedItem?.attack || 0)) * (1 + equippedModPower / 100));

  const getModIcon = (iconName: string, color: string) => {
    const props = { className: 'w-3 h-3 shrink-0', style: { color } };
    switch (iconName) {
      case 'Gauge': return <Gauge {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'Skull': return <Skull {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      case 'Crosshair': return <Crosshair {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Shield': return <Shield {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const renderDiffBadge = (diff: number, label: string) => {
    if (diff > 0) {
      return (
        <span className="flex items-center gap-0.5 text-emerald-400 font-bold text-xs">
          <TrendingUp className="w-3.5 h-3.5" /> +{diff} {label}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="flex items-center gap-0.5 text-rose-400 font-bold text-xs">
          <TrendingDown className="w-3.5 h-3.5" /> {diff} {label}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 text-zinc-400 font-semibold text-xs">
        <Minus className="w-3 h-3" /> 0 {label}
      </span>
    );
  };

  const handleEquipActive = () => {
    soundFx.playEquip(activeNewItem.rarity);
    onEquip(activeNewItem);
    const newStatuses = { ...statuses, [activeNewItem.id]: 'equipped' as const };
    setStatuses(newStatuses);

    // Find next pending item
    const nextPendingIdx = pairList.findIndex((p, idx) => idx > selectedIndex && newStatuses[p.newItem.id] !== 'equipped' && newStatuses[p.newItem.id] !== 'scrapped');
    if (nextPendingIdx !== -1) {
      setSelectedIndex(nextPendingIdx);
    } else {
      const anyPendingIdx = pairList.findIndex((p) => newStatuses[p.newItem.id] !== 'equipped' && newStatuses[p.newItem.id] !== 'scrapped');
      if (anyPendingIdx !== -1) {
        setSelectedIndex(anyPendingIdx);
      } else {
        onClose();
      }
    }
  };

  const handleScrapActive = () => {
    soundFx.playSalvage();
    onScrap(activeNewItem);
    const newStatuses = { ...statuses, [activeNewItem.id]: 'scrapped' as const };
    setStatuses(newStatuses);

    // Find next pending item
    const nextPendingIdx = pairList.findIndex((p, idx) => idx > selectedIndex && newStatuses[p.newItem.id] !== 'equipped' && newStatuses[p.newItem.id] !== 'scrapped');
    if (nextPendingIdx !== -1) {
      setSelectedIndex(nextPendingIdx);
    } else {
      const anyPendingIdx = pairList.findIndex((p) => newStatuses[p.newItem.id] !== 'equipped' && newStatuses[p.newItem.id] !== 'scrapped');
      if (anyPendingIdx !== -1) {
        setSelectedIndex(anyPendingIdx);
      } else {
        onClose();
      }
    }
  };

  const handleEquipAll = () => {
    soundFx.playEquip();
    const pendingItems = pairList.filter((p) => statuses[p.newItem.id] !== 'equipped' && statuses[p.newItem.id] !== 'scrapped').map((p) => p.newItem);
    if (onEquipAll && pendingItems.length > 0) {
      onEquipAll(pendingItems);
    } else {
      pendingItems.forEach((it) => onEquip(it));
    }
    onClose();
  };

  const handleScrapAll = () => {
    soundFx.playSalvage();
    const pendingItems = pairList.filter((p) => statuses[p.newItem.id] !== 'equipped' && statuses[p.newItem.id] !== 'scrapped').map((p) => p.newItem);
    if (onScrapAll && pendingItems.length > 0) {
      onScrapAll(pendingItems);
    } else {
      pendingItems.forEach((it) => onScrap(it));
    }
    onClose();
  };

  const handleDismiss = () => {
    // Scrap any remaining items
    const pendingItems = pairList.filter((p) => statuses[p.newItem.id] !== 'equipped' && statuses[p.newItem.id] !== 'scrapped').map((p) => p.newItem);
    if (pendingItems.length > 0) {
      if (onScrapAll) {
        onScrapAll(pendingItems);
      } else {
        pendingItems.forEach((it) => onScrap(it));
      }
    }
    onClose();
  };

  const currentStatus = statuses[activeNewItem.id] || 'pending';
  const hasMultipleOptions = pairList.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-md bg-stone-100 dark:bg-zinc-900 border-2 border-stone-300 dark:border-zinc-700 rounded-3xl shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-amber-100/80 dark:bg-zinc-800/95 px-4 pt-3 pb-2.5 text-center relative border-b border-amber-200 dark:border-zinc-700/80">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-sm sm:text-base font-black tracking-wide text-stone-800 dark:text-zinc-100 uppercase">
              {hasMultipleOptions ? 'Choose Your Forged Gear' : 'Equipment Found'}
            </h2>
            {queueTotal && queueTotal > 1 ? (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 shadow-sm">
                Batch {queueIndex || 1} / {queueTotal}
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {hasMultipleOptions
              ? 'Multiple gear options forged — select each piece to compare & equip'
              : 'Compare newly forged drop with current equipment'}
          </p>
          <button
            onClick={handleDismiss}
            className="absolute top-2.5 right-3 w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
            title="Close and scrap unequipped drops"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MULTI-OPTION SELECTOR TABS (Shown if multiple items like boots and helmet are rolled) */}
        {hasMultipleOptions && (
          <div className="bg-zinc-950/90 border-b border-zinc-800 p-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider pl-1 pr-0.5">
                Options:
              </span>
              {pairList.map((pair, idx) => {
                const isSelected = idx === selectedIndex;
                const pairCiv = CIVILIZATIONS.find((c) => c.id === pair.newItem.civilization);
                const status = statuses[pair.newItem.id];

                return (
                  <button
                    key={pair.newItem.id || idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md scale-105'
                        : status === 'equipped'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 opacity-80'
                        : status === 'scrapped'
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-500 line-through opacity-60'
                        : 'bg-zinc-900 border-zinc-700/80 text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="w-4 h-4 p-0.5 rounded shrink-0">
                      <GearItemVisual item={pair.newItem} className="w-full h-full" glow={false} />
                    </div>
                    <span className="capitalize">{pair.newItem.slot}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                        isSelected ? 'bg-zinc-900/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      T{pairCiv?.tier || 1}
                    </span>
                    {status === 'equipped' && <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-3.5 sm:p-4 space-y-3 overflow-y-auto">
          {/* EQUIPPED ITEM CARD */}
          {activeEquippedItem ? (
            <div className="relative p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                  Currently Equipped ({activeEquippedItem.slot})
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${equippedConfig.badgeBg}`}>
                  {activeEquippedItem.rarity}
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-1">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center border-2 shrink-0 shadow-inner p-0.5"
                  style={{
                    backgroundColor: `${equippedCiv.color}20`,
                    borderColor: equippedCiv.color,
                  }}
                >
                  <GearItemVisual item={activeEquippedItem} className="w-full h-full" glow={true} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className={`font-black text-xs sm:text-sm truncate ${equippedConfig.text}`}>
                    {activeEquippedItem.name}
                  </h3>
                  <span
                    className="text-[9px] font-bold px-1 rounded border inline-block mt-0.5"
                    style={{
                      color: equippedCiv.color,
                      borderColor: `${equippedCiv.color}40`,
                      backgroundColor: `${equippedCiv.color}15`,
                    }}
                  >
                    T{equippedCiv.tier} · {equippedCiv.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold shrink-0 text-right">
                  {activeEquippedItem.attack > 0 && (
                    <span className="text-red-400">+{activeEquippedItem.attack} ATK</span>
                  )}
                  {activeEquippedItem.defense > 0 && (
                    <span className="text-sky-400">+{activeEquippedItem.defense} DEF</span>
                  )}
                  {activeEquippedItem.health > 0 && (
                    <span className="text-emerald-400">+{activeEquippedItem.health} HP</span>
                  )}
                </div>
              </div>

              {/* Equipped Modifiers */}
              {equippedMods.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-stone-200 dark:border-zinc-800/60 flex flex-wrap gap-1">
                  {equippedMods.map((mod, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1"
                      style={{
                        color: mod.color,
                        borderColor: `${mod.color}40`,
                        backgroundColor: `${mod.color}10`,
                      }}
                    >
                      {getModIcon(mod.iconName, mod.color)}
                      <span>{mod.display}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 border-dashed text-center opacity-60">
              <div className="text-zinc-500 font-bold text-xs uppercase tracking-wider">No Item Equipped in this slot</div>
            </div>
          )}

          {/* NEW FORGED DROP CARD */}
          <div
            className={`relative p-3.5 rounded-2xl border-2 shadow-md transition-all ${
              isOverallUpgrade
                ? 'bg-emerald-500/5 dark:bg-emerald-950/30 border-emerald-500/70 shadow-emerald-500/10'
                : 'bg-white dark:bg-zinc-950 border-stone-300 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-amber-500 to-emerald-500 text-[9px] font-black uppercase text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <span>Option {selectedIndex + 1}: {activeNewItem.slot}</span>
                </span>
                {isOverallUpgrade && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-700 text-white animate-pulse">
                    UPGRADE
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${newConfig.badgeBg}`}>
                {activeNewItem.rarity}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 shrink-0 shadow-inner p-1"
                style={{
                  backgroundColor: `${newCiv.color}25`,
                  borderColor: newCiv.color,
                  boxShadow: `0 0 12px ${newCiv.color}30`,
                }}
              >
                <GearItemVisual item={activeNewItem} className="w-full h-full" glow={true} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`font-black text-sm truncate ${newConfig.text}`}>
                  {activeNewItem.name}
                </h3>
                <span
                  className="text-[9px] font-black px-1.5 py-0.2 rounded border inline-block mt-0.5"
                  style={{
                    color: newCiv.color,
                    borderColor: `${newCiv.color}50`,
                    backgroundColor: `${newCiv.color}15`,
                  }}
                >
                  T{newCiv.tier} · {newCiv.name}
                </span>
              </div>
            </div>

            {/* Comparison Stats Diffs */}
            <div className="space-y-1 mt-2.5 pt-2 border-t border-stone-200 dark:border-zinc-800/80 text-xs">
              {activeNewItem.attack > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-bold">+{activeNewItem.attack} ATK</span>
                  {renderDiffBadge(atkDiff, 'ATK')}
                </div>
              )}
              {activeNewItem.defense > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sky-400 font-bold">+{activeNewItem.defense} DEF</span>
                  {renderDiffBadge(defDiff, 'DEF')}
                </div>
              )}
              {activeNewItem.health > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">+{activeNewItem.health} HP</span>
                  {renderDiffBadge(hpDiff, 'HP')}
                </div>
              )}
            </div>

            {/* Modifiers */}
            {newMods.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-zinc-800/60 flex flex-wrap gap-1">
                {newMods.map((mod, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 animate-pulse"
                    style={{
                      color: mod.color,
                      borderColor: `${mod.color}50`,
                      backgroundColor: `${mod.color}15`,
                    }}
                  >
                    {getModIcon(mod.iconName, mod.color)}
                    <span>{mod.display}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="p-3 sm:p-4 bg-stone-200/90 dark:bg-zinc-950 border-t border-stone-300 dark:border-zinc-800 flex flex-col gap-2 shrink-0">
          {/* Individual Action Row for Current Item */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleScrapActive}
              disabled={currentStatus !== 'pending'}
              className="py-2.5 px-3 bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 active:scale-[0.98] text-white font-black text-xs sm:text-sm rounded-xl shadow-md border border-rose-400/60 disabled:border-transparent transition cursor-pointer disabled:cursor-not-allowed flex flex-col items-center justify-center gap-0.5"
            >
              <div className="flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>{currentStatus === 'scrapped' ? 'Scrapped' : `Scrap ${activeNewItem.slot}`}</span>
              </div>
              <span className="text-[10px] font-bold text-rose-100 opacity-90">
                +{activeNewItem.value} Scrap
              </span>
            </button>

            <button
              onClick={handleEquipActive}
              disabled={currentStatus !== 'pending'}
              className="py-2.5 px-3 bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 active:scale-[0.98] text-white font-black text-xs sm:text-sm rounded-xl shadow-md border border-sky-400/60 disabled:border-transparent transition cursor-pointer disabled:cursor-not-allowed flex flex-col items-center justify-center gap-0.5"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{currentStatus === 'equipped' ? 'Equipped' : `Equip ${activeNewItem.slot}`}</span>
              </div>
              <span className="text-[10px] font-bold text-sky-100 opacity-90">
                Recycle Old (+{activeEquippedItem?.value || 0})
              </span>
            </button>
          </div>

          {/* Batch Quick-Actions (Equip All / Scrap All) if multiple options exist */}
          {hasMultipleOptions && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
              <button
                onClick={handleScrapAll}
                className="text-[11px] font-bold text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded transition cursor-pointer"
              >
                Scrap All Drops
              </button>
              <button
                onClick={handleEquipAll}
                className="text-[11px] font-black text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Equip All Items</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

