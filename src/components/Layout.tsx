import React from 'react';
import { Sidebar } from './Sidebar';
import { Employee } from '../types/database.types';
import { mockDB } from '../services/supabase';
import { 
  Lock, 
  Unlock, 
  Menu, 
  CalendarDays, 
  Briefcase,
  AlertTriangle
} from 'lucide-react';

interface LayoutProps {
  user: Employee;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [currentLockStatus, setCurrentLockStatus] = React.useState(false);

  React.useEffect(() => {
    // Check lock status for current month (June 2026)
    const locked = mockDB.isMonthLocked(6, 2026);
    setCurrentLockStatus(locked);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex">
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* Sidebar - Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div 
            className="fixed inset-0 bg-gov-navy/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative flex w-full max-w-xs flex-col bg-gov-navy transition duration-300">
            <Sidebar user={user} onLogout={onLogout} />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-3">
            {/* Mobile Sidebar Trigger */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
            >
              <Menu size={20} />
            </button>
            
            {/* Title / Current State */}
            <div className="hidden sm:block">
              <h2 className="font-display font-bold text-lg text-gov-navy">
                Staff Attendance, Leave & Management System
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Additional Charges display */}
            {user.additional_charges && user.additional_charges.length > 0 && (
              <div className="hidden lg:flex items-center bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1 rounded-lg">
                <Briefcase size={12} className="mr-1.5 flex-shrink-0 text-amber-600" />
                <span className="font-semibold truncate max-w-[180px]">
                  Addl: {user.additional_charges.join(', ')}
                </span>
              </div>
            )}

            {/* Employee Category display */}
            <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
              Category: <span className="font-bold ml-1">{user.employment_category?.name || 'Permanent'}</span>
            </div>

            {/* Lock Status Display */}
            <div className={`flex items-center text-xs px-2.5 py-1 rounded-lg border font-medium ${
              currentLockStatus 
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              {currentLockStatus ? (
                <>
                  <Lock size={12} className="mr-1.5 flex-shrink-0" />
                  <span>June locked</span>
                </>
              ) : (
                <>
                  <Unlock size={12} className="mr-1.5 flex-shrink-0" />
                  <span>June open</span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Locked Month Alert Banner */}
        {currentLockStatus && (
          <div className="bg-rose-600 text-white text-xs py-2 px-6 flex items-center justify-between shadow-inner">
            <div className="flex items-center mx-auto sm:mx-0">
              <AlertTriangle size={14} className="mr-2 animate-bounce flex-shrink-0 text-amber-300" />
              <span className="font-medium">
                <strong>Attention:</strong> Attendance entries for <strong>June 2026</strong> have been locked by administration. No new marking or override requests can be submitted.
              </span>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 focus:outline-none p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
