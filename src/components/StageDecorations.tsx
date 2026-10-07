import React from 'react';

// Reusable SVG Plants & Decorations with Natural Animations

export const PrimitiveFoliage: React.FC = () => (
  <>
    {/* Left Giant Cycad Palm Tree */}
    <div className="absolute -top-2 left-2 sm:left-4 z-10 origin-bottom animate-[swayFoliage_5s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 80 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-md">
        {/* Trunk */}
        <path d="M 38 90 Q 42 55 40 28 Q 38 28 35 90 Z" fill="#3f2715" />
        <path d="M 35 40 L 43 45 M 34 55 L 44 60 M 35 70 L 43 75" stroke="#25160c" strokeWidth="2" />
        {/* Large Prehistoric Palm Fronds */}
        <path d="M 40 30 Q 15 15 2 30 Q 20 22 40 30" fill="#2d6a2e" />
        <path d="M 40 30 Q 10 38 0 55 Q 22 38 40 30" fill="#1e4d20" />
        <path d="M 40 30 Q 25 5 42 0 Q 38 18 40 30" fill="#388e3c" />
        <path d="M 40 30 Q 60 5 78 18 Q 55 22 40 30" fill="#2d6a2e" />
        <path d="M 40 30 Q 70 30 80 48 Q 60 36 40 30" fill="#1e4d20" />
      </svg>
    </div>

    {/* Hanging Jungle Vines on top */}
    <div className="absolute top-0 left-20 sm:left-28 z-10 pointer-events-none opacity-85">
      <svg viewBox="0 0 60 40" className="w-14 h-10">
        <path d="M 5 0 Q 8 20 18 35 M 25 0 Q 22 15 32 28 M 45 0 Q 48 22 52 38" stroke="#2d6a2e" strokeWidth="2.5" fill="none" />
        {/* Vine Leaves */}
        <circle cx="12" cy="18" r="3" fill="#4caf50" />
        <circle cx="28" cy="15" r="3.5" fill="#388e3c" />
        <circle cx="49" cy="24" r="3" fill="#66bb6a" />
      </svg>
    </div>

    {/* Right Primitive Totem & Giant Prehistoric Mushrooms */}
    <div className="absolute -top-1 right-2 sm:right-6 z-10 origin-bottom animate-[swayFoliageAlt_6s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 80 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-md">
        {/* Trunk & Tree */}
        <path d="M 40 90 Q 36 50 38 25 Q 42 25 45 90 Z" fill="#4a2e18" />
        {/* Fern Canopy */}
        <path d="M 38 25 Q 65 10 78 28 Q 58 20 38 25" fill="#2e7d32" />
        <path d="M 38 25 Q 60 35 75 52 Q 52 35 38 25" fill="#1b5e20" />
        <path d="M 38 25 Q 20 8 5 22 Q 22 18 38 25" fill="#388e3c" />
        {/* Glowing Prehistoric Mushroom near base */}
        <ellipse cx="25" cy="80" rx="10" ry="6" fill="#f97316" opacity="0.9" />
        <path d="M 23 80 L 23 88 L 27 88 L 27 80 Z" fill="#e2e8f0" />
        <circle cx="21" cy="79" r="1.5" fill="#fff" />
        <circle cx="27" cy="78" r="1.2" fill="#fff" />
      </svg>
    </div>

    {/* Lower Roadside Ferns & Mossy Rocks */}
    <div className="absolute bottom-1 left-3 z-20 pointer-events-none opacity-90">
      <svg viewBox="0 0 50 25" className="w-12 h-6">
        <path d="M 5 25 Q 15 10 25 15 Q 15 20 5 25" fill="#2d6a2e" />
        <path d="M 2 25 Q 8 8 18 12 Q 10 18 2 25" fill="#4caf50" />
        <ellipse cx="38" cy="20" rx="9" ry="5" fill="#374151" />
        <ellipse cx="38" cy="18" rx="7" ry="3" fill="#4b5563" />
      </svg>
    </div>

    <div className="absolute bottom-1 right-4 z-20 pointer-events-none opacity-90">
      <svg viewBox="0 0 50 25" className="w-12 h-6">
        <ellipse cx="14" cy="20" rx="8" ry="5" fill="#374151" />
        <path d="M 30 25 Q 35 8 45 10 Q 38 18 30 25" fill="#388e3c" />
        <path d="M 25 25 Q 28 14 38 16 Q 30 20 25 25" fill="#2e7d32" />
      </svg>
    </div>
  </>
);

