import { useState, useEffect, useRef } from 'react';
import type { Modifier } from '../types/modifiers';
import { rollModifiersForRarity } from '../types/modifiers';
import { TECH_NODES, computeTechBonuses, calculateTechNodeCost } from '../types/techTree';
import type { DungeonWaveInfo, DungeonWaveEnemy, DungeonClearReward, DungeonWaveResult } from '../types/dungeon';
import { generateDungeonWaves } from '../types/dungeon';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export type CivilizationId =
  | 'Primitive'
  | 'Ancient'
  | 'Antiquity'
  | 'Norman'
  | 'Middle Ages'
  | 'Renaissance'
  | 'Industrial'
  | 'Modern'
  | 'Digitalization'
  | 'Space';

export interface CivilizationInfo {
  id: CivilizationId;
  name: string;
  tier: number;
  color: string;
  bgBadge: string;
  borderColor: string;
  iconName: string;
  multiplier: number;
  weapons: string[];
  armors: string[];
  helmets: string[];
  gloves: string[];
  boots: string[];
}

export const CIVILIZATIONS: CivilizationInfo[] = [
  {
    id: 'Primitive',
    name: 'Primitive',
    tier: 1,
    color: '#a78bfa',
    bgBadge: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
    borderColor: 'border-amber-700/60',
    iconName: 'Axe',
    multiplier: 1.0,
    weapons: ['Flint Dagger', 'Stone Hatchet', 'Bone Club', 'Crude Spear'],
    armors: ['Tattered Tunic', 'Fur Cloak', 'Beast Hide', 'Rawhide Vest'],
    helmets: ['Bone Headband', 'Skull Cap', 'Beast Pelt Hood', 'Fang Charm Circlet'],
    gloves: ['Hide Wraps', 'Sinew Mittens', 'Bone Knuckles', 'Fur Hand-Wraps'],
    boots: ['Leather Foot-Wraps', 'Hide Leggings', 'Fur Moccasins', 'Bone-Shin Wraps'],
  },
  {
    id: 'Ancient',
    name: 'Ancient',
    tier: 2,
    color: '#38bdf8',
    bgBadge: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
    borderColor: 'border-sky-500/60',
    iconName: 'Sparkles',
    multiplier: 1.8,
    weapons: ['Bronze Scimitar', 'Copper Spear', 'Obsidian Blade', 'Pharaoh Khopesh'],
    armors: ['Bronze Cuirass', 'Scale Mail', 'Egyptian Linen Plate', 'Copper Guard'],
    helmets: ['Pharaoh Nemes', 'Bronze Skullcap', 'Anubis Mask', 'Golden Circlet'],
    gloves: ['Bronze Bracers', 'Linen Hand-Wraps', 'Gold Claw Gauntlets', 'Copper Fists'],
    boots: ['Bronze Greaves', 'Linen Sandals', 'Golden Sabatons', 'Copper Leg-Guards'],
  },
  {
    id: 'Antiquity',
    name: 'Antiquity',
    tier: 3,
    color: '#22c55e',
    bgBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
    borderColor: 'border-emerald-500/60',
    iconName: 'Shield',
    multiplier: 3.2,
    weapons: ['Spartan Gladius', 'Roman Spatha', 'Hoplite Pike', 'Centurion Sword'],
    armors: ['Lorica Segmentata', 'Spartan Chestplate', 'Corinthian Guard', 'Centurion Mail'],
    helmets: ['Corinthian Helm', 'Centurion Galea', 'Spartan Crest Helm', 'Laurel Crown'],
    gloves: ['Bronze Manica', 'Gladiator Fist-Guards', 'Legion Bracers', 'Spartan Gauntlets'],
    boots: ['Caligae Sandals', 'Legion Greaves', 'Spartan War-Boots', 'Centurion Shin-Guards'],
  },
  {
    id: 'Norman',
    name: 'Norman',
    tier: 4,
    color: '#eab308',
    bgBadge: 'bg-yellow-950/80 text-yellow-300 border-yellow-800/80',
    borderColor: 'border-yellow-500/60',
    iconName: 'Crown',
    multiplier: 5.5,
    weapons: ['Damascus Longsword', 'Flanged Mace', 'Viking Battleaxe', 'Broadsword'],
    armors: ['Norman Hauberk', 'Chainmail Coif Armor', 'Norse Spangenhelm Plate', 'Reinforced Chain'],
    helmets: ['Spangenhelm', 'Norse Horned Helm', 'Chain Coif', 'Jarl Circlet'],
    gloves: ['Chain Mittens', 'Norse Leather Fists', 'Riveted Gauntlets', 'Viking Grip-Guards'],
    boots: ['Chain Chausses', 'Norse Leather Boots', 'Riveted Sabatons', 'Fjord Greaves'],
  },
  {
    id: 'Middle Ages',
    name: 'Middle Ages',
    tier: 5,
    color: '#ec4899',
    bgBadge: 'bg-pink-950/80 text-pink-300 border-pink-800/80',
    borderColor: 'border-pink-500/60',
    iconName: 'Sword',
    multiplier: 9.5,
    weapons: ['Knight Greatsword', 'Halberd of Valor', 'Warhammer', 'Crusader Claymore'],
    armors: ['Gothic Full Plate', 'Gilded Chivalric Armor', 'Royal Knight Cuirass', 'Fortified Steel Plate'],
    helmets: ['Great Helm', 'Gothic Sallet', 'Royal Crown Helm', 'Crusader Barbute'],
    gloves: ['Gothic Gauntlets', 'Gilded Fist-Plates', 'Royal Articulated Gloves', 'Crusader Gauntlets'],
    boots: ['Gothic Sabatons', 'Gilded Leg-Plates', 'Royal Steel Greaves', 'Crusader War-Boots'],
  },
  {
    id: 'Renaissance',
    name: 'Renaissance',
    tier: 6,
    color: '#a855f7',
    bgBadge: 'bg-purple-950/80 text-purple-300 border-purple-800/80',
    borderColor: 'border-purple-500/60',
    iconName: 'Feather',
    multiplier: 16.0,
    weapons: ['Florentine Rapier', 'Duelist Sabre', 'Ornate Estoc', 'Wheelock Pistol-Sword'],
    armors: ['Musketeer Tabard', 'Milano Harness', 'Parade Armor', 'Embossed Plate'],
    helmets: ['Burgonet Helm', 'Feathered Morion', 'Duelist Hat', 'Parade Barbute'],
    gloves: ['Silk Dueling Gloves', 'Milano Gauntlets', 'Parade Fists', 'Embossed Hand-Plates'],
    boots: ['Riding Boots', 'Milano Sabatons', 'Parade Greaves', 'Embossed Shin-Guards'],
  },
  {
    id: 'Industrial',
    name: 'Industrial',
    tier: 7,
    color: '#06b6d4',
    bgBadge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
    borderColor: 'border-cyan-500/60',
    iconName: 'Cog',
    multiplier: 28.0,
    weapons: ['Steamforged Blade', 'Bayonet Rifle', 'Ironclad Axe', 'Pneumatic Drill Spear'],
    armors: ['Boilerplate Exo-Suit', 'Cast-Iron Overcoat', 'Riveted Heavy Plate', 'Pressure-Sealed Armor'],
    helmets: ['Ironclad Helm', 'Pressure Dome', 'Riveted Welder Mask', 'Steam Goggle Helm'],
    gloves: ['Steam Piston Fists', 'Riveted Work-Gloves', 'Ironclad Grips', 'Pressure Gauntlets'],
    boots: ['Ironclad Mag-Boots', 'Riveted Tread-Boots', 'Steam-Piston Greaves', 'Pressure Sabatons'],
  },
  {
    id: 'Modern',
    name: 'Modern',
    tier: 8,
    color: '#6366f1',
    bgBadge: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
    borderColor: 'border-indigo-500/60',
    iconName: 'Crosshair',
    multiplier: 48.0,
    weapons: ['Tactical Vibroblade', 'Titanium Karambit', 'High-Frequency Machete', 'Spec-Ops Blade'],
    armors: ['Kevlar Exo-Vest', 'Ballistic Titanium Rig', 'Composite Combat Suit', 'Nanocarbon Plate'],
    helmets: ['Tactical Helm', 'Ballistic Visor', 'Spec-Ops Night-Vision Rig', 'Composite Combat Helm'],
    gloves: ['Tactical Grip-Gloves', 'Ballistic Knuckle-Guards', 'Spec-Ops Nano-Fists', 'Composite Gauntlets'],
    boots: ['Tactical Assault Boots', 'Ballistic Jump-Boots', 'Spec-Ops Mag-Boots', 'Composite Shin-Guards'],
  },
  {
    id: 'Digitalization',
    name: 'Digitalization',
    tier: 9,
    color: '#f97316',
    bgBadge: 'bg-orange-950/80 text-orange-300 border-orange-800/80',
    borderColor: 'border-orange-500/60',
    iconName: 'Cpu',
    multiplier: 82.0,
    weapons: ['Cyber Energy Blade', 'Plasma Katana', 'Nano Cleaver', 'Holographic Beam Sabre'],
    armors: ['Nanoweave Mesh', 'Cyber Exoskeleton', 'Photon Shield Rig', 'Bio-Digital Armor'],
    helmets: ['Cyber Visor Helm', 'Neural Crown', 'Holo-Visor Rig', 'Photon Skullcap'],
    gloves: ['Cyber Nano-Gloves', 'Plasma Knuckles', 'Holo-Grip Gauntlets', 'Photon Fists'],
    boots: ['Cyber Hover-Boots', 'Plasma Thrust-Greaves', 'Nano Sprint-Boots', 'Photon Shin-Rigs'],
  },
  {
    id: 'Space',
    name: 'Space',
    tier: 10,
    color: '#d946ef',
    bgBadge: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800/80',
    borderColor: 'border-fuchsia-500/60',
    iconName: 'Globe',
    multiplier: 140.0,
    weapons: ['Dark Matter Scythe', 'Quantum Singularity Blade', 'Stellar Core Smasher', 'Cosmic Halberd'],
    armors: ['Stellar Aegis', 'Void Warp Armor', 'Astral Ward Suit', 'Celestial Godplate'],
    helmets: ['Void Godplate Helm', 'Stellar Crown', 'Astral Halo Visor', 'Celestial Nebula Helm'],
    gloves: ['Void Star-Gauntlets', 'Stellar Gravity Fists', 'Astral Quantum Gloves', 'Celestial God-Grips'],
    boots: ['Void Warp Sabatons', 'Stellar Levitation Boots', 'Astral Quantum Greaves', 'Celestial God-Boots'],
  },
];

