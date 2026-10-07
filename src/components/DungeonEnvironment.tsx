import React from 'react';

interface DungeonEnvironmentProps {
  waveNumber?: number;
  isBossWave?: boolean;
}

export const DungeonEnvironment: React.FC<DungeonEnvironmentProps> = ({ isBossWave }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. DEEP VOID & RIFT SKY */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 transition-all duration-700" />

      {/* Pulsing Spatial Rift Vortex in Background */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-fuchsia-600/30 via-cyan-500/25 to-purple-600/35 blur-2xl animate-pulse" />
      
      {/* Swirling Arcane Accretion Ring */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '24s' }} />
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border border-pink-500/30 animate-spin" style={{ animationDuration: '14s', animationDirection: 'reverse' }} />

      {/* Ambient Void Stars & Glyphs */}
      <div className="absolute top-3 left-10 text-cyan-300/80 text-xs animate-[twinkleStar_2s_ease-in-out_infinite]">✦</div>
      <div className="absolute top-8 left-24 text-pink-300/70 text-[10px] animate-[twinkleStar_3s_ease-in-out_infinite_1s]">★</div>
      <div className="absolute top-5 right-12 text-purple-300/80 text-xs animate-[twinkleStar_2.5s_ease-in-out_infinite_0.5s]">✧</div>
      <div className="absolute top-9 right-28 text-cyan-200/60 text-[9px] animate-[twinkleStar_3.5s_ease-in-out_infinite_1.5s]">✦</div>

      {/* 2. FLOATING ANCIENT TECH OBELISKS (Silhouette & Energy Circuit SVGs) */}
      <div className="absolute top-0 inset-x-0 h-28 overflow-hidden z-0 opacity-85">
        <svg viewBox="0 0 1000 130" preserveAspectRatio="none" className="w-full h-full">
          {/* Distant Spire silhouettes */}
          <g fill="#0b081a" opacity="0.95">
            <polygon points="0,130 50,20 100,130" />
            <polygon points="180,130 220,35 260,130" />
            <polygon points="400,130 450,15 500,130" />
            <polygon points="520,130 550,45 580,130" />
            <polygon points="720,130 760,25 800,130" />
            <polygon points="880,130 930,10 980,130" />
          </g>

          {/* Floating Ancient Tech Monoliths with Glowing Runes */}
          <g transform="translate(130, 20)">
            <polygon points="15,0 30,25 25,75 5,75 0,25" fill="#1e1035" stroke="#a855f7" strokeWidth="1.5" />
            <line x1="15" y1="15" x2="15" y2="65" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" className="animate-pulse" />
          </g>

          <g transform="translate(620, 15)">
            <polygon points="20,0 40,30 35,85 5,85 0,30" fill="#1e1035" stroke="#ec4899" strokeWidth="1.5" />
            <line x1="20" y1="18" x2="20" y2="75" stroke="#ec4899" strokeWidth="2" strokeDasharray="4 2" className="animate-pulse" />
          </g>

          {/* Arcane Lightning Connecting Arcs */}
          {isBossWave && (
            <path
              d="M 145 35 Q 300 10 450 25 Q 600 5 640 30 Q 800 15 930 20"
              fill="none"
              stroke="#f472b6"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              opacity="0.8"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* 3. NEON CYBER-RUNIC HEX TERRAIN OVERLAY */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 opacity-35"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(236, 72, 153, 0.4) 0%, transparent 60%),
            linear-gradient(rgba(56, 189, 248, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 28px 28px, 28px 28px',
          transform: 'perspective(220px) rotateX(42deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Glowing Ground Ley-Line */}
      <div className="absolute bottom-4 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 shadow-[0_0_12px_#38bdf8]" />
      {isBossWave && (
        <div className="absolute bottom-4 inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-75 shadow-[0_0_16px_#ec4899] animate-pulse" />
      )}
    </div>
  );
};
