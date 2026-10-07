import React, { useState, useEffect, useRef } from 'react';
import type { GameState } from '../hooks/useAutoForge';
import { calculatePlayerCombatStats, calculateHeroPower } from '../hooks/useAutoForge';
import type { DungeonWaveInfo, DungeonClearReward, DungeonWaveResult } from '../types/dungeon';
import { getDungeonTierConfig, getDungeonRiskLevel, DUNGEON_TIERS } from '../types/dungeon';
import { computeTechBonuses } from '../types/techTree';
import { DungeonEnemySprite } from './DungeonSprites';
import { DungeonEnvironment } from './DungeonEnvironment';
import { HeroSprite } from './CharacterSprites';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Key,
  Cpu,
  X,
  Sparkles,
  Skull,
  Award,
  RotateCcw,
  Gem,
  Coins,
  Shield,
  Swords,
  Heart,
  Zap,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Lock,
} from 'lucide-react';

interface DungeonModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onStartExpedition: (tier?: number) => { canEnter: boolean; waves: DungeonWaveInfo[]; tier?: number } | null;
  onFightWave: (waveInfo: DungeonWaveInfo, startHeroHp?: number) => DungeonWaveResult;
  onClaimRewards: (rewards: DungeonClearReward) => void;
  onOpenTechTree?: () => void;
}

interface FloatingDmg {
  id: number;
  target: 'hero' | 'enemy';
  enemyIndex?: number;
  text: string;
  isCrit?: boolean;
  isDodge?: boolean;
  isBurn?: boolean;
  isPoison?: boolean;
  isHeal?: boolean;
  isRange?: boolean;
}

