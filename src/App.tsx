import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { HospitalDashboard } from './components/hospital/HospitalDashboard.tsx';
import { SmartDonorMatching } from './components/hospital/SmartDonorMatching.tsx';
import { ShortagePrediction } from './components/hospital/ShortagePrediction.tsx';
import { MonthlyReportView } from './components/hospital/MonthlyReportView.tsx';
import { DonorDashboard } from './components/donor/DonorDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { CreateRequestModal } from './components/hospital/CreateRequestModal.tsx';

const AppContent: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenCreateRequest = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans antialiased text-slate-900">
      {/* Universal Top Header */}
      <Header onOpenCreateRequest={handleOpenCreateRequest} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' ? (
          <LandingPage onOpenCreateRequest={handleOpenCreateRequest} />
        ) : currentRole === 'HOSPITAL' ? (
          activeTab === 'matching' ? (
            <SmartDonorMatching />
          ) : activeTab === 'predictions' ? (
            <ShortagePrediction />
          ) : activeTab === 'reports' ? (
            <MonthlyReportView onBackToDashboard={() => setActiveTab('dashboard')} />
          ) : (
            <HospitalDashboard />
          )
        ) : currentRole === 'DONOR' ? (
          <DonorDashboard />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Global Create Request Modal */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Trust & Safety Clinical Disclaimer Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
