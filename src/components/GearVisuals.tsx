import React from 'react';
import type { Equipment, CivilizationId } from '../hooks/useAutoForge';
import { RARITY_CONFIGS } from './RarityTheme';

// Helper to get era-appropriate color themes for any equipment item
export function getCivPalette(civilization?: CivilizationId) {
  switch (civilization) {
    case 'Ancient':
      return { plate: '#cd7f32', trim: '#38bdf8', cape: '#0284c7', cloth: '#1e293b' };
    case 'Antiquity':
      return { plate: '#b45309', trim: '#22c55e', cape: '#dc2626', cloth: '#451a03' };
    case 'Norman':
      return { plate: '#71717a', trim: '#eab308', cape: '#1e3a8a', cloth: '#27272a' };
    case 'Middle Ages':
      return { plate: '#3f3f46', trim: '#ec4899', cape: '#831843', cloth: '#18181b' };
    case 'Renaissance':
      return { plate: '#52525b', trim: '#c084fc', cape: '#6b21a8', cloth: '#3b0764' };
    case 'Industrial':
      return { plate: '#475569', trim: '#06b6d4', cape: '#0f766e', cloth: '#0f172a' };
    case 'Modern':
      return { plate: '#334155', trim: '#6366f1', cape: '#4338ca', cloth: '#020617' };
    case 'Digitalization':
      return { plate: '#18181b', trim: '#f97316', cape: '#c2410c', cloth: '#09090b' };
    case 'Space':
      return { plate: '#3b0764', trim: '#d946ef', cape: '#86198f', cloth: '#0f051d' };
    default: // Primitive
      return { plate: '#78350f', trim: '#a78bfa', cape: '#451a03', cloth: '#292524' };
  }
}

// Weapon shape archetypes — each weapon name maps to a distinct drawn shape on the character
export type WeaponShape =
  | 'dagger'
  | 'axe'
  | 'club'
  | 'spear'
  | 'sword'
  | 'scimitar'
  | 'khopesh'
  | 'mace'
  | 'halberd'
  | 'rapier'
  | 'rifle'
  | 'katana'
  | 'scythe'
  | 'vibroblade';

export function getWeaponShape(item: Equipment | undefined): WeaponShape {
  if (!item) return 'sword';
  const name = item.name.toLowerCase();

  if (name.includes('dagger') || name.includes('karambit')) return 'dagger';
  if (name.includes('hatchet') || name.includes('axe') || name.includes('battleaxe')) return 'axe';
  if (name.includes('club')) return 'club';
  if (name.includes('spear') || name.includes('pike') || name.includes('halberd')) {
    return name.includes('halberd') ? 'halberd' : 'spear';
  }
  if (name.includes('scimitar')) return 'scimitar';
  if (name.includes('khopesh')) return 'khopesh';
  if (name.includes('mace') || name.includes('smasher')) return 'mace';
  if (name.includes('rapier') || name.includes('estoc')) return 'rapier';
  if (name.includes('rifle') || name.includes('gun') || name.includes('bayonet')) return 'rifle';
  if (name.includes('katana') || name.includes('sabre') || name.includes('cleaver') || name.includes('machete')) return 'katana';
  if (name.includes('scythe')) return 'scythe';
  if (name.includes('vibroblade') || name.includes('energy') || name.includes('plasma') || name.includes('beam') || name.includes('singularity')) return 'vibroblade';
  return 'sword';
}

// Armor style archetypes
export type ArmorStyle =
  | 'tunic'
  | 'cuirass'
  | 'segmentata'
  | 'chainmail'
  | 'fullplate'
  | 'tabard'
  | 'exosuit'
  | 'nanosuit';

export function getArmorStyle(item: Equipment | undefined): ArmorStyle {
  if (!item) return 'tunic';
  const name = item.name.toLowerCase();
  const civ = item.civilization;

  if (civ === 'Primitive' || name.includes('tunic') || name.includes('cloak') || name.includes('hide') || name.includes('vest')) {
    return 'tunic';
  }
  if (civ === 'Antiquity' || name.includes('segmentata') || name.includes('spartan') || name.includes('centurion')) {
    return 'segmentata';
  }
  if (civ === 'Norman' || name.includes('chainmail') || name.includes('chain') || name.includes('hauberk')) {
    return 'chainmail';
  }
  if (civ === 'Middle Ages' || name.includes('full plate') || name.includes('fullplate') || name.includes('gothic') || name.includes('chivalric')) {
    return 'fullplate';
  }
  if (civ === 'Renaissance' || name.includes('tabard') || name.includes('musketeer') || name.includes('parade')) {
    return 'tabard';
  }
  if (civ === 'Industrial' || civ === 'Modern' || name.includes('exo') || name.includes('boiler') || name.includes('kevlar') || name.includes('ballistic')) {
    return 'exosuit';
  }
  if (civ === 'Digitalization' || civ === 'Space' || name.includes('nano') || name.includes('cyber') || name.includes('photon') || name.includes('godplate') || name.includes('void') || name.includes('astral')) {
    return 'nanosuit';
  }
  return 'cuirass';
}

// Helmet style archetypes
export type HelmetStyle =
  | 'headband'
  | 'pharaoh'
  | 'crested'
  | 'spangenhelm'
  | 'greathelm'
  | 'burgonet'
  | 'welder'
  | 'tactical'
  | 'cyber'
  | 'stellar';

export function getHelmetStyle(item: Equipment | undefined): HelmetStyle {
  if (!item) return 'headband';
  const name = item.name.toLowerCase();
  const civ = item.civilization;

  if (civ === 'Primitive' || name.includes('headband') || name.includes('skull cap') || name.includes('pelt hood') || name.includes('circlet')) return 'headband';
  if (civ === 'Ancient' || name.includes('nemes') || name.includes('anubis')) return 'pharaoh';
  if (civ === 'Antiquity' || name.includes('corinthian') || name.includes('galea') || name.includes('crest') || name.includes('laurel')) return 'crested';
  if (civ === 'Norman' || name.includes('spangenhelm') || name.includes('horned') || name.includes('coif')) return 'spangenhelm';
  if (civ === 'Middle Ages' || name.includes('great helm') || name.includes('sallet') || name.includes('barbute')) return 'greathelm';
  if (civ === 'Renaissance' || name.includes('burgonet') || name.includes('morion') || name.includes('duelist hat')) return 'burgonet';
  if (civ === 'Industrial' || name.includes('ironclad') || name.includes('pressure dome') || name.includes('welder') || name.includes('goggle')) return 'welder';
  if (civ === 'Modern' || name.includes('tactical') || name.includes('ballistic') || name.includes('night-vision') || name.includes('spec-ops')) return 'tactical';
  if (civ === 'Digitalization' || name.includes('cyber') || name.includes('neural') || name.includes('holo-visor') || name.includes('skullcap')) return 'cyber';
  if (civ === 'Space' || name.includes('void') || name.includes('stellar') || name.includes('astral') || name.includes('nebula')) return 'stellar';
  return 'headband';
}

// Boots style archetypes
export type BootsStyle =
  | 'wraps'
  | 'sandals'
  | 'greaves'
  | 'chausses'
  | 'sabatons'
  | 'riding'
  | 'tread'
  | 'assault'
  | 'hover'
  | 'warp';

export function getBootsStyle(item: Equipment | undefined): BootsStyle {
  if (!item) return 'wraps';
  const name = item.name.toLowerCase();
  const civ = item.civilization;

  if (civ === 'Primitive' || name.includes('foot-wraps') || name.includes('moccasins') || name.includes('shin-wraps')) return 'wraps';
  if (civ === 'Ancient' || name.includes('sandals') || name.includes('linen')) return 'sandals';
  if (civ === 'Antiquity' || name.includes('caligae') || name.includes('legion greaves') || name.includes('war-boots')) return 'greaves';
  if (civ === 'Norman' || name.includes('chausses') || name.includes('fjord')) return 'chausses';
  if (civ === 'Middle Ages' || name.includes('gothic sabatons') || name.includes('leg-plates')) return 'sabatons';
  if (civ === 'Renaissance' || name.includes('riding') || name.includes('milano sabatons')) return 'riding';
  if (civ === 'Industrial' || name.includes('tread') || name.includes('steam-piston')) return 'tread';
  if (civ === 'Modern' || name.includes('assault') || name.includes('jump-boots') || name.includes('mag-boots')) return 'assault';
  if (civ === 'Digitalization' || name.includes('hover') || name.includes('thrust') || name.includes('sprint-boots')) return 'hover';
  if (civ === 'Space' || name.includes('void warp') || name.includes('levitation') || name.includes('quantum')) return 'warp';
  return 'wraps';
}

// Gloves style archetypes
export type GlovesStyle =
  | 'wraps'
  | 'bracers'
  | 'manica'
  | 'riveted'
  | 'gauntlets'
  | 'dueling'
  | 'piston'
  | 'tactical'
  | 'cyber'
  | 'stellar';

export function getGlovesStyle(item: Equipment | undefined): GlovesStyle {
  if (!item) return 'wraps';
  const name = item.name.toLowerCase();
  const civ = item.civilization;

  if (civ === 'Primitive' || name.includes('wraps') || name.includes('mittens') || name.includes('knuckles')) return 'wraps';
  if (civ === 'Ancient' || name.includes('bracers') || name.includes('claw') || name.includes('fists')) return 'bracers';
  if (civ === 'Antiquity' || name.includes('manica') || name.includes('fist-guards') || name.includes('legion')) return 'manica';
  if (civ === 'Norman' || name.includes('chain mittens') || name.includes('riveted') || name.includes('grip-guards')) return 'riveted';
  if (civ === 'Middle Ages' || name.includes('gothic gauntlets') || name.includes('fist-plates')) return 'gauntlets';
  if (civ === 'Renaissance' || name.includes('silk') || name.includes('milano') || name.includes('parade')) return 'dueling';
  if (civ === 'Industrial' || name.includes('piston') || name.includes('work-gloves') || name.includes('ironclad grips')) return 'piston';
  if (civ === 'Modern' || name.includes('tactical grip') || name.includes('knuckle-guards') || name.includes('nano-fists')) return 'tactical';
  if (civ === 'Digitalization' || name.includes('cyber nano') || name.includes('plasma knuckles') || name.includes('holo-grip')) return 'cyber';
  if (civ === 'Space' || name.includes('void star') || name.includes('gravity fists') || name.includes('quantum gloves')) return 'stellar';
  return 'wraps';
}

