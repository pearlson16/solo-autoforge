import { useState } from 'react';
import { useAutoForge } from './hooks/useAutoForge';
import type { Equipment } from './hooks/useAutoForge';
import { GameHeader } from './components/GameHeader';
import { HeroDisplay } from './components/HeroDisplay';
import { ForgeWorkshop } from './components/ForgeWorkshop';
import { TowerBattleArena } from './components/TowerBattleArena';
import { RubyShopModal } from './components/RubyShopModal';
import { DungeonModal } from './components/DungeonModal';
import { TechTreeModal } from './components/TechTreeModal';
import { ItemComparisonModal } from './components/ItemComparisonModal';
import { RunewordSocketModal } from './components/RunewordSocketModal';
import { soundFx } from './utils/audio';

export default function App() {
  const {
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
    socketGem,
    unsocketGem,
    fuseGems,
    updateAutomationRules,
  } = useAutoForge();

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isDungeonOpen, setIsDungeonOpen] = useState(false);
  const [isTechTreeOpen, setIsTechTreeOpen] = useState(false);
  const [isRunewordOpen, setIsRunewordOpen] = useState(false);
  const [shopComparisonItem, setShopComparisonItem] = useState<{ newItem: Equipment; equippedItem: Equipment } | null>(null);

  return (
    <div className="min-h-screen bg-stone-950 text-zinc-100 flex flex-col items-center p-3 sm:p-6 select-none font-sans relative overflow-x-hidden">
      {/* Dynamic Ambient Background Lighting & Particles */}
      <div className="fixed -top-24 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/3 -right-24 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-24 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Dungeon/Forge Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Resource Metrics & Header */}
      <GameHeader
        state={state}
        onReset={resetGame}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenDungeon={() => setIsDungeonOpen(true)}
        onOpenTechTree={() => setIsTechTreeOpen(true)}
        onOpenRuneword={() => setIsRunewordOpen(true)}
      />

      {/* Main Game Interface */}
      <main className="w-full max-w-4xl space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* Hero & Equipped Gear Display */}
          <HeroDisplay state={state} />

          {/* Workshop & Anvil Forging */}
          <ForgeWorkshop
            state={state}
            onForge={forgeItem}
            onEquip={equipItem}
            onEquipMultiple={equipMultipleItems}
            onScrap={scrapItem}
            onScrapMultiple={scrapMultipleItems}
            onToggleAutoEquip={toggleAutoEquip}
            onUpgrade={upgradeForge}
            getUpgradeCost={getUpgradeCost}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenRuneword={() => setIsRunewordOpen(true)}
            onChangeAutomationRules={updateAutomationRules}
          />
        </div>

        {/* Endless Tower Combat Arena */}
        <TowerBattleArena
          state={state}
          onFightBoss={fightFloorBoss}
          onSetFloor={setFloor}
          onOpenDungeon={() => setIsDungeonOpen(true)}
          onOpenTechTree={() => setIsTechTreeOpen(true)}
        />
      </main>

      {/* Ruby Merchant Shop Modal */}
      <RubyShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        state={state}
        onBuyChest={buyRubyChest}
        onBuyBlessing={buyRubyBlessing}
        onBuyResource={buyRubyResource}
        onBuyMultiForge={buyMultiForgeUpgrade}
        onPromptEquipModal={(newItem, equippedItem) => {
          setShopComparisonItem({ newItem, equippedItem });
        }}
      />

      {/* Ancient Vault Dungeon Modal */}
      <DungeonModal
        isOpen={isDungeonOpen}
        onClose={() => setIsDungeonOpen(false)}
        state={state}
        onStartExpedition={startDungeonExpedition}
        onFightWave={fightDungeonWave}
        onClaimRewards={claimDungeonRewards}
        onOpenTechTree={() => setIsTechTreeOpen(true)}
      />

      {/* Chrono Tech Tree Modal */}
      <TechTreeModal
        isOpen={isTechTreeOpen}
        onClose={() => setIsTechTreeOpen(false)}
        state={state}
        onUpgradeNode={upgradeTechNode}
        onRespecTree={respecTechTree}
        onOpenDungeon={() => setIsDungeonOpen(true)}
      />

      {/* Elemental Runeword & Gem Socketing Modal */}
      <RunewordSocketModal
        isOpen={isRunewordOpen}
        onClose={() => setIsRunewordOpen(false)}
        equipped={state.equipped}
        gemInventory={state.gemInventory || { Ruby: 0, Sapphire: 0, Topaz: 0, Amethyst: 0, Emerald: 0 }}
        onSocketGem={socketGem}
        onUnsocketGem={unsocketGem}
        onFuseGems={fuseGems}
        activeSockets={state.activeSockets || { weapon: [], armor: [], helmet: [], gloves: [], boots: [] }}
      />

      {/* Item Comparison Modal for Manual Chest Loot */}
      {shopComparisonItem && (
        <ItemComparisonModal
          isOpen={!!shopComparisonItem}
          onClose={() => setShopComparisonItem(null)}
          newItem={shopComparisonItem.newItem}
          equippedItem={shopComparisonItem.equippedItem}
          onEquip={() => {
            soundFx.playEquip(shopComparisonItem.newItem.rarity);
            equipItem(shopComparisonItem.newItem);
            setShopComparisonItem(null);
          }}
          onScrap={() => {
            soundFx.playSalvage();
            scrapItem(shopComparisonItem.newItem);
            setShopComparisonItem(null);
          }}
        />
      )}

      {/* Footer Info */}
      <footer className="mt-8 text-center text-xs text-zinc-400 pb-4">
        <span>Solo AutoForge • Master the forge, challenge the tower</span>
      </footer>
    </div>
  );
}