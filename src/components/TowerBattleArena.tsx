import React, { useState, useEffect, useRef } from 'react';
import { getBossInfo, calculatePlayerCombatStats } from '../hooks/useAutoForge';
import type { GameState, BattleResult, Equipment, BattleEvent, StageEnemyInfo } from '../hooks/useAutoForge';
import { getEraTheme } from './EraThemes';
import { HeroSprite, EnemySprite } from './CharacterSprites';
import { BattlefieldScenery } from './BattlefieldScenery';
import { getWeaponShape } from './GearVisuals';
import { RARITY_CONFIGS } from './RarityTheme';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Swords,
  Zap,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Flame,
  Skull,
  Crosshair,
  Gauge,
  Heart,
  Key,
  Cpu,
} from 'lucide-react';

interface TowerBattleArenaProps {
  state: GameState;
  onFightBoss: (floor?: number) => BattleResult;
  onSetFloor: (floor: number) => void;
  onOpenDungeon?: () => void;
  onOpenTechTree?: () => void;
}

interface FloatingDmg {
  id: number;
  target: 'hero' | 'boss';
  minionIndex?: number;
  text: string;
  isCrit?: boolean;
  isDodge?: boolean;
  isBurn?: boolean;
  isPoison?: boolean;
  isHeal?: boolean;
  isRange?: boolean;
}

interface ImpactFX {
  id: number;
  target: 'hero' | 'boss';
  minionIndex?: number;
  type:
    | 'hero-slash'
    | 'boss-slash'
    | 'boss-claw'
    | 'boss-axe'
    | 'hit-burst';
  color: string;
  isCrit?: boolean;
}

interface ProjectileFX {
  id: number;
  type:
    | 'hero-bullet'
    | 'hero-laser'
    | 'hero-spear'
    | 'hero-sniper'
    | 'boss-orb'
    | 'boss-missile'
    | 'boss-laser'
    | 'boss-void';
  color: string;
  isCrit?: boolean;
}

// Detect attack style from weapon
function getHeroAttackInfo(weapon: Equipment | undefined, rangeProc = false): {
  isRanged: boolean;
  fxType: ProjectileFX['type'] | 'hero-slash';
  color: string;
} {
  const rarityConf = RARITY_CONFIGS[weapon?.rarity || 'Common'];
  const shape = getWeaponShape(weapon);
  const name = (weapon?.name || '').toLowerCase();
  const color = rarityConf?.color || '#f59e0b';

  if (rangeProc) {
    return { isRanged: true, fxType: 'hero-sniper', color: '#a855f7' };
  }

  // Ranged firearm / bow / blaster weapons
  if (
    shape === 'rifle' ||
    name.includes('rifle') ||
    name.includes('gun') ||
    name.includes('pistol') ||
    name.includes('bow') ||
    name.includes('crossbow') ||
    name.includes('musket') ||
    name.includes('blaster') ||
    name.includes('cannon') ||
    name.includes('sniper')
  ) {
    return { isRanged: true, fxType: 'hero-bullet', color };
  }

  // Laser / beam / ray blasters
  if (
    name.includes('beam rifle') ||
    name.includes('laser gun') ||
    name.includes('plasma cannon') ||
    name.includes('ray gun')
  ) {
    return { isRanged: true, fxType: 'hero-laser', color };
  }

  // Melee weapons: sword, dagger, axe, club, spear, pike, halberd, rapier, katana, scythe, vibroblade, etc.
  return { isRanged: false, fxType: 'hero-slash', color };
}

// Detect boss attack style by era
function getBossAttackInfo(era: number): {
  isRanged: boolean;
  fxType: ProjectileFX['type'] | 'boss-claw' | 'boss-axe' | 'boss-slash';
  color: string;
} {
  switch (era) {
    case 1:
      return { isRanged: false, fxType: 'boss-claw', color: '#ef4444' };
    case 2:
      return { isRanged: true, fxType: 'boss-orb', color: '#38bdf8' };
    case 3:
      return { isRanged: false, fxType: 'boss-axe', color: '#22c55e' };
    case 4:
      return { isRanged: false, fxType: 'boss-axe', color: '#eab308' };
    case 5:
      return { isRanged: false, fxType: 'boss-claw', color: '#ec4899' };
    case 6:
      return { isRanged: false, fxType: 'boss-slash', color: '#c084fc' };
    case 7:
      return { isRanged: true, fxType: 'boss-missile', color: '#06b6d4' };
    case 8:
      return { isRanged: true, fxType: 'boss-missile', color: '#6366f1' };
    case 9:
      return { isRanged: true, fxType: 'boss-laser', color: '#f97316' };
    case 10:
      return { isRanged: true, fxType: 'boss-void', color: '#d946ef' };
    default:
      return { isRanged: false, fxType: 'boss-slash', color: '#ef4444' };
  }
}

