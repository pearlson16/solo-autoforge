import React from 'react';
import type { EraVisualTheme } from './EraThemes';
import { StageFoliage } from './StageDecorations';

interface BattlefieldSceneryProps {
  eraTheme: EraVisualTheme;
  era: number;
}

export const BattlefieldScenery: React.FC<BattlefieldSceneryProps> = ({ eraTheme, era }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. SKY & CELESTIAL BACKDROP */}
      <div className={`absolute inset-0 bg-gradient-to-b ${eraTheme.skyGradient} transition-all duration-700`} />

      {/* Dynamic Celestial Body / Sky Elements per Era */}
      {era === 1 && (
        <>
          {/* Volcanic Twilight Sun & Ash */}
          <div className="absolute top-3 left-12 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 blur-sm opacity-60" />
          <div className="absolute top-2 right-1/4 w-32 h-10 bg-stone-800/40 rounded-full blur-xl animate-[driftClouds_18s_ease-in-out_infinite]" />
        </>
      )}

      {era === 2 && (
        <>
          {/* Blazing Desert Golden Sun */}
          <div className="absolute top-2 right-16 w-20 h-20 rounded-full bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 shadow-[0_0_40px_rgba(251,191,36,0.5)] opacity-80" />
          <div className="absolute top-1/4 inset-x-0 h-12 bg-amber-500/10 blur-lg" />
        </>
      )}

      {era === 3 && (
        <>
          {/* Mediterranean Evening Moon & Starfield */}
          <div className="absolute top-3 left-16 w-12 h-12 rounded-full bg-amber-100/80 shadow-[0_0_20px_rgba(254,240,138,0.4)]" />
          <div className="absolute top-4 right-12 text-yellow-200/50 text-xs animate-[twinkleStar_3s_ease-in-out_infinite]">✦</div>
          <div className="absolute top-8 right-24 text-yellow-200/40 text-[10px] animate-[twinkleStar_2s_ease-in-out_infinite_1s]">✧</div>
        </>
      )}

      {era === 4 && (
        <>
          {/* Arctic Aurora Borealis Wave */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-emerald-400/25 via-cyan-500/15 to-transparent blur-md animate-[auroraWave_7s_ease-in-out_infinite]" />
          <div className="absolute top-2 right-1/3 w-2/3 h-16 bg-gradient-to-r from-transparent via-teal-300/20 to-transparent blur-lg animate-[auroraWave_5s_ease-in-out_infinite_2s]" />
          <div className="absolute top-3 right-10 w-10 h-10 rounded-full bg-cyan-100/90 shadow-[0_0_25px_rgba(103,232,249,0.7)]" />
        </>
      )}

      {era === 5 && (
        <>
          {/* Stormy Gothic Moonlight & Purple Haze */}
          <div className="absolute top-2 right-12 w-14 h-14 rounded-full bg-purple-100/70 shadow-[0_0_30px_rgba(192,132,252,0.4)]" />
          <div className="absolute top-1 left-1/4 w-40 h-12 bg-purple-950/60 rounded-full blur-xl animate-[driftClouds_14s_ease-in-out_infinite]" />
        </>
      )}

      {era === 6 && (
        <>
          {/* Romantic Venetian Sunset / Twilight */}
          <div className="absolute top-3 left-1/3 w-16 h-16 rounded-full bg-gradient-to-t from-fuchsia-400 to-rose-300 opacity-60 blur-xs" />
          <div className="absolute top-6 right-16 text-rose-200/60 text-xs animate-[twinkleStar_3s_ease-in-out_infinite]">✦</div>
        </>
      )}

      {era === 7 && (
        <>
          {/* Industrial Smog & Furnace Glow */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-amber-950/40 via-stone-900/60 to-transparent blur-md" />
          <div className="absolute top-2 left-10 w-24 h-8 bg-amber-600/20 rounded-full blur-xl" />
          <div className="absolute top-4 right-1/4 w-36 h-12 bg-orange-700/20 rounded-full blur-2xl animate-pulse" />
        </>
      )}

      {era === 8 && (
        <>
          {/* Searchlights sweeping night sky */}
          <div className="absolute -top-10 left-1/4 w-12 h-44 bg-gradient-to-t from-transparent via-indigo-400/15 to-transparent rotate-25 blur-sm origin-bottom animate-[driftClouds_8s_ease-in-out_infinite]" />
          <div className="absolute -top-10 right-1/4 w-12 h-44 bg-gradient-to-t from-transparent via-cyan-400/15 to-transparent -rotate-25 blur-sm origin-bottom animate-[driftClouds_10s_ease-in-out_infinite_1s]" />
          {/* Blinking red antenna towers */}
          <div className="absolute top-4 left-1/3 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] animate-ping" />
          <div className="absolute top-6 right-1/4 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] animate-ping" />
        </>
      )}

      {era === 9 && (
        <>
          {/* Cyber Neon Matrix Grid & Digital Streams */}
          <div
            className="absolute inset-x-0 top-0 h-28 opacity-25"
            style={{
              backgroundImage: 'linear-gradient(rgba(249, 115, 22, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              transform: 'perspective(200px) rotateX(45deg)',
              transformOrigin: 'top',
            }}
          />
          <div className="absolute top-2 right-12 text-orange-400/80 text-xs font-mono animate-pulse">010101</div>
          <div className="absolute top-5 left-10 text-cyan-400/70 text-[10px] font-mono animate-pulse">SYS:ONLINE</div>
        </>
      )}

      {era === 10 && (
        <>
          {/* Cosmic Nebula, Ringed Planet, & Starfield */}
          <div className="absolute top-1 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-700 to-indigo-950 shadow-[0_0_35px_rgba(217,70,239,0.5)] opacity-85">
            {/* Planet Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-6 border-y-2 border-fuchsia-300/60 rounded-full rotate-[-25deg] shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
          </div>
          {/* Starfield points */}
          <div className="absolute top-3 left-10 text-white/90 text-xs animate-[twinkleStar_2s_ease-in-out_infinite]">★</div>
          <div className="absolute top-7 left-28 text-fuchsia-300/80 text-[10px] animate-[twinkleStar_3s_ease-in-out_infinite_1s]">✦</div>
          <div className="absolute top-4 left-1/2 text-cyan-300/90 text-[11px] animate-[twinkleStar_2.5s_ease-in-out_infinite_0.5s]">✧</div>
          <div className="absolute top-9 right-1/3 text-purple-200/70 text-[9px] animate-[twinkleStar_3.5s_ease-in-out_infinite_1.5s]">★</div>
        </>
      )}

      {/* 2. SILHOUETTE HORIZON SCENERY (SVG Landscape per Era) */}
      <div className="absolute top-0 inset-x-0 h-24 overflow-hidden z-0 opacity-70">
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="w-full h-full">
          {era === 1 && (
            // Primitive Volcanoes & Jagged Peaks
            <g fill="#0b170c" opacity="0.9">
              <polygon points="0,120 70,35 150,120 220,50 310,120 400,25 490,120 600,45 690,120 780,20 870,120 950,40 1000,120" />
              <polygon points="380,30 400,25 420,30 400,15" fill="#f97316" opacity="0.6" className="animate-pulse" />
              <polygon points="760,25 780,20 800,25 780,10" fill="#ef4444" opacity="0.7" className="animate-pulse" />
            </g>
          )}

          {era === 2 && (
            // Ancient Egyptian Pyramids & Dunes
            <g fill="#2d1705" opacity="0.9">
              <polygon points="0,120 120,40 240,120" />
              <polygon points="180,120 320,20 460,120" fill="#3b1f09" />
              <polygon points="650,120 760,35 870,120" />
              <polygon points="780,120 890,15 1000,120" fill="#3b1f09" />
            </g>
          )}

          {era === 3 && (
            // Roman Colosseum & Greco Temple Silhouettes
            <g fill="#0f2314" opacity="0.9">
              {/* Colosseum arches */}
              <rect x="120" y="30" width="140" height="90" rx="10" />
              <rect x="135" y="45" width="20" height="35" rx="10" fill="#1b3d24" />
              <rect x="165" y="45" width="20" height="35" rx="10" fill="#1b3d24" />
              <rect x="195" y="45" width="20" height="35" rx="10" fill="#1b3d24" />
              <rect x="225" y="45" width="20" height="35" rx="10" fill="#1b3d24" />
              {/* Temple */}
              <polygon points="700,45 780,15 860,45" />
              <rect x="710" y="45" width="12" height="75" />
              <rect x="740" y="45" width="12" height="75" />
              <rect x="770" y="45" width="12" height="75" />
              <rect x="800" y="45" width="12" height="75" />
              <rect x="830" y="45" width="12" height="75" />
            </g>
          )}

          {era === 4 && (
            // Viking Fjords & Pine Trees
            <g fill="#0d1829" opacity="0.95">
              <polygon points="0,120 100,15 220,120 340,30 480,120 620,10 750,120 890,20 1000,120" />
              {/* Pine tree spires */}
              <polygon points="50,120 70,60 90,120" fill="#08101c" />
              <polygon points="250,120 270,50 290,120" fill="#08101c" />
              <polygon points="520,120 540,55 560,120" fill="#08101c" />
              <polygon points="820,120 840,45 860,120" fill="#08101c" />
            </g>
          )}

          {era === 5 && (
            // Medieval Castle Towers & Battlements
            <g fill="#181122" opacity="0.95">
              {/* Left Castle */}
              <rect x="80" y="30" width="60" height="90" />
              <polygon points="70,30 110,5 150,30" />
              <rect x="140" y="50" width="80" height="70" />
              <rect x="150" y="40" width="10" height="15" />
              <rect x="175" y="40" width="10" height="15" />
              <rect x="200" y="40" width="10" height="15" />
              {/* Right Fortress */}
              <rect x="760" y="45" width="90" height="75" />
              <rect x="770" y="35" width="12" height="15" />
              <rect x="800" y="35" width="12" height="15" />
              <rect x="830" y="35" width="12" height="15" />
              <rect x="850" y="20" width="60" height="100" />
              <polygon points="840,20 880,0 920,20" />
            </g>
          )}

          {era === 6 && (
            // Renaissance Italian Cathedrals & Palaces
            <g fill="#1f0f29" opacity="0.95">
              {/* Dome */}
              <ellipse cx="200" cy="55" rx="45" ry="40" />
              <rect x="155" y="55" width="90" height="65" />
              <rect x="195" y="5" width="10" height="20" />
              {/* Campanile Bell Tower */}
              <rect x="260" y="15" width="30" height="105" />
              <polygon points="255,15 275,0 295,15" />
              {/* Right Palace */}
              <rect x="700" y="35" width="140" height="85" />
              <ellipse cx="890" cy="50" rx="40" ry="35" />
              <rect x="850" y="50" width="80" height="70" />
            </g>
          )}

          {era === 7 && (
            // Industrial Smokestacks & Factory Silhouettes
            <g fill="#1a120c" opacity="0.95">
              {/* Smokestack 1 */}
              <rect x="100" y="15" width="22" height="105" />
              <rect x="95" y="10" width="32" height="8" />
              {/* Smokestack 2 */}
              <rect x="160" y="25" width="28" height="95" />
              <rect x="155" y="20" width="38" height="8" />
              {/* Factory roof sawtooth */}
              <polygon points="200,120 230,60 230,120 260,60 260,120 290,60 290,120" />
              {/* Right Industrial Complex */}
              <rect x="720" y="35" width="30" height="85" />
              <rect x="780" y="10" width="26" height="110" />
              <rect x="775" y="5" width="36" height="8" />
              <polygon points="820,120 860,50 860,120 900,50 900,120" />
            </g>
          )}

          {era === 8 && (
            // Modern Warfront Skyscrapers & Barricades
            <g fill="#0b111e" opacity="0.95">
              <rect x="90" y="20" width="45" height="100" />
              <rect x="145" y="40" width="35" height="80" />
              <rect x="190" y="10" width="55" height="110" />
              <line x1="217" y1="10" x2="217" y2="0" stroke="#0b111e" strokeWidth="4" />
              <rect x="720" y="25" width="60" height="95" />
              <rect x="790" y="15" width="45" height="105" />
              <rect x="845" y="35" width="55" height="85" />
            </g>
          )}

          {era === 9 && (
            // Cyber Grid Neon Skyscrapers
            <g fill="#0c0717" stroke="#f97316" strokeWidth="0.8" opacity="0.9">
              <rect x="100" y="15" width="50" height="105" />
              <rect x="160" y="35" width="40" height="85" />
              <rect x="210" y="10" width="60" height="110" />
              <rect x="710" y="20" width="55" height="100" />
              <rect x="775" y="5" width="65" height="115" />
              <rect x="850" y="30" width="45" height="90" />
            </g>
          )}

          {era === 10 && (
            // Cosmic Asteroid Shards & Stargate Obelisks
            <g fill="#090414" opacity="0.95">
              <polygon points="120,120 150,40 180,120" />
              <polygon points="210,120 230,60 260,120" />
              <polygon points="720,120 750,50 780,120" />
              <polygon points="810,120 840,30 870,120" />
            </g>
          )}
        </svg>
      </div>

      {/* 3. TERRAIN / GROUND LEVEL WITH RICH TEXTURING */}
      <div
        className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-32 sm:h-36 border-y border-black/40 shadow-2xl flex flex-col justify-between overflow-hidden"
        style={{ backgroundColor: eraTheme.groundColor }}
      >
        {/* Upper Terrain Texture & Edge */}
        <div className="w-full h-4 relative overflow-hidden opacity-80 border-b border-black/20">
          {/* Subtle grass blades / rock crust pattern */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(${eraTheme.accentColor}33 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
            }}
          />
        </div>

        {/* 4. THE BATTLE ARENA PATH / ROADWAY */}
        <div
          className="w-full h-18 sm:h-20 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-center border-y-2"
          style={{
            backgroundColor: eraTheme.pathColor,
            borderColor: `${eraTheme.accentColor}55`,
          }}
        >
          {/* Era-Specific Road Surface Patterns */}
          {era === 1 && (
            // Prehistoric trampled dirt and rough stone pebbles
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff22_2px,transparent_2px)] [background-size:16px_16px]" />
          )}

          {era === 2 && (
            // Desert sandstone slabs
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'linear-gradient(90deg, #d9770633 1px, transparent 1px), linear-gradient(#d9770622 1px, transparent 1px)',
                backgroundSize: '28px 18px',
              }}
            />
          )}

          {era === 3 && (
            // Roman paved limestone slabs
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ffffff25 2px, transparent 2px), linear-gradient(#00000030 2px, transparent 2px)',
                backgroundSize: '32px 20px',
              }}
            />
          )}

          {era === 4 && (
            // Viking frost-covered oak planks
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'linear-gradient(90deg, #38bdf833 2px, transparent 2px)',
                backgroundSize: '24px 100%',
              }}
            />
          )}

          {era === 5 && (
            // Medieval royal cobblestones
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: 'radial-gradient(#00000055 3px, transparent 3px), radial-gradient(#ffffff22 2px, transparent 2px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
              }}
            />
          )}

          {era === 6 && (
            // Renaissance Venetian geometric marble mosaic
            <div
              className="absolute inset-0 opacity-45"
              style={{
                backgroundImage: 'linear-gradient(45deg, #c084fc22 25%, transparent 25%), linear-gradient(-45deg, #c084fc22 25%, transparent 25%)',
                backgroundSize: '24px 24px',
              }}
            />
          )}

          {era === 7 && (
            // Industrial riveted diamond steel grating
            <div
              className="absolute inset-0 opacity-45"
              style={{
                backgroundImage: 'linear-gradient(45deg, #00000060 25%, transparent 25%), linear-gradient(-45deg, #00000060 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #00000060 75%), linear-gradient(-45deg, transparent 75%, #00000060 75%)',
                backgroundSize: '16px 16px',
              }}
            />
          )}

          {era === 8 && (
            // Modern military tarmac with hazard stripes
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-50">
              <div className="w-full h-1 border-t-2 border-dashed border-amber-400/80" />
            </div>
          )}

          {era === 9 && (
            // Cyberpunk neon data grid lines
            <div
              className="absolute inset-0 opacity-60 animate-[matrixGridScan_2s_linear_infinite]"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(249,115,22,0.4) 1px, transparent 1px), linear-gradient(rgba(249,115,22,0.4) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          )}

          {era === 10 && (
            // Cosmic celestial stardust rift
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage: 'radial-gradient(circle, #f0abfc55 1.5px, transparent 1.5px), radial-gradient(circle, #818cf844 2px, transparent 2px)',
                backgroundSize: '20px 20px, 35px 35px',
              }}
            />
          )}

          {/* Central Lane Guide Line */}
          <div className="w-full h-0.5 border-t border-dashed border-white/20" />
        </div>

        {/* Lower Terrain Edge */}
        <div className="w-full h-4 relative overflow-hidden opacity-80 border-t border-black/20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(${eraTheme.accentColor}33 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
            }}
          />
        </div>
      </div>

      {/* 5. ANIMATED PROPS & FLICKERING LIGHTS (Torches, Crystals, Beacons) */}
      {/* Left Prop (Near Hero spawn area) */}
      <div className="absolute top-10 left-5 sm:left-10 z-10 flex flex-col items-center pointer-events-none">
        {/* Animated Torch / Flame / Beacon */}
        <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.9)] animate-[flickerTorch_1.5s_ease-in-out_infinite]" />
        <div className="w-1.5 h-7 bg-amber-950 border border-black/50 rounded-xs shadow-md" />
      </div>

      {/* Right Prop (Near Boss spawn area) */}
      <div className="absolute top-10 right-5 sm:right-10 z-10 flex flex-col items-center pointer-events-none">
        {/* Animated Torch / Flame / Beacon matching era accent */}
        <div
          className="w-4 h-4 rounded-full shadow-[0_0_15px_currentColor] animate-[flickerTorch_1.8s_ease-in-out_infinite_0.3s]"
          style={{ backgroundColor: eraTheme.accentColor, color: eraTheme.accentColor }}
        />
        <div className="w-1.5 h-7 bg-stone-900 border border-black/50 rounded-xs shadow-md" />
      </div>

      {/* 6. ERA-SPECIFIC FOLIAGE, PLANTS, TREES & LEVEL DECORATIONS */}
      <StageFoliage era={era} />

      {/* 7. COMBAT SPOTLIGHT / RADIAL AMBIENT GLOW */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: eraTheme.accentColor }}
      />
    </div>
  );
};
