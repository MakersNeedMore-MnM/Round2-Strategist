import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { rankDonorsForRequest } from '../../services/bloodMatching.ts';
import { Donor, EmergencyRequest } from '../../types.ts';

export const SmartDonorMatching: React.FC = () => {
  const {
    currentHospital,
    donors,
    requests,
    activeRequestIdForMatching,
    escalateRequestRadius,
  } = useApp();

  const activeRequest: EmergencyRequest =
    requests.find((r) => r.id === activeRequestIdForMatching) ||
    requests.find((r) => r.blood_group === 'O-') ||
    requests[0] || {
      id: 'REQ-EMERGENCY-01',
      hospital_id: currentHospital.id,
      hospital_name: currentHospital.name,
      hospital_address: currentHospital.address,
      blood_group: 'O-',
      units_required: 2,
      urgency: 'CRITICAL',
      latitude: currentHospital.latitude,
      longitude: currentHospital.longitude,
      search_radius_km: 5,
      required_by: 'Within 2 hours',
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

  const [radiusKm, setRadiusKm] = useState<number>(activeRequest.search_radius_km || 5);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<string | null>(null);
  const [isEscalating, setIsEscalating] = useState<boolean>(false);

  const rankedResults = rankDonorsForRequest(
    donors,
    activeRequest.blood_group,
    currentHospital.latitude,
    currentHospital.longitude,
    activeRequest.urgency,
    radiusKm
  );

  const handleRadiusChange = (newRadius: number) => {
    setRadiusKm(newRadius);
    escalateRequestRadius(activeRequest.id, newRadius);
  };

  const handleSimulateAutoEscalation = () => {
    setIsEscalating(true);
    handleRadiusChange(5);
    setTimeout(() => {
      handleRadiusChange(10);
      setTimeout(() => {
        handleRadiusChange(25);
        setIsEscalating(false);
      }, 1200);
    }, 1200);
  };

  const scale = 360 / (radiusKm * 2.4);
  const getCoordinates = (lat: number, lon: number) => {
    const latDiff = lat - currentHospital.latitude;
    const lonDiff = lon - currentHospital.longitude;
    const yKm = -latDiff * 111;
    const xKm = lonDiff * 88;
    const px = 200 + xKm * scale;
    const py = 200 + yKm * scale;
    return { x: Math.max(15, Math.min(385, px)), y: Math.max(15, Math.min(385, py)) };
  };

  return (
    <div className="bg-[#F5F0E7] text-[#252820] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        {/* 1. Header with Breadcrumb */}
        <div className="border-b border-[#D8D0C3] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#596451] font-mono block mb-2">
              INTELLIGENCE / RADAR & GEO-MATCHING
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#252820] leading-none">
              Real-time donor coupling & radar
            </h1>
            <p className="text-xs text-[#596451] mt-3 tracking-wide">
              Deterministic RBC Compatibility, Multi-Tier Radius Escalation & Proximity Vectors
            </p>
          </div>

          {/* Active Requisition Summary */}
          <div className="border border-[#D8D0C3] p-4 bg-white flex items-center gap-4">
            <span className="font-serif text-3xl font-bold text-[#A94A4A]">
              {activeRequest.blood_group}
            </span>
            <div className="text-xs font-mono">
              <span className="text-[#252820] font-bold block">{activeRequest.id}</span>
              <span className="text-[#596451]">
                {activeRequest.units_required} Units · {activeRequest.urgency}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Grid: Left Radar Visual, Right Ranked Donor List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Radar Canvas & Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-[#596451]">
                <Compass className="w-4 h-4 text-[#596451]" />
                <span>Geo-Dispatch Radar</span>
              </div>

              {/* Radius Selectors */}
              <div className="flex items-center gap-2">
                {[5, 10, 25].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRadiusChange(r)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-mono transition-colors border cursor-pointer ${
                      radiusKm === r
                        ? 'bg-[#252820] text-[#F5F0E7] border-[#252820]'
                        : 'border-[#D8D0C3] text-[#596451] hover:border-[#252820]'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            {/* Radar Viewport (Deep Charcoal Canvas) */}
            <div className="relative w-full aspect-square border border-[#2D3126] bg-[#191B16] flex items-center justify-center overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                {/* Distance rings */}
                <circle cx="200" cy="200" r="170" fill="none" stroke="#2D3126" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="200" r="115" fill="none" stroke="#2D3126" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="200" r="60" fill="none" stroke="#3E4435" strokeWidth="1" />

                {/* Crosshairs */}
                <line x1="20" y1="200" x2="380" y2="200" stroke="#2D3126" strokeWidth="1" />
                <line x1="200" y1="20" x2="200" y2="380" stroke="#2D3126" strokeWidth="1" />

                {/* Center: Hospital */}
                <circle cx="200" cy="200" r="6" fill="#F5F0E7" />
                <circle cx="200" cy="200" r="12" stroke="#B89A68" strokeWidth="0.75" />
                <text x="200" y="222" textAnchor="middle" fill="#B89A68" fontSize="8" fontFamily="monospace" letterSpacing="1">
                  CITYCARE (BAY)
                </text>

                {/* Range Labels */}
                <text x="205" y="145" fill="#596451" fontSize="8" fontFamily="monospace">
                  5 km
                </text>
                <text x="205" y="90" fill="#596451" fontSize="8" fontFamily="monospace">
                  10 km
                </text>
                <text x="205" y="35" fill="#596451" fontSize="8" fontFamily="monospace">
                  25 km
                </text>

                {/* Donors */}
                {rankedResults.map((item) => {
                  const coords = getCoordinates(item.donor.latitude, item.donor.longitude);
                  const isTop = item.donor.name === 'Priya Sharma';
                  const inRange = item.withinRadius;

                  return (
                    <g
                      key={item.donor.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedDonor(item.donor)}
                    >
                      {isTop && (
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="16"
                          stroke="#A94A4A"
                          strokeWidth="0.75"
                          strokeDasharray="2 2"
                        />
                      )}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={inRange ? (isTop ? '6' : '5') : '3.5'}
                        fill={!inRange ? '#596451' : isTop ? '#A94A4A' : '#B89A68'}
                      />
                      <text
                        x={coords.x + 8}
                        y={coords.y + 3}
                        fill={isTop ? '#F5F0E7' : '#596451'}
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        {item.donor.name.split(' ')[0]} ({item.donor.blood_group})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Escalation Button & Telemetry */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-[10px] text-[#596451] font-mono uppercase tracking-wider">
                Current Sector: {radiusKm} km · {rankedResults.filter((r) => r.withinRadius).length} Donors In-Range
              </span>
              <button
                onClick={handleSimulateAutoEscalation}
                disabled={isEscalating}
                className="w-full sm:w-auto px-5 py-2.5 border border-[#252820] text-[#252820] hover:bg-[#252820] hover:text-[#F5F0E7] text-[9px] uppercase tracking-[0.2em] font-mono transition-colors cursor-pointer"
              >
                {isEscalating ? 'Escalating Radius...' : 'Simulate Auto-Escalation →'}
              </button>
            </div>
          </div>

          {/* Right Column: Ranked Eligible Donors List */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border-b border-[#D8D0C3] pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#252820]">Eligible Donors Ranked</h2>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                  Scored via RBC Compatibility, ETA & Cooldown
                </span>
              </div>
              <span className="text-xs font-mono text-[#596451]">
                {rankedResults.length} Total Evaluated
              </span>
            </div>

            <div className="divide-y divide-[#D8D0C3] border-b border-[#D8D0C3]">
              {rankedResults.slice(0, 6).map((item, idx) => {
                const isExpanded = expandedBreakdownId === item.donor.id;
                const isTop = idx === 0;

                return (
                  <div
                    key={item.donor.id}
                    className={`py-5 transition-colors ${
                      isTop ? 'bg-[#FFF1F2]/25 px-3 -mx-3' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-4">
                        <span className="text-[#596451] font-bold">0{idx + 1}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-xl text-[#252820]">
                              {item.donor.name}
                            </span>
                            <span className="font-serif text-base font-bold text-[#A94A4A]">
                              {item.donor.blood_group}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#596451] block">
                            {item.distance_km.toFixed(1)} km away · ETA ~{Math.round(item.distance_km * 3.2)} min
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-right">
                        <div>
                          <span className="font-serif text-3xl text-[#252820] leading-none block">
                            {item.match_score}
                          </span>
                          <span className="text-[8px] uppercase tracking-[0.2em] text-[#596451]">
                            SCORE / 100
                          </span>
                        </div>

                        <button
                          onClick={() => setExpandedBreakdownId(isExpanded ? null : item.donor.id)}
                          className="p-1 text-[#596451] hover:text-[#252820] cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Breakdown drawer */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-[#D8D0C3] text-[10px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 text-[#596451]">
                        <div>
                          <span>RBC MATCH:</span>
                          <strong className="block text-[#252820]">{item.breakdown.compatibilityScore}/40</strong>
                        </div>
                        <div>
                          <span>DISTANCE:</span>
                          <strong className="block text-[#252820]">{item.breakdown.proximityScore}/25</strong>
                        </div>
                        <div>
                          <span>AVAILABILITY:</span>
                          <strong className="block text-[#252820]">{item.breakdown.availabilityScore}/15</strong>
                        </div>
                        <div>
                          <span>RELIABILITY:</span>
                          <strong className="block text-[#252820]">{item.breakdown.historyScore}/10</strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
