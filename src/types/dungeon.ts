import type { BattleEvent, PlayerCombatStats } from '../hooks/useAutoForge';

export interface DungeonWaveEnemy {
  id: number;
  name: string;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  atkSpeed: number;
  type: 'drone' | 'sentinel' | 'glitch' | 'behemoth' | 'sovereign_boss';
  color: string;
}

export interface DungeonWaveInfo {
  waveNumber: number; // 1 to 5
  totalWaves: number; // 5
  title: string;
  isBossWave: boolean;
  enemies: DungeonWaveEnemy[];
  environmentTheme: string;
}

export interface DungeonClearReward {
  techCores: number;
  gems: number;
  gold: number;
  scrap: number;
}

export interface DungeonWaveResult {
  waveNumber: number;
  win: boolean;
  timedOut: boolean;
  playerHpLeft: number;
  playerMaxHp: number;
  enemies: DungeonWaveEnemy[];
  events: BattleEvent[];
}

export interface DungeonRunResult {
  completed: boolean;
  wavesCleared: number;
  totalWaves: number;
  rewards?: DungeonClearReward;
  waveResults: DungeonWaveResult[];
}

export interface DungeonTierConfig {
  tier: number; // 1 to 10
  name: string;
  eraName: string;
  recommendedPower: number;
  baseTechCores: number;
  baseGems: number;
  baseGold: number;
  baseScrap: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}

export interface DungeonRiskInfo {
  level: 'safe' | 'moderate' | 'high_risk' | 'deadly';
  ratio: number;
  ratioPercent: number;
  label: string;
  tag: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
  glowColor: string;
  warningText: string;
  lossRiskText: string;
  isHighRisk: boolean;
}

export const DUNGEON_TIERS: DungeonTierConfig[] = [
  {
    tier: 1,
    name: 'Primitive Ruin Vault',
    eraName: 'Primitive',
    recommendedPower: 800,
    baseTechCores: 10,
    baseGems: 6,
    baseGold: 350,
    baseScrap: 150,
    color: '#a78bfa',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-700/60',
    badgeText: 'text-amber-300',
    description: 'An overgrown stone sanctuary from the dawn of time.',
  },
  {
    tier: 2,
    name: 'Ancient Pharaoh Crypt',
    eraName: 'Ancient',
    recommendedPower: 1800,
    baseTechCores: 16,
    baseGems: 9,
    baseGold: 800,
    baseScrap: 300,
    color: '#38bdf8',
    badgeBg: 'bg-sky-950/80',
    badgeBorder: 'border-sky-700/60',
    badgeText: 'text-sky-300',
    description: 'A subterranean gold-gilded tomb buzzing with chrono-energy.',
  },
  {
    tier: 3,
    name: 'Antiquity Colosseum Rift',
    eraName: 'Antiquity',
    recommendedPower: 3800,
    baseTechCores: 24,
    baseGems: 13,
    baseGold: 1800,
    baseScrap: 600,
    color: '#22c55e',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-700/60',
    badgeText: 'text-emerald-300',
    description: 'A gladiator arena forged inside an unstable spacetime breach.',
  },
  {
    tier: 4,
    name: 'Norman Fortress Sanctum',
    eraName: 'Norman',
    recommendedPower: 7500,
    baseTechCores: 34,
    baseGems: 18,
    baseGold: 3800,
    baseScrap: 1200,
    color: '#eab308',
    badgeBg: 'bg-yellow-950/80',
    badgeBorder: 'border-yellow-700/60',
    badgeText: 'text-yellow-300',
    description: 'A fortified citadel guarded by heavily armored rift wardens.',
  },
  {
    tier: 5,
    name: 'Medieval Citadel Core',
    eraName: 'Middle Ages',
    recommendedPower: 14500,
    baseTechCores: 46,
    baseGems: 24,
    baseGold: 8000,
    baseScrap: 2400,
    color: '#ec4899',
    badgeBg: 'bg-pink-950/80',
    badgeBorder: 'border-pink-700/60',
    badgeText: 'text-pink-300',
    description: 'The burning crucible of chivalric guardians and gothic mechs.',
  },
  {
    tier: 6,
    name: 'Renaissance Chrono-Keep',
    eraName: 'Renaissance',
    recommendedPower: 28000,
    baseTechCores: 60,
    baseGems: 32,
    baseGold: 18000,
    baseScrap: 4800,
    color: '#a855f7',
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-700/60',
    badgeText: 'text-purple-300',
    description: 'An intricate palace of astronomical clockwork and arcane lenses.',
  },
  {
    tier: 7,
    name: 'Industrial Engine Matrix',
    eraName: 'Industrial',
    recommendedPower: 52000,
    baseTechCores: 78,
    baseGems: 42,
    baseGold: 40000,
    baseScrap: 9500,
    color: '#06b6d4',
    badgeBg: 'bg-cyan-950/80',
    badgeBorder: 'border-cyan-700/60',
    badgeText: 'text-cyan-300',
    description: 'High-pressure steam turbines powering heavy mechanical sentinels.',
  },
  {
    tier: 8,
    name: 'Modern Cyber Vault',
    eraName: 'Modern',
    recommendedPower: 95000,
    baseTechCores: 100,
    baseGems: 55,
    baseGold: 90000,
    baseScrap: 18000,
    color: '#6366f1',
    badgeBg: 'bg-indigo-950/80',
    badgeBorder: 'border-indigo-700/60',
    badgeText: 'text-indigo-300',
    description: 'Reinforced bunker lined with high-frequency laser barriers.',
  },
  {
    tier: 9,
    name: 'Digitalization Nexus',
    eraName: 'Digitalization',
    recommendedPower: 175000,
    baseTechCores: 130,
    baseGems: 72,
    baseGold: 200000,
    baseScrap: 35000,
    color: '#f97316',
    badgeBg: 'bg-orange-950/80',
    badgeBorder: 'border-orange-700/60',
    badgeText: 'text-orange-300',
    description: 'A pure holographic data dimension crawling with hyper-predators.',
  },
  {
    tier: 10,
    name: 'Cosmic Sovereign Abyss',
    eraName: 'Space',
    recommendedPower: 320000,
    baseTechCores: 175,
    baseGems: 95,
    baseGold: 450000,
    baseScrap: 70000,
    color: '#d946ef',
    badgeBg: 'bg-fuchsia-950/80',
    badgeBorder: 'border-fuchsia-700/60',
    badgeText: 'text-fuchsia-300',
    description: 'The epicenter of spacetime where the Prime Chrono Titan dwells.',
  },
];