export interface CivilizationOdds {
  civilization: CivilizationInfo;
  percentage: number;
}

// Function to calculate exact forging probabilities for any forge level
export function getCivilizationProbabilities(level: number): CivilizationOdds[] {
  const oddsMap: Record<CivilizationId, number> = {
    'Primitive': 0,
    'Ancient': 0,
    'Antiquity': 0,
    'Norman': 0,
    'Middle Ages': 0,
    'Renaissance': 0,
    'Industrial': 0,
    'Modern': 0,
    'Digitalization': 0,
    'Space': 0,
  };

  // Match the reference progression curve
  if (level <= 1) {
    oddsMap['Primitive'] = 100;
  } else if (level === 2) {
    oddsMap['Primitive'] = 88;
    oddsMap['Ancient'] = 12;
  } else if (level === 3) {
    oddsMap['Primitive'] = 75;
    oddsMap['Ancient'] = 25;
  } else if (level === 4) {
    oddsMap['Primitive'] = 62;
    oddsMap['Ancient'] = 36;
    oddsMap['Antiquity'] = 2;
  } else if (level === 5) {
    oddsMap['Primitive'] = 50;
    oddsMap['Ancient'] = 46;
    oddsMap['Antiquity'] = 4;
  } else if (level === 6) {
    oddsMap['Primitive'] = 40;
    oddsMap['Ancient'] = 54;
    oddsMap['Antiquity'] = 6;
  } else if (level === 7) {
    oddsMap['Primitive'] = 34;
    oddsMap['Ancient'] = 59;
    oddsMap['Antiquity'] = 7;
  } else if (level === 8) {
    oddsMap['Primitive'] = 27.8;
    oddsMap['Ancient'] = 64.0;
    oddsMap['Antiquity'] = 8.0;
    oddsMap['Norman'] = 0.2;
  } else if (level === 9) {
    oddsMap['Primitive'] = 13.0;
    oddsMap['Ancient'] = 70.0;
    oddsMap['Antiquity'] = 16.0;
    oddsMap['Norman'] = 1.0;
  } else {
    // Dynamic sliding window for levels 10 and above
    const primaryTierIndex = Math.min(Math.floor((level - 1) / 3), CIVILIZATIONS.length - 2);
    const progress = ((level - 1) % 3) / 3;

    CIVILIZATIONS.forEach((civ, idx) => {
      if (idx === primaryTierIndex - 1 && idx >= 0) {
        oddsMap[civ.id] = Math.max(0, parseFloat((15 * (1 - progress)).toFixed(1)));
      } else if (idx === primaryTierIndex) {
        oddsMap[civ.id] = parseFloat((65 - progress * 20).toFixed(1));
      } else if (idx === primaryTierIndex + 1) {
        oddsMap[civ.id] = parseFloat((20 + progress * 25).toFixed(1));
      } else if (idx === primaryTierIndex + 2 && idx < CIVILIZATIONS.length) {
        oddsMap[civ.id] = parseFloat((0.2 + progress * 2.5).toFixed(1));
      }
    });

    // Normalize so sum is 100%
    const total = Object.values(oddsMap).reduce((a, b) => a + b, 0);
    if (total > 0) {
      for (const k of Object.keys(oddsMap) as CivilizationId[]) {
        oddsMap[k] = parseFloat(((oddsMap[k] / total) * 100).toFixed(1));
      }
    }
  }

  return CIVILIZATIONS.map((civ) => ({
    civilization: civ,
    percentage: oddsMap[civ.id] || 0,
  }));
}

export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'gloves' | 'boots';

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: Rarity;
  civilization: CivilizationId;
  attack: number;
  defense: number;
  health: number;
  value: number;
  modifiers?: Modifier[];
}

export interface PlayerCombatStats {
  maxHp: number;
  attack: number;
  defense: number;
  atkSpeed: number; // Attacks per second (e.g. 1.25 /s)
  bonusAtkSpeedPct: number; // e.g. +25%
  critRate: number; // e.g. 15% base + mods
  critDmg: number; // e.g. 150% base + mods
  dodgeRate: number; // e.g. 5% base + mods
  burnChance: number;
  poisonChance: number;
  lifeSteal: number;
  rangeFirstStrike: number;
}

export interface GameState {
  gold: number;
  scrap: number;
  gems: number;
  dungeonKeys: number;
  techCores: number;
  techTree: Record<string, number>;
  forgeLevel: number;
  era: number;
  currentFloor: number;
  highestFloor: number;
  lastTimestamp: number;
  autoEquip: boolean;
  multiForgeLevel: number; // 1 to 5
  equipped: {
    weapon: Equipment;
    armor: Equipment;
    helmet: Equipment;
    gloves: Equipment;
    boots: Equipment;
  };
  blessings?: string[];
}

export interface MinionUnit {
  id: number;
  name: string;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  atkSpeed: number; // attacks per second
}

export type BattleEventType = 'player-attack' | 'minion-attack' | 'dot-tick';

export interface BattleEvent {
  timestamp: number; // in-battle millisecond
  type: BattleEventType;
  actorId: 'hero' | number; // 'hero' or minion index (0, 1, 2...)
  targetId: 'hero' | number; // minion index or 'hero'
  dmg: number;
  isCrit?: boolean;
  isDodge?: boolean;
  isRange?: boolean;
  healedAmount?: number;
  burnDmg?: number;
  poisonDmg?: number;
  minionKilled?: boolean;
  killedMinionIndex?: number;
  heroHpLeft: number;
  minionsHpLeft: number[];
  targetMinionIndex: number;
  totalEnemyHpLeft: number;
}

export interface BattleRound {
  round: number;
  playerDmg: number;
  bossDmg: number;
  bossHpLeft: number;
  playerHpLeft: number;
  isCrit?: boolean;
  isDodge?: boolean;
  burnDmg?: number;
  poisonDmg?: number;
  healedAmount?: number;
  rangeProc?: boolean;
  activeMinionIndex?: number;
  aliveMinions?: number;
  minionKilled?: boolean;
}

export interface BattleResult {
  win: boolean;
  reward: number;
  keyDropped?: boolean;
  floor: number;
  nextFloor: number;
  resetFloor: number;
  bossName: string;
  bossHp: number;
  bossAtk: number;
  bossDef: number;
  bossAtkSpeed: number;
  playerMaxHp: number;
  bossHpLeft: number;
  playerHpLeft: number;
  timedOut?: boolean;
  isBoss: boolean;
  minionCount: number;
  minionNames: string[];
  minions: MinionUnit[];
  events: BattleEvent[];
  rounds?: BattleRound[];
}

export interface ForgedItemSummary {
  item: Equipment;
  isUpgrade: boolean;
  scrapGained: number;
  currentEquipped: Equipment;
}

export interface ForgeResult {
  item: Equipment;
  isUpgrade: boolean;
  scrapGained: number;
  currentEquipped: Equipment;
  items?: ForgedItemSummary[];
}

const RARITY_TABLE: Record<Rarity, { weight: number; mult: number }> = {
  Common:    { weight: 94890, mult: 1.0 }, // 94.89%
  Rare:      { weight: 5000,  mult: 1.5 }, // 5.0% (~1 in 20 crafts)
  Epic:      { weight: 100,   mult: 2.2 }, // 0.10% (~1 in 1,000 crafts)
  Legendary: { weight: 9,     mult: 3.8 }, // 0.009% (~1 in 11,000 crafts)
  Mythic:    { weight: 1,     mult: 6.0 }, // 0.001% (~1 in 100,000 crafts)
};

const ERA_BOSS_NAMES: Record<number, string[]> = {
  1: ['Saber-Toothed Alpha', 'Dire Cave Beast', 'Mammoth Colossus', 'Stoneclaw Warchief'],
  2: ['Pharaoh Anubis Lord', 'Desert Sand Drake', 'Cursed Pharaoh Titan', 'Sphinx Destroyer'],
  3: ['Colosseum Champion Lord', 'Spartan Berserker King', 'Minotaur Dreadnought', 'Centurion Overlord'],
  4: ['Fjord Frost Troll King', 'Fenrir Bloodhound Alpha', 'Jarl of the Frozen Realm', 'Viking Warlord'],
  5: ['Black Knight Overlord', 'Dread Iron Colossus', 'Siege Wyvern Monarch', 'Abyssal Lich Sovereign'],
  6: ['Grand Inquisitor', 'Masked Assassin King', 'Venetian Overlord', 'Florentine Swordmaster'],
  7: ['Ironclad Foundry Colossus', 'Steamwork Dreadnought', 'Smog Titan', 'Clockwork Overlord'],
  8: ['Apex Ballistic Tank', 'Spec-Ops Mech Unit Prime', 'Urban Assault Titan', 'Apex Warmachine'],
  9: ['Cyber Stalker Prime', 'AI Overlord Matrix', 'Quantum Virus Core', 'Neon Singularity Titan'],
  10: ['Void Singularity Sovereign', 'Dark Matter Leviathan', 'Astral God Arbiter', 'Chaos Supernova Sovereign'],
};

const ERA_MINION_NAMES: Record<number, string[]> = {
  1: ['Cave Wolf', 'Wild Boar', 'Primitive Hunter', 'Stone Smasher', 'Sabertooth Cub'],
  2: ['Sand Scorpion', 'Tomb Guard', 'Scarab Beetle', 'Anubis Minion', 'Desert Raider'],
  3: ['Gladiator Recruit', 'Spartan Scout', 'Legionary Swordsman', 'Hoplite Minion', 'War Hound'],
  4: ['Viking Raider', 'Frost Hound', 'Shield Biter Grunt', 'Fjord Wolf', 'Berserker Scout'],
  5: ['Dread Skeleton', 'Dark Cultist', 'Iron Minion', 'Foot Knight', 'Gargoyle Imp'],
  6: ['Bandit Duelist', 'Crossbow Scout', 'Venetian Spy', 'Rogue Mercenary', 'Pike Guard'],
  7: ['Clockwork Drone', 'Steam Crawler', 'Smog Rat', 'Automaton Minion', 'Foundry Scrapmech'],
  8: ['Assault Drone', 'Spec-Ops Grunt', 'Tactical Mech Scout', 'Patrol Guard', 'Ballistic Minion'],
  9: ['Cyber Glitch Bug', 'Neon Drone', 'Security Android', 'Virus Construct', 'Cyber Imp'],
  10: ['Void Wisp', 'Singularity Larva', 'Dark Matter Imp', 'Cosmic Shardling', 'Astral Sprite'],
};

