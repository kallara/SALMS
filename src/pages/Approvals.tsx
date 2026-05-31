import React from 'react';
import { Employee, AttendanceRequest, DBAttendanceMonthLock } from '../types/database.types';
import { mockDB } from '../services/supabase';
import { 
  CheckSquare, 
  Lock, 
  Unlock, 
  UserCheck, 
  UserX, 
  FileCheck,
  CalendarDays,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ApprovalsProps {
  user: Employee;
}

export const Approvals: React.FC<ApprovalsProps> = ({ user }) => {
  const [requests, setRequests] = React.useState<AttendanceRequest[]>([]);
  const [locks, setLocks] = React.useState<DBAttendanceMonthLock[]>([]);
  const [remarks, setRemarks] = React.useState<Record<string, string>>({});
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  React.useEffect(() => {
    // Fetch all pending requests
    const pending = mockDB.getAttendanceRequests().filter(r => r.status === 'Pending');
    setRequests(pending);

    // Fetch month locks
    setLocks(mockDB.getLocks());
  }, [refreshTrigger]);

  const handleAction = (reqId: string, status: 'Approved' | 'Rejected') => {
    const reqRemarks = remarks[reqId] || '';
    if (status === 'Rejected' && !reqRemarks) {
      alert('Please provide review remarks for rejection.');
      return;
    }

    try {
      mockDB.actionAttendanceRequest(reqId, status, user.id, reqRemarks || 'Actioned by administration');
      setRemarks(prev => {
        const copy = { ...prev };
        delete copy[reqId];
        return copy;
      });
      setRefreshTrigger(t => t + 1);
      alert(`Request has been successfully ${status.toLowerCase()}!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleLock = (month: number) => {
    try {
      const lock = mockDB.toggleMonthLock(month, 2026, user.id);
      setRefreshTrigger(t => t + 1);
      alert(`June 2026 Attendance has been successfully ${lock.locked ? 'LOCKED' : 'UNLOCKED'}!`);
      // Force reload page to refresh Layout header state
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Monthly Lock Manager Grid */}
      <div className="gov-card p-6">
        <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
          <CalendarDays size={16} className="text-gov-gold mr-2" />
          Attendance Lock Center (Year 2026)
        </h4>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Locking a month prevents employees and administrators from modifying attendance logs (`attendance_entries`) or submitting override requests for that period. Toggle lock states below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {monthNames.map((mName, index) => {
            const mNum = index + 1;
            const lockObj = locks.find(l => l.month === mNum && l.year === 2026);
            const isLocked = lockObj ? lockObj.locked : false;

            return (
              <div 
                key={mNum} 
                className={`p-4 border rounded-xl flex items-center justify-between shadow-sm transition-all duration-150 ${
                  isLocked 
                    ? 'border-rose-200 bg-rose-50/50' 
                    : 'border-slate-200 bg-white hover:border-slate-350'
                }`}
              >
                <div>
                  <h5 className="text-xs font-extrabold text-gov-navy">{mName}</h5>
                  <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded border ${
                    isLocked 
                      ? 'bg-rose-100 border-rose-200 text-rose-700 animate-pulse' 
                      : 'bg-emerald-100 border-emerald-200 text-emerald-700'
                  }`}>
                    {isLocked ? (
                      <>
                        <Lock size={8} className="mr-1" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Unlock size={8} className="mr-1" />
                        Unlocked
                      </>
                    )}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleLock(mNum)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors shadow-sm ${
                    isLocked 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250'
                  }`}
                  title={isLocked ? 'Unlock month' : 'Lock month'}
                >
                  {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approvals Queue */}
      <div className="gov-card p-6">
        <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
          <CheckSquare size={16} className="text-gov-gold mr-2" />
          Pending Overrides & Leave Request Queue
        </h4>

        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map(req => {
              const displayDate = req.date 
                ? new Date(req.date).toLocaleDateString('en-US', { dateStyle: 'medium' })
                : `${new Date(req.start_date!).toLocaleDateString('en-US', { dateStyle: 'medium' })} to ${new Date(req.end_date!).toLocaleDateString('en-US', { dateStyle: 'medium' })}`;

              const isLeave = req.requested_status_code === 'LEAVE';
              const reasonText = req.reason.includes('|') ? req.reason.split('|')[1].replace(' Reason: ', '') : req.reason;
              const typeLabel = req.reason.includes('|') ? req.reason.split('|')[0].replace('Type: ', '') : req.requested_status_code;

              return (
                <div key={req.id} className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 shadow-sm space-y-4 transition-all duration-200 hover:shadow-md">
                  {/* Row 1: Employee and Request Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2.5 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-600 border border-slate-300">
                        {req.employee?.full_name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-gov-navy">{req.employee?.full_name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                          {req.employee?.employment_category?.name || 'Permanent'} • {req.employee?.functional_role?.name || 'Technical'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`status-badge font-bold px-3 py-0.5 rounded-lg border ${
                        isLeave ? 'cal-status-LEAVE border-amber-300 text-amber-800' : `cal-status-${req.requested_status_code}`
                      }`}>
                        {isLeave ? typeLabel : `${req.requested_status_code} - ${req.status_details?.name || 'Override'}`}
                      </span>
                      <span className="text-xs text-slate-500 font-bold flex items-center">
                        <Clock size={12} className="mr-1 text-slate-400" />
                        {new Date(req.created_at).toLocaleDateString('en-US', { dateStyle: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Date Details & Reason */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                    <p className="text-slate-800">
                      Requesting override for: <strong className="text-gov-navy font-extrabold">{displayDate}</strong>
                    </p>
                    <p className="text-slate-500 italic">
                      Reason: <span className="font-semibold text-slate-600">"{reasonText}"</span>
                    </p>
                  </div>

                  {/* Row 3: Action remarks and buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 border-t border-slate-100 pt-4">
                    <input
                      type="text"
                      placeholder="Add administrative review remarks (required for rejection)..."
                      value={remarks[req.id] || ''}
                      onChange={(e) => setRemarks(prev => ({ ...prev, [req.id]: e.target.value }))}
                      className="flex-grow px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                    />

                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => handleAction(req.id, 'Rejected')}
                        className="px-4 py-2 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center space-x-1"
                      >
                        <UserX size={13} />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'Approved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center space-x-1 shadow-sm shadow-emerald-600/10"
                      >
                        <UserCheck size={13} />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-2 text-slate-400">
            <Sparkles size={24} className="text-slate-350" />
            <p className="text-xs italic">Approvals queue is clear. No pending regularization or leave requests!</p>
          </div>
        )}
      </div>
    </div>
  );
};
