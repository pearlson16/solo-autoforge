export type TechBranch = 'combat' | 'forging' | 'dungeon';

export interface TechNodeDefinition {
  id: string;
  name: string;
  branch: TechBranch;
  tier: number; // 1 to 4
  maxLevel: number;
  baseCost: number; // base tech cores
  costMultiplier: number; // cost scaling per level
  iconName: string;
  color: string;
  title: string;
  description: string;
  requiresNodeId?: string;
  requiresNodeLevel?: number;
  
  // Stat bonuses per level
  atkPctPerLevel?: number;
  hpPctPerLevel?: number;
  defPctPerLevel?: number;
  critRatePerLevel?: number;
  critDmgPerLevel?: number;
  atkSpeedPctPerLevel?: number;
  dodgeRatePerLevel?: number;
  lifeStealPerLevel?: number;
  rangeFirstStrikePerLevel?: number;
  
  // Forging bonuses per level
  rarityOddsMultPerLevel?: number; // % boost to rare/epic/legendary/mythic weight
  scrapBonusPctPerLevel?: number;  // % bonus scrap from salvage
  goldTickMultPerLevel?: number;   // % bonus passive gold/s
  modifierBonusPctPerLevel?: number; // % boost to gear modifier values
  
  // Dungeon & Exploration bonuses per level
  keyDropBonusPctPerLevel?: number; // % increased key drop rate in tower
  techCoreBonusPctPerLevel?: number; // % bonus tech cores from dungeon clears
  dungeonBonusAtkPctPerLevel?: number; // % bonus attack inside dungeon
  dungeonExtraGemsPerLevel?: number;   // extra gems per dungeon clear
}