export const AncientOasisFoliage: React.FC = () => (
  <>
    {/* Left Tall Date Palm Tree */}
    <div className="absolute -top-3 left-2 sm:left-4 z-10 origin-bottom animate-[swayFoliage_6s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 85 95" className="w-18 sm:w-22 h-20 sm:h-26 drop-shadow-md">
        {/* Slender Curved Trunk with bark texture */}
        <path d="M 32 95 Q 46 55 42 22 Q 38 22 28 95 Z" fill="#6d4c2a" />
        <path d="M 28 80 L 36 78 M 30 65 L 39 63 M 34 50 L 41 48 M 38 35 L 43 33" stroke="#4a3219" strokeWidth="2" />
        {/* Palm Fronds */}
        <path d="M 40 22 Q 18 5 0 20 Q 20 12 40 22" fill="#22c55e" />
        <path d="M 40 22 Q 10 22 2 40 Q 22 26 40 22" fill="#15803d" />
        <path d="M 40 22 Q 28 -2 46 -4 Q 44 12 40 22" fill="#4ade80" />
        <path d="M 40 22 Q 62 -2 80 12 Q 58 14 40 22" fill="#22c55e" />
        <path d="M 40 22 Q 72 18 84 35 Q 62 25 40 22" fill="#16a34a" />
        {/* Coconuts / Dates cluster */}
        <circle cx="38" cy="23" r="2.5" fill="#a16207" />
        <circle cx="43" cy="24" r="2.5" fill="#854d0e" />
      </svg>
    </div>

    {/* Right Desert Cactus & Terracotta Amphora Urn */}
    <div className="absolute -top-1 right-2 sm:right-6 z-10 origin-bottom animate-[swayFoliageAlt_7s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 75 85" className="w-16 sm:w-20 h-18 sm:h-22 drop-shadow-md">
        {/* Saguaro Cactus */}
        <path d="M 48 85 L 48 30 Q 48 20 54 20 Q 60 20 60 30 L 60 85 Z" fill="#15803d" />
        {/* Left arm */}
        <path d="M 48 55 L 36 55 L 36 40 Q 36 34 40 34 Q 44 34 44 40 L 44 49 L 48 49 Z" fill="#15803d" />
        {/* Right arm */}
        <path d="M 60 62 L 68 62 L 68 48 Q 68 44 72 44 Q 76 44 76 48 L 76 56 L 60 56 Z" fill="#16a34a" />
        {/* Blooming red flower on cactus */}
        <circle cx="54" cy="18" r="3" fill="#f43f5e" />
        {/* Terracotta Urn near base */}
        <ellipse cx="20" cy="74" rx="8" ry="10" fill="#c2410c" />
        <rect x="16" y="62" width="8" height="3" rx="1" fill="#9a3412" />
        <path d="M 14 68 Q 10 74 14 80" stroke="#9a3412" strokeWidth="2" fill="none" />
      </svg>
    </div>

    {/* Papyrus Reeds along bottom */}
    <div className="absolute bottom-1 left-6 z-20 pointer-events-none opacity-85">
      <svg viewBox="0 0 40 25" className="w-10 h-6">
        <line x1="10" y1="25" x2="8" y2="5" stroke="#16a34a" strokeWidth="2" />
        <circle cx="8" cy="5" r="3" fill="#86efac" />
        <line x1="20" y1="25" x2="22" y2="8" stroke="#15803d" strokeWidth="2" />
        <circle cx="22" cy="8" r="2.5" fill="#4ade80" />
      </svg>
    </div>
  </>
);

