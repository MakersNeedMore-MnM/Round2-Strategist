import React, { useState } from 'react';
import {
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { computeMonthlySummary, generateMonthlySummaryPdf } from '../../services/pdfReportGenerator.ts';
import { MonthlyReportSummary } from '../../types.ts';

interface MonthlyReportViewProps {
  onBackToDashboard?: () => void;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({ onBackToDashboard }) => {
  const { currentHospital, inventory, requests, donations, setActiveTab } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September 2026
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const summary: MonthlyReportSummary = computeMonthlySummary(
    currentHospital,
    inventory,
    requests,
    donations,
    selectedYear,
    selectedMonth
  );

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    setDownloadSuccess(null);

    setTimeout(() => {
      try {
        generateMonthlySummaryPdf(summary);
        setDownloadSuccess(
          `Monthly Report for ${summary.monthLabel} downloaded successfully.`
        );
      } catch (err) {
        console.error('PDF generation error:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  return (
    <div className="bg-[#F5F0E7] text-[#252820] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="border-b border-[#D8D0C3] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#596451] mb-2">
              <button
                onClick={() => (onBackToDashboard ? onBackToDashboard() : setActiveTab('dashboard'))}
                className="hover:text-[#252820] cursor-pointer"
              >
                Hospital Dashboard
              </button>
              <span>/</span>
              <span className="text-[#252820]">Monthly Summary (PDF)</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#252820] leading-none">
              Requisition & fulfillment ledger
            </h1>
            <p className="text-xs text-[#596451] mt-3 tracking-wide">
              Executive Regulatory Audit for Blood Requisitions, Retention & Regional Donor Flow
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-6 py-3 bg-[#252820] hover:bg-[#A94A4A] text-[#F5F0E7] text-[10px] uppercase tracking-[0.25em] font-mono transition-colors cursor-pointer border border-[#252820] hover:border-[#A94A4A] flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Compiling PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>

        {/* Download Success Notice */}
        {downloadSuccess && (
          <div className="border border-[#596451] bg-white p-4 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#596451]">
              <CheckCircle2 className="w-4 h-4" />
              <span>{downloadSuccess}</span>
            </div>
            <button
              onClick={() => setDownloadSuccess(null)}
              className="text-[#596451] hover:text-[#252820] uppercase text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Period Selector & Facility Badge */}
        <div className="border border-[#D8D0C3] bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451]">
              Reporting Window:
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border border-[#D8D0C3] bg-[#F5F0E7] px-3 py-1.5 text-xs text-[#252820]"
            >
              <option value={9}>September 2026 (Active)</option>
              <option value={8}>August 2026</option>
              <option value={7}>July 2026</option>
              <option value={6}>June 2026</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-[#D8D0C3] bg-[#F5F0E7] px-3 py-1.5 text-xs text-[#252820]"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <div className="text-[#596451] text-[10px] uppercase tracking-[0.2em]">
            Facility: {currentHospital.name} (Lic: {currentHospital.license_number})
          </div>
        </div>

        {/* Live Document Preview Sheet */}
        <div className="border border-[#D8D0C3] bg-white p-8 sm:p-12 space-y-12">
          <div className="border-b border-[#D8D0C3] pb-6 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#A94A4A] font-mono font-bold block mb-1">
                OFFICIAL CLINICAL SUMMARY · BBR-{summary.periodMonth}-AUDIT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#252820]">
                Monthly Blood Requisition & Intake Ledger
              </h2>
              <p className="text-xs text-[#596451] font-mono mt-1">
                {currentHospital.name} · Dept of Trauma Surgery · Period: {summary.monthLabel}
              </p>
            </div>

            <div className="text-right font-mono text-[10px] text-[#596451]">
              <span>Verified Institution</span>
              <span className="block mt-0.5">Hash: 0x9b41a... verified</span>
            </div>
          </div>

          {/* Executive Metric Strips */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#D8D0C3] border-b border-[#D8D0C3] pb-8">
            <div className="py-4 lg:py-0 lg:pr-6 space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono block">
                TOTAL REQUISITIONS
              </span>
              <span className="font-serif text-4xl text-[#252820] block">
                {summary.totalRequests}
              </span>
              <span className="text-[10px] text-[#596451] font-mono">
                {summary.fulfilledRequests} Fulfilled
              </span>
            </div>

            <div className="py-4 lg:py-0 lg:px-6 space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono block">
                FULFILLMENT RATE
              </span>
              <span className="font-serif text-4xl text-[#596451] block">
                {summary.fulfillmentRatePercent}%
              </span>
              <span className="text-[10px] text-[#596451] font-mono">
                BENCHMARK: 85%
              </span>
            </div>

            <div className="py-4 lg:py-0 lg:px-6 space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono block">
                UNITS TRANSFUSED
              </span>
              <span className="font-serif text-4xl text-[#252820] block">
                {summary.totalUnitsRequested}
              </span>
              <span className="text-[10px] text-[#596451] font-mono">
                CLINICAL REQUISITIONS
              </span>
            </div>

            <div className="py-4 lg:py-0 lg:pl-6 space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono block">
                INTAKE DONATIONS
              </span>
              <span className="font-serif text-4xl text-[#252820] block">
                {summary.totalDonationInflows}
              </span>
              <span className="text-[10px] text-[#596451] font-mono">
                LOCAL DONOR PARTICIPATION
              </span>
            </div>
          </div>

          {/* Requisition Breakdown Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-2">
              <span className="font-serif text-xl text-[#252820]">Requisition Manifest</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451] font-mono">
                Itemized Clinical History
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#D8D0C3] text-[9px] uppercase tracking-[0.2em] text-[#596451]">
                    <th className="py-3 font-normal">Requisition ID</th>
                    <th className="py-3 font-normal">Blood Group</th>
                    <th className="py-3 font-normal">Units</th>
                    <th className="py-3 font-normal">Urgency</th>
                    <th className="py-3 font-normal">Required By</th>
                    <th className="py-3 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D0C3]">
                  {requests.slice(0, 5).map((req) => (
                    <tr key={req.id} className="hover:bg-[#EFE9DF]/40">
                      <td className="py-3 text-[#252820] font-bold">{req.id}</td>
                      <td className="py-3">
                        <span className="font-serif text-base font-bold text-[#A94A4A]">
                          {req.blood_group}
                        </span>
                      </td>
                      <td className="py-3 text-[#252820]">{req.units_required} Units</td>
                      <td className="py-3 text-[#596451]">{req.urgency}</td>
                      <td className="py-3 text-[#596451]">{req.required_by}</td>
                      <td className="py-3 text-right">
                        <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[#596451] text-[#596451]">
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