export function getDungeonTierConfig(tier: number): DungeonTierConfig {
  const bounded = Math.max(1, Math.min(10, tier));
  return DUNGEON_TIERS[bounded - 1] || DUNGEON_TIERS[0];
}

export function getDungeonRiskLevel(playerPower: number, recommendedPower: number, tier = 1): DungeonRiskInfo {
  const safeRec = Math.max(1, recommendedPower);
  const ratio = playerPower / safeRec;
  const ratioPercent = Math.round(ratio * 100);

  if (ratio >= 1.15) {
    return {
      level: 'safe',
      ratio,
      ratioPercent,
      label: 'Safe (Advantage)',
      tag: 'FAVORABLE',
      badgeBg: 'bg-emerald-950/80',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-500/50',
      barColor: 'from-emerald-500 to-green-400',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      warningText: 'Your hero power surpasses this Dungeon Level. Keystone is very safe.',
      lossRiskText: 'Low Risk (~5% Key Loss Chance)',
      isHighRisk: false,
    };
  } else if (ratio >= 0.90) {
    return {
      level: 'moderate',
      ratio,
      ratioPercent,
      label: 'Moderate (Even Match)',
      tag: 'BALANCED',
      badgeBg: 'bg-amber-950/80',
      badgeText: 'text-amber-300',
      badgeBorder: 'border-amber-500/50',
      barColor: 'from-amber-500 to-yellow-400',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      warningText: 'Even match against Vault guardians. Stay vigilant to protect your Keystone.',
      lossRiskText: 'Moderate Risk (~25% Key Loss Chance)',
      isHighRisk: false,
    };
  } else if (ratio >= 0.70) {
    return {
      level: 'high_risk',
      ratio,
      ratioPercent,
      label: 'High Risk (Underpowered)',
      tag: 'DANGER',
      badgeBg: 'bg-orange-950/90',
      badgeText: 'text-orange-300',
      badgeBorder: 'border-orange-500/60',
      barColor: 'from-orange-500 to-amber-500',
      glowColor: 'rgba(249, 115, 22, 0.5)',
      warningText: `⚠️ WARNING: Hero Power is below Dungeon Level ${tier}! Defeat will PERMANENTLY consume your Ancient Keystone with 0 rewards!`,
      lossRiskText: 'High Key Loss Risk (~60% Loss Chance)',
      isHighRisk: true,
    };
  } else {
    return {
      level: 'deadly',
      ratio,
      ratioPercent,
      label: 'Extreme Danger (Lethal)',
      tag: 'EXTREME RISK',
      badgeBg: 'bg-rose-950/90',
      badgeText: 'text-rose-300',
      badgeBorder: 'border-rose-500/70',
      barColor: 'from-rose-600 to-red-500',
      glowColor: 'rgba(244, 63, 94, 0.6)',
      warningText: `☠️ CRITICAL WARNING: You are severely underpowered for Dungeon Level ${tier}! Entering this vault will very likely destroy your Ancient Keystone!`,
      lossRiskText: 'Critical Risk (85%+ Key Loss Chance)',
      isHighRisk: true,
    };
  }
}