export const TECH_NODES: TechNodeDefinition[] = [
  // ==========================================
  // 1. COMBAT BRANCH (Offensive & Defensive Cybernetics)
  // ==========================================
  {
    id: 'plasma_infusion',
    name: 'Plasma Infusion',
    branch: 'combat',
    tier: 1,
    maxLevel: 10,
    baseCost: 2,
    costMultiplier: 1.5,
    iconName: 'Zap',
    color: '#ef4444',
    title: 'Offensive Weapon Overclocking',
    description: 'Injects superheated plasma into weapons to exponentially increase attack power.',
    atkPctPerLevel: 6, // +6% ATK per level (up to +60%)
  },
  {
    id: 'nanite_plating',
    name: 'Nanite Plating',
    branch: 'combat',
    tier: 1,
    maxLevel: 10,
    baseCost: 2,
    costMultiplier: 1.5,
    iconName: 'Shield',
    color: '#3b82f6',
    title: 'Self-Repairing Armor Matrix',
    description: 'Infuses armor fibers with reactive nanites that fortify Max HP and physical Defense.',
    hpPctPerLevel: 8,  // +8% HP per level
    defPctPerLevel: 6, // +6% DEF per level
  },
  {
    id: 'temporal_accelerator',
    name: 'Temporal Accelerator',
    branch: 'combat',
    tier: 2,
    maxLevel: 8,
    baseCost: 4,
    costMultiplier: 1.6,
    iconName: 'Gauge',
    color: '#06b6d4',
    title: 'Sub-Atomic Speed Drive',
    description: 'Bends localized spacetime to accelerate attack speed and reaction reflexes.',
    requiresNodeId: 'plasma_infusion',
    requiresNodeLevel: 2,
    atkSpeedPctPerLevel: 4, // +4% Atk Speed per level
    dodgeRatePerLevel: 2,   // +2% Dodge per level
  },
  {
    id: 'hyper_optics',
    name: 'Hyper Optics',
    branch: 'combat',
    tier: 2,
    maxLevel: 8,
    baseCost: 4,
    costMultiplier: 1.6,
    iconName: 'Crosshair',
    color: '#fbbf24',
    title: 'Targeting HUD & Weakpoint Analysis',
    description: 'Calculates lethal vulnerabilities to drastically augment Critical Strike Rate and Damage.',
    requiresNodeId: 'plasma_infusion',
    requiresNodeLevel: 2,
    critRatePerLevel: 3, // +3% Crit Rate per level
    critDmgPerLevel: 18, // +18% Crit Dmg per level
  },
  {
    id: 'vampiric_nanobots',
    name: 'Vampiric Nanobots',
    branch: 'combat',
    tier: 3,
    maxLevel: 6,
    baseCost: 7,
    costMultiplier: 1.8,
    iconName: 'HeartHandshake',
    color: '#ec4899',
    title: 'Bio-Siphon Sanguine Extraction',
    description: 'Transmutes enemy life essence into immediate hero health restoration upon striking.',
    requiresNodeId: 'nanite_plating',
    requiresNodeLevel: 3,
    lifeStealPerLevel: 3,          // +3% Life Steal per level
    rangeFirstStrikePerLevel: 5,   // +5% First Strike chance per level
  },
  {
    id: 'apex_overdrive',
    name: 'Apex Overdrive',
    branch: 'combat',
    tier: 4,
    maxLevel: 5,
    baseCost: 12,
    costMultiplier: 2.0,
    iconName: 'Flame',
    color: '#f97316',
    title: 'Limit-Breaker Resonance Core',
    description: 'Ultimate cybernetic core awakening providing sweeping boosts across all combat systems.',
    requiresNodeId: 'temporal_accelerator',
    requiresNodeLevel: 3,
    atkPctPerLevel: 8,
    hpPctPerLevel: 10,
    critDmgPerLevel: 25,
  },

  // ==========================================
  // 2. FORGING & METALLURGY BRANCH
  // ==========================================
  {
    id: 'quantum_furnace',
    name: 'Quantum Furnace',
    branch: 'forging',
    tier: 1,
    maxLevel: 10,
    baseCost: 2,
    costMultiplier: 1.5,
    iconName: 'Flame',
    color: '#d946ef',
    title: 'High-Temperature Molecular Crucible',
    description: 'Alchemically supercharges the forge to significantly boost Rare, Epic, Legendary, and Mythic drop chances.',
    rarityOddsMultPerLevel: 12, // +12% increased high-tier rarity odds
  },
  {
    id: 'scrap_recycler',
    name: 'Scrap Recycler',
    branch: 'forging',
    tier: 1,
    maxLevel: 10,
    baseCost: 2,
    costMultiplier: 1.5,
    iconName: 'Sparkles',
    color: '#10b981',
    title: 'Atomized Salvage Efficiency',
    description: 'Refines metal salvaging procedures to yield massive extra Scrap from gear breakdown.',
    scrapBonusPctPerLevel: 15, // +15% bonus scrap per level
  },
  {
    id: 'gold_synthesizer',
    name: 'Gold Synthesizer',
    branch: 'forging',
    tier: 2,
    maxLevel: 8,
    baseCost: 4,
    costMultiplier: 1.6,
    iconName: 'Coins',
    color: '#eab308',
    title: 'Automated Currency Generation',
    description: 'Deploys micro-extractors that permanently elevate passive gold generation per second.',
    requiresNodeId: 'scrap_recycler',
    requiresNodeLevel: 2,
    goldTickMultPerLevel: 20, // +20% passive gold/s per level
  },
  {
    id: 'masterwork_tuning',
    name: 'Masterwork Tuning',
    branch: 'forging',
    tier: 3,
    maxLevel: 6,
    baseCost: 7,
    costMultiplier: 1.8,
    iconName: 'Sword',
    color: '#a855f7',
    title: 'Affix Resonance Calibration',
    description: 'Sharpens blacksmithing tools to grant higher base stat rolls and modifier values on all forged equipment.',
    requiresNodeId: 'quantum_furnace',
    requiresNodeLevel: 3,
    modifierBonusPctPerLevel: 8, // +8% higher modifier stat values
  },
  {
    id: 'celestial_foundry',
    name: 'Celestial Foundry',
    branch: 'forging',
    tier: 4,
    maxLevel: 5,
    baseCost: 12,
    costMultiplier: 2.0,
    iconName: 'Crown',
    color: '#f59e0b',
    title: 'Divine Smithing Core',
    description: 'The pinnacle of forging mastery, further amplifying high-rarity odds and crafting efficiency.',
    requiresNodeId: 'masterwork_tuning',
    requiresNodeLevel: 3,
    rarityOddsMultPerLevel: 20,
    scrapBonusPctPerLevel: 25,
  },

  // ==========================================
  // 3. DUNGEON & EXPLORATION BRANCH
  // ==========================================
  {
    id: 'key_finder',
    name: 'Key Finder Protocol',
    branch: 'dungeon',
    tier: 1,
    maxLevel: 10,
    baseCost: 2,
    costMultiplier: 1.5,
    iconName: 'Key',
    color: '#38bdf8',
    title: 'Dimensional Keystone Scanner',
    description: 'Increases the probability of discovering Ancient Keys after winning Tower battles.',
    keyDropBonusPctPerLevel: 1.5, // +1.5% key drop chance per level (e.g. 3% -> 18%)
  },
  {
    id: 'vault_siphon',
    name: 'Vault Siphon',
    branch: 'dungeon',
    tier: 1,
    maxLevel: 10,
    baseCost: 2,
    costMultiplier: 1.5,
    iconName: 'Cpu',
    color: '#a78bfa',
    title: 'Arcane Tech-Core Extractor',
    description: 'Extracts extra Tech Cores upon clearing the Ancient Vault Dungeon Boss.',
    techCoreBonusPctPerLevel: 15, // +15% more tech cores per dungeon clear
  },
  {
    id: 'rift_overdrive',
    name: 'Rift Overdrive',
    branch: 'dungeon',
    tier: 2,
    maxLevel: 8,
    baseCost: 4,
    costMultiplier: 1.6,
    iconName: 'Swords',
    color: '#f43f5e',
    title: 'Dimensional Combat Adaptation',
    description: 'Hero channels ambient rift energy inside the Dungeon, inflicting substantial bonus damage.',
    requiresNodeId: 'key_finder',
    requiresNodeLevel: 2,
    dungeonBonusAtkPctPerLevel: 12, // +12% bonus damage inside dungeons
  },
  {
    id: 'relic_resonance',
    name: 'Relic Resonance',
    branch: 'dungeon',
    tier: 3,
    maxLevel: 6,
    baseCost: 7,
    costMultiplier: 1.8,
    iconName: 'Gem',
    color: '#ec4899',
    title: 'Ruby Matrix Synchronizer',
    description: 'Dungeon Bosses release additional precious Rubies / Gems upon defeat.',
    requiresNodeId: 'vault_siphon',
    requiresNodeLevel: 3,
    dungeonExtraGemsPerLevel: 2, // +2 extra gems per dungeon clear
  },
  {
    id: 'singularity_mastery',
    name: 'Singularity Mastery',
    branch: 'dungeon',
    tier: 4,
    maxLevel: 5,
    baseCost: 12,
    costMultiplier: 2.0,
    iconName: 'Globe',
    color: '#8b5cf6',
    title: 'Master of the Abyssal Void',
    description: 'Grants mastery over the ancient rift, maximizing key drop rates, core extraction, and combat prowess.',
    requiresNodeId: 'rift_overdrive',
    requiresNodeLevel: 3,
    techCoreBonusPctPerLevel: 25,
    keyDropBonusPctPerLevel: 2.5,
    dungeonBonusAtkPctPerLevel: 15,
  },
];

