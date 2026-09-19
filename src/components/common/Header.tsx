import React, { useState } from 'react';
import {
  Bell,
  Menu,
  X,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { NotificationDrawer } from './NotificationDrawer.tsx';

interface HeaderProps {
  onOpenCreateRequest?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateRequest }) => {
  const {
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    notifications,
    currentUser,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewSwitcherOpen, setViewSwitcherOpen] = useState(false);

  const unreadCount = notifications.filter(
    (n) => n.status === 'UNREAD' && (n.user_id === currentUser.id || n.type === 'EMERGENCY_REQUEST')
  ).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F5F0E7]/95 backdrop-blur-sm border-b border-[#D8D0C3]">
        {/* Subtle Editorial Top Bar */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Left: Brand Name */}
            <div
              onClick={() => setActiveTab('landing')}
              className="cursor-pointer group flex items-baseline gap-2"
            >
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#252820]">
                BloodBridge
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#596451] font-mono">
                AI · ED. 26
              </span>
            </div>

            {/* Center: Editorial Navigation */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              <button
                onClick={() => {
                  if (activeTab !== 'landing') setActiveTab('landing');
                  const el = document.getElementById('network');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[11px] uppercase tracking-[0.25em] text-[#252820] hover:text-[#A94A4A] transition-colors font-medium cursor-pointer"
              >
                The Network
              </button>
              <button
                onClick={() => {
                  if (activeTab !== 'landing') setActiveTab('landing');
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[11px] uppercase tracking-[0.25em] text-[#252820] hover:text-[#A94A4A] transition-colors font-medium cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  setCurrentRole('HOSPITAL');
                  setActiveTab('dashboard');
                }}
                className={`text-[11px] uppercase tracking-[0.25em] transition-colors font-medium cursor-pointer ${
                  currentRole === 'HOSPITAL' && activeTab !== 'landing'
                    ? 'text-[#A94A4A] underline underline-offset-8 decoration-[#A94A4A]'
                    : 'text-[#252820] hover:text-[#A94A4A]'
                }`}
              >
                For Hospitals
              </button>
              <button
                onClick={() => {
                  setCurrentRole('DONOR');
                  setActiveTab('dashboard');
                }}
                className={`text-[11px] uppercase tracking-[0.25em] transition-colors font-medium cursor-pointer ${
                  currentRole === 'DONOR' && activeTab !== 'landing'
                    ? 'text-[#A94A4A] underline underline-offset-8 decoration-[#A94A4A]'
                    : 'text-[#252820] hover:text-[#A94A4A]'
                }`}
              >
                For Donors
              </button>
            </nav>

            {/* Right: Geographic Location & Role Switcher */}
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.3em] text-[#596451] font-medium">
                India · 2026
              </span>

              {/* Minimal View Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setViewSwitcherOpen(!viewSwitcherOpen)}
                  className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] border border-[#D8D0C3] hover:border-[#252820] text-[#252820] bg-transparent transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span>
                    {activeTab === 'landing'
                      ? 'Edition: Public'
                      : currentRole === 'HOSPITAL'
                      ? 'Role: Hospital'
                      : currentRole === 'DONOR'
                      ? 'Role: Donor'
                      : 'Role: Admin'}
                  </span>
                  <span className="text-[#596451] text-[8px]">▼</span>
                </button>

                {viewSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#F5F0E7] border border-[#D8D0C3] py-2 z-50 shadow-sm text-left">
                    <button
                      onClick={() => {
                        setActiveTab('landing');
                        setViewSwitcherOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#252820] hover:bg-[#EAE2D5] transition-colors block"
                    >
                      01 · Public Overview
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRole('HOSPITAL');
                        setActiveTab('dashboard');
                        setViewSwitcherOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#252820] hover:bg-[#EAE2D5] transition-colors block"
                    >
                      02 · Hospital Command
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRole('DONOR');
                        setActiveTab('dashboard');
                        setViewSwitcherOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#252820] hover:bg-[#EAE2D5] transition-colors block"
                    >
                      03 · Donor Experience
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRole('ADMIN');
                        setActiveTab('dashboard');
                        setViewSwitcherOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#252820] hover:bg-[#EAE2D5] transition-colors block"
                    >
                      04 · Network Surveillance
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Button */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-1 text-[#252820] hover:text-[#A94A4A] transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 stroke-[1.5]" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#A94A4A]" />
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1 text-[#252820]"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-navigation for Hospital or Donor internal views */}
        {activeTab !== 'landing' && (
          <div className="border-t border-[#D8D0C3] bg-[#EFE9DF]/80 px-6 sm:px-8 py-2">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em]">
              <div className="flex items-center gap-6">
                <span className="text-[#596451] font-semibold">Active Sector:</span>
                {currentRole === 'HOSPITAL' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`hover:text-[#A94A4A] cursor-pointer ${
                        activeTab === 'dashboard' ? 'text-[#A94A4A] font-bold underline' : 'text-[#252820]'
                      }`}
                    >
                      Inventory & Requests
                    </button>
                    <button
                      onClick={() => setActiveTab('matching')}
                      className={`hover:text-[#A94A4A] cursor-pointer ${
                        activeTab === 'matching' ? 'text-[#A94A4A] font-bold underline' : 'text-[#252820]'
                      }`}
                    >
                      Geo Radar
                    </button>
                    <button
                      onClick={() => setActiveTab('predictions')}
                      className={`hover:text-[#A94A4A] cursor-pointer ${
                        activeTab === 'predictions' ? 'text-[#A94A4A] font-bold underline' : 'text-[#252820]'
                      }`}
                    >
                      Shortage Forecast
                    </button>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className={`hover:text-[#A94A4A] cursor-pointer ${
                        activeTab === 'reports' ? 'text-[#A94A4A] font-bold underline' : 'text-[#252820]'
                      }`}
                    >
                      Report (PDF)
                    </button>
                  </>
                ) : currentRole === 'DONOR' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`hover:text-[#A94A4A] cursor-pointer ${
                        activeTab === 'dashboard' ? 'text-[#A94A4A] font-bold underline' : 'text-[#252820]'
                      }`}
                    >
                      Emergency Dispatch
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`hover:text-[#A94A4A] cursor-pointer ${
                        activeTab === 'history' ? 'text-[#A94A4A] font-bold underline' : 'text-[#252820]'
                      }`}
                    >
                      Records & Certificate
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="text-[#A94A4A] font-bold underline"
                    >
                      Network Health & Audit
                    </button>
                  </>
                )}
              </div>

              {currentRole === 'HOSPITAL' && onOpenCreateRequest && (
                <button
                  onClick={onOpenCreateRequest}
                  className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 bg-[#252820] text-[#F5F0E7] hover:bg-[#A94A4A] transition-colors"
                >
                  + Emergency Request
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#D8D0C3] bg-[#F5F0E7] px-6 py-6 space-y-4">
            <button
              onClick={() => {
                setActiveTab('landing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs uppercase tracking-[0.25em] text-[#252820] py-2 border-b border-[#D8D0C3]"
            >
              The Network
            </button>
            <button
              onClick={() => {
                setCurrentRole('HOSPITAL');
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs uppercase tracking-[0.25em] text-[#252820] py-2 border-b border-[#D8D0C3]"
            >
              For Hospitals
            </button>
            <button
              onClick={() => {
                setCurrentRole('DONOR');
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs uppercase tracking-[0.25em] text-[#252820] py-2 border-b border-[#D8D0C3]"
            >
              For Donors
            </button>
            <button
              onClick={() => {
                setCurrentRole('ADMIN');
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs uppercase tracking-[0.25em] text-[#252820] py-2 border-b border-[#D8D0C3]"
            >
              Network Surveillance
            </button>
            <div className="pt-2 text-[10px] uppercase tracking-[0.2em] text-[#596451]">
              India · 2026 Edition
            </div>
          </div>
        )}
      </header>

      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