export interface StageEnemyInfo {
  bossName: string;
  bossHp: number;
  bossAtk: number;
  bossDef: number;
  bossAtkSpeed: number;
  era: number;
  isBoss: boolean;
  floorInEra: number;
  minionCount: number;
  minionNames: string[];
  minions: MinionUnit[];
}

// Balanced linear-exponential scaling tuned to civilization gear tiers
// Stages 1 to 9 feature 1 to 5 minions, while Stage 10 is the Final Era Boss
export function getBossInfo(floor: number): StageEnemyInfo {
  const currentEra = Math.max(1, Math.min(10, Math.floor((floor - 1) / 10) + 1));
  const floorInEra = ((floor - 1) % 10) + 1; // 1 to 10
  const isBoss = floorInEra === 10;
  const civMult = CIVILIZATIONS[currentEra - 1]?.multiplier || 1.0;

  if (isBoss) {
    const eraNames = ERA_BOSS_NAMES[currentEra] || ERA_BOSS_NAMES[1];
    const nameIndex = (Math.floor((floor - 1) / 10)) % eraNames.length;
    const bossTitle = eraNames[nameIndex] || `Era ${currentEra} Titan`;

    // Final Stage 10 Boss scaling
    const bossHp = Math.floor((175 + floorInEra * 28) * civMult * Math.pow(1.03, floor));
    const bossAtk = Math.floor((12 + floorInEra * 2.5) * civMult * Math.pow(1.025, floor));
    const bossDef = Math.floor((7 + floorInEra * 1.8) * civMult * Math.pow(1.02, floor));
    const bossAtkSpeed = Number((0.85 + (currentEra * 0.02)).toFixed(2));

    const singleBossMinion: MinionUnit = {
      id: 0,
      name: bossTitle,
      maxHp: bossHp,
      hp: bossHp,
      atk: bossAtk,
      def: bossDef,
      atkSpeed: bossAtkSpeed,
    };

    return {
      bossName: bossTitle,
      bossHp,
      bossAtk,
      bossDef,
      bossAtkSpeed,
      era: currentEra,
      isBoss: true,
      floorInEra,
      minionCount: 1,
      minionNames: [bossTitle],
      minions: [singleBossMinion],
    };
  }

  // Stages 1 through 9: 1 to 5 Minions
  const minionCount = Math.min(5, Math.max(1, Math.ceil((floorInEra * 5) / 9)));
  const eraMinions = ERA_MINION_NAMES[currentEra] || ERA_MINION_NAMES[1];

  const minionNames: string[] = [];
  const minionUnits: MinionUnit[] = [];
  const totalStageHp = Math.floor((105 + floorInEra * 18) * civMult * Math.pow(1.028, floor));
  const totalStageAtk = Math.floor((8 + floorInEra * 1.8) * civMult * Math.pow(1.022, floor));
  const totalStageDef = Math.floor((4 + floorInEra * 1.2) * civMult * Math.pow(1.018, floor));

  const hpPerMinion = Math.max(10, Math.floor(totalStageHp / minionCount));
  // Scaled per-minion attack: multiple minions attacking in parallel deliver high combined pressure
  const atkPerMinion = Math.max(2, Math.floor(totalStageAtk / (1 + (minionCount - 1) * 0.4)));
  const defPerMinion = Math.max(1, Math.floor(totalStageDef * 0.85));

  for (let i = 0; i < minionCount; i++) {
    const mName = eraMinions[(floorInEra - 1 + i) % eraMinions.length];
    minionNames.push(mName);
    // Slight variance in attack speed across the minion squad
    const mSpeed = Number((0.90 + ((i * 3 + floorInEra) % 4) * 0.08).toFixed(2));
    minionUnits.push({
      id: i,
      name: `${mName} #${i + 1}`,
      maxHp: hpPerMinion,
      hp: hpPerMinion,
      atk: atkPerMinion,
      def: defPerMinion,
      atkSpeed: mSpeed,
    });
  }

  const primaryMinionName = minionCount > 1
    ? `${minionNames[0]} Pack (${minionCount}x)`
    : minionNames[0];

  return {
    bossName: primaryMinionName,
    bossHp: totalStageHp,
    bossAtk: totalStageAtk,
    bossDef: totalStageDef,
    bossAtkSpeed: 1.0,
    era: currentEra,
    isBoss: false,
    floorInEra,
    minionCount,
    minionNames,
    minions: minionUnits,
  };
}

export function getWeaponSpeedModifier(weaponName: string): number {
  const name = (weaponName || '').toLowerCase();
  if (name.includes('dagger') || name.includes('karambit') || name.includes('knife')) {
    return 25; // +25% attack speed (fast agile weapons)
  }
  if (name.includes('rapier') || name.includes('scimitar') || name.includes('sabre') || name.includes('katana') || name.includes('estoc')) {
    return 15; // +15% attack speed
  }
  if (name.includes('pistol') || name.includes('claw') || name.includes('knuckle') || name.includes('fist')) {
    return 12; // +12% attack speed
  }
  if (name.includes('rifle') || name.includes('bow') || name.includes('crossbow') || name.includes('blaster') || name.includes('musket')) {
    return 5; // +5% attack speed
  }
  if (name.includes('greatsword') || name.includes('warhammer') || name.includes('axe') || name.includes('battleaxe') || name.includes('scythe') || name.includes('mace') || name.includes('smasher')) {
    return -8; // -8% (slower heavy weapons)
  }
  return 0;
}

export function calculatePlayerCombatStats(
  equipped: { weapon: Equipment; armor: Equipment; helmet: Equipment; gloves: Equipment; boots: Equipment },
  blessings: string[] = [],
  techTree: Record<string, number> = {},
  extraBonusAtkPct: number = 0
): PlayerCombatStats {
  const techBonuses = computeTechBonuses(techTree);

  const allMods: Modifier[] = [
    ...(equipped.weapon.modifiers || []),
    ...(equipped.armor.modifiers || []),
    ...(equipped.helmet.modifiers || []),
    ...(equipped.gloves.modifiers || []),
    ...(equipped.boots.modifiers || []),
  ];

  let bonusAtkPct = extraBonusAtkPct + techBonuses.bonusAtkPct;
  let bonusDefPct = techBonuses.bonusDefPct;
  let bonusHpPct = techBonuses.bonusHpPct;
  let bonusAtkSpeedPct = getWeaponSpeedModifier(equipped.weapon?.name || '') + techBonuses.bonusAtkSpeedPct;
  let critRate = 12 + techBonuses.critRate; // 12% baseline crit chance
  let critDmg = 160 + techBonuses.critDmg; // 160% baseline crit damage
  let dodgeRate = 5 + techBonuses.dodgeRate; // 5% baseline dodge
  let burnChance = 0;
  let poisonChance = 0;
  let lifeSteal = techBonuses.lifeSteal;
  let rangeFirstStrike = techBonuses.rangeFirstStrike;

  // Apply Permanent Ruby Blessings
  if (blessings.includes('dragon_heart')) {
    bonusAtkPct += 18;
    burnChance += 12;
  }
  if (blessings.includes('valkyrie_feather')) {
    critRate += 12;
    dodgeRate += 10;
    bonusAtkSpeedPct += 15;
  }
  if (blessings.includes('vampiric_blood')) {
    lifeSteal += 12;
  }
  if (blessings.includes('titan_fortress')) {
    bonusHpPct += 25;
    bonusDefPct += 15;
  }

  for (const mod of allMods) {
    switch (mod.type) {
      case 'atkSpeed':
        bonusAtkSpeedPct += mod.value;
        break;
      case 'bonusAtkPct':
        bonusAtkPct += mod.value;
        break;
      case 'bonusDefPct':
        bonusDefPct += mod.value;
        break;
      case 'bonusHpPct':
        bonusHpPct += mod.value;
        break;
      case 'critRate':
        critRate += mod.value;
        break;
      case 'critDmg':
        critDmg += mod.value;
        break;
      case 'dodgeRate':
        dodgeRate += mod.value;
        break;
      case 'burnChance':
        burnChance += mod.value;
        break;
      case 'poisonChance':
        poisonChance += mod.value;
        break;
      case 'lifeSteal':
        lifeSteal += mod.value;
        break;
      case 'rangeFirstStrike':
        rangeFirstStrike += mod.value;
        break;
    }
  }

  const baseHp = 100 + equipped.armor.health + equipped.helmet.health + equipped.boots.health + equipped.gloves.health;
  const maxHp = Math.round(baseHp * (1 + bonusHpPct / 100));

  const baseAtk = equipped.weapon.attack + equipped.gloves.attack;
  const attack = Math.round(baseAtk * (1 + bonusAtkPct / 100));

  const baseDef = equipped.armor.defense + equipped.helmet.defense + equipped.boots.defense + equipped.gloves.defense;
  const defense = Math.round(baseDef * (1 + bonusDefPct / 100));

  const atkSpeed = Math.max(0.4, Number((1.0 * (1 + bonusAtkSpeedPct / 100)).toFixed(2)));

  return {
    maxHp,
    attack,
    defense,
    atkSpeed,
    bonusAtkSpeedPct,
    critRate: Math.min(85, critRate),
    critDmg: Math.min(450, critDmg),
    dodgeRate: Math.min(65, dodgeRate),
    burnChance: Math.min(80, burnChance),
    poisonChance: Math.min(80, poisonChance),
    lifeSteal: Math.min(50, lifeSteal),
    rangeFirstStrike: Math.min(60, rangeFirstStrike),
  };
}

