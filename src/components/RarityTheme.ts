import type { Rarity } from '../hooks/useAutoForge';

export interface RarityConfig {
  name: Rarity;
  color: string;
  bg: string;
  border: string;
  glow: string;
  badgeBg: string;
  text: string;
}

export const RARITY_CONFIGS: Record<Rarity, RarityConfig> = {
  Common: {
    name: 'Common',
    color: '#94a3b8',
    bg: 'from-zinc-900 to-zinc-950',
    border: 'border-zinc-700',
    glow: 'shadow-zinc-700/20',
    badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    text: 'text-zinc-300',
  },
  Rare: {
    name: 'Rare',
    color: '#38bdf8',
    bg: 'from-sky-950/50 to-zinc-950',
    border: 'border-sky-500/50',
    glow: 'shadow-sky-500/25',
    badgeBg: 'bg-sky-950 text-sky-300 border-sky-600/50',
    text: 'text-sky-400',
  },
  Epic: {
    name: 'Epic',
    color: '#c084fc',
    bg: 'from-purple-950/50 to-zinc-950',
    border: 'border-purple-500/60',
    glow: 'shadow-purple-500/30',
    badgeBg: 'bg-purple-950 text-purple-300 border-purple-600/50',
    text: 'text-purple-400',
  },
  Legendary: {
    name: 'Legendary',
    color: '#fbbf24',
    bg: 'from-amber-950/60 to-zinc-950',
    border: 'border-amber-500/70',
    glow: 'shadow-amber-500/40',
    badgeBg: 'bg-amber-950 text-amber-300 border-amber-600/60',
    text: 'text-amber-400',
  },
  Mythic: {
    name: 'Mythic',
    color: '#f43f5e',
    bg: 'from-rose-950/70 to-zinc-950',
    border: 'border-rose-500/80',
    glow: 'shadow-rose-500/50',
    badgeBg: 'bg-rose-950 text-rose-300 border-rose-600/70 animate-pulse',
    text: 'text-rose-400',
  },
};
