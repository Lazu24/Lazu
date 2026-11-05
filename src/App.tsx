import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Topbar } from './components/layout/Topbar.tsx';
import { BottomBanner } from './components/layout/BottomBanner.tsx';
import { QuickSearchModal } from './components/layout/QuickSearchModal.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { FocusPage } from './pages/FocusPage.tsx';
import { PlanningPage } from './pages/PlanningPage.tsx';
import { TasksPage } from './pages/TasksPage.tsx';
import { StatisticsPage } from './pages/StatisticsPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { TestingPanelModal } from './components/layout/TestingPanelModal.tsx';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTestingModalOpen, setIsTestingModalOpen] = useState(false);
  const { toastMessage, isLoading } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0A12] text-[#E8E7F0] flex flex-col lg:flex-row antialiased selection:bg-[#8B5CF6]/30 selection:text-[#67E8B4]">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
          onOpenTestingPanel={() => setIsTestingModalOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#9B97AC]">Cargando tu espacio...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/concentracion" element={<FocusPage />} />
              <Route path="/planificacion" element={<PlanningPage />} />
              <Route path="/tareas" element={<TasksPage />} />
              <Route path="/estadisticas" element={<StatisticsPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/ajustes" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}

          {/* Contextual informative bottom banner */}
          <BottomBanner />
        </main>
      </div>

      {/* ⌘ K Quick Search Palette */}
      <QuickSearchModal />

      {/* Sprint 1 Diagnostic & Testing Panel */}
      <TestingPanelModal
        isOpen={isTestingModalOpen}
        onClose={() => setIsTestingModalOpen(false)}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#171426] border border-[#67E8B4]/40 text-[#E8E7F0] shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={16} className="text-[#67E8B4]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
