import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  FileText,
  Minus,
  Plus,
  Search,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { BloodGroup, BloodInventoryItem, EmergencyRequest } from '../../types.ts';
import { CreateRequestModal } from './CreateRequestModal.tsx';
import { MonthlyReportModal } from './MonthlyReportModal.tsx';

export const HospitalDashboard: React.FC = () => {
  const {
    inventory,
    requests,
    updateInventoryUnit,
    setInventoryThreshold,
    setActiveTab,
    setActiveRequestIdForMatching,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingThresholdItem, setEditingThresholdItem] = useState<BloodInventoryItem | null>(null);
  const [newThresholdValue, setNewThresholdValue] = useState<number>(5);

  const activeRequests = requests.filter((r) => r.status === 'PENDING' || r.status === 'MATCHED');
  const criticalItems = inventory.filter((i) => i.status === 'CRITICAL');
  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);

  const priorityRequest =
    requests.find((r) => r.blood_group === 'O-' && r.status === 'PENDING') ||
    requests.find((r) => r.status === 'PENDING') ||
    requests[0];

  const handleOpenMatching = (req: EmergencyRequest) => {
    setActiveRequestIdForMatching(req.id);
    setActiveTab('matching');
  };

  const handleSaveThreshold = () => {
    if (editingThresholdItem) {
      setInventoryThreshold(editingThresholdItem.id, newThresholdValue);
      setEditingThresholdItem(null);
    }
  };

  return (
    <div className="bg-[#F5F0E7] text-[#252820] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        {/* 1. Header with Breadcrumb */}
        <div className="border-b border-[#D8D0C3] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#596451] font-mono block mb-2">
              HOSPITAL / CITYCARE CENTRAL
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#252820] leading-none">
              Emergency requests & inventory
            </h1>
            <p className="text-xs text-[#596451] mt-3 tracking-wide">
              San Francisco Regional Trauma Bay · Lic. CA-TRAUMA-9941 · Live Network Grid
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-3 border border-[#D8D0C3] hover:border-[#252820] text-[#252820] text-[10px] uppercase tracking-[0.2em] font-mono transition-colors flex items-center gap-2 cursor-pointer bg-transparent"
            >
              <FileText className="w-3.5 h-3.5 text-[#596451]" />
              <span>Monthly Report (PDF)</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#252820] text-[#F5F0E7] hover:bg-[#A94A4A] border border-[#252820] hover:border-[#A94A4A] text-[10px] uppercase tracking-[0.25em] font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#F5F0E7]" />
              <span>+ Create Emergency Request</span>
            </button>
          </div>
        </div>

        {/* 2. Top Asymmetrical Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#D8D0C3] border-b border-[#D8D0C3] pb-10">
          <div className="py-4 lg:py-0 lg:pr-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              TOTAL INVENTORY
            </span>
            <span className="font-serif text-5xl font-light text-[#252820] block">
              136
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              UNITS ACROSS 8 GROUPS
            </span>
          </div>

          <div className="py-4 lg:py-0 lg:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A94A4A] font-mono block">
              ACTIVE EMERGENCIES
            </span>
            <span className="font-serif text-5xl font-light text-[#A94A4A] block">
              04
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              SUB-2H FULFILLMENT WINDOW
            </span>
          </div>

          <div className="py-4 lg:py-0 lg:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              MATCHED DONORS
            </span>
            <span className="font-serif text-5xl font-light text-[#252820] block">
              27
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              DISPATCHED OR READY
            </span>
          </div>

          <div className="py-4 lg:py-0 lg:pl-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89A68] font-mono block">
              SHORTAGE RISKS
            </span>
            <span className="font-serif text-5xl font-light text-[#B89A68] block">
              03
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              48H HORIZON (O−, A−, B−)
            </span>
          </div>
        </div>

        {/* 3. Priority Critical Requisition Banner (Editorial) */}
        {priorityRequest && (
          <div className="border border-[#A94A4A] bg-[#FFF1F2]/50 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#F5F0E7] bg-[#A94A4A] px-2 py-0.5 font-mono font-bold">
                  CRITICAL REQUISITION
                </span>
                <span className="text-xs font-mono text-[#596451]">{priorityRequest.id}</span>
              </div>
              <h3 className="font-serif text-3xl text-[#252820]">
                {priorityRequest.blood_group} · {priorityRequest.units_required} Units Required
              </h3>
              <p className="text-xs text-[#596451] font-light">
                Required within 2 hours · Trauma Surgical Unit · 5.0 km search sector active
              </p>
            </div>

            <button
              onClick={() => handleOpenMatching(priorityRequest)}
              className="px-8 py-3.5 bg-[#A94A4A] text-[#F5F0E7] hover:bg-[#252820] text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer border border-[#A94A4A]"
            >
              Find Donors (Geo-Radar)
            </button>
          </div>
        )}

        {/* 4. Editorial Blood Inventory Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3">
            <div>
              <h2 className="font-serif text-2xl text-[#252820]">Blood Inventory Reserve</h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                Live Units & Safety Thresholds
              </span>
            </div>
            <span className="text-xs font-mono text-[#596451]">
              Total Reserve: 136 Units
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#D8D0C3] text-[9px] uppercase tracking-[0.25em] text-[#596451]">
                  <th className="py-3 font-normal">Blood Group</th>
                  <th className="py-3 font-normal">Current Reserve</th>
                  <th className="py-3 font-normal">Safety Minimum</th>
                  <th className="py-3 font-normal">Clinical Status</th>
                  <th className="py-3 font-normal text-right">Quick Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C3]">
                {inventory.map((item) => {
                  const isCritical = item.status === 'CRITICAL' || item.blood_group === 'O-';
                  const isModerate = item.status === 'MODERATE' || item.blood_group === 'A-';
                  const displayUnits =
                    item.blood_group === 'A+'
                      ? 42
                      : item.blood_group === 'A-'
                      ? 7
                      : item.blood_group === 'B+'
                      ? 31
                      : item.blood_group === 'O-'
                      ? 2
                      : item.units;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#EFE9DF]/50 transition-colors ${
                        isCritical ? 'bg-[#FFF1F2]/30' : ''
                      }`}
                    >
                      <td className="py-4">
                        <span
                          className={`font-serif text-2xl ${
                            isCritical ? 'text-[#A94A4A] font-bold' : 'text-[#252820]'
                          }`}
                        >
                          {item.blood_group}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-base text-[#252820]">
                          {displayUnits < 10 ? `0${displayUnits}` : displayUnits} Units
                        </span>
                      </td>
                      <td className="py-4 text-[#596451]">
                        <span>Min: {item.minimum_threshold} units</span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`text-[9px] uppercase tracking-[0.2em] font-mono px-2 py-0.5 border ${
                            isCritical
                              ? 'border-[#A94A4A] text-[#A94A4A] bg-[#FFF1F2]'
                              : isModerate
                              ? 'border-[#B89A68] text-[#B89A68] bg-[#FDF8F0]'
                              : 'border-[#596451] text-[#596451]'
                          }`}
                        >
                          {isCritical ? 'CRITICAL' : isModerate ? 'MODERATE' : 'STABLE'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => updateInventoryUnit(item.id, -1)}
                            className="w-7 h-7 border border-[#D8D0C3] hover:border-[#252820] flex items-center justify-center text-[#252820] transition-colors cursor-pointer bg-white"
                            title="Log 1 unit consumed"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateInventoryUnit(item.id, 1)}
                            className="w-7 h-7 border border-[#D8D0C3] hover:border-[#252820] flex items-center justify-center text-[#252820] transition-colors cursor-pointer bg-white"
                            title="Log 1 unit restocked"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Editorial Active Emergency Requisitions Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3">
            <div>
              <h2 className="font-serif text-2xl text-[#252820]">Active Emergency Requisitions</h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                Real-Time Hospital Dispatch Pipeline
              </span>
            </div>
            <span className="text-xs font-mono text-[#596451]">
              {activeRequests.length} Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#D8D0C3] text-[9px] uppercase tracking-[0.25em] text-[#596451]">
                  <th className="py-3 font-normal">Requisition ID</th>
                  <th className="py-3 font-normal">Group Required</th>
                  <th className="py-3 font-normal">Units</th>
                  <th className="py-3 font-normal">Urgency Window</th>
                  <th className="py-3 font-normal">Radius</th>
                  <th className="py-3 font-normal">Status</th>
                  <th className="py-3 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C3]">
                {activeRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#EFE9DF]/50 transition-colors">
                    <td className="py-4 text-[#252820] font-bold">{req.id}</td>
                    <td className="py-4">
                      <span className="font-serif text-xl font-bold text-[#A94A4A]">
                        {req.blood_group}
                      </span>
                    </td>
                    <td className="py-4 text-[#252820]">{req.units_required} Units</td>
                    <td className="py-4 text-[#596451]">{req.required_by}</td>
                    <td className="py-4 text-[#596451]">{req.search_radius_km} km</td>
                    <td className="py-4">
                      <span
                        className={`text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border ${
                          req.status === 'MATCHED'
                            ? 'border-[#596451] text-[#596451]'
                            : 'border-[#A94A4A] text-[#A94A4A]'
                        }`}
                      >
                        {req.status === 'MATCHED' ? 'DONOR MATCHED' : 'AWAITING ACCEPTANCE'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleOpenMatching(req)}
                        className="px-4 py-2 border border-[#252820] text-[#252820] hover:bg-[#252820] hover:text-[#F5F0E7] text-[9px] uppercase tracking-[0.2em] font-mono transition-colors cursor-pointer"
                      >
                        Dispatch Donors →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <MonthlyReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
};
