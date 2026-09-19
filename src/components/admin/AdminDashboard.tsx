import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Radio,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { SystemAuditLog } from '../../types.ts';

export const AdminDashboard: React.FC = () => {
  const { hospitals, donors, requests, inventory, auditLogs } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'facilities' | 'audit'>('overview');

  const activityStreamEvents = [
    {
      id: 'act-1',
      time: 'JUST NOW',
      title: 'CityCare Trauma Hospital requested 2 units of O−',
      facility: 'CityCare Central',
      tag: 'CRITICAL',
    },
    {
      id: 'act-2',
      time: '02 MIN AGO',
      title: 'Rahul Verma accepted emergency requisition #REQ-912',
      facility: 'CityCare Trauma Bay',
      tag: 'DISPATCHED',
    },
    {
      id: 'act-3',
      time: '12 MIN AGO',
      title: 'Central Blood Bank updated O− safety threshold',
      facility: 'Metro Central Bank',
      tag: 'LOGISTICS',
    },
    {
      id: 'act-4',
      time: '28 MIN AGO',
      title: 'Priya Sharma verified arrival at facility',
      facility: 'CityCare Trauma Bay',
      tag: 'INTAKE',
    },
    {
      id: 'act-5',
      time: '45 MIN AGO',
      title: '7-Day predictive depletion alert triggered for O− and A−',
      facility: 'AI Forecast Module',
      tag: 'ALGORITHM',
    },
  ];

  return (
    <div className="bg-[#F5F0E7] text-[#252820] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        {/* 1. Header with Breadcrumb */}
        <div className="border-b border-[#D8D0C3] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#596451] font-mono block mb-2">
              ADMINISTRATION / NETWORK SURVEILLANCE
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#252820] leading-none">
              Regional emergency health network
            </h1>
            <p className="text-xs text-[#596451] mt-3 tracking-wide">
              Central Node: SF-METRO-ZONE-01 · 18 Healthcare Facilities Synchronized · Real-Time Telemetry
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono border border-[#D8D0C3] px-3 py-1.5 bg-white">
              Grid Status: 100% Operational
            </span>
          </div>
        </div>

        {/* 2. Top Asymmetrical Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#D8D0C3] border-b border-[#D8D0C3] pb-10">
          <div className="py-4 lg:py-0 lg:pr-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              REGISTERED DONORS
            </span>
            <span className="font-serif text-5xl font-light text-[#252820] block">
              1,248
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              82% CLINICALLY ELIGIBLE
            </span>
          </div>

          <div className="py-4 lg:py-0 lg:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              PARTNER HOSPITALS
            </span>
            <span className="font-serif text-5xl font-light text-[#252820] block">
              18
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              CERTIFIED EMERGENCY TRAUMA BAYS
            </span>
          </div>

          <div className="py-4 lg:py-0 lg:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              DISPATCH RESPONSE TIME
            </span>
            <span className="font-serif text-5xl font-light text-[#252820] block">
              14m
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              MEDIAN ALERT-TO-CONFIRM
            </span>
          </div>

          <div className="py-4 lg:py-0 lg:pl-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              FULFILLMENT RATE
            </span>
            <span className="font-serif text-5xl font-light text-[#252820] block">
              98.4%
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              SUB-2H CRITICAL REQUISITIONS
            </span>
          </div>
        </div>

        {/* 3. Grid: Left Activity Ledger, Right Grid Capacity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Chronological Activity Ledger */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3">
              <div>
                <h2 className="font-serif text-2xl text-[#252820]">Real-Time Event Stream</h2>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                  Autonomous Network Activity Ledger
                </span>
              </div>
              <span className="text-xs font-mono text-[#596451]">LIVE FEED</span>
            </div>

            <div className="divide-y divide-[#D8D0C3] border-b border-[#D8D0C3]">
              {activityStreamEvents.map((evt) => (
                <div key={evt.id} className="py-4 flex items-start justify-between gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="font-serif text-lg text-[#252820] block leading-snug">
                      {evt.title}
                    </span>
                    <span className="text-[10px] text-[#596451] block">
                      {evt.facility} · {evt.time}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border ${
                      evt.tag === 'CRITICAL'
                        ? 'border-[#A94A4A] text-[#A94A4A]'
                        : 'border-[#596451] text-[#596451]'
                    }`}
                  >
                    {evt.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Regional Grid Overview & Sub-tab navigation */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-[#2D3126] bg-[#191B16] text-[#F5F0E7] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#2D3126] pb-3 text-[10px] uppercase tracking-[0.2em] text-[#B89A68] font-mono">
                <span>REGIONAL STATUS</span>
                <span>35 KM SECTOR</span>
              </div>

              <div>
                <h3 className="font-serif text-3xl text-[#F5F0E7]">
                  San Francisco Health Network
                </h3>
                <p className="text-xs text-[#A5AFA0] mt-2 font-light leading-relaxed">
                  18 hospitals actively sharing inventory telemetry and donor alert routing. 1,480 reserve units currently cataloged.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#2D3126] pt-4 font-mono text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#A5AFA0] block">
                    TOTAL NETWORK UNITS
                  </span>
                  <span className="font-serif text-2xl text-[#F5F0E7]">1,480 Units</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#A5AFA0] block">
                    ACTIVE CALLS
                  </span>
                  <span className="font-serif text-2xl text-[#A94A4A]">04 Live</span>
                </div>
              </div>
            </div>

            {/* Quick Selectors */}
            <div className="border border-[#D8D0C3] bg-white p-6 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono block">
                FACILITY DIRECTORY & COMPLIANCE
              </span>
              <div className="space-y-2 font-mono text-xs">
                <button
                  onClick={() => setActiveSubTab(activeSubTab === 'facilities' ? 'overview' : 'facilities')}
                  className="w-full text-left p-3 border border-[#D8D0C3] hover:border-[#252820] text-[#252820] flex items-center justify-between transition-colors cursor-pointer bg-[#F5F0E7]"
                >
                  <span>18 Certified Trauma Facilities</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#596451]" />
                </button>
                <button
                  onClick={() => setActiveSubTab(activeSubTab === 'audit' ? 'overview' : 'audit')}
                  className="w-full text-left p-3 border border-[#D8D0C3] hover:border-[#252820] text-[#252820] flex items-center justify-between transition-colors cursor-pointer bg-[#F5F0E7]"
                >
                  <span>Immutable HIPAA Audit Trail</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#596451]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Facilities Table Drawer */}
        {activeSubTab === 'facilities' && (
          <div className="border border-[#D8D0C3] bg-white p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3">
              <div>
                <h3 className="font-serif text-2xl text-[#252820]">Certified Partner Facilities</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                  Verified Blood Banks & Emergency Trauma Bays
                </span>
              </div>
              <button
                onClick={() => setActiveSubTab('overview')}
                className="text-xs font-mono text-[#596451] hover:text-[#252820] cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#D8D0C3] text-[9px] uppercase tracking-[0.2em] text-[#596451]">
                    <th className="py-3 font-normal">Facility Name</th>
                    <th className="py-3 font-normal">Address</th>
                    <th className="py-3 font-normal">Emergency Contact</th>
                    <th className="py-3 font-normal text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D0C3]">
                  {hospitals.map((h) => (
                    <tr key={h.id} className="hover:bg-[#EFE9DF]/50">
                      <td className="py-4 font-serif text-base text-[#252820]">{h.name}</td>
                      <td className="py-4 text-[#596451]">{h.address}</td>
                      <td className="py-4 text-[#252820]">{h.emergency_hotline || h.phone}</td>
                      <td className="py-4 text-right">
                        <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[#596451] text-[#596451]">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Audit Trail Drawer */}
        {activeSubTab === 'audit' && (
          <div className="border border-[#D8D0C3] bg-white p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3">
              <div>
                <h3 className="font-serif text-2xl text-[#252820]">Immutable HIPAA Audit Trail</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                  Cryptographic Verification Logs
                </span>
              </div>
              <button
                onClick={() => setActiveSubTab('overview')}
                className="text-xs font-mono text-[#596451] hover:text-[#252820] cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#D8D0C3] text-[9px] uppercase tracking-[0.2em] text-[#596451]">
                    <th className="py-3 font-normal">Timestamp</th>
                    <th className="py-3 font-normal">Actor</th>
                    <th className="py-3 font-normal">Action</th>
                    <th className="py-3 font-normal">Verification Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D0C3]">
                  {auditLogs.slice(0, 8).map((log: SystemAuditLog) => (
                    <tr key={log.id} className="hover:bg-[#EFE9DF]/50">
                      <td className="py-3 text-[#596451]">{log.timestamp}</td>
                      <td className="py-3 text-[#252820] font-bold">{log.actor}</td>
                      <td className="py-3 text-[#252820]">{log.action}</td>
                      <td className="py-3 text-[#596451] text-[10px]">{log.hash || log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