interface WeaponInHandProps {
  item: Equipment;
  rarityColor: string;
  glowDev: number;
  uid: string;
}

// Draws the actual weapon shape in the character's right hand (origin around x=80, y=66)
export const WeaponInHand: React.FC<WeaponInHandProps> = ({ item, rarityColor, glowDev, uid }) => {
  const shape = getWeaponShape(item);
  const swordId = `wblade-${uid}`;
  const glowId = `wglow-${uid}`;
  const metalId = `wmetal-${uid}`;

  return (
    <g>
      <defs>
        <linearGradient id={swordId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor={rarityColor} />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id={metalId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={glowDev} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* HANDLE (shared base for all) */}
      <rect x="76" y="64" width="8" height="10" rx="2" fill="#78350f" stroke="#000" strokeWidth="1.2" />

      {shape === 'dagger' && (
        <g filter={`url(#${glowId})`}>
          <path d="M 77 64 L 79 44 L 83 44 L 85 64 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.2" />
          <rect x="73" y="62" width="16" height="3" rx="1" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
        </g>
      )}

      {shape === 'axe' && (
        <g filter={`url(#${glowId})`}>
          <rect x="78" y="30" width="5" height="36" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.2" />
          <path d="M 83 32 Q 100 36 98 52 Q 90 48 83 50 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 78 34 Q 64 38 66 50 Q 72 47 78 48 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.2" />
        </g>
      )}

      {shape === 'club' && (
        <g filter={`url(#${glowId})`}>
          <rect x="78" y="52" width="6" height="14" fill="#78350f" stroke="#000" strokeWidth="1" />
          <ellipse cx="81" cy="42" rx="9" ry="13" fill="#e7e5e4" stroke="#000" strokeWidth="1.5" />
          <circle cx="77" cy="38" r="2" fill="#a8a29e" />
          <circle cx="85" cy="44" r="2.2" fill="#a8a29e" />
          <circle cx="80" cy="48" r="1.8" fill="#a8a29e" />
        </g>
      )}

      {shape === 'spear' && (
        <g filter={`url(#${glowId})`}>
          <rect x="79" y="8" width="4" height="58" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1" />
          <path d="M 81 0 L 76 12 L 81 9 L 86 12 Z" fill={rarityColor} stroke="#000" strokeWidth="1.2" />
          <rect x="77" y="58" width="8" height="3" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
        </g>
      )}

      {shape === 'halberd' && (
        <g filter={`url(#${glowId})`}>
          <rect x="79" y="6" width="4" height="60" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1" />
          <path d="M 83 14 Q 100 18 96 34 Q 88 30 83 32 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.4" />
          <path d="M 81 2 L 77 12 L 81 9 L 85 12 Z" fill={rarityColor} stroke="#000" strokeWidth="1.2" />
        </g>
      )}

      {shape === 'scimitar' && (
        <g filter={`url(#${glowId})`}>
          <path d="M 78 64 Q 66 50 70 28 Q 74 14 88 10 Q 80 24 82 40 Q 84 52 86 62 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.4" />
          <rect x="73" y="62" width="14" height="3" rx="1" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
        </g>
      )}

      {shape === 'khopesh' && (
        <g filter={`url(#${glowId})`}>
          <path d="M 78 64 Q 62 58 62 40 Q 62 26 76 20 Q 68 32 70 44 Q 72 56 84 62 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.4" />
          <rect x="74" y="62" width="12" height="3" rx="1" fill="#38bdf8" stroke="#000" strokeWidth="0.8" />
        </g>
      )}

      {shape === 'mace' && (
        <g filter={`url(#${glowId})`}>
          <rect x="79" y="46" width="4" height="20" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1" />
          <circle cx="81" cy="38" r="10" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <rect x="70" y="36" width="5" height="5" fill="#94a3b8" stroke="#000" strokeWidth="0.8" />
          <rect x="87" y="36" width="5" height="5" fill="#94a3b8" stroke="#000" strokeWidth="0.8" />
          <rect x="78" y="27" width="5" height="5" fill="#94a3b8" stroke="#000" strokeWidth="0.8" />
          <rect x="78" y="45" width="5" height="5" fill="#94a3b8" stroke="#000" strokeWidth="0.8" />
        </g>
      )}

      {shape === 'rapier' && (
        <g filter={`url(#${glowId})`}>
          <path d="M 80 64 L 79 6 L 80 2 L 81 6 L 82 64 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1" />
          {/* Ornate swept hilt */}
          <circle cx="80" cy="62" r="6" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <path d="M 74 60 Q 80 54 86 60" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        </g>
      )}

      {shape === 'rifle' && (
        <g filter={`url(#${glowId})`}>
          <rect x="70" y="52" width="26" height="6" rx="2" fill="#334155" stroke="#000" strokeWidth="1.2" />
          <rect x="92" y="50" width="10" height="4" rx="1" fill={rarityColor} stroke="#000" strokeWidth="1" />
          <rect x="74" y="58" width="6" height="10" rx="1" fill="#78350f" stroke="#000" strokeWidth="1" />
          <rect x="80" y="46" width="8" height="4" rx="1" fill="#1e293b" stroke="#000" strokeWidth="0.8" />
          <circle cx="95" cy="52" r="1.5" fill={rarityColor} className="animate-pulse" />
        </g>
      )}

      {shape === 'katana' && (
        <g filter={`url(#${glowId})`}>
          <path d="M 78 64 Q 70 44 76 20 Q 79 8 86 4 Q 82 20 82 40 Q 82 54 84 62 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.3" />
          {/* Round tsuba guard */}
          <circle cx="80" cy="63" r="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />
        </g>
      )}

      {shape === 'scythe' && (
        <g filter={`url(#${glowId})`}>
          <rect x="79" y="10" width="4" height="56" fill="#1e1b4b" stroke="#000" strokeWidth="1" />
          <path d="M 83 12 Q 102 16 100 36 Q 94 26 83 24 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.5" />
          <circle cx="81" cy="10" r="2" fill={rarityColor} className="animate-pulse" />
        </g>
      )}

      {shape === 'vibroblade' && (
        <g filter={`url(#${glowId})`}>
          <rect x="77" y="60" width="8" height="6" rx="1" fill="#334155" stroke="#000" strokeWidth="1" />
          <path d="M 78 60 L 77 8 L 85 8 L 84 60 Z" fill={rarityColor} opacity="0.85" stroke="#fff" strokeWidth="0.8" />
          <path d="M 80 58 L 80 12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="81" cy="63" r="2" fill={rarityColor} className="animate-pulse" />
        </g>
      )}

      {shape === 'sword' && (
        <g filter={`url(#${glowId})`}>
          {/* Crossguard & Pommel */}
          <rect x="72" y="62" width="18" height="3.5" rx="1" fill="#f59e0b" stroke="#000" strokeWidth="1" />
          <circle cx="81" cy="76" r="2.5" fill="#f59e0b" stroke="#000" strokeWidth="1" />
          {/* Straight Blade */}
          <path d="M 78 62 L 80 8 L 82 8 L 84 62 Z" fill={`url(#${swordId})`} stroke="#000" strokeWidth="1.4" />
          <line x1="81" y1="60" x2="81" y2="12" stroke="#ffffff" strokeWidth="1" />
        </g>
      )}
    </g>
  );
};

interface ArmorOutfitProps {
  item: Equipment;
  rarityColor: string;
  plateColor: string;
  trimColor: string;
  uid: string;
}

// Draws the actual armor outfit on the torso (replaces the generic chestplate)
export const ArmorOutfit: React.FC<ArmorOutfitProps> = ({ item, rarityColor, plateColor, uid }) => {
  const style = getArmorStyle(item);
  const metalId = `ametal-${uid}`;

  return (
    <g>
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor={plateColor} />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Under-tunic base (always present) */}
      <path d="M 40 50 L 70 50 L 74 95 L 36 95 Z" fill="#292524" stroke="#000" strokeWidth="2" />

      {style === 'tunic' && (
        <g>
          {/* Cloth tunic with stitching & fur collar */}
          <path d="M 40 50 L 70 50 L 74 95 L 36 95 Z" fill={plateColor} stroke="#000" strokeWidth="2" />
          <path d="M 42 54 L 68 54 M 42 62 L 68 62 M 42 70 L 68 70" stroke="#000" strokeWidth="0.8" opacity="0.4" />
          {/* Fur collar */}
          <path d="M 40 50 Q 55 44 70 50 L 68 56 Q 55 50 42 56 Z" fill="#d6d3d1" stroke="#000" strokeWidth="1.2" />
          <circle cx="46" cy="52" r="1.5" fill="#f5f5f4" />
          <circle cx="55" cy="50" r="1.5" fill="#f5f5f4" />
          <circle cx="64" cy="52" r="1.5" fill="#f5f5f4" />
          {/* Belt rope */}
          <rect x="38" y="85" width="34" height="5" rx="2" fill="#a16207" stroke="#000" strokeWidth="1" />
        </g>
      )}

      {style === 'cuirass' && (
        <g>
          {/* Classic metal chestplate */}
          <path d="M 42 48 L 68 48 L 65 88 L 55 93 L 45 88 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="2" />
          {/* Center ridge */}
          <line x1="55" y1="50" x2="55" y2="88" stroke="#000" strokeWidth="1" opacity="0.5" />
          {/* Rivets */}
          <circle cx="46" cy="52" r="1.5" fill="#cbd5e1" />
          <circle cx="64" cy="52" r="1.5" fill="#cbd5e1" />
          <circle cx="47" cy="84" r="1.5" fill="#cbd5e1" />
          <circle cx="63" cy="84" r="1.5" fill="#cbd5e1" />
          {/* Rarity trim */}
          <path d="M 42 48 L 68 48 L 65 88 L 55 93 L 45 88 Z" fill="none" stroke={rarityColor} strokeWidth="1.5" opacity="0.9" />
          <rect x="38" y="85" width="34" height="6" rx="2" fill="#78350f" stroke="#000" strokeWidth="1.5" />
        </g>
      )}

      {style === 'segmentata' && (
        <g>
          {/* Roman horizontal bands */}
          <path d="M 42 48 L 68 48 L 69 58 L 41 58 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 41 60 L 69 60 L 70 70 L 40 70 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 40 72 L 70 72 L 71 82 L 39 82 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 39 84 L 71 84 L 70 92 L 40 92 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          {/* Leather straps */}
          <path d="M 55 48 L 55 92" stroke="#78350f" strokeWidth="2.5" />
          <rect x="38" y="85" width="34" height="6" rx="2" fill="#78350f" stroke="#000" strokeWidth="1.5" />
        </g>
      )}

      {style === 'chainmail' && (
        <g>
          {/* Chainmail texture body */}
          <path d="M 40 48 L 70 48 L 74 95 L 36 95 Z" fill="#475569" stroke="#000" strokeWidth="2" />
          {/* Chain ring pattern */}
          {[0, 1, 2, 3, 4].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={44 + col * 8 + (row % 2 === 0 ? 0 : 4)}
                cy={54 + row * 8}
                r="2.6"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.8"
              />
            ))
          )}
          {/* Rarity-trimmed edge */}
          <path d="M 40 48 L 70 48 L 74 95 L 36 95 Z" fill="none" stroke={rarityColor} strokeWidth="1.5" opacity="0.85" />
          <rect x="38" y="85" width="34" height="6" rx="2" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
        </g>
      )}

      {style === 'fullplate' && (
        <g>
          {/* Gothic full plate with layered fauld */}
          <path d="M 41 47 L 69 47 L 66 86 L 55 92 L 44 86 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="2" />
          {/* Gothic fluting lines */}
          <path d="M 48 50 L 47 84 M 55 50 L 55 88 M 62 50 L 63 84" stroke="#000" strokeWidth="0.8" opacity="0.5" />
          {/* Pauldron ridges */}
          <path d="M 41 47 L 69 47 L 68 53 L 42 53 Z" fill={rarityColor} opacity="0.35" stroke="#000" strokeWidth="1" />
          {/* Fauld skirt plates */}
          <path d="M 44 86 L 50 86 L 49 96 L 44 95 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.2" />
          <path d="M 52 88 L 58 88 L 58 97 L 52 97 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.2" />
          <path d="M 60 86 L 66 86 L 66 95 L 61 96 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.2" />
          <path d="M 41 47 L 69 47 L 66 86 L 55 92 L 44 86 Z" fill="none" stroke={rarityColor} strokeWidth="1.8" opacity="0.95" />
        </g>
      )}

      {style === 'tabard' && (
        <g>
          {/* Metal chest under cloth tabard */}
          <path d="M 42 48 L 68 48 L 65 88 L 55 93 L 45 88 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="2" />
          {/* Renaissance cloth tabard overlay */}
          <path d="M 48 48 L 62 48 L 60 90 L 50 90 Z" fill={plateColor} stroke="#000" strokeWidth="1.5" opacity="0.95" />
          <path d="M 48 48 L 62 48 L 61 56 L 49 56 Z" fill={rarityColor} opacity="0.5" stroke="#000" strokeWidth="1" />
          {/* Gold buttons */}
          <circle cx="55" cy="62" r="1.5" fill="#fbbf24" />
          <circle cx="55" cy="70" r="1.5" fill="#fbbf24" />
          <circle cx="55" cy="78" r="1.5" fill="#fbbf24" />
          <rect x="38" y="85" width="34" height="6" rx="2" fill="#78350f" stroke="#000" strokeWidth="1.5" />
        </g>
      )}

      {style === 'exosuit' && (
        <g>
          {/* Industrial boiler / tactical vest */}
          <path d="M 40 48 L 70 48 L 74 95 L 36 95 Z" fill={plateColor} stroke="#000" strokeWidth="2" />
          {/* Riveted panels */}
          <rect x="44" y="52" width="10" height="14" rx="1" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          <rect x="56" y="52" width="10" height="14" rx="1" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          <rect x="44" y="70" width="22" height="12" rx="1" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          {/* Rivets */}
          <circle cx="46" cy="54" r="1" fill="#94a3b8" />
          <circle cx="58" cy="54" r="1" fill="#94a3b8" />
          <circle cx="46" cy="72" r="1" fill="#94a3b8" />
          <circle cx="64" cy="72" r="1" fill="#94a3b8" />
          {/* Pressure gauge */}
          <circle cx="55" cy="76" r="3" fill="#fbbf24" stroke="#000" strokeWidth="0.8" />
          <line x1="55" y1="76" x2="57" y2="74" stroke="#dc2626" strokeWidth="1" />
          <path d="M 40 48 L 70 48 L 74 95 L 36 95 Z" fill="none" stroke={rarityColor} strokeWidth="1.5" opacity="0.8" />
        </g>
      )}

      {style === 'nanosuit' && (
        <g>
          {/* Sleek futuristic suit with glowing circuit lines */}
          <path d="M 40 48 L 70 48 L 74 95 L 36 95 Z" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.8" />
          {/* Glowing circuit traces */}
          <path d="M 46 52 L 46 66 L 52 72 M 64 52 L 64 66 L 58 72 M 55 50 L 55 88" stroke={rarityColor} strokeWidth="1.2" fill="none" opacity="0.9" />
          <circle cx="46" cy="66" r="1.5" fill={rarityColor} className="animate-pulse" />
          <circle cx="64" cy="66" r="1.5" fill={rarityColor} className="animate-pulse" />
          {/* Energy core */}
          <circle cx="55" cy="62" r="4" fill={rarityColor} opacity="0.9" stroke="#fff" strokeWidth="0.8" className="animate-pulse" />
          <circle cx="55" cy="62" r="6.5" fill="none" stroke={rarityColor} strokeWidth="0.8" opacity="0.5" />
          {/* Hex panel accents */}
          <path d="M 42 80 L 46 78 L 50 80 L 50 85 L 46 87 L 42 85 Z" fill="none" stroke={rarityColor} strokeWidth="0.8" opacity="0.6" />
          <path d="M 60 80 L 64 78 L 68 80 L 68 85 L 64 87 L 60 85 Z" fill="none" stroke={rarityColor} strokeWidth="0.8" opacity="0.6" />
        </g>
      )}
    </g>
  );
};