export function calculateHeroPower(stats: PlayerCombatStats): number {
  return Math.round(stats.attack * 2.5 + stats.defense * 2.0 + stats.maxHp * 0.4 + stats.atkSpeed * 500);
}

const INITIAL_STATE: GameState = {
  gold: 250,
  scrap: 0,
  gems: 10,
  dungeonKeys: 2,
  techCores: 0,
  techTree: {},
  forgeLevel: 1,
  era: 1,
  currentFloor: 1,
  highestFloor: 1,
  lastTimestamp: Date.now(),
  autoEquip: true,
  multiForgeLevel: 1,
  equipped: {
    weapon: { id: 'w0', name: 'Flint Dagger', slot: 'weapon', rarity: 'Common', civilization: 'Primitive', attack: 14, defense: 0, health: 0, value: 5, modifiers: [] },
    armor: { id: 'a0', name: 'Tattered Tunic', slot: 'armor', rarity: 'Common', civilization: 'Primitive', attack: 0, defense: 8, health: 80, value: 5, modifiers: [] },
    helmet: { id: 'h0', name: 'Bone Headband', slot: 'helmet', rarity: 'Common', civilization: 'Primitive', attack: 0, defense: 2, health: 10, value: 3, modifiers: [] },
    gloves: { id: 'g0', name: 'Hide Wraps', slot: 'gloves', rarity: 'Common', civilization: 'Primitive', attack: 2, defense: 1, health: 5, value: 3, modifiers: [] },
    boots: { id: 'b0', name: 'Leather Foot-Wraps', slot: 'boots', rarity: 'Common', civilization: 'Primitive', attack: 0, defense: 2, health: 10, value: 3, modifiers: [] },
  },
  blessings: [],
};

export const MULTI_FORGE_UPGRADE_COSTS: Record<number, number> = {
  1: 15, // to reach 2x
  2: 25, // to reach 3x
  3: 40, // to reach 4x
  4: 60, // to reach 5x
};

const SAVE_KEY = 'autoforge_save_v4';

function generateUniqueId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback if randomUUID fails in restricted context
    }
  }
  return 'item_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
}

