import React from 'react';
import type { Equipment } from '../hooks/useAutoForge';
import { CIVILIZATIONS } from '../hooks/useAutoForge';
import { RARITY_CONFIGS } from './RarityTheme';
import { GearItemVisual } from './GearVisuals';
import { Sparkles } from 'lucide-react';

interface EquipmentCardProps {
  item: Equipment;
  label?: string;
  isNew?: boolean;
  onClick?: () => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ item, label, isNew, onClick }) => {
  const config = RARITY_CONFIGS[item.rarity] || RARITY_CONFIGS.Common;
  const civ = CIVILIZATIONS.find((c) => c.id === item.civilization) || CIVILIZATIONS[0];
  const modifiers = item.modifiers || [];

  const getPrimaryStat = () => {
    if (item.slot === 'weapon') {
      return { text: `+${item.attack} ATK`, color: 'text-red-400' };
    }
    if (item.slot === 'gloves') {
      if (item.attack > 0 && item.defense > 0) {
        return { text: `+${item.attack}A · +${item.defense}D`, color: 'text-amber-300' };
      }
      if (item.attack > 0) return { text: `+${item.attack} ATK`, color: 'text-red-400' };
      return { text: `+${item.defense} DEF`, color: 'text-sky-400' };
    }
    if (item.slot === 'armor') {
      return { text: `+${item.defense} DEF`, color: 'text-sky-400' };
    }
    if (item.slot === 'helmet' || item.slot === 'boots') {
      return { text: `+${item.defense} DEF`, color: 'text-sky-400' };
    }
    if (item.attack > 0) return { text: `+${item.attack} ATK`, color: 'text-red-400' };
    if (item.defense > 0) return { text: `+${item.defense} DEF`, color: 'text-sky-400' };
    if (item.health > 0) return { text: `+${item.health} HP`, color: 'text-emerald-400' };
    return { text: `T${civ.tier}`, color: 'text-zinc-400' };
  };

  const primaryStat = getPrimaryStat();

  return (
    <div
      onClick={onClick}
      className={`relative p-1.5 sm:p-2 rounded-xl border bg-gradient-to-b ${config.bg} ${config.border} ${config.glow} shadow-xs transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-between text-center group min-w-0`}
      title={`${label || item.slot}: ${item.name} (${item.rarity}) - Click to view full details`}
    >
      {isNew && (
        <span className="absolute -top-1.5 -right-1 bg-gradient-to-r from-amber-500 to-rose-500 text-[8px] font-black uppercase tracking-wider px-1 py-0.2 rounded-full text-white shadow-md animate-bounce">
          NEW
        </span>
      )}

      {/* Top Header: Slot & Tier Badge */}
      <div className="flex items-center justify-between w-full px-0.5 mb-0.5">
        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-zinc-400 truncate">
          {label || item.slot}
        </span>
        <span
          className="text-[7px] sm:text-[8px] font-black px-1 rounded border shrink-0"
          style={{
            color: civ.color,
            borderColor: `${civ.color}40`,
            backgroundColor: `${civ.color}15`,
          }}
        >
          T{civ.tier}
        </span>
      </div>

      {/* Actual Item Sprite Box */}
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border ${config.badgeBg} p-0.5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner relative my-0.5`}
        style={{
          boxShadow: `0 0 10px ${civ.color}25`,
        }}
      >
        <GearItemVisual item={item} className="w-full h-full" glow={true} />
        {modifiers.length > 0 && (
          <span
            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center border shadow-xs"
            style={{
              backgroundColor: modifiers[0]?.color || '#fbbf24',
              borderColor: '#18181b',
            }}
            title={`${modifiers.length} modifiers`}
          >
            <Sparkles className="w-1.5 h-1.5 text-zinc-950 stroke-[3]" />
          </span>
        )}
      </div>

      {/* Gear Name */}
      <h4 className={`text-[10px] sm:text-[11px] font-black truncate w-full leading-tight my-0.5 ${config.text}`}>
        {item.name}
      </h4>

      {/* Primary Stat Pill (Attack / Defense / Stats) */}
      <div className="w-full bg-zinc-950/70 border border-zinc-800/80 rounded px-1 py-0.5 mt-0.5 flex items-center justify-center truncate">
        <span className={`text-[8px] sm:text-[9px] font-black truncate ${primaryStat.color}`}>
          {primaryStat.text}
        </span>
      </div>
    </div>
  );
};


