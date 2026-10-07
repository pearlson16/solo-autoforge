import React, { useState } from 'react';
import type { GameState, Equipment } from '../hooks/useAutoForge';
import { calculatePlayerCombatStats, calculateHeroPower, CIVILIZATIONS } from '../hooks/useAutoForge';
import { HeroSprite } from './CharacterSprites';
import { EquipmentCard } from './EquipmentCard';
import { GearDetailModal } from './GearDetailModal';
import { soundFx } from '../utils/audio';
import { Shield, Sword, Heart, Crown, Zap, Flame, Wind, Skull, HeartHandshake, Crosshair, Sparkles, Gem, Gauge, Swords, Cpu } from 'lucide-react';

interface HeroDisplayProps {
  state: GameState;
}

export const HeroDisplay: React.FC<HeroDisplayProps> = ({ state }) => {
  const [inspectItem, setInspectItem] = useState<Equipment | null>(null);
  const stats = calculatePlayerCombatStats(state.equipped, state.blessings || [], state.techTree || {}, 0, state.activeSockets || {});

  // Calculate Power Score & Civilization Synergies
  const powerScore = calculateHeroPower(stats);

  const civCounts: Record<string, number> = {};
  [
    state.equipped.weapon,
    state.equipped.helmet,
    state.equipped.armor,
    state.equipped.gloves,
    state.equipped.boots,
  ].forEach((item) => {
    if (item.civilization) {
      civCounts[item.civilization] = (civCounts[item.civilization] || 0) + 1;
    }
  });

  const activeSynergies = Object.entries(civCounts)
    .map(([civId, count]) => {
      const civObj = CIVILIZATIONS.find((c) => c.id === civId);
      return { civ: civObj || CIVILIZATIONS[0], count };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col gap-3 relative overflow-hidden h-full">
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Character Title Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base sm:text-lg font-black text-zinc-100 tracking-wide">Hero of the Forge</h2>
            <p className="text-xs text-zinc-400">Era {state.era} Knight • Floor {state.currentFloor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-xs font-black text-amber-300 flex items-center gap-1 shadow-sm">
            <Swords className="w-3 h-3 text-amber-400" />
            <span>{powerScore.toLocaleString()} PWR</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/60 text-xs font-bold text-zinc-300">
            Lv. {state.forgeLevel}
          </div>
        </div>
      </div>

      {/* Character Visual Avatar & Base Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-950/80 border border-zinc-800/90 p-3 rounded-xl relative overflow-hidden shadow-inner">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Avatar Container with Arcane Summoning Pedestal */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-stone-900 via-zinc-950 to-black border-2 border-amber-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.15)] relative overflow-hidden">
            {/* Rotating Arcane Summoning Ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-amber-400/25 animate-[rotateSlow_20s_linear_infinite] pointer-events-none" />
            <div className="absolute inset-4 rounded-full border border-amber-500/20 pointer-events-none" />

            {/* Radial Platform Glow */}
            <div className="absolute inset-0 bg-radial from-amber-500/20 via-orange-950/15 to-transparent animate-pulse pointer-events-none" />

            {/* Pedestal Base Shadow */}
            <div className="absolute bottom-1.5 w-14 h-2.5 bg-amber-500/25 rounded-full blur-xs pointer-events-none" />

            <HeroSprite
              className="w-16 h-16 sm:w-20 sm:h-20 animate-idle-float relative z-10"
              civilization={state.equipped.armor.civilization || state.equipped.weapon.civilization}
              equipped={state.equipped}
              equippedWeapon={state.equipped.weapon}
              equippedArmor={state.equipped.armor}
              equippedHelmet={state.equipped.helmet}
              equippedGloves={state.equipped.gloves}
              equippedBoots={state.equipped.boots}
            />
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-zinc-900 border border-amber-500/60 text-[9px] font-bold text-amber-400 px-2 py-0.2 rounded-full uppercase tracking-wider shadow-md z-20">
            Equipped
          </div>
        </div>

        {/* Stats Breakdown */}
        <div className="w-full space-y-1.5">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <Heart className="w-3.5 h-3.5" /> Max HP
              </span>
              <span className="text-zinc-200 font-bold">{stats.maxHp} HP</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-1.5 flex items-center gap-1.5">
              <div className="p-1 rounded bg-red-950/80 text-red-400 border border-red-900/50 shrink-0">
                <Sword className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] uppercase font-bold text-zinc-400 block truncate">Attack</span>
                <span className="text-xs font-black text-red-400">{stats.attack}</span>
              </div>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-1.5 flex items-center gap-1.5">
              <div className="p-1 rounded bg-sky-950/80 text-sky-400 border border-sky-900/50 shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] uppercase font-bold text-zinc-400 block truncate">Defense</span>
                <span className="text-xs font-black text-sky-400">{stats.defense}</span>
              </div>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-1.5 flex items-center gap-1.5">
              <div className="p-1 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-900/50 shrink-0">
                <Gauge className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] uppercase font-bold text-zinc-400 block truncate">Atk Spd</span>
                <span className="text-xs font-black text-cyan-400">{stats.atkSpeed}/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Era Resonance & Set Synergy */}
      {activeSynergies.length > 0 && (
        <div className="bg-zinc-950/60 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Era Affinity:</span>
          </div>
          <div className="flex flex-wrap gap-1 items-center justify-end">
            {activeSynergies.map(({ civ, count }) => (
              <span
                key={civ.id}
                className="text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1"
                style={{
                  color: civ.color,
                  borderColor: `${civ.color}50`,
                  backgroundColor: `${civ.color}15`,
                }}
              >
                <span>{civ.name}</span>
                <span className="font-black opacity-80">({count}/5)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Combat Effects & Attributes Summary */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 p-2.5 rounded-xl">
        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1 text-zinc-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Combat Attributes & Modifiers</span>
          </div>
          <span className="text-[8px] text-zinc-500 font-mono">CRIT DMG: {stats.critDmg}%</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 text-[9px] sm:text-[10px]">
          <div className="bg-zinc-900/80 border border-amber-500/20 px-1.5 py-1 rounded-md flex items-center gap-1 text-amber-300 font-bold truncate">
            <Zap className="w-3 h-3 shrink-0" />
            <span className="truncate">{stats.critRate}% Crit</span>
          </div>
          <div className="bg-zinc-900/80 border border-sky-500/20 px-1.5 py-1 rounded-md flex items-center gap-1 text-sky-300 font-bold truncate">
            <Wind className="w-3 h-3 shrink-0" />
            <span className="truncate">{stats.dodgeRate}% Dodge</span>
          </div>
          <div className="bg-zinc-900/80 border border-cyan-500/20 px-1.5 py-1 rounded-md flex items-center gap-1 text-cyan-300 font-bold truncate">
            <Gauge className="w-3 h-3 shrink-0" />
            <span className="truncate">{stats.bonusAtkSpeedPct >= 0 ? `+${stats.bonusAtkSpeedPct}%` : `${stats.bonusAtkSpeedPct}%`} Spd</span>
          </div>
          {stats.burnChance > 0 && (
            <div className="bg-zinc-900/80 border border-red-500/20 px-1.5 py-1 rounded-md flex items-center gap-1 text-red-400 font-bold truncate">
              <Flame className="w-3 h-3 shrink-0" />
              <span className="truncate">{stats.burnChance}% Burn</span>
            </div>
          )}
          {stats.poisonChance > 0 && (
            <div className="bg-zinc-900/80 border border-emerald-500/20 px-1.5 py-1 rounded-md flex items-center gap-1 text-emerald-400 font-bold truncate">
              <Skull className="w-3 h-3 shrink-0" />
              <span className="truncate">{stats.poisonChance}% Toxic</span>
            </div>
          )}
          {stats.lifeSteal > 0 && (
            <div className="bg-zinc-900/80 border border-pink-500/20 px-1.5 py-1 rounded-md flex items-center gap-1 text-pink-400 font-bold truncate">
              <HeartHandshake className="w-3 h-3 shrink-0" />
              <span className="truncate">{stats.lifeSteal}% Leech</span>
            </div>
          )}
          {stats.rangeFirstStrike > 0 && (
            <div className="bg-zinc-900/80 border border-purple-500/20 px-1.5 py-1 rounded-md flex items-center gap-1 text-purple-400 font-bold truncate">
              <Crosshair className="w-3 h-3 shrink-0" />
              <span className="truncate">{stats.rangeFirstStrike}% Range</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Ruby Blessings & Tech Resonances Row */}
      {((state.blessings && state.blessings.length > 0) || (state.multiForgeLevel && state.multiForgeLevel > 1) || Object.values(state.techTree || {}).some((v) => v > 0)) && (
        <div className="bg-rose-950/25 border border-rose-500/25 p-2 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="text-[9px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1">
              <Gem className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>Relics & Cybernetics</span>
            </div>
            {Object.values(state.techTree || {}).reduce((a, b) => a + b, 0) > 0 && (
              <span className="text-[9px] font-black text-purple-300 flex items-center gap-1 bg-purple-950/80 border border-purple-500/40 px-1.5 py-0.5 rounded">
                <Cpu className="w-2.5 h-2.5 text-purple-400" />
                {Object.values(state.techTree || {}).reduce((a, b) => a + b, 0)} Tech Nodes Active
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {(state.multiForgeLevel || 1) > 1 && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-amber-500/50 text-[9px] font-bold text-amber-300">
                ⚡ Multi-Forge ({state.multiForgeLevel}x Matrix)
              </span>
            )}
            {(state.blessings || []).map((b) => (
              <span
                key={b}
                className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-rose-500/40 text-[9px] font-bold text-rose-300"
              >
                {b === 'midas_ruby' && '🪙 Midas (+30% Gold)'}
                {b === 'dragon_heart' && '🔥 Dragon (+18% ATK)'}
                {b === 'valkyrie_feather' && '⚡ Valkyrie (+12% Crit)'}
                {b === 'vampiric_blood' && '🩸 Blood (+12% Leech)'}
                {b === 'titan_fortress' && '🛡️ Titan (+25% HP)'}
                {b === 'scrap_sigil' && '⚙️ Sigil (+50% Scrap)'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Slots (Compact 5-Slot Equipment Bar) */}
      <div className="space-y-1.5 mt-auto">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Equipped Gear</h3>
            <span className="text-[10px] text-zinc-500">(5 slots)</span>
          </div>
          <span className="text-[10px] text-amber-400/90 font-medium flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Tap for full details
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
          <EquipmentCard
            item={state.equipped.weapon}
            label="Weapon"
            onClick={() => {
              soundFx.playButtonClick();
              setInspectItem(state.equipped.weapon);
            }}
          />
          <EquipmentCard
            item={state.equipped.helmet}
            label="Helmet"
            onClick={() => {
              soundFx.playButtonClick();
              setInspectItem(state.equipped.helmet);
            }}
          />
          <EquipmentCard
            item={state.equipped.armor}
            label="Armor"
            onClick={() => {
              soundFx.playButtonClick();
              setInspectItem(state.equipped.armor);
            }}
          />
          <EquipmentCard
            item={state.equipped.gloves}
            label="Gloves"
            onClick={() => {
              soundFx.playButtonClick();
              setInspectItem(state.equipped.gloves);
            }}
          />
          <EquipmentCard
            item={state.equipped.boots}
            label="Boots"
            onClick={() => {
              soundFx.playButtonClick();
              setInspectItem(state.equipped.boots);
            }}
          />
        </div>
      </div>

      {/* Equipment Inspect Modal */}
      <GearDetailModal
        isOpen={!!inspectItem}
        onClose={() => setInspectItem(null)}
        item={inspectItem}
      />
    </div>
  );
};
