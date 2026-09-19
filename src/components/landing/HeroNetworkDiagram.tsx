import React from 'react';

export const HeroNetworkDiagram: React.FC = () => {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] border border-[#D8D0C3] bg-[#F5F0E7] p-6 sm:p-8 flex flex-col justify-between select-none overflow-hidden">
      {/* Top Editorial Diagram Labels */}
      <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3 text-[9px] uppercase tracking-[0.25em] text-[#596451] font-mono">
        <span>FIG. 01 — SCHEMATIC COUPLING</span>
        <span>LATENCY: 0.84s · PRECISION: 99.4%</span>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative flex-1 flex items-center justify-center my-4">
        <svg
          viewBox="0 0 600 360"
          className="w-full h-full stroke-[#596451]/40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Grid Coordinates */}
          <line x1="50" y1="40" x2="550" y2="40" stroke="#D8D0C3" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="50" y1="180" x2="550" y2="180" stroke="#D8D0C3" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="50" y1="320" x2="550" y2="320" stroke="#D8D0C3" strokeWidth="0.75" strokeDasharray="3 3" />

          <line x1="120" y1="20" x2="120" y2="340" stroke="#D8D0C3" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="300" y1="20" x2="300" y2="340" stroke="#D8D0C3" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="480" y1="20" x2="480" y2="340" stroke="#D8D0C3" strokeWidth="0.75" strokeDasharray="3 3" />

          {/* Primary Connection Line from Hospital to Blood Group to Donor */}
          <path
            d="M 120 180 L 220 120 L 300 180 L 390 230 L 480 180"
            stroke="#252820"
            strokeWidth="1.25"
          />

          {/* Radiating concentric pulse from donor */}
          <circle cx="480" cy="180" r="30" stroke="#A94A4A" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="2 2" />
          <circle cx="480" cy="180" r="50" stroke="#A94A4A" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="2 2" />

          {/* Pulse Signal moving on line */}
          <circle cx="300" cy="180" r="4" fill="#A94A4A">
            <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
          </circle>

          {/* Node 1: Hospital */}
          <circle cx="120" cy="180" r="6" fill="#252820" />
          <circle cx="120" cy="180" r="14" stroke="#252820" strokeWidth="0.75" />

          {/* Node 2: Blood Type / Requisition */}
          <circle cx="220" cy="120" r="4" fill="#B89A68" />
          <line x1="220" y1="120" x2="220" y2="70" stroke="#B89A68" strokeWidth="0.75" />

          {/* Node 3: Core Matching Engine */}
          <circle cx="300" cy="180" r="8" fill="#F5F0E7" stroke="#252820" strokeWidth="1.5" />

          {/* Node 4: Distance vector */}
          <circle cx="390" cy="230" r="3" fill="#596451" />
          <line x1="390" y1="230" x2="390" y2="280" stroke="#596451" strokeWidth="0.75" strokeDasharray="2 2" />

          {/* Node 5: Donor */}
          <circle cx="480" cy="180" r="6" fill="#A94A4A" />
          <circle cx="480" cy="180" r="14" stroke="#A94A4A" strokeWidth="0.75" />
        </svg>

        {/* Floating Typography Labels matching the prompt */}
        {/* Node 1 Label: HOSPITAL */}
        <div className="absolute left-[12%] top-[55%] sm:top-[58%] -translate-x-1/2 text-center">
          <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#252820] font-bold">
            Hospital
          </span>
          <span className="block text-[8px] tracking-[0.15em] text-[#596451] font-mono mt-0.5">
            CityCare Trauma
          </span>
        </div>

        {/* Node 2 Label: O- / BLOOD GROUP */}
        <div className="absolute left-[33%] top-[14%] -translate-x-1/2 text-center">
          <span className="block font-serif text-base sm:text-lg font-bold text-[#A94A4A]">
            O−
          </span>
          <span className="block text-[8px] uppercase tracking-[0.2em] text-[#596451] font-mono">
            2 Units Required
          </span>
        </div>

        {/* Node 3 Label: CORE MATCH */}
        <div className="absolute left-[50%] top-[54%] -translate-x-1/2 text-center">
          <span className="block text-[9px] uppercase tracking-[0.25em] text-[#252820] font-mono font-medium">
            Coupling
          </span>
          <span className="block text-[8px] tracking-[0.15em] text-[#596451] font-mono">
            Score: 94/100
          </span>
        </div>

        {/* Node 4 Label: PROXIMITY VECTOR */}
        <div className="absolute left-[66%] top-[78%] -translate-x-1/2 text-center">
          <span className="block font-mono text-[9px] font-bold tracking-[0.2em] text-[#252820]">
            3.2 KM
          </span>
          <span className="block text-[8px] uppercase tracking-[0.15em] text-[#596451] font-mono">
            ETA: 11 MIN
          </span>
        </div>

        {/* Node 5 Label: DONOR 03 */}
        <div className="absolute right-[10%] top-[55%] sm:top-[58%] translate-x-1/2 text-center">
          <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#A94A4A] font-bold">
            Donor 03
          </span>
          <span className="block text-[8px] tracking-[0.15em] text-[#596451] font-mono mt-0.5">
            Priya Sharma (O−)
          </span>
        </div>
      </div>

      {/* Bottom Sequence Bar: HOSPITAL ↓ O- ↓ DONOR 03 ↓ 3.2 KM */}
      <div className="border-t border-[#D8D0C3] pt-3 flex items-center justify-between text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#596451] font-mono">
        <span className="text-[#252820] font-medium">HOSPITAL</span>
        <span className="text-[#D8D0C3]">↓</span>
        <span className="text-[#A94A4A] font-bold">O−</span>
        <span className="text-[#D8D0C3]">↓</span>
        <span className="text-[#252820] font-medium">DONOR 03</span>
        <span className="text-[#D8D0C3]">↓</span>
        <span className="text-[#B89A68] font-bold">3.2 KM</span>
      </div>
    </div>
  );
};
