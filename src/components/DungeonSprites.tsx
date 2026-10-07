import React from 'react';
import type { DungeonWaveEnemy } from '../types/dungeon';

export interface DungeonEnemySpriteProps {
  enemy: DungeonWaveEnemy;
  className?: string;
  isAttacking?: boolean;
  isWalking?: boolean;
  isHit?: boolean;
}

export const DungeonEnemySprite: React.FC<DungeonEnemySpriteProps> = ({
  enemy,
  className = 'w-24 h-24',
  isAttacking = false,
  isWalking = false,
  isHit = false,
}) => {
  const { type } = enemy;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className} ${
        isHit ? 'animate-hit-recoil-boss' : ''
      }`}
    >
      {/* Dynamic Ground Shadow */}
      <div className="absolute -bottom-1 w-3/4 h-3 bg-black/70 rounded-full blur-[2px] pointer-events-none" />

      {/* 1. CHRONO-DRONE (Wave 1: Floating Scout Drone) */}
      {type === 'drone' && (
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-3' : isWalking ? 'scale-105 -translate-y-1' : ''
          }`}
        >
          {/* Outer Pulsing Aura */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" className="animate-spin" />
          
          {/* Drone Chassis Wings */}
          <path d="M 20 50 L 35 30 L 65 30 L 80 50 L 65 70 L 35 70 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          
          {/* Side Thrusters */}
          <rect x="12" y="44" width="10" height="12" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="78" y="44" width="10" height="12" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Thruster Flame Jets */}
          <polygon points="6,50 12,46 12,54" fill="#38bdf8" className="animate-pulse" />
          <polygon points="94,50 88,46 88,54" fill="#38bdf8" className="animate-pulse" />

          {/* Central Energy Core Lens */}
          <circle cx="50" cy="50" r="14" fill="#0369a1" stroke="#bae6fd" strokeWidth="2" />
          <circle cx="50" cy="50" r="8" fill="#38bdf8" className="animate-pulse" />
          <circle cx="48" cy="48" r="3" fill="#ffffff" />
          
          {/* Tech Antenna Spikes */}
          <line x1="50" y1="30" x2="50" y2="15" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="14" r="2.5" fill="#f43f5e" className="animate-ping" />
        </svg>
      )}

      {/* 2. VOID SENTINEL (Wave 2: Heavy Armored Bipedal Mech) */}
      {type === 'sentinel' && (
        <svg
          viewBox="0 0 110 110"
          className={`w-full h-full drop-shadow-[0_0_14px_rgba(129,140,248,0.7)] transition-transform duration-200 ${
            isAttacking ? 'scale-110 -translate-x-3' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Mech Legs */}
          <path d="M 35 75 L 28 98 L 20 100 M 35 88 L 22 92" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          <path d="M 75 75 L 82 98 L 90 100 M 75 88 L 88 92" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

          {/* Heavy Armored Torso */}
          <polygon points="30,40 80,40 88,75 22,75" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
          <rect x="40" y="48" width="30" height="18" rx="4" fill="#312e81" stroke="#a5b4fc" strokeWidth="1.5" />
          
          {/* Glowing Reactor Core */}
          <circle cx="55" cy="57" r="6" fill="#818cf8" className="animate-pulse" />
          <circle cx="55" cy="57" r="2" fill="#ffffff" />

          {/* Armored Visor Head */}
          <polygon points="42,22 68,22 74,38 36,38" fill="#0f172a" stroke="#818cf8" strokeWidth="2" />
          <rect x="44" y="28" width="22" height="4" rx="2" fill="#f43f5e" className="animate-pulse" />

          {/* Left Arm Cannon */}
          <rect x="12" y="44" width="14" height="24" rx="3" fill="#334155" stroke="#818cf8" strokeWidth="1.5" />
          <circle cx="19" cy="68" r="3" fill="#818cf8" />

          {/* Right Heavy Energy Blade */}
          <rect x="84" y="44" width="14" height="20" rx="3" fill="#334155" stroke="#818cf8" strokeWidth="1.5" />
          <path d="M 91 64 L 98 90 L 88 84 Z" fill="#818cf8" stroke="#c7d2fe" strokeWidth="1.5" className="animate-pulse" />
        </svg>
      )}

      {/* 3. GLITCH HORROR (Wave 3: Chaotic Bio-Digital Predator) */}
      {type === 'glitch' && (
        <svg
          viewBox="0 0 110 110"
          className={`w-full h-full drop-shadow-[0_0_16px_rgba(244,63,94,0.8)] transition-transform duration-200 ${
            isAttacking ? 'scale-115 -translate-x-3 rotate-[-4deg]' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Glitch Pixel Artifacts */}
          <rect x="15" y="25" width="8" height="4" fill="#f43f5e" opacity="0.6" />
          <rect x="85" y="70" width="10" height="4" fill="#38bdf8" opacity="0.7" />
          <rect x="20" y="80" width="6" height="6" fill="#ec4899" opacity="0.5" />

          {/* Spidery Cybernetic Tendril Legs */}
          <path d="M 40 65 Q 20 70 12 95 M 45 70 Q 30 85 28 100" stroke="#be123c" strokeWidth="3" strokeLinecap="round" />
          <path d="M 70 65 Q 90 70 98 95 M 65 70 Q 80 85 82 100" stroke="#be123c" strokeWidth="3" strokeLinecap="round" />

          {/* Jagged Bio-Matrix Body */}
          <polygon points="35,35 75,35 85,75 55,85 25,75" fill="#4c0519" stroke="#f43f5e" strokeWidth="2.5" />
          
          {/* Multiple Glowing Glitch Eyes */}
          <circle cx="45" cy="45" r="3.5" fill="#f43f5e" className="animate-pulse" />
          <circle cx="65" cy="45" r="3.5" fill="#f43f5e" className="animate-pulse" />
          <circle cx="55" cy="52" r="4.5" fill="#fb7185" className="animate-ping" />
          <circle cx="40" cy="58" r="2.5" fill="#38bdf8" />
          <circle cx="70" cy="58" r="2.5" fill="#38bdf8" />

          {/* Razor Energy Mandibles */}
          <path d="M 46 68 L 55 82 L 48 80 Z" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1" />
          <path d="M 64 68 L 55 82 L 62 80 Z" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1" />
        </svg>
      )}

      {/* 4. RIFT BEHEMOTH (Wave 4: Colossal Crystalline Mini-Boss) */}
      {type === 'behemoth' && (
        <svg
          viewBox="0 0 130 130"
          className={`w-full h-full drop-shadow-[0_0_20px_rgba(192,132,252,0.85)] transition-transform duration-200 ${
            isAttacking ? 'scale-115 -translate-x-4' : isWalking ? 'scale-105' : ''
          }`}
        >
          {/* Massive Heavy Foot Stompers */}
          <polygon points="25,95 45,95 48,118 18,118" fill="#3b0764" stroke="#c084fc" strokeWidth="2" />
          <polygon points="85,95 105,95 112,118 82,118" fill="#3b0764" stroke="#c084fc" strokeWidth="2" />

          {/* Crystalline Shoulder Pauldrons */}
          <polygon points="10,35 40,25 35,60 12,55" fill="#581c87" stroke="#e9d5ff" strokeWidth="2" />
          <polygon points="120,35 90,25 95,60 118,55" fill="#581c87" stroke="#e9d5ff" strokeWidth="2" />

          {/* Heavy Crystal Spikes on Back */}
          <polygon points="35,25 45,5 55,25" fill="#9333ea" stroke="#f3e8ff" strokeWidth="1.5" />
          <polygon points="75,25 85,5 95,25" fill="#9333ea" stroke="#f3e8ff" strokeWidth="1.5" />
          <polygon points="55,20 65,0 75,20" fill="#a855f7" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />

          {/* Colossal Torso Armor */}
          <polygon points="28,40 102,40 92,95 38,95" fill="#2e1065" stroke="#c084fc" strokeWidth="3" />
          
          {/* Molten Rift Energy Core in Chest */}
          <polygon points="50,55 80,55 72,82 58,82" fill="#7e22ce" stroke="#f0abfc" strokeWidth="2" />
          <circle cx="65" cy="68" r="8" fill="#d946ef" className="animate-pulse" />
          <circle cx="65" cy="68" r="4" fill="#ffffff" />

          {/* Brutal Horned Helm Head */}
          <polygon points="50,22 80,22 75,42 55,42" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2" />
          <polygon points="45,22 35,12 52,20" fill="#c084fc" />
          <polygon points="85,22 95,12 78,20" fill="#c084fc" />
          {/* Glowing Eye Slit */}
          <rect x="54" y="28" width="22" height="4" rx="2" fill="#f43f5e" className="animate-pulse" />

          {/* Colossal Power Fists */}
          <circle cx="18" cy="75" r="12" fill="#581c87" stroke="#e9d5ff" strokeWidth="2" />
          <circle cx="112" cy="75" r="12" fill="#581c87" stroke="#e9d5ff" strokeWidth="2" />
        </svg>
      )}

      {/* 5. THE CHRONO SOVEREIGN TITAN (Wave 5: FINAL DUNGEON BOSS) */}
      {type === 'sovereign_boss' && (
        <svg
          viewBox="0 0 140 140"
          className={`w-full h-full drop-shadow-[0_0_28px_rgba(236,72,153,0.95)] transition-transform duration-200 ${
            isAttacking ? 'scale-120 -translate-x-4 rotate-[-3deg]' : isWalking ? 'scale-108' : ''
          }`}
        >
          {/* Rotating Orbital Chrono-Rings */}
          <circle cx="70" cy="70" r="58" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" className="animate-spin" />
          <ellipse cx="70" cy="70" rx="64" ry="24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.7" transform="rotate(-25 70 70)" />

          {/* Floating Celestial Void Shards */}
          <polygon points="18,30 26,18 28,34" fill="#ec4899" stroke="#fbcfe8" strokeWidth="1" className="animate-bounce" />
          <polygon points="122,30 114,18 112,34" fill="#ec4899" stroke="#fbcfe8" strokeWidth="1" className="animate-bounce" />
          <polygon points="20,105 30,95 28,112" fill="#8b5cf6" stroke="#ddd6fe" strokeWidth="1" className="animate-pulse" />
          <polygon points="120,105 110,95 112,112" fill="#8b5cf6" stroke="#ddd6fe" strokeWidth="1" className="animate-pulse" />

          {/* Divine Sovereign Cape / Wings of Time */}
          <path d="M 35 45 Q 15 75 22 120 Q 50 110 55 95 Z" fill="#500724" stroke="#ec4899" strokeWidth="2" />
          <path d="M 105 45 Q 125 75 118 120 Q 90 110 85 95 Z" fill="#500724" stroke="#ec4899" strokeWidth="2" />

          {/* Sovereign Godplate Armor Body */}
          <polygon points="40,42 100,42 90,105 50,105" fill="#831843" stroke="#f472b6" strokeWidth="3" />
          
          {/* Singularity Void Reactor Heart */}
          <circle cx="70" cy="72" r="14" fill="#0f172a" stroke="#ec4899" strokeWidth="2.5" />
          <circle cx="70" cy="72" r="9" fill="#f43f5e" className="animate-ping" />
          <circle cx="70" cy="72" r="5" fill="#ffffff" />
          {/* Swirling accretion lines */}
          <path d="M 60 72 Q 70 60 80 72" stroke="#fbcfe8" strokeWidth="1.5" fill="none" />
          <path d="M 60 72 Q 70 84 80 72" stroke="#fbcfe8" strokeWidth="1.5" fill="none" />

          {/* Crown of the Sovereign */}
          <polygon points="50,22 70,8 90,22 82,36 58,36" fill="#be185d" stroke="#fbcfe8" strokeWidth="2" />
          <circle cx="70" cy="18" r="3.5" fill="#38bdf8" className="animate-pulse" />

          {/* Godplate Helm Face & Radiant Eyes */}
          <polygon points="54,28 86,28 82,46 58,46" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
          <ellipse cx="64" cy="36" rx="3.5" ry="2" fill="#38bdf8" className="animate-pulse" />
          <ellipse cx="76" cy="36" rx="3.5" ry="2" fill="#38bdf8" className="animate-pulse" />

          {/* Scepter of Dimensional Mastery (Left Hand) */}
          <g transform="translate(15, 30)">
            <line x1="10" y1="0" x2="10" y2="85" stroke="#fbcfe8" strokeWidth="2.5" />
            <polygon points="10,0 2,12 18,12" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
            <circle cx="10" cy="16" r="4" fill="#38bdf8" />
          </g>

          {/* Temporal Scythe / Blade of Oblivion (Right Hand) */}
          <g transform="translate(105, 25)">
            <path d="M 5 0 Q 30 -10 32 30 Q 15 20 5 35 Z" fill="#ec4899" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
            <line x1="5" y1="15" x2="5" y2="90" stroke="#fbcfe8" strokeWidth="2.5" />
          </g>
        </svg>
      )}
    </div>
  );
};