export const DungeonModal: React.FC<DungeonModalProps> = ({
  isOpen,
  onClose,
  state,
  onStartExpedition,
  onFightWave,
  onClaimRewards,
  onOpenTechTree,
}) => {
  // Selected Dungeon Level / Vault Tier
  const maxUnlockedTier = Math.max(1, Math.min(10, state.era));
  const [selectedTier, setSelectedTier] = useState<number>(() => maxUnlockedTier);
  const [activeExpeditionTier, setActiveExpeditionTier] = useState<number>(maxUnlockedTier);

  // Sync selectedTier if maxUnlockedTier increases and player was at max
  useEffect(() => {
    setSelectedTier((prev) => {
      if (prev > maxUnlockedTier) return maxUnlockedTier;
      return prev;
    });
  }, [maxUnlockedTier]);

  // Reset selectedTier when opening the modal
  useEffect(() => {
    if (isOpen) {
      setSelectedTier((prev) => Math.min(maxUnlockedTier, Math.max(1, prev || maxUnlockedTier)));
    }
  }, [isOpen, maxUnlockedTier]);

  // Expedition state
  const [expeditionActive, setExpeditionActive] = useState(false);
  const [waves, setWaves] = useState<DungeonWaveInfo[]>([]);
  const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
  const [isFightingWave, setIsFightingWave] = useState(false);
  const [battleSpeed, setBattleSpeed] = useState<1 | 2 | 3>(1);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Live combat animation states
  const [heroHp, setHeroHp] = useState(100);
  const [heroAction, setHeroAction] = useState<'idle' | 'walking' | 'melee-slash' | 'hit' | 'dodge'>('idle');
  const [heroOffset, setHeroOffset] = useState(0);
  const [heroHit, setHeroHit] = useState(false);
  const [heroDodging, setHeroDodging] = useState(false);

  const [enemiesHp, setEnemiesHp] = useState<number[]>([]);
  const [targetEnemyIndex, setTargetEnemyIndex] = useState(0);
  const [enemyAttacking, setEnemyAttacking] = useState<Record<number, boolean>>({});
  const [enemyOffsets, setEnemyOffsets] = useState<Record<number, number>>({});
  const [enemyHit, setEnemyHit] = useState<Record<number, boolean>>({});

  const [floatingDmgs, setFloatingDmgs] = useState<FloatingDmg[]>([]);
  const [screenCritRumble, setScreenCritRumble] = useState(false);

  // Expedition results
  const [expeditionVictory, setExpeditionVictory] = useState<DungeonClearReward | null>(null);
  const [expeditionDefeat, setExpeditionDefeat] = useState(false);

  const techBonuses = computeTechBonuses(state.techTree);
  const playerStats = calculatePlayerCombatStats(
    state.equipped,
    state.blessings || [],
    state.techTree,
    techBonuses.dungeonBonusAtkPct
  );
  const playerMaxHp = playerStats.maxHp;
  const heroPower = calculateHeroPower(playerStats);

  // Active or selected tier configurations
  const currentTierConfig = getDungeonTierConfig(expeditionActive ? activeExpeditionTier : selectedTier);
  const riskInfo = getDungeonRiskLevel(heroPower, currentTierConfig.recommendedPower, expeditionActive ? activeExpeditionTier : selectedTier);

  const currentWave = waves[currentWaveIndex];

  // Calculate estimated rewards based on the chosen tier configuration
  const estimatedTechCores = Math.floor(currentTierConfig.baseTechCores * (1 + techBonuses.techCoreBonusPct / 100));
  const estimatedGems = currentTierConfig.baseGems + techBonuses.dungeonExtraGems;
  const estimatedGold = currentTierConfig.baseGold;
  const estimatedScrap = currentTierConfig.baseScrap;

  const battleSpeedRef = useRef(battleSpeed);
  battleSpeedRef.current = battleSpeed;
  const autoAdvanceRef = useRef(autoAdvance);
  autoAdvanceRef.current = autoAdvance;

  // Cleanup on modal close
  useEffect(() => {
    if (!isOpen) {
      setExpeditionActive(false);
      setIsFightingWave(false);
      setExpeditionVictory(null);
      setExpeditionDefeat(false);
      setFloatingDmgs([]);
    }
  }, [isOpen]);

  const addFloatingDamage = (
    text: string,
    target: 'hero' | 'enemy',
    opts?: {
      enemyIndex?: number;
      isCrit?: boolean;
      isDodge?: boolean;
      isBurn?: boolean;
      isPoison?: boolean;
      isHeal?: boolean;
      isRange?: boolean;
    }
  ) => {
    const id = Date.now() + Math.random();
    setFloatingDmgs((prev) => [...prev.slice(-10), { id, text, target, ...opts }]);
    setTimeout(() => {
      setFloatingDmgs((prev) => prev.filter((f) => f.id !== id));
    }, 1100);
  };

  const handleStartExpedition = () => {
    soundFx.playDungeonEnter();
    const tierToStart = selectedTier;
    const result = onStartExpedition(tierToStart);
    if (!result || !result.canEnter) return;

    setActiveExpeditionTier(tierToStart);
    setWaves(result.waves);
    setCurrentWaveIndex(0);
    setHeroHp(playerMaxHp);
    setExpeditionActive(true);
    setExpeditionVictory(null);
    setExpeditionDefeat(false);

    // Initialize first wave
    const firstWave = result.waves[0];
    setEnemiesHp(firstWave.enemies.map((e) => e.maxHp));
    setTargetEnemyIndex(0);

    // Auto-start wave 1 combat
    setTimeout(() => {
      runWaveCombat(firstWave, 0, playerMaxHp, result.waves);
    }, 400);
  };

  const runWaveCombat = async (
    waveInfo: DungeonWaveInfo,
    waveIdx: number,
    startHp: number,
    allWaves: DungeonWaveInfo[]
  ) => {
    if (isFightingWave) return;
    setIsFightingWave(true);

    const waveResult = onFightWave(waveInfo, startHp);
    const events = waveResult.events || [];

    // Reset positions
    setHeroOffset(0);
    setHeroAction('idle');
    setHeroHit(false);
    setHeroDodging(false);
    setEnemyAttacking({});
    setEnemyOffsets({});
    setEnemyHit({});
    setEnemiesHp(waveInfo.enemies.map((e) => e.maxHp));
    setTargetEnemyIndex(0);

    let curHeroHp = startHp;
    const curEnemiesHp = waveInfo.enemies.map((e) => e.maxHp);

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const prevTimestamp = i > 0 ? events[i - 1].timestamp : 0;
      const speed = battleSpeedRef.current;
      const rawDelay = Math.max(12, Math.min(220, (event.timestamp - prevTimestamp) / speed));

      await new Promise((res) => setTimeout(res, rawDelay));

      if (event.type === 'player-attack') {
        // Hero attack animation
        setHeroAction('melee-slash');
        setHeroOffset(20);
        soundFx.playSlash();

        const targetIdx = event.targetMinionIndex ?? 0;
        setTargetEnemyIndex(targetIdx);

        // Flash target enemy hit
        setEnemyHit((prev) => ({ ...prev, [targetIdx]: true }));
        setTimeout(() => setEnemyHit((prev) => ({ ...prev, [targetIdx]: false })), 140 / speed);

        if (event.isCrit) {
          soundFx.playCrit();
          setScreenCritRumble(true);
          setTimeout(() => setScreenCritRumble(false), 200);
        }

        // Apply enemy damage
        curEnemiesHp[targetIdx] = Math.max(0, curEnemiesHp[targetIdx] - event.dmg);
        setEnemiesHp([...curEnemiesHp]);

        addFloatingDamage(
          event.isCrit ? `CRIT -${event.dmg}` : `-${event.dmg}`,
          'enemy',
          { enemyIndex: targetIdx, isCrit: event.isCrit, isRange: event.isRange }
        );

        if (event.healedAmount && event.healedAmount > 0) {
          curHeroHp = Math.min(playerMaxHp, curHeroHp + event.healedAmount);
          setHeroHp(curHeroHp);
          addFloatingDamage(`+${event.healedAmount}`, 'hero', { isHeal: true });
        }

        setTimeout(() => {
          setHeroAction('idle');
          setHeroOffset(0);
        }, 120 / speed);

      } else if (event.type === 'minion-attack') {
        const attackerIdx = (typeof event.actorId === 'number' ? event.actorId : 0);
        setEnemyAttacking((prev) => ({ ...prev, [attackerIdx]: true }));
        setEnemyOffsets((prev) => ({ ...prev, [attackerIdx]: -20 }));

        if (event.isDodge) {
          soundFx.playDodge();
          setHeroDodging(true);
          addFloatingDamage('DODGE!', 'hero', { isDodge: true });
          setTimeout(() => setHeroDodging(false), 180 / speed);
        } else {
          soundFx.playHit();
          setHeroHit(true);
          curHeroHp = Math.max(0, curHeroHp - event.dmg);
          setHeroHp(curHeroHp);
          addFloatingDamage(`-${event.dmg}`, 'hero');
          setTimeout(() => setHeroHit(false), 140 / speed);
        }

        setTimeout(() => {
          setEnemyAttacking((prev) => ({ ...prev, [attackerIdx]: false }));
          setEnemyOffsets((prev) => ({ ...prev, [attackerIdx]: 0 }));
        }, 120 / speed);

      } else if (event.type === 'dot-tick') {
        const targetIdx = event.targetMinionIndex ?? 0;
        if (event.burnDmg && event.burnDmg > 0) {
          soundFx.playBurn();
          curEnemiesHp[targetIdx] = Math.max(0, curEnemiesHp[targetIdx] - event.burnDmg);
          addFloatingDamage(`🔥 -${event.burnDmg}`, 'enemy', { enemyIndex: targetIdx, isBurn: true });
        }
        if (event.poisonDmg && event.poisonDmg > 0) {
          soundFx.playPoison();
          curEnemiesHp[targetIdx] = Math.max(0, curEnemiesHp[targetIdx] - event.poisonDmg);
          addFloatingDamage(`☠️ -${event.poisonDmg}`, 'enemy', { enemyIndex: targetIdx, isPoison: true });
        }
        setEnemiesHp([...curEnemiesHp]);
      }
    }

    setIsFightingWave(false);

    if (waveResult.win) {
      if (waveIdx + 1 < allWaves.length) {
        // Advance to next wave
        soundFx.playVictory(false);
        const nextIdx = waveIdx + 1;
        setCurrentWaveIndex(nextIdx);
        const nextWave = allWaves[nextIdx];
        setEnemiesHp(nextWave.enemies.map((e) => e.maxHp));
        setTargetEnemyIndex(0);

        if (autoAdvanceRef.current) {
          setTimeout(() => {
            runWaveCombat(nextWave, nextIdx, curHeroHp, allWaves);
          }, 800);
        }
      } else {
        // CONQUERED THE FINAL DUNGEON BOSS!
        soundFx.playDungeonVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#ec4899', '#a855f7', '#fbbf24'],
        });

        const finalRewards: DungeonClearReward = {
          techCores: estimatedTechCores,
          gems: estimatedGems,
          gold: estimatedGold,
          scrap: estimatedScrap,
        };

        onClaimRewards(finalRewards);
        setExpeditionVictory(finalRewards);
      }
    } else {
      // Hero defeated
      soundFx.playDefeat();
      setExpeditionDefeat(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-3xl bg-zinc-950 border border-purple-500/40 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col max-h-[92vh] overflow-hidden ${
          screenCritRumble ? 'animate-[shake_0.2s_ease-in-out]' : ''
        }`}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-purple-950/80 via-zinc-900 to-indigo-950/80 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 tracking-tight">
                  THE ANCIENT VAULT
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase border border-purple-500/40">
                  Rift Dungeon
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Conquer the Chrono Sovereign to earn Tech Cores</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Keys Badge */}
            <div className="flex items-center gap-1.5 bg-sky-950/80 border border-sky-500/50 px-2.5 py-1 rounded-xl shadow-sm">
              <Key className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-xs font-black text-sky-300">{state.dungeonKeys}</span>
              <span className="text-[10px] text-sky-400/80 font-bold hidden sm:inline">Keys</span>
            </div>

            {/* Tech Cores Badge */}
            <div className="flex items-center gap-1.5 bg-purple-950/80 border border-purple-500/50 px-2.5 py-1 rounded-xl shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-black text-purple-300">{state.techCores}</span>
              <span className="text-[10px] text-purple-400/80 font-bold hidden sm:inline">Cores</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* CASE 1: PRE-EXPEDITION BRIEFING SCREEN */}
          {!expeditionActive && (
            <div className="space-y-4">
              {/* DUNGEON LEVEL / TIER SELECTOR */}
              <div className="bg-zinc-900/90 border border-purple-500/30 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-400" />
                    SELECT DUNGEON LEVEL
                  </span>
                  <span className="text-[11px] font-bold text-zinc-400">
                    Unlocked: <strong className="text-zinc-200">Level 1 - {maxUnlockedTier}</strong> (Era {state.era})
                  </span>
                </div>

                {/* Stepper & Level Selector */}
                <div className="flex items-center justify-between gap-2 bg-zinc-950/90 p-2 sm:p-2.5 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => setSelectedTier((t) => Math.max(1, t - 1))}
                    disabled={selectedTier <= 1}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 transition cursor-pointer border border-zinc-800"
                    title="Previous Dungeon Level"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex-1 text-center px-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black border border-purple-500/40">
                        LEVEL {selectedTier}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-zinc-100 truncate">
                        {currentTierConfig.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      {currentTierConfig.description} (Era {currentTierConfig.eraName})
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedTier((t) => Math.min(maxUnlockedTier, t + 1))}
                    disabled={selectedTier >= maxUnlockedTier}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 transition cursor-pointer border border-zinc-800"
                    title={selectedTier >= maxUnlockedTier ? 'Advance to higher Eras in the Tower Arena to unlock higher Dungeon Levels' : 'Next Dungeon Level'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Level Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                  {DUNGEON_TIERS.map((tier) => {
                    const isUnlocked = tier.tier <= maxUnlockedTier;
                    const isSelected = tier.tier === selectedTier;
                    const tierRisk = getDungeonRiskLevel(heroPower, tier.recommendedPower, tier.tier);

                    return (
                      <button
                        key={tier.tier}
                        onClick={() => isUnlocked && setSelectedTier(tier.tier)}
                        disabled={!isUnlocked}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap flex items-center gap-1 border ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)] scale-105'
                            : isUnlocked
                            ? 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800 border-zinc-800'
                            : 'bg-zinc-950/40 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {!isUnlocked && <Lock className="w-2.5 h-2.5 text-zinc-600" />}
                        <span>Lvl {tier.tier}</span>
                        {isUnlocked && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              tierRisk.level === 'safe'
                                ? 'bg-emerald-400'
                                : tierRisk.level === 'moderate'
                                ? 'bg-amber-400'
                                : tierRisk.level === 'high_risk'
                                ? 'bg-orange-500'
                                : 'bg-rose-500'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* POWER LEVEL VS DUNGEON LEVEL COMPARISON CARD */}
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-purple-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black text-zinc-200 uppercase tracking-wider">
                      POWER LEVEL MATCHUP ANALYSIS
                    </span>
                  </div>
                  <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border flex items-center gap-1 ${riskInfo.badgeBg} ${riskInfo.badgeText} ${riskInfo.badgeBorder}`}>
                    {riskInfo.level === 'safe' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    {riskInfo.level === 'moderate' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {riskInfo.level === 'high_risk' && <AlertOctagon className="w-3.5 h-3.5 text-orange-400" />}
                    {riskInfo.level === 'deadly' && <Skull className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{riskInfo.label}</span>
                  </div>
                </div>

                {/* Dual Power Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center relative">
                  {/* Left: Player Hero Power */}
                  <div className="bg-zinc-900/90 border border-amber-500/40 rounded-xl p-3.5 space-y-2 relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.08)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        YOUR HERO POWER
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold">Era {state.era} Knight</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                        {heroPower.toLocaleString()}
                      </p>
                      <span className="text-xs font-black text-amber-400/80">PWR</span>
                    </div>

                    {/* Stat Breakdown Pills */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-bold">
                      <div className="bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500 flex items-center gap-1"><Heart className="w-2.5 h-2.5 text-emerald-400" /> HP</span>
                        <span>{playerStats.maxHp.toLocaleString()}</span>
                      </div>
                      <div className="bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500 flex items-center gap-1"><Swords className="w-2.5 h-2.5 text-red-400" /> ATK</span>
                        <span>{playerStats.attack.toLocaleString()}</span>
                      </div>
                      <div className="bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500 flex items-center gap-1"><Shield className="w-2.5 h-2.5 text-sky-400" /> DEF</span>
                        <span>{playerStats.defense.toLocaleString()}</span>
                      </div>
                      <div className="bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500 flex items-center gap-1"><Zap className="w-2.5 h-2.5 text-yellow-400" /> SPD</span>
                        <span>{playerStats.atkSpeed}/s</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Dungeon Level & Recommended Power */}
                  <div className="bg-zinc-900/90 border border-purple-500/40 rounded-xl p-3.5 space-y-2 relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.08)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider flex items-center gap-1">
                        <Skull className="w-3 h-3 text-purple-400" />
                        DUNGEON LEVEL {selectedTier} REC
                      </span>
                      <span className="text-[10px] text-purple-300/80 font-bold">{currentTierConfig.eraName} Vault</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">
                        {currentTierConfig.recommendedPower.toLocaleString()}
                      </p>
                      <span className="text-xs font-black text-purple-400/80">PWR REC</span>
                    </div>

                    {/* Dungeon Highlights */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-bold">
                      <div className="bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Waves</span>
                        <span className="text-cyan-300">5 Encounters</span>
                      </div>
                      <div className="bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Boss</span>
                        <span className="text-pink-400">Titan Boss</span>
                      </div>
                      <div className="bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Key Cost</span>
                        <span className="text-sky-300">1 Keystone</span>
                      </div>
                      <div className="bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Loss Risk</span>
                        <span className={riskInfo.level === 'safe' ? 'text-emerald-400' : riskInfo.level === 'moderate' ? 'text-amber-400' : 'text-rose-400'}>
                          {riskInfo.lossRiskText.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* POWER RATIO PROGRESS GAUGE */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-zinc-400">Power Rating Match:</span>
                    <span className={`font-black ${riskInfo.badgeText}`}>
                      {riskInfo.ratioPercent}% of Recommended Power ({riskInfo.tag})
                    </span>
                  </div>
                  <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 relative">
                    {/* 100% Recommended Threshold Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-20"
                      style={{ left: '66.6%' }}
                      title="100% Recommended Threshold"
                    />
                    <div
                      className={`h-full bg-gradient-to-r ${riskInfo.barColor} transition-all duration-300`}
                      style={{ width: `${Math.min(100, (riskInfo.ratio / 1.5) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 font-bold px-0.5">
                    <span>0% (Lethal)</span>
                    <span className="text-zinc-300">100% Recommended</span>
                    <span>150%+ (Overpowered)</span>
                  </div>
                </div>

                {/* KEYSTONE RISK WARNING BOX */}
                <div
                  className={`rounded-xl p-3 sm:p-3.5 border flex items-start gap-3 transition-all ${
                    riskInfo.isHighRisk
                      ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                      : riskInfo.level === 'moderate'
                      ? 'bg-amber-950/30 border-amber-500/40'
                      : 'bg-emerald-950/30 border-emerald-500/40'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 shrink-0 mt-0.5">
                    {riskInfo.isHighRisk ? (
                      <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
                    ) : riskInfo.level === 'moderate' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-black uppercase tracking-wide ${riskInfo.badgeText}`}>
                        {riskInfo.isHighRisk ? '⚠️ KEYSTONE LOSS WARNING' : 'KEYSTONE SECURITY STATUS'}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold">({riskInfo.lossRiskText})</span>
                    </div>

                    <p className="text-zinc-300 leading-relaxed">
                      {riskInfo.isHighRisk ? (
                        <>
                          Your Hero Power (<strong className="text-amber-300">{heroPower.toLocaleString()}</strong>) is below the recommended level (<strong className="text-purple-300">{currentTierConfig.recommendedPower.toLocaleString()}</strong>) for Dungeon Level {selectedTier}. <strong className="text-rose-400 font-black">Defeat in the Vault will PERMANENTLY consume your Ancient Keystone with zero rewards!</strong>
                        </>
                      ) : (
                        <>
                          Your Hero Power (<strong className="text-amber-300">{heroPower.toLocaleString()}</strong>) is well-equipped for Dungeon Level {selectedTier} (<strong className="text-purple-300">{currentTierConfig.recommendedPower.toLocaleString()}</strong> Rec). Clear all 5 waves to harvest Tech Cores and gems safely.
                        </>
                      )}
                    </p>

                    {riskInfo.isHighRisk && selectedTier > 1 && (
                      <p className="text-[11px] text-amber-400/90 font-semibold pt-0.5">
                        💡 Tip: You can switch to a lower Dungeon Level (e.g. Level {selectedTier - 1}) to safely farm Tech Cores without risking your keystones!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 5 Wave Previews for Selected Tier */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400 px-1">
                  <span>EXPEDITION ENCOUNTERS (DUNGEON LEVEL {selectedTier})</span>
                  <span className="text-purple-400 font-semibold">5 Sequential Waves</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-2.5 text-center space-y-1">
                    <span className="text-[10px] font-black text-sky-400 block">WAVE 1</span>
                    <p className="text-xs font-bold text-zinc-200">Drone Swarm</p>
                    <span className="text-[10px] text-zinc-400 block">3x Agile Units</span>
                  </div>

                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-2.5 text-center space-y-1">
                    <span className="text-[10px] font-black text-indigo-400 block">WAVE 2</span>
                    <p className="text-xs font-bold text-zinc-200">Void Sentinels</p>
                    <span className="text-[10px] text-zinc-400 block">2x Heavy Mechs</span>
                  </div>

                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-2.5 text-center space-y-1">
                    <span className="text-[10px] font-black text-rose-400 block">WAVE 3</span>
                    <p className="text-xs font-bold text-zinc-200">Glitch Pack</p>
                    <span className="text-[10px] text-zinc-400 block">3x Glitch Horrors</span>
                  </div>

                  <div className="bg-zinc-900/80 border border-purple-500/40 rounded-xl p-2.5 text-center space-y-1 bg-purple-950/20">
                    <span className="text-[10px] font-black text-purple-400 block">WAVE 4</span>
                    <p className="text-xs font-bold text-purple-200">Rift Behemoth</p>
                    <span className="text-[10px] text-purple-400/80 block">Mini-Boss</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-gradient-to-b from-pink-950/40 to-zinc-900 border border-pink-500/50 rounded-xl p-2.5 text-center space-y-1 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                    <span className="text-[10px] font-black text-pink-400 block animate-pulse">WAVE 5 BOSS</span>
                    <p className="text-xs font-black text-pink-200 truncate">Chrono Sovereign</p>
                    <span className="text-[10px] text-pink-300 font-bold block">Final Titan</span>
                  </div>
                </div>
              </div>

              {/* Estimated Victory Rewards Card */}
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    Dungeon Level {selectedTier} Victory Spoils
                  </span>
                  {techBonuses.techCoreBonusPct > 0 && (
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                      +{techBonuses.techCoreBonusPct}% Vault Siphon Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-2.5 text-center">
                    <Cpu className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs text-zinc-400 block">Tech Cores</span>
                    <p className="text-sm font-black text-purple-300">+{estimatedTechCores}</p>
                  </div>

                  <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-2.5 text-center">
                    <Gem className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                    <span className="text-xs text-zinc-400 block">Rubies</span>
                    <p className="text-sm font-black text-rose-300">+{estimatedGems}</p>
                  </div>

                  <div className="bg-yellow-950/40 border border-yellow-500/30 rounded-xl p-2.5 text-center">
                    <Coins className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <span className="text-xs text-zinc-400 block">Gold</span>
                    <p className="text-sm font-black text-yellow-300">+{estimatedGold.toLocaleString()}</p>
                  </div>

                  <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-2.5 text-center">
                    <Sparkles className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                    <span className="text-xs text-zinc-400 block">Scrap</span>
                    <p className="text-sm font-black text-teal-300">+{estimatedScrap.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {state.dungeonKeys >= 1 ? (
                  <button
                    onClick={handleStartExpedition}
                    className={`flex-1 py-3.5 px-6 font-black text-sm rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 ${
                      riskInfo.isHighRisk
                        ? 'bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)] border border-rose-400/50'
                        : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>ENTER VAULT • LEVEL {selectedTier} (Cost: 1 Keystone)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${riskInfo.badgeBg} ${riskInfo.badgeText} border ${riskInfo.badgeBorder}`}>
                      {riskInfo.tag}
                    </span>
                  </button>
                ) : (
                  <div className="flex-1 py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
                    <p className="text-xs font-bold text-zinc-400">
                      🗝️ No Ancient Keys available. Defeat enemies in the Tower Arena to find keys!
                    </p>
                  </div>
                )}

                {onOpenTechTree && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTechTree();
                    }}
                    className="py-3 px-5 bg-zinc-800/80 hover:bg-zinc-700 text-purple-300 font-bold text-xs rounded-2xl border border-purple-500/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Cpu className="w-4 h-4 text-purple-400" />
                    Open Tech Tree
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CASE 2: LIVE EXPEDITION ARENA */}
          {expeditionActive && currentWave && !expeditionVictory && !expeditionDefeat && (
            <div className="space-y-3">
              {/* Wave Header & Progress */}
              <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                    Lvl {activeExpeditionTier} • Wave {currentWaveIndex + 1}/5
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs font-extrabold text-zinc-200">
                    {currentWave.title}
                  </span>
                </div>

                {/* Combat Controls */}
                <div className="flex items-center gap-2">
                  {/* Speed Selector */}
                  <div className="flex items-center bg-zinc-950 rounded-xl p-0.5 border border-zinc-800 text-[11px] font-bold">
                    {([1, 2, 3] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setBattleSpeed(spd)}
                        className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                          battleSpeed === spd
                            ? 'bg-purple-600 text-white font-black'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Auto Advance Toggle */}
                  <button
                    onClick={() => setAutoAdvance(!autoAdvance)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                      autoAdvance
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    Auto-Next: {autoAdvance ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* BATTLE ARENA VIEWPORT */}
              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-purple-500/40 shadow-2xl">
                {/* Dimensional Rift Environment Backdrop */}
                <DungeonEnvironment
                  waveNumber={currentWaveIndex + 1}
                  isBossWave={currentWave.isBossWave}
                />

                {/* Floating Damage Text Overlay */}
                <div className="absolute inset-0 pointer-events-none z-30">
                  {floatingDmgs.map((f) => (
                    <div
                      key={f.id}
                      className={`absolute font-black text-sm sm:text-base animate-[floatDmg_1s_ease-out_forwards] ${
                        f.target === 'hero' ? 'left-1/4 top-1/2' : 'right-1/4 top-1/2'
                      } ${
                        f.isCrit
                          ? 'text-yellow-300 scale-125 drop-shadow-[0_0_8px_#f59e0b]'
                          : f.isDodge
                          ? 'text-sky-300'
                          : f.isHeal
                          ? 'text-emerald-400'
                          : f.isBurn
                          ? 'text-orange-400'
                          : f.isPoison
                          ? 'text-emerald-300'
                          : 'text-white'
                      }`}
                    >
                      {f.text}
                    </div>
                  ))}
                </div>

                {/* COMBATANTS STAGE */}
                <div className="absolute inset-0 flex items-end justify-between px-6 sm:px-12 pb-6 z-10">
                  {/* HERO (Left) */}
                  <div className="flex flex-col items-center gap-2">
                    {/* Hero HP Bar */}
                    <div className="w-24 sm:w-28 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-300">
                        <span>Hero ({heroPower.toLocaleString()} PWR)</span>
                        <span>{heroHp}/{playerMaxHp}</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-700">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-150"
                          style={{ width: `${Math.max(0, (heroHp / playerMaxHp) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Hero Sprite */}
                    <div
                      style={{ transform: `translateX(${heroOffset}px)` }}
                      className="transition-transform duration-100"
                    >
                      <HeroSprite
                        className="w-24 h-24 sm:w-28 sm:h-28"
                        isAttacking={heroAction === 'melee-slash'}
                        isHit={heroHit}
                        isDodging={heroDodging}
                        civilization={state.equipped.armor.civilization}
                        equipped={state.equipped}
                      />
                    </div>
                  </div>

                  {/* ENEMIES SQUAD (Right) */}
                  <div className="flex items-end gap-2 sm:gap-4">
                    {currentWave.enemies.map((enemy, idx) => {
                      const curHp = enemiesHp[idx] ?? enemy.maxHp;
                      const isSlain = curHp <= 0;
                      const isTarget = targetEnemyIndex === idx && !isSlain;

                      return (
                        <div
                          key={enemy.id}
                          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                            isSlain ? 'opacity-20 scale-75 grayscale' : ''
                          }`}
                        >
                          {/* Enemy HP Bar */}
                          <div className="w-16 sm:w-20 space-y-0.5">
                            <div className="flex justify-between text-[9px] font-bold text-zinc-400">
                              <span className="truncate max-w-[50px]">{enemy.name.split(' ')[0]}</span>
                              <span>{Math.max(0, curHp)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                              <div
                                className={`h-full transition-all duration-150 ${
                                  enemy.type === 'sovereign_boss'
                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                                    : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                                }`}
                                style={{ width: `${Math.max(0, (curHp / enemy.maxHp) * 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Target Indicator Ring */}
                          <div className={`relative ${isTarget ? 'ring-2 ring-purple-400 rounded-full p-0.5' : ''}`}>
                            <div
                              style={{ transform: `translateX(${enemyOffsets[idx] || 0}px)` }}
                              className="transition-transform duration-100"
                            >
                              <DungeonEnemySprite
                                enemy={enemy}
                                className={
                                  enemy.type === 'sovereign_boss'
                                    ? 'w-28 h-28 sm:w-32 sm:h-32'
                                    : enemy.type === 'behemoth'
                                    ? 'w-24 h-24 sm:w-28 sm:h-28'
                                    : 'w-18 h-18 sm:w-22 sm:h-22'
                                }
                                isAttacking={enemyAttacking[idx]}
                                isHit={enemyHit[idx]}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CASE 3: EXPEDITION VICTORY SCREEN */}
          {expeditionVictory && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 mx-auto flex items-center justify-center shadow-[0_0_35px_rgba(236,72,153,0.6)]">
                <Award className="w-8 h-8 text-white" />
              </div>

              <div>
                <span className="text-xs font-black text-pink-400 uppercase tracking-widest">
                  DUNGEON LEVEL {activeExpeditionTier} CONQUERED
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  THE CHRONO SOVEREIGN IS SLAIN!
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  You successfully shattered all 5 dimensional waves in <strong className="text-purple-300">{currentTierConfig.name}</strong> and harvested prime tech resources!
                </p>
              </div>

              {/* Rewards Claimed Summary */}
              <div className="bg-gradient-to-b from-purple-950/40 to-zinc-900 border border-purple-500/40 rounded-2xl p-4 max-w-md mx-auto space-y-3">
                <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider block">
                  Spoils of the Ancient Vault (Lvl {activeExpeditionTier})
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-zinc-950/80 border border-purple-500/30 rounded-xl p-3 flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-purple-400" />
                    <div className="text-left">
                      <span className="text-[10px] text-zinc-400 block font-bold">TECH CORES</span>
                      <p className="text-base font-black text-purple-300">+{expeditionVictory.techCores}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/80 border border-rose-500/30 rounded-xl p-3 flex items-center gap-3">
                    <Gem className="w-6 h-6 text-rose-400" />
                    <div className="text-left">
                      <span className="text-[10px] text-zinc-400 block font-bold">RUBIES</span>
                      <p className="text-base font-black text-rose-300">+{expeditionVictory.gems}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/80 border border-yellow-500/30 rounded-xl p-3 flex items-center gap-3">
                    <Coins className="w-6 h-6 text-yellow-400" />
                    <div className="text-left">
                      <span className="text-[10px] text-zinc-400 block font-bold">GOLD</span>
                      <p className="text-base font-black text-yellow-300">+{expeditionVictory.gold.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/80 border border-teal-500/30 rounded-xl p-3 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-teal-400" />
                    <div className="text-left">
                      <span className="text-[10px] text-zinc-400 block font-bold">SCRAP</span>
                      <p className="text-base font-black text-teal-300">+{expeditionVictory.scrap.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                {onOpenTechTree && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTechTree();
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Cpu className="w-4 h-4" />
                    UPGRADE TECH TREE
                  </button>
                )}

                {state.dungeonKeys >= 1 && (
                  <button
                    onClick={handleStartExpedition}
                    className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-4 h-4 text-sky-400" />
                    FIGHT AGAIN (1 🗝️)
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="py-3 px-5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-xs rounded-xl border border-zinc-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* CASE 4: EXPEDITION DEFEAT SCREEN */}
          {expeditionDefeat && (
            <div className="space-y-4 text-center py-6">
              <div className="w-16 h-16 rounded-3xl bg-rose-950/80 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                <Skull className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-black text-rose-400 uppercase tracking-widest">
                  HERO SLAIN • 1 KEYSTONE LOST
                </span>
                <h3 className="text-xl font-black text-white">EXPEDITION FAILED</h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-md mx-auto leading-relaxed">
                  The rift guardians overwhelmed your defenses on <strong className="text-rose-400">Wave {currentWaveIndex + 1}</strong> of <strong className="text-purple-300">Dungeon Level {activeExpeditionTier}</strong> ({currentTierConfig.recommendedPower.toLocaleString()} Rec Power).
                </p>
                <div className="mt-2 text-[11px] text-zinc-400 max-w-md mx-auto bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <span>Your Hero Power: <strong className="text-amber-300">{heroPower.toLocaleString()} PWR</strong> vs Dungeon: <strong className="text-purple-300">{currentTierConfig.recommendedPower.toLocaleString()} PWR</strong></span>
                  <p className="text-zinc-500 mt-1">
                    {activeExpeditionTier > 1
                      ? 'Forge stronger equipment or select a lower Dungeon Level next time to safely preserve your Keystones!'
                      : 'Forge higher rarity gear, roll defensive modifiers (Dodge/Lifesteal), or unlock Tech Tree combat nodes to safely clear all 5 waves!'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-2">
                {state.dungeonKeys >= 1 && (
                  <button
                    onClick={handleStartExpedition}
                    className="py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    RETRY EXPEDITION (1 🗝️)
                  </button>
                )}

                <button
                  onClick={() => setExpeditionActive(false)}
                  className="py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Back to Briefing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
