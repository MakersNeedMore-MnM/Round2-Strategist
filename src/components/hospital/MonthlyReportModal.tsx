import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Download,
  FileText,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { computeMonthlySummary, generateMonthlySummaryPdf } from '../../services/pdfReportGenerator.ts';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullReportView?: () => void;
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  onOpenFullReportView,
}) => {
  const { currentHospital, inventory, requests, donations } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const summary = computeMonthlySummary(
    currentHospital,
    inventory,
    requests,
    donations,
    selectedYear,
    selectedMonth
  );

  const handleDownload = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        generateMonthlySummaryPdf(summary);
        setDownloadSuccess(true);
      } catch (e) {
        console.error('PDF error:', e);
      } finally {
        setIsGenerating(false);
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191B16]/80 backdrop-blur-xs">
      <div className="bg-[#F5F0E7] text-[#252820] max-w-lg w-full border border-[#D8D0C3] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#D8D0C3] pb-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#596451] font-mono block mb-1">
              CLINICAL ARCHIVE
            </span>
            <h3 className="font-serif text-2xl text-[#252820]">
              Export Monthly Summary (PDF)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#596451] hover:text-[#252820] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Facility Info */}
        <div className="border border-[#D8D0C3] bg-white p-4 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[#252820] font-bold block">{currentHospital.name}</span>
            <span className="text-[#596451]">Lic: {currentHospital.license_number}</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#596451]">
            VERIFIED FACILITY
          </span>
        </div>

        {/* Period Selectors */}
        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-[#596451] mb-2">
              Reporting Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full p-2.5 border border-[#D8D0C3] bg-white text-[#252820]"
            >
              <option value={9}>September</option>
              <option value={8}>August</option>
              <option value={7}>July</option>
              <option value={6}>June</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-[#596451] mb-2">
              Reporting Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full p-2.5 border border-[#D8D0C3] bg-white text-[#252820]"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>

        {/* Quick Preview Telemetry */}
        <div className="border-t border-b border-[#D8D0C3] py-4 grid grid-cols-3 text-center font-mono">
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#596451] block">REQUESTS</span>
            <span className="font-serif text-2xl text-[#252820]">{summary.totalRequests}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#596451] block">FULFILLED</span>
            <span className="font-serif text-2xl text-[#596451]">{summary.fulfilledRequests}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#596451] block">INTAKE UNITS</span>
            <span className="font-serif text-2xl text-[#252820]">{summary.totalDonationInflows}</span>
          </div>
        </div>

        {downloadSuccess && (
          <div className="border border-[#596451] p-3 text-xs font-mono text-[#596451] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Monthly PDF generated and downloaded to device.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 font-mono text-xs pt-2">
          <button
            onClick={onClose}
            className="px-5 py-3 border border-[#D8D0C3] text-[#596451] hover:text-[#252820] text-[10px] uppercase tracking-[0.2em] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="px-6 py-3 bg-[#252820] hover:bg-[#A94A4A] text-[#F5F0E7] text-[10px] uppercase tracking-[0.25em] transition-colors cursor-pointer border border-[#252820] hover:border-[#A94A4A] flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