export function calculateTechNodeCost(node: TechNodeDefinition, currentLevel: number): number {
  if (currentLevel >= node.maxLevel) return 0;
  return Math.max(1, Math.round(node.baseCost * Math.pow(node.costMultiplier, currentLevel)));
}

export interface ComputedTechBonuses {
  bonusAtkPct: number;
  bonusHpPct: number;
  bonusDefPct: number;
  bonusAtkSpeedPct: number;
  critRate: number;
  critDmg: number;
  dodgeRate: number;
  lifeSteal: number;
  rangeFirstStrike: number;
  rarityOddsMult: number;
  scrapBonusPct: number;
  goldTickMult: number;
  modifierBonusPct: number;
  keyDropBonusPct: number;
  techCoreBonusPct: number;
  dungeonBonusAtkPct: number;
  dungeonExtraGems: number;
}

export function computeTechBonuses(techTreeState: Record<string, number> = {}): ComputedTechBonuses {
  const bonuses: ComputedTechBonuses = {
    bonusAtkPct: 0,
    bonusHpPct: 0,
    bonusDefPct: 0,
    bonusAtkSpeedPct: 0,
    critRate: 0,
    critDmg: 0,
    dodgeRate: 0,
    lifeSteal: 0,
    rangeFirstStrike: 0,
    rarityOddsMult: 0,
    scrapBonusPct: 0,
    goldTickMult: 0,
    modifierBonusPct: 0,
    keyDropBonusPct: 0,
    techCoreBonusPct: 0,
    dungeonBonusAtkPct: 0,
    dungeonExtraGems: 0,
  };

  for (const node of TECH_NODES) {
    const level = techTreeState[node.id] || 0;
    if (level <= 0) continue;

    if (node.atkPctPerLevel) bonuses.bonusAtkPct += node.atkPctPerLevel * level;
    if (node.hpPctPerLevel) bonuses.bonusHpPct += node.hpPctPerLevel * level;
    if (node.defPctPerLevel) bonuses.bonusDefPct += node.defPctPerLevel * level;
    if (node.atkSpeedPctPerLevel) bonuses.bonusAtkSpeedPct += node.atkSpeedPctPerLevel * level;
    if (node.critRatePerLevel) bonuses.critRate += node.critRatePerLevel * level;
    if (node.critDmgPerLevel) bonuses.critDmg += node.critDmgPerLevel * level;
    if (node.dodgeRatePerLevel) bonuses.dodgeRate += node.dodgeRatePerLevel * level;
    if (node.lifeStealPerLevel) bonuses.lifeSteal += node.lifeStealPerLevel * level;
    if (node.rangeFirstStrikePerLevel) bonuses.rangeFirstStrike += node.rangeFirstStrikePerLevel * level;

    if (node.rarityOddsMultPerLevel) bonuses.rarityOddsMult += node.rarityOddsMultPerLevel * level;
    if (node.scrapBonusPctPerLevel) bonuses.scrapBonusPct += node.scrapBonusPctPerLevel * level;
    if (node.goldTickMultPerLevel) bonuses.goldTickMult += node.goldTickMultPerLevel * level;
    if (node.modifierBonusPctPerLevel) bonuses.modifierBonusPct += node.modifierBonusPctPerLevel * level;

    if (node.keyDropBonusPctPerLevel) bonuses.keyDropBonusPct += node.keyDropBonusPctPerLevel * level;
    if (node.techCoreBonusPctPerLevel) bonuses.techCoreBonusPct += node.techCoreBonusPctPerLevel * level;
    if (node.dungeonBonusAtkPctPerLevel) bonuses.dungeonBonusAtkPct += node.dungeonBonusAtkPctPerLevel * level;
    if (node.dungeonExtraGemsPerLevel) bonuses.dungeonExtraGems += node.dungeonExtraGemsPerLevel * level;
  }

  return bonuses;
}
