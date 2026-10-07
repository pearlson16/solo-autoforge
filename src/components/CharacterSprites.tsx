import React from 'react';
import type { CivilizationId, Equipment, GameState } from '../hooks/useAutoForge';
import { RARITY_CONFIGS } from './RarityTheme';
import { WeaponInHand, ArmorOutfit, ArmorHelmet, ArmorBoots, ArmorGloves, getCivPalette } from './GearVisuals';

export interface HeroAvatarProps {
  className?: string;
  isAttacking?: boolean;
  isRanged?: boolean;
  isWalking?: boolean;
  isHit?: boolean;
  isDodging?: boolean;
  civilization?: CivilizationId;
  weaponSlot?: string;
  rarityColor?: string;
  equipped?: GameState['equipped'];
  equippedWeapon?: Equipment;
  equippedArmor?: Equipment;
  equippedHelmet?: Equipment;
  equippedGloves?: Equipment;
  equippedBoots?: Equipment;
}

// Rarity visual intensity tiers: how much the gear visually glows / gets extra plating
const RARITY_VISUAL_TIER: Record<string, number> = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3,
  Mythic: 4,
};

export const HeroSprite: React.FC<HeroAvatarProps> = ({
  className = 'w-24 h-24',
  isAttacking = false,
  isRanged = false,
  isWalking = false,
  isHit = false,
  isDodging = false,
  civilization,
  rarityColor = '#f59e0b',
  equipped,
  equippedWeapon,
  equippedArmor,
  equippedHelmet,
  equippedGloves,
  equippedBoots,
}) => {
  const weapon = equippedWeapon || equipped?.weapon;
  const armor = equippedArmor || equipped?.armor;
  const helmet = equippedHelmet || equipped?.helmet;
  const gloves = equippedGloves || equipped?.gloves;
  const boots = equippedBoots || equipped?.boots;

  // Derive active civilization palette from equipped armor / weapon or prop
  const effectiveCivilization = civilization || armor?.civilization || weapon?.civilization || 'Primitive';
  const colors = getCivPalette(effectiveCivilization);

  // Derive per-piece visual styling and rarity
  const weaponRarity = weapon?.rarity || 'Common';
  const armorRarity = armor?.rarity || 'Common';
  const helmetRarity = helmet?.rarity || 'Common';
  const glovesRarity = gloves?.rarity || 'Common';
  const bootsRarity = boots?.rarity || 'Common';

  const weaponTier = RARITY_VISUAL_TIER[weaponRarity] ?? 0;
  const armorTier = RARITY_VISUAL_TIER[armorRarity] ?? 0;
  const helmetTier = RARITY_VISUAL_TIER[helmetRarity] ?? 0;

  const weaponRarityColor = RARITY_CONFIGS[weaponRarity]?.color || rarityColor;
  const armorRarityColor = RARITY_CONFIGS[armorRarity]?.color || colors.trim;
  const helmetRarityColor = RARITY_CONFIGS[helmetRarity]?.color || colors.trim;
  const glovesRarityColor = RARITY_CONFIGS[glovesRarity]?.color || colors.trim;
  const bootsRarityColor = RARITY_CONFIGS[bootsRarity]?.color || colors.trim;

  // Individual piece palettes
  const armorPalette = getCivPalette(armor?.civilization || effectiveCivilization);
  const helmetPalette = getCivPalette(helmet?.civilization || effectiveCivilization);
  const bootsPalette = getCivPalette(boots?.civilization || effectiveCivilization);
  const glovesPalette = getCivPalette(gloves?.civilization || effectiveCivilization);

  // Armor plating intensity: higher rarity armor = brighter metal & extra trim layers
  const armorGlowOpacity = 0.15 + armorTier * 0.18;
  const weaponGlowDev = 2 + weaponTier * 1.2;

  // Armor metal tint: blend the civilization plate color toward the armor rarity color at high tiers
  const mixHex = (a: string, b: string, t: number) => {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const mix = (sh: number) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
    const r = mix(16), g = mix(8), bl = mix(0);
    return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
  };

  const armorTintedPlate = armorTier > 0 ? mixHex(armorPalette.plate, armorRarityColor, Math.min(0.55, armorTier * 0.14)) : armorPalette.plate;
  const armorTintedTrim = armorTier > 0 ? mixHex(armorPalette.trim, armorRarityColor, Math.min(0.7, armorTier * 0.18)) : armorPalette.trim;

  const helmetTintedPlate = helmetTier > 0 ? mixHex(helmetPalette.plate, helmetRarityColor, Math.min(0.55, helmetTier * 0.14)) : helmetPalette.plate;

  // Unique SVG gradient IDs per sprite instance to avoid cross-instance collisions
  const uid = React.useId().replace(/[:]/g, '');
  const capeId = `heroCape-${uid}`;
  const armorAuraId = `armorAura-${uid}`;

  // Shield is only shown when any equipped item has a defensive/block-style modifier
  const allEquippedItems = [weapon, armor, helmet, gloves, boots].filter(Boolean) as Equipment[];
  const hasBlockModifier = allEquippedItems.some((item) =>
    (item.modifiers || []).some((m) => ['bonusDefPct', 'dodgeRate', 'bonusHpPct'].includes(m.type))
  );

  // Force a full sprite re-render whenever ANY of the 5 equipped items change
  const gearKey = `${weapon?.id || 'w'}-${armor?.id || 'a'}-${helmet?.id || 'h'}-${gloves?.id || 'g'}-${boots?.id || 'b'}-${isAttacking}-${isRanged}-${isWalking}-${isHit}-${isDodging}`;

  return (
    <div
      key={gearKey}
      className={`relative flex items-center justify-center select-none ${className} ${
        isHit ? 'animate-hit-recoil-hero' : ''
      } ${isDodging ? 'animate-dodge-evade' : ''}`}
    >
      {/* Ground Shadow */}
      <div className="absolute -bottom-1 w-3/4 h-3 bg-black/60 rounded-full blur-[2px] pointer-events-none" />

      {/* SVG Character Model */}
      <svg
        viewBox="0 0 120 140"
        className={`w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform duration-150 ${
          isAttacking ? (isRanged ? 'scale-105' : 'scale-110') : isWalking ? 'scale-105' : ''
        } ${isHit ? 'brightness-150 saturate-150' : ''}`}
      >
        <defs>
          <linearGradient id={capeId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.cape} />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <radialGradient id={armorAuraId} cx="0.5" cy="0.45" r="0.55">
            <stop offset="0%" stopColor={armorRarityColor} stopOpacity={armorGlowOpacity} />
            <stop offset="100%" stopColor={armorRarityColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* EQUIPPED ARMOR RARITY AURA */}
        {armorTier > 0 && (
          <ellipse cx="55" cy="65" rx="48" ry="55" fill={`url(#${armorAuraId})`} />
        )}

        {/* 1. CAPE (Back layer) */}
        <path
          d={
            isAttacking
              ? 'M 40 45 Q 15 65 5 110 Q 30 115 50 100 Q 60 70 55 45 Z'
              : isWalking
              ? 'M 38 45 Q 12 70 2 112 Q 28 118 48 102 Q 58 70 54 45 Z'
              : 'M 42 45 Q 25 75 22 110 Q 50 115 65 105 Q 60 70 58 45 Z'
          }
          fill={`url(#${capeId})`}
          stroke="#000"
          strokeWidth="2"
        />

        {/* 2. LEGS & BOOTS (Equipped Boots) */}
        {/* Left Leg Base */}
        <path
          d={
            isWalking
              ? 'M 44 92 L 36 122 L 26 126 L 42 127 L 48 92 Z'
              : 'M 44 92 L 40 120 L 32 125 L 48 126 L 50 92 Z'
          }
          fill="#1e293b"
          stroke="#000"
          strokeWidth="2"
        />
        {/* Right Leg Base */}
        <path
          d={
            isWalking
              ? 'M 60 92 L 68 118 L 62 125 L 78 125 L 70 92 Z'
              : 'M 60 92 L 64 120 L 58 126 L 74 126 L 68 92 Z'
          }
          fill="#1e293b"
          stroke="#000"
          strokeWidth="2"
        />

        {boots && (
          <ArmorBoots
            item={boots}
            rarityColor={bootsRarityColor}
            plateColor={bootsPalette.plate}
            uid={uid}
          />
        )}

        {/* 3. TORSO (Equipped Chest Armor) */}
        {armor && (
          <ArmorOutfit
            item={armor}
            rarityColor={armorRarityColor}
            plateColor={armorTintedPlate}
            trimColor={armorTintedTrim}
            uid={uid}
          />
        )}

        {/* 4. NECK & HEADGEAR (Equipped Helmet) */}
        <rect x="50" y="40" width="10" height="10" fill="#fed7aa" stroke="#000" strokeWidth="1.5" />

        {helmet && (
          <ArmorHelmet
            item={helmet}
            rarityColor={helmetRarityColor}
            plateColor={helmetTintedPlate}
            uid={uid}
          />
        )}

        {/* 5. LEFT ARM, SHIELD & LEFT GLOVE */}
        <g transform="translate(0, 0)">
          {/* Shoulder Pauldron */}
          <circle cx="40" cy="52" r="7" fill={armorTintedPlate} stroke="#000" strokeWidth="2" />
          <circle cx="40" cy="52" r="3" fill={armorTintedTrim} />

          {/* Left Glove on Hand */}
          {gloves && (
            <ArmorGloves
              item={gloves}
              rarityColor={glovesRarityColor}
              plateColor={glovesPalette.plate}
              uid={uid}
            />
          )}

          {hasBlockModifier && (
            <g>
              {/* Heavy Shield */}
              <path
                d="M 24 50 L 38 48 L 40 76 L 31 92 L 22 76 Z"
                fill={armorTintedPlate}
                stroke="#000"
                strokeWidth="2"
              />
              {/* Shield Emblem Cross/Boss */}
              <path
                d="M 31 52 L 31 84 M 23 64 L 39 64"
                stroke={armorTintedTrim}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="31" cy="64" r="3.5" fill="#f59e0b" stroke="#000" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* 6. RIGHT ARM, RIGHT GLOVE & WEAPON */}
        <g
          className={`origin-[68px_52px] transition-transform duration-150 ${
            isAttacking
              ? isRanged
                ? 'rotate-[18deg] translate-x-3 translate-y--2'
                : 'rotate-[55deg] translate-x-3 translate-y--1'
              : isWalking
              ? 'rotate-[-8deg] translate-x-1'
              : ''
          }`}
        >
          {/* Shoulder Pauldron */}
          <circle cx="68" cy="52" r="7" fill={armorTintedPlate} stroke="#000" strokeWidth="2" />
          <circle cx="68" cy="52" r="3" fill={armorTintedTrim} />

          {/* Arm Sleeve */}
          <path d="M 68 54 L 80 66 L 76 72 L 64 60 Z" fill={colors.cloth} stroke="#000" strokeWidth="1.5" />

          {/* Right Glove Gauntlet */}
          {gloves && (
            <ArmorGloves
              item={gloves}
              rarityColor={glovesRarityColor}
              plateColor={glovesPalette.plate}
              uid={uid}
            />
          )}

          {/* Weapon in Hand */}
          {weapon && (
            <WeaponInHand
              item={weapon}
              rarityColor={weaponRarityColor}
              glowDev={weaponGlowDev}
              uid={uid}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

export interface EnemyAvatarProps {
  era: number;
  className?: string;
  isAttacking?: boolean;
  isWalking?: boolean;
  isHit?: boolean;
  isMinion?: boolean;
  minionIndex?: number;
}

export const EnemySprite: React.FC<EnemyAvatarProps> = ({
  era,
  className = 'w-24 h-24',
  isAttacking = false,
  isWalking = false,
  isHit = false,
  isMinion = false,
}) => {
  const boundedEra = Math.max(1, Math.min(10, era));

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className} ${
        isHit ? 'animate-hit-recoil-boss' : ''
      } ${isMinion ? 'scale-90' : ''}`}
    >
      {/* Ground Shadow */}
      <div className="absolute -bottom-1 w-3/4 h-3 bg-black/60 rounded-full blur-[2px] pointer-events-none" />

      {/* ERA 1: Sabertooth Tiger / Prehistoric Beast */}
      {boundedEra === 1 && (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full drop-shadow-[0_4px_12px_rgba(249,115,22,0.6)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Tail */}
          <path d="M 25 65 Q 10 50 15 35 Q 20 45 30 60 Z" fill="#d97706" stroke="#000" strokeWidth="2" />
          {/* Body */}
          <ellipse cx="55" cy="70" rx="35" ry="24" fill="#f59e0b" stroke="#000" strokeWidth="2" />
          {/* Stripes */}
          <path d="M 45 52 L 48 70 M 58 50 L 60 72 M 70 55 L 72 70" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          {/* Back Paws */}
          <ellipse cx="32" cy="88" rx="8" ry="12" fill="#d97706" stroke="#000" strokeWidth="2" />
          <ellipse cx="30" cy="98" rx="10" ry="6" fill="#fef3c7" stroke="#000" strokeWidth="2" />
          {/* Front Paws */}
          <ellipse cx="78" cy="88" rx="8" ry="12" fill="#d97706" stroke="#000" strokeWidth="2" />
          <ellipse cx="82" cy="98" rx="10" ry="6" fill="#fef3c7" stroke="#000" strokeWidth="2" />

          {/* Head */}
          <circle cx="85" cy="52" r="19" fill="#f59e0b" stroke="#000" strokeWidth="2" />
          {/* Ears */}
          <path d="M 75 38 L 80 26 L 88 36 Z" fill="#b45309" stroke="#000" strokeWidth="2" />
          <path d="M 88 38 L 95 28 L 98 40 Z" fill="#b45309" stroke="#000" strokeWidth="2" />
          {/* Snout */}
          <ellipse cx="94" cy="58" rx="10" ry="8" fill="#fef3c7" stroke="#000" strokeWidth="1.5" />
          <circle cx="98" cy="54" r="3" fill="#18181b" />
          {/* Glowing Eyes */}
          <ellipse cx="86" cy="48" rx="3" ry="4" fill="#ef4444" />
          <ellipse cx="86" cy="48" rx="1" ry="3" fill="#fef08a" />
          {/* Massive Sabertooth Fangs */}
          <path d="M 90 60 L 88 80 L 93 60 Z" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
          <path d="M 96 60 L 95 78 L 99 60 Z" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
        </svg>
      )}

      {/* ERA 2: Anubis Tomb Guard (Ancient) */}
      {boundedEra === 2 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_12px_rgba(56,189,248,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Jackal Ears */}
          <path d="M 45 40 L 35 5 L 55 30 Z" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
          <path d="M 75 40 L 85 5 L 65 30 Z" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />

          {/* Pharaoh Gold Headdress */}
          <path d="M 38 35 Q 60 15 82 35 L 86 65 L 34 65 Z" fill="#0284c7" stroke="#f59e0b" strokeWidth="2" />
          <path d="M 42 35 L 42 65 M 50 28 L 50 65 M 70 28 L 70 65 M 78 35 L 78 65" stroke="#f59e0b" strokeWidth="2" />

          {/* Jackal Head & Snout */}
          <polygon points="46,38 74,38 88,58 75,64 60,62 45,64 32,58" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
          {/* Glowing Cyan Eyes */}
          <ellipse cx="48" cy="46" rx="3.5" ry="2.5" fill="#38bdf8" />
          <ellipse cx="72" cy="46" rx="3.5" ry="2.5" fill="#38bdf8" />

          {/* Egyptian Gold Collar & Robes */}
          <path d="M 38 65 Q 60 78 82 65 L 88 115 L 32 115 Z" fill="#f59e0b" stroke="#000" strokeWidth="2" />
          <path d="M 40 68 Q 60 84 80 68" stroke="#0284c7" strokeWidth="4" fill="none" />
          <rect x="42" y="90" width="36" height="25" fill="#ffffff" stroke="#000" strokeWidth="1.5" />

          {/* Khopesh Curved Sickle Blade in hand */}
          <path d="M 28 85 Q 10 70 12 45 Q 22 35 26 50 Q 22 75 32 80 Z" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
        </svg>
      )}

      {/* ERA 3: Centurion Gladiator (Antiquity) */}
      {boundedEra === 3 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_12px_rgba(34,197,94,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Red Crest / Plume */}
          <path d="M 35 25 Q 60 -5 85 25 L 75 30 Q 60 10 45 30 Z" fill="#dc2626" stroke="#000" strokeWidth="2" />
          {/* Bronze Helmet */}
          <circle cx="60" cy="38" r="16" fill="#b45309" stroke="#000" strokeWidth="2" />
          {/* Face Visor T-Slit */}
          <path d="M 52 34 L 68 34 L 62 52 L 58 52 Z" fill="#09090b" stroke="#000" strokeWidth="1.5" />
          <line x1="55" y1="38" x2="65" y2="38" stroke="#ef4444" strokeWidth="2" />

          {/* Roman Muscle Cuirass & Tunic */}
          <path d="M 44 54 L 76 54 L 72 98 L 48 98 Z" fill="#b45309" stroke="#000" strokeWidth="2" />
          {/* Muscle lines */}
          <path d="M 54 64 Q 60 70 66 64 M 54 78 Q 60 84 66 78" stroke="#78350f" strokeWidth="2" fill="none" />
          {/* Pteruges (Leather skirt strips) */}
          <rect x="46" y="96" width="6" height="15" fill="#78350f" stroke="#000" strokeWidth="1" />
          <rect x="54" y="96" width="6" height="15" fill="#78350f" stroke="#000" strokeWidth="1" />
          <rect x="62" y="96" width="6" height="15" fill="#78350f" stroke="#000" strokeWidth="1" />

          {/* Tower Scutum Shield */}
          <rect x="74" y="52" width="22" height="48" rx="4" fill="#dc2626" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="85" cy="76" r="5" fill="#f59e0b" stroke="#000" strokeWidth="1" />

          {/* Iron Gladius Sword */}
          <path d="M 38 70 L 22 45 L 26 42 L 42 66 Z" fill="#e2e8f0" stroke="#000" strokeWidth="1.5" />
        </svg>
      )}

      {/* ERA 4: Viking Frost Berserker (Norman) */}
      {boundedEra === 4 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_12px_rgba(234,179,8,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Horned Helmet */}
          <path d="M 40 38 Q 20 25 18 10 Q 30 20 42 28 Z" fill="#f8fafc" stroke="#000" strokeWidth="2" />
          <path d="M 80 38 Q 100 25 102 10 Q 90 20 78 28 Z" fill="#f8fafc" stroke="#000" strokeWidth="2" />
          <path d="M 42 32 Q 60 22 78 32 L 76 46 L 44 46 Z" fill="#64748b" stroke="#000" strokeWidth="2" />

          {/* Fierce Face & Braided Beard */}
          <circle cx="60" cy="44" r="14" fill="#fed7aa" stroke="#000" strokeWidth="1.5" />
          <circle cx="56" cy="42" r="2" fill="#000" />
          <circle cx="64" cy="42" r="2" fill="#000" />
          <path d="M 48 48 Q 60 82 60 88 Q 60 82 72 48 Z" fill="#ea580c" stroke="#000" strokeWidth="2" />

          {/* Chainmail & Wolf Pelt */}
          <path d="M 38 60 L 82 60 L 78 108 L 42 108 Z" fill="#475569" stroke="#000" strokeWidth="2" />
          <path d="M 34 54 Q 60 66 86 54 L 84 72 Q 60 80 36 72 Z" fill="#71717a" stroke="#000" strokeWidth="2" />

          {/* Dual Viking Bearded Axes */}
          <path d="M 28 85 L 18 35 M 10 38 Q 24 22 28 48 Z" stroke="#78350f" strokeWidth="3" fill="#cbd5e1" />
          <path d="M 92 85 L 102 35 M 110 38 Q 96 22 92 48 Z" stroke="#78350f" strokeWidth="3" fill="#cbd5e1" />
        </svg>
      )}

      {/* ERA 5: Black Knight Dreadlord (Medieval) */}
      {boundedEra === 5 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_14px_rgba(236,72,153,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Horned Dread Helmet */}
          <path d="M 42 22 Q 22 5 20 -2 Q 35 8 45 16 Z" fill="#18181b" stroke="#ec4899" strokeWidth="1.5" />
          <path d="M 78 22 Q 98 5 100 -2 Q 85 8 75 16 Z" fill="#18181b" stroke="#ec4899" strokeWidth="1.5" />
          <path d="M 42 18 Q 60 10 78 18 L 74 48 L 46 48 Z" fill="#09090b" stroke="#ec4899" strokeWidth="2" />
          {/* Glowing Red Visor */}
          <line x1="48" y1="32" x2="72" y2="32" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />

          {/* Dark Steel Gothic Full Plate */}
          <path d="M 40 48 L 80 48 L 75 105 L 45 105 Z" fill="#18181b" stroke="#ec4899" strokeWidth="2" />
          <path d="M 52 56 L 68 56 L 64 88 L 56 88 Z" fill="#27272a" stroke="#ec4899" strokeWidth="1" />

          {/* Massive Two-Handed Dark Greatsword */}
          <path d="M 28 95 L 20 10 L 28 8 L 34 95 Z" fill="#e2e8f0" stroke="#f43f5e" strokeWidth="2" />
          <line x1="16" y1="35" x2="38" y2="35" stroke="#ec4899" strokeWidth="3" />
        </svg>
      )}

      {/* ERA 6: Renaissance Duelist Maestro */}
      {boundedEra === 6 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_12px_rgba(192,132,252,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Feathered Cavalier Hat */}
          <ellipse cx="60" cy="26" rx="34" ry="10" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
          <path d="M 40 22 Q 25 -5 15 10 Q 30 15 45 22 Z" fill="#f43f5e" stroke="#000" strokeWidth="1.5" />

          {/* Duelist Face & Mustache */}
          <circle cx="60" cy="38" r="14" fill="#fed7aa" stroke="#000" strokeWidth="1.5" />
          <path d="M 48 42 Q 60 48 72 42" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Ornate Gold-Trimmed Vest & Tabard */}
          <path d="M 42 50 L 78 50 L 72 105 L 48 105 Z" fill="#6b21a8" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 48 50 L 60 76 L 72 50" stroke="#fbbf24" strokeWidth="2" fill="none" />

          {/* Rapier Foil Blade */}
          <line x1="38" y1="85" x2="10" y2="30" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="36" cy="82" r="5" fill="#fbbf24" stroke="#000" strokeWidth="1.5" />
        </svg>
      )}

      {/* ERA 7: Clockwork Steam Titan (Industrial) */}
      {boundedEra === 7 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_14px_rgba(6,182,212,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Steam Exhaust Pipes */}
          <rect x="36" y="8" width="8" height="24" fill="#64748b" stroke="#000" strokeWidth="1.5" />
          <rect x="76" y="8" width="8" height="24" fill="#64748b" stroke="#000" strokeWidth="1.5" />
          {/* Steam puffs */}
          <circle cx="40" cy="4" r="5" fill="#e2e8f0" opacity="0.6" />
          <circle cx="80" cy="4" r="5" fill="#e2e8f0" opacity="0.6" />

          {/* Brass Automaton Head */}
          <rect x="44" y="24" width="32" height="24" rx="4" fill="#b45309" stroke="#06b6d4" strokeWidth="2" />
          {/* Glowing Cyan Optical Sensors */}
          <circle cx="52" cy="34" r="3.5" fill="#06b6d4" />
          <circle cx="68" cy="34" r="3.5" fill="#06b6d4" />

          {/* Boilerplate Body & Molten Furnace Heart */}
          <rect x="38" y="52" width="44" height="48" rx="6" fill="#334155" stroke="#b45309" strokeWidth="2.5" />
          <circle cx="60" cy="74" r="12" fill="#f97316" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="60" cy="74" r="6" fill="#fef08a" />

          {/* Pneumatic Drill / Piston Arm */}
          <rect x="84" y="56" width="16" height="36" rx="4" fill="#64748b" stroke="#000" strokeWidth="2" />
          <polygon points="92,94 84,115 100,115" fill="#06b6d4" stroke="#000" strokeWidth="1.5" />
        </svg>
      )}

      {/* ERA 8: Spec-Ops Mech Commando (Modern) */}
      {boundedEra === 8 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_14px_rgba(99,102,241,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Tactical Helmet with Quad Night Vision */}
          <rect x="44" y="22" width="32" height="26" rx="6" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
          <circle cx="50" cy="32" r="3" fill="#22c55e" />
          <circle cx="57" cy="32" r="3" fill="#22c55e" />
          <circle cx="64" cy="32" r="3" fill="#22c55e" />
          <circle cx="71" cy="32" r="3" fill="#22c55e" />

          {/* Exo-Skeleton Combat Rig */}
          <path d="M 38 52 L 82 52 L 76 105 L 44 105 Z" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
          <rect x="46" y="60" width="28" height="30" rx="3" fill="#334155" stroke="#22c55e" strokeWidth="1.5" />

          {/* High-Tech Vibro-Rifle */}
          <rect x="18" y="68" width="32" height="8" rx="2" fill="#020617" stroke="#6366f1" strokeWidth="1.5" />
          <line x1="12" y1="72" x2="52" y2="72" stroke="#6366f1" strokeWidth="2" />
        </svg>
      )}

      {/* ERA 9: Neural AI Cyber Sovereign (Digitalization) */}
      {boundedEra === 9 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_16px_rgba(249,115,22,0.8)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Hologram Floating Halo */}
          <ellipse cx="60" cy="16" rx="22" ry="6" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4 2" />

          {/* Cyber Samurai Visor Mask */}
          <polygon points="46,24 74,24 82,48 60,56 38,48" fill="#09090b" stroke="#f97316" strokeWidth="2" />
          {/* Neon Horizontal Visor Eye */}
          <line x1="44" y1="36" x2="76" y2="36" stroke="#f97316" strokeWidth="3" />

          {/* Nanoweave Exo-Armor */}
          <path d="M 40 54 L 80 54 L 72 108 L 48 108 Z" fill="#18181b" stroke="#f97316" strokeWidth="2" />
          <polygon points="60,60 70,75 60,90 50,75" fill="#f97316" opacity="0.3" stroke="#f97316" strokeWidth="1.5" />

          {/* Dual Plasma Beam Blades */}
          <line x1="26" y1="110" x2="16" y2="25" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="94" y1="110" x2="104" y2="25" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      )}

      {/* ERA 10: Void Singularity Celestial God (Space) */}
      {boundedEra === 10 && (
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full drop-shadow-[0_4px_20px_rgba(217,70,239,0.9)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-2' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Cosmic Planetary Halo Rings */}
          <ellipse cx="60" cy="65" rx="55" ry="16" fill="none" stroke="#d946ef" strokeWidth="3" strokeDasharray="6 3" />
          <ellipse cx="60" cy="65" rx="45" ry="10" fill="none" stroke="#a855f7" strokeWidth="1.5" />

          {/* Astral Celestial Crown */}
          <polygon points="40,22 48,6 60,18 72,6 80,22 60,30" fill="#fdf4ff" stroke="#d946ef" strokeWidth="2" />

          {/* Dark Matter Void Core Head */}
          <circle cx="60" cy="40" r="16" fill="#090514" stroke="#d946ef" strokeWidth="2.5" />
          {/* Glowing Cosmic Eyes */}
          <circle cx="54" cy="38" r="3.5" fill="#fdf4ff" />
          <circle cx="66" cy="38" r="3.5" fill="#fdf4ff" />

          {/* Astral Ethereal God Robes */}
          <path d="M 40 56 Q 60 48 80 56 L 90 120 Q 60 130 30 120 Z" fill="#2e1065" stroke="#d946ef" strokeWidth="2" />

          {/* Stellar Core Singularity */}
          <circle cx="60" cy="80" r="10" fill="#d946ef" opacity="0.8" />
          <circle cx="60" cy="80" r="4" fill="#ffffff" />
        </svg>
      )}
    </div>
  );
};
