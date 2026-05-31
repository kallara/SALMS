import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  Palmtree, 
  Cake, 
  TrendingUp, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Percent
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Employee, DBEmployeeLeaveBalance } from '../types/database.types';
import { mockDB } from '../services/supabase';

interface DashboardProps {
  user: Employee;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = React.useState({
    totalEmployees: 0,
    presentCount: 0,
    leaveCount: 0,
    odCount: 0,
    tourCount: 0,
    absentCount: 0
  });

  const [personalStats, setPersonalStats] = React.useState({
    presentDays: 0,
    leaveDays: 0,
    odDays: 0,
    absentDays: 0,
    attendanceRate: 100
  });

  const [leaveBalances, setLeaveBalances] = React.useState<DBEmployeeLeaveBalance[]>([]);
  const [birthdaysToday, setBirthdaysToday] = React.useState<Employee[]>([]);
  const [birthdaysThisWeek, setBirthdaysThisWeek] = React.useState<Employee[]>([]);

  React.useEffect(() => {
    const emps = mockDB.getEmployees().filter(e => e.status === 'Active');
    const entries = mockDB.getAttendanceEntries(5, 2026); // June 2026 (index 5)
    
    // 1. Calculate today's stats (June 1st, 2026)
    const todayEntries = entries.filter(e => e.date === '2026-06-01');
    const present = todayEntries.filter(e => ['P', 'OD', 'TR', 'TO', 'FH', 'SH'].includes(e.status_code)).length;
    const leave = todayEntries.filter(e => e.status_code === 'LEAVE').length;
    const od = todayEntries.filter(e => e.status_code === 'OD').length;
    const tour = todayEntries.filter(e => e.status_code === 'TR').length;
    const absent = todayEntries.filter(e => e.status_code === 'A').length;

    setStats({
      totalEmployees: emps.length,
      presentCount: present,
      leaveCount: leave,
      odCount: od,
      tourCount: tour,
      absentCount: absent
    });

    // 2. Calculate personal stats (for May & June 2026 combined)
    const allEntries = mockDB.getAttendanceEntries(4, 2026).concat(entries); // May & June
    const myEntries = allEntries.filter(e => e.employee_id === user.id);
    const myP = myEntries.filter(e => e.status_code === 'P').length;
    const myOD = myEntries.filter(e => e.status_code === 'OD').length;
    const myL = myEntries.filter(e => e.status_code === 'LEAVE').length;
    const myA = myEntries.filter(e => e.status_code === 'A').length;
    
    const workingDaysCount = myEntries.filter(e => e.status_code !== 'WO' && e.status_code !== 'H').length;
    const rate = workingDaysCount > 0 ? Math.round(((myP + myOD) / workingDaysCount) * 100) : 100;

    setPersonalStats({
      presentDays: myP,
      leaveDays: myL,
      odDays: myOD,
      absentDays: myA,
      attendanceRate: rate
    });

    // 3. Leave balances
    setLeaveBalances(mockDB.getLeaveBalances(user.id));

    // 4. Birthday Engine (Local environment date: June 1st)
    const today = new Date('2026-06-01');
    const todayMonth = today.getMonth() + 1; // 6
    const todayDay = today.getDate(); // 1
    
    const bdayTodayList: Employee[] = [];
    const bdayWeekList: Employee[] = [];

    emps.forEach(emp => {
      if (emp.date_of_birth) {
        const dob = new Date(emp.date_of_birth);
        const dobMonth = dob.getMonth() + 1;
        const dobDay = dob.getDate();

        if (dobMonth === todayMonth && dobDay === todayDay) {
          bdayTodayList.push(emp);
        } else if (dobMonth === todayMonth && dobDay > todayDay && dobDay <= todayDay + 7) {
          bdayWeekList.push(emp);
        }
      }
    });

    setBirthdaysToday(bdayTodayList);
    setBirthdaysThisWeek(bdayWeekList);
  }, [user]);

