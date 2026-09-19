import React from 'react';
import { useApp } from '../../context/AppContext.tsx';

export const Footer: React.FC = () => {
  const { setCurrentRole, setActiveTab } = useApp();

  return (
    <footer className="bg-[#F5F0E7] border-t border-[#D8D0C3] text-[#252820] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12">
          {/* Left: Brand Name */}
          <div>
            <span className="font-serif text-2xl font-normal tracking-tight text-[#252820] block">
              BloodBridge AI
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#596451] block mt-1">
              Intelligent Healthcare Logistics
            </span>
          </div>

          {/* Center: Editorial Links */}
          <div className="flex flex-wrap items-center gap-8 sm:gap-10 text-[11px] uppercase tracking-[0.25em] font-medium text-[#252820]">
            <button
              onClick={() => {
                setActiveTab('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#A94A4A] transition-colors cursor-pointer"
            >
              The Network
            </button>
            <button
              onClick={() => {
                setCurrentRole('DONOR');
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#A94A4A] transition-colors cursor-pointer"
            >
              For Donors
            </button>
            <button
              onClick={() => {
                setCurrentRole('HOSPITAL');
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#A94A4A] transition-colors cursor-pointer"
            >
              For Hospitals
            </button>
            <a
              href="mailto:contact@bloodbridge.health"
              className="hover:text-[#A94A4A] transition-colors cursor-pointer"
            >
              Contact
            </a>
          </div>

          {/* Right: Geographical and Date Marker */}
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#596451] font-mono">
              India · 2026
            </span>
          </div>
        </div>

        {/* Thin Horizontal Line */}
        <div className="border-t border-[#D8D0C3] pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          {/* Tagline in elegant serif */}
          <p className="font-serif text-base sm:text-lg italic text-[#596451]">
            The right blood. The right donor. At the right time.
          </p>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#596451]">
            Clinical Safety Protocol · Authorized Healthcare Verification Required
          </p>
        </div>
      </div>
    </footer>
  );
};
