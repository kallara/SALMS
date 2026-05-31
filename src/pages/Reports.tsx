import React from 'react';
import { Employee, AttendanceEntry, DBEmployeeLeaveBalance } from '../types/database.types';
import { ATTENDANCE_STATUSES } from '../types/database.types';
import { mockDB } from '../services/supabase';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  CalendarDays, 
  Printer, 
  DollarSign, 
  Percent,
  Sparkles,
  Building
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = React.useState<'attendance' | 'leave' | 'wage'>('attendance');
  const [selectedMonth, setSelectedMonth] = React.useState(5); // June (index 5)
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [entries, setEntries] = React.useState<AttendanceEntry[]>([]);

  React.useEffect(() => {
    setEmployees(mockDB.getEmployees().filter(e => e.status === 'Active'));
    // Fetch all entries for selected month index (year 2026)
    setEntries(mockDB.getAttendanceEntries(selectedMonth, 2026));
  }, [selectedMonth]);

  const handleExport = (format: 'CSV' | 'PDF') => {
    const reportNames = {
      attendance: 'Monthly_Attendance_Summary_Report',
      leave: 'Leave_Ledger_Audit_Report',
      wage: 'Daily_Wage_Salary_Disbursal_Report'
    };
    
    alert(`Generating ${format} report export for "${reportNames[activeReport]}"...\nFormat: ${format}\nPeriod: June 2026\nDownloaded successfully!`);
  };

  const getQualifyingPresentDays = (empId: string) => {
    // Qualifying statuses are P, OD, TR, TO
    const myEntries = entries.filter(e => e.employee_id === empId);
    let count = 0;
    myEntries.forEach(e => {
      if (['P', 'OD', 'TR', 'TO'].includes(e.status_code)) {
        count += 1;
      } else if (['FH', 'SH'].includes(e.status_code)) {
        count += 0.5; // half-day
      }
    });
    return count;
  };

  const getAbsentDays = (empId: string) => {
    return entries.filter(e => e.employee_id === empId && e.status_code === 'A').length;
  };

  const getLeaveDays = (empId: string) => {
    return entries.filter(e => e.employee_id === empId && e.status_code === 'LEAVE').length;
  };

  return (
    <div className="space-y-6">
      {/* Report Controls Tab */}
      <div className="gov-card p-5 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Report Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveReport('attendance')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center ${
              activeReport === 'attendance'
                ? 'bg-gov-navy text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Percent size={14} className="mr-1.5" />
            Attendance Percentage
          </button>
          
          <button
            onClick={() => setActiveReport('leave')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center ${
              activeReport === 'leave'
                ? 'bg-gov-navy text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CalendarDays size={14} className="mr-1.5" />
            Leave Ledger Summary
          </button>

          <button
            onClick={() => setActiveReport('wage')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center ${
              activeReport === 'wage'
                ? 'bg-gov-navy text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <DollarSign size={14} className="mr-1.5" />
            Daily Wage Disbursements
          </button>
        </div>

        {/* Month Selector & Export Action */}
        <div className="flex items-center space-x-2 justify-end">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 font-semibold"
          >
            <option value={4}>May 2026</option>
            <option value={5}>June 2026</option>
          </select>

          <button
            onClick={() => handleExport('CSV')}
            className="px-3 py-2 bg-slate-100 border border-slate-250 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1"
            title="Export Excel"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Excel / CSV</span>
          </button>

          <button
            onClick={() => handleExport('PDF')}
            className="px-3 py-2 bg-gov-gold text-gov-navy border border-gov-gold hover:bg-gov-gold-light text-xs font-black rounded-lg cursor-pointer flex items-center space-x-1 shadow-sm"
            title="Export Official PDF"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Official Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Tables Container */}
      <div className="gov-card p-6 md:p-8 bg-white relative">
        {/* Official Letterhead Watermark */}
        <div className="border-b-2 border-double border-slate-300 pb-6 mb-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <Building size={32} className="text-gov-navy-light flex-shrink-0" />
            <div>
              <h3 className="font-display font-black text-sm text-gov-navy tracking-wider uppercase">
                OFFICE OF ADMINISTRATIVE SERVICES
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Staff Records, Payroll & Audit Division
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right mt-3 sm:mt-0 text-[10px] text-slate-400 font-bold leading-relaxed uppercase">
            <p>REF NO: SALMS/2026/RPT-{selectedMonth + 1}</p>
            <p>DATE: June 01, 2026</p>
          </div>
        </div>

        {/* 1. ATTENDANCE REPORT */}
        {activeReport === 'attendance' && (
          <div className="space-y-4">
            <h4 className="font-display font-black text-sm text-gov-navy pb-1.5 flex items-center justify-between">
              <span>Attendance Ledger Audit Roll - {selectedMonth === 4 ? 'May 2026' : 'June 2026'}</span>
              <span className="text-[10px] px-2 py-0.5 bg-gov-gold/15 text-gov-gold-dark font-black uppercase tracking-wider rounded border border-gov-gold/30">
                Audit Verified
              </span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pt-1">Employee ID & legal Name</th>
                    <th className="pb-3 pt-1">Designation</th>
                    <th className="pb-3 pt-1">Category</th>
                    <th className="pb-3 pt-1 text-center">Present (Days)</th>
                    <th className="pb-3 pt-1 text-center">On Leave (Days)</th>
                    <th className="pb-3 pt-1 text-center">Absent (Days)</th>
                    <th className="pb-3 pt-1 text-right">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {employees.map(emp => {
                    const pres = getQualifyingPresentDays(emp.id);
                    const leaves = getLeaveDays(emp.id);
                    const absent = getAbsentDays(emp.id);
                    
                    const workingDays = pres + leaves + absent;
                    const rate = workingDays > 0 ? Math.round((pres / workingDays) * 100) : 100;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5">
                          <div>
                            <h5 className="font-extrabold text-gov-navy">{emp.full_name}</h5>
                            <span className="text-[10px] text-slate-400">ID: {emp.employee_no}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-800 font-semibold">{emp.functional_role?.name}</td>
                        <td className="py-3.5 text-slate-500">{emp.employment_category?.name || 'Permanent'}</td>
                        <td className="py-3.5 text-center text-emerald-600 font-bold">{pres}</td>
                        <td className="py-3.5 text-center text-amber-600">{leaves}</td>
                        <td className="py-3.5 text-center text-rose-600">{absent}</td>
                        <td className="py-3.5 text-right font-black text-gov-navy">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. LEAVE REPORT */}
        {activeReport === 'leave' && (
          <div className="space-y-4">
            <h4 className="font-display font-black text-sm text-gov-navy pb-1.5 flex items-center justify-between">
              <span>Availed Leave Particulars Summary - {selectedMonth === 4 ? 'May 2026' : 'June 2026'}</span>
              <span className="text-[10px] px-2 py-0.5 bg-gov-gold/15 text-gov-gold-dark font-black uppercase tracking-wider rounded border border-gov-gold/30">
                Audited
              </span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pt-1">Employee ID & Legal Name</th>
                    <th className="pb-3 pt-1">Service category</th>
                    <th className="pb-3 pt-1 text-center">Allocated Leaves</th>
                    <th className="pb-3 pt-1 text-center">Availed Leaves</th>
                    <th className="pb-3 pt-1 text-center">Leaves Availed in {selectedMonth === 4 ? 'May' : 'June'}</th>
                    <th className="pb-3 pt-1 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {employees.map(emp => {
                    const balances = mockDB.getLeaveBalances(emp.id);
                    const totalAlloc = balances.reduce((acc, b) => acc + b.allocated, 0);
                    const totalAvailed = balances.reduce((acc, b) => acc + b.availed, 0);
                    const totalBal = balances.reduce((acc, b) => acc + b.balance, 0);
                    
                    const availedThisMonth = getLeaveDays(emp.id);

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5">
                          <div>
                            <h5 className="font-extrabold text-gov-navy">{emp.full_name}</h5>
                            <span className="text-[10px] text-slate-400">ID: {emp.employee_no}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-500">{emp.employment_category?.name || 'Permanent'}</td>
                        <td className="py-3.5 text-center text-slate-600 font-bold">{totalAlloc || '-'}</td>
                        <td className="py-3.5 text-center text-slate-500">{totalAvailed || '-'}</td>
                        <td className="py-3.5 text-center text-amber-600 font-bold">{availedThisMonth || '-'}</td>
                        <td className="py-3.5 text-right font-black text-gov-navy">{totalBal || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. DAILY WAGE REPORT */}
        {activeReport === 'wage' && (
          <div className="space-y-4">
            <h4 className="font-display font-black text-sm text-gov-navy pb-1.5 flex items-center justify-between">
              <span>Daily Wage Staff Disbursal Ledger - {selectedMonth === 4 ? 'May 2026' : 'June 2026'}</span>
              <span className="text-[10px] px-2 py-0.5 bg-gov-gold/15 text-gov-gold-dark font-black uppercase tracking-wider rounded border border-gov-gold/30">
                Payroll Certified
              </span>
            </h4>
            <p className="text-xs text-slate-400 font-medium italic mt-1 leading-relaxed">
              * Note: Disbursal Salary calculation formula: <code>Total Salary = Qualifying Present Days (marked P, OD, TR, TO) × Daily Wage Rate (INR)</code>.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pt-1">Employee ID & Legal Name</th>
                    <th className="pb-3 pt-1">Designation</th>
                    <th className="pb-3 pt-1 text-center">Daily Wage Rate</th>
                    <th className="pb-3 pt-1 text-center">Qualifying Days (P, OD, TR, TO)</th>
                    <th className="pb-3 pt-1 text-center">Absent Days (Deducted)</th>
                    <th className="pb-3 pt-1 text-right">Total Net Salary Pay-out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {employees
                    .filter(emp => emp.employment_category?.name === 'Daily Wage')
                    .map(emp => {
                      const presentDays = getQualifyingPresentDays(emp.id);
                      const absentDays = getAbsentDays(emp.id);
                      const totalSalary = presentDays * emp.daily_wage_rate;

                      return (
                        <tr key={emp.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5">
                            <div>
                              <h5 className="font-extrabold text-gov-navy">{emp.full_name}</h5>
                              <span className="text-[10px] text-slate-400">ID: {emp.employee_no}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-slate-800 font-semibold">{emp.functional_role?.name}</td>
                          <td className="py-3.5 text-center text-slate-800 font-bold">₹ {emp.daily_wage_rate}</td>
                          <td className="py-3.5 text-center text-emerald-600 font-black">{presentDays} Day(s)</td>
                          <td className="py-3.5 text-center text-rose-500">{absentDays} Day(s)</td>
                          <td className="py-3.5 text-right font-black text-gov-navy text-sm">
                            ₹ {totalSalary.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  {employees.filter(emp => emp.employment_category?.name === 'Daily Wage').length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                        No Daily Wage employees currently enrolled in the roster.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