  // Chart data: Mock monthly trend (May 2026)
  const chartData = [
    { name: 'May 04', Present: 3, Leave: 1, OnDuty: 0, Absent: 0 },
    { name: 'May 08', Present: 3, Leave: 0, OnDuty: 1, Absent: 0 },
    { name: 'May 12', Present: 2, Leave: 1, OnDuty: 0, Absent: 1 },
    { name: 'May 16', Present: 3, Leave: 0, OnDuty: 0, Absent: 0 },
    { name: 'May 20', Present: 3, Leave: 0, OnDuty: 1, Absent: 0 },
    { name: 'May 24', Present: 4, Leave: 0, OnDuty: 0, Absent: 0 },
    { name: 'May 28', Present: 3, Leave: 1, OnDuty: 0, Absent: 0 },
    { name: 'May 31', Present: 3, Leave: 0, OnDuty: 1, Absent: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-gov-navy-light border-l-8 border-gov-gold relative overflow-hidden text-white flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-gov-gold bg-gov-gold/15 px-3 py-1 rounded-full border border-gov-gold/25">
            Gateway Dashboard
          </span>
          <h2 className="text-2xl font-display font-black pt-1">
            Welcome, {user.full_name}
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            {user.functional_role?.name || 'Administration'} Section • Designation: <span className="text-gov-gold-light font-bold">{user.additional_charges?.[0] || 'Officer'}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 relative z-10 flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold">
          <Calendar className="mr-2 text-gov-gold" size={16} />
          Current Session: June 01, 2026
        </div>
      </div>

      {/* Birthday Celebration Banner Widget */}
      {birthdaysToday.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-gov-gold to-yellow-500 text-gov-navy-dark p-6 rounded-2xl shadow-xl border border-yellow-400 relative overflow-hidden animate-[pulse_3s_infinite] flex items-center space-x-4">
          <div className="bg-white/20 p-3.5 rounded-full border border-white/30 flex-shrink-0 animate-spin">
            <Cake size={32} className="text-white" />
          </div>
          <div className="space-y-1 text-white shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded border border-white/20 text-white">
              Special Celebration
            </span>
            <h3 className="font-display font-black text-lg">
              Happy Birthday Today!
            </h3>
            <p className="text-sm font-medium">
              We extend our warmest wishes to: <strong>{birthdaysToday.map(e => e.full_name).join(', ')}</strong> on their special day! 🎂🎈
            </p>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      {user.role === 'employee' ? (
        // Personal Employee Stats
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="gov-card p-5 flex items-center space-x-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100 flex-shrink-0">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Present Days</p>
              <h3 className="text-2xl font-display font-black text-gov-navy mt-1">{personalStats.presentDays} Days</h3>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">This cycle</p>
            </div>
          </div>

          <div className="gov-card p-5 flex items-center space-x-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100 flex-shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">On Duty (OD)</p>
              <h3 className="text-2xl font-display font-black text-gov-navy mt-1">{personalStats.odDays} Days</h3>
              <p className="text-[10px] text-blue-600 font-semibold mt-1">Field operations</p>
            </div>
          </div>

          <div className="gov-card p-5 flex items-center space-x-4">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl border border-amber-100 flex-shrink-0">
              <Palmtree size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Approved Leaves</p>
              <h3 className="text-2xl font-display font-black text-gov-navy mt-1">{personalStats.leaveDays} Days</h3>
              <p className="text-[10px] text-amber-600 font-semibold mt-1">Deducted from balance</p>
            </div>
          </div>

          <div className="gov-card p-5 flex items-center space-x-4">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl border border-indigo-100 flex-shrink-0">
              <Percent size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Attendance Rate</p>
              <h3 className="text-2xl font-display font-black text-gov-navy mt-1">{personalStats.attendanceRate}%</h3>
              <p className="text-[10px] text-indigo-600 font-semibold mt-1">Target: &gt;80%</p>
            </div>
          </div>
        </div>
      ) : (
        // Admin Organization Stats
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          <div className="gov-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Staff</span>
              <Users size={16} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-display font-black text-gov-navy">{stats.totalEmployees}</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2">Active employees</span>
          </div>

          <div className="gov-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today Present</span>
              <UserCheck size={16} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-display font-black text-emerald-600">{stats.presentCount}</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2">Marked present</span>
          </div>

          <div className="gov-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Leave</span>
              <Palmtree size={16} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-display font-black text-amber-600">{stats.leaveCount}</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2">Approved leave</span>
          </div>

          <div className="gov-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Duty (OD)</span>
              <TrendingUp size={16} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-display font-black text-blue-600">{stats.odCount}</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2">Field assignments</span>
          </div>

          <div className="gov-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Tour</span>
              <Calendar size={16} className="text-teal-500" />
            </div>
            <h3 className="text-2xl font-display font-black text-teal-600">{stats.tourCount}</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2">Out-of-station</span>
          </div>

          <div className="gov-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent Today</span>
              <UserX size={16} className="text-rose-500" />
            </div>
            <h3 className="text-2xl font-display font-black text-rose-600">{stats.absentCount}</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2">Unexcused</span>
          </div>
        </div>
      )}

      {/* Main Layout Grid (Charts and Balance / Upcoming Birthdays) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="gov-card p-6">
            <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
              <TrendingUp size={16} className="text-gov-gold mr-2" />
              May 2026 Daily Attendance Trends
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="Present" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
                  <Area type="monotone" dataKey="OnDuty" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Side Panel: Leave Balances & Upcoming Birthdays */}
        <div className="space-y-6">
          {/* Leave Balances Grids */}
          <div className="gov-card p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
                <Palmtree size={16} className="text-gov-gold mr-2" />
                Your Leave Balance (2026)
              </h4>
              <div className="space-y-3.5">
                {leaveBalances.length > 0 ? (
                  leaveBalances.map(bal => {
                    const consumedPct = Math.round((bal.availed / bal.allocated) * 100);
                    return (
                      <div key={bal.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">{bal.leave_type_code}</span>
                          <span className="font-bold text-gov-navy">{bal.balance} / {bal.allocated} Left</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full bg-gov-gold rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(100, 100 - consumedPct)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6 italic">
                    No leave balances allocated for your category.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Birthdays Widget */}
          <div className="gov-card p-6">
            <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
              <Cake size={16} className="text-gov-gold mr-2" />
              Upcoming Birthdays This Week
            </h4>
            
            {birthdaysThisWeek.length > 0 ? (
              <div className="space-y-3">
                {birthdaysThisWeek.map(emp => {
                  const bday = new Date(emp.date_of_birth!);
                  return (
                    <div key={emp.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs uppercase text-slate-600">
                          {emp.full_name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{emp.full_name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.employment_category?.name || 'Permanent'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gov-gold-dark bg-gov-gold/10 px-2 py-0.5 rounded border border-gov-gold/20 flex items-center space-x-1">
                        <span>{bday.toLocaleString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 italic">
                No birthdays upcoming this week.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
