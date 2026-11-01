import React from 'react';

// Glowing 3D Golden Ingot (ដុំមាស) on Gold Coins
export const GoldIngotIcon: React.FC<{ size?: number; className?: string }> = ({ size = 70, className = '' }) => {
  return (
    <div 
      className={`relative flex items-center justify-center rounded-full p-1 shadow-inner bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a] border-2 border-[#60a5fa] ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full border border-cyan-300 opacity-60 animate-pulse pointer-events-none" />
      
      <svg
        viewBox="0 0 100 100"
        className="w-[85%] h-[85%] drop-shadow-md select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Gradient Base */}
          <linearGradient id="goldBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Ingot Top Highlight */}
          <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Ingot Inner Cavity */}
          <radialGradient id="ingotHollow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </radialGradient>

          {/* Coin Gradient */}
          <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>

        {/* Stack of Coins Base */}
        <g id="coins-pile">
          {/* Bottom row of coins */}
          <ellipse cx="28" cy="80" rx="9" ry="4.5" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />
          <ellipse cx="40" cy="82" rx="9" ry="4.5" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />
          <ellipse cx="52" cy="83" rx="9" ry="4.5" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />
          <ellipse cx="64" cy="82" rx="9" ry="4.5" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />
          <ellipse cx="74" cy="79" rx="8" ry="4" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />

          {/* Second layer coins */}
          <ellipse cx="34" cy="76" rx="8" ry="4" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />
          <ellipse cx="46" cy="77" rx="8.5" ry="4.2" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />
          <ellipse cx="58" cy="76" rx="8.5" ry="4.2" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />
          <ellipse cx="68" cy="75" rx="7.5" ry="3.8" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.8" />

          {/* Top layer coins with inner square hole */}
          <ellipse cx="42" cy="72" rx="7" ry="3.5" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.6" />
          <ellipse cx="54" cy="71" rx="7.5" ry="3.8" fill="url(#coinGrad)" stroke="#78350f" strokeWidth="0.6" />
        </g>

        {/* The Sycee / Gold Ingot Body */}
        <g id="ingot-body" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.4))">
          {/* Main Hull */}
          <path
            d="M 16 42 C 16 42, 22 72, 50 72 C 78 72, 84 42, 84 42 C 84 42, 69 49, 50 49 C 31 49, 16 42, 16 42 Z"
            fill="url(#goldBase)"
            stroke="#92400e"
            strokeWidth="1.2"
          />

          {/* Left Wing curvature */}
          <path
            d="M 16 42 C 12 36, 17 31, 24 33 C 31 35, 34 42, 34 42 C 34 42, 22 41, 16 42 Z"
            fill="url(#goldHighlight)"
            stroke="#92400e"
            strokeWidth="0.8"
          />

          {/* Right Wing curvature */}
          <path
            d="M 84 42 C 88 36, 83 31, 76 33 C 69 35, 66 42, 66 42 C 66 42, 78 41, 84 42 Z"
            fill="url(#goldHighlight)"
            stroke="#92400e"
            strokeWidth="0.8"
          />

          {/* Center rounded dome / top mound */}
          <path
            d="M 28 41 C 28 41, 33 26, 50 26 C 67 26, 72 41, 72 41 C 72 41, 62 48, 50 48 C 38 48, 28 41, 28 41 Z"
            fill="url(#ingotHollow)"
            stroke="#92400e"
            strokeWidth="1"
          />

          {/* Top Crest / Crown oval */}
          <ellipse cx="50" cy="35" rx="14" ry="7" fill="url(#goldHighlight)" />
          <ellipse cx="50" cy="35" rx="10" ry="4.5" fill="#fef08a" opacity="0.8" />

          {/* Bright shine speculars */}
          <ellipse cx="44" cy="33" rx="3.5" ry="1.5" fill="#ffffff" opacity="0.9" />
          <path
            d="M 26 50 C 35 63, 65 63, 74 50"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      </svg>
    </div>
  );
};

// SVG Zodiac Artwork for each of the 12 Khmer figures
export const AnimalArtwork: React.FC<{ number: number; className?: string }> = ({ number, className = 'w-full h-full' }) => {
  switch (number) {
    case 1:
      // ជូត (Rat) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_56958bf8.png"
          alt="1. ជូត"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 2:
      // ឆ្លូវ (Ox) - Deity in white/gold riding sacred white ox/bull
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Ox Body */}
          <ellipse cx="54" cy="68" rx="26" ry="15" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.2" />
          {/* Hump on back (Sacred Zebu) */}
          <path d="M 44 54 C 48 48, 56 48, 60 54 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
          {/* Ox Head */}
          <ellipse cx="76" cy="62" rx="10" ry="11" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
          {/* Horns */}
          <path d="M 74 52 C 73 43, 67 40, 64 38" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 80 52 C 83 43, 89 40, 93 38" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
          {/* Ox Muzzle */}
          <ellipse cx="83" cy="67" rx="5" ry="4" fill="#fda4af" stroke="#e11d48" strokeWidth="0.6" />
          {/* Legs */}
          <line x1="38" y1="78" x2="38" y2="92" stroke="#64748b" strokeWidth="2.5" />
          <line x1="48" y1="80" x2="48" y2="94" stroke="#64748b" strokeWidth="2.5" />
          <line x1="66" y1="80" x2="66" y2="94" stroke="#64748b" strokeWidth="2.5" />
          <line x1="76" y1="76" x2="76" y2="90" stroke="#64748b" strokeWidth="2.5" />
          {/* Rider in red & gold */}
          <ellipse cx="50" cy="46" rx="8" ry="12" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
          <circle cx="50" cy="30" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.8" />
          {/* Spired Crown */}
          <polygon points="50,15 47,25 53,25" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          <circle cx="50" cy="14" r="1.5" fill="#f59e0b" />
          {/* Lotus flower in hand */}
          <circle cx="36" cy="36" r="3.5" fill="#f43f5e" />
        </svg>
      );

    case 3:
      // ខាល (Tiger) - Deity on ferocious striped tiger
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Tiger Body */}
          <ellipse cx="52" cy="70" rx="25" ry="13" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
          {/* Stripes */}
          <path d="M 40 60 L 42 74" stroke="#1c1917" strokeWidth="1.8" />
          <path d="M 48 59 L 51 75" stroke="#1c1917" strokeWidth="1.8" />
          <path d="M 57 60 L 60 74" stroke="#1c1917" strokeWidth="1.8" />
          <path d="M 66 62 L 67 72" stroke="#1c1917" strokeWidth="1.8" />
          {/* Tiger Head */}
          <circle cx="76" cy="65" r="10" fill="#fb923c" stroke="#c2410c" strokeWidth="1" />
          <ellipse cx="83" cy="68" rx="4" ry="3" fill="#fef08a" />
          {/* Whiskers & Fangs */}
          <line x1="84" y1="67" x2="94" y2="65" stroke="#1c1917" strokeWidth="0.8" />
          <line x1="84" y1="70" x2="94" y2="72" stroke="#1c1917" strokeWidth="0.8" />
          {/* Tail */}
          <path d="M 28 68 C 16 66, 15 50, 22 44" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
          {/* Warrior Rider with bow/arrow */}
          <ellipse cx="50" cy="46" rx="8" ry="13" fill="#15803d" stroke="#14532d" strokeWidth="0.8" />
          <circle cx="50" cy="30" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.8" />
          {/* Warrior Crown */}
          <polygon points="50,15 46,25 54,25" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          {/* Bow held */}
          <path d="M 36 22 C 32 34, 32 46, 36 54" stroke="#78350f" strokeWidth="1.5" fill="none" />
          <line x1="36" y1="22" x2="36" y2="54" stroke="#e2e8f0" strokeWidth="0.7" />
        </svg>
      );

    case 4:
      // ថោះ (Rabbit) - Celestial maiden holding a white moon rabbit
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Moon Backdrop */}
          <circle cx="68" cy="45" r="22" fill="#fef3c7" opacity="0.6" />
          {/* Maiden Dress */}
          <path d="M 38 42 L 32 88 L 56 88 L 50 42 Z" fill="#ec4899" stroke="#9d174d" strokeWidth="0.8" />
          <ellipse cx="44" cy="38" rx="6" ry="8" fill="#fb7185" />
          {/* Face */}
          <circle cx="44" cy="24" r="5.5" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.7" />
          {/* Hair & Flowers */}
          <circle cx="39" cy="22" r="3" fill="#18181b" />
          <polygon points="44,12 42,19 46,19" fill="#facc15" stroke="#854d0e" strokeWidth="0.6" />
          {/* White Hare / Rabbit */}
          <ellipse cx="68" cy="62" rx="14" ry="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="76" cy="54" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          {/* Rabbit Ears */}
          <path d="M 74 48 C 72 34, 76 30, 78 30 C 80 30, 80 38, 78 48 Z" fill="#fed7aa" stroke="#cbd5e1" strokeWidth="0.8" />
          <path d="M 80 48 C 82 35, 87 32, 89 33 C 90 35, 87 42, 84 48 Z" fill="#fed7aa" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Rabbit Eye */}
          <circle cx="78" cy="53" r="1.5" fill="#f43f5e" />
          {/* Fluffy Tail */}
          <circle cx="53" cy="64" r="4.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8" />
        </svg>
      );

    case 5:
      // រោង (Dragon / Naga) - Sovereign Naga serpent king with multi-head hood & deity
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Naga Body coils */}
          <path
            d="M 30 84 C 45 68, 60 92, 75 75 C 85 64, 82 48, 78 38"
            stroke="#15803d"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Gold Naga scales overlay */}
          <path
            d="M 30 84 C 45 68, 60 92, 75 75 C 85 64, 82 48, 78 38"
            stroke="#facc15"
            strokeWidth="2.5"
            strokeDasharray="2 3"
            fill="none"
          />
          {/* Naga Hood / Dragon Crest */}
          <circle cx="78" cy="34" r="10" fill="#166534" stroke="#eab308" strokeWidth="1" />
          <polygon points="78,16 74,26 82,26" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          <polygon points="70,20 70,28 76,26" fill="#f59e0b" />
          <polygon points="86,20 86,28 80,26" fill="#f59e0b" />
          {/* Fiery breath / tongue */}
          <path d="M 86 35 L 94 34 L 88 38 Z" fill="#ef4444" />
          {/* Deity atop Naga */}
          <ellipse cx="45" cy="50" rx="8" ry="12" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.8" />
          <circle cx="45" cy="34" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.7" />
          {/* Spired Crown */}
          <polygon points="45,18 42,28 48,28" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
        </svg>
      );

    case 6:
      // ម្សាញ់ (Snake) - Coiled Green/Blue Sacred Cobra with Deity
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Coiled Serpent */}
          <path
            d="M 60 88 C 78 88, 88 74, 80 62 C 72 52, 60 62, 68 74 C 74 80, 82 78, 86 70"
            stroke="#0284c7"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cobra Hood */}
          <path
            d="M 80 54 C 88 48, 88 36, 80 34 C 72 36, 72 48, 80 54 Z"
            fill="#0369a1"
            stroke="#38bdf8"
            strokeWidth="1"
          />
          {/* Snake Eyes & Forked Tongue */}
          <circle cx="78" cy="38" r="1.5" fill="#facc15" />
          <circle cx="82" cy="38" r="1.5" fill="#facc15" />
          <path d="M 80 32 L 80 26 L 77 23 M 80 26 L 83 23" stroke="#ef4444" strokeWidth="0.8" />
          {/* Deity in Orange/Gold */}
          <ellipse cx="40" cy="52" rx="9" ry="14" fill="#f97316" stroke="#c2410c" strokeWidth="0.8" />
          <circle cx="40" cy="34" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.7" />
          {/* Crown */}
          <polygon points="40,18 37,28 43,28" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          {/* Trident in hand */}
          <line x1="26" y1="22" x2="26" y2="75" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 22 22 L 26 28 L 30 22 M 26 17 L 26 28" stroke="#facc15" strokeWidth="1.2" />
        </svg>
      );

    case 7:
      // មមី (Horse) - Radiant celestial rider on a noble white steed
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* White Horse Body */}
          <ellipse cx="50" cy="68" rx="24" ry="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
          {/* Horse Neck & Head */}
          <path d="M 64 62 L 78 40 L 86 46 L 74 70 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          {/* Mane */}
          <path d="M 68 50 C 64 45, 60 52, 62 60" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 72 44 C 68 39, 64 46, 66 54" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
          {/* Snout & Bridle */}
          <circle cx="82" cy="44" r="1.5" fill="#1e293b" />
          <line x1="72" y1="44" x2="84" y2="50" stroke="#ef4444" strokeWidth="0.8" />
          {/* Tail */}
          <path d="M 28 66 C 18 64, 14 78, 18 88" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          {/* Legs */}
          <line x1="36" y1="78" x2="32" y2="92" stroke="#94a3b8" strokeWidth="2.2" />
          <line x1="44" y1="80" x2="42" y2="94" stroke="#94a3b8" strokeWidth="2.2" />
          <line x1="62" y1="80" x2="65" y2="94" stroke="#94a3b8" strokeWidth="2.2" />
          {/* Rider in red & gold */}
          <ellipse cx="48" cy="46" rx="8" ry="12" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
          <circle cx="48" cy="28" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.7" />
          {/* Spired Crown */}
          <polygon points="48,13 45,23 51,23" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          {/* Flag / Pennant */}
          <line x1="38" y1="16" x2="38" y2="55" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="38,16 26,22 38,28" fill="#f59e0b" />
        </svg>
      );

    case 8:
      // មមែ (Goat) - Celestial guardian with sacred mountain goat
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Goat Body */}
          <ellipse cx="56" cy="68" rx="22" ry="13" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
          {/* Goat Head */}
          <ellipse cx="76" cy="60" rx="9" ry="8" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
          {/* Curved Horns */}
          <path d="M 72 54 C 66 42, 60 40, 56 42" stroke="#475569" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 76 52 C 72 38, 66 36, 62 38" stroke="#475569" strokeWidth="2.8" strokeLinecap="round" />
          {/* Beard */}
          <path d="M 80 66 L 82 74 L 77 70 Z" fill="#94a3b8" />
          {/* Legs */}
          <line x1="42" y1="78" x2="42" y2="92" stroke="#64748b" strokeWidth="2.2" />
          <line x1="52" y1="80" x2="52" y2="93" stroke="#64748b" strokeWidth="2.2" />
          <line x1="68" y1="80" x2="68" y2="93" stroke="#64748b" strokeWidth="2.2" />
          {/* Rider */}
          <ellipse cx="46" cy="46" rx="8" ry="12" fill="#16a34a" stroke="#15803d" strokeWidth="0.8" />
          <circle cx="46" cy="30" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.7" />
          {/* Crown */}
          <polygon points="46,15 43,24 49,24" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
        </svg>
      );

    case 9:
      // វក (Monkey / Hanuman) - Royal Monkey warrior general
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Mount leopard / bear */}
          <ellipse cx="54" cy="74" rx="22" ry="12" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          {/* Tail */}
          <path d="M 32 74 C 20 72, 16 60, 20 50" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          {/* Hanuman Warrior Body */}
          <ellipse cx="50" cy="48" rx="10" ry="14" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8" />
          {/* Monkey Head with golden mask */}
          <circle cx="50" cy="32" r="7.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <ellipse cx="50" cy="34" rx="4" ry="3.5" fill="#fed7aa" />
          {/* Monkey Ears */}
          <circle cx="43" cy="32" r="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
          <circle cx="57" cy="32" r="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
          {/* Hanuman Crown / Mokot */}
          <polygon points="50,14 46,25 54,25" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          {/* Club / Gada in hand */}
          <line x1="34" y1="24" x2="44" y2="52" stroke="#78350f" strokeWidth="2" />
          <circle cx="33" cy="22" r="4" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
        </svg>
      );

    case 10:
      // រកា (Rooster) - Golden Rooster with colorful plumage & deity
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Large Majestic Rooster */}
          <ellipse cx="62" cy="66" rx="18" ry="15" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
          {/* Tail Feathers arching up */}
          <path d="M 46 64 C 36 50, 30 36, 40 26 C 44 38, 42 54, 46 64" fill="#047857" />
          <path d="M 44 66 C 30 56, 24 44, 34 34 C 38 46, 38 58, 44 66" fill="#1d4ed8" />
          <path d="M 42 70 C 26 64, 20 54, 28 46 C 34 56, 36 64, 42 70" fill="#dc2626" />
          {/* Rooster Head & Red Comb */}
          <circle cx="76" cy="54" r="8" fill="#ea580c" stroke="#b45309" strokeWidth="0.8" />
          {/* Comb */}
          <path d="M 72 46 C 72 38, 76 38, 78 46 C 80 38, 84 39, 83 48 Z" fill="#ef4444" />
          {/* Wattle */}
          <ellipse cx="78" cy="62" rx="2.5" ry="4" fill="#ef4444" />
          {/* Beak */}
          <polygon points="84,54 92,56 84,59" fill="#fde047" stroke="#ca8a04" strokeWidth="0.6" />
          {/* Divine guardian standing beside/atop */}
          <ellipse cx="48" cy="46" rx="7" ry="11" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
          <circle cx="48" cy="30" r="5.5" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.7" />
          {/* Crown */}
          <polygon points="48,16 45,25 51,25" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
        </svg>
      );

    case 11:
      // ច (Dog) - Loyal hound / tiger-dog with celestial rider
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Dog Body */}
          <ellipse cx="54" cy="70" rx="23" ry="13" fill="#b45309" stroke="#78350f" strokeWidth="1" />
          {/* Head */}
          <ellipse cx="76" cy="62" rx="9" ry="8" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          {/* Snout */}
          <ellipse cx="84" cy="64" rx="4" ry="3" fill="#1c1917" />
          {/* Floppy / alert ear */}
          <polygon points="73,55 70,44 78,50" fill="#78350f" />
          {/* Curled bushy tail */}
          <path d="M 32 68 C 22 60, 26 44, 34 46" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          {/* Legs */}
          <line x1="38" y1="80" x2="38" y2="94" stroke="#78350f" strokeWidth="2.2" />
          <line x1="48" y1="82" x2="48" y2="94" stroke="#78350f" strokeWidth="2.2" />
          <line x1="68" y1="82" x2="68" y2="94" stroke="#78350f" strokeWidth="2.2" />
          {/* Rider */}
          <ellipse cx="48" cy="48" rx="8" ry="12" fill="#15803d" stroke="#14532d" strokeWidth="0.8" />
          <circle cx="48" cy="32" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.7" />
          {/* Crown */}
          <polygon points="48,17 45,26 51,26" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
        </svg>
      );

    case 12:
      // កុរ (Pig) - Celestial rider on holy golden boar/pig
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          {/* Pig Body */}
          <ellipse cx="56" cy="70" rx="24" ry="15" fill="#fbcfe8" stroke="#f43f5e" strokeWidth="1.2" />
          {/* Snout */}
          <ellipse cx="82" cy="72" rx="5" ry="4" fill="#fda4af" stroke="#e11d48" strokeWidth="1" />
          <circle cx="81" cy="72" r="1" fill="#881337" />
          <circle cx="83" cy="72" r="1" fill="#881337" />
          {/* Pig Eye & Ear */}
          <circle cx="76" cy="65" r="1.5" fill="#1c1917" />
          <polygon points="72,60 70,50 78,54" fill="#f43f5e" />
          {/* Curly tail */}
          <path d="M 32 68 C 24 64, 22 74, 26 76 C 30 78, 30 72, 28 70" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Sturdy Trotters / Legs */}
          <line x1="42" y1="82" x2="42" y2="94" stroke="#f43f5e" strokeWidth="3" />
          <line x1="52" y1="84" x2="52" y2="94" stroke="#f43f5e" strokeWidth="3" />
          <line x1="68" y1="84" x2="68" y2="94" stroke="#f43f5e" strokeWidth="3" />
          {/* Rider */}
          <ellipse cx="48" cy="46" rx="8" ry="12" fill="#1e40af" stroke="#1e3a8a" strokeWidth="0.8" />
          <circle cx="48" cy="30" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.7" />
          {/* Crown */}
          <polygon points="48,15 45,24 51,24" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
        </svg>
      );

    default:
      return null;
  }
};