export const TowerBattleArena: React.FC<TowerBattleArenaProps> = ({
  state,
  onFightBoss,
  onSetFloor,
  onOpenDungeon,
  onOpenTechTree,
}) => {
  const [isFighting, setIsFighting] = useState(false);
  const [keyDropToast, setKeyDropToast] = useState(false);

  // Hero combat animation & movement states
  const [heroAction, setHeroAction] = useState<'idle' | 'walking' | 'melee-slash' | 'ranged-aim' | 'hit' | 'dodge'>('idle');
  const [heroOffset, setHeroOffset] = useState<number>(0);
  const [heroRangedStance, setHeroRangedStance] = useState(false);
  const [heroHit, setHeroHit] = useState(false);
  const [heroDodging, setHeroDodging] = useState(false);

  // Track the floor the current battle is being fought on and active stage
  const [battleFloor, setBattleFloor] = useState(state.currentFloor);
  const [activeBattleStage, setActiveBattleStage] = useState<StageEnemyInfo | null>(null);

  // Dynamic HP and stage info tracking for live combat visualization
  const displayBoss = activeBattleStage || getBossInfo(isFighting ? battleFloor : state.currentFloor);
  const eraTheme = getEraTheme(displayBoss.era);
  const playerStats = calculatePlayerCombatStats(state.equipped, state.blessings || [], state.techTree || {});
  const playerMaxHp = playerStats.maxHp;

  // Single Boss combat animation states (for Stage 10)
  const [bossAction, setBossAction] = useState<'idle' | 'walking' | 'melee-slash' | 'ranged-cast' | 'hit'>('idle');
  const [bossOffset, setBossOffset] = useState<number>(0);
  const [bossWalking, setBossWalking] = useState(false);
  const [bossHit, setBossHit] = useState(false);

  // Multi-Minion squad states: each minion has its own HP, attacking, walking, offset, hit, and slain tracking
  const [minionsHp, setMinionsHp] = useState<number[]>(displayBoss.minions.map((m) => m.hp));
  const [targetMinionIndex, setTargetMinionIndex] = useState<number>(0);
  const [minionAttacking, setMinionAttacking] = useState<Record<number, boolean>>({});
  const [minionWalking, setMinionWalking] = useState<Record<number, boolean>>({});
  const [minionOffsets, setMinionOffsets] = useState<Record<number, number>>({});
  const [minionHit, setMinionHit] = useState<Record<number, boolean>>({});

  // FX & Visual overlays (supports multiple simultaneous attack effects)
  const [activeProjectiles, setActiveProjectiles] = useState<ProjectileFX[]>([]);
  const [activeImpactFXs, setActiveImpactFXs] = useState<ImpactFX[]>([]);
  const [activeLeechFX, setActiveLeechFX] = useState<boolean>(false);
  const [screenCritRumble, setScreenCritRumble] = useState(false);

  const [hasBurnStatus, setHasBurnStatus] = useState(false);
  const [hasPoisonStatus, setHasPoisonStatus] = useState(false);

  const [floatingDmgs, setFloatingDmgs] = useState<FloatingDmg[]>([]);
  const [battleOutcome, setBattleOutcome] = useState<{ win: boolean; reward: number; log: string } | null>(null);
  const [autoBattle, setAutoBattle] = useState(false);
  const [battleSpeed, setBattleSpeed] = useState<1 | 2 | 3>(1);

  const [heroDisplayHp, setHeroDisplayHp] = useState(playerMaxHp);

  // Reset positions and combat stances
  const resetCombatStances = (floorNum?: number) => {
    const f = floorNum ?? (isFighting ? battleFloor : state.currentFloor);
    const stage = getBossInfo(f);
    setHeroOffset(0);
    setHeroAction('idle');
    setBossOffset(0);
    setBossWalking(false);
    setBossAction('idle');
    setHeroHit(false);
    setBossHit(false);
    setHeroDodging(false);
    setActiveProjectiles([]);
    setActiveImpactFXs([]);
    setActiveLeechFX(false);
    setMinionsHp(stage.minions.map((m) => m.maxHp));
    setTargetMinionIndex(0);
    setMinionAttacking({});
    setMinionWalking({});
    setMinionOffsets({});
    setMinionHit({});
  };

  // Sync HP when floor or gear changes outside of an active battle
  useEffect(() => {
    if (!isFighting && !battleOutcome) {
      setHeroDisplayHp(playerMaxHp);
      setBattleFloor(state.currentFloor);
      const stage = getBossInfo(state.currentFloor);
      setMinionsHp(stage.minions.map((m) => m.maxHp));
      setTargetMinionIndex(0);
      setHasBurnStatus(false);
      setHasPoisonStatus(false);
      resetCombatStances(state.currentFloor);
    }
  }, [state.currentFloor, playerMaxHp, isFighting, battleOutcome]);

  const handleFloorChange = (newFloor: number) => {
    if (isFighting) return;
    setBattleOutcome(null);
    onSetFloor(newFloor);
    setBattleFloor(newFloor);
    const newBoss = getBossInfo(newFloor);
    setHeroDisplayHp(playerMaxHp);
    setMinionsHp(newBoss.minions.map((m) => m.maxHp));
    setTargetMinionIndex(0);
    setHasBurnStatus(false);
    setHasPoisonStatus(false);
    resetCombatStances(newFloor);
  };

  const autoBattleRef = useRef(autoBattle);
  autoBattleRef.current = autoBattle;
  const battleSpeedRef = useRef(battleSpeed);
  battleSpeedRef.current = battleSpeed;

  const runBattleSequence = async (floorOverride?: number) => {
    if (isFighting) return;
    setIsFighting(true);
    setBattleOutcome(null);
    setHasBurnStatus(false);
    setHasPoisonStatus(false);

    const targetFloor = floorOverride ?? state.currentFloor;
    const fightStage = getBossInfo(targetFloor);
    setActiveBattleStage(fightStage);
    setBattleFloor(targetFloor);
    resetCombatStances(targetFloor);

    const result = onFightBoss(targetFloor);
    let currentHeroHp = result.playerMaxHp;
    setHeroDisplayHp(currentHeroHp);

    const initialMinionsHp = result.minions.map((m) => m.maxHp);
    setMinionsHp(initialMinionsHp);
    setTargetMinionIndex(0);

    const speed = battleSpeedRef.current;
    // Speed factor: 1x = 1.0, 2x = 0.55, 3x = 0.32
    const speedMult = speed === 3 ? 0.32 : speed === 2 ? 0.55 : 1.0;

    const heroAtkInfo = getHeroAttackInfo(state.equipped.weapon);
    const bossAtkInfo = getBossAttackInfo(fightStage.era);
    setHeroRangedStance(heroAtkInfo.isRanged);

    const isHeroMelee = !heroAtkInfo.isRanged;
    const isBossMelee = !bossAtkInfo.isRanged;

    // Movement resolution:
    // 1. Both Melee: Both walk forward and meet in the exact middle.
    // 2. One is Ranged & other is Melee: The melee one walks all the way to the ranged one,
    //    while the ranged one always stays on the exact same spot from the beginning.
    // 3. Both Ranged: Neither walks; both stay on their starting spots and fight from range.
    if (isHeroMelee && isBossMelee) {
      // Both melee: meet in the exact middle face-to-face
      setHeroAction('walking');
      setHeroOffset(105);

      if (fightStage.isBoss) {
        setBossWalking(true);
        setBossAction('walking');
        setBossOffset(105);
      } else {
        const walkMap: Record<number, boolean> = {};
        const offsetMap: Record<number, number> = {};
        initialMinionsHp.forEach((_, idx) => {
          walkMap[idx] = true;
          offsetMap[idx] = 95;
        });
        setMinionWalking(walkMap);
        setMinionOffsets(offsetMap);
      }

      const walkTime = speed === 3 ? 150 : speed === 2 ? 240 : 360;
      await new Promise((r) => setTimeout(r, walkTime));

      setHeroAction('idle');
      setBossWalking(false);
      setBossAction('idle');
      setMinionWalking({});
    } else if (isHeroMelee && !isBossMelee) {
      // Hero is melee, enemy is ranged: Hero walks all the way to the ranged enemy.
      // The ranged enemy stays on the exact same spot from the beginning (offset 0).
      setHeroAction('walking');
      setHeroOffset(205);

      const walkTime = speed === 3 ? 150 : speed === 2 ? 240 : 360;
      await new Promise((r) => setTimeout(r, walkTime));

      setHeroAction('idle');
    } else if (!isHeroMelee && isBossMelee) {
      // Hero is ranged, enemy is melee: Hero stays on the exact same spot from the beginning (offset 0).
      // The melee enemy walks all the way to the ranged Hero.
      if (fightStage.isBoss) {
        setBossWalking(true);
        setBossAction('walking');
        setBossOffset(205);
      } else {
        const walkMap: Record<number, boolean> = {};
        const offsetMap: Record<number, number> = {};
        initialMinionsHp.forEach((_, idx) => {
          walkMap[idx] = true;
          offsetMap[idx] = 195;
        });
        setMinionWalking(walkMap);
        setMinionOffsets(offsetMap);
      }

      const walkTime = speed === 3 ? 150 : speed === 2 ? 240 : 360;
      await new Promise((r) => setTimeout(r, walkTime));

      setBossWalking(false);
      setBossAction('idle');
      setMinionWalking({});
    }
    // If both are ranged (!isHeroMelee && !isBossMelee), neither walks, both remain at offset 0.

    let lastTimestamp = 0;

    // Time-based Continuous Real-Time Attack Speed Playback
    for (let i = 0; i < result.events.length; i++) {
      const event: BattleEvent = result.events[i];
      const timeDelta = event.timestamp - lastTimestamp;
      lastTimestamp = event.timestamp;

      // Smooth real-time delay (allows multiple enemies to strike independently without waiting)
      if (timeDelta > 0) {
        const scaledWait = Math.min(
          speed === 3 ? 140 : speed === 2 ? 260 : 420,
          Math.round(timeDelta * speedMult)
        );
        if (scaledWait > 0) {
          await new Promise((r) => setTimeout(r, scaledWait));
        }
      }

      setTargetMinionIndex(event.targetMinionIndex);

      if (event.type === 'player-attack') {
        // =========================================================
        // 1. HERO ATTACKS THE TARGET MINION
        // =========================================================
        const isRanged = heroAtkInfo.isRanged || event.isRange;
        const targetIdx = typeof event.targetId === 'number' ? event.targetId : 0;

        if (!isRanged) {
          setHeroAction('melee-slash');
          soundFx.playSlash();
        } else {
          setHeroAction('ranged-aim');
          soundFx.playRangedShot();
        }

        // Trigger Projectile FX if ranged
        const projId = Date.now() + Math.random();
        if (isRanged) {
          const newProj: ProjectileFX = {
            id: projId,
            type: (event.isRange ? 'hero-sniper' : heroAtkInfo.fxType) as ProjectileFX['type'],
            color: heroAtkInfo.color,
            isCrit: event.isCrit,
          };
          setActiveProjectiles((prev) => [...prev.slice(-4), newProj]);
        }

        // Target Minion takes Hit Recoil
        setMinionHit((prev) => ({ ...prev, [targetIdx]: true }));
        setBossHit(true);
        setBossAction('hit');

        const impactId = Date.now() + Math.random();
        const newImpactFx: ImpactFX = {
          id: impactId,
          target: 'boss',
          minionIndex: targetIdx,
          type: !isRanged ? 'hero-slash' : 'hit-burst',
          isCrit: event.isCrit,
          color: heroAtkInfo.color,
        };
        setActiveImpactFXs((prev) => [...prev.slice(-6), newImpactFx]);

        if (event.isCrit) {
          soundFx.playCrit();
          setScreenCritRumble(true);
          setTimeout(() => setScreenCritRumble(false), 240);
        } else {
          soundFx.playHit();
        }

        // Update target minion HP
        setMinionsHp([...event.minionsHpLeft]);

        // Spawn floating damage popup over the target minion
        setFloatingDmgs((prev) => [
          ...prev.slice(-6),
          {
            id: Date.now() + Math.random(),
            target: 'boss',
            minionIndex: targetIdx,
            text: `-${event.dmg}`,
            isCrit: event.isCrit,
            isRange: event.isRange,
          },
        ]);

        if (event.minionKilled) {
          setFloatingDmgs((prev) => [
            ...prev.slice(-6),
            {
              id: Date.now() + Math.random() + 0.3,
              target: 'boss',
              minionIndex: targetIdx,
              text: '💀 SLAIN!',
              isCrit: true,
            },
          ]);
        }

        if (event.healedAmount && event.healedAmount > 0) {
          setActiveLeechFX(true);
          setTimeout(() => setActiveLeechFX(false), 300);
          setFloatingDmgs((prev) => [
            ...prev.slice(-6),
            {
              id: Date.now() + Math.random() + 0.4,
              target: 'hero',
              text: `💚 +${event.healedAmount}`,
              isHeal: true,
            },
          ]);
        }

        // Action recovery duration
        const actionResetTime = speed === 3 ? 60 : speed === 2 ? 100 : 160;
        setTimeout(() => {
          setHeroAction('idle');
          setMinionHit((prev) => ({ ...prev, [targetIdx]: false }));
          setBossHit(false);
          setBossAction('idle');
          setActiveProjectiles((prev) => prev.filter((fx) => fx.id !== projId));
          setActiveImpactFXs((prev) => prev.filter((imp) => imp.id !== impactId));
        }, actionResetTime);

      } else if (event.type === 'minion-attack') {
        // =========================================================
        // 2. MINION ATTACKS HERO (Each minion attacks on its own!)
        // =========================================================
        const attackerIdx = typeof event.actorId === 'number' ? event.actorId : 0;
        const isMelee = !bossAtkInfo.isRanged;

        if (isMelee) {
          if (fightStage.isBoss) {
            setBossAction('melee-slash');
          } else {
            setMinionAttacking((prev) => ({ ...prev, [attackerIdx]: true }));
          }
          soundFx.playSlash();
        } else {
          // Ranged: Shoot / cast from distance
          if (fightStage.isBoss) {
            setBossAction('ranged-cast');
          } else {
            setMinionAttacking((prev) => ({ ...prev, [attackerIdx]: true }));
          }
          soundFx.playRangedShot();
        }

        const projId = Date.now() + Math.random();
        if (!isMelee) {
          const newProj: ProjectileFX = {
            id: projId,
            type: bossAtkInfo.fxType as ProjectileFX['type'],
            color: bossAtkInfo.color,
          };
          setActiveProjectiles((prev) => [...prev.slice(-4), newProj]);
        }

        if (event.isDodge) {
          // Hero dodges with agility
          setHeroDodging(true);
          setHeroAction('dodge');
          soundFx.playDodge();
          setTimeout(() => {
            setHeroDodging(false);
            setHeroAction('idle');
          }, 240);

          setFloatingDmgs((prev) => [
            ...prev.slice(-6),
            {
              id: Date.now() + Math.random(),
              target: 'hero',
              text: '💨 DODGED!',
              isDodge: true,
            },
          ]);
        } else {
          // Hero takes damage
          setHeroHit(true);
          setHeroAction('hit');
          soundFx.playHit();
          currentHeroHp = event.heroHpLeft;
          setHeroDisplayHp(currentHeroHp);

          const impactId = Date.now() + Math.random();
          const newImpactFx: ImpactFX = {
            id: impactId,
            target: 'hero',
            type: isMelee
              ? (bossAtkInfo.fxType as 'boss-slash' | 'boss-claw' | 'boss-axe')
              : 'hit-burst',
            color: bossAtkInfo.color,
          };
          setActiveImpactFXs((prev) => [...prev.slice(-6), newImpactFx]);

          setTimeout(() => {
            setActiveImpactFXs((prev) => prev.filter((imp) => imp.id !== impactId));
          }, 260);

          setFloatingDmgs((prev) => [
            ...prev.slice(-6),
            {
              id: Date.now() + Math.random(),
              target: 'hero',
              text: `-${event.dmg}`,
            },
          ]);
        }

        const minionResetTime = speed === 3 ? 70 : speed === 2 ? 110 : 180;
        setTimeout(() => {
          setMinionAttacking((prev) => ({ ...prev, [attackerIdx]: false }));
          setHeroHit(false);
          if (!event.isDodge) setHeroAction('idle');
          setBossAction('idle');
          setActiveProjectiles((prev) => prev.filter((fx) => fx.id !== projId));
        }, minionResetTime);

      } else if (event.type === 'dot-tick') {
        // =========================================================
        // 3. STATUS EFFECT DoT TICK (Burn / Toxic)
        // =========================================================
        const targetIdx = typeof event.targetId === 'number' ? event.targetId : 0;
        setMinionsHp([...event.minionsHpLeft]);

        if (event.burnDmg && event.burnDmg > 0) {
          setHasBurnStatus(true);
          soundFx.playBurn();
          setFloatingDmgs((prev) => [
            ...prev.slice(-6),
            {
              id: Date.now() + Math.random() + 0.1,
              target: 'boss',
              minionIndex: targetIdx,
              text: `🔥 -${event.burnDmg} Burn`,
              isBurn: true,
            },
          ]);
        }

        if (event.poisonDmg && event.poisonDmg > 0) {
          setHasPoisonStatus(true);
          soundFx.playPoison();
          setFloatingDmgs((prev) => [
            ...prev.slice(-6),
            {
              id: Date.now() + Math.random() + 0.2,
              target: 'boss',
              minionIndex: targetIdx,
              text: `🧪 -${event.poisonDmg} Toxic`,
              isPoison: true,
            },
          ]);
        }
      }
    }

    // Clean up damage popups
    setTimeout(() => setFloatingDmgs([]), 700);

    if (result.win) {
      soundFx.playVictory(result.isBoss);
      if (result.keyDropped) {
        soundFx.playKeyDrop();
        setKeyDropToast(true);
        setTimeout(() => setKeyDropToast(false), 3500);
      }
      try {
        confetti({
          particleCount: result.isBoss ? 70 : 45,
          spread: result.isBoss ? 75 : 55,
          origin: { y: 0.7 },
          colors: ['#fbbf24', '#f59e0b', '#6366f1', '#10b981'],
        });
      } catch {
        // Confetti fallback
      }
      setBattleOutcome({
        win: true,
        reward: result.reward,
        log: result.isBoss
          ? `👑 STAGE BOSS SLAIN! Floor ${result.floor} Cleared! Earned +${result.reward.toLocaleString()} Gold.${result.keyDropped ? ' 🗝️ Found 1 Ancient Keystone!' : ''}`
          : `⚔️ All ${result.minionCount} Minions Defeated! Floor ${result.floor} Cleared! Earned +${result.reward.toLocaleString()} Gold.${result.keyDropped ? ' 🗝️ Found 1 Ancient Keystone!' : ''}`,
      });
    } else if (result.timedOut) {
      soundFx.playDefeat();
      const eraNum = Math.floor((result.floor - 1) / 10) + 1;
      const stageInEra = ((result.floor - 1) % 10) + 1;
      setBattleOutcome({
        win: false,
        reward: 0,
        log: stageInEra > 1
          ? `⏰ Time's Up! Reset back to Stage ${eraNum}-1 (Floor ${result.resetFloor}). Upgrade your ATK & ATK Speed!`
          : `⏰ Round Limit Reached (30s Combat Time)! Upgrade your ATK & ATK Speed!`,
      });
      setAutoBattle(false);
    } else {
      soundFx.playDefeat();
      const eraNum = Math.floor((result.floor - 1) / 10) + 1;
      const stageInEra = ((result.floor - 1) % 10) + 1;
      setBattleOutcome({
        win: false,
        reward: 0,
        log: stageInEra > 1
          ? `💀 Defeated on Stage ${eraNum}-${stageInEra}! Reset back to Stage ${eraNum}-1 (Floor ${result.resetFloor}). Upgrade your DEF & HP!`
          : `💀 Defeated on Stage ${eraNum}-1! Hero HP reached 0. Upgrade your DEF & HP!`,
      });
      setAutoBattle(false);
    }

    setIsFighting(false);
    setActiveBattleStage(null);
    setBattleFloor(result.nextFloor);
    const nextBoss = getBossInfo(result.nextFloor);
    setHeroDisplayHp(playerMaxHp);
    setMinionsHp(nextBoss.minions.map((m) => m.maxHp));
    setTargetMinionIndex(0);
    resetCombatStances(result.nextFloor);

    // Auto-battle continuous loop
    if (result.win && autoBattleRef.current) {
      const nextFloor = result.nextFloor;
      setTimeout(() => {
        if (autoBattleRef.current) {
          runBattleSequence(nextFloor);
        }
      }, speed === 3 ? 350 : speed === 2 ? 600 : 900);
    }
  };

  const totalCurrentEnemyHp = minionsHp.reduce((sum, val) => sum + val, 0);
  const totalMaxEnemyHp = displayBoss.bossHp;
  const bossHpPct = Math.max(0, Math.min(100, Math.floor((totalCurrentEnemyHp / Math.max(1, totalMaxEnemyHp)) * 100)));
  const heroHpPct = Math.max(0, Math.min(100, Math.floor((heroDisplayHp / playerMaxHp) * 100)));
  const aliveMinionsCount = minionsHp.filter((hp) => hp > 0).length;

  return (
    <div className={`bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden ${
      screenCritRumble ? 'animate-crit-rumble' : ''
    }`}>
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Stage info */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-zinc-100 flex items-center gap-1.5">
                <span>Stage {displayBoss.era}-{(isFighting ? battleFloor - 1 : state.currentFloor - 1) % 10 + 1}</span>
                {displayBoss.isBoss ? (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 border border-rose-500/60 flex items-center gap-1 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                    👑 FINAL BOSS STAGE
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    👾 {displayBoss.minionCount} Minions
                  </span>
                )}
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {eraTheme.name}
              </span>
            </div>
            <p className="text-xs text-zinc-400">{eraTheme.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Battle Speed Selector */}
          <button
            onClick={() => setBattleSpeed((s) => (s === 1 ? 2 : s === 2 ? 3 : 1))}
            className="px-2 py-1 rounded-xl text-xs font-black bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
            title="Battle Speed (1x / 2x / 3x)"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span>{battleSpeed}x Speed</span>
          </button>

          {/* Floor Navigation Controls */}
          <div className="flex items-center bg-zinc-950/80 border border-zinc-700/60 rounded-xl p-0.5">
            <button
              onClick={() => handleFloorChange(state.currentFloor - 1)}
              disabled={state.currentFloor <= 1 || isFighting}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition cursor-pointer"
              title="Previous Floor"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-indigo-300 px-2 min-w-[65px] text-center">
              F.{state.currentFloor} / {state.highestFloor || 1}
            </span>
            <button
              onClick={() => handleFloorChange(state.currentFloor + 1)}
              disabled={state.currentFloor >= (state.highestFloor || 1) || isFighting}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition cursor-pointer"
              title="Next Unlocked Floor"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setAutoBattle((prev) => !prev)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 border ${
              autoBattle
                ? 'bg-indigo-950 border-indigo-500 text-indigo-300 animate-pulse'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            {autoBattle ? 'Auto: ON' : 'Auto: OFF'}
          </button>
        </div>
      </div>

      {/* DYNAMIC SCENIC BATTLEFIELD STAGE */}
      <div
        className="relative w-full rounded-2xl border border-zinc-800/90 overflow-hidden mb-4 select-none shadow-2xl transition-all duration-700"
        style={{ minHeight: '290px' }}
      >
        {/* Layered Era Landscape Scenery Backdrop */}
        <BattlefieldScenery eraTheme={eraTheme} era={displayBoss.era} />

        {/* ACTIVE PROJECTILE & LIFESTEAL OVERLAYS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
          {activeProjectiles.map((proj) => {
            if (proj.type === 'hero-bullet') {
              return (
                <div key={proj.id} className="absolute top-1/2 animate-projectile-hero pointer-events-none">
                  <div className="w-6 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] border border-white" />
                </div>
              );
            }

            if (proj.type === 'hero-laser') {
              return (
                <div key={proj.id} className="absolute top-1/2 animate-projectile-hero pointer-events-none">
                  <div
                    className="w-12 h-3 rounded-full shadow-[0_0_15px_#38bdf8] border border-white animate-pulse"
                    style={{ backgroundColor: proj.color }}
                  />
                </div>
              );
            }

            if (proj.type === 'hero-spear') {
              return (
                <div key={proj.id} className="absolute top-1/2 animate-projectile-hero pointer-events-none">
                  <svg viewBox="0 0 40 12" className="w-10 h-3 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                    <rect x="0" y="4.5" width="30" height="3" fill="#94a3b8" />
                    <polygon points="30,0 40,6 30,12" fill={proj.color} />
                  </svg>
                </div>
              );
            }

            if (proj.type === 'hero-sniper') {
              return (
                <div key={proj.id} className="absolute top-1/2 animate-projectile-hero pointer-events-none">
                  <div className="flex items-center gap-1">
                    <div className="w-10 h-2.5 rounded-full bg-purple-400 shadow-[0_0_15px_#a855f7] border border-white" />
                    <Crosshair className="w-4 h-4 text-purple-300 animate-spin" />
                  </div>
                </div>
              );
            }

            if (proj.type === 'boss-orb') {
              return (
                <div key={proj.id} className="absolute top-1/2 animate-projectile-boss pointer-events-none">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-400 to-indigo-600 shadow-[0_0_15px_#38bdf8] border border-white animate-pulse" />
                </div>
              );
            }

            if (proj.type === 'boss-missile') {
              return (
                <div key={proj.id} className="absolute top-1/2 animate-projectile-boss pointer-events-none">
                  <div className="w-8 h-3.5 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] border border-amber-300" />
                </div>
              );
            }

            if (proj.type === 'boss-laser') {
              return (
                <div key={proj.id} className="absolute top-1/2 animate-projectile-boss pointer-events-none">
                  <div className="w-14 h-3 rounded-full bg-orange-500 shadow-[0_0_16px_#f97316] border border-white" />
                </div>
              );
            }

            if (proj.type === 'boss-void') {
              return (
                <div key={proj.id} className="absolute top-1/2 animate-projectile-boss pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-600 shadow-[0_0_20px_#d946ef] border-2 border-white animate-spin" />
                </div>
              );
            }

            return null;
          })}

          {/* VAMPIRIC LEECH ORB */}
          {activeLeechFX && (
            <div className="absolute animate-leech-orb pointer-events-none z-30">
              <div className="w-5 h-5 rounded-full bg-rose-500 shadow-[0_0_15px_#f43f5e] border border-pink-200 animate-pulse" />
            </div>
          )}
        </div>

        {/* VS Divider in EXACT CENTER (Behind characters) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-950/95 border-2 border-amber-500/80 flex items-center justify-center text-[10px] sm:text-xs font-black text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.5)]">
            VS
          </div>
        </div>

        {/* SYMMETRICAL COMBATANTS CONTAINER (Hero Left 50% vs Enemy Right 50%) */}
        <div className="grid grid-cols-2 gap-4 items-center relative z-10 p-3 sm:p-5 h-full">
          {/* HERO (Left Half) */}
          <div className="flex flex-col items-center justify-center text-center relative">
            {/* Health bar */}
            <div className="w-full max-w-[130px] sm:max-w-[160px] mb-2 bg-black/80 backdrop-blur-md p-1.5 rounded-lg border border-white/15 shadow-lg">
              <div className="flex justify-between text-[10px] font-bold text-zinc-300 mb-0.5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Heart className="w-3 h-3" /> HERO
                </span>
                <span>{heroDisplayHp} HP</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-emerald-950">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  style={{ width: `${heroHpPct}%` }}
                />
              </div>
            </div>

            {/* Hero Character Sprite Container */}
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{
                transform: `translateX(${heroOffset}px)`,
                zIndex: heroAction === 'melee-slash' || heroAction === 'walking' ? 30 : 10,
              }}
            >
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-500/20 rounded-full blur-md pointer-events-none" />

              {/* Floating Damage Directly Over Hero */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-40 flex flex-col items-center">
                {floatingDmgs.filter((d) => d.target === 'hero').map((dmg) => (
                  <div
                    key={dmg.id}
                    className={`animate-float-dmg font-black text-xs sm:text-sm whitespace-nowrap drop-shadow-md ${
                      dmg.isDodge
                        ? 'text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,1)]'
                        : dmg.isHeal
                        ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,1)]'
                        : 'text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]'
                    }`}
                  >
                    {dmg.text}
                  </div>
                ))}
              </div>

              {/* Enemy Hit & Slash FX Directly Centered on Hero */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-35 overflow-visible">
                {activeImpactFXs.filter((imp) => imp.target === 'hero').map((imp) => {
                  if (imp.type === 'boss-slash') {
                    return (
                      <div key={imp.id} className="absolute inset-0 flex items-center justify-center pointer-events-none scale-125">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 animate-boss-slash">
                          <defs>
                            <linearGradient id={`bossSlash-${imp.id}`} x1="1" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ffffff" />
                              <stop offset="40%" stopColor={imp.color} />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                          <path d="M 90 90 Q 50 50 15 10 Q 25 40 55 65 Z" fill={`url(#bossSlash-${imp.id})`} filter="drop-shadow(0 0 10px #c084fc)" />
                          <path d="M 85 85 Q 50 45 12 12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                    );
                  }
                  if (imp.type === 'boss-claw') {
                    return (
                      <div key={imp.id} className="absolute inset-0 flex items-center justify-center pointer-events-none scale-125">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 animate-boss-claw">
                          <path d="M 80 20 L 30 80 M 65 15 L 15 75 M 50 10 L 0 70" stroke={imp.color} strokeWidth="4.5" strokeLinecap="round" filter="drop-shadow(0 0 10px #ef4444)" />
                          <path d="M 80 20 L 30 80 M 65 15 L 15 75" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    );
                  }
                  if (imp.type === 'boss-axe') {
                    return (
                      <div key={imp.id} className="absolute inset-0 flex items-center justify-center pointer-events-none scale-125">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 animate-boss-axe">
                          <path d="M 15 15 Q 60 50 85 85 Q 50 70 20 50 Z" fill={imp.color} opacity="0.85" filter="drop-shadow(0 0 10px #eab308)" />
                          <path d="M 20 20 Q 60 50 80 80" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={imp.id}
                      className="absolute w-14 h-14 rounded-full border-2 border-white bg-white/30 shadow-[0_0_16px_#ffffff] animate-impact-burst pointer-events-none"
                    />
                  );
                })}
              </div>

              <div
                className={`relative transition-transform duration-150 ${
                  heroAction === 'melee-slash'
                    ? 'animate-hero-melee-strike'
                    : heroAction === 'walking'
                    ? 'animate-walk-hero'
                    : heroAction === 'ranged-aim'
                    ? 'animate-hero-shoot'
                    : heroAction === 'hit'
                    ? 'animate-hit-recoil-hero'
                    : heroAction === 'dodge'
                    ? 'animate-dodge-evade'
                    : 'animate-idle-float'
                }`}
              >
                <HeroSprite
                  className="w-20 h-20 sm:w-24 sm:h-24"
                  isAttacking={heroAction === 'melee-slash' || heroAction === 'ranged-aim'}
                  isRanged={heroRangedStance}
                  isWalking={heroAction === 'walking'}
                  isHit={heroHit}
                  isDodging={heroDodging}
                  civilization={state.equipped.armor.civilization || state.equipped.weapon.civilization}
                  equipped={state.equipped}
                  equippedWeapon={state.equipped.weapon}
                  equippedArmor={state.equipped.armor}
                  equippedHelmet={state.equipped.helmet}
                  equippedGloves={state.equipped.gloves}
                  equippedBoots={state.equipped.boots}
                />
              </div>
            </div>

            <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/15 mt-2 shadow-md flex items-center gap-1.5 justify-center flex-wrap max-w-[150px]">
              <span className="text-xs font-bold text-zinc-100 truncate block max-w-[75px]">
                {state.equipped.weapon.name || 'Hero'}
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full border bg-cyan-950/90 text-cyan-300 border-cyan-500/50 flex items-center gap-0.5">
                <Gauge className="w-2.5 h-2.5" />
                <span>{playerStats.atkSpeed}/s</span>
              </span>
            </div>
          </div>

          {/* ENEMY FORCES (Right Half) */}
          <div className="flex flex-col items-center justify-center relative">
            {/* Main Stage Enemy Group HP Bar */}
            <div className="w-full max-w-[200px] sm:max-w-[260px] mb-2 bg-black/85 backdrop-blur-md p-1.5 rounded-lg border border-white/15 shadow-lg">
              <div className="flex justify-between text-[10px] font-bold text-zinc-300 mb-0.5 items-center">
                <span className={`truncate max-w-[130px] ${displayBoss.isBoss ? 'text-rose-400 font-black' : 'text-amber-300'}`}>
                  {displayBoss.isBoss ? `👑 ${displayBoss.bossName}` : `👾 ${displayBoss.bossName}`}
                </span>
                <span>{totalCurrentEnemyHp} / {totalMaxEnemyHp} HP</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-rose-950">
                <div
                  className={`h-full transition-all duration-150 shadow-[0_0_8px_rgba(244,63,94,0.8)] ${
                    displayBoss.isBoss ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${bossHpPct}%` }}
                />
              </div>
              {!displayBoss.isBoss && (
                <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 mt-0.5 px-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-400">Squad Living:</span>
                  <span className="text-amber-300 font-bold">{aliveMinionsCount} / {displayBoss.minionCount} Minions</span>
                </div>
              )}
            </div>

            {/* ENEMY SQUAD FORMATION - VERTICAL STACK */}
            <div className="relative w-full flex items-center justify-center min-h-[160px]">
              {/* Status Effect Fire / Poison Overlays */}
              {hasBurnStatus && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 z-20 pointer-events-none">
                  <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                  <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                </div>
              )}
              {hasPoisonStatus && (
                <div className="absolute -bottom-1 right-0 z-20 pointer-events-none">
                  <Skull className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
              )}

              {/* STAGE 10 BOSS ONLY */}
              {displayBoss.isBoss && (
                <div
                  className="flex flex-col items-center relative transition-transform duration-200 ease-out"
                  style={{
                    transform: bossOffset > 0 ? `translateX(-${bossOffset}px)` : undefined,
                    zIndex: bossAction === 'melee-slash' || bossWalking ? 30 : 10,
                  }}
                >
                  {/* Floating Damage on Boss */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-40 flex flex-col items-center">
                    {floatingDmgs.filter((d) => d.target === 'boss').map((dmg) => (
                      <div
                        key={dmg.id}
                        className={`animate-float-dmg font-black text-xs sm:text-sm whitespace-nowrap drop-shadow-md ${
                          dmg.isCrit
                            ? 'text-yellow-300 text-base drop-shadow-[0_0_10px_rgba(234,179,8,1)] scale-110'
                            : dmg.isBurn
                            ? 'text-orange-400'
                            : dmg.isPoison
                            ? 'text-emerald-400'
                            : 'text-amber-300'
                        }`}
                      >
                        {dmg.text} {dmg.isCrit ? '💥 CRIT!' : ''} {dmg.isRange ? '🎯 SNIPER!' : ''}
                      </div>
                    ))}
                  </div>

                  {/* Hero Slash / Impact Burst on Boss */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-35 overflow-visible">
                    {activeImpactFXs.filter((imp) => imp.target === 'boss').map((imp) => {
                      if (imp.type === 'hero-slash') {
                        return (
                          <div key={imp.id} className="absolute inset-0 flex items-center justify-center pointer-events-none scale-125">
                            <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 animate-slash-arc">
                              <defs>
                                <linearGradient id={`heroSlashBoss-${imp.id}`} x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#ffffff" />
                                  <stop offset="40%" stopColor={imp.color} />
                                  <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                              </defs>
                              <path d="M 10 90 Q 50 50 85 10 Q 75 40 45 65 Z" fill={`url(#heroSlashBoss-${imp.id})`} filter="drop-shadow(0 0 8px #f59e0b)" />
                              <path d="M 15 85 Q 50 45 88 12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
                            </svg>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={imp.id}
                          className={`absolute w-16 h-16 rounded-full border-2 animate-impact-burst pointer-events-none ${
                            imp.isCrit
                              ? 'border-yellow-300 bg-amber-400/40 shadow-[0_0_25px_#fbbf24]'
                              : 'border-white bg-white/30 shadow-[0_0_16px_#ffffff]'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div
                    className={`relative z-10 transition-transform duration-150 ${
                      bossAction === 'melee-slash'
                        ? 'animate-boss-melee-strike'
                        : bossWalking || bossAction === 'walking'
                        ? 'animate-walk-boss'
                        : bossAction === 'ranged-cast'
                        ? 'animate-boss-cast'
                        : bossHit
                        ? 'animate-hit-recoil-boss'
                        : 'animate-idle-float'
                    }`}
                  >
                    <EnemySprite
                      era={displayBoss.era}
                      className="w-22 h-22 sm:w-26 sm:h-26"
                      isAttacking={bossAction === 'melee-slash' || bossAction === 'ranged-cast'}
                      isWalking={bossWalking || bossAction === 'walking'}
                      isHit={bossHit}
                      isMinion={false}
                    />
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/50 mt-1 flex items-center gap-1">
                    <Gauge className="w-2.5 h-2.5" />
                    <span>{displayBoss.bossAtkSpeed}/s ATK SPD</span>
                  </span>
                </div>
              )}

              {/* STAGES 1-9: MINIONS LINED UP VERTICALLY */}
              {!displayBoss.isBoss && (
                <div
                  className={
                    displayBoss.minionCount >= 4
                      ? 'grid grid-cols-2 gap-x-3 gap-y-1.5 items-center justify-center'
                      : 'flex flex-col items-center justify-center gap-1.5 sm:gap-2'
                  }
                >
                  {displayBoss.minions.map((minion, idx) => {
                    const curHp = minionsHp[idx] ?? minion.maxHp;
                    const isAlive = curHp > 0;
                    const isTargeted = targetMinionIndex === idx && isAlive;
                    const isAttacking = minionAttacking[idx] || false;
                    const isWalking = minionWalking[idx] || false;
                    const offset = minionOffsets[idx] || 0;
                    const isUnitHit = minionHit[idx] || false;
                    const hpPercent = Math.max(0, Math.min(100, Math.floor((curHp / minion.maxHp) * 100)));

                    const spriteSizeClass =
                      displayBoss.minionCount === 1
                        ? 'w-18 h-18 sm:w-22 sm:h-22'
                        : displayBoss.minionCount === 2
                        ? 'w-14 h-14 sm:w-16 sm:h-16'
                        : displayBoss.minionCount === 3
                        ? 'w-12 h-12 sm:w-14 sm:h-14'
                        : 'w-11 h-11 sm:w-13 sm:h-13';

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 relative transition-all duration-200 ease-out ${
                          isAlive ? 'opacity-100 scale-100' : 'opacity-25 grayscale scale-80 pointer-events-none'
                        } ${isTargeted || isAttacking || isWalking ? 'z-20' : 'z-10'}`}
                        style={{
                          transform: offset > 0 ? `translateX(-${offset}px)` : undefined,
                        }}
                      >
                        {/* Floating Damage Popups Directly Over This Minion */}
                        <div className="absolute -top-3 left-4 -translate-x-1/2 pointer-events-none z-40 flex flex-col items-center">
                          {floatingDmgs.filter((d) => d.target === 'boss' && d.minionIndex === idx).map((dmg) => (
                            <div
                              key={dmg.id}
                              className={`animate-float-dmg font-black text-[11px] sm:text-xs whitespace-nowrap drop-shadow-md ${
                                dmg.isCrit
                                  ? 'text-yellow-300 font-black text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(234,179,8,1)] scale-110'
                                  : dmg.isBurn
                                  ? 'text-orange-400'
                                  : dmg.isPoison
                                  ? 'text-emerald-400'
                                  : 'text-amber-300'
                              }`}
                            >
                              {dmg.text} {dmg.isCrit ? '💥 CRIT!' : ''} {dmg.isRange ? '🎯' : ''}
                            </div>
                          ))}
                        </div>

                        {/* Minion Sprite Container with centered hit/slash FX */}
                        <div className="relative">
                          {/* Hit / Slash / Impact FX centered on minion */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-35 overflow-visible">
                            {activeImpactFXs.filter((imp) => imp.target === 'boss' && imp.minionIndex === idx).map((imp) => {
                              if (imp.type === 'hero-slash') {
                                return (
                                  <div key={imp.id} className="absolute inset-0 flex items-center justify-center pointer-events-none scale-110">
                                    <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 animate-slash-arc">
                                      <defs>
                                        <linearGradient id={`heroSlashMinion-${imp.id}`} x1="0" y1="0" x2="1" y2="1">
                                          <stop offset="0%" stopColor="#ffffff" />
                                          <stop offset="40%" stopColor={imp.color} />
                                          <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                      </defs>
                                      <path d="M 10 90 Q 50 50 85 10 Q 75 40 45 65 Z" fill={`url(#heroSlashMinion-${imp.id})`} filter="drop-shadow(0 0 8px #f59e0b)" />
                                      <path d="M 15 85 Q 50 45 88 12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    </svg>
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={imp.id}
                                  className={`absolute w-12 h-12 rounded-full border-2 animate-impact-burst pointer-events-none ${
                                    imp.isCrit
                                      ? 'border-yellow-300 bg-amber-400/40 shadow-[0_0_20px_#fbbf24]'
                                      : 'border-white bg-white/30 shadow-[0_0_14px_#ffffff]'
                                  }`}
                                />
                              );
                            })}
                          </div>

                          <div
                            className={`relative transition-transform duration-150 ${
                              isAttacking
                                ? 'animate-boss-melee-strike'
                                : isWalking
                                ? 'animate-walk-boss'
                                : isUnitHit
                                ? 'animate-hit-recoil-boss'
                                : isTargeted
                                ? 'scale-105'
                                : 'animate-idle-float'
                            }`}
                          >
                            <EnemySprite
                              era={displayBoss.era}
                              className={spriteSizeClass}
                              isAttacking={isAttacking}
                              isWalking={isWalking}
                              isHit={isUnitHit}
                              isMinion={true}
                              minionIndex={idx}
                            />
                          </div>
                        </div>

                        {/* Individual Minion Health Bar & Info Tag */}
                        <div className="flex flex-col items-start min-w-[65px] sm:min-w-[80px]">
                          {isTargeted && (
                            <span className="text-[7px] font-black uppercase px-1 py-0.2 rounded bg-amber-500 text-zinc-950 flex items-center gap-0.5 shadow-[0_0_6px_#f59e0b] animate-bounce mb-0.5">
                              <Crosshair className="w-2 h-2" />
                              <span>TARGET</span>
                            </span>
                          )}
                          <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-700 shadow-sm">
                            <div
                              className={`h-full transition-all duration-150 ${
                                hpPercent > 50
                                  ? 'bg-emerald-500'
                                  : hpPercent > 20
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${hpPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between w-full text-[7px] font-bold text-zinc-300 mt-0.5">
                            <span className="truncate max-w-[45px] text-amber-200">{minion.name}</span>
                            <span className="text-zinc-400">{curHp}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KEY DROP TOAST NOTIFICATION */}
      {keyDropToast && (
        <div className="p-3.5 rounded-2xl border mb-4 bg-gradient-to-r from-sky-950/95 via-indigo-950/95 to-purple-950/95 border-sky-400 text-sky-200 shadow-[0_0_35px_rgba(56,189,248,0.5)] flex items-center justify-between gap-3 text-xs sm:text-sm font-black animate-bounce">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/25 text-sky-300 border border-sky-400/60 shadow-sm">
              <Key className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <span className="text-white text-xs sm:text-sm font-black block">
                🗝️ ANCIENT KEYSTONE DISCOVERED!
              </span>
              <span className="text-[11px] text-sky-300/90 font-medium">
                Use your key to unlock the Ancient Vault Dungeon and harvest Tech Cores.
              </span>
            </div>
          </div>
          {onOpenDungeon && (
            <button
              onClick={() => {
                setKeyDropToast(false);
                onOpenDungeon();
              }}
              className="px-3 py-1.5 bg-sky-400 hover:bg-sky-300 text-zinc-950 font-black rounded-xl text-xs transition cursor-pointer shrink-0 shadow-md"
            >
              Open Vault
            </button>
          )}
        </div>
      )}

      {/* BATTLE OUTCOME ANNOUNCEMENT & CONTROLS */}
      {battleOutcome && (
        <div
          className={`p-3 rounded-xl border mb-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-black transition-all ${
            battleOutcome.win
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{battleOutcome.win ? '🎉' : '💀'}</span>
            <span>{battleOutcome.log}</span>
          </div>
          <button
            onClick={() => setBattleOutcome(null)}
            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ACTION FIGHT BUTTON & PORTAL SHORTCUTS */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => runBattleSequence()}
          disabled={isFighting}
          className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 shadow-lg shadow-orange-500/25 active:scale-98 transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4" />
          <span>
            {isFighting
              ? '⚡ Real-Time Combat in Progress...'
              : displayBoss.isBoss
              ? `Challenge Boss: ${displayBoss.bossName}`
              : `Fight ${displayBoss.minionCount} Minions (Floor ${isFighting ? battleFloor : state.currentFloor})`}
          </span>
        </button>

        {onOpenDungeon && (
          <button
            onClick={onOpenDungeon}
            className="py-3 px-3.5 rounded-xl bg-gradient-to-r from-sky-950/90 to-indigo-950/90 hover:from-sky-900 hover:to-indigo-900 border border-sky-500/50 text-sky-300 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-98"
            title="Open Ancient Vault Dungeon"
          >
            <Key className="w-4 h-4 text-sky-400" />
            <span className="whitespace-nowrap">Vault ({state.dungeonKeys} 🗝️)</span>
          </button>
        )}

        {onOpenTechTree && (
          <button
            onClick={onOpenTechTree}
            className="py-3 px-3.5 rounded-xl bg-gradient-to-r from-purple-950/90 to-fuchsia-950/90 hover:from-purple-900 hover:to-fuchsia-900 border border-purple-500/50 text-purple-300 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-98"
            title="Open Chrono Tech Matrix"
          >
            <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="whitespace-nowrap">Tech ({state.techCores} ⚛️)</span>
          </button>
        )}
      </div>
    </div>
  );
};
