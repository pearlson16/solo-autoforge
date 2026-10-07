import React, { useState } from 'react';
import type { GameState } from '../hooks/useAutoForge';
import type { TechNodeDefinition, TechBranch } from '../types/techTree';
import { TECH_NODES, calculateTechNodeCost, computeTechBonuses } from '../types/techTree';
import { soundFx } from '../utils/audio';
import {
  Cpu,
  X,
  Zap,
  Shield,
  Gauge,
  Crosshair,
  HeartHandshake,
  Flame,
  Sparkles,
  Coins,
  Sword,
  Crown,
  Key,
  Swords,
  Gem,
  Globe,
  Lock,
  Check,
  RotateCcw,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface TechTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onUpgradeNode: (nodeId: string) => boolean;
  onRespecTree: () => void;
  onOpenDungeon?: () => void;
}

// Icon mapper helper
const renderNodeIcon = (iconName: string, className: string = 'w-5 h-5') => {
  switch (iconName) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Gauge':
      return <Gauge className={className} />;
    case 'Crosshair':
      return <Crosshair className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Coins':
      return <Coins className={className} />;
    case 'Sword':
      return <Sword className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    case 'Key':
      return <Key className={className} />;
    case 'Swords':
      return <Swords className={className} />;
    case 'Gem':
      return <Gem className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    default:
      return <Cpu className={className} />;
  }
};