export const GrecoRomanFoliage: React.FC = () => (
  <>
    {/* Left Mediterranean Cypress Tree & Marble Pedestal */}
    <div className="absolute -top-3 left-2 sm:left-5 z-10 origin-bottom animate-[swayFoliage_5.5s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 75 95" className="w-16 sm:w-20 h-20 sm:h-26 drop-shadow-md">
        {/* Tall Slender Cypress Spires */}
        <ellipse cx="38" cy="40" rx="14" ry="38" fill="#14532d" />
        <ellipse cx="38" cy="38" rx="11" ry="34" fill="#166534" />
        <ellipse cx="38" cy="35" rx="8" ry="28" fill="#15803d" />
        {/* Small Olive Bush next to tree */}
        <ellipse cx="60" cy="72" rx="12" ry="10" fill="#22c55e" />
        <circle cx="56" cy="70" r="1.5" fill="#1e293b" />
        <circle cx="63" cy="74" r="1.5" fill="#1e293b" />
      </svg>
    </div>

    {/* Right Roman Vexillum Banner Standard & Laurel Bush */}
    <div className="absolute -top-2 right-2 sm:right-6 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-md">
        {/* Golden Eagle Standard Pole */}
        <line x1="30" y1="90" x2="30" y2="10" stroke="#eab308" strokeWidth="3" />
        <circle cx="30" cy="8" r="4" fill="#facc15" />
        {/* Crimson Vexillum Cloth with gold fringe (Fluttering) */}
        <g className="animate-[bannerFlutter_3s_ease-in-out_infinite] origin-left">
          <rect x="30" y="15" width="28" height="35" fill="#991b1b" />
          <rect x="30" y="15" width="28" height="4" fill="#eab308" />
          <polygon points="30,50 44,55 58,50" fill="#991b1b" />
          {/* SPQR wreath icon */}
          <circle cx="44" cy="32" r="7" stroke="#eab308" strokeWidth="1.5" fill="none" />
        </g>
        {/* Laurel Bush at base */}
        <ellipse cx="56" cy="78" rx="15" ry="10" fill="#15803d" />
        <ellipse cx="58" cy="76" rx="11" ry="7" fill="#22c55e" />
      </svg>
    </div>

    {/* Lower Laurel Leaves along pathway */}
    <div className="absolute bottom-1 right-8 z-20 pointer-events-none opacity-90">
      <svg viewBox="0 0 35 20" className="w-9 h-5">
        <ellipse cx="12" cy="12" rx="7" ry="4" fill="#16a34a" transform="rotate(-15 12 12)" />
        <ellipse cx="22" cy="10" rx="7" ry="4" fill="#22c55e" transform="rotate(20 22 10)" />
      </svg>
    </div>
  </>
);

