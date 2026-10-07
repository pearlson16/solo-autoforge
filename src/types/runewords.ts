import type { Modifier } from './modifiers';

export type GemType = 'Ruby' | 'Sapphire' | 'Topaz' | 'Amethyst' | 'Emerald';

export interface Gem {
  id: string;
  type: GemType;
  name: string;
  tier: number; // 1: Flawless, 2: Radiant, 3: Cosmic
  color: string;
  glowColor: string;
  iconName: string;
  element: 'Fire' | 'Ice' | 'Lightning' | 'Void' | 'Toxic';
  bonusStatLabel: string;
  bonusValue: number; // e.g. +10% Burn or +15% ATK
  modifier: Modifier;
}

export const GEM_DEFINITIONS: Record<GemType, {
  name: string;
  element: 'Fire' | 'Ice' | 'Lightning' | 'Void' | 'Toxic';
  color: string;
  glowColor: string;
  iconName: string;
  statLabel: string;
  baseModifierType: Modifier['type'];
  baseValue: number; // per tier multiplier
}> = {
  Ruby: {
    name: 'Ruby of Infernal Flame',
    element: 'Fire',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    iconName: 'Flame',
    statLabel: '+Burn & Fire Damage',
    baseModifierType: 'burnChance',
    baseValue: 12,
  },
  Sapphire: {
    name: 'Sapphire of Glacial Frost',
    element: 'Ice',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    iconName: 'Snowflake',
    statLabel: '+Dodge & Frost Armor',
    baseModifierType: 'dodgeRate',
    baseValue: 10,
  },
  Topaz: {
    name: 'Topaz of Storming Thunder',
    element: 'Lightning',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    iconName: 'Zap',
    statLabel: '+Atk Speed & Crit',
    baseModifierType: 'atkSpeed',
    baseValue: 12,
  },
  Amethyst: {
    name: 'Amethyst of Shadow Void',
    element: 'Void',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    iconName: 'Sparkles',
    statLabel: '+Vampiric Life Steal',
    baseModifierType: 'lifeSteal',
    baseValue: 10,
  },
  Emerald: {
    name: 'Emerald of Toxic Venom',
    element: 'Toxic',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    iconName: 'Skull',
    statLabel: '+Toxic Poison & Max HP',
    baseModifierType: 'poisonChance',
    baseValue: 15,
  },
};

export interface Runeword {
  id: string;
  name: string;
  title: string;
  recipe: GemType[]; // Combination of gems required, e.g. ['Ruby', 'Topaz', 'Ruby']
  color: string;
  bgGlow: string;
  description: string;
  bonusAtkPct: number;
  bonusDefPct: number;
  bonusHpPct: number;
  bonusCritRate: number;
  specialAura: string;
}

export const RUNEWORD_RECIPES: Runeword[] = [
  {
    id: 'infernal_storm',
    name: 'INFERNAL STORM',
    title: 'Scorching Flame Aura',
    recipe: ['Ruby', 'Topaz', 'Ruby'],
    color: '#f97316',
    bgGlow: 'rgba(249, 115, 22, 0.3)',
    description: 'Envelops the weapon in roaring infernal embers. Deals massive Fire DOT and unleashes critical flame bursts.',
    bonusAtkPct: 35,
    bonusDefPct: 10,
    bonusHpPct: 15,
    bonusCritRate: 15,
    specialAura: 'Flame Shockwave on Critical Hits',
  },
  {
    id: 'glacial_fortress',
    name: 'GLACIAL FORTRESS',
    title: 'Absolute Zero Barrier',
    recipe: ['Sapphire', 'Sapphire', 'Emerald'],
    color: '#38bdf8',
    bgGlow: 'rgba(56, 189, 248, 0.3)',
    description: 'Creates a barrier of indestructible sub-zero ice crystals that reflects incoming damage and boosts armor.',
    bonusAtkPct: 10,
    bonusDefPct: 40,
    bonusHpPct: 35,
    bonusCritRate: 5,
    specialAura: 'Freezing Counterattack aura when hit',
  },
  {
    id: 'void_reaper',
    name: 'VOID REAPER',
    title: 'Shadow Leech Pulse',
    recipe: ['Amethyst', 'Amethyst', 'Topaz'],
    color: '#c084fc',
    bgGlow: 'rgba(192, 132, 252, 0.3)',
    description: 'Siphons life essence directly from slain foes to continuously heal the hero and accelerate attack speed.',
    bonusAtkPct: 30,
    bonusDefPct: 15,
    bonusHpPct: 20,
    bonusCritRate: 20,
    specialAura: 'Instant 20% Vampiric Heal on Boss Kill',
  },
  {
    id: 'celestial_sovereign',
    name: 'CELESTIAL SOVEREIGN',
    title: 'Cosmic Singularity Nova',
    recipe: ['Topaz', 'Amethyst', 'Ruby'],
    color: '#f43f5e',
    bgGlow: 'rgba(244, 63, 94, 0.35)',
    description: 'Awakens ancient star matter. Grants godlike attack power and elemental dominance across all battles.',
    bonusAtkPct: 50,
    bonusDefPct: 25,
    bonusHpPct: 25,
    bonusCritRate: 25,
    specialAura: 'Cosmic Beam Strike every 3 seconds',
  },
  {
    id: 'toxic_viper',
    name: 'TOXIC VIPER',
    title: 'Corrosive Venom Miasma',
    recipe: ['Emerald', 'Ruby', 'Emerald'],
    color: '#34d399',
    bgGlow: 'rgba(52, 211, 153, 0.3)',
    description: 'Coats equipment in deadly corrosive acid that melts enemy armor and inflicts stacking damage over time.',
    bonusAtkPct: 25,
    bonusDefPct: 20,
    bonusHpPct: 30,
    bonusCritRate: 10,
    specialAura: 'Corrosive Miasma dealing 15% Max HP DOT',
  },
];

// Helper to check if a list of socketed gems matches any Runeword recipe
export function detectRuneword(gemTypes: GemType[]): Runeword | null {
  if (gemTypes.length < 2) return null;
  const sortedInput = [...gemTypes].sort().join(',');
  for (const rw of RUNEWORD_RECIPES) {
    if (rw.recipe.length === gemTypes.length) {
      const sortedRecipe = [...rw.recipe].sort().join(',');
      if (sortedInput === sortedRecipe) {
        return rw;
      }
    }
  }
  return null;
}
