export type ModifierType =
  | 'atkSpeed'
  | 'critRate'
  | 'critDmg'
  | 'dodgeRate'
  | 'burnChance'
  | 'poisonChance'
  | 'lifeSteal'
  | 'rangeFirstStrike'
  | 'bonusAtkPct'
  | 'bonusDefPct'
  | 'bonusHpPct';

export interface Modifier {
  type: ModifierType;
  label: string;
  value: number; // e.g., 15 for 15%
  display: string;
  iconName: string;
  color: string;
}

export const MODIFIER_TEMPLATES: Record<
  ModifierType,
  { label: string; min: number; max: number; unit: string; iconName: string; color: string }
> = {
  atkSpeed: {
    label: 'Attack Speed',
    min: 8,
    max: 25,
    unit: '%',
    iconName: 'Gauge',
    color: '#06b6d4', // cyan
  },
  critRate: {
    label: 'Critical Rate',
    min: 5,
    max: 18,
    unit: '%',
    iconName: 'Zap',
    color: '#fbbf24', // yellow/amber
  },
  critDmg: {
    label: 'Critical Damage',
    min: 25,
    max: 75,
    unit: '%',
    iconName: 'Sparkles',
    color: '#f59e0b', // orange
  },
  dodgeRate: {
    label: 'Dodge Agility',
    min: 4,
    max: 14,
    unit: '%',
    iconName: 'Wind',
    color: '#38bdf8', // sky blue
  },
  burnChance: {
    label: 'Infernal Burn',
    min: 8,
    max: 22,
    unit: '%',
    iconName: 'Flame',
    color: '#ef4444', // red/flame
  },
  poisonChance: {
    label: 'Toxic Poison',
    min: 10,
    max: 25,
    unit: '%',
    iconName: 'Skull',
    color: '#10b981', // emerald
  },
  lifeSteal: {
    label: 'Vampiric Leech',
    min: 5,
    max: 15,
    unit: '%',
    iconName: 'HeartHandshake',
    color: '#ec4899', // pink/blood
  },
  rangeFirstStrike: {
    label: 'Sniper Range',
    min: 12,
    max: 30,
    unit: '%',
    iconName: 'Crosshair',
    color: '#a855f7', // purple
  },
  bonusAtkPct: {
    label: 'Bonus ATK',
    min: 6,
    max: 20,
    unit: '%',
    iconName: 'Sword',
    color: '#f87171', // light red
  },
  bonusDefPct: {
    label: 'Bonus DEF',
    min: 6,
    max: 20,
    unit: '%',
    iconName: 'Shield',
    color: '#60a5fa', // blue
  },
  bonusHpPct: {
    label: 'Bonus Max HP',
    min: 8,
    max: 25,
    unit: '%',
    iconName: 'Heart',
    color: '#34d399', // green
  },
};

export const RARITY_MODIFIER_COUNT: Record<string, number> = {
  Common: 0,
  Rare: 2,
  Epic: 3,
  Legendary: 5,
  Mythic: 6,
};

export function rollModifiersForRarity(rarity: string, potencyBonusPct: number = 0): Modifier[] {
  const count = RARITY_MODIFIER_COUNT[rarity] || 0;
  if (count <= 0) return [];

  const types = Object.keys(MODIFIER_TEMPLATES) as ModifierType[];
  // Shuffle available types
  const shuffled = [...types].sort(() => Math.random() - 0.5);
  const pickedTypes = shuffled.slice(0, count);

  return pickedTypes.map((type) => {
    const template = MODIFIER_TEMPLATES[type];
    const multiplier = 1 + potencyBonusPct / 100;
    const minVal = Math.round(template.min * multiplier);
    const maxVal = Math.round(template.max * multiplier);
    const val = Math.floor(minVal + Math.random() * (maxVal - minVal + 1));
    return {
      type,
      label: template.label,
      value: val,
      display: `+${val}${template.unit} ${template.label}`,
      iconName: template.iconName,
      color: template.color,
    };
  });
}
