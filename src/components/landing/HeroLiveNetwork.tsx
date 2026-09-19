import React, { useState } from 'react';
import { Hospital as HospitalIcon, Shield, Radio, CheckCircle2, Heart } from 'lucide-react';

interface DonorNode {
  id: string;
  name: string;
  bloodGroup: string;
  matchScore: number;
  distance: string;
  eta: string;
  x: number; // percentage
  y: number; // percentage
  status: 'available' | 'responding' | 'in-transit';
}

export const HeroLiveNetwork: React.FC<{ onSelectDonor?: (name: string) => void }> = ({ onSelectDonor }) => {
  const [selectedDonor, setSelectedDonor] = useState<string | null>('Priya Sharma');
  const [activeEmergency] = useState(true);

  const donors: DonorNode[] = [
    {
      id: 'd1',
      name: 'Priya Sharma',
      bloodGroup: 'O-',
      matchScore: 94,
      distance: '3.2 km',
      eta: '11 mins',
      x: 24,
      y: 28,
      status: 'responding',
    },
    {
      id: 'd2',
      name: 'Rahul Verma',
      bloodGroup: 'O-',
      matchScore: 87,
      distance: '5.1 km',
      eta: '16 mins',
      x: 78,
      y: 32,
      status: 'available',
    },
    {
      id: 'd3',
      name: 'Ananya Gupta',
      bloodGroup: 'O-',
      matchScore: 81,
      distance: '7.4 km',
      eta: '22 mins',
      x: 74,
      y: 74,
      status: 'available',
    },
    {
      id: 'd4',
      name: 'Vikram Malhotra',
      bloodGroup: 'O-',
      matchScore: 89,
      distance: '4.8 km',
      eta: '14 mins',
      x: 26,
      y: 76,
      status: 'available',
    },
  ];

  // Center hospital is at x=50, y=50
  const hospitalPos = { x: 50, y: 50 };

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Decorative ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-rose-500/10 via-red-500/5 to-slate-200/40 rounded-3xl blur-xl" />

      {/* Main Canvas Container */}
      <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-7">
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D92D3F]"></span>
            </span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Live Blood Network
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Real-Time Mesh
            </span>
          </div>
        </div>

        {/* Central Visualization Stage */}
        <div className="relative w-full h-[320px] sm:h-[340px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800">
          {/* Subtle Grid Lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Concentric Radar Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-28 h-28 rounded-full border border-red-500/30 animate-pulse" />
            <div className="absolute w-52 h-52 rounded-full border border-slate-700/60" />
            <div className="absolute w-76 h-76 rounded-full border border-slate-800/80 border-dashed" />
          </div>

          {/* SVG Animated Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradActive" x1="50%" y1="50%" x2="24%" y2="28%">
                <stop offset="0%" stopColor="#D92D3F" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="lineGradPassive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D92D3F" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#64748B" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {donors.map((donor) => {
              const isSelected = selectedDonor === donor.name;
              return (
                <g key={donor.id}>
                  {/* Base line */}
                  <line
                    x1={hospitalPos.x}
                    y1={hospitalPos.y}
                    x2={donor.x}
                    y2={donor.y}
                    stroke={isSelected ? 'url(#lineGradActive)' : '#334155'}
                    strokeWidth={isSelected ? '0.9' : '0.5'}
                    strokeDasharray={isSelected ? '2 1.5' : '1.5 2'}
                    className={isSelected ? 'animate-pulse' : ''}
                  />
                  {/* Flowing animated particle circle */}
                  <circle r={isSelected ? '1.4' : '1'} fill={isSelected ? '#10B981' : '#D92D3F'}>
                    <animateMotion
                      path={`M${hospitalPos.x},${hospitalPos.y} L${donor.x},${donor.y}`}
                      dur={isSelected ? '2s' : '3.5s'}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Center Hospital Node */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer group"
            style={{ left: `${hospitalPos.x}%`, top: `${hospitalPos.y}%` }}
          >
            <div className="relative flex items-center justify-center">
              {/* Emergency pulsing aura */}
              {activeEmergency && (
                <div className="absolute -inset-3 rounded-full bg-red-600/30 animate-ping" />
              )}
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-red-600 to-[#0B132B] text-white p-0.5 shadow-lg shadow-red-500/30 flex items-center justify-center border-2 border-red-400">
                <HospitalIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-1.5 bg-slate-900/95 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-slate-700 text-center shadow-lg">
              <span className="text-[11px] font-bold text-white block leading-tight">CityCare Hospital</span>
              <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-widest">Trauma Center</span>
            </div>
          </div>

          {/* Donor Nodes */}
          {donors.map((donor) => {
            const isSelected = selectedDonor === donor.name;
            return (
              <div
                key={donor.id}
                onClick={() => {
                  setSelectedDonor(donor.name);
                  if (onSelectDonor) onSelectDonor(donor.name);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer group transition-transform duration-200 hover:scale-110"
                style={{ left: `${donor.x}%`, top: `${donor.y}%` }}
              >
                <div className="relative">
                  {/* Availability pulse indicator */}
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-900"></span>
                  </span>

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold shadow-md transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900'
                        : 'bg-slate-800 text-slate-100 border border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    🩸
                  </div>
                </div>

                <div
                  className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border backdrop-blur-md whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/60 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800'
                  }`}
                >
                  <span className="font-bold">{donor.name}</span>
                  <span className="ml-1 text-[9px] text-slate-400">({donor.matchScore}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Floating Telemetry Cards as explicitly requested in Prompt */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Card 1: O- Emergency */}
          <div className="bg-red-50/90 border border-red-200/90 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D92D3F] text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
              O−
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-red-950 uppercase tracking-wide block">
                O− Emergency
              </span>
              <span className="text-xs font-bold text-red-700">2 units required</span>
            </div>
          </div>

          {/* Card 2: 12 eligible donors nearby */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                Network Radius
              </span>
              <span className="text-xs font-extrabold text-slate-900">12 eligible donors nearby</span>
            </div>
          </div>

          {/* Card 3: 3.2 km average distance */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                Dispatch Radar
              </span>
              <span className="text-xs font-extrabold text-slate-900">3.2 km average distance</span>
            </div>
          </div>
        </div>

        {/* Interactive Active Donor Match Bar */}
        {selectedDonor && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold text-slate-900">Priority Ranked: {selectedDonor}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700 font-semibold text-[11px]">94 Match Score</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">Transit ETA: ~11 mins</span>
          </div>
        )}
      </div>
    </div>
  );
};
