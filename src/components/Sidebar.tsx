import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  Calendar, 
  FileSpreadsheet, 
  CheckSquare, 
  Users, 
  Palmtree, 
  BarChart3, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Employee } from '../types/database.types';

interface SidebarProps {
  user: Employee;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['root_admin', 'admin', 'employee'] },
    { path: '/profile', name: 'Employee Profile', icon: UserCircle, roles: ['root_admin', 'admin', 'employee'] },
    { path: '/attendance', name: 'Attendance Mgmt', icon: Calendar, roles: ['root_admin', 'admin', 'employee'] },
    { path: '/leaves', name: 'Leave Mgmt', icon: Palmtree, roles: ['root_admin', 'admin', 'employee'] },
    { path: '/approvals', name: 'Approvals Hub', icon: CheckSquare, roles: ['root_admin', 'admin'] },
    { path: '/employee-management', name: 'Employee Mgmt', icon: Users, roles: ['root_admin', 'admin'] },
    { path: '/holidays', name: 'Holiday Mgmt', icon: FileSpreadsheet, roles: ['root_admin', 'admin'] },
    { path: '/reports', name: 'Reports Center', icon: BarChart3, roles: ['root_admin', 'admin', 'employee'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'root_admin':
        return { name: 'Root Admin', class: 'bg-red-500/20 text-red-300 border-red-500/30' };
      case 'admin':
        return { name: 'Admin', class: 'bg-gov-gold/20 text-gov-gold-light border-gov-gold/30' };
      default:
        return { name: 'Employee', class: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  const badge = getRoleBadge(user.role);

  return (
    <aside 
      className={`h-screen bg-gov-navy text-white border-r border-gov-gold/30 flex flex-col justify-between transition-all duration-300 relative z-20 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-gov-gold hover:bg-gov-gold-light text-gov-navy-dark p-1 rounded-full border border-gov-navy shadow-md cursor-pointer transition-transform duration-200"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div>
        {/* Header / National Emblem */}
        <div className={`p-5 border-b border-slate-700/50 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="bg-gov-gold/15 p-2.5 rounded-lg border border-gov-gold/40 flex-shrink-0 animate-pulse">
            <Building size={24} className="text-gov-gold" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-display font-black text-xl tracking-wide bg-gradient-to-r from-white via-slate-200 to-gov-gold bg-clip-text text-transparent">
                SALMS
              </h1>
              <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                Govt. Attendance System
              </p>
            </div>
          )}
        </div>

        {/* User Quick Info */}
        <div className={`p-4 border-b border-slate-700/30 bg-gov-navy-light/40 ${isCollapsed ? 'text-center' : 'flex items-center space-x-3'}`}>
          <div className="relative mx-auto flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-gov-gold/50 flex items-center justify-center font-display font-bold text-lg text-gov-gold-light shadow-inner uppercase">
              {user.full_name.substring(0, 2)}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-gov-navy rounded-full"></span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="font-medium text-sm truncate text-slate-100">{user.full_name}</h2>
              <span className={`inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${badge.class}`}>
                {badge.name}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {filteredItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-gov-gold/15 text-gov-gold border-l-4 border-gov-gold shadow-inner shadow-gov-gold/5' 
                      : 'text-slate-300 hover:bg-slate-800/40 hover:text-white hover:border-l-4 hover:border-slate-500'
                  } ${isCollapsed ? 'justify-center' : 'space-x-3'}`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Area */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={onLogout}
          className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-100 transition-all duration-200 cursor-pointer ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
