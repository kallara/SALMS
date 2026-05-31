import React from 'react';
import { Calendar } from '../components/Calendar';
import { Employee, AttendanceEntry, AttendanceRequest } from '../types/database.types';
import { mockDB } from '../services/supabase';
import { 
  FileClock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';

interface AttendanceProps {
  user: Employee;
}

export const Attendance: React.FC<AttendanceProps> = ({ user }) => {
  const [entries, setEntries] = React.useState<AttendanceEntry[]>([]);
  const [requests, setRequests] = React.useState<AttendanceRequest[]>([]);
  const [isLocked, setIsLocked] = React.useState(false);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  React.useEffect(() => {
    // 1. Fetch entries for June 2026 (Month index 5) and May 2026 (index 4)
    const mayEntries = mockDB.getAttendanceEntries(4, 2026);
    const junEntries = mockDB.getAttendanceEntries(5, 2026);
    const myEntries = mayEntries.concat(junEntries).filter(e => e.employee_id === user.id);
    setEntries(myEntries);

    // 2. Fetch requests
    const myReqs = mockDB.getAttendanceRequests().filter(r => r.employee_id === user.id);
    setRequests(myReqs);

    // 3. Check lock status for current month (June)
    setIsLocked(mockDB.isMonthLocked(6, 2026));
  }, [user, refreshTrigger]);

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
      {/* Dynamic Status Grid & Calendar */}
      <Calendar 
        employee={user} 
        entries={entries} 
        requests={requests}
        onAddRequest={() => setRefreshTrigger(t => t + 1)}
        isMonthLocked={isLocked}
      />

      {/* Requests Ledger */}
      <div className="gov-card p-6">
        <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
          <FileClock size={16} className="text-gov-gold mr-2" />
          My Override & Regularisation History
        </h4>

        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pt-1">Request Type</th>
                  <th className="pb-3 pt-1">Applicable Date(s)</th>
                  <th className="pb-3 pt-1">Reason Submitted</th>
                  <th className="pb-3 pt-1">Status</th>
                  <th className="pb-3 pt-1">Remarks / Reviewed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.map(req => {
                  const badge = getStatusBadge(req.status);
                  const Icon = badge.icon;
                  
                  const displayDate = req.date 
                    ? new Date(req.date).toLocaleDateString('en-US', { dateStyle: 'medium' })
                    : `${new Date(req.start_date!).toLocaleDateString('en-US', { dateStyle: 'short' })} to ${new Date(req.end_date!).toLocaleDateString('en-US', { dateStyle: 'short' })}`;

                  const isLeave = req.requested_status_code === 'LEAVE';

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5">
                        <span className={`status-badge font-bold px-2.5 py-0.5 rounded-lg border ${
                          isLeave ? 'cal-status-LEAVE' : `cal-status-${req.requested_status_code}`
                        }`}>
                          {req.requested_status_code} - {isLeave ? 'Approved Leave' : req.status_details?.name || 'On Duty'}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-900 font-semibold">{displayDate}</td>
                      <td className="py-3.5 text-slate-500 max-w-[200px] truncate" title={req.reason}>
                        {req.reason}
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${badge.class}`}>
                          <Icon size={12} className="mr-1 flex-shrink-0" />
                          {badge.text}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500 italic text-[11px]">
                        {req.remarks ? (
                          <span>
                            "{req.remarks}"
                          </span>
                        ) : (
                          <span className="text-slate-400">Awaiting admin review</span>
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
            No regularisation or override requests submitted in this ledger cycle.
          </p>
        )}
      </div>
    </div>
  );
};