export function useAutoForge() {
  const [state, setState] = useState<GameState>(() => {
    // Clear all previous version save keys so the player starts cleanly from Floor 1
    try {
      localStorage.removeItem('autoforge_save');
      localStorage.removeItem('autoforge_save_v2');
      localStorage.removeItem('autoforge_save_v3');
    } catch {
      // Ignored
    }

    const saved = typeof window !== 'undefined' ? localStorage.getItem(SAVE_KEY) : null;
    if (!saved) return INITIAL_STATE;
    try {
      const parsed: GameState = JSON.parse(saved);
      if (typeof parsed.gems !== 'number') parsed.gems = 10;
      if (typeof parsed.dungeonKeys !== 'number') parsed.dungeonKeys = 2;
      if (typeof parsed.techCores !== 'number') parsed.techCores = 0;
      if (!parsed.techTree || typeof parsed.techTree !== 'object') parsed.techTree = {};
      if (typeof parsed.highestFloor !== 'number') parsed.highestFloor = parsed.currentFloor || 1;
      if (!parsed.equipped?.weapon?.civilization) parsed.equipped.weapon.civilization = 'Primitive';
      if (!parsed.equipped?.armor?.civilization) parsed.equipped.armor.civilization = 'Primitive';
      // Migrate saves: ensure the new gear slots exist
      if (!parsed.equipped?.helmet) {
        parsed.equipped.helmet = { id: 'h0', name: 'Bone Headband', slot: 'helmet', rarity: 'Common', civilization: 'Primitive', attack: 0, defense: 2, health: 10, value: 3, modifiers: [] };
      }
      if (!parsed.equipped?.gloves) {
        parsed.equipped.gloves = { id: 'g0', name: 'Hide Wraps', slot: 'gloves', rarity: 'Common', civilization: 'Primitive', attack: 2, defense: 1, health: 5, value: 3, modifiers: [] };
      }
      if (!parsed.equipped?.boots) {
        parsed.equipped.boots = { id: 'b0', name: 'Leather Foot-Wraps', slot: 'boots', rarity: 'Common', civilization: 'Primitive', attack: 0, defense: 2, health: 10, value: 3, modifiers: [] };
      }
      if (typeof parsed.multiForgeLevel !== 'number') {
        parsed.multiForgeLevel = 1;
      }

      const offlineSeconds = Math.min(
        Math.floor((Date.now() - (parsed.lastTimestamp || Date.now())) / 1000),
        8 * 3600
      );
      const techBonuses = computeTechBonuses(parsed.techTree || {});
      const techGoldMult = 1 + (techBonuses.goldTickMult / 100);
      const goldPerSec = (parsed.forgeLevel || 1) * 1.5 * techGoldMult;
      parsed.gold = (parsed.gold || 0) + Math.floor(offlineSeconds * goldPerSec);
      parsed.lastTimestamp = Date.now();
      return parsed;
    } catch {
      return INITIAL_STATE;
    }
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Live passive gold income (1.5 gold/sec per forge level + Midas Blessing + Tech Gold bonus)
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const midasMult = prev.blessings?.includes('midas_ruby') ? 1.3 : 1.0;
        const techBonuses = computeTechBonuses(prev.techTree);
        const techGoldMult = 1 + (techBonuses.goldTickMult / 100);
        const goldGain = Math.max(1, Math.floor(prev.forgeLevel * 1.5 * midasMult * techGoldMult));
        return {
          ...prev,
          gold: prev.gold + goldGain,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastTimestamp: Date.now() }));
    }, 1000);
    return () => clearTimeout(handler);
  }, [state]);

  const resetGame = () => {
    try {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem('autoforge_save');
      localStorage.removeItem('autoforge_save_v2');
      localStorage.removeItem('autoforge_save_v3');
    } catch {
      // Ignored
    }
    setState({
      gold: 250,
      scrap: 0,
      gems: 10,
      dungeonKeys: 2,
      techCores: 0,
      techTree: {},
      forgeLevel: 1,
      era: 1,
      currentFloor: 1,
      highestFloor: 1,
      lastTimestamp: Date.now(),
      autoEquip: true,
      multiForgeLevel: 1,
      equipped: {
        weapon: { id: 'w0', name: 'Flint Dagger', slot: 'weapon', rarity: 'Common', civilization: 'Primitive', attack: 14, defense: 0, health: 0, value: 5, modifiers: [] },
        armor: { id: 'a0', name: 'Tattered Tunic', slot: 'armor', rarity: 'Common', civilization: 'Primitive', attack: 0, defense: 8, health: 80, value: 5, modifiers: [] },
        helmet: { id: 'h0', name: 'Bone Headband', slot: 'helmet', rarity: 'Common', civilization: 'Primitive', attack: 0, defense: 2, health: 10, value: 3, modifiers: [] },
        gloves: { id: 'g0', name: 'Hide Wraps', slot: 'gloves', rarity: 'Common', civilization: 'Primitive', attack: 2, defense: 1, health: 5, value: 3, modifiers: [] },
        boots: { id: 'b0', name: 'Leather Foot-Wraps', slot: 'boots', rarity: 'Common', civilization: 'Primitive', attack: 0, defense: 2, health: 10, value: 3, modifiers: [] },
      },
      blessings: [],
    });
  };

  const toggleAutoEquip = () => {
    setState((prev) => ({ ...prev, autoEquip: !prev.autoEquip }));
  };

  const equipItem = (item: Equipment) => {
    setState((prev) => {
      const current = prev.equipped[item.slot];
      const techBonuses = computeTechBonuses(prev.techTree);
      const scrapBonus = (prev.blessings?.includes('scrap_sigil') ? 1.5 : 1.0) * (1 + techBonuses.scrapBonusPct / 100);
      const next: GameState = {
        ...prev,
        scrap: prev.scrap + Math.floor((current?.value || 0) * scrapBonus),
        equipped: {
          ...prev.equipped,
          [item.slot]: item,
        },
      };
      stateRef.current = next;
      return next;
    });
  };

  const equipMultipleItems = (itemsToEquip: Equipment[]) => {
    if (itemsToEquip.length === 0) return;
    setState((prev) => {
      const techBonuses = computeTechBonuses(prev.techTree);
      const scrapBonus = (prev.blessings?.includes('scrap_sigil') ? 1.5 : 1.0) * (1 + techBonuses.scrapBonusPct / 100);
      let addedScrap = 0;
      const newEquipped = { ...prev.equipped };
      for (const it of itemsToEquip) {
        const current = newEquipped[it.slot];
        addedScrap += Math.floor((current?.value || 0) * scrapBonus);
        newEquipped[it.slot] = it;
      }
      const next: GameState = {
        ...prev,
        scrap: prev.scrap + addedScrap,
        equipped: newEquipped,
      };
      stateRef.current = next;
      return next;
    });
  };

  const scrapItem = (item: Equipment) => {
    setState((prev) => {
      const techBonuses = computeTechBonuses(prev.techTree);
      const scrapBonus = (prev.blessings?.includes('scrap_sigil') ? 1.5 : 1.0) * (1 + techBonuses.scrapBonusPct / 100);
      const next: GameState = {
        ...prev,
        scrap: prev.scrap + Math.floor((item?.value || 0) * scrapBonus),
      };
      stateRef.current = next;
      return next;
    });
  };

  const scrapMultipleItems = (itemsToScrap: Equipment[]) => {
    if (itemsToScrap.length === 0) return;
    setState((prev) => {
      const techBonuses = computeTechBonuses(prev.techTree);
      const scrapBonus = (prev.blessings?.includes('scrap_sigil') ? 1.5 : 1.0) * (1 + techBonuses.scrapBonusPct / 100);
      let addedScrap = 0;
      for (const it of itemsToScrap) {
        addedScrap += Math.floor((it?.value || 0) * scrapBonus);
      }
      const next: GameState = {
        ...prev,
        scrap: prev.scrap + addedScrap,
      };
      stateRef.current = next;
      return next;
    });
  };

  const forgeItem = (options?: {
    count?: number;
    forceManualUpgrade?: boolean;
    autoScrapNonUpgrade?: boolean;
  }): ForgeResult | null => {
    const currentState = stateRef.current;
    const craftCost = Math.max(10, currentState.forgeLevel * 15);
    const count = Math.max(1, Math.min(5, options?.count || 1));
    const totalCost = craftCost * count;

    if (currentState.gold < totalCost) return null;

    const techBonuses = computeTechBonuses(currentState.techTree);
    const civOdds = getCivilizationProbabilities(currentState.forgeLevel);
    const scrapBonusVal =
      ((currentState.blessings || []).includes('scrap_sigil') ? 1.5 : 1.0) *
      (1 + techBonuses.scrapBonusPct / 100);
    const shouldForceManual = options?.forceManualUpgrade;

    // Apply rarity odds boost from Tech Tree
    const rarityOddsBonus = techBonuses.rarityOddsMult;
    const dynamicRarityTable: Record<Rarity, { weight: number; mult: number }> = {
      Common: { ...RARITY_TABLE.Common },
      Rare: { weight: Math.round(RARITY_TABLE.Rare.weight * (1 + rarityOddsBonus / 100)), mult: RARITY_TABLE.Rare.mult },
      Epic: { weight: Math.round(RARITY_TABLE.Epic.weight * (1 + rarityOddsBonus / 100)), mult: RARITY_TABLE.Epic.mult },
      Legendary: { weight: Math.round(RARITY_TABLE.Legendary.weight * (1 + rarityOddsBonus / 100)), mult: RARITY_TABLE.Legendary.mult },
      Mythic: { weight: Math.round(RARITY_TABLE.Mythic.weight * (1 + rarityOddsBonus / 100)), mult: RARITY_TABLE.Mythic.mult },
    };
    const totalRarityWeight = Object.values(dynamicRarityTable).reduce((sum, r) => sum + r.weight, 0);

    const rolledItems: Equipment[] = [];

    for (let c = 0; c < count; c++) {
      // 1. Roll Civilization Era
      const civRoll = Math.random() * 100;
      let accumulatedCiv = 0;
      let chosenCiv = CIVILIZATIONS[0];
      for (const odd of civOdds) {
        accumulatedCiv += odd.percentage;
        if (civRoll <= accumulatedCiv) {
          chosenCiv = odd.civilization;
          break;
        }
      }

      // 2. Roll Rarity
      const rollRarity = Math.random() * totalRarityWeight;
      let accumulatedRarity = 0;
      let chosenRarity: Rarity = 'Common';
      for (const [rarity, conf] of Object.entries(dynamicRarityTable) as [Rarity, typeof dynamicRarityTable[Rarity]][]) {
        accumulatedRarity += conf.weight;
        if (rollRarity <= accumulatedRarity) {
          chosenRarity = rarity;
          break;
        }
      }

      const rarityMult = dynamicRarityTable[chosenRarity].mult;
      const civMult = chosenCiv.multiplier;
      const totalMult = rarityMult * civMult;

      const baseStat = (currentState.era * 35) + (currentState.forgeLevel * 10);
      const slotRoll = Math.random() * 100;
      const slot: EquipmentSlot =
        slotRoll < 30 ? 'weapon' :
        slotRoll < 55 ? 'armor' :
        slotRoll < 70 ? 'helmet' :
        slotRoll < 85 ? 'gloves' : 'boots';

      const nameList =
        slot === 'weapon' ? chosenCiv.weapons :
        slot === 'armor' ? chosenCiv.armors :
        slot === 'helmet' ? chosenCiv.helmets :
        slot === 'gloves' ? chosenCiv.gloves : chosenCiv.boots;
      const pickedBaseName = nameList[Math.floor(Math.random() * nameList.length)] || 'Gear';

      const rolledModifiers = rollModifiersForRarity(chosenRarity, techBonuses.modifierBonusPct);

      const newItem: Equipment = {
        id: generateUniqueId(),
        name: `${chosenRarity} ${pickedBaseName}`,
        slot,
        rarity: chosenRarity,
        civilization: chosenCiv.id,
        attack: slot === 'weapon' ? Math.max(1, Math.floor(baseStat * totalMult * (0.9 + Math.random() * 0.2))) :
                slot === 'gloves' ? Math.max(0, Math.floor(baseStat * 0.15 * totalMult)) : 0,
        defense: slot === 'armor' ? Math.max(1, Math.floor(baseStat * 0.55 * totalMult)) :
                 slot === 'helmet' ? Math.max(1, Math.floor(baseStat * 0.22 * totalMult)) :
                 slot === 'boots' ? Math.max(1, Math.floor(baseStat * 0.2 * totalMult)) :
                 slot === 'gloves' ? Math.max(0, Math.floor(baseStat * 0.15 * totalMult)) : 0,
        health: slot === 'armor' ? Math.max(1, Math.floor(baseStat * 2.8 * totalMult)) :
                slot === 'helmet' ? Math.max(1, Math.floor(baseStat * 0.8 * totalMult)) :
                slot === 'boots' ? Math.max(1, Math.floor(baseStat * 0.7 * totalMult)) :
                slot === 'gloves' ? Math.max(0, Math.floor(baseStat * 0.5 * totalMult)) : 0,
        value: Math.floor(craftCost * totalMult * 0.4),
        modifiers: rolledModifiers,
      };

      rolledItems.push(newItem);
    }

    // Process all forged items in batch
    let runningEquipped = { ...currentState.equipped };
    let batchScrapGained = 0;
    const upgradeResults: { item: Equipment; oldEquipped: Equipment }[] = [];
    const forgedSummaries: ForgedItemSummary[] = [];

    for (const item of rolledItems) {
      const currentEq = runningEquipped[item.slot];
      const newModPower = (item.modifiers || []).reduce((sum, m) => sum + m.value, 0);
      const currModPower = (currentEq.modifiers || []).reduce((sum, m) => sum + m.value, 0);

      const isUpgrade = item.slot === 'weapon'
        ? (item.attack * (1 + newModPower / 100)) > (currentEq.attack * (1 + currModPower / 100))
        : ((item.defense + item.health + item.attack) * (1 + newModPower / 100)) > ((currentEq.defense + currentEq.health + currentEq.attack) * (1 + currModPower / 100));

      const itemScrap = isUpgrade
        ? Math.floor((currentEq.value || 0) * scrapBonusVal)
        : Math.floor((item.value || 0) * scrapBonusVal);

      forgedSummaries.push({
        item,
        isUpgrade,
        scrapGained: itemScrap,
        currentEquipped: currentEq,
      });

      if (isUpgrade) {
        upgradeResults.push({ item, oldEquipped: currentEq });
        if (currentState.autoEquip && !shouldForceManual) {
          batchScrapGained += itemScrap;
          runningEquipped = { ...runningEquipped, [item.slot]: item };
        }
      } else {
        batchScrapGained += itemScrap;
      }
    }

    const hasAnyUpgrade = upgradeResults.length > 0;
    const bestUpgrade = upgradeResults[upgradeResults.length - 1];
    const primaryItem = bestUpgrade ? bestUpgrade.item : rolledItems[rolledItems.length - 1];
    const primaryEquipped = bestUpgrade ? bestUpgrade.oldEquipped : currentState.equipped[primaryItem.slot];

    if (shouldForceManual) {
      // Auto-scrap non-upgrades in this batch; upgrades will be prompted to player
      let nonUpgradeScrap = 0;
      for (const summary of forgedSummaries) {
        if (!summary.isUpgrade) {
          nonUpgradeScrap += summary.scrapGained;
        }
      }
      setState((prev) => {
        const next = {
          ...prev,
          gold: prev.gold - totalCost,
          scrap: prev.scrap + nonUpgradeScrap,
        };
        stateRef.current = next;
        return next;
      });
    } else if (currentState.autoEquip) {
      // Auto-equip mode: updates equipped gear and adds scrap
      setState((prev) => {
        const next: GameState = {
          ...prev,
          gold: prev.gold - totalCost,
          scrap: prev.scrap + batchScrapGained,
          equipped: runningEquipped,
        };
        stateRef.current = next;
        return next;
      });
    } else {
      // Manual mode without auto-equip: gold is deducted, choices are handed to player
      setState((prev) => {
        const next = {
          ...prev,
          gold: prev.gold - totalCost,
        };
        stateRef.current = next;
        return next;
      });
    }

    return {
      item: primaryItem,
      isUpgrade: hasAnyUpgrade,
      scrapGained: batchScrapGained,
      currentEquipped: primaryEquipped,
      items: forgedSummaries,
    };
  };

  const getUpgradeCost = (level: number) => {
    const fixedCosts: Record<number, { gold: number; scrap: number }> = {
      1: { gold: 350, scrap: 25 },
      2: { gold: 1200, scrap: 80 },
      3: { gold: 3500, scrap: 240 },
      4: { gold: 8500, scrap: 600 },
      5: { gold: 18000, scrap: 1400 },
      6: { gold: 32000, scrap: 2800 },
      7: { gold: 42000, scrap: 4500 },
      8: { gold: 50000, scrap: 6800 }, // Exactly matches the reference 50k upgrade
      9: { gold: 85000, scrap: 11000 },
      10: { gold: 140000, scrap: 18000 },
    };

    if (fixedCosts[level]) {
      return fixedCosts[level];
    }

    const gold = Math.floor(85000 * Math.pow(1.68, level - 9));
    const scrap = Math.floor(gold * 0.14);
    return { gold, scrap };
  };

  const upgradeForge = () => {
    const { gold: goldCost, scrap: scrapCost } = getUpgradeCost(state.forgeLevel);
    if (state.gold >= goldCost && state.scrap >= scrapCost) {
      setState((prev) => ({
        ...prev,
        gold: prev.gold - goldCost,
        scrap: prev.scrap - scrapCost,
        forgeLevel: prev.forgeLevel + 1,
      }));
    }
  };

  const setFloor = (newFloor: number) => {
    setState((prev) => {
      const target = Math.max(1, Math.min(prev.highestFloor || 1, newFloor));
      return {
        ...prev,
        currentFloor: target,
        era: Math.max(1, Math.min(10, Math.floor((target - 1) / 10) + 1)),
      };
    });
  };

  const fightFloorBoss = (floorToFight?: number): BattleResult => {
    const floor = floorToFight ?? stateRef.current.currentFloor;
    const stageInfo = getBossInfo(floor);
    const { bossName, bossHp, bossAtk, bossDef, bossAtkSpeed, isBoss, minionCount, minionNames, minions: stageMinions } = stageInfo;

    const stats = calculatePlayerCombatStats(
      stateRef.current.equipped,
      stateRef.current.blessings || [],
      stateRef.current.techTree
    );
    let playerHp = stats.maxHp;

    const minions: MinionUnit[] = stageMinions.map((m) => ({
      ...m,
      hp: m.maxHp,
    }));

    const events: BattleEvent[] = [];
    const rounds: BattleRound[] = [];
    let burnStacks = 0;
    let poisonStacks = 0;

    // Time-based Attack Speed simulation engine
    // Attack interval in milliseconds = 1000 / atkSpeed
    const playerInterval = Math.max(220, Math.round(1000 / stats.atkSpeed));
    let playerNextAtk = 0; // Player strikes immediately at combat start

    const minionIntervals = minions.map((m) => Math.max(260, Math.round(1000 / m.atkSpeed)));
    // Each minion has its own independent attack timer and cadence
    const minionNextAtk = minions.map((m) => {
      const baseInterval = Math.max(260, Math.round(1000 / m.atkSpeed));
      return Math.round(baseInterval * (0.2 + Math.random() * 0.5));
    });

    let nextDotTick = 1000;
    let currentTime = 0;
    const maxBattleTime = 30000; // 30 seconds time limit
    let targetMinionIndex = 0;
    let timedOut = false;
    let roundCounter = 0;

    while (currentTime <= maxBattleTime) {
      const aliveIndices = minions
        .map((m, idx) => (m.hp > 0 ? idx : -1))
        .filter((idx) => idx !== -1);

      if (aliveIndices.length === 0) {
        break; // All minions defeated
      }
      if (playerHp <= 0) {
        break; // Hero defeated
      }

      // Hero locks onto the first alive minion (one at a time)
      if (!aliveIndices.includes(targetMinionIndex)) {
        targetMinionIndex = aliveIndices[0];
      }

      // Determine next event time across all combatants
      const nextPTime = playerNextAtk;
      let nextMTime = Infinity;
      let nextMIndex = -1;

      for (const idx of aliveIndices) {
        if (minionNextAtk[idx] < nextMTime) {
          nextMTime = minionNextAtk[idx];
          nextMIndex = idx;
        }
      }

      const nextDTime = (burnStacks > 0 || poisonStacks > 0) ? nextDotTick : Infinity;
      const nextEventTime = Math.min(nextPTime, nextMTime, nextDTime);

      if (nextEventTime > maxBattleTime) {
        timedOut = true;
        break;
      }

      currentTime = nextEventTime;

      if (currentTime === nextPTime) {
        // === 1. HERO ATTACKS THE TARGETED MINION (One target at a time) ===
        roundCounter++;
        const target = minions[targetMinionIndex];
        const isFirstHit = events.length === 0;
        const isRangeProc = isFirstHit && (Math.random() * 100 < stats.rangeFirstStrike);
        const isCrit = Math.random() * 100 < stats.critRate;
        const critMult = isCrit ? (stats.critDmg / 100) : 1.0;
        const variance = 0.88 + Math.random() * 0.24;
        const rawPlayerDmg = Math.floor(stats.attack * variance * critMult);
        let pDmg = Math.max(1, Math.round(rawPlayerDmg * (100 / (100 + target.def))));
        if (isRangeProc) pDmg = Math.round(pDmg * 1.35);

        target.hp = Math.max(0, target.hp - pDmg);

        if (Math.random() * 100 < stats.burnChance) burnStacks++;
        if (Math.random() * 100 < stats.poisonChance) poisonStacks++;

        let healed = 0;
        if (stats.lifeSteal > 0) {
          healed = Math.max(0, Math.round(pDmg * (stats.lifeSteal / 100)));
          playerHp = Math.min(stats.maxHp, playerHp + healed);
        }

        const minionKilled = target.hp <= 0;
        const killedIndex = minionKilled ? targetMinionIndex : undefined;

        if (minionKilled) {
          const remainingAlive = minions
            .map((m, idx) => (m.hp > 0 ? idx : -1))
            .filter((idx) => idx !== -1);
          if (remainingAlive.length > 0) {
            targetMinionIndex = remainingAlive[0];
          }
        }

        const totalEnemyHp = minions.reduce((sum, m) => sum + m.hp, 0);

        events.push({
          timestamp: currentTime,
          type: 'player-attack',
          actorId: 'hero',
          targetId: target.id,
          dmg: pDmg,
          isCrit,
          isRange: isRangeProc,
          healedAmount: healed,
          minionKilled,
          killedMinionIndex: killedIndex,
          heroHpLeft: playerHp,
          minionsHpLeft: minions.map((m) => m.hp),
          targetMinionIndex,
          totalEnemyHpLeft: totalEnemyHp,
        });

        // Add legacy round entry for backwards compatibility
        rounds.push({
          round: roundCounter,
          playerDmg: pDmg,
          bossDmg: 0,
          bossHpLeft: totalEnemyHp,
          playerHpLeft: playerHp,
          isCrit,
          isDodge: false,
          burnDmg: 0,
          poisonDmg: 0,
          healedAmount: healed,
          rangeProc: isRangeProc,
          activeMinionIndex: targetMinionIndex,
          aliveMinions: aliveIndices.length,
          minionKilled,
        });

        playerNextAtk = currentTime + playerInterval;

      } else if (currentTime === nextMTime && nextMIndex !== -1) {
        // === 2. LIVING MINION ATTACKS HERO (All living minions attack independently) ===
        roundCounter++;
        const attacker = minions[nextMIndex];
        const isDodge = Math.random() * 100 < stats.dodgeRate;
        let bDmg = 0;

        if (!isDodge) {
          const variance = 0.88 + Math.random() * 0.24;
          const rawDmg = Math.floor(attacker.atk * variance);
          bDmg = Math.max(1, Math.round(rawDmg * (100 / (100 + stats.defense))));
          playerHp = Math.max(0, playerHp - bDmg);
        }

        const totalEnemyHp = minions.reduce((sum, m) => sum + m.hp, 0);

        events.push({
          timestamp: currentTime,
          type: 'minion-attack',
          actorId: nextMIndex,
          targetId: 'hero',
          dmg: bDmg,
          isDodge,
          heroHpLeft: playerHp,
          minionsHpLeft: minions.map((m) => m.hp),
          targetMinionIndex,
          totalEnemyHpLeft: totalEnemyHp,
        });

        rounds.push({
          round: roundCounter,
          playerDmg: 0,
          bossDmg: bDmg,
          bossHpLeft: totalEnemyHp,
          playerHpLeft: playerHp,
          isCrit: false,
          isDodge,
          activeMinionIndex: nextMIndex,
          aliveMinions: aliveIndices.length,
        });

        const minionVariance = 0.92 + Math.random() * 0.16;
        minionNextAtk[nextMIndex] = currentTime + Math.max(220, Math.round(minionIntervals[nextMIndex] * minionVariance));

      } else if (currentTime === nextDTime) {
        // === 3. DoT TICKS ON CURRENT TARGET MINION ===
        roundCounter++;
        const target = minions[targetMinionIndex];
        let bDmg = 0;
        let pDmg = 0;

        if (burnStacks > 0 && target.hp > 0) {
          bDmg = Math.max(1, Math.floor(target.hp * 0.04 * Math.min(3, burnStacks)));
          target.hp = Math.max(0, target.hp - bDmg);
        }
        if (poisonStacks > 0 && target.hp > 0) {
          pDmg = Math.max(1, Math.floor(stats.attack * 0.15 * poisonStacks));
          target.hp = Math.max(0, target.hp - pDmg);
        }

        const minionKilled = target.hp <= 0;
        const killedIndex = minionKilled ? targetMinionIndex : undefined;

        if (minionKilled) {
          const remainingAlive = minions
            .map((m, idx) => (m.hp > 0 ? idx : -1))
            .filter((idx) => idx !== -1);
          if (remainingAlive.length > 0) {
            targetMinionIndex = remainingAlive[0];
          }
        }

        const totalEnemyHp = minions.reduce((sum, m) => sum + m.hp, 0);

        events.push({
          timestamp: currentTime,
          type: 'dot-tick',
          actorId: 'hero',
          targetId: target.id,
          dmg: bDmg + pDmg,
          burnDmg: bDmg,
          poisonDmg: pDmg,
          minionKilled,
          killedMinionIndex: killedIndex,
          heroHpLeft: playerHp,
          minionsHpLeft: minions.map((m) => m.hp),
          targetMinionIndex,
          totalEnemyHpLeft: totalEnemyHp,
        });

        nextDotTick = currentTime + 1000;
      }
    }

    const curBossHp = minions.reduce((sum, m) => sum + m.hp, 0);
    const win = curBossHp <= 0 && playerHp > 0;
    const isTimeout = timedOut || (curBossHp > 0 && playerHp > 0);
    // Stage 10 Boss grants greater gold and gem bonus
    const stageMultiplier = isBoss ? 2.5 : 1.0;
    const baseReward = win ? Math.floor(25 * Math.pow(1.12, floor) * stageMultiplier) : 0;
    const midasMult = (stateRef.current.blessings || []).includes('midas_ruby') ? 1.3 : 1.0;
    const reward = Math.floor(baseReward * midasMult);

    // Random Dungeon Key Drop Chance (boosted by Tech Tree)
    // Keys are rare and precious keystones: 30% from major Era Bosses, 3% from regular minion stages
    const techBonuses = computeTechBonuses(stateRef.current.techTree);
    const baseKeyDropChance = isBoss ? 30 : 3;
    const totalKeyDropChance = Math.min(60, baseKeyDropChance + techBonuses.keyDropBonusPct);
    const keyDropped = win && (Math.random() * 100 < totalKeyDropChance);

    // If failed, reset to the first stage of the current level/era
    const levelStartFloor = Math.floor((floor - 1) / 10) * 10 + 1;
    const nextFloor = win ? floor + 1 : levelStartFloor;

    if (win) {
      setState((prev) => {
        const nextF = floor + 1;
        const newHighest = Math.max(prev.highestFloor || 1, nextF);
        const next = {
          ...prev,
          gold: prev.gold + reward,
          gems: prev.gems + (isBoss ? 5 : floor % 5 === 0 ? 3 : 1),
          dungeonKeys: keyDropped ? prev.dungeonKeys + 1 : prev.dungeonKeys,
          currentFloor: nextF,
          highestFloor: newHighest,
          era: Math.max(1, Math.min(10, Math.floor((nextF - 1) / 10) + 1)),
        };
        stateRef.current = next;
        return next;
      });
    } else {
      // Failed to beat enemy: start from the first stage on that level/era
      setState((prev) => {
        const next = {
          ...prev,
          currentFloor: levelStartFloor,
          era: Math.max(1, Math.min(10, Math.floor((levelStartFloor - 1) / 10) + 1)),
        };
        stateRef.current = next;
        return next;
      });
    }

    return {
      win,
      reward,
      keyDropped,
      floor,
      nextFloor,
      resetFloor: levelStartFloor,
      bossName,
      bossHp,
      bossAtk,
      bossDef,
      bossAtkSpeed,
      playerMaxHp: stats.maxHp,
      bossHpLeft: curBossHp,
      playerHpLeft: playerHp,
      timedOut: isTimeout,
      isBoss,
      minionCount,
      minionNames,
      minions,
      events,
      rounds,
    };
  };

  // Tech Tree: Upgrade a node
  const upgradeTechNode = (nodeId: string): boolean => {
    const node = TECH_NODES.find((n) => n.id === nodeId);
    if (!node) return false;

    const currentLevel = stateRef.current.techTree[nodeId] || 0;
    if (currentLevel >= node.maxLevel) return false;

    // Check prerequisites
    if (node.requiresNodeId) {
      const prereqLevel = stateRef.current.techTree[node.requiresNodeId] || 0;
      if (prereqLevel < (node.requiresNodeLevel || 1)) return false;
    }

    const cost = calculateTechNodeCost(node, currentLevel);
    if (stateRef.current.techCores < cost) return false;

    setState((prev) => {
      const nextTechTree = {
        ...prev.techTree,
        [nodeId]: currentLevel + 1,
      };
      const next: GameState = {
        ...prev,
        techCores: prev.techCores - cost,
        techTree: nextTechTree,
      };
      stateRef.current = next;
      return next;
    });

    return true;
  };

  // Tech Tree: Reset and refund all spent tech cores
  const respecTechTree = () => {
    let refundedCores = 0;
    for (const node of TECH_NODES) {
      const lvl = stateRef.current.techTree[node.id] || 0;
      for (let i = 0; i < lvl; i++) {
        refundedCores += calculateTechNodeCost(node, i);
      }
    }

    setState((prev) => {
      const next: GameState = {
        ...prev,
        techCores: prev.techCores + refundedCores,
        techTree: {},
      };
      stateRef.current = next;
      return next;
    });
  };

  // Dungeon: Start an expedition by consuming 1 key and generating 5 waves
  const startDungeonExpedition = (chosenTier?: number): { canEnter: boolean; waves: DungeonWaveInfo[]; tier: number } | null => {
    if (stateRef.current.dungeonKeys < 1) return null;

    setState((prev) => {
      const next: GameState = {
        ...prev,
        dungeonKeys: Math.max(0, prev.dungeonKeys - 1),
      };
      stateRef.current = next;
      return next;
    });

    const tierToRun = chosenTier ? Math.max(1, Math.min(10, chosenTier)) : Math.max(1, Math.min(10, stateRef.current.era));
    const techBonuses = computeTechBonuses(stateRef.current.techTree);
    const stats = calculatePlayerCombatStats(
      stateRef.current.equipped,
      stateRef.current.blessings || [],
      stateRef.current.techTree,
      techBonuses.dungeonBonusAtkPct
    );

    const waves = generateDungeonWaves(tierToRun, stats);
    return { canEnter: true, waves, tier: tierToRun };
  };

  // Dungeon: Combat simulator for a single dungeon wave
  const fightDungeonWave = (
    waveInfo: DungeonWaveInfo,
    startHeroHp?: number
  ): DungeonWaveResult => {
    const techBonuses = computeTechBonuses(stateRef.current.techTree);
    const stats = calculatePlayerCombatStats(
      stateRef.current.equipped,
      stateRef.current.blessings || [],
      stateRef.current.techTree,
      techBonuses.dungeonBonusAtkPct
    );

    let playerHp = startHeroHp !== undefined ? Math.min(stats.maxHp, startHeroHp) : stats.maxHp;

    const enemies: DungeonWaveEnemy[] = waveInfo.enemies.map((e) => ({
      ...e,
      hp: e.maxHp,
    }));

    const events: BattleEvent[] = [];
    let burnStacks = 0;
    let poisonStacks = 0;

    const playerInterval = Math.max(200, Math.round(1000 / stats.atkSpeed));
    let playerNextAtk = 0;

    const enemyIntervals = enemies.map((e) => Math.max(240, Math.round(1000 / e.atkSpeed)));
    const enemyNextAtk = enemies.map((e) => {
      const baseInterval = Math.max(240, Math.round(1000 / e.atkSpeed));
      return Math.round(baseInterval * (0.2 + Math.random() * 0.5));
    });

    let nextDotTick = 1000;
    let currentTime = 0;
    const maxBattleTime = 35000;
    let targetEnemyIndex = 0;
    let timedOut = false;

    while (currentTime <= maxBattleTime) {
      const aliveIndices = enemies
        .map((e, idx) => (e.hp > 0 ? idx : -1))
        .filter((idx) => idx !== -1);

      if (aliveIndices.length === 0 || playerHp <= 0) break;

      if (!aliveIndices.includes(targetEnemyIndex)) {
        targetEnemyIndex = aliveIndices[0];
      }

      const nextPTime = playerNextAtk;
      let nextETime = Infinity;
      let nextEIndex = -1;

      for (const idx of aliveIndices) {
        if (enemyNextAtk[idx] < nextETime) {
          nextETime = enemyNextAtk[idx];
          nextEIndex = idx;
        }
      }

      const nextDTime = (burnStacks > 0 || poisonStacks > 0) ? nextDotTick : Infinity;
      const nextEventTime = Math.min(nextPTime, nextETime, nextDTime);

      if (nextEventTime > maxBattleTime) {
        timedOut = true;
        break;
      }

      currentTime = nextEventTime;

      if (currentTime === nextPTime) {
        const target = enemies[targetEnemyIndex];
        const isFirstHit = events.length === 0;
        const isRangeProc = isFirstHit && (Math.random() * 100 < stats.rangeFirstStrike);
        const isCrit = Math.random() * 100 < stats.critRate;
        const critMult = isCrit ? (stats.critDmg / 100) : 1.0;
        const variance = 0.9 + Math.random() * 0.2;
        const rawDmg = Math.floor(stats.attack * variance * critMult);
        let pDmg = Math.max(1, Math.round(rawDmg * (100 / (100 + target.def))));
        if (isRangeProc) pDmg = Math.round(pDmg * 1.35);

        target.hp = Math.max(0, target.hp - pDmg);

        if (Math.random() * 100 < stats.burnChance) burnStacks++;
        if (Math.random() * 100 < stats.poisonChance) poisonStacks++;

        let healed = 0;
        if (stats.lifeSteal > 0) {
          healed = Math.max(0, Math.round(pDmg * (stats.lifeSteal / 100)));
          playerHp = Math.min(stats.maxHp, playerHp + healed);
        }

        const enemyKilled = target.hp <= 0;
        const killedIndex = enemyKilled ? targetEnemyIndex : undefined;

        if (enemyKilled) {
          const remainingAlive = enemies
            .map((e, idx) => (e.hp > 0 ? idx : -1))
            .filter((idx) => idx !== -1);
          if (remainingAlive.length > 0) {
            targetEnemyIndex = remainingAlive[0];
          }
        }

        const totalEnemyHp = enemies.reduce((sum, e) => sum + e.hp, 0);

        events.push({
          timestamp: currentTime,
          type: 'player-attack',
          actorId: 'hero',
          targetId: target.id,
          dmg: pDmg,
          isCrit,
          isRange: isRangeProc,
          healedAmount: healed,
          minionKilled: enemyKilled,
          killedMinionIndex: killedIndex,
          heroHpLeft: playerHp,
          minionsHpLeft: enemies.map((e) => e.hp),
          targetMinionIndex: targetEnemyIndex,
          totalEnemyHpLeft: totalEnemyHp,
        });

        playerNextAtk = currentTime + playerInterval;
      } else if (currentTime === nextETime && nextEIndex !== -1) {
        const attacker = enemies[nextEIndex];
        const isDodge = Math.random() * 100 < stats.dodgeRate;
        let bDmg = 0;

        if (!isDodge) {
          const variance = 0.9 + Math.random() * 0.2;
          const rawDmg = Math.floor(attacker.atk * variance);
          bDmg = Math.max(1, Math.round(rawDmg * (100 / (100 + stats.defense))));
          playerHp = Math.max(0, playerHp - bDmg);
        }

        const totalEnemyHp = enemies.reduce((sum, e) => sum + e.hp, 0);

        events.push({
          timestamp: currentTime,
          type: 'minion-attack',
          actorId: nextEIndex,
          targetId: 'hero',
          dmg: bDmg,
          isDodge,
          heroHpLeft: playerHp,
          minionsHpLeft: enemies.map((e) => e.hp),
          targetMinionIndex: targetEnemyIndex,
          totalEnemyHpLeft: totalEnemyHp,
        });

        const eVariance = 0.92 + Math.random() * 0.16;
        enemyNextAtk[nextEIndex] = currentTime + Math.max(220, Math.round(enemyIntervals[nextEIndex] * eVariance));
      } else if (currentTime === nextDTime) {
        const target = enemies[targetEnemyIndex];
        let bDmg = 0;
        let pDmg = 0;

        if (burnStacks > 0 && target.hp > 0) {
          bDmg = Math.max(1, Math.floor(target.hp * 0.04 * Math.min(3, burnStacks)));
          target.hp = Math.max(0, target.hp - bDmg);
        }
        if (poisonStacks > 0 && target.hp > 0) {
          pDmg = Math.max(1, Math.floor(stats.attack * 0.15 * poisonStacks));
          target.hp = Math.max(0, target.hp - pDmg);
        }

        const enemyKilled = target.hp <= 0;
        const killedIndex = enemyKilled ? targetEnemyIndex : undefined;

        if (enemyKilled) {
          const remainingAlive = enemies
            .map((e, idx) => (e.hp > 0 ? idx : -1))
            .filter((idx) => idx !== -1);
          if (remainingAlive.length > 0) {
            targetEnemyIndex = remainingAlive[0];
          }
        }

        const totalEnemyHp = enemies.reduce((sum, e) => sum + e.hp, 0);

        events.push({
          timestamp: currentTime,
          type: 'dot-tick',
          actorId: 'hero',
          targetId: target.id,
          dmg: bDmg + pDmg,
          burnDmg: bDmg,
          poisonDmg: pDmg,
          minionKilled: enemyKilled,
          killedMinionIndex: killedIndex,
          heroHpLeft: playerHp,
          minionsHpLeft: enemies.map((e) => e.hp),
          targetMinionIndex: targetEnemyIndex,
          totalEnemyHpLeft: totalEnemyHp,
        });

        nextDotTick = currentTime + 1000;
      }
    }

    const curBossHp = enemies.reduce((sum, e) => sum + e.hp, 0);
    const win = curBossHp <= 0 && playerHp > 0;
    const isTimeout = timedOut || (curBossHp > 0 && playerHp > 0);

    return {
      waveNumber: waveInfo.waveNumber,
      win,
      timedOut: isTimeout,
      playerHpLeft: playerHp,
      playerMaxHp: stats.maxHp,
      enemies,
      events,
    };
  };

  // Dungeon: Claim victorious dungeon rewards upon beating final boss
  const claimDungeonRewards = (rewards: DungeonClearReward) => {
    setState((prev) => {
      const next: GameState = {
        ...prev,
        techCores: prev.techCores + rewards.techCores,
        gems: prev.gems + rewards.gems,
        gold: prev.gold + rewards.gold,
        scrap: prev.scrap + rewards.scrap,
      };
      stateRef.current = next;
      return next;
    });
  };

  // Ruby Shop: Open Mystery Relic Chest
  const buyRubyChest = (tier: 'rare' | 'epic' | 'legendary' | 'mythic'): { item: Equipment; isUpgrade: boolean; currentEquipped: Equipment } | null => {
    const CHEST_COSTS: Record<string, number> = {
      rare: 5,
      epic: 15,
      legendary: 35,
      mythic: 75,
    };
    const cost = CHEST_COSTS[tier] || 5;
    if (state.gems < cost) return null;

    let chosenRarity: Rarity = 'Rare';
    if (tier === 'rare') {
      chosenRarity = Math.random() > 0.3 ? 'Rare' : 'Epic';
    } else if (tier === 'epic') {
      chosenRarity = Math.random() > 0.25 ? 'Epic' : 'Legendary';
    } else if (tier === 'legendary') {
      chosenRarity = Math.random() > 0.15 ? 'Legendary' : 'Mythic';
    } else if (tier === 'mythic') {
      chosenRarity = 'Mythic';
    }

    let targetCivTier = state.era;
    if (tier === 'rare') {
      if (Math.random() < 0.3) targetCivTier = Math.min(10, state.era + 1);
    } else if (tier === 'epic') {
      if (Math.random() < 0.5) targetCivTier = Math.min(10, state.era + 1);
    } else if (tier === 'legendary') {
      targetCivTier = Math.min(10, state.era + (Math.random() < 0.6 ? 1 : 0));
    } else if (tier === 'mythic') {
      targetCivTier = Math.min(10, Math.max(state.era + 1, 5));
    }
    const chosenCiv = CIVILIZATIONS[targetCivTier - 1] || CIVILIZATIONS[0];

    const rarityMult = RARITY_TABLE[chosenRarity].mult;
    const civMult = chosenCiv.multiplier;
    const totalMult = rarityMult * civMult;

    const baseStat = (targetCivTier * 45) + (state.forgeLevel * 12);
    const slotRoll = Math.random() * 100;
    const slot: EquipmentSlot =
      slotRoll < 30 ? 'weapon' :
      slotRoll < 55 ? 'armor' :
      slotRoll < 70 ? 'helmet' :
      slotRoll < 85 ? 'gloves' : 'boots';

    const nameList =
      slot === 'weapon' ? chosenCiv.weapons :
      slot === 'armor' ? chosenCiv.armors :
      slot === 'helmet' ? chosenCiv.helmets :
      slot === 'gloves' ? chosenCiv.gloves : chosenCiv.boots;
    const pickedBaseName = nameList[Math.floor(Math.random() * nameList.length)] || 'Gear';

    const techBonuses = computeTechBonuses(state.techTree);
    const rolledModifiers = rollModifiersForRarity(chosenRarity, techBonuses.modifierBonusPct);

    const newItem: Equipment = {
      id: generateUniqueId(),
      name: `${chosenRarity} ${pickedBaseName}`,
      slot,
      rarity: chosenRarity,
      civilization: chosenCiv.id,
      attack: slot === 'weapon' ? Math.max(1, Math.floor(baseStat * totalMult * (0.95 + Math.random() * 0.15))) :
              slot === 'gloves' ? Math.max(0, Math.floor(baseStat * 0.18 * totalMult)) : 0,
      defense: slot === 'armor' ? Math.max(1, Math.floor(baseStat * 0.6 * totalMult)) :
               slot === 'helmet' ? Math.max(1, Math.floor(baseStat * 0.25 * totalMult)) :
               slot === 'boots' ? Math.max(1, Math.floor(baseStat * 0.22 * totalMult)) :
               slot === 'gloves' ? Math.max(0, Math.floor(baseStat * 0.18 * totalMult)) : 0,
      health: slot === 'armor' ? Math.max(1, Math.floor(baseStat * 3.0 * totalMult)) :
              slot === 'helmet' ? Math.max(1, Math.floor(baseStat * 0.9 * totalMult)) :
              slot === 'boots' ? Math.max(1, Math.floor(baseStat * 0.8 * totalMult)) :
              slot === 'gloves' ? Math.max(0, Math.floor(baseStat * 0.55 * totalMult)) : 0,
      value: Math.floor(120 * totalMult * 0.5),
      modifiers: rolledModifiers,
    };

    const currentEquipped = state.equipped[slot];
    const newModPower = rolledModifiers.reduce((sum, m) => sum + m.value, 0);
    const currModPower = (currentEquipped.modifiers || []).reduce((sum, m) => sum + m.value, 0);

    const isUpgrade = slot === "weapon"
      ? (newItem.attack * (1 + newModPower / 100)) > (currentEquipped.attack * (1 + currModPower / 100))
      : ((newItem.defense + newItem.health + newItem.attack) * (1 + newModPower / 100)) > ((currentEquipped.defense + currentEquipped.health + currentEquipped.attack) * (1 + currModPower / 100));

    setState((prev) => {
      const scrapBonus = (prev.blessings?.includes('scrap_sigil') ? 1.5 : 1.0) * (1 + techBonuses.scrapBonusPct / 100);
      let next: GameState;
      if (prev.autoEquip && isUpgrade) {
        next = {
          ...prev,
          gems: prev.gems - cost,
          scrap: prev.scrap + Math.floor(currentEquipped.value * scrapBonus),
          equipped: { ...prev.equipped, [slot]: newItem },
        };
      } else {
        next = {
          ...prev,
          gems: prev.gems - cost,
        };
      }
      stateRef.current = next;
      return next;
    });

    return { item: newItem, isUpgrade, currentEquipped };
  };

  // Ruby Shop: Buy Permanent Blessing
  const buyRubyBlessing = (blessingId: string, cost: number): boolean => {
    if (state.gems < cost || state.blessings?.includes(blessingId)) return false;
    setState((prev) => {
      const next = {
        ...prev,
        gems: prev.gems - cost,
        blessings: [...(prev.blessings || []), blessingId],
      };
      stateRef.current = next;
      return next;
    });
    return true;
  };

  // Ruby Shop: Instant Resource Bundles
  const buyRubyResource = (type: 'gold' | 'scrap' | 'grand', cost: number): boolean => {
    if (state.gems < cost) return false;
    const eraMult = Math.max(1, state.era);
    setState((prev) => {
      let goldAdd = 0;
      let scrapAdd = 0;
      if (type === 'gold') {
        goldAdd = 3000 * eraMult;
      } else if (type === 'scrap') {
        scrapAdd = 250 * eraMult;
      } else if (type === 'grand') {
        goldAdd = 12000 * eraMult;
        scrapAdd = 800 * eraMult;
      }
      const next = {
        ...prev,
        gems: prev.gems - cost,
        gold: prev.gold + goldAdd,
        scrap: prev.scrap + scrapAdd,
      };
      stateRef.current = next;
      return next;
    });
    return true;
  };

  // Ruby Shop: Buy Multi-Forge Anvil Expansion (up to 5x Batch)
  const buyMultiForgeUpgrade = (): boolean => {
    const curLevel = stateRef.current.multiForgeLevel || 1;
    if (curLevel >= 5) return false;
    const cost = MULTI_FORGE_UPGRADE_COSTS[curLevel] || 25;
    if (stateRef.current.gems < cost) return false;

    setState((prev) => {
      const nextLevel = Math.min(5, (prev.multiForgeLevel || 1) + 1);
      const next: GameState = {
        ...prev,
        gems: prev.gems - cost,
        multiForgeLevel: nextLevel,
      };
      stateRef.current = next;
      return next;
    });
    return true;
  };

  return {
    state,
    forgeItem,
    equipItem,
    equipMultipleItems,
    scrapItem,
    scrapMultipleItems,
    toggleAutoEquip,
    setFloor,
    upgradeForge,
    getUpgradeCost,
    fightFloorBoss,
    resetGame,
    buyRubyChest,
    buyRubyBlessing,
    buyRubyResource,
    buyMultiForgeUpgrade,
    upgradeTechNode,
    respecTechTree,
    startDungeonExpedition,
    fightDungeonWave,
    claimDungeonRewards,
  };
}