export const TechTreeModal: React.FC<TechTreeModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpgradeNode,
  onRespecTree,
  onOpenDungeon,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<'all' | TechBranch>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(TECH_NODES[0].id);

  if (!isOpen) return null;

  const techTreeState = state.techTree || {};
  const activeBonuses = computeTechBonuses(techTreeState);

  const handleUpgradeClick = (node: TechNodeDefinition) => {
    const success = onUpgradeNode(node.id);
    if (success) {
      soundFx.playTechUnlock();
    }
  };

  const handleRespecClick = () => {
    if (window.confirm('Are you sure you want to reset all Tech Nodes? All spent Tech Cores will be 100% refunded.')) {
      onRespecTree();
      soundFx.playSalvage();
    }
  };

  const filteredNodes = selectedBranch === 'all'
    ? TECH_NODES
    : TECH_NODES.filter((n) => n.branch === selectedBranch);

  // Group filtered nodes by Tier
  const tier1Nodes = filteredNodes.filter((n) => n.tier === 1);
  const tier2Nodes = filteredNodes.filter((n) => n.tier === 2);
  const tier3Nodes = filteredNodes.filter((n) => n.tier === 3);
  const tier4Nodes = filteredNodes.filter((n) => n.tier === 4);

  const getBonusText = (node: TechNodeDefinition, level: number) => {
    if (level <= 0) return 'No active bonus';
    const parts: string[] = [];
    if (node.atkPctPerLevel) parts.push(`+${node.atkPctPerLevel * level}% Attack`);
    if (node.hpPctPerLevel) parts.push(`+${node.hpPctPerLevel * level}% Max HP`);
    if (node.defPctPerLevel) parts.push(`+${node.defPctPerLevel * level}% Defense`);
    if (node.atkSpeedPctPerLevel) parts.push(`+${node.atkSpeedPctPerLevel * level}% Atk Speed`);
    if (node.critRatePerLevel) parts.push(`+${node.critRatePerLevel * level}% Crit Rate`);
    if (node.critDmgPerLevel) parts.push(`+${node.critDmgPerLevel * level}% Crit DMG`);
    if (node.dodgeRatePerLevel) parts.push(`+${node.dodgeRatePerLevel * level}% Dodge`);
    if (node.lifeStealPerLevel) parts.push(`+${node.lifeStealPerLevel * level}% Life Steal`);
    if (node.rangeFirstStrikePerLevel) parts.push(`+${node.rangeFirstStrikePerLevel * level}% First Strike`);
    if (node.rarityOddsMultPerLevel) parts.push(`+${node.rarityOddsMultPerLevel * level}% High-Rarity Odds`);
    if (node.scrapBonusPctPerLevel) parts.push(`+${node.scrapBonusPctPerLevel * level}% Scrap Yield`);
    if (node.goldTickMultPerLevel) parts.push(`+${node.goldTickMultPerLevel * level}% Passive Gold/s`);
    if (node.modifierBonusPctPerLevel) parts.push(`+${node.modifierBonusPctPerLevel * level}% Gear Modifier Potency`);
    if (node.keyDropBonusPctPerLevel) parts.push(`+${node.keyDropBonusPctPerLevel * level}% Key Drop Rate`);
    if (node.techCoreBonusPctPerLevel) parts.push(`+${node.techCoreBonusPctPerLevel * level}% Tech Core Yield`);
    if (node.dungeonBonusAtkPctPerLevel) parts.push(`+${node.dungeonBonusAtkPctPerLevel * level}% Dungeon ATK`);
    if (node.dungeonExtraGemsPerLevel) parts.push(`+${node.dungeonExtraGemsPerLevel * level} Dungeon Rubies`);
    return parts.join(', ');
  };

  const getNextRankText = (node: TechNodeDefinition) => {
    const parts: string[] = [];
    if (node.atkPctPerLevel) parts.push(`+${node.atkPctPerLevel}% ATK`);
    if (node.hpPctPerLevel) parts.push(`+${node.hpPctPerLevel}% HP`);
    if (node.defPctPerLevel) parts.push(`+${node.defPctPerLevel}% DEF`);
    if (node.atkSpeedPctPerLevel) parts.push(`+${node.atkSpeedPctPerLevel}% Atk Speed`);
    if (node.critRatePerLevel) parts.push(`+${node.critRatePerLevel}% Crit`);
    if (node.critDmgPerLevel) parts.push(`+${node.critDmgPerLevel}% Crit DMG`);
    if (node.dodgeRatePerLevel) parts.push(`+${node.dodgeRatePerLevel}% Dodge`);
    if (node.lifeStealPerLevel) parts.push(`+${node.lifeStealPerLevel}% Leech`);
    if (node.rangeFirstStrikePerLevel) parts.push(`+${node.rangeFirstStrikePerLevel}% First Strike`);
    if (node.rarityOddsMultPerLevel) parts.push(`+${node.rarityOddsMultPerLevel}% Rarity Odds`);
    if (node.scrapBonusPctPerLevel) parts.push(`+${node.scrapBonusPctPerLevel}% Scrap`);
    if (node.goldTickMultPerLevel) parts.push(`+${node.goldTickMultPerLevel}% Gold/s`);
    if (node.modifierBonusPctPerLevel) parts.push(`+${node.modifierBonusPctPerLevel}% Mod Power`);
    if (node.keyDropBonusPctPerLevel) parts.push(`+${node.keyDropBonusPctPerLevel}% Key Drops`);
    if (node.techCoreBonusPctPerLevel) parts.push(`+${node.techCoreBonusPctPerLevel}% Tech Cores`);
    if (node.dungeonBonusAtkPctPerLevel) parts.push(`+${node.dungeonBonusAtkPctPerLevel}% Dungeon ATK`);
    if (node.dungeonExtraGemsPerLevel) parts.push(`+${node.dungeonExtraGemsPerLevel} Rubies`);
    return parts.join(', ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-purple-500/40 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-purple-950/90 via-zinc-900 to-indigo-950/90 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 tracking-tight">
                  CHRONO TECH MATRIX
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase border border-purple-500/40">
                  Research
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Permanent passive cybernetics & forge enhancements</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Tech Cores Available */}
            <div className="flex items-center gap-1.5 bg-purple-950/90 border border-purple-500/60 px-3 py-1.5 rounded-xl shadow-lg shadow-purple-950/50">
              <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-sm font-black text-purple-300">{state.techCores}</span>
              <span className="text-[10px] text-purple-400/80 font-bold uppercase">Tech Cores</span>
            </div>

            {/* Respec Button */}
            <button
              onClick={handleRespecClick}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-rose-950/60 hover:border-rose-700/60 border border-zinc-700/60 text-zinc-400 hover:text-rose-300 transition cursor-pointer text-xs flex items-center gap-1.5"
              title="Reset all tech nodes and refund all tech cores"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">Respec</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BRANCH TABS & SHORTCUTS */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 bg-zinc-900/40">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Technologies', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'combat', label: '⚔️ Combat Cybernetics', icon: null },
              { id: 'forging', label: '🔥 Forging Matrix', icon: null },
              { id: 'dungeon', label: '🗝️ Dungeon Exploration', icon: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedBranch(tab.id as typeof selectedBranch)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selectedBranch === tab.id
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick link to Ancient Dungeon */}
          {onOpenDungeon && (
            <button
              onClick={() => {
                onClose();
                onOpenDungeon();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-950 to-indigo-950 hover:from-sky-900 hover:to-indigo-900 text-sky-300 text-xs font-extrabold border border-sky-500/40 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-sky-400" />
              <span>Ancient Vault ({state.dungeonKeys} 🗝️)</span>
              <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
            </button>
          )}
        </div>

        {/* MODAL MAIN CONTENT: NODE TIERS & DETAIL PANEL */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* SELECTED NODE INSPECTION & RESEARCH CONSOLE */}
          {(() => {
            const activeNode = TECH_NODES.find((n) => n.id === selectedNodeId) || filteredNodes[0] || TECH_NODES[0];
            const activeCurLevel = techTreeState[activeNode.id] || 0;
            const activeIsMax = activeCurLevel >= activeNode.maxLevel;
            const activeCost = calculateTechNodeCost(activeNode, activeCurLevel);
            const activeCanAfford = state.techCores >= activeCost;

            let activeIsLocked = false;
            let activePrereqNodeName = '';
            let activePrereqMet = true;
            if (activeNode.requiresNodeId) {
              const prereqLvl = techTreeState[activeNode.requiresNodeId] || 0;
              const reqLvl = activeNode.requiresNodeLevel || 1;
              if (prereqLvl < reqLvl) {
                activeIsLocked = true;
                activePrereqMet = false;
                const prereqDef = TECH_NODES.find((n) => n.id === activeNode.requiresNodeId);
                activePrereqNodeName = `${prereqDef?.name || 'Prerequisite Node'} (Lv ${reqLvl})`;
              }
            }

            return (
              <div
                className="rounded-2xl p-4 sm:p-5 border relative overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(15, 12, 28, 0.85)',
                  borderColor: `${activeNode.color}60`,
                  boxShadow: `0 0 25px ${activeNode.color}20`,
                }}
              >
                {/* Background glow */}
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: activeNode.color }}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  {/* Left Column: Icon, Title, Lore Description */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg shrink-0"
                        style={{
                          backgroundColor: `${activeNode.color}20`,
                          borderColor: `${activeNode.color}60`,
                          color: activeNode.color,
                          boxShadow: `0 0 15px ${activeNode.color}35`,
                        }}
                      >
                        {renderNodeIcon(activeNode.iconName, 'w-6 h-6')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-zinc-100">{activeNode.name}</h3>
                          <span
                            className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border"
                            style={{
                              color: activeNode.color,
                              borderColor: `${activeNode.color}50`,
                              backgroundColor: `${activeNode.color}15`,
                            }}
                          >
                            Tier {activeNode.tier} • {activeNode.branch}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-purple-300/90">{activeNode.title}</p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed pl-1">{activeNode.description}</p>

                    {/* Prerequisite Indicator */}
                    {activeNode.requiresNodeId && (
                      <div className="flex items-center gap-2 text-[11px] pt-1 pl-1">
                        <span className="text-zinc-400 font-medium">Requirement:</span>
                        {activePrereqMet ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>{activePrereqNodeName || 'Prerequisite Met'}</span>
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-500/30">
                            <Lock className="w-3 h-3" />
                            <span>Requires {activePrereqNodeName}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Level Progress, Stats Delta, and Action Button */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-3 bg-zinc-900/80 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-zinc-800 shrink-0">
                    <div className="text-left md:text-right space-y-1">
                      <div className="flex items-center md:justify-end gap-2">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Research Level</span>
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                            activeIsMax
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : activeCurLevel > 0
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                          }`}
                        >
                          {activeIsMax ? 'MAX RANK' : `Rank ${activeCurLevel} / ${activeNode.maxLevel}`}
                        </span>
                      </div>

                      <div className="text-xs">
                        {activeCurLevel > 0 ? (
                          <span className="text-emerald-400 font-black">Current: {getBonusText(activeNode, activeCurLevel)}</span>
                        ) : (
                          <span className="text-zinc-500 font-medium">Not Researched Yet</span>
                        )}
                      </div>

                      {!activeIsMax && (
                        <div className="text-[11px] text-purple-300 font-semibold">
                          Next Rank: +{getNextRankText(activeNode)}
                        </div>
                      )}
                    </div>

                    {/* Big Action Upgrade Button */}
                    <div className="w-full sm:w-auto md:w-56">
                      {activeIsLocked ? (
                        <div className="py-2.5 px-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Prerequisite Locked</span>
                        </div>
                      ) : activeIsMax ? (
                        <div className="py-2.5 px-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center justify-center gap-2">
                          <Check className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>MAX RANK COMPLETED</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUpgradeClick(activeNode)}
                          disabled={!activeCanAfford}
                          className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                            activeCanAfford
                              ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/50 active:scale-98'
                              : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                          }`}
                        >
                          <Cpu className="w-4 h-4 animate-pulse" />
                          <span>Upgrade Rank ({activeCost} Cores)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TIER ROWS CONTAINER */}
          <div className="space-y-6">
            {[
              { tier: 1, title: 'TIER I • FOUNDATION PROTOCOLS', nodes: tier1Nodes },
              { tier: 2, title: 'TIER II • ADVANCED SYNCHRONIZATION', nodes: tier2Nodes },
              { tier: 3, title: 'TIER III • MASTER RESONANCE', nodes: tier3Nodes },
              { tier: 4, title: 'TIER IV • APEX SINGULARITY', nodes: tier4Nodes },
            ].map((group) => {
              if (group.nodes.length === 0) return null;

              return (
                <div key={group.tier} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-zinc-400 tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    {group.title}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.nodes.map((node) => {
                      const curLevel = techTreeState[node.id] || 0;
                      const isMax = curLevel >= node.maxLevel;
                      const cost = calculateTechNodeCost(node, curLevel);
                      const canAfford = state.techCores >= cost;

                      // Check prerequisite
                      let isLocked = false;
                      let prereqNodeName = '';
                      if (node.requiresNodeId) {
                        const prereqLvl = techTreeState[node.requiresNodeId] || 0;
                        const reqLvl = node.requiresNodeLevel || 1;
                        if (prereqLvl < reqLvl) {
                          isLocked = true;
                          const prereqDef = TECH_NODES.find((n) => n.id === node.requiresNodeId);
                          prereqNodeName = `${prereqDef?.name || 'Previous Node'} (Lv ${reqLvl})`;
                        }
                      }

                      const isSelected = selectedNodeId === node.id;

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`relative rounded-2xl p-3.5 border transition cursor-pointer flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'bg-purple-950/30 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                              : isLocked
                              ? 'bg-zinc-950/60 border-zinc-900 opacity-60'
                              : isMax
                              ? 'bg-zinc-900/90 border-amber-500/40'
                              : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {/* Top Row: Icon, Name, Level Pill */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm"
                                style={{
                                  backgroundColor: `${node.color}15`,
                                  borderColor: `${node.color}40`,
                                  color: node.color,
                                }}
                              >
                                {renderNodeIcon(node.iconName, 'w-4 h-4')}
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-zinc-100">{node.name}</h4>
                                <span className="text-[10px] text-zinc-400 font-semibold uppercase">
                                  {node.branch} • Tier {node.tier}
                                </span>
                              </div>
                            </div>

                            {/* Level Pill */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                isMax
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : curLevel > 0
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                              }`}
                            >
                              {isMax ? 'MAX' : `Lv ${curLevel}/${node.maxLevel}`}
                            </span>
                          </div>

                          {/* Level Progress Bar */}
                          <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${(curLevel / node.maxLevel) * 100}%` }}
                            />
                          </div>

                          {/* Active Bonus summary */}
                          <div className="text-[11px] font-semibold text-zinc-300 leading-tight">
                            {curLevel > 0 ? (
                              <span className="text-purple-300">{getBonusText(node, curLevel)}</span>
                            ) : (
                              <span className="text-zinc-500">Next: +{getNextRankText(node)}</span>
                            )}
                          </div>

                          {/* Action Button / Lock Status */}
                          <div className="pt-1">
                            {isLocked ? (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400/90 bg-rose-950/30 px-2 py-1.5 rounded-xl border border-rose-900/40">
                                <Lock className="w-3 h-3 text-rose-400 flex-shrink-0" />
                                <span className="truncate">Requires {prereqNodeName}</span>
                              </div>
                            ) : isMax ? (
                              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-amber-400 bg-amber-950/30 py-1.5 rounded-xl border border-amber-900/40">
                                <Check className="w-3 h-3" />
                                <span>MAX LEVEL REACHED</span>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpgradeClick(node);
                                }}
                                disabled={!canAfford}
                                className={`w-full py-1.5 px-3 rounded-xl font-black text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                                  canAfford
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-950/50 active:scale-98'
                                    : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                                }`}
                              >
                                <Cpu className="w-3 h-3" />
                                <span>Upgrade ({cost} Cores)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE BONUSES SUMMARY DRAWER */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Cumulative Tech Matrix Bonuses
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">
                {Object.values(techTreeState).reduce((a, b) => a + b, 0)} Total Ranks Researched
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 block font-bold">Combat Power</span>
                <p className="font-bold text-rose-400">+{activeBonuses.bonusAtkPct}% ATK</p>
                <p className="font-bold text-sky-400">+{activeBonuses.bonusHpPct}% HP • +{activeBonuses.bonusDefPct}% DEF</p>
              </div>

              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 block font-bold">Critical & Speed</span>
                <p className="font-bold text-amber-400">+{activeBonuses.critRate}% Crit • +{activeBonuses.critDmg}% DMG</p>
                <p className="font-bold text-cyan-400">+{activeBonuses.bonusAtkSpeedPct}% Spd • +{activeBonuses.dodgeRate}% Dodge</p>
              </div>

              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 block font-bold">Forging Mastery</span>
                <p className="font-bold text-fuchsia-400">+{activeBonuses.rarityOddsMult}% High Rarity</p>
                <p className="font-bold text-emerald-400">+{activeBonuses.scrapBonusPct}% Scrap • +{activeBonuses.goldTickMult}% Gold/s</p>
              </div>

              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 block font-bold">Rift Exploration</span>
                <p className="font-bold text-sky-400">+{activeBonuses.keyDropBonusPct}% Key Drops</p>
                <p className="font-bold text-purple-400">+{activeBonuses.techCoreBonusPct}% Tech Core Yield</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
