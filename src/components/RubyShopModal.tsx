import React, { useState } from 'react';
import type { GameState, Equipment } from '../hooks/useAutoForge';
import { CIVILIZATIONS, MULTI_FORGE_UPGRADE_COSTS } from '../hooks/useAutoForge';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Gem,
  Package,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Heart,
  Coins,
  Layers,
  Crown,
  CheckCircle2,
  Lock,
  Hammer,
} from 'lucide-react';
import { RARITY_CONFIGS } from './RarityTheme';

interface RubyShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onBuyChest: (tier: 'rare' | 'epic' | 'legendary' | 'mythic') => { item: Equipment; isUpgrade: boolean; currentEquipped: Equipment } | null;
  onBuyBlessing: (blessingId: string, cost: number) => boolean;
  onBuyResource: (type: 'gold' | 'scrap' | 'grand', cost: number) => boolean;
  onBuyMultiForge?: () => boolean;
  onPromptEquipModal: (newItem: Equipment, equippedItem: Equipment) => void;
}

export const RubyShopModal: React.FC<RubyShopModalProps> = ({
  isOpen,
  onClose,
  state,
  onBuyChest,
  onBuyBlessing,
  onBuyResource,
  onBuyMultiForge,
  onPromptEquipModal,
}) => {
  const [activeTab, setActiveTab] = useState<'chests' | 'blessings' | 'resources'>('chests');
  const [recentReward, setRecentReward] = useState<{ title: string; desc: string; rarityColor?: string } | null>(null);

  if (!isOpen) return null;

  const currentMultiLevel = state.multiForgeLevel || 1;
  const nextMultiCost = MULTI_FORGE_UPGRADE_COSTS[currentMultiLevel] || 25;

  const handleMultiForgePurchase = () => {
    if (!onBuyMultiForge) return;
    const success = onBuyMultiForge();
    if (success) {
      soundFx.playForgeLevelUp();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#f43f5e'],
        });
      } catch {
        // Confetti fallback
      }
      setRecentReward({
        title: `Multi-Forge Upgraded to ${Math.min(5, currentMultiLevel + 1)}x!`,
        desc: `You can now forge or auto-forge ${Math.min(5, currentMultiLevel + 1)} items simultaneously!`,
        rarityColor: '#f59e0b',
      });
    }
  };

  const handleChestPurchase = (tier: 'rare' | 'epic' | 'legendary' | 'mythic') => {
    const result = onBuyChest(tier);
    if (!result) return;

    soundFx.playChestOpen(tier);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fbbf24', '#a855f7'],
      });
    } catch {
      // Confetti fallback
    }

    const rConfig = RARITY_CONFIGS[result.item.rarity] || RARITY_CONFIGS.Common;
    const civInfo = CIVILIZATIONS.find((c) => c.id === result.item.civilization);
    const statText = [
      result.item.attack > 0 ? `+${result.item.attack} ATK` : null,
      result.item.defense > 0 ? `+${result.item.defense} DEF` : null,
      result.item.health > 0 ? `+${result.item.health} HP` : null,
    ].filter(Boolean).join(' • ');

    setRecentReward({
      title: `Obtained ${result.item.name}!`,
      desc: `${statText} (T${civInfo?.tier || 1} · ${result.item.civilization} ${result.item.slot})`,
      rarityColor: rConfig.color,
    });

    if (!state.autoEquip) {
      onPromptEquipModal(result.item, result.currentEquipped);
    }
  };

  const handleBlessingPurchase = (id: string, cost: number, name: string) => {
    const success = onBuyBlessing(id, cost);
    if (success) {
      soundFx.playBlessing();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#f59e0b', '#38bdf8'],
        });
      } catch {
        // Confetti fallback
      }
      setRecentReward({
        title: `Blessed with ${name}!`,
        desc: 'Permanent combat & resource bonuses activated.',
        rarityColor: '#f43f5e',
      });
    }
  };

  const handleResourcePurchase = (type: 'gold' | 'scrap' | 'grand', cost: number, name: string) => {
    const success = onBuyResource(type, cost);
    if (success) {
      soundFx.playCoin();
      setRecentReward({
        title: `Purchased ${name}!`,
        desc: 'Resources immediately added to your treasury.',
        rarityColor: '#fbbf24',
      });
    }
  };

  const blessingsList = [
    {
      id: 'midas_ruby',
      name: 'Midas Ruby Idol',
      cost: 12,
      desc: '+30% Passive Gold & Tower Victory Gold',
      icon: <Coins className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
    {
      id: 'dragon_heart',
      name: 'Molten Dragon Heart',
      cost: 18,
      desc: '+18% Total Attack & +12% Infernal Burn Chance',
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
    },
    {
      id: 'valkyrie_feather',
      name: "Valkyrie's Feather",
      cost: 18,
      desc: '+12% Critical Chance & +10% Dodge Agility',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      color: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-300',
    },
    {
      id: 'vampiric_blood',
      name: 'Vampiric Blood Core',
      cost: 22,
      desc: '+12% Life Steal Leech on every attack',
      icon: <Heart className="w-5 h-5 text-pink-400" />,
      color: 'border-pink-500/40 bg-pink-950/20 text-pink-300',
    },
    {
      id: 'titan_fortress',
      name: "Titan's Aegis Core",
      cost: 18,
      desc: '+25% Max HP & +15% Total Armor Defense',
      icon: <Shield className="w-5 h-5 text-sky-400" />,
      color: 'border-sky-500/40 bg-sky-950/20 text-sky-300',
    },
    {
      id: 'scrap_sigil',
      name: "Anvil Master's Sigil",
      cost: 15,
      desc: '+50% Scrap Gained when scrapping or replacing gear',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
  ];

  const eraMult = Math.max(1, state.era);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-rose-950/80 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)]">
              <Gem className="w-6 h-6 text-rose-400 fill-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Ruby Merchant Bazaar
              </h3>
              <p className="text-xs text-rose-300/80 font-medium">
                Exchange rare rubies for relic gear, blessings & resources
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ruby Balance Banner */}
        <div className="px-4 py-2.5 bg-rose-950/40 border-b border-rose-900/30 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-xs text-zinc-300 font-bold">Your Rubies:</span>
            <span className="text-sm font-black text-rose-300">{state.gems} 💎</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">
            💡 Earn +1 to +3 Rubies on every Tower Boss clear!
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('chests')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'chests'
                ? 'bg-rose-950/90 text-rose-300 border border-rose-600/50 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Relic Chests</span>
          </button>
          <button
            onClick={() => setActiveTab('blessings')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'blessings'
                ? 'bg-rose-950/90 text-rose-300 border border-rose-600/50 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eternal Blessings</span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-rose-950/90 text-rose-300 border border-rose-600/50 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Resource Caches</span>
          </button>
        </div>

        {/* Recent Reward Banner */}
        {recentReward && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-zinc-950/90 border border-rose-500/40 flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span style={{ color: recentReward.rarityColor || '#f43f5e' }}>{recentReward.title}</span>
              </div>
              <p className="text-[11px] text-zinc-400">{recentReward.desc}</p>
            </div>
            <button
              onClick={() => setRecentReward(null)}
              className="text-zinc-500 hover:text-zinc-300 text-[10px] uppercase font-bold px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Body / Tab Contents */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {/* TAB 1: RELIC CHESTS */}
          {activeTab === 'chests' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Rare Chest */}
              <div className="bg-zinc-950/80 border border-sky-600/40 hover:border-sky-500 rounded-xl p-3.5 flex flex-col justify-between transition shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-sky-400 uppercase tracking-wider">Rare Relic Chest</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600/50 font-bold">
                      Tier 1
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mb-2">
                    Guaranteed <strong className="text-sky-300">Rare or Epic</strong> gear from Era {state.era} with 2+ combat modifiers.
                  </p>
                </div>
                <button
                  onClick={() => handleChestPurchase('rare')}
                  disabled={state.gems < 5}
                  className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20"
                >
                  <Gem className="w-3.5 h-3.5 fill-current" />
                  <span>Open (5 Rubies)</span>
                </button>
              </div>

              {/* Epic Reliquary */}
              <div className="bg-zinc-950/80 border border-purple-600/40 hover:border-purple-500 rounded-xl p-3.5 flex flex-col justify-between transition shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-purple-400 uppercase tracking-wider">Epic Royal Reliquary</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600/50 font-bold">
                      Tier 2
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mb-2">
                    Guaranteed <strong className="text-purple-300">Epic or Legendary</strong> gear with 3+ powerful modifiers and high stats.
                  </p>
                </div>
                <button
                  onClick={() => handleChestPurchase('epic')}
                  disabled={state.gems < 15}
                  className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <Gem className="w-3.5 h-3.5 fill-current" />
                  <span>Open (15 Rubies)</span>
                </button>
              </div>

              {/* Legendary Vault */}
              <div className="bg-zinc-950/80 border border-amber-500/50 hover:border-amber-400 rounded-xl p-3.5 flex flex-col justify-between transition shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Legendary Dragon Vault</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-bold">
                      Tier 3
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mb-2">
                    Guaranteed <strong className="text-amber-300">Legendary</strong> weapon or armor with 5 maximum modifiers!
                  </p>
                </div>
                <button
                  onClick={() => handleChestPurchase('legendary')}
                  disabled={state.gems < 35}
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Gem className="w-3.5 h-3.5 fill-current" />
                  <span>Open (35 Rubies)</span>
                </button>
              </div>

              {/* Mythic God Chest */}
              <div className="bg-zinc-950/80 border border-rose-500/60 hover:border-rose-400 rounded-xl p-3.5 flex flex-col justify-between transition shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" /> Mythic Celestial God-Chest
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/60 font-bold">
                      Apex
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mb-2">
                    Guaranteed <strong className="text-rose-400">Mythic</strong> God-Tier equipment with 6 maximum modifiers & astronomical base power.
                  </p>
                </div>
                <button
                  onClick={() => handleChestPurchase('mythic')}
                  disabled={state.gems < 75}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30"
                >
                  <Gem className="w-3.5 h-3.5 fill-current" />
                  <span>Open (75 Rubies)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ETERNAL BLESSINGS & WORKSHOP UPGRADES */}
          {activeTab === 'blessings' && (
            <div className="space-y-3">
              {/* Featured Multi-Forge Anvil Upgrade */}
              <div className="p-3.5 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-950/60 via-zinc-900 to-zinc-950 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/50 shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                      <Hammer className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-amber-300">Multi-Forge Anvil Matrix</h4>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50">
                          Capacity: {currentMultiLevel}x / 5x
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 font-medium mt-0.5">
                        {currentMultiLevel >= 5
                          ? 'Maximum Multi-Forge capacity reached! Crafting up to 5 items simultaneously.'
                          : `Allows forging or auto-forging up to ${currentMultiLevel + 1} items at once on each hammer strike!`}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    {currentMultiLevel >= 5 ? (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-xs font-black text-emerald-300 flex items-center justify-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>MAX (5x)</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleMultiForgePurchase}
                        disabled={state.gems < nextMultiCost}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-zinc-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/30"
                      >
                        <Gem className="w-3.5 h-3.5 fill-current" />
                        <span>Unlock {currentMultiLevel + 1}x ({nextMultiCost} 💎)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Other Permanent Relic Blessings */}
              {blessingsList.map((blessing) => {
                const isOwned = (state.blessings || []).includes(blessing.id);
                const canAfford = state.gems >= blessing.cost;

                return (
                  <div
                    key={blessing.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                      isOwned
                        ? 'bg-zinc-950/50 border-zinc-800 opacity-80'
                        : 'bg-zinc-950/90 hover:bg-zinc-900/90 ' + blessing.color
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 shrink-0">
                        {blessing.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-white">{blessing.name}</h4>
                          {isOwned && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-300 font-medium">{blessing.desc}</p>
                      </div>
                    </div>

                    <div>
                      {isOwned ? (
                        <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Owned</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBlessingPurchase(blessing.id, blessing.cost, blessing.name)}
                          disabled={!canAfford}
                          className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-black transition cursor-pointer flex items-center gap-1 shrink-0 shadow-md shadow-rose-600/20"
                        >
                          <Gem className="w-3.5 h-3.5 fill-current" />
                          <span>{blessing.cost}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: RESOURCE CACHES */}
          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Gold Pouch */}
              <div className="bg-zinc-950/80 border border-yellow-500/40 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-xs font-black text-white">Gold Cache</h4>
                  </div>
                  <p className="text-xs text-zinc-300 mb-1">
                    Instantly receive <strong className="text-yellow-400">+{(3000 * eraMult).toLocaleString()} Gold</strong>.
                  </p>
                  <p className="text-[10px] text-zinc-500 mb-3">Scales with Civilization Era.</p>
                </div>
                <button
                  onClick={() => handleResourcePurchase('gold', 4, 'Gold Cache')}
                  disabled={state.gems < 4}
                  className="w-full py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Gem className="w-3.5 h-3.5 fill-current" />
                  <span>Buy (4 Rubies)</span>
                </button>
              </div>

              {/* Scrap Crate */}
              <div className="bg-zinc-950/80 border border-cyan-500/40 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-black text-white">Scrap Stash</h4>
                  </div>
                  <p className="text-xs text-zinc-300 mb-1">
                    Instantly receive <strong className="text-cyan-400">+{(250 * eraMult).toLocaleString()} Scrap</strong>.
                  </p>
                  <p className="text-[10px] text-zinc-500 mb-3">Used for forge tier upgrades.</p>
                </div>
                <button
                  onClick={() => handleResourcePurchase('scrap', 4, 'Scrap Stash')}
                  disabled={state.gems < 4}
                  className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Gem className="w-3.5 h-3.5 fill-current" />
                  <span>Buy (4 Rubies)</span>
                </button>
              </div>

              {/* Grand Cache */}
              <div className="bg-zinc-950/80 border border-rose-500/50 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Crown className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-black text-white">Grand Treasury</h4>
                  </div>
                  <p className="text-xs text-zinc-300 mb-1">
                    <strong className="text-yellow-400">+{(12000 * eraMult).toLocaleString()} Gold</strong> & <strong className="text-cyan-400">+{(800 * eraMult).toLocaleString()} Scrap</strong>.
                  </p>
                  <p className="text-[10px] text-zinc-500 mb-3">Best value resource pack.</p>
                </div>
                <button
                  onClick={() => handleResourcePurchase('grand', 10, 'Grand Treasury')}
                  disabled={state.gems < 10}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Gem className="w-3.5 h-3.5 fill-current" />
                  <span>Buy (10 Rubies)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>All purchases are instant and saved automatically.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
