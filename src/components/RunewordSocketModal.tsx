import { useState } from 'react';
import { X, Sparkles, Zap, Flame, Snowflake, Skull, Info, Plus, RotateCcw } from 'lucide-react';
import type { Equipment } from '../hooks/useAutoForge';
import type { GemType, Runeword } from '../types/runewords';
import { GEM_DEFINITIONS, RUNEWORD_RECIPES, detectRuneword } from '../types/runewords';

type EquipmentSlotType = 'weapon' | 'armor' | 'helmet' | 'gloves' | 'boots';

interface RunewordSocketModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipped: {
    weapon: Equipment;
    armor: Equipment;
    helmet: Equipment;
    gloves: Equipment;
    boots: Equipment;
  };
  gemInventory: Record<GemType, number>;
  onSocketGem: (slot: EquipmentSlotType, gemType: GemType) => void;
  onUnsocketGem: (slot: EquipmentSlotType, index: number) => void;
  onFuseGems: (gemType: GemType) => void;
  activeSockets: Record<string, GemType[]>; // e.g. { weapon: ['Ruby', 'Topaz', 'Ruby'] }
}

export function RunewordSocketModal({
  isOpen,
  onClose,
  equipped,
  gemInventory,
  onSocketGem,
  onUnsocketGem,
  onFuseGems,
  activeSockets,
}: RunewordSocketModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<keyof typeof equipped>('weapon');

  if (!isOpen) return null;

  const currentItem = equipped[selectedSlot];
  const itemGems = activeSockets[selectedSlot] || [];
  const activeRuneword: Runeword | null = detectRuneword(itemGems);

  // Maximum sockets allowed based on rarity
  const getMaxSockets = (rarity: string) => {
    switch (rarity) {
      case 'Mythic':
        return 3;
      case 'Legendary':
        return 3;
      case 'Epic':
        return 2;
      case 'Rare':
        return 1;
      default:
        return 0;
    }
  };

  const maxSockets = getMaxSockets(currentItem.rarity);

  const getGemIcon = (type: GemType) => {
    switch (type) {
      case 'Ruby':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'Sapphire':
        return <Snowflake className="w-5 h-5 text-sky-400" />;
      case 'Topaz':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Amethyst':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Emerald':
        return <Skull className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-purple-900/60 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-950/80 border border-purple-700/60 rounded-xl text-purple-400 shadow-lg shadow-purple-950/50">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-purple-200 tracking-wide flex items-center gap-2">
                Elemental Runeword Forge
                <span className="text-xs px-2 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700">
                  SOCKET MATRIX
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Socket elemental gems into gear to unleash ancient Runeword Awakenings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Slot Selection Tabs */}
          <div className="grid grid-cols-5 gap-2">
            {(['weapon', 'armor', 'helmet', 'gloves', 'boots'] as const).map((slot) => {
              const eq = equipped[slot];
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2.5 rounded-xl border text-center capitalize transition-all ${
                    isSelected
                      ? 'bg-purple-950/90 border-purple-500 text-purple-200 shadow-lg shadow-purple-950/50'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{eq.name}</div>
                  <div className="text-[10px] text-stone-500 capitalize">{slot}</div>
                </button>
              );
            })}
          </div>

          {/* Selected Equipment Display & Socket Array */}
          <div className="bg-stone-950 border border-purple-900/40 rounded-xl p-4 sm:p-5 space-y-4 relative overflow-hidden">
            {/* Runeword Active Backdrop Aura */}
            {activeRuneword && (
              <div
                className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: activeRuneword.color }}
              />
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  {currentItem.rarity} {currentItem.slot.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{currentItem.name}</h3>
                <p className="text-xs text-stone-400">
                  ATK +{currentItem.attack} | DEF +{currentItem.defense} | HP +{currentItem.health}
                </p>
              </div>

              {/* Sockets Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-3 py-1.5 rounded-lg border border-purple-800">
                  {itemGems.length} / {maxSockets} Sockets Filled
                </span>
              </div>
            </div>

            {/* Socket Slots Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Gem Sockets
              </h4>

              {maxSockets === 0 ? (
                <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-lg text-xs text-stone-500 text-center">
                  Common gear cannot contain gem sockets. Upgrade forge or equip Rare, Epic, or Mythic items!
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: maxSockets }).map((_, idx) => {
                    const gemType = itemGems[idx];
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 min-h-[90px] relative transition-all ${
                          gemType
                            ? 'bg-purple-950/40 border-purple-600/80 shadow-md shadow-purple-950/40'
                            : 'bg-stone-900/80 border-dashed border-stone-700 text-stone-600'
                        }`}
                      >
                        {gemType ? (
                          <>
                            <div className="p-2 rounded-full bg-stone-900 border border-stone-700">
                              {getGemIcon(gemType)}
                            </div>
                            <span className="text-xs font-bold text-purple-200">
                              {gemType}
                            </span>
                            <button
                              onClick={() => onUnsocketGem(selectedSlot, idx)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-950/80 text-red-400 hover:text-white hover:bg-red-900 transition-colors"
                              title="Unsocket Gem"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-stone-500">
                            <Plus className="w-5 h-5 text-stone-600" />
                            <span className="text-[11px]">Empty Socket</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Runeword Awakening Banner */}
            {activeRuneword ? (
              <div
                className="p-4 rounded-xl border space-y-2 animate-pulse"
                style={{
                  backgroundColor: 'rgba(24, 18, 40, 0.9)',
                  borderColor: activeRuneword.color,
                  boxShadow: `0 0 20px ${activeRuneword.bgGlow}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700">
                    ✨ RUNEWORD AWAKENED ✨
                  </span>
                  <span className="text-xs font-semibold text-amber-300">
                    {activeRuneword.specialAura}
                  </span>
                </div>
                <h4 className="text-base font-black text-amber-300 tracking-wider">
                  {activeRuneword.name} - {activeRuneword.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {activeRuneword.description}
                </p>
                <div className="flex gap-4 text-xs font-mono font-bold text-emerald-400">
                  {activeRuneword.bonusAtkPct > 0 && <span>+ {activeRuneword.bonusAtkPct}% ATK</span>}
                  {activeRuneword.bonusDefPct > 0 && <span>+ {activeRuneword.bonusDefPct}% DEF</span>}
                  {activeRuneword.bonusHpPct > 0 && <span>+ {activeRuneword.bonusHpPct}% HP</span>}
                  {activeRuneword.bonusCritRate > 0 && <span>+ {activeRuneword.bonusCritRate}% CRIT</span>}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-xs text-stone-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  Socket complementary gem combinations (e.g. 2 Rubies + 1 Topaz) to awaken ancient Runewords.
                </span>
              </div>
            )}
          </div>

          {/* Gem Inventory & Socketing Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center justify-between">
              <span>Elemental Gems Inventory</span>
              <span className="text-[11px] text-stone-400 normal-case">Earned from Dungeons & Tower Bosses</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {(Object.keys(GEM_DEFINITIONS) as GemType[]).map((type) => {
                const def = GEM_DEFINITIONS[type];
                const count = gemInventory[type] || 0;
                const canSocket = itemGems.length < maxSockets && count > 0;

                return (
                  <div
                    key={type}
                    className="bg-stone-950 border border-stone-800 hover:border-purple-800 rounded-xl p-3 flex flex-col justify-between space-y-3 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-700">
                        {getGemIcon(type)}
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                        x{count}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-stone-200">{type}</div>
                      <div className="text-[10px] text-stone-400">{def.statLabel}</div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => onSocketGem(selectedSlot, type)}
                        disabled={!canSocket}
                        className={`w-full py-1.5 rounded-lg font-bold text-xs transition-all ${
                          canSocket
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/50'
                            : 'bg-stone-900 text-stone-600 cursor-not-allowed border border-stone-800'
                        }`}
                      >
                        Socket
                      </button>

                      {count >= 3 && (
                        <button
                          onClick={() => onFuseGems(type)}
                          className="w-full py-1 rounded text-[10px] bg-amber-950/80 text-amber-300 hover:bg-amber-900 border border-amber-800 transition-colors"
                          title="Fuse 3 Gems into 1 Radiant Gem"
                        >
                          Fuse 3 Gems
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Known Runeword Recipes Guide */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" />
              Discoverable Runeword Combinations
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {RUNEWORD_RECIPES.map((rw) => (
                <div
                  key={rw.id}
                  className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-amber-300">{rw.name}</span>
                    <p className="text-[10px] text-stone-400">{rw.title}</p>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-purple-300 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                    {rw.recipe.join(' + ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