// Generate the 5 waves for a dungeon run based on chosen Dungeon Tier/Level
export function generateDungeonWaves(tier: number, _playerStats?: PlayerCombatStats): DungeonWaveInfo[] {
  const boundedTier = Math.max(1, Math.min(10, tier));
  const civMultipliers = [1.0, 1.8, 3.2, 5.5, 9.5, 16.0, 28.0, 48.0, 82.0, 140.0];
  const civMult = civMultipliers[boundedTier - 1] || 1.0;

  // Base calibrated stats per Dungeon Level
  const baseHp = Math.floor(160 * civMult);
  const baseAtk = Math.floor(20 * civMult);
  const baseDef = Math.floor(8 * civMult);

  const waves: DungeonWaveInfo[] = [];

  // Wave 1: Chrono-Drone Swarm (3 agile flying drones)
  waves.push({
    waveNumber: 1,
    totalWaves: 5,
    title: `Wave 1: Chrono-Drone Swarm (Lvl ${boundedTier})`,
    isBossWave: false,
    environmentTheme: 'ancient_outer_gate',
    enemies: [
      {
        id: 0,
        name: 'Chrono-Drone Alpha',
        maxHp: Math.max(35, Math.floor(baseHp * 0.45)),
        hp: Math.max(35, Math.floor(baseHp * 0.45)),
        atk: Math.max(4, Math.floor(baseAtk * 0.45)),
        def: Math.max(1, Math.floor(baseDef * 0.4)),
        atkSpeed: 1.2,
        type: 'drone',
        color: '#38bdf8',
      },
      {
        id: 1,
        name: 'Chrono-Drone Beta',
        maxHp: Math.max(35, Math.floor(baseHp * 0.45)),
        hp: Math.max(35, Math.floor(baseHp * 0.45)),
        atk: Math.max(4, Math.floor(baseAtk * 0.45)),
        def: Math.max(1, Math.floor(baseDef * 0.4)),
        atkSpeed: 1.15,
        type: 'drone',
        color: '#38bdf8',
      },
      {
        id: 2,
        name: 'Chrono-Drone Gamma',
        maxHp: Math.max(35, Math.floor(baseHp * 0.45)),
        hp: Math.max(35, Math.floor(baseHp * 0.45)),
        atk: Math.max(4, Math.floor(baseAtk * 0.45)),
        def: Math.max(1, Math.floor(baseDef * 0.4)),
        atkSpeed: 1.25,
        type: 'drone',
        color: '#38bdf8',
      },
    ],
  });

  // Wave 2: Void Mech Sentinels (2 heavy armored sentinels)
  waves.push({
    waveNumber: 2,
    totalWaves: 5,
    title: `Wave 2: Void Mech Sentinels (Lvl ${boundedTier})`,
    isBossWave: false,
    environmentTheme: 'sentinel_corridor',
    enemies: [
      {
        id: 0,
        name: 'Void Sentinel Aegis',
        maxHp: Math.max(65, Math.floor(baseHp * 0.85)),
        hp: Math.max(65, Math.floor(baseHp * 0.85)),
        atk: Math.max(7, Math.floor(baseAtk * 0.65)),
        def: Math.max(3, Math.floor(baseDef * 0.85)),
        atkSpeed: 0.95,
        type: 'sentinel',
        color: '#818cf8',
      },
      {
        id: 1,
        name: 'Void Sentinel Striker',
        maxHp: Math.max(55, Math.floor(baseHp * 0.75)),
        hp: Math.max(55, Math.floor(baseHp * 0.75)),
        atk: Math.max(8, Math.floor(baseAtk * 0.75)),
        def: Math.max(2, Math.floor(baseDef * 0.7)),
        atkSpeed: 1.05,
        type: 'sentinel',
        color: '#818cf8',
      },
    ],
  });

  // Wave 3: Glitch Horror Constructs (3 chaotic bio-digital beasts)
  waves.push({
    waveNumber: 3,
    totalWaves: 5,
    title: `Wave 3: Glitch Horror Pack (Lvl ${boundedTier})`,
    isBossWave: false,
    environmentTheme: 'abyssal_rift_chamber',
    enemies: [
      {
        id: 0,
        name: 'Glitch Stalker',
        maxHp: Math.max(50, Math.floor(baseHp * 0.65)),
        hp: Math.max(50, Math.floor(baseHp * 0.65)),
        atk: Math.max(8, Math.floor(baseAtk * 0.75)),
        def: Math.max(2, Math.floor(baseDef * 0.55)),
        atkSpeed: 1.3,
        type: 'glitch',
        color: '#f43f5e',
      },
      {
        id: 1,
        name: 'Glitch Ravager',
        maxHp: Math.max(55, Math.floor(baseHp * 0.7)),
        hp: Math.max(55, Math.floor(baseHp * 0.7)),
        atk: Math.max(9, Math.floor(baseAtk * 0.85)),
        def: Math.max(2, Math.floor(baseDef * 0.6)),
        atkSpeed: 1.2,
        type: 'glitch',
        color: '#f43f5e',
      },
      {
        id: 2,
        name: 'Glitch Spitter',
        maxHp: Math.max(45, Math.floor(baseHp * 0.6)),
        hp: Math.max(45, Math.floor(baseHp * 0.6)),
        atk: Math.max(9, Math.floor(baseAtk * 0.9)),
        def: Math.max(1, Math.floor(baseDef * 0.5)),
        atkSpeed: 1.35,
        type: 'glitch',
        color: '#f43f5e',
      },
    ],
  });

  // Wave 4: Rift Behemoth Mini-Boss (1 colossal guardian)
  waves.push({
    waveNumber: 4,
    totalWaves: 5,
    title: `Wave 4: Rift Behemoth Colossus (Lvl ${boundedTier})`,
    isBossWave: false,
    environmentTheme: 'inner_sanctum_approach',
    enemies: [
      {
        id: 0,
        name: `Rift Behemoth Colossus Lvl ${boundedTier}`,
        maxHp: Math.max(180, Math.floor(baseHp * 2.2)),
        hp: Math.max(180, Math.floor(baseHp * 2.2)),
        atk: Math.max(14, Math.floor(baseAtk * 1.05)),
        def: Math.max(4, Math.floor(baseDef * 1.1)),
        atkSpeed: 0.95,
        type: 'behemoth',
        color: '#c084fc',
      },
    ],
  });

  // Wave 5: THE FINAL DUNGEON BOSS - The Chrono Sovereign Titan
  waves.push({
    waveNumber: 5,
    totalWaves: 5,
    title: `Final Boss: Chrono Sovereign Titan (Lvl ${boundedTier})`,
    isBossWave: true,
    environmentTheme: 'chrono_core_nexus',
    enemies: [
      {
        id: 0,
        name: `Ancient Chrono Sovereign Titan (Lvl ${boundedTier})`,
        maxHp: Math.max(350, Math.floor(baseHp * 4.0)),
        hp: Math.max(350, Math.floor(baseHp * 4.0)),
        atk: Math.max(20, Math.floor(baseAtk * 1.35)),
        def: Math.max(6, Math.floor(baseDef * 1.3)),
        atkSpeed: 1.05,
        type: 'sovereign_boss',
        color: '#ec4899',
      },
    ],
  });

  return waves;
}
