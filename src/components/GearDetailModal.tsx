import React from 'react';
import type { Equipment } from '../hooks/useAutoForge';
import { CIVILIZATIONS } from '../hooks/useAutoForge';
import { RARITY_CONFIGS } from './RarityTheme';
import { MODIFIER_TEMPLATES } from '../types/modifiers';
import { GearItemVisual } from './GearVisuals';
import {
  X,
  Sword,
  Shield,
  Heart,
  Sparkles,
  Zap,
  Flame,
  Wind,
  Skull,
  HeartHandshake,
  Crosshair,
  Info,
  Layers,
  Gauge,
} from 'lucide-react';

interface GearDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Equipment | null;
}

export const GearDetailModal: React.FC<GearDetailModalProps> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const config = RARITY_CONFIGS[item.rarity] || RARITY_CONFIGS.Common;
  const civ = CIVILIZATIONS.find((c) => c.id === item.civilization) || CIVILIZATIONS[0];
  const modifiers = item.modifiers || [];

  const getSlotLabel = (slot: string) => {
    switch (slot) {
      case 'weapon': return 'Main Weapon';
      case 'armor': return 'Chest Armor';
      case 'helmet': return 'Helmet / Headgear';
      case 'gloves': return 'Gloves / Gauntlets';
      case 'boots': return 'Boots / Greaves';
      default: return 'Equipment';
    }
  };

  const getModIcon = (iconName: string, color: string) => {
    const props = { className: 'w-4 h-4 shrink-0', style: { color } };
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-zinc-900 border-2 border-zinc-700 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-zinc-800/90 px-4 pt-3 pb-2.5 text-center relative border-b border-zinc-700/80">
          <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400 block">
            {getSlotLabel(item.slot)}
          </span>
          <h2 className="text-base sm:text-lg font-black tracking-wide text-zinc-100">
            Equipment Details
          </h2>
          <button
            onClick={onClose}
            className="absolute top-2.5 right-3 w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto">
          {/* Main Showcase Banner */}
          <div
            className={`p-3.5 rounded-2xl border bg-gradient-to-b ${config.bg} ${config.border} ${config.glow} flex items-center gap-3.5 shadow-lg relative overflow-hidden`}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 shrink-0 shadow-inner p-1 relative"
              style={{
                backgroundColor: `${civ.color}25`,
                borderColor: civ.color,
                boxShadow: `0 0 15px ${civ.color}40`,
              }}
            >
              <GearItemVisual item={item} className="w-full h-full" glow={true} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`text-base font-black truncate ${config.text}`}>
                {item.name}
              </h3>

              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-md border flex items-center gap-1"
                  style={{
                    color: civ.color,
                    borderColor: `${civ.color}50`,
                    backgroundColor: `${civ.color}20`,
                  }}
                >
                  <Layers className="w-3 h-3" />
                  <span>T{civ.tier} · {civ.name}</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${config.badgeBg}`}>
                  {item.rarity}
                </span>
              </div>
            </div>
          </div>

          {/* Base Stats Breakdown Grid */}
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-1.5 block">
              Core Attributes
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-950/80 text-red-400 border border-red-900/50">
                    <Sword className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Attack</span>
                    <span className="text-sm font-black text-red-400">+{item.attack}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-950/80 text-sky-400 border border-sky-900/50">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Defense</span>
                    <span className="text-sm font-black text-sky-400">+{item.defense}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-900/50">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Health</span>
                    <span className="text-sm font-black text-emerald-400">+{item.health} HP</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-950/80 text-teal-400 border border-teal-900/50">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Scrap Value</span>
                    <span className="text-sm font-black text-teal-400">+{item.value}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combat Modifiers Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Rolled Modifiers ({modifiers.length})
              </span>
              <span className="text-[10px] text-amber-400 font-bold">
                {item.rarity} Quality
              </span>
            </div>

            {modifiers.length > 0 ? (
              <div className="space-y-1.5">
                {modifiers.map((mod, i) => {
                  const template = MODIFIER_TEMPLATES[mod.type];
                  return (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl border bg-zinc-950/80 flex items-center justify-between"
                      style={{
                        borderColor: `${mod.color}40`,
                        backgroundColor: `${mod.color}08`,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="p-1.5 rounded-lg border shrink-0"
                          style={{
                            borderColor: `${mod.color}50`,
                            backgroundColor: `${mod.color}20`,
                          }}
                        >
                          {getModIcon(mod.iconName, mod.color)}
                        </div>
                        <div>
                          <span className="text-xs font-bold block" style={{ color: mod.color }}>
                            {mod.label}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {template?.label || 'Combat Boost'}
                          </span>
                        </div>
                      </div>

                      <div
                        className="px-2 py-0.5 rounded-lg font-black text-xs border"
                        style={{
                          color: mod.color,
                          borderColor: `${mod.color}40`,
                          backgroundColor: `${mod.color}20`,
                        }}
                      >
                        {mod.display}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-zinc-500" />
                <span>Common item with no bonus modifiers. Forge higher rarity items to unlock modifiers!</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Button */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