interface HelmetProps {
  item: Equipment;
  rarityColor: string;
  plateColor: string;
  uid: string;
}

export const ArmorHelmet: React.FC<HelmetProps> = ({ item, rarityColor, plateColor, uid }) => {
  const style = getHelmetStyle(item);
  const metalId = `hmetal-${uid}`;

  return (
    <g>
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor={plateColor} />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {style === 'headband' && (
        <g>
          {/* Bare head with primitive headband */}
          <circle cx="55" cy="35" r="14" fill="#fed7aa" stroke="#000" strokeWidth="2" />
          <circle cx="59" cy="36" r="2.5" fill="#0f172a" />
          <circle cx="60" cy="35" r="0.8" fill="#fff" />
          <path d="M 56 32 Q 60 30 63 33" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 42 26 Q 55 20 68 26" stroke="#e7e5e4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="55" cy="23" r="2.5" fill={rarityColor} stroke="#000" strokeWidth="0.8" />
          <path d="M 44 24 Q 42 16 48 18 Z" fill="#292524" />
          <path d="M 66 24 Q 68 16 62 18 Z" fill="#292524" />
        </g>
      )}

      {style === 'pharaoh' && (
        <g>
          {/* Ancient Egyptian Pharaoh Nemes & Circlet */}
          <path d="M 37 36 Q 37 16 55 16 Q 73 16 73 36 L 76 46 L 68 44 L 66 38 L 44 38 L 42 44 L 34 46 Z" fill="#38bdf8" stroke="#000" strokeWidth="1.8" />
          <path d="M 40 24 L 70 24 M 39 30 L 71 30" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="55" cy="35" r="11" fill="#fed7aa" stroke="#000" strokeWidth="1.2" />
          <circle cx="59" cy="35" r="2" fill="#0f172a" />
          <circle cx="55" cy="18" r="2.5" fill={rarityColor} stroke="#000" strokeWidth="0.8" />
        </g>
      )}

      {style === 'crested' && (
        <g>
          {/* Antiquity Spartan / Roman crested galea */}
          <path d="M 40 34 Q 40 18 55 18 Q 70 18 70 34 L 68 42 L 62 42 L 62 36 L 48 36 L 48 42 L 42 42 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="2" />
          <path d="M 48 30 L 62 30 L 60 36 L 50 36 Z" fill="#0f172a" />
          <path d="M 52 18 Q 55 4 58 18 Z" fill="#dc2626" stroke="#000" strokeWidth="1.5" />
          <path d="M 46 18 Q 55 0 64 18" stroke={rarityColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )}

      {style === 'spangenhelm' && (
        <g>
          {/* Norman / Viking conical spangenhelm */}
          <path d="M 40 36 Q 42 16 55 12 Q 68 16 70 36 L 68 42 L 42 42 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="2" />
          <path d="M 55 12 L 55 36" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 40 34 L 70 34" stroke="#fbbf24" strokeWidth="2" />
          <rect x="53" y="32" width="4" height="10" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1" />
          <circle cx="48" cy="35" r="2" fill="#0f172a" />
          <circle cx="62" cy="35" r="2" fill="#0f172a" />
          <circle cx="55" cy="12" r="2" fill={rarityColor} />
        </g>
      )}

      {style === 'greathelm' && (
        <g>
          {/* Middle Ages Great Helm bucket */}
          <path d="M 39 36 Q 38 14 55 13 Q 72 14 71 36 L 71 42 L 39 42 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="2" />
          <rect x="53" y="26" width="4" height="12" fill="#0f172a" />
          <rect x="48" y="30" width="14" height="4" fill="#0f172a" />
          <path d="M 55 13 L 55 4" stroke={rarityColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 50 14 Q 55 8 60 14" fill={rarityColor} stroke="#000" strokeWidth="1" />
          <path d="M 39 36 L 71 36" stroke="#fbbf24" strokeWidth="1.2" opacity="0.7" />
        </g>
      )}

      {style === 'burgonet' && (
        <g>
          {/* Renaissance Burgonet with feathered plume */}
          <path d="M 41 34 Q 41 18 55 18 Q 69 18 69 34 L 67 40 L 43 40 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="2" />
          <path d="M 42 28 L 68 28 L 66 24 L 44 24 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.2" />
          <path d="M 47 31 L 66 31 L 64 36 L 49 36 Z" fill="#0f172a" stroke="#000" strokeWidth="1" />
          <path d="M 62 18 Q 72 4 78 10 Q 70 14 64 20 Z" fill={rarityColor} stroke="#000" strokeWidth="1.4" />
        </g>
      )}

      {style === 'welder' && (
        <g>
          {/* Industrial Welder Mask & Steam Goggles */}
          <path d="M 40 34 Q 40 17 55 17 Q 70 17 70 34 L 69 40 L 41 40 Z" fill={plateColor} stroke="#000" strokeWidth="2" />
          <rect x="44" y="27" width="22" height="8" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
          <rect x="46" y="29" width="18" height="2" fill={rarityColor} opacity="0.8" />
          <circle cx="55" cy="20" r="3" fill="#fbbf24" stroke="#000" strokeWidth="1" className="animate-pulse" />
        </g>
      )}

      {style === 'tactical' && (
        <g>
          {/* Modern Tactical Helmet with Night-Vision Rig */}
          <path d="M 40 34 Q 40 17 55 17 Q 70 17 70 34 L 69 40 L 41 40 Z" fill="#1e293b" stroke="#000" strokeWidth="2" />
          <rect x="44" y="27" width="22" height="6" rx="1" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          <circle cx="49" cy="30" r="2" fill="#22c55e" className="animate-pulse" />
          <circle cx="61" cy="30" r="2" fill="#22c55e" className="animate-pulse" />
          <path d="M 42 20 L 55 16 L 68 20" stroke={rarityColor} strokeWidth="1.5" fill="none" />
        </g>
      )}

      {style === 'cyber' && (
        <g>
          {/* Digitalization Cyber Visor */}
          <path d="M 40 34 Q 40 16 55 16 Q 70 16 70 34 L 69 40 L 41 40 Z" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.8" />
          <path d="M 44 28 L 66 28 L 65 34 L 45 34 Z" fill={rarityColor} opacity="0.9" />
          <path d="M 45 30 L 65 30" stroke="#fff" strokeWidth="1" opacity="0.9" />
          <line x1="66" y1="18" x2="70" y2="8" stroke={rarityColor} strokeWidth="1.5" />
          <circle cx="70" cy="8" r="1.8" fill={rarityColor} className="animate-pulse" />
        </g>
      )}

      {style === 'stellar' && (
        <g>
          {/* Space Astral Halo Crown */}
          <path d="M 40 34 Q 40 14 55 14 Q 70 14 70 34 L 69 40 L 41 40 Z" fill="#1e1b4b" stroke={rarityColor} strokeWidth="2" />
          <ellipse cx="55" cy="12" rx="20" ry="6" fill="none" stroke={rarityColor} strokeWidth="1.5" opacity="0.9" className="animate-pulse" />
          <circle cx="55" cy="6" r="2" fill="#ffffff" />
          <path d="M 44 28 L 66 28 L 65 34 L 45 34 Z" fill="#38bdf8" opacity="0.9" />
        </g>
      )}
    </g>
  );
};

interface BootsProps {
  item: Equipment;
  rarityColor: string;
  plateColor: string;
  uid: string;
}

export const ArmorBoots: React.FC<BootsProps> = ({ item, rarityColor, plateColor, uid }) => {
  const style = getBootsStyle(item);
  const metalId = `bmetal-${uid}`;

  return (
    <g>
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor={plateColor} />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {style === 'wraps' && (
        <g>
          <path d="M 32 118 L 50 118 L 49 126 L 31 126 Z" fill="#a16207" stroke="#000" strokeWidth="1.2" />
          <path d="M 57 118 L 75 118 L 74 126 L 56 126 Z" fill="#a16207" stroke="#000" strokeWidth="1.2" />
          <path d="M 33 121 L 49 121 M 58 121 L 74 121" stroke="#78350f" strokeWidth="1.5" />
        </g>
      )}

      {style === 'sandals' && (
        <g>
          <path d="M 32 120 L 50 120 L 49 127 L 31 127 Z" fill="#b45309" stroke="#000" strokeWidth="1.2" />
          <path d="M 57 120 L 75 120 L 74 127 L 56 127 Z" fill="#b45309" stroke="#000" strokeWidth="1.2" />
          <circle cx="41" cy="120" r="1.5" fill={rarityColor} />
          <circle cx="66" cy="120" r="1.5" fill={rarityColor} />
        </g>
      )}

      {style === 'greaves' && (
        <g>
          <path d="M 32 112 L 50 112 L 50 124 L 30 126 L 30 118 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 58 112 L 76 112 L 78 118 L 78 126 L 58 124 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 40 114 L 40 122 M 66 114 L 66 122" stroke="#000" strokeWidth="1" opacity="0.5" />
          <path d="M 32 112 L 50 112 L 50 124 L 30 126 L 30 118 Z" fill="none" stroke={rarityColor} strokeWidth="1" opacity="0.8" />
          <path d="M 58 112 L 76 112 L 78 118 L 78 126 L 58 124 Z" fill="none" stroke={rarityColor} strokeWidth="1" opacity="0.8" />
        </g>
      )}

      {style === 'chausses' && (
        <g>
          <path d="M 32 110 L 50 110 L 50 124 L 30 126 L 30 118 Z" fill="#475569" stroke="#000" strokeWidth="1.5" />
          <path d="M 58 110 L 76 110 L 78 118 L 78 126 L 58 124 Z" fill="#475569" stroke="#000" strokeWidth="1.5" />
          <circle cx="38" cy="116" r="1.2" fill="none" stroke="#94a3b8" strokeWidth="0.7" />
          <circle cx="66" cy="116" r="1.2" fill="none" stroke="#94a3b8" strokeWidth="0.7" />
        </g>
      )}

      {style === 'sabatons' && (
        <g>
          <path d="M 32 110 L 50 110 L 52 118 L 54 124 L 26 126 L 29 116 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 58 110 L 76 110 L 79 116 L 82 126 L 54 124 L 56 118 Z" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 31 116 L 52 116 M 59 116 L 80 116" stroke="#000" strokeWidth="1" opacity="0.6" />
          <path d="M 32 110 L 50 110 L 52 118 L 54 124 L 26 126 L 29 116 Z" fill="none" stroke={rarityColor} strokeWidth="1.2" opacity="0.9" />
          <path d="M 58 110 L 76 110 L 79 116 L 82 126 L 54 124 L 56 118 Z" fill="none" stroke={rarityColor} strokeWidth="1.2" opacity="0.9" />
        </g>
      )}

      {style === 'riding' && (
        <g>
          <path d="M 32 108 L 50 108 L 50 124 L 29 125 L 30 114 Z" fill="#3f2715" stroke="#000" strokeWidth="1.5" />
          <path d="M 58 108 L 76 108 L 78 114 L 79 125 L 58 124 Z" fill="#3f2715" stroke="#000" strokeWidth="1.5" />
          <rect x="39" y="115" width="4" height="3" fill="#fbbf24" stroke="#000" strokeWidth="0.6" />
          <rect x="65" y="115" width="4" height="3" fill="#fbbf24" stroke="#000" strokeWidth="0.6" />
        </g>
      )}

      {style === 'tread' && (
        <g>
          <path d="M 31 112 L 50 112 L 51 124 L 27 126 L 29 118 Z" fill={plateColor} stroke="#000" strokeWidth="1.5" />
          <path d="M 57 112 L 76 112 L 79 118 L 81 126 L 57 124 Z" fill={plateColor} stroke="#000" strokeWidth="1.5" />
          <circle cx="35" cy="118" r="1.2" fill={rarityColor} className="animate-pulse" />
          <circle cx="73" cy="118" r="1.2" fill={rarityColor} className="animate-pulse" />
        </g>
      )}

      {style === 'assault' && (
        <g>
          <path d="M 31 112 L 50 112 L 50 124 L 28 126 L 30 118 Z" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
          <path d="M 57 112 L 76 112 L 78 118 L 80 126 L 58 124 Z" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
          <path d="M 28 124 L 50 124 M 58 124 L 80 124" stroke={rarityColor} strokeWidth="2" />
        </g>
      )}

      {style === 'hover' && (
        <g>
          <path d="M 32 110 L 50 110 L 50 122 L 29 124 L 30 116 Z" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.3" />
          <path d="M 58 110 L 76 110 L 78 116 L 79 124 L 58 122 Z" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.3" />
          <path d="M 30 123 L 51 123" stroke={rarityColor} strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
          <path d="M 57 123 L 78 123" stroke={rarityColor} strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
        </g>
      )}

      {style === 'warp' && (
        <g>
          <path d="M 32 108 L 50 108 L 50 122 L 28 124 L 30 114 Z" fill="#1e1b4b" stroke={rarityColor} strokeWidth="1.5" />
          <path d="M 58 108 L 76 108 L 78 114 L 80 124 L 58 122 Z" fill="#1e1b4b" stroke={rarityColor} strokeWidth="1.5" />
          <ellipse cx="40" cy="124" rx="10" ry="3" fill={rarityColor} opacity="0.6" className="animate-pulse" />
          <ellipse cx="68" cy="124" rx="10" ry="3" fill={rarityColor} opacity="0.6" className="animate-pulse" />
        </g>
      )}
    </g>
  );
};

interface GlovesProps {
  item: Equipment;
  rarityColor: string;
  plateColor: string;
  uid: string;
}

export const ArmorGloves: React.FC<GlovesProps> = ({ item, rarityColor, plateColor, uid }) => {
  const style = getGlovesStyle(item);
  const metalId = `gmetal-${uid}`;

  return (
    <g>
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor={plateColor} />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {style === 'wraps' && (
        <g>
          <circle cx="80" cy="68" r="5" fill="#a16207" stroke="#000" strokeWidth="1.2" />
          <circle cx="36" cy="70" r="3.5" fill="#a16207" stroke="#000" strokeWidth="1" />
        </g>
      )}

      {(style === 'bracers' || style === 'manica') && (
        <g>
          <circle cx="80" cy="68" r="6" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <circle cx="77" cy="70" r="1" fill={rarityColor} />
          <circle cx="83" cy="70" r="1" fill={rarityColor} />
          <circle cx="36" cy="70" r="4" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.2" />
        </g>
      )}

      {style === 'riveted' && (
        <g>
          <circle cx="80" cy="68" r="5.5" fill="#475569" stroke="#000" strokeWidth="1.3" />
          <circle cx="78" cy="66" r="1" fill="#fbbf24" />
          <circle cx="82" cy="68" r="1" fill="#fbbf24" />
          <circle cx="36" cy="70" r="4" fill="#475569" stroke="#000" strokeWidth="1" />
        </g>
      )}

      {style === 'gauntlets' && (
        <g>
          <circle cx="80" cy="68" r="6.5" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.5" />
          <path d="M 74 64 L 86 64 M 74 68 L 86 68 M 75 72 L 85 72" stroke="#000" strokeWidth="0.8" opacity="0.6" />
          <path d="M 73 62 L 87 62" stroke={rarityColor} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="36" cy="70" r="4.5" fill={`url(#${metalId})`} stroke="#000" strokeWidth="1.3" />
        </g>
      )}

      {style === 'dueling' && (
        <g>
          <circle cx="80" cy="68" r="5" fill="#1e293b" stroke="#000" strokeWidth="1.3" />
          <path d="M 75 62 Q 80 58 85 62" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
          <circle cx="36" cy="70" r="3.5" fill="#1e293b" stroke="#000" strokeWidth="1" />
        </g>
      )}

      {style === 'piston' && (
        <g>
          <circle cx="80" cy="68" r="6" fill={plateColor} stroke="#000" strokeWidth="1.5" />
          <rect x="76" y="60" width="8" height="4" rx="1" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
          <circle cx="84" cy="72" r="1.3" fill={rarityColor} className="animate-pulse" />
          <circle cx="36" cy="70" r="4.5" fill={plateColor} stroke="#000" strokeWidth="1.2" />
        </g>
      )}

      {style === 'tactical' && (
        <g>
          <circle cx="80" cy="68" r="5.5" fill="#1e293b" stroke="#000" strokeWidth="1.3" />
          <circle cx="80" cy="68" r="2" fill={rarityColor} />
          <circle cx="36" cy="70" r="4" fill="#1e293b" stroke="#000" strokeWidth="1" />
        </g>
      )}

      {(style === 'cyber' || style === 'stellar') && (
        <g>
          <circle cx="80" cy="68" r="5.5" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.3" />
          <circle cx="80" cy="68" r="2" fill={rarityColor} opacity="0.8" className="animate-pulse" />
          <circle cx="36" cy="70" r="4" fill="#0c0a20" stroke={rarityColor} strokeWidth="1" />
        </g>
      )}
    </g>
  );
};

// =========================================================================
// STANDALONE GEAR ITEM SPRITE
// Renders the exact visual representation of any equipment item (Weapons,
// Helmets, Armors, Gloves, Boots) with matching civilization style, colors,
// and rarity glow effects just like shown on the hero.
// =========================================================================

export interface GearItemVisualProps {
  item: Equipment;
  className?: string;
  glow?: boolean;
}

export const GearItemVisual: React.FC<GearItemVisualProps> = ({ item, className = 'w-full h-full', glow = true }) => {
  const uid = React.useId().replace(/[:]/g, '');
  const colors = getCivPalette(item.civilization);
  const rarityColor = RARITY_CONFIGS[item.rarity]?.color || '#f59e0b';
  const isMythic = item.rarity === 'Mythic';
  const isLegendary = item.rarity === 'Legendary';

  const bladeGradId = `itemBlade-${uid}`;
  const metalGradId = `itemMetal-${uid}`;
  const glowFilterId = `itemGlow-${uid}`;

  const weaponShape = getWeaponShape(item);
  const armorStyle = getArmorStyle(item);
  const helmetStyle = getHelmetStyle(item);
  const glovesStyle = getGlovesStyle(item);
  const bootsStyle = getBootsStyle(item);

  return (
    <svg
      viewBox="0 0 64 64"
      className={`select-none overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={bladeGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor={rarityColor} />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id={metalGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor={colors.plate} />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={glow ? (isMythic ? 2.5 : isLegendary ? 1.8 : 1.2) : 0.5} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* RENDER BY SLOT */}
      {item.slot === 'weapon' && (
        <g filter={glow ? `url(#${glowFilterId})` : undefined}>
          {weaponShape === 'dagger' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30" y="38" width="4" height="18" rx="1.5" fill="#78350f" stroke="#000" strokeWidth="1" />
              <circle cx="32" cy="56" r="3" fill="#f59e0b" stroke="#000" strokeWidth="1" />
              <rect x="23" y="36" width="18" height="4" rx="1.5" fill="#f59e0b" stroke="#000" strokeWidth="1" />
              <path d="M 28 36 L 32 8 L 36 36 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.2" />
              <line x1="32" y1="36" x2="32" y2="12" stroke="#fff" strokeWidth="1" opacity="0.8" />
            </g>
          )}

          {weaponShape === 'axe' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30" y="8" width="4" height="50" rx="1.5" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1" />
              <path d="M 34 14 Q 54 18 52 36 Q 42 32 34 34 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.4" />
              <path d="M 30 16 Q 16 20 18 32 Q 24 28 30 30 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.2" />
              <rect x="28" y="12" width="8" height="4" rx="1" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
            </g>
          )}

          {weaponShape === 'club' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30" y="32" width="4" height="24" rx="1.5" fill="#78350f" stroke="#000" strokeWidth="1" />
              <ellipse cx="32" cy="20" rx="10" ry="15" fill="#e7e5e4" stroke="#000" strokeWidth="1.5" />
              <circle cx="27" cy="15" r="2.2" fill="#a8a29e" />
              <circle cx="36" cy="22" r="2.5" fill="#a8a29e" />
              <circle cx="31" cy="27" r="2" fill="#a8a29e" />
              <path d="M 28 42 L 36 42 M 28 46 L 36 46" stroke="#b45309" strokeWidth="1.2" />
            </g>
          )}

          {weaponShape === 'spear' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30.5" y="14" width="3" height="46" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="0.8" />
              <path d="M 32 2 L 26 16 L 32 12 L 38 16 Z" fill={rarityColor} stroke="#000" strokeWidth="1.2" />
              <rect x="28" y="14" width="8" height="3" rx="1" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
            </g>
          )}

          {weaponShape === 'halberd' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30.5" y="10" width="3" height="50" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="0.8" />
              <path d="M 32 4 L 27 16 L 32 13 L 37 16 Z" fill={rarityColor} stroke="#000" strokeWidth="1" />
              <path d="M 34 18 Q 52 22 48 38 Q 40 34 34 36 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.4" />
              <path d="M 30 20 L 22 24 L 30 28 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1" />
            </g>
          )}

          {weaponShape === 'scimitar' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30" y="40" width="4" height="16" rx="1.5" fill="#78350f" stroke="#000" strokeWidth="1" />
              <rect x="23" y="38" width="18" height="3.5" rx="1.5" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
              <path d="M 28 38 Q 16 26 20 14 Q 24 6 38 4 Q 30 16 32 28 Q 34 34 36 38 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.4" />
            </g>
          )}

          {weaponShape === 'khopesh' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30" y="42" width="4" height="15" rx="1.5" fill="#78350f" stroke="#000" strokeWidth="1" />
              <rect x="24" y="40" width="16" height="3.5" rx="1" fill="#38bdf8" stroke="#000" strokeWidth="0.8" />
              <path d="M 29 40 Q 14 34 14 20 Q 14 8 28 4 Q 20 16 22 26 Q 24 36 34 40 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.4" />
            </g>
          )}

          {weaponShape === 'mace' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30" y="24" width="4" height="34" rx="1.5" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1" />
              <circle cx="32" cy="16" r="10" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.5" />
              <rect x="20" y="14" width="5" height="5" fill="#94a3b8" stroke="#000" strokeWidth="0.8" />
              <rect x="39" y="14" width="5" height="5" fill="#94a3b8" stroke="#000" strokeWidth="0.8" />
              <rect x="30" y="4" width="5" height="5" fill="#94a3b8" stroke="#000" strokeWidth="0.8" />
              <rect x="30" y="24" width="5" height="5" fill="#94a3b8" stroke="#000" strokeWidth="0.8" />
            </g>
          )}

          {weaponShape === 'rapier' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30.5" y="44" width="3" height="14" rx="1" fill="#78350f" stroke="#000" strokeWidth="1" />
              <circle cx="32" cy="58" r="2.5" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
              <circle cx="32" cy="42" r="7" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <path d="M 31 42 L 31 6 L 32 2 L 33 6 L 33 42 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1" />
            </g>
          )}

          {weaponShape === 'rifle' && (
            <g transform="translate(32,32) rotate(30) translate(-32,-32)">
              <rect x="12" y="30" width="40" height="7" rx="2" fill="#334155" stroke="#000" strokeWidth="1.2" />
              <rect x="46" y="28" width="12" height="4" rx="1" fill={rarityColor} stroke="#000" strokeWidth="1" />
              <rect x="18" y="37" width="8" height="12" rx="1.5" fill="#78350f" stroke="#000" strokeWidth="1" />
              <rect x="28" y="24" width="12" height="6" rx="1" fill="#1e293b" stroke="#000" strokeWidth="0.8" />
              <circle cx="50" cy="30" r="2" fill={rarityColor} className="animate-pulse" />
            </g>
          )}

          {weaponShape === 'katana' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30" y="42" width="4" height="16" rx="1.5" fill="#1e293b" stroke="#000" strokeWidth="1" />
              <circle cx="32" cy="40" r="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <path d="M 29 40 Q 22 24 26 12 Q 28 4 36 2 Q 32 14 32 28 Q 32 36 34 40 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.4" />
            </g>
          )}

          {weaponShape === 'scythe' && (
            <g transform="translate(32,32) rotate(30) translate(-32,-32)">
              <rect x="30" y="10" width="4" height="48" rx="1.5" fill="#1e1b4b" stroke="#000" strokeWidth="1" />
              <path d="M 34 12 Q 58 16 54 40 Q 46 28 34 26 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.5" />
              <circle cx="32" cy="12" r="3" fill={rarityColor} className="animate-pulse" />
            </g>
          )}

          {weaponShape === 'vibroblade' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="28" y="38" width="8" height="16" rx="2" fill="#334155" stroke="#000" strokeWidth="1" />
              <path d="M 29 38 L 28 6 L 36 6 L 35 38 Z" fill={rarityColor} opacity="0.9" stroke="#fff" strokeWidth="1" />
              <line x1="32" y1="36" x2="32" y2="8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="32" cy="44" r="2.5" fill={rarityColor} className="animate-pulse" />
            </g>
          )}

          {weaponShape === 'sword' && (
            <g transform="translate(32,32) rotate(45) translate(-32,-32)">
              <rect x="30" y="38" width="4" height="18" rx="1.5" fill="#78350f" stroke="#000" strokeWidth="1" />
              <circle cx="32" cy="56" r="3" fill="#f59e0b" stroke="#000" strokeWidth="1" />
              <rect x="21" y="36" width="22" height="4.5" rx="1.5" fill="#f59e0b" stroke="#000" strokeWidth="1" />
              <path d="M 28 36 L 31 6 L 33 6 L 36 36 Z" fill={`url(#${bladeGradId})`} stroke="#000" strokeWidth="1.4" />
              <line x1="32" y1="34" x2="32" y2="10" stroke="#fff" strokeWidth="1" />
            </g>
          )}
        </g>
      )}

      {item.slot === 'helmet' && (
        <g filter={glow ? `url(#${glowFilterId})` : undefined}>
          {helmetStyle === 'headband' && (
            <g transform="translate(0,6)">
              <circle cx="32" cy="28" r="16" fill="#fed7aa" stroke="#000" strokeWidth="2" />
              <path d="M 16 22 Q 32 14 48 22" stroke="#e7e5e4" strokeWidth="5" fill="none" strokeLinecap="round" />
              <circle cx="32" cy="18" r="3.5" fill={rarityColor} stroke="#000" strokeWidth="1" />
              <path d="M 20 20 Q 18 10 24 12 Z" fill="#292524" />
              <path d="M 44 20 Q 46 10 40 12 Z" fill="#292524" />
              <circle cx="27" cy="28" r="2.5" fill="#0f172a" />
              <circle cx="37" cy="28" r="2.5" fill="#0f172a" />
            </g>
          )}

          {helmetStyle === 'pharaoh' && (
            <g transform="translate(0,6)">
              <path d="M 12 30 Q 12 8 32 8 Q 52 8 52 30 L 56 42 L 46 40 L 44 32 L 20 32 L 18 40 L 8 42 Z" fill="#38bdf8" stroke="#000" strokeWidth="2" />
              <path d="M 15 16 L 49 16 M 14 24 L 50 24" stroke="#fbbf24" strokeWidth="3" />
              <circle cx="32" cy="28" r="13" fill="#fed7aa" stroke="#000" strokeWidth="1.5" />
              <circle cx="32" cy="10" r="3.5" fill={rarityColor} stroke="#000" strokeWidth="1" />
            </g>
          )}

          {helmetStyle === 'crested' && (
            <g transform="translate(0,4)">
              <path d="M 16 32 Q 16 14 32 14 Q 48 14 48 32 L 46 44 L 38 44 L 38 36 L 26 36 L 26 44 L 18 44 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="2" />
              <path d="M 25 28 L 39 28 L 37 34 L 27 34 Z" fill="#0f172a" />
              <path d="M 28 14 Q 32 -2 36 14 Z" fill="#dc2626" stroke="#000" strokeWidth="1.5" />
              <path d="M 22 14 Q 32 -6 42 14" stroke={rarityColor} strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
          )}

          {helmetStyle === 'spangenhelm' && (
            <g transform="translate(0,6)">
              <path d="M 14 34 Q 16 10 32 6 Q 48 10 50 34 L 48 42 L 16 42 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="2" />
              <path d="M 32 6 L 32 34" stroke="#fbbf24" strokeWidth="3" />
              <path d="M 14 32 L 50 32" stroke="#fbbf24" strokeWidth="3" />
              <rect x="29" y="30" width="6" height="12" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.2" />
              <circle cx="32" cy="6" r="3" fill={rarityColor} />
            </g>
          )}

          {helmetStyle === 'greathelm' && (
            <g transform="translate(0,6)">
              <path d="M 14 34 Q 13 8 32 7 Q 51 8 50 34 L 50 44 L 14 44 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="2" />
              <rect x="29" y="22" width="6" height="16" fill="#0f172a" />
              <rect x="22" y="27" width="20" height="6" fill="#0f172a" />
              <path d="M 32 7 L 32 -2" stroke={rarityColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 25 8 Q 32 0 39 8" fill={rarityColor} stroke="#000" strokeWidth="1" />
              <path d="M 14 34 L 50 34" stroke="#fbbf24" strokeWidth="2" opacity="0.8" />
            </g>
          )}

          {helmetStyle === 'burgonet' && (
            <g transform="translate(0,6)">
              <path d="M 15 32 Q 15 14 32 14 Q 49 14 49 32 L 46 42 L 18 42 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="2" />
              <path d="M 16 26 L 48 26 L 45 20 L 19 20 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.2" />
              <path d="M 23 29 L 45 29 L 43 35 L 25 35 Z" fill="#0f172a" stroke="#000" strokeWidth="1" />
              <path d="M 40 14 Q 54 -2 62 6 Q 52 10 44 18 Z" fill={rarityColor} stroke="#000" strokeWidth="1.5" />
            </g>
          )}

          {helmetStyle === 'welder' && (
            <g transform="translate(0,6)">
              <path d="M 14 32 Q 14 12 32 12 Q 50 12 50 32 L 49 42 L 15 42 Z" fill={colors.plate} stroke="#000" strokeWidth="2" />
              <rect x="20" y="24" width="24" height="10" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <rect x="22" y="26" width="20" height="3" fill={rarityColor} opacity="0.9" />
              <circle cx="32" cy="16" r="3.5" fill="#fbbf24" stroke="#000" strokeWidth="1.2" className="animate-pulse" />
            </g>
          )}

          {helmetStyle === 'tactical' && (
            <g transform="translate(0,6)">
              <path d="M 14 32 Q 14 12 32 12 Q 50 12 50 32 L 48 42 L 16 42 Z" fill="#1e293b" stroke="#000" strokeWidth="2" />
              <rect x="18" y="24" width="28" height="8" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" />
              <circle cx="24" cy="28" r="3" fill="#22c55e" className="animate-pulse" />
              <circle cx="40" cy="28" r="3" fill="#22c55e" className="animate-pulse" />
              <path d="M 16 16 L 32 12 L 48 16" stroke={rarityColor} strokeWidth="2" fill="none" />
            </g>
          )}

          {helmetStyle === 'cyber' && (
            <g transform="translate(0,6)">
              <path d="M 14 32 Q 14 10 32 10 Q 50 10 50 32 L 48 42 L 16 42 Z" fill="#0c0a20" stroke={rarityColor} strokeWidth="2" />
              <path d="M 18 25 L 46 25 L 44 33 L 20 33 Z" fill={rarityColor} opacity="0.95" />
              <path d="M 20 28 L 44 28" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
              <line x1="46" y1="14" x2="52" y2="2" stroke={rarityColor} strokeWidth="2" />
              <circle cx="52" cy="2" r="2.5" fill={rarityColor} className="animate-pulse" />
            </g>
          )}

          {helmetStyle === 'stellar' && (
            <g transform="translate(0,6)">
              <path d="M 14 32 Q 14 8 32 8 Q 50 8 50 32 L 48 42 L 16 42 Z" fill="#1e1b4b" stroke={rarityColor} strokeWidth="2.2" />
              <ellipse cx="32" cy="6" rx="26" ry="7" fill="none" stroke={rarityColor} strokeWidth="2" opacity="0.95" className="animate-pulse" />
              <circle cx="32" cy="-1" r="3" fill="#ffffff" />
              <path d="M 20 25 L 44 25 L 42 33 L 22 33 Z" fill="#38bdf8" opacity="0.95" />
            </g>
          )}
        </g>
      )}

      {item.slot === 'armor' && (
        <g filter={glow ? `url(#${glowFilterId})` : undefined} transform="translate(0,2)">
          {armorStyle === 'tunic' && (
            <g>
              <path d="M 16 12 L 48 12 L 52 54 L 12 54 Z" fill={colors.plate} stroke="#000" strokeWidth="2" />
              <path d="M 16 12 Q 32 4 48 12 L 46 19 Q 32 12 18 19 Z" fill="#d6d3d1" stroke="#000" strokeWidth="1.5" />
              <circle cx="22" cy="15" r="2" fill="#f5f5f4" />
              <circle cx="32" cy="13" r="2" fill="#f5f5f4" />
              <circle cx="42" cy="15" r="2" fill="#f5f5f4" />
              <path d="M 18 24 L 46 24 M 18 32 L 46 32" stroke="#000" strokeWidth="1" opacity="0.3" />
              <rect x="14" y="44" width="36" height="6" rx="2" fill="#a16207" stroke="#000" strokeWidth="1.2" />
            </g>
          )}

          {armorStyle === 'cuirass' && (
            <g>
              <path d="M 18 10 L 46 10 L 43 46 L 32 52 L 21 46 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="2" />
              <line x1="32" y1="12" x2="32" y2="46" stroke="#000" strokeWidth="1.2" opacity="0.5" />
              <circle cx="23" cy="15" r="2" fill="#cbd5e1" />
              <circle cx="41" cy="15" r="2" fill="#cbd5e1" />
              <circle cx="24" cy="42" r="2" fill="#cbd5e1" />
              <circle cx="40" cy="42" r="2" fill="#cbd5e1" />
              <path d="M 18 10 L 46 10 L 43 46 L 32 52 L 21 46 Z" fill="none" stroke={rarityColor} strokeWidth="1.8" opacity="0.9" />
              <rect x="14" y="44" width="36" height="6" rx="2" fill="#78350f" stroke="#000" strokeWidth="1.5" />
            </g>
          )}

          {armorStyle === 'segmentata' && (
            <g>
              <path d="M 18 10 L 46 10 L 47 19 L 17 19 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.5" />
              <path d="M 17 21 L 47 21 L 48 30 L 16 30 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.5" />
              <path d="M 16 32 L 48 32 L 49 41 L 15 41 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.5" />
              <path d="M 15 43 L 49 43 L 48 50 L 16 50 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.5" />
              <path d="M 32 10 L 32 50" stroke="#78350f" strokeWidth="3" />
              <rect x="14" y="44" width="36" height="6" rx="2" fill="#78350f" stroke="#000" strokeWidth="1.5" />
            </g>
          )}

          {armorStyle === 'chainmail' && (
            <g>
              <path d="M 16 10 L 48 10 L 52 54 L 12 54 Z" fill="#475569" stroke="#000" strokeWidth="2" />
              {[0, 1, 2, 3, 4].map((row) =>
                [0, 1, 2, 3].map((col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={20 + col * 8 + (row % 2 === 0 ? 0 : 4)}
                    cy={16 + row * 7}
                    r="2.8"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    opacity="0.85"
                  />
                ))
              )}
              <path d="M 16 10 L 48 10 L 52 54 L 12 54 Z" fill="none" stroke={rarityColor} strokeWidth="2" opacity="0.9" />
              <rect x="14" y="44" width="36" height="6" rx="2" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
            </g>
          )}

          {armorStyle === 'fullplate' && (
            <g>
              <path d="M 17 9 L 47 9 L 44 44 L 32 51 L 20 44 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="2" />
              <path d="M 24 12 L 23 42 M 32 12 L 32 47 M 40 12 L 41 42" stroke="#000" strokeWidth="1" opacity="0.5" />
              <path d="M 17 9 L 47 9 L 46 16 L 18 16 Z" fill={rarityColor} opacity="0.4" stroke="#000" strokeWidth="1.2" />
              <path d="M 20 44 L 26 44 L 25 54 L 20 53 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.2" />
              <path d="M 29 46 L 35 46 L 35 55 L 29 55 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.2" />
              <path d="M 38 44 L 44 44 L 44 53 L 39 54 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.2" />
              <path d="M 17 9 L 47 9 L 44 44 L 32 51 L 20 44 Z" fill="none" stroke={rarityColor} strokeWidth="2" opacity="0.95" />
            </g>
          )}

          {armorStyle === 'tabard' && (
            <g>
              <path d="M 18 10 L 46 10 L 43 46 L 32 52 L 21 46 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="2" />
              <path d="M 24 10 L 40 10 L 38 48 L 26 48 Z" fill={colors.plate} stroke="#000" strokeWidth="1.5" opacity="0.95" />
              <path d="M 24 10 L 40 10 L 39 18 L 25 18 Z" fill={rarityColor} opacity="0.6" stroke="#000" strokeWidth="1" />
              <circle cx="32" cy="24" r="2" fill="#fbbf24" />
              <circle cx="32" cy="32" r="2" fill="#fbbf24" />
              <circle cx="32" cy="40" r="2" fill="#fbbf24" />
              <rect x="14" y="44" width="36" height="6" rx="2" fill="#78350f" stroke="#000" strokeWidth="1.5" />
            </g>
          )}

          {armorStyle === 'exosuit' && (
            <g>
              <path d="M 16 10 L 48 10 L 52 54 L 12 54 Z" fill={colors.plate} stroke="#000" strokeWidth="2" />
              <rect x="20" y="14" width="10" height="15" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" />
              <rect x="34" y="14" width="10" height="15" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" />
              <rect x="20" y="32" width="24" height="14" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" />
              <circle cx="32" cy="39" r="4" fill="#fbbf24" stroke="#000" strokeWidth="1" />
              <line x1="32" y1="39" x2="34" y2="37" stroke="#dc2626" strokeWidth="1.2" />
              <path d="M 16 10 L 48 10 L 52 54 L 12 54 Z" fill="none" stroke={rarityColor} strokeWidth="2" opacity="0.85" />
            </g>
          )}

          {armorStyle === 'nanosuit' && (
            <g>
              <path d="M 16 10 L 48 10 L 52 54 L 12 54 Z" fill="#0c0a20" stroke={rarityColor} strokeWidth="2.2" />
              <path d="M 22 14 L 22 28 L 28 34 M 42 14 L 42 28 L 36 34 M 32 12 L 32 48" stroke={rarityColor} strokeWidth="1.5" fill="none" opacity="0.9" />
              <circle cx="22" cy="28" r="2" fill={rarityColor} className="animate-pulse" />
              <circle cx="42" cy="28" r="2" fill={rarityColor} className="animate-pulse" />
              <circle cx="32" cy="24" r="5" fill={rarityColor} opacity="0.9" stroke="#fff" strokeWidth="1" className="animate-pulse" />
              <circle cx="32" cy="24" r="8" fill="none" stroke={rarityColor} strokeWidth="1" opacity="0.5" />
            </g>
          )}
        </g>
      )}

      {item.slot === 'gloves' && (
        <g filter={glow ? `url(#${glowFilterId})` : undefined}>
          {glovesStyle === 'wraps' && (
            <g transform="translate(0,6)">
              <rect x="14" y="24" width="14" height="20" rx="4" fill="#a16207" stroke="#000" strokeWidth="1.5" />
              <rect x="36" y="24" width="14" height="20" rx="4" fill="#a16207" stroke="#000" strokeWidth="1.5" />
              <line x1="16" y1="30" x2="26" y2="30" stroke="#78350f" strokeWidth="2" />
              <line x1="16" y1="36" x2="26" y2="36" stroke="#78350f" strokeWidth="2" />
              <line x1="38" y1="30" x2="48" y2="30" stroke="#78350f" strokeWidth="2" />
              <line x1="38" y1="36" x2="48" y2="36" stroke="#78350f" strokeWidth="2" />
              <circle cx="21" cy="20" r="3" fill="#e7e5e4" stroke="#000" strokeWidth="1" />
              <circle cx="43" cy="20" r="3" fill="#e7e5e4" stroke="#000" strokeWidth="1" />
            </g>
          )}

          {(glovesStyle === 'bracers' || glovesStyle === 'manica') && (
            <g transform="translate(0,6)">
              <rect x="14" y="22" width="14" height="24" rx="4" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.8" />
              <rect x="36" y="22" width="14" height="24" rx="4" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.8" />
              <circle cx="21" cy="30" r="2" fill={rarityColor} />
              <circle cx="21" cy="38" r="2" fill={rarityColor} />
              <circle cx="43" cy="30" r="2" fill={rarityColor} />
              <circle cx="43" cy="38" r="2" fill={rarityColor} />
            </g>
          )}

          {glovesStyle === 'riveted' && (
            <g transform="translate(0,6)">
              <rect x="14" y="22" width="14" height="24" rx="4" fill="#475569" stroke="#000" strokeWidth="1.5" />
              <rect x="36" y="22" width="14" height="24" rx="4" fill="#475569" stroke="#000" strokeWidth="1.5" />
              <circle cx="18" cy="28" r="1.5" fill="#fbbf24" />
              <circle cx="24" cy="28" r="1.5" fill="#fbbf24" />
              <circle cx="18" cy="36" r="1.5" fill="#fbbf24" />
              <circle cx="24" cy="36" r="1.5" fill="#fbbf24" />
              <circle cx="40" cy="28" r="1.5" fill="#fbbf24" />
              <circle cx="46" cy="28" r="1.5" fill="#fbbf24" />
              <circle cx="40" cy="36" r="1.5" fill="#fbbf24" />
              <circle cx="46" cy="36" r="1.5" fill="#fbbf24" />
            </g>
          )}

          {glovesStyle === 'gauntlets' && (
            <g transform="translate(0,6)">
              <path d="M 12 44 L 28 44 L 26 22 L 14 22 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.8" />
              <path d="M 36 44 L 52 44 L 50 22 L 38 22 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.8" />
              <line x1="14" y1="28" x2="26" y2="28" stroke="#000" strokeWidth="1.2" opacity="0.6" />
              <line x1="13" y1="34" x2="27" y2="34" stroke="#000" strokeWidth="1.2" opacity="0.6" />
              <line x1="38" y1="28" x2="50" y2="28" stroke="#000" strokeWidth="1.2" opacity="0.6" />
              <line x1="37" y1="34" x2="51" y2="34" stroke="#000" strokeWidth="1.2" opacity="0.6" />
              <path d="M 12 44 L 28 44 M 36 44 L 52 44" stroke={rarityColor} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {glovesStyle === 'dueling' && (
            <g transform="translate(0,6)">
              <rect x="14" y="24" width="14" height="22" rx="4" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
              <rect x="36" y="24" width="14" height="22" rx="4" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
              <path d="M 14 40 Q 21 34 28 40 M 36 40 Q 43 34 50 40" stroke="#fbbf24" strokeWidth="2" fill="none" />
            </g>
          )}

          {glovesStyle === 'piston' && (
            <g transform="translate(0,6)">
              <rect x="14" y="22" width="14" height="24" rx="4" fill={colors.plate} stroke="#000" strokeWidth="1.8" />
              <rect x="36" y="22" width="14" height="24" rx="4" fill={colors.plate} stroke="#000" strokeWidth="1.8" />
              <rect x="17" y="16" width="8" height="8" rx="1.5" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
              <rect x="39" y="16" width="8" height="8" rx="1.5" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
              <circle cx="21" cy="38" r="2" fill={rarityColor} className="animate-pulse" />
              <circle cx="43" cy="38" r="2" fill={rarityColor} className="animate-pulse" />
            </g>
          )}

          {glovesStyle === 'tactical' && (
            <g transform="translate(0,6)">
              <rect x="14" y="22" width="14" height="24" rx="4" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
              <rect x="36" y="22" width="14" height="24" rx="4" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
              <circle cx="21" cy="32" r="3" fill={rarityColor} />
              <circle cx="43" cy="32" r="3" fill={rarityColor} />
            </g>
          )}

          {(glovesStyle === 'cyber' || glovesStyle === 'stellar') && (
            <g transform="translate(0,6)">
              <rect x="14" y="22" width="14" height="24" rx="4" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.8" />
              <rect x="36" y="22" width="14" height="24" rx="4" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.8" />
              <circle cx="21" cy="34" r="3" fill={rarityColor} opacity="0.9" className="animate-pulse" />
              <circle cx="43" cy="34" r="3" fill={rarityColor} opacity="0.9" className="animate-pulse" />
              <line x1="17" y1="26" x2="25" y2="26" stroke="#fff" strokeWidth="1.5" />
              <line x1="39" y1="26" x2="47" y2="26" stroke="#fff" strokeWidth="1.5" />
            </g>
          )}
        </g>
      )}

      {item.slot === 'boots' && (
        <g filter={glow ? `url(#${glowFilterId})` : undefined}>
          {bootsStyle === 'wraps' && (
            <g transform="translate(0,4)">
              <path d="M 14 20 L 26 20 L 26 44 L 10 46 L 10 38 Z" fill="#a16207" stroke="#000" strokeWidth="1.5" />
              <path d="M 38 20 L 50 20 L 54 38 L 54 46 L 38 44 Z" fill="#a16207" stroke="#000" strokeWidth="1.5" />
              <line x1="13" y1="28" x2="25" y2="28" stroke="#78350f" strokeWidth="2" />
              <line x1="12" y1="36" x2="25" y2="36" stroke="#78350f" strokeWidth="2" />
              <line x1="39" y1="28" x2="51" y2="28" stroke="#78350f" strokeWidth="2" />
              <line x1="39" y1="36" x2="52" y2="36" stroke="#78350f" strokeWidth="2" />
            </g>
          )}

          {bootsStyle === 'sandals' && (
            <g transform="translate(0,6)">
              <path d="M 14 24 L 26 24 L 26 44 L 10 45 L 10 40 Z" fill="#b45309" stroke="#000" strokeWidth="1.5" />
              <path d="M 38 24 L 50 24 L 54 40 L 54 45 L 38 44 Z" fill="#b45309" stroke="#000" strokeWidth="1.5" />
              <circle cx="18" cy="32" r="2" fill={rarityColor} />
              <circle cx="46" cy="32" r="2" fill={rarityColor} />
            </g>
          )}

          {bootsStyle === 'greaves' && (
            <g transform="translate(0,4)">
              <path d="M 14 16 L 26 16 L 27 38 L 9 44 L 10 32 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.8" />
              <path d="M 38 16 L 50 16 L 54 32 L 55 44 L 37 38 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.8" />
              <line x1="20" y1="20" x2="20" y2="36" stroke="#000" strokeWidth="1.2" opacity="0.5" />
              <line x1="44" y1="20" x2="44" y2="36" stroke="#000" strokeWidth="1.2" opacity="0.5" />
              <path d="M 14 16 L 26 16 M 38 16 L 50 16" stroke={rarityColor} strokeWidth="2.5" />
            </g>
          )}

          {bootsStyle === 'chausses' && (
            <g transform="translate(0,4)">
              <path d="M 14 16 L 26 16 L 27 38 L 9 44 L 10 32 Z" fill="#475569" stroke="#000" strokeWidth="1.8" />
              <path d="M 38 16 L 50 16 L 54 32 L 55 44 L 37 38 Z" fill="#475569" stroke="#000" strokeWidth="1.8" />
              <circle cx="19" cy="28" r="1.5" fill="none" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="45" cy="28" r="1.5" fill="none" stroke="#94a3b8" strokeWidth="1" />
            </g>
          )}

          {bootsStyle === 'sabatons' && (
            <g transform="translate(0,4)">
              <path d="M 14 16 L 26 16 L 28 32 L 30 44 L 6 46 L 10 32 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.8" />
              <path d="M 38 16 L 50 16 L 54 32 L 58 46 L 34 44 L 36 32 Z" fill={`url(#${metalGradId})`} stroke="#000" strokeWidth="1.8" />
              <line x1="12" y1="30" x2="28" y2="30" stroke="#000" strokeWidth="1.2" opacity="0.6" />
              <line x1="36" y1="30" x2="52" y2="30" stroke="#000" strokeWidth="1.2" opacity="0.6" />
              <path d="M 14 16 L 26 16 L 28 32 L 30 44 L 6 46 L 10 32 Z" fill="none" stroke={rarityColor} strokeWidth="1.5" opacity="0.9" />
              <path d="M 38 16 L 50 16 L 54 32 L 58 46 L 34 44 L 36 32 Z" fill="none" stroke={rarityColor} strokeWidth="1.5" opacity="0.9" />
            </g>
          )}

          {bootsStyle === 'riding' && (
            <g transform="translate(0,4)">
              <path d="M 14 14 L 26 14 L 27 42 L 8 44 L 10 30 Z" fill="#3f2715" stroke="#000" strokeWidth="1.8" />
              <path d="M 38 14 L 50 14 L 54 30 L 56 44 L 37 42 Z" fill="#3f2715" stroke="#000" strokeWidth="1.8" />
              <rect x="18" y="28" width="5" height="4" fill="#fbbf24" stroke="#000" strokeWidth="0.8" />
              <rect x="42" y="28" width="5" height="4" fill="#fbbf24" stroke="#000" strokeWidth="0.8" />
            </g>
          )}

          {bootsStyle === 'tread' && (
            <g transform="translate(0,4)">
              <path d="M 13 18 L 26 18 L 28 40 L 7 44 L 10 32 Z" fill={colors.plate} stroke="#000" strokeWidth="1.8" />
              <path d="M 38 18 L 51 18 L 54 32 L 57 44 L 36 40 Z" fill={colors.plate} stroke="#000" strokeWidth="1.8" />
              <circle cx="16" cy="34" r="1.8" fill={rarityColor} className="animate-pulse" />
              <circle cx="48" cy="34" r="1.8" fill={rarityColor} className="animate-pulse" />
            </g>
          )}

          {bootsStyle === 'assault' && (
            <g transform="translate(0,4)">
              <path d="M 13 18 L 26 18 L 27 40 L 8 44 L 10 32 Z" fill="#1e293b" stroke="#000" strokeWidth="1.8" />
              <path d="M 38 18 L 51 18 L 54 32 L 56 44 L 37 40 Z" fill="#1e293b" stroke="#000" strokeWidth="1.8" />
              <path d="M 8 42 L 27 40 M 37 40 L 56 42" stroke={rarityColor} strokeWidth="2.5" />
            </g>
          )}

          {bootsStyle === 'hover' && (
            <g transform="translate(0,4)">
              <path d="M 14 16 L 26 16 L 27 38 L 9 42 L 10 30 Z" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.8" />
              <path d="M 38 16 L 50 16 L 54 30 L 55 42 L 37 38 Z" fill="#0c0a20" stroke={rarityColor} strokeWidth="1.8" />
              <path d="M 9 42 L 27 38" stroke={rarityColor} strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
              <path d="M 37 38 L 55 42" stroke={rarityColor} strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
            </g>
          )}

          {bootsStyle === 'warp' && (
            <g transform="translate(0,4)">
              <path d="M 14 14 L 26 14 L 27 38 L 8 42 L 10 28 Z" fill="#1e1b4b" stroke={rarityColor} strokeWidth="2" />
              <path d="M 38 14 L 50 14 L 54 28 L 56 42 L 37 38 Z" fill="#1e1b4b" stroke={rarityColor} strokeWidth="2" />
              <ellipse cx="18" cy="44" rx="12" ry="4" fill={rarityColor} opacity="0.7" className="animate-pulse" />
              <ellipse cx="46" cy="44" rx="12" ry="4" fill={rarityColor} opacity="0.7" className="animate-pulse" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
};
