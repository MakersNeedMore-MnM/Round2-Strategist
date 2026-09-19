import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Megaphone,
  Truck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { BloodGroup, OutreachCampaign } from '../../types.ts';

export const ShortagePrediction: React.FC = () => {
  const {
    outreachCampaigns,
    launchOutreachCampaign,
    inventory,
  } = useApp();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O-');
  const [targetRadius, setTargetRadius] = useState<number>(10);
  const [urgencyLevel, setUrgencyLevel] = useState<string>('CRITICAL');
  const [messageContent, setMessageContent] = useState<string>(
    'Critical O- blood shortage predicted within 24h at CityCare Hospital. Eligible donors are urgently requested for immediate intake.'
  );
  const [lastLaunchedCampaign, setLastLaunchedCampaign] = useState<OutreachCampaign | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);
    setTimeout(() => {
      const camp = launchOutreachCampaign(
        selectedBloodGroup,
        messageContent,
        targetRadius,
        urgencyLevel
      );
      setLastLaunchedCampaign(camp);
      setIsLaunching(false);
    }, 600);
  };

  const handleTransferRequest = () => {
    setTransferSuccess('Transfer request for 10 units O- dispatched to Metro Blood Bank. Courier transit: 35 mins.');
    setTimeout(() => setTransferSuccess(null), 7000);
  };

  const comparisonData = [
    { group: 'O−', current: 2, predicted: 18, risk: 'HIGH', deficit: '−16 units (24h)' },
    { group: 'A−', current: 7, predicted: 16, risk: 'MODERATE', deficit: '−9 units (48h)' },
    { group: 'B−', current: 5, predicted: 10, risk: 'MODERATE', deficit: '−5 units (72h)' },
    { group: 'O+', current: 24, predicted: 22, risk: 'STABLE', deficit: '+2 buffer' },
    { group: 'A+', current: 42, predicted: 30, risk: 'STABLE', deficit: '+12 buffer' },
    { group: 'B+', current: 31, predicted: 25, risk: 'STABLE', deficit: '+6 buffer' },
    { group: 'AB+', current: 15, predicted: 8, risk: 'STABLE', deficit: '+7 buffer' },
  ];

  return (
    <div className="bg-[#F5F0E7] text-[#252820] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        {/* 1. Header with Breadcrumb */}
        <div className="border-b border-[#D8D0C3] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#596451] font-mono block mb-2">
              INTELLIGENCE / PREDICTIVE FORECAST
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#252820] leading-none">
              Shortage risk & demand modeling
            </h1>
            <p className="text-xs text-[#596451] mt-3 tracking-wide">
              7-Day Algorithmic Horizon · Surgical Queues, ER Intake Vectors & Regional Depletion Indices
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('recommendations-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#252820] text-[#F5F0E7] hover:bg-[#A94A4A] border border-[#252820] hover:border-[#A94A4A] text-[10px] uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer"
            >
              Action Protocols →
            </button>
          </div>
        </div>

        {/* Transfer Confirmation Notification */}
        {transferSuccess && (
          <div className="border border-[#596451] bg-[#F1EFEA] p-4 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#596451]" />
              <span className="text-[#252820]">{transferSuccess}</span>
            </div>
            <button
              onClick={() => setTransferSuccess(null)}
              className="text-[#596451] hover:text-[#252820] uppercase text-[10px] tracking-wider"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2. Three Editorial Risk Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8D0C3] border-b border-[#D8D0C3] pb-12">
          {/* High Risk: O- */}
          <div className="py-6 md:py-0 md:pr-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A94A4A] font-mono font-bold">
                HIGH DEFICIT RISK
              </span>
              <span className="text-[10px] font-mono text-[#596451]">24H HORIZON</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-5xl font-bold text-[#A94A4A]">O−</span>
              <span className="text-xs font-mono text-[#596451]">2 Units on Shelf</span>
            </div>
            <p className="text-xs text-[#596451] font-light leading-relaxed">
              Acute trauma surge combined with baseline universal intake leaves less than 24 hours of safe surgical buffer.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedBloodGroup('O-');
                  const el = document.getElementById('outreach-campaign-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#A94A4A] hover:underline"
              >
                Mobilize O− Donors →
              </button>
            </div>
          </div>

          {/* Moderate Risk: A- */}
          <div className="py-6 md:py-0 md:px-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89A68] font-mono font-bold">
                MODERATE RISK
              </span>
              <span className="text-[10px] font-mono text-[#596451]">48H HORIZON</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-5xl font-bold text-[#252820]">A−</span>
              <span className="text-xs font-mono text-[#596451]">7 Units on Shelf</span>
            </div>
            <p className="text-xs text-[#596451] font-light leading-relaxed">
              Cardiac surgery schedule planned for Thursday morning demands 9 units above expected replenishment.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedBloodGroup('A-');
                  const el = document.getElementById('outreach-campaign-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#B89A68] hover:underline"
              >
                Schedule Donor Intake →
              </button>
            </div>
          </div>

          {/* Stable Groups */}
          <div className="py-6 md:py-0 md:pl-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono font-bold">
                STABLE GROUPS
              </span>
              <span className="text-[10px] font-mono text-[#596451]">&gt;7D BUFFER</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="font-serif text-3xl text-[#252820]">B+</span>
                <span className="text-[10px] font-mono text-[#596451] block">31u</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#252820]">A+</span>
                <span className="text-[10px] font-mono text-[#596451] block">42u</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#252820]">AB+</span>
                <span className="text-[10px] font-mono text-[#596451] block">15u</span>
              </div>
            </div>
            <p className="text-xs text-[#596451] font-light leading-relaxed">
              Healthy regional buffer and routine donor appointments cover anticipated surgical and emergency demand.
            </p>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#596451] block pt-2">
              Status: Reserve Optimal
            </span>
          </div>
        </div>

        {/* 3. Demand vs Current Supply Audit Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3">
            <div>
              <h2 className="font-serif text-2xl text-[#252820]">
                Predicted Demand vs. Current Reserve
              </h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                7-Day Clinical Burn Audit
              </span>
            </div>
            <span className="text-xs font-mono text-[#596451]">
              Bay Area Health Network
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#D8D0C3] text-[9px] uppercase tracking-[0.25em] text-[#596451]">
                  <th className="py-3 font-normal">Blood Group</th>
                  <th className="py-3 font-normal">Current Shelf Reserve</th>
                  <th className="py-3 font-normal">7-Day Projected Burn</th>
                  <th className="py-3 font-normal">Variance Deficit / Buffer</th>
                  <th className="py-3 font-normal text-right">Risk Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C3]">
                {comparisonData.map((item) => (
                  <tr key={item.group} className="hover:bg-[#EFE9DF]/50 transition-colors">
                    <td className="py-4">
                      <span className="font-serif text-2xl text-[#252820] font-bold">
                        {item.group}
                      </span>
                    </td>
                    <td className="py-4 text-[#252820]">{item.current} Units</td>
                    <td className="py-4 text-[#596451]">{item.predicted} Units</td>
                    <td className="py-4">
                      <span
                        className={`font-mono text-xs ${
                          item.risk === 'HIGH'
                            ? 'text-[#A94A4A] font-bold'
                            : item.risk === 'MODERATE'
                            ? 'text-[#B89A68] font-bold'
                            : 'text-[#596451]'
                        }`}
                      >
                        {item.deficit}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span
                        className={`text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border ${
                          item.risk === 'HIGH'
                            ? 'border-[#A94A4A] text-[#A94A4A]'
                            : item.risk === 'MODERATE'
                            ? 'border-[#B89A68] text-[#B89A68]'
                            : 'border-[#596451] text-[#596451]'
                        }`}
                      >
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Actionable Recommendations (Protocols) */}
        <div id="recommendations-section" className="space-y-6">
          <div className="border-b border-[#D8D0C3] pb-3">
            <h2 className="font-serif text-2xl text-[#252820]">Autonomous Action Protocols</h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
              Heuristic Recommendation Matrix
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Protocol 1: Targeted donor campaign */}
            <div className="border border-[#D8D0C3] bg-white p-6 sm:p-8 space-y-4">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#A94A4A] font-mono font-bold block">
                PROTOCOL #01 · OUTREACH
              </span>
              <h3 className="font-serif text-2xl text-[#252820]">
                Launch targeted donor mobilization
              </h3>
              <p className="text-xs text-[#596451] leading-relaxed font-light">
                Dispatch personalized emergency SMS and in-app alerts to 12 eligible O− and A− donors registered within a 10 km sector.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('outreach-campaign-form');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-[#252820] text-[#F5F0E7] hover:bg-[#A94A4A] text-[10px] uppercase tracking-[0.2em] font-mono transition-colors cursor-pointer"
                >
                  Configure Outreach Broadcast →
                </button>
              </div>
            </div>

            {/* Protocol 2: Inter-facility transfer */}
            <div className="border border-[#D8D0C3] bg-white p-6 sm:p-8 space-y-4">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#596451] font-mono font-bold block">
                PROTOCOL #02 · LOGISTICS
              </span>
              <h3 className="font-serif text-2xl text-[#252820]">
                Transfer 10 units from Metro Blood Bank
              </h3>
              <p className="text-xs text-[#596451] leading-relaxed font-light">
                Inter-facility network balancing: Metro Blood Bank reports 52 surplus units of O− with an estimated cross-town transit time of 35 minutes.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleTransferRequest}
                  className="px-5 py-2.5 bg-transparent border border-[#252820] text-[#252820] hover:bg-[#252820] hover:text-[#F5F0E7] text-[10px] uppercase tracking-[0.2em] font-mono transition-colors cursor-pointer"
                >
                  Request Courier Transfer (10u)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Campaign Dispatch Form */}
        <div id="outreach-campaign-form" className="border border-[#D8D0C3] bg-white p-6 sm:p-10 space-y-6">
          <div className="border-b border-[#D8D0C3] pb-4">
            <h3 className="font-serif text-2xl text-[#252820]">
              Broadcast Emergency Donor Outreach
            </h3>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
              Direct Push & SMS Dispatch Engine
            </span>
          </div>

          <form onSubmit={handleLaunchCampaign} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              <div>
                <label className="block uppercase tracking-[0.2em] text-[9px] text-[#596451] mb-2">
                  Target Blood Group
                </label>
                <select
                  value={selectedBloodGroup}
                  onChange={(e) => setSelectedBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2.5 border border-[#D8D0C3] bg-[#F5F0E7] text-[#252820] text-xs font-mono"
                >
                  <option value="O-">O− (Universal Emergency)</option>
                  <option value="A-">A− (Cardiac Reserve)</option>
                  <option value="B-">B− (Regional Reserve)</option>
                  <option value="O+">O+ (Standard Trauma)</option>
                  <option value="A+">A+ (Surgical General)</option>
                  <option value="B+">B+ (General Supply)</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-[0.2em] text-[9px] text-[#596451] mb-2">
                  Search Sector Radius
                </label>
                <select
                  value={targetRadius}
                  onChange={(e) => setTargetRadius(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-[#D8D0C3] bg-[#F5F0E7] text-[#252820] text-xs font-mono"
                >
                  <option value={5}>5.0 km (Local Cluster)</option>
                  <option value={10}>10.0 km (Standard Sector)</option>
                  <option value={15}>15.0 km (Metro Wide)</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-[0.2em] text-[9px] text-[#596451] mb-2">
                  Urgency Level
                </label>
                <select
                  value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D8D0C3] bg-[#F5F0E7] text-[#252820] text-xs font-mono"
                >
                  <option value="CRITICAL">CRITICAL (Immediate Dispatch)</option>
                  <option value="URGENT">URGENT (24-Hour Horizon)</option>
                  <option value="SCHEDULED">SCHEDULED (Elective Backup)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-[0.2em] text-[9px] text-[#596451] mb-2 font-mono">
                Message Content
              </label>
              <textarea
                rows={3}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full p-3 border border-[#D8D0C3] bg-[#F5F0E7] text-[#252820] text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-[#596451] font-mono">
                Will alert ~12 verified donors in sector
              </span>
              <button
                type="submit"
                disabled={isLaunching}
                className="px-8 py-3 bg-[#A94A4A] hover:bg-[#252820] text-[#F5F0E7] text-[10px] uppercase tracking-[0.25em] font-mono transition-colors cursor-pointer border border-[#A94A4A]"
              >
                {isLaunching ? 'Broadcasting...' : 'Broadcast Alert'}
              </button>
            </div>
          </form>

          {lastLaunchedCampaign && (
            <div className="border-t border-[#D8D0C3] pt-4 text-xs font-mono text-[#596451]">
              Campaign #{lastLaunchedCampaign.id} dispatched to {lastLaunchedCampaign.donors_notified_count} donors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