export const NormanFjordFoliage: React.FC = () => (
  <>
    {/* Left Snow-capped Viking Fir Pine Tree */}
    <div className="absolute -top-3 left-2 sm:left-4 z-10 origin-bottom animate-[swayFoliage_5s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 80 95" className="w-18 sm:w-22 h-20 sm:h-26 drop-shadow-md">
        {/* Trunk */}
        <rect x="37" y="65" width="8" height="25" fill="#332211" />
        {/* Pine Tier 3 */}
        <polygon points="41,35 15,70 67,70" fill="#0f382c" />
        <polygon points="41,35 25,50 41,52 57,50" fill="#e2e8f0" opacity="0.9" />
        {/* Pine Tier 2 */}
        <polygon points="41,20 22,48 60,48" fill="#134e3f" />
        <polygon points="41,20 30,34 41,36 52,34" fill="#f1f5f9" opacity="0.9" />
        {/* Pine Tier 1 (Top) */}
        <polygon points="41,5 28,28 54,28" fill="#166534" />
        <polygon points="41,5 34,16 41,18 48,16" fill="#ffffff" />
      </svg>
    </div>

    {/* Right Viking Rune Stone & Shield in Snow */}
    <div className="absolute -top-1 right-2 sm:right-6 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 85" className="w-16 sm:w-20 h-18 sm:h-22 drop-shadow-md">
        {/* Ancient Gray Runestone */}
        <path d="M 38 85 L 34 25 Q 46 15 56 25 L 54 85 Z" fill="#475569" />
        {/* Glowing Norse Runes */}
        <path d="M 44 32 L 44 68 M 44 42 L 50 36 M 44 54 L 50 48 M 44 48 L 38 54" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" className="animate-pulse shadow-[0_0_8px_#38bdf8]" />
        {/* Wooden Viking Round Shield resting against stone */}
        <circle cx="22" cy="70" r="14" fill="#0284c7" stroke="#eab308" strokeWidth="2.5" />
        <circle cx="22" cy="70" r="4" fill="#94a3b8" />
        <line x1="22" y1="56" x2="22" y2="84" stroke="#eab308" strokeWidth="1.5" />
      </svg>
    </div>

    {/* Drifting Snowflakes */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <span className="absolute top-2 left-1/4 text-white text-xs opacity-75 animate-[leafDrift_4s_linear_infinite] [--drift-x:30px] [--drift-y:180px] [--rot:120deg]">❄</span>
      <span className="absolute top-4 left-1/2 text-cyan-200 text-[10px] opacity-80 animate-[leafDrift_5s_linear_infinite_1.5s] [--drift-x:45px] [--drift-y:180px] [--rot:240deg]">❅</span>
      <span className="absolute top-1 right-1/4 text-white text-xs opacity-70 animate-[leafDrift_4.5s_linear_infinite_2.5s] [--drift-x:35px] [--drift-y:180px] [--rot:180deg]">❆</span>
    </div>
  </>
);

export const MedievalFortressFoliage: React.FC = () => (
  <>
    {/* Left Castle Wall Climbing Ivy & Brambles */}
    <div className="absolute -top-2 left-2 sm:left-4 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-md">
        {/* Stone Pillar */}
        <rect x="15" y="15" width="22" height="75" fill="#374151" stroke="#1f2937" strokeWidth="2" />
        {/* Creeping Ivy Vine */}
        <path d="M 26 90 Q 18 65 28 45 Q 36 30 24 15" stroke="#15803d" strokeWidth="3" fill="none" />
        <circle cx="20" cy="70" r="4" fill="#22c55e" />
        <circle cx="30" cy="55" r="4.5" fill="#16a34a" />
        <circle cx="24" cy="35" r="4" fill="#4ade80" />
        <circle cx="28" cy="20" r="3.5" fill="#22c55e" />
        {/* Rose Bush at base with glowing red blooms */}
        <ellipse cx="48" cy="78" rx="14" ry="10" fill="#166534" />
        <circle cx="44" cy="74" r="3" fill="#e11d48" />
        <circle cx="52" cy="78" r="2.5" fill="#f43f5e" />
      </svg>
    </div>

    {/* Right Medieval Royal Heraldry Banner */}
    <div className="absolute -top-2 right-2 sm:right-6 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-md">
        {/* Iron Spearhead Pole */}
        <line x1="25" y1="90" x2="25" y2="8" stroke="#71717a" strokeWidth="3" />
        <polygon points="25,2 21,12 29,12" fill="#d4d4d8" />
        {/* Split Pennant Flag (Fluttering) */}
        <g className="animate-[bannerFlutter_3.2s_ease-in-out_infinite] origin-left">
          <polygon points="25,14 68,26 25,38" fill="#701a75" />
          <polygon points="25,38 68,50 25,62" fill="#be185d" />
          <circle cx="36" cy="26" r="3.5" fill="#fbbf24" />
          <circle cx="36" cy="50" r="3.5" fill="#fbbf24" />
        </g>
        {/* Thorny bramble at base */}
        <ellipse cx="50" cy="80" rx="15" ry="8" fill="#1e293b" />
        <path d="M 40 80 Q 48 70 56 80" stroke="#059669" strokeWidth="2" fill="none" />
      </svg>
    </div>

    {/* Drifting Rose Petals */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <span className="absolute top-2 left-1/3 text-rose-400 text-xs opacity-80 animate-[leafDrift_4.5s_ease-out_infinite] [--drift-x:40px] [--drift-y:160px] [--rot:210deg]">🌸</span>
      <span className="absolute top-4 right-1/3 text-pink-400 text-[10px] opacity-75 animate-[leafDrift_5s_ease-out_infinite_2s] [--drift-x:-35px] [--drift-y:160px] [--rot:-160deg]">🌸</span>
    </div>
  </>
);

export const RenaissanceFoliage: React.FC = () => (
  <>
    {/* Left Sculpted Topiary & Potted Citrus Lemon Tree */}
    <div className="absolute -top-3 left-2 sm:left-4 z-10 origin-bottom animate-[swayFoliage_6s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 75 95" className="w-16 sm:w-20 h-20 sm:h-26 drop-shadow-md">
        {/* Classical Terracotta Vase */}
        <polygon points="26,95 44,95 48,70 22,70" fill="#ea580c" />
        <ellipse cx="35" cy="70" rx="13" ry="3" fill="#c2410c" />
        {/* Sculpted Ball Topiary Tree */}
        <rect x="33" y="48" width="4" height="24" fill="#78350f" />
        <circle cx="35" cy="38" r="18" fill="#15803d" />
        <circle cx="33" cy="34" r="14" fill="#22c55e" />
        {/* Golden Lemons */}
        <circle cx="28" cy="36" r="2.5" fill="#facc15" />
        <circle cx="38" cy="42" r="2.5" fill="#fde047" />
        <circle cx="41" cy="32" r="2" fill="#facc15" />
      </svg>
    </div>

    {/* Right Venetian Rose Trellis & Ironwork Lantern */}
    <div className="absolute -top-2 right-2 sm:right-6 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-md">
        {/* Wooden Trellis Lattice */}
        <line x1="20" y1="20" x2="60" y2="85" stroke="#a16207" strokeWidth="2" />
        <line x1="60" y1="20" x2="20" y2="85" stroke="#a16207" strokeWidth="2" />
        <line x1="30" y1="15" x2="30" y2="90" stroke="#a16207" strokeWidth="2" />
        <line x1="50" y1="15" x2="50" y2="90" stroke="#a16207" strokeWidth="2" />
        {/* Blooming Magenta Roses */}
        <circle cx="30" cy="35" r="5" fill="#c026d3" />
        <circle cx="48" cy="45" r="6" fill="#db2777" />
        <circle cx="35" cy="60" r="5" fill="#e11d48" />
        <circle cx="52" cy="72" r="6" fill="#f43f5e" />
        {/* Foliage leaves */}
        <circle cx="24" cy="40" r="3" fill="#16a34a" />
        <circle cx="56" cy="48" r="3.5" fill="#22c55e" />
      </svg>
    </div>

    {/* Drifting Flower Petals */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <span className="absolute top-2 left-1/4 text-fuchsia-300 text-xs opacity-80 animate-[leafDrift_4.5s_linear_infinite] [--drift-x:40px] [--drift-y:170px] [--rot:190deg]">🌺</span>
      <span className="absolute top-4 right-1/3 text-rose-300 text-xs opacity-75 animate-[leafDrift_5.5s_linear_infinite_2s] [--drift-x:-35px] [--drift-y:170px] [--rot:-140deg]">🌸</span>
    </div>
  </>
);

export const IndustrialFoliage: React.FC = () => (
  <>
    {/* Left Steam Pipes & Pressure Gauge */}
    <div className="absolute -top-2 left-2 sm:left-4 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-md">
        {/* Iron Pipeline */}
        <path d="M 15 90 L 15 35 L 55 35 L 55 90" stroke="#475569" strokeWidth="8" fill="none" />
        <path d="M 15 90 L 15 35 L 55 35 L 55 90" stroke="#64748b" strokeWidth="4" fill="none" />
        {/* Pipe Flange Joints */}
        <rect x="10" y="55" width="10" height="4" fill="#94a3b8" />
        <rect x="50" y="55" width="10" height="4" fill="#94a3b8" />
        {/* Brass Gauge */}
        <circle cx="35" cy="35" r="9" fill="#d97706" stroke="#92400e" strokeWidth="2" />
        <circle cx="35" cy="35" r="7" fill="#fef3c7" />
        <line x1="35" y1="35" x2="38" y2="30" stroke="#dc2626" strokeWidth="1.5" />
        {/* Steam Puffs */}
        <circle cx="58" cy="30" r="5" fill="#e2e8f0" opacity="0.6" className="animate-ping" />
      </svg>
    </div>

    {/* Right Stacks of Iron Cogwheels & Fuel Barrels */}
    <div className="absolute -top-1 right-2 sm:right-6 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 85" className="w-16 sm:w-20 h-18 sm:h-22 drop-shadow-md">
        {/* Heavy Iron Gear */}
        <g className="animate-[rotateSlow_14s_linear_infinite] origin-[35px_42px]">
          <circle cx="35" cy="42" r="16" fill="#334155" stroke="#64748b" strokeWidth="3" />
          <circle cx="35" cy="42" r="6" fill="#0f172a" />
          {/* Teeth */}
          <rect x="33" y="22" width="4" height="6" fill="#64748b" />
          <rect x="33" y="56" width="4" height="6" fill="#64748b" />
          <rect x="15" y="40" width="6" height="4" fill="#64748b" />
          <rect x="49" y="40" width="6" height="4" fill="#64748b" />
        </g>
        {/* Oil Drum at base */}
        <rect x="42" y="55" width="22" height="28" rx="2" fill="#0369a1" stroke="#075985" strokeWidth="2" />
        <line x1="42" y1="64" x2="64" y2="64" stroke="#0284c7" strokeWidth="1.5" />
        <line x1="42" y1="73" x2="64" y2="73" stroke="#0284c7" strokeWidth="1.5" />
      </svg>
    </div>
  </>
);

export const ModernWarfrontFoliage: React.FC = () => (
  <>
    {/* Left Camouflage Bunker Netting & Radio Mast */}
    <div className="absolute -top-2 left-2 sm:left-4 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-md">
        {/* Radio Antenna Mast with blinking light */}
        <line x1="22" y1="90" x2="22" y2="15" stroke="#475569" strokeWidth="2.5" />
        <line x1="16" y1="28" x2="28" y2="28" stroke="#475569" strokeWidth="2" />
        <circle cx="22" cy="12" r="3" fill="#ef4444" className="animate-ping" />
        {/* Sandbags Cluster at base */}
        <rect x="10" y="72" width="24" height="8" rx="3" fill="#78716c" stroke="#44403c" strokeWidth="1.5" />
        <rect x="26" y="72" width="24" height="8" rx="3" fill="#a8a29e" stroke="#44403c" strokeWidth="1.5" />
        <rect x="18" y="65" width="24" height="8" rx="3" fill="#78716c" stroke="#44403c" strokeWidth="1.5" />
      </svg>
    </div>

    {/* Right Dragon's Teeth Concrete Obstacle & Warning Barrier */}
    <div className="absolute -top-1 right-2 sm:right-6 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 85" className="w-16 sm:w-20 h-18 sm:h-22 drop-shadow-md">
        {/* Concrete Dragon's Tooth Pyramid */}
        <polygon points="25,85 42,45 58,85" fill="#52525b" stroke="#3f3f46" strokeWidth="2" />
        {/* Hazard Stripes Barrier */}
        <rect x="35" y="60" width="35" height="10" fill="#facc15" stroke="#18181b" strokeWidth="1.5" />
        <line x1="42" y1="60" x2="48" y2="70" stroke="#18181b" strokeWidth="2.5" />
        <line x1="52" y1="60" x2="58" y2="70" stroke="#18181b" strokeWidth="2.5" />
        <line x1="62" y1="60" x2="68" y2="70" stroke="#18181b" strokeWidth="2.5" />
      </svg>
    </div>
  </>
);

export const DigitalMatrixFoliage: React.FC = () => (
  <>
    {/* Left Holographic Wireframe Cyber Tree */}
    <div className="absolute -top-3 left-2 sm:left-4 z-10 origin-bottom animate-[swayFoliage_5s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 80 95" className="w-18 sm:w-22 h-20 sm:h-26 drop-shadow-[0_0_10px_#f97316]">
        {/* Circuit Trunk */}
        <line x1="38" y1="95" x2="38" y2="40" stroke="#f97316" strokeWidth="3" />
        <line x1="38" y1="65" x2="20" y2="45" stroke="#f97316" strokeWidth="2" />
        <line x1="38" y1="55" x2="58" y2="38" stroke="#fb923c" strokeWidth="2" />
        {/* Holographic Glowing Polyhedral Leaves */}
        <polygon points="38,20 22,40 54,40" stroke="#f97316" strokeWidth="1.5" fill="#f9731622" />
        <polygon points="38,8 14,32 62,32" stroke="#fdba74" strokeWidth="1.5" fill="#fb923c15" />
        {/* Data Nodes */}
        <circle cx="38" cy="8" r="3" fill="#f97316" className="animate-pulse" />
        <circle cx="20" cy="45" r="2.5" fill="#38bdf8" className="animate-pulse" />
        <circle cx="58" cy="38" r="2.5" fill="#38bdf8" className="animate-pulse" />
      </svg>
    </div>

    {/* Right Digital Crystal Pylon & Neon Conduits */}
    <div className="absolute -top-2 right-2 sm:right-6 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-[0_0_12px_#38bdf8]">
        {/* Floating Neon Monolith */}
        <polygon points="38,15 52,38 38,82 24,38" stroke="#38bdf8" strokeWidth="2" fill="#0284c733" />
        <polygon points="38,22 46,38 38,70 30,38" fill="#38bdf866" className="animate-pulse" />
        {/* Orbiting Data Rings */}
        <ellipse cx="38" cy="45" rx="22" ry="7" stroke="#f97316" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
      </svg>
    </div>

    {/* Drifting Cyber Stream Glyphs */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <span className="absolute top-2 left-1/3 text-orange-400 font-mono text-[10px] opacity-80 animate-[leafDrift_3.5s_linear_infinite] [--drift-x:20px] [--drift-y:170px] [--rot:0deg]">01</span>
      <span className="absolute top-4 right-1/4 text-cyan-300 font-mono text-[10px] opacity-80 animate-[leafDrift_4s_linear_infinite_1.5s] [--drift-x:-25px] [--drift-y:170px] [--rot:0deg]">10</span>
    </div>
  </>
);

export const CosmicSpaceFoliage: React.FC = () => (
  <>
    {/* Left Astral Star-Crystal Spires & Space Flora */}
    <div className="absolute -top-3 left-2 sm:left-4 z-10 origin-bottom animate-[swayFoliage_5s_ease-in-out_infinite] pointer-events-none">
      <svg viewBox="0 0 80 95" className="w-18 sm:w-22 h-20 sm:h-26 drop-shadow-[0_0_15px_#d946ef]">
        {/* Crystal Spire Cluster */}
        <polygon points="38,10 46,55 38,90 30,55" fill="#d946ef" stroke="#f0abfc" strokeWidth="1.5" />
        <polygon points="22,30 30,65 22,88 15,65" fill="#a855f7" stroke="#d8b4fe" strokeWidth="1.5" />
        <polygon points="54,25 60,60 52,88 46,60" fill="#c084fc" stroke="#f5d0fe" strokeWidth="1.5" />
        {/* Shimmer Light Flare */}
        <circle cx="38" cy="10" r="3" fill="#ffffff" className="animate-ping" />
      </svg>
    </div>

    {/* Right Orbiting Void Shard & Stardust Flora */}
    <div className="absolute -top-2 right-2 sm:right-6 z-10 origin-bottom pointer-events-none">
      <svg viewBox="0 0 75 90" className="w-16 sm:w-20 h-20 sm:h-24 drop-shadow-[0_0_15px_#a855f7]">
        {/* Floating Asteroid with Bioluminescent Flora */}
        <ellipse cx="38" cy="50" rx="18" ry="12" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
        {/* Glowing Nebula Flower */}
        <circle cx="38" cy="38" r="6" fill="#f43f5e" className="animate-pulse shadow-[0_0_10px_#f43f5e]" />
        <circle cx="32" cy="40" r="4" fill="#fb7185" />
        <circle cx="44" cy="40" r="4" fill="#fb7185" />
        <circle cx="38" cy="34" r="4" fill="#fda4af" />
        {/* Orbiting Stardust mote */}
        <ellipse cx="38" cy="48" rx="25" ry="8" stroke="#d946ef" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
      </svg>
    </div>

    {/* Drifting Stardust Particles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <span className="absolute top-2 left-1/4 text-fuchsia-300 text-xs opacity-90 animate-[leafDrift_4s_ease-in-out_infinite] [--drift-x:35px] [--drift-y:160px] [--rot:180deg]">✦</span>
      <span className="absolute top-4 right-1/3 text-cyan-200 text-xs opacity-90 animate-[leafDrift_4.5s_ease-in-out_infinite_1.8s] [--drift-x:-30px] [--drift-y:160px] [--rot:-180deg]">✧</span>
    </div>
  </>
);

export const StageFoliage: React.FC<{ era: number }> = ({ era }) => {
  switch (era) {
    case 1:
      return <PrimitiveFoliage />;
    case 2:
      return <AncientOasisFoliage />;
    case 3:
      return <GrecoRomanFoliage />;
    case 4:
      return <NormanFjordFoliage />;
    case 5:
      return <MedievalFortressFoliage />;
    case 6:
      return <RenaissanceFoliage />;
    case 7:
      return <IndustrialFoliage />;
    case 8:
      return <ModernWarfrontFoliage />;
    case 9:
      return <DigitalMatrixFoliage />;
    case 10:
      return <CosmicSpaceFoliage />;
    default:
      return <PrimitiveFoliage />;
  }
};
