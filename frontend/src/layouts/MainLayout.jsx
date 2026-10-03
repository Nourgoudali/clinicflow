import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export const MainLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return 'Tableau de bord';
    if (pathname.startsWith('/patients/') && pathname !== '/patients') return 'Détails du Patient';
    if (pathname.startsWith('/patients')) return 'Gestion des Patients';
    if (pathname.startsWith('/appointments')) return 'Gestion des Rendez-vous';
    return 'ClinicFlow';
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Collapsible Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 h-full">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* Mobile Off-Canvas Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative z-50 flex w-64 flex-1 flex-col bg-card shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              isMobile={true}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area — 100% full available width */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 w-full">
        <Navbar
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          title={getPageTitle(location.pathname)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
