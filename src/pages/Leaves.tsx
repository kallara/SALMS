import React from 'react';
import { Employee, DBEmployeeLeaveBalance, AttendanceRequest } from '../types/database.types';
import { mockDB } from '../services/supabase';
import { 
  Palmtree, 
  FilePlus2, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Lock
} from 'lucide-react';

interface LeavesProps {
  user: Employee;
}

export const Leaves: React.FC<LeavesProps> = ({ user }) => {
  const [balances, setBalances] = React.useState<DBEmployeeLeaveBalance[]>([]);
  const [requests, setRequests] = React.useState<AttendanceRequest[]>([]);
  const [isLocked, setIsLocked] = React.useState(false);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Form State
  const [leaveTypeCode, setLeaveTypeCode] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    // 1. Fetch leave balances
    const myBalances = mockDB.getLeaveBalances(user.id);
    setBalances(myBalances);
    if (myBalances.length > 0) {
      setLeaveTypeCode(myBalances[0].leave_type_code);
    }

    // 2. Fetch requests of type LEAVE
    const myReqs = mockDB.getAttendanceRequests().filter(
      r => r.employee_id === user.id && r.requested_status_code === 'LEAVE'
    );
    setRequests(myReqs);

    // 3. Check lock status
    setIsLocked(mockDB.isMonthLocked(6, 2026));
  }, [user, refreshTrigger]);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!startDate || !endDate || !reason) {
      setError('Please fill in all fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setError('End date cannot be prior to start date.');
      return;
    }

    // Check lock
    if (isLocked) {
      setError('Monthly attendance is locked. Leave applications cannot be submitted.');
      return;
    }

    // Calculate total days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check balance
    const activeBalance = balances.find(b => b.leave_type_code === leaveTypeCode);
    if (activeBalance && activeBalance.balance < diffDays) {
      setError(`Insufficient leave balance. You requested ${diffDays} days, but only have ${activeBalance.balance} days available.`);
      return;
    }

    try {
      // Submitting leave request as an attendance_request with dates
      mockDB.submitAttendanceRequest(
        user.id,
        'LEAVE',
        `Type: ${leaveTypeCode} | Reason: ${reason}`,
        undefined, // single date
        startDate, // start_date
        endDate    // end_date
      );

      setStartDate('');
      setEndDate('');
      setReason('');
      setSuccess(`Leave application for ${diffDays} day(s) submitted successfully!`);
      setRefreshTrigger(t => t + 1);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return { text: 'Approved', class: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'Rejected':
        return { text: 'Rejected', class: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle };
      default:
        return { text: 'Pending Approval', class: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {balances.map(bal => (
          <div key={bal.id} className="gov-card p-6 border-b-4 border-gov-gold relative overflow-hidden bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Leave Balance</span>
              <Palmtree size={18} className="text-gov-gold-dark" />
            </div>
            <h4 className="font-display font-black text-sm text-gov-navy truncate mb-1">
              {bal.leave_type_code}
            </h4>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-3xl font-display font-black text-gov-navy">{bal.balance}</span>
              <span className="text-xs text-slate-400 font-semibold">/ {bal.allocated} Allocated</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              Consumed to date: <strong>{bal.availed} Days</strong>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Application Form */}
        <div className="gov-card p-6 bg-white h-fit">
          <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
            <FilePlus2 size={16} className="text-gov-gold mr-2" />
            Apply for Official Leave
          </h4>

          {isLocked ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-start space-x-2">
              <Lock size={16} className="text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <strong className="block mb-0.5">Submissions Locked</strong>
                Attendance and leave ledger for this month has been locked by administration. Leaves cannot be applied for at this time.
              </div>
            </div>
          ) : (
            <form onSubmit={handleApplyLeave} className="space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs flex items-center space-x-2">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Select Leave Type</label>
                <select
                  value={leaveTypeCode}
                  onChange={(e) => setLeaveTypeCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                >
                  {balances.map(b => (
                    <option key={b.id} value={b.leave_type_code}>{b.leave_type_code}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Reason / Statement</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={3}
                  placeholder="State reason for medical, emergency, or casual leave..."
                  className="w-full px-3 py-2 border rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                ></textarea>
              </div>

              <button
                type="submit"
                className="gov-btn-primary w-full flex items-center justify-center text-xs py-2.5 shadow-sm cursor-pointer"
              >
                Submit Leave Application
              </button>
            </form>
          )}
        </div>

        {/* Leave Applications History */}
        <div className="gov-card p-6 bg-white lg:col-span-2">
          <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
            <Palmtree size={16} className="text-gov-gold mr-2" />
            My Leave Applications Ledger
          </h4>

          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pt-1">Leave Particulars</th>
                    <th className="pb-3 pt-1">Duration</th>
                    <th className="pb-3 pt-1">Statement / Reason</th>
                    <th className="pb-3 pt-1">Status</th>
                    <th className="pb-3 pt-1">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {requests.map(req => {
                    const badge = getStatusBadge(req.status);
                    const Icon = badge.icon;
                    
                    const durationStr = `${new Date(req.start_date!).toLocaleDateString('en-US', { dateStyle: 'medium' })} to ${new Date(req.end_date!).toLocaleDateString('en-US', { dateStyle: 'medium' })}`;
                    
                    const typeLabel = req.reason.split('|')[0] || 'Approved Leave';

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5">
                          <span className="status-badge font-bold px-2 py-0.5 rounded-lg border cal-status-LEAVE">
                            {typeLabel.replace('Type: ', '')}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-900 font-semibold">{durationStr}</td>
                        <td className="py-3.5 text-slate-500 max-w-[150px] truncate" title={req.reason}>
                          {req.reason.includes('|') ? req.reason.split('|')[1].replace(' Reason: ', '') : req.reason}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${badge.class}`}>
                            <Icon size={12} className="mr-1 flex-shrink-0" />
                            {badge.text}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-500 italic text-[11px]">
                          {req.remarks ? (
                            <span>"{req.remarks}"</span>
                          ) : (
                            <span className="text-slate-400">Awaiting SO review</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-10 text-center">
              No leave applications submitted in this calendar cycle.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
