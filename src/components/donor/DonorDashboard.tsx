import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MapPin,
  Navigation,
  Phone,
  Radio,
  Shield,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { AvailabilityStatus, DonationRecord, EmergencyRequest } from '../../types.ts';

export const DonorDashboard: React.FC = () => {
  const {
    currentDonor,
    requests,
    respondToRequest,
    updateDonorAvailability,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'dispatch' | 'records'>('dispatch');

  const urgentRequests = requests.filter(
    (r) =>
      (r.blood_group === currentDonor.blood_group || r.blood_group === 'O-') &&
      (r.status === 'PENDING' || (r.status === 'MATCHED' && r.accepted_donor_id === currentDonor.id))
  );

  const primaryEmergency = urgentRequests[0] || {
    id: 'REQ-2026-912',
    hospital_name: 'CityCare Hospital',
    hospital_address: '742 Market St, Central Hub',
    blood_group: 'O-',
    units_required: 2,
    urgency: 'CRITICAL',
    required_by: 'Within 2 hours',
    status: 'PENDING',
    search_radius_km: 5,
  };

  const isPrimaryAccepted =
    primaryEmergency.status === 'MATCHED' && primaryEmergency.accepted_donor_id === currentDonor.id;

  const handleAccept = (reqId: string) => {
    respondToRequest(reqId, currentDonor.id, true);
  };

  const handleAvailabilityToggle = () => {
    const nextStatus: AvailabilityStatus =
      currentDonor.availability === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE';
    updateDonorAvailability(nextStatus);
  };

  return (
    <div className="bg-[#F5F0E7] text-[#252820] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-16">
        {/* 1. Header with Breadcrumb */}
        <div className="border-b border-[#D8D0C3] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#596451] font-mono block mb-2">
              DONOR PORTAL / PRIYA SHARMA
            </span>
            <div className="flex items-baseline gap-4">
              <h1 className="font-serif text-4xl sm:text-6xl text-[#252820] leading-none">
                Hello, Priya
              </h1>
              <span className="font-serif text-2xl text-[#A94A4A] font-bold">
                (O−)
              </span>
            </div>
            <p className="text-xs text-[#596451] mt-3 tracking-wide">
              Universal Donor · BloodBridge ID #BB-90412 · San Francisco Sector
            </p>
          </div>

          {/* Minimal Availability Toggle */}
          <div className="flex items-center gap-4 border border-[#D8D0C3] p-3 bg-white">
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#596451] font-mono block">
                Network Availability
              </span>
              <span className="text-xs font-mono font-medium text-[#252820]">
                {currentDonor.availability === 'AVAILABLE' ? 'AVAILABLE TO HELP' : 'TEMPORARILY BUSY'}
              </span>
            </div>
            <button
              onClick={handleAvailabilityToggle}
              className="text-[#252820] hover:text-[#A94A4A] transition-colors cursor-pointer"
              title="Toggle status"
            >
              {currentDonor.availability === 'AVAILABLE' ? (
                <ToggleRight className="w-7 h-7 text-[#596451]" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-[#D8D0C3]" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Top Asymmetrical Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D8D0C3] border-b border-[#D8D0C3] pb-10">
          <div className="py-4 sm:py-0 sm:pr-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              TOTAL DONATIONS
            </span>
            <span className="font-serif text-5xl font-light text-[#252820] block">
              04
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              VERIFIED BLOOD INTAKES
            </span>
          </div>

          <div className="py-4 sm:py-0 sm:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              LIVES SUPPORTED
            </span>
            <span className="font-serif text-5xl font-light text-[#252820] block">
              12*
            </span>
            <span className="text-[10px] text-[#596451] font-mono">
              *ESTIMATED NETWORK CONTRIBUTION
            </span>
          </div>

          <div className="py-4 sm:py-0 sm:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A94A4A] font-mono block">
              NEARBY EMERGENCIES
            </span>
            <span className="font-serif text-5xl font-light text-[#A94A4A] block">
              03
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              WITHIN 5.0 KM RADIUS
            </span>
          </div>

          <div className="py-4 sm:py-0 sm:pl-8 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] font-mono block">
              LAST DONATION
            </span>
            <span className="font-serif text-3xl font-light text-[#252820] block mt-2">
              92 Days
            </span>
            <span className="text-[11px] text-[#596451] font-mono">
              CLINICALLY ELIGIBLE
            </span>
          </div>
        </div>

        {/* 3. Emergency Card: O- Blood Required (As Specified) */}
        <div className="border border-[#A94A4A] bg-[#FFF1F2]/40 p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-[#A94A4A]/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A94A4A] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A94A4A] font-mono font-bold">
                EMERGENCY REQUISITION
              </span>
            </div>
            <span className="text-xs font-mono text-[#596451]">{primaryEmergency.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <div className="md:col-span-8 space-y-2">
              <h3 className="font-serif text-3xl sm:text-4xl text-[#252820]">
                O− Blood Required · {primaryEmergency.hospital_name}
              </h3>
              <p className="text-xs text-[#596451] font-light">
                Distance: <strong className="text-[#252820] font-mono">3.2 km away</strong> (~11 min drive) · Required within: <strong className="text-[#A94A4A] font-mono">2 hours</strong> · Units: <strong className="text-[#252820] font-mono">2 units</strong>
              </p>
            </div>

            <div className="md:col-span-4 flex md:justify-end">
              {isPrimaryAccepted ? (
                <div className="px-6 py-3.5 bg-[#596451] text-[#F5F0E7] text-xs uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dispatched • On the Way</span>
                </div>
              ) : (
                <button
                  id="donor-i-can-help-btn"
                  onClick={() => handleAccept(primaryEmergency.id)}
                  className="w-full md:w-auto px-8 py-3.5 bg-[#A94A4A] text-[#F5F0E7] hover:bg-[#252820] text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer border border-[#A94A4A]"
                >
                  I Can Help
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. Donation Records & Certificate Log */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-3">
            <div>
              <h2 className="font-serif text-2xl text-[#252820]">Donation History & Verification</h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                Immutable Healthcare Intake Records
              </span>
            </div>
            <span className="text-xs font-mono text-[#596451]">
              4 Verified Intakes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#D8D0C3] text-[9px] uppercase tracking-[0.25em] text-[#596451]">
                  <th className="py-3 font-normal">Date</th>
                  <th className="py-3 font-normal">Healthcare Facility</th>
                  <th className="py-3 font-normal">Type & Quantity</th>
                  <th className="py-3 font-normal">Certificate Hash</th>
                  <th className="py-3 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C3]">
                {currentDonor.donation_history.map((rec: DonationRecord) => (
                  <tr key={rec.id} className="hover:bg-[#EFE9DF]/50 transition-colors">
                    <td className="py-4 text-[#252820]">{rec.date}</td>
                    <td className="py-4 text-[#252820] font-serif text-base">{rec.hospital_name}</td>
                    <td className="py-4 text-[#596451]">{rec.units_donated} Unit (Whole Blood)</td>
                    <td className="py-4 text-[#596451] text-[10px]">{rec.certificate_url || rec.id}</td>
                    <td className="py-4 text-right">
                      <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[#596451] text-[#596451]">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Clinical Safety & Medical Contribution Disclaimer */}
        <div className="border-t border-[#D8D0C3] pt-6 pb-2 text-xs text-[#596451] font-light leading-relaxed">
          <p>
            *Your contribution helps strengthen the emergency blood network. Transfusion decisions, recipient matching and medical eligibility are determined and verified exclusively by attending clinical physicians and authorized blood banks.
          </p>
        </div>
      </div>
    </div>
  );
};
