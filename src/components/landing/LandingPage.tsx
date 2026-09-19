import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { HeroNetworkDiagram } from './HeroNetworkDiagram.tsx';

interface LandingPageProps {
  onOpenCreateRequest?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenCreateRequest }) => {
  const { setCurrentRole, setActiveTab } = useApp();

  const handleEnterNetwork = () => {
    setCurrentRole('HOSPITAL');
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFindBlood = () => {
    setCurrentRole('HOSPITAL');
    setActiveTab('dashboard');
    if (onOpenCreateRequest) {
      onOpenCreateRequest();
    }
  };

  const handleBecomeDonor = () => {
    setCurrentRole('DONOR');
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F5F0E7] text-[#252820] min-h-screen selection:bg-[#A94A4A] selection:text-[#F5F0E7]">
      {/* =========================================================================
          1. HERO SECTION (Editorial split layout with scientific network diagram)
      ========================================================================== */}
      <section className="border-b border-[#D8D0C3] pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Small Top Label */}
          <div className="mb-8 sm:mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              THE BLOOD NETWORK
            </span>
          </div>

          {/* Editorial Grid: Left Large Statement, Right Paragraph & Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: 7 Columns for Headline & Action */}
            <div className="lg:col-span-7 space-y-10">
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#252820]">
                When every minute matters,{' '}
                <span className="italic block mt-2 text-[#252820] font-normal">
                  the right connection matters.
                </span>
              </h1>

              <div className="pt-2 max-w-xl">
                <p className="text-[#596451] text-base sm:text-lg leading-relaxed font-light">
                  BloodBridge AI connects hospitals with nearby eligible donors during emergencies while helping healthcare networks anticipate potential blood shortages.
                </p>
              </div>

              {/* Rectangular, thin-bordered, elegant buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  id="hero-find-blood-btn"
                  onClick={handleFindBlood}
                  className="px-8 py-4 bg-[#252820] text-[#F5F0E7] hover:bg-[#A94A4A] border border-[#252820] hover:border-[#A94A4A] text-xs uppercase tracking-[0.25em] font-medium transition-all cursor-pointer"
                >
                  Find Blood
                </button>
                <button
                  id="hero-become-donor-btn"
                  onClick={handleBecomeDonor}
                  className="px-8 py-4 bg-transparent text-[#252820] hover:text-[#A94A4A] border border-[#D8D0C3] hover:border-[#A94A4A] text-xs uppercase tracking-[0.25em] font-medium transition-all cursor-pointer"
                >
                  Become a Donor
                </button>
              </div>
            </div>

            {/* Right: 5 Columns for Scientific Abstract Visualization */}
            <div className="lg:col-span-5 lg:pt-4">
              <HeroNetworkDiagram />
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#596451]">
                <span>Automated Haversine Routing</span>
                <span>Sub-15m Donor Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PROBLEM SECTION (01 — THE PROBLEM)
      ========================================================================== */}
      <section id="the-problem" className="border-b border-[#D8D0C3] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16 sm:space-y-24">
          {/* Micro-Label */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              01 — THE PROBLEM
            </span>
          </div>

          {/* Asymmetrical Editorial Statement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-baseline">
            <div className="lg:col-span-8">
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#252820]">
                A blood shortage is not only an inventory problem.{' '}
                <span className="italic block mt-3 font-normal text-[#A94A4A]">
                  It is a time problem.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-4 lg:border-l lg:border-[#D8D0C3] lg:pl-10">
              <p className="text-[#596451] text-base leading-relaxed font-light">
                Hospitals may struggle to identify compatible nearby donors quickly, while donor information, emergency communication and blood availability can remain fragmented.
              </p>
            </div>
          </div>

          {/* Horizontal Sequence: REQUEST → SEARCH → CALL → WAIT → RESPOND */}
          <div className="pt-10 border-t border-[#D8D0C3]">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
              <div className="py-4 border-b sm:border-b-0 sm:border-r border-[#D8D0C3]">
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#596451] mb-2 font-mono">01 · REQUISITION</span>
                <span className="font-serif text-2xl sm:text-3xl text-[#252820]">Request</span>
              </div>
              <div className="py-4 border-b sm:border-b-0 sm:border-r border-[#D8D0C3]">
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#596451] mb-2 font-mono">02 · DISCOVERY</span>
                <span className="font-serif text-2xl sm:text-3xl text-[#252820]">Search</span>
              </div>
              <div className="py-4 border-b sm:border-b-0 sm:border-r border-[#D8D0C3]">
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#596451] mb-2 font-mono">03 · OUTREACH</span>
                <span className="font-serif text-2xl sm:text-3xl text-[#252820]">Call</span>
              </div>
              <div className="py-4 border-b sm:border-b-0 sm:border-r border-[#D8D0C3]">
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#596451] mb-2 font-mono">04 · CRITICAL GAP</span>
                <span className="font-serif text-2xl sm:text-3xl text-[#A94A4A] italic">Wait</span>
              </div>
              <div className="py-4">
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#596451] mb-2 font-mono">05 · RESOLUTION</span>
                <span className="font-serif text-2xl sm:text-3xl text-[#252820]">Respond</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. THE BLOODBRIDGE IDEA / NETWORK (02 — THE NETWORK)
      ========================================================================== */}
      <section id="network" className="border-b border-[#D8D0C3] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          {/* Micro-Label */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              02 — THE NETWORK
            </span>
          </div>

          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl sm:text-6xl leading-tight text-[#252820]">
              One network.{' '}
              <span className="italic font-normal block mt-1">
                Every connection matters.
              </span>
            </h2>
          </div>

          {/* Three Large Editorial Columns with Thin Vertical Divider Lines */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8D0C3] border-t border-b border-[#D8D0C3] py-8 sm:py-12">
            {/* Column 1: DONORS */}
            <div className="py-6 md:py-0 md:pr-10 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#596451] block">
                [ I ]
              </span>
              <h3 className="font-serif text-3xl text-[#252820]">Donors</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-[#596451]">
                Available donors · Donation history · Location · Emergency response
              </p>
              <p className="text-sm text-[#596451] leading-relaxed font-light">
                Registered donors receive geo-fenced emergency requisitions tailored precisely to their clinical group and verified cooldown interval.
              </p>
            </div>

            {/* Column 2: HOSPITALS */}
            <div className="py-6 md:py-0 md:px-10 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#596451] block">
                [ II ]
              </span>
              <h3 className="font-serif text-3xl text-[#252820]">Hospitals</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-[#596451]">
                Blood inventory · Emergency requests · Donor matching · Verification
              </p>
              <p className="text-sm text-[#596451] leading-relaxed font-light">
                Healthcare centers maintain real-time reserve telemetry across all 8 standard RBC units with instant 1-tap emergency broadcasts.
              </p>
            </div>

            {/* Column 3: INTELLIGENCE */}
            <div className="py-6 md:py-0 md:pl-10 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#596451] block">
                [ III ]
              </span>
              <h3 className="font-serif text-3xl text-[#252820]">Intelligence</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-[#596451]">
                Smart ranking · Geo-matching · Escalation · Shortage prediction
              </p>
              <p className="text-sm text-[#596451] leading-relaxed font-light">
                Autonomous heuristic engine continuously forecasts supply depletion windows and optimizes responder dispatch pathways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. EMERGENCY MATCHING SECTION (03 — THE RESPONSE)
          Dramatic dark editorial section
      ========================================================================== */}
      <section id="how-it-works" className="bg-[#191B16] text-[#F5F0E7] py-24 sm:py-36 border-b border-[#2A2D23]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-20">
          {/* Micro-Label in Dark Mode */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B89A68] font-mono block">
              03 — THE RESPONSE
            </span>
          </div>

          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-tight text-[#F5F0E7]">
              From emergency request{' '}
              <span className="italic font-normal block mt-2 text-[#D8D0C3]">
                to the right donor.
              </span>
            </h2>
          </div>

          {/* Horizontal Visual Process with thin connecting lines */}
          <div className="border border-[#2D3126] bg-[#141511] p-6 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-4 relative text-center">
              {/* Step 1 */}
              <div className="space-y-3 pb-6 sm:pb-0 border-b sm:border-b-0 sm:border-r border-[#2D3126]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89A68] font-mono block">
                  01 · REQUEST
                </span>
                <span className="font-serif text-2xl text-[#F5F0E7] block">O− · 2 Units</span>
                <span className="text-[11px] text-[#A5AFA0] block font-light">CityCare Trauma Bay</span>
              </div>

              {/* Step 2 */}
              <div className="space-y-3 pb-6 sm:pb-0 border-b sm:border-b-0 sm:border-r border-[#2D3126]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89A68] font-mono block">
                  02 · MATCH
                </span>
                <span className="font-serif text-2xl text-[#F5F0E7] block">12 Eligible</span>
                <span className="text-[11px] text-[#A5AFA0] block font-light">Haversine 5 km sector</span>
              </div>

              {/* Step 3 */}
              <div className="space-y-3 pb-6 sm:pb-0 border-b sm:border-b-0 sm:border-r border-[#2D3126]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89A68] font-mono block">
                  03 · RANK
                </span>
                <span className="font-serif text-2xl text-[#B89A68] block">94 Match</span>
                <span className="text-[11px] text-[#A5AFA0] block font-light">Scored on availability</span>
              </div>

              {/* Step 4 */}
              <div className="space-y-3 pb-6 sm:pb-0 border-b sm:border-b-0 sm:border-r border-[#2D3126]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89A68] font-mono block">
                  04 · NOTIFY
                </span>
                <span className="font-serif text-2xl text-[#F5F0E7] block">3.2 km Away</span>
                <span className="text-[11px] text-[#A5AFA0] block font-light">Push alert sent</span>
              </div>

              {/* Step 5 */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89A68] font-mono block">
                  05 · RESPOND
                </span>
                <span className="font-serif text-2xl text-[#A94A4A] italic block">Confirmed</span>
                <span className="text-[11px] text-[#A5AFA0] block font-light">ETA 11 min logged</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              5. DONOR MATCHING UI (Minimal embedded interface inside editorial page)
          ========================================================================== */}
          <div className="border border-[#2D3126] bg-[#141511] p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#2D3126] pb-4 gap-2">
              <div>
                <h3 className="font-serif text-2xl text-[#F5F0E7]">Nearby donors</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A5AFA0] font-mono">
                  Active Emergency Requisition #REQ-2026-09
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#B89A68] font-mono">
                Real-Time Dispatch Matrix
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Ranked Donor List */}
              <div className="lg:col-span-8 divide-y divide-[#2D3126]">
                {/* 01 PRIYA */}
                <div className="py-4 flex items-center justify-between text-xs font-mono tracking-wider">
                  <div className="flex items-center gap-4">
                    <span className="text-[#B89A68]">01</span>
                    <span className="font-serif text-lg text-[#F5F0E7]">PRIYA</span>
                  </div>
                  <div className="flex items-center gap-6 text-[#A5AFA0]">
                    <span className="text-[#A94A4A] font-bold">O−</span>
                    <span>3.2 KM</span>
                    <span className="text-[#B89A68]">AVAILABLE</span>
                  </div>
                </div>

                {/* 02 RAHUL */}
                <div className="py-4 flex items-center justify-between text-xs font-mono tracking-wider">
                  <div className="flex items-center gap-4">
                    <span className="text-[#A5AFA0]">02</span>
                    <span className="font-serif text-lg text-[#F5F0E7]">RAHUL</span>
                  </div>
                  <div className="flex items-center gap-6 text-[#A5AFA0]">
                    <span className="text-[#A94A4A] font-bold">O−</span>
                    <span>5.1 KM</span>
                    <span className="text-[#B89A68]">AVAILABLE</span>
                  </div>
                </div>

                {/* 03 ANANYA */}
                <div className="py-4 flex items-center justify-between text-xs font-mono tracking-wider">
                  <div className="flex items-center gap-4">
                    <span className="text-[#A5AFA0]">03</span>
                    <span className="font-serif text-lg text-[#F5F0E7]">ANANYA</span>
                  </div>
                  <div className="flex items-center gap-6 text-[#A5AFA0]">
                    <span className="text-[#A94A4A] font-bold">O−</span>
                    <span>7.4 KM</span>
                    <span className="text-[#B89A68]">AVAILABLE</span>
                  </div>
                </div>
              </div>

              {/* Right: Oversized Score & Rationale */}
              <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#2D3126] pt-6 lg:pt-0 lg:pl-8 text-center sm:text-left space-y-3">
                <span className="font-serif text-7xl font-light text-[#F5F0E7] block leading-none">
                  94
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89A68] font-mono block">
                  MATCH SCORE
                </span>
                <p className="text-xs text-[#A5AFA0] tracking-wider uppercase font-mono">
                  Nearby · Available · Eligible
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setCurrentRole('HOSPITAL');
                      setActiveTab('matching');
                    }}
                    className="w-full py-2.5 px-4 bg-transparent border border-[#B89A68] text-[#B89A68] hover:bg-[#B89A68] hover:text-[#191B16] text-[10px] uppercase tracking-[0.2em] font-mono transition-colors cursor-pointer"
                  >
                    Open Live Geo-Radar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SHORTAGE PREDICTION (04 — THE FORECAST)
      ========================================================================== */}
      <section id="shortage-prediction" className="border-b border-[#D8D0C3] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          {/* Micro-Label */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              04 — THE FORECAST
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-4xl sm:text-6xl text-[#252820]">
                Don’t wait{' '}
                <span className="italic block mt-1 font-normal text-[#252820]">
                  for the shortage.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[#596451] text-base leading-relaxed font-light">
                BloodBridge analyzes inventory, historical demand, donation trends and emergency patterns to identify potential shortage risks before clinical reserves drop into critical deficits.
              </p>
            </div>
          </div>

          {/* Editorial Data Visualization: Thin Line Chart & Shaded Forecast Area */}
          <div className="border border-[#D8D0C3] bg-white p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D8D0C3] pb-4 gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#252820] font-mono font-medium">
                7-Day Burn Rate vs. Projected Intake
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                Bay Area Regional Health Network
              </span>
            </div>

            {/* SVG Editorial Chart */}
            <div className="w-full h-48 sm:h-64 relative">
              <svg viewBox="0 0 800 240" className="w-full h-full" fill="none">
                {/* Subtle Gridlines */}
                <line x1="40" y1="40" x2="760" y2="40" stroke="#D8D0C3" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="760" y2="100" stroke="#D8D0C3" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="160" x2="760" y2="160" stroke="#D8D0C3" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="220" x2="760" y2="220" stroke="#252820" strokeWidth="1" />

                {/* Shaded Forecast Area (Days 4 to 7) */}
                <rect x="440" y="20" width="320" height="200" fill="#F5F0E7" opacity="0.75" />
                <line x1="440" y1="20" x2="440" y2="220" stroke="#B89A68" strokeWidth="1" strokeDasharray="4 4" />

                {/* Forecast Divider Label */}
                <text x="448" y="36" fill="#B89A68" fontSize="9" fontFamily="monospace" letterSpacing="2">
                  FORECAST WINDOW
                </text>

                {/* Line 1: Historical Inventory (Declining) */}
                <path
                  d="M 40 70 L 140 85 L 240 110 L 340 145 L 440 160 L 540 185 L 640 200 L 760 215"
                  stroke="#A94A4A"
                  strokeWidth="1.75"
                />

                {/* Line 2: Anticipated Baseline Demand */}
                <path
                  d="M 40 120 L 140 115 L 240 130 L 340 125 L 440 135 L 540 140 L 640 135 L 760 142"
                  stroke="#596451"
                  strokeWidth="1.25"
                  strokeDasharray="4 3"
                />

                {/* Critical Threshold Line */}
                <line x1="40" y1="180" x2="760" y2="180" stroke="#A94A4A" strokeWidth="0.75" strokeDasharray="2 2" />
                <text x="50" y="174" fill="#A94A4A" fontSize="9" fontFamily="monospace" letterSpacing="1">
                  CRITICAL DEFICIT THRESHOLD
                </text>
              </svg>
            </div>

            {/* Below Chart: Risk Level Matrix (O- CRITICAL, A- MODERATE, B+ STABLE) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D8D0C3] border-t border-[#D8D0C3] pt-6 text-left">
              {/* O- Critical */}
              <div className="pb-4 sm:pb-0 sm:pr-6 space-y-1">
                <span className="font-serif text-3xl font-bold text-[#A94A4A]">O−</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#A94A4A] font-mono font-bold block">
                  CRITICAL RISK
                </span>
                <span className="text-[11px] text-[#596451] font-mono block">
                  48 HOUR FORECAST · 2 UNITS REMAINING
                </span>
              </div>

              {/* A- Moderate */}
              <div className="py-4 sm:py-0 sm:px-6 space-y-1">
                <span className="font-serif text-3xl font-bold text-[#252820]">A−</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#B89A68] font-mono font-bold block">
                  MODERATE
                </span>
                <span className="text-[11px] text-[#596451] font-mono block">
                  DEPLETION ESTIMATE: 5 DAYS
                </span>
              </div>

              {/* B+ Stable */}
              <div className="pt-4 sm:pt-0 sm:pl-6 space-y-1">
                <span className="font-serif text-3xl font-bold text-[#252820]">B+</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#596451] font-mono font-bold block">
                  STABLE
                </span>
                <span className="text-[11px] text-[#596451] font-mono block">
                  NORMAL BUFFER (31 UNITS)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. HOSPITAL EXPERIENCE (FOR HOSPITALS)
      ========================================================================== */}
      <section className="border-b border-[#D8D0C3] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          {/* Micro-Label */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              FOR HOSPITALS
            </span>
          </div>

          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl sm:text-6xl text-[#252820]">
              See what is available.{' '}
              <span className="italic block mt-1 font-normal">
                Know what is coming.
              </span>
            </h2>
          </div>

          {/* Minimal Inventory Interface (Table instead of Cards) */}
          <div className="border border-[#D8D0C3] bg-white p-6 sm:p-10 space-y-8">
            <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-4">
              <span className="font-serif text-xl text-[#252820]">CityCare Central Hospital · Live Inventory</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                Updated 3 mins ago
              </span>
            </div>

            {/* Inventory table with thin horizontal rules */}
            <div className="divide-y divide-[#D8D0C3]">
              <div className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-serif text-xl text-[#252820]">A+</span>
                <div className="flex items-center gap-6">
                  <span className="font-mono text-sm text-[#252820]">42 Units</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">STABLE</span>
                </div>
              </div>

              <div className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-serif text-xl text-[#252820]">A−</span>
                <div className="flex items-center gap-6">
                  <span className="font-mono text-sm text-[#252820]">07 Units</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89A68] font-mono">WARNING</span>
                </div>
              </div>

              <div className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-serif text-xl text-[#252820]">B+</span>
                <div className="flex items-center gap-6">
                  <span className="font-mono text-sm text-[#252820]">31 Units</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">STABLE</span>
                </div>
              </div>

              <div className="py-3.5 flex items-center justify-between text-xs sm:text-sm bg-[#FFF1F2]/40 px-2 -mx-2">
                <span className="font-serif text-xl text-[#A94A4A] font-bold">O−</span>
                <div className="flex items-center gap-6">
                  <span className="font-mono text-sm text-[#A94A4A] font-bold">02 Units</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A94A4A] font-mono font-bold">CRITICAL</span>
                </div>
              </div>
            </div>

            {/* Thin horizontal rule & Emergency request bar */}
            <div className="pt-6 border-t border-[#D8D0C3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A94A4A] font-mono font-bold block">
                  ACTIVE REQUISITION
                </span>
                <span className="font-serif text-2xl text-[#252820]">
                  O− · 2 UNITS · CRITICAL
                </span>
                <span className="text-xs text-[#596451] block mt-0.5">
                  Trauma Surgery Unit · Required within 2 hours
                </span>
              </div>

              <button
                onClick={handleFindBlood}
                className="px-8 py-3.5 bg-[#A94A4A] text-[#F5F0E7] hover:bg-[#252820] text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer border border-[#A94A4A]"
              >
                Find Donors
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. DONOR EXPERIENCE (FOR DONORS)
      ========================================================================== */}
      <section className="border-b border-[#D8D0C3] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          {/* Micro-Label */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              FOR DONORS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Statement */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif text-4xl sm:text-6xl text-[#252820]">
                Someone nearby{' '}
                <span className="italic block mt-1 font-normal text-[#252820]">
                  may need your help.
                </span>
              </h2>
              <p className="text-[#596451] text-base leading-relaxed font-light">
                When an emergency matches your blood profile within your radius, you receive a single, dignified priority notification. No spam, no repetitive solicitation—only when a verified hospital is in urgent need.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleBecomeDonor}
                  className="px-8 py-4 bg-transparent border border-[#252820] text-[#252820] hover:bg-[#252820] hover:text-[#F5F0E7] text-xs uppercase tracking-[0.25em] font-medium transition-all cursor-pointer"
                >
                  Register as a Donor
                </button>
              </div>
            </div>

            {/* Right: Mobile Phone Mockup with Elegant Donor Interface */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm border border-[#D8D0C3] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                {/* Phone Header */}
                <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3 text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                  <span>BLOODBRIDGE MOBILE</span>
                  <span>O− DONOR PROFILE</span>
                </div>

                {/* Emergency Card inside phone */}
                <div className="border border-[#D8D0C3] p-5 space-y-3 bg-[#F5F0E7]/60">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A94A4A] font-mono font-bold block">
                    EMERGENCY REQUEST
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-[#252820]">
                    O− BLOOD REQUIRED
                  </h4>
                  <p className="text-xs text-[#596451]">
                    CityCare Hospital · 3.2 km away
                  </p>
                  <p className="text-xs text-[#252820] font-mono">
                    2 units required for surgical intake
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleBecomeDonor}
                      className="w-full py-3 bg-[#252820] text-[#F5F0E7] hover:bg-[#A94A4A] text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer"
                    >
                      I Can Help
                    </button>
                  </div>
                </div>

                {/* Donation History & Verification below */}
                <div className="border-t border-[#D8D0C3] pt-4 space-y-2 text-xs font-mono">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] block">
                    DONATION HISTORY
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-[#252820]">04 DONATIONS</span>
                    <span className="text-[#596451]">AVAILABLE</span>
                  </div>
                  <div className="text-[10px] text-[#596451]">
                    Last Donated: 92 days ago · Eligible Now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. IMPACT SECTION (Large Editorial Serif Numbers)
      ========================================================================== */}
      <section className="border-b border-[#D8D0C3] py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D8D0C3] pb-4 gap-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#596451] font-mono">
              NETWORK TELEMETRY
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
              DEMO NETWORK DATA
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* 1,284 */}
            <div className="space-y-2">
              <span className="font-serif text-5xl sm:text-7xl font-light text-[#252820] block leading-none">
                1,284
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#596451] font-mono block">
                Active Donors
              </span>
            </div>

            {/* 38 */}
            <div className="space-y-2">
              <span className="font-serif text-5xl sm:text-7xl font-light text-[#252820] block leading-none">
                38
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#596451] font-mono block">
                Connected Hospitals
              </span>
            </div>

            {/* 04 */}
            <div className="space-y-2">
              <span className="font-serif text-5xl sm:text-7xl font-light text-[#A94A4A] block leading-none">
                04
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#596451] font-mono block">
                Active Requests
              </span>
            </div>

            {/* 03 */}
            <div className="space-y-2">
              <span className="font-serif text-5xl sm:text-7xl font-light text-[#B89A68] block leading-none">
                03
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#596451] font-mono block">
                Shortage Risks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FINAL CTA (Whitespace-Heavy Editorial Closing)
      ========================================================================== */}
      <section className="py-24 sm:py-36">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              THE FUTURE OF BLOOD AVAILABILITY
            </span>
          </div>

          <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#252820] leading-[0.95]">
            Be ready{' '}
            <span className="italic block mt-2 font-normal">
              before the emergency.
            </span>
          </h2>

          <div className="max-w-xl mx-auto pt-2">
            <p className="text-[#596451] text-base sm:text-lg leading-relaxed font-light">
              BloodBridge AI brings donors, hospitals and intelligent forecasting into one connected emergency blood network.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={handleEnterNetwork}
              className="px-10 py-4 bg-[#252820] text-[#F5F0E7] hover:bg-[#A94A4A] border border-[#252820] hover:border-[#A94A4A] text-xs uppercase tracking-[0.25em] font-medium transition-all cursor-pointer"
            >
              Enter the Network
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-4 bg-transparent text-[#252820] hover:text-[#A94A4A] border border-[#D8D0C3] hover:border-[#A94A4A] text-xs uppercase tracking-[0.25em] font-medium transition-all cursor-pointer"
            >
              Learn How It Works
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
