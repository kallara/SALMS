import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  PlusCircle, 
  Info,
  Lock
} from 'lucide-react';
import { Employee, AttendanceEntry, AttendanceRequest } from '../types/database.types';
import { ATTENDANCE_STATUSES } from '../types/database.types';
import { mockDB, isWeekend } from '../services/supabase';

interface CalendarProps {
  employee: Employee;
  entries: AttendanceEntry[];
  requests: AttendanceRequest[];
  onAddRequest: () => void;
  isMonthLocked: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  employee, 
  entries, 
  requests, 
  onAddRequest,
  isMonthLocked
}) => {
  const [currentDate, setCurrentDate] = React.useState(new Date('2026-06-01')); // Fixed local time environment
  const [selectedDay, setSelectedDay] = React.useState<{ dateStr: string; entry?: AttendanceEntry; request?: AttendanceRequest } | null>(null);
  const [requestModalOpen, setRequestModalOpen] = React.useState(false);
  const [reqCode, setReqCode] = React.useState('OD');
  const [reqReason, setReqReason] = React.useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week for 1st day

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Generate grid cells
  const cells: { dateStr: string; dayNum: number; entry?: AttendanceEntry; request?: AttendanceRequest; isWO: boolean }[] = [];
  
  // Fetch holidays for the active month
  const holidays = mockDB.getHolidays();

  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const entry = entries.find(e => e.date === dStr);
    const request = requests.find(r => r.date === dStr && r.status === 'Pending');
    const isWO = isWeekend(dStr);
    
    cells.push({
      dateStr: dStr,
      dayNum: d,
      entry,
      request,
      isWO
    });
  }

  // Handle regularization request submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    try {
      mockDB.submitAttendanceRequest(
        employee.id,
        reqCode,
        reqReason,
        selectedDay.dateStr
      );
      setRequestModalOpen(false);
      setReqReason('');
      onAddRequest();
      alert('Attendance regularization request submitted successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="gov-card p-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-4 mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <CalendarDays className="text-gov-navy flex-shrink-0" size={22} />
          <h3 className="font-display font-bold text-lg text-gov-navy">
            Monthly Attendance Ledger - {monthNames[month]} {year}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-semibold text-sm px-4 py-1 text-gov-navy border border-slate-200 rounded-lg bg-slate-50">
            {monthNames[month].substring(0, 3)} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-1.5">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for padding */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square bg-slate-50 border border-slate-100 rounded-lg opacity-40"></div>
            ))}

            {/* Actual day cells */}
            {cells.map(cell => {
              // Calculate status
              let displayCode = '-';
              let badgeColor = 'bg-slate-50 border-slate-200 text-slate-400';
              let isHoliday = holidays.find(h => h.date === cell.dateStr);

              if (cell.entry) {
                displayCode = cell.entry.status_code;
                const statusMeta = ATTENDANCE_STATUSES[displayCode];
                if (statusMeta) {
                  badgeColor = `cal-status-${displayCode}`;
                }
              } else if (isHoliday) {
                displayCode = 'H';
                badgeColor = 'cal-status-H animate-pulse';
              } else if (cell.isWO) {
                displayCode = 'WO';
                badgeColor = 'cal-status-WO';
              }

              const isSelected = selectedDay?.dateStr === cell.dateStr;

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelectedDay({ dateStr: cell.dateStr, entry: cell.entry, request: cell.request })}
                  className={`aspect-square p-1.5 rounded-xl border flex flex-col justify-between items-stretch text-left transition-all duration-150 cursor-pointer ${
                    isSelected 
                      ? 'border-gov-gold ring-2 ring-gov-gold/20 shadow-md transform scale-[1.03]' 
                      : 'border-slate-200 hover:border-slate-400/70 hover:shadow-sm'
                  } ${cell.isWO ? 'bg-slate-50/50' : 'bg-white'}`}
                >
                  <span className={`text-xs font-bold font-display ${isSelected ? 'text-gov-gold-dark' : 'text-slate-500'}`}>
                    {cell.dayNum}
                  </span>
                  
                  {/* Status Indicator */}
                  <div className="flex flex-col items-center">
                    <span className={`status-badge text-[10px] w-full text-center py-0.5 border rounded-lg ${badgeColor}`}>
                      {displayCode}
                    </span>
                    {cell.request && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 animate-ping" title="Pending request"></span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info & Request Panel */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between h-full">
          <div>
            <h4 className="font-display font-bold text-sm text-gov-navy border-b border-slate-200 pb-2.5 mb-4 flex items-center">
              <Info size={16} className="mr-2 text-gov-navy" />
              Day Details
            </h4>

            {selectedDay ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Date Selected</label>
                  <span className="text-sm font-semibold text-gov-navy">
                    {new Date(selectedDay.dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</label>
                  <div className="mt-1 flex items-center">
                    {(() => {
                      let code = '-';
                      let label = 'No Entry Marked';
                      let color = 'bg-slate-100 border-slate-300 text-slate-500';
                      let desc = 'No attendance entry exists for this day. (Defaults to Weekly Off on weekends).';
                      
                      let isHoliday = holidays.find(h => h.date === selectedDay.dateStr);

                      if (selectedDay.entry) {
                        code = selectedDay.entry.status_code;
                        const meta = ATTENDANCE_STATUSES[code];
                        label = meta?.name || code;
                        color = `cal-status-${code}`;
                        desc = meta?.description || '';
                      } else if (isHoliday) {
                        code = 'H';
                        label = `Holiday: ${isHoliday.name}`;
                        color = 'cal-status-H';
                        desc = 'Declared gazetted/restricted public holiday.';
                      } else if (isWeekend(selectedDay.dateStr)) {
                        code = 'WO';
                        label = 'Weekly Off';
                        color = 'cal-status-WO';
                        desc = 'Weekend rest day (Saturday or Sunday).';
                      }

                      return (
                        <div className="space-y-2">
                          <span className={`status-badge border py-1 px-3 text-[11px] rounded-lg font-bold ${color}`}>
                            {code} - {label}
                          </span>
                          <p className="text-xs text-slate-500 leading-relaxed italic">{desc}</p>
                          {selectedDay.entry?.remarks && (
                            <p className="text-xs text-gov-navy-light font-medium mt-1">
                              <strong>Remarks:</strong> {selectedDay.entry.remarks}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {selectedDay.request ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
                    <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-600 mb-1">
                      Pending Regularisation Request
                    </span>
                    Requested status override: <strong>{selectedDay.request.requested_status_code}</strong>.
                    <br />
                    Reason: <em>"{selectedDay.request.reason}"</em>
                  </div>
                ) : (
                  <div className="pt-2">
                    {isMonthLocked ? (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-lg text-xs flex items-start space-x-2">
                        <Lock size={16} className="text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <strong className="block mb-0.5">Month locked</strong>
                          Attendance entries for this month have been locked by administration. No override requests can be submitted.
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRequestModalOpen(true)}
                        className="gov-btn-primary w-full flex items-center justify-center text-xs py-2 cursor-pointer"
                      >
                        <PlusCircle size={14} className="mr-1.5" />
                        Request Status Override
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Click on any day in the calendar grid to view detailed status or request regularizations.
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="border-t border-slate-200 pt-4 mt-6">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5">
              Attendance Codes Legend
            </h5>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] text-slate-500 font-medium">
              {Object.entries(ATTENDANCE_STATUSES).map(([code, meta]) => (
                <div key={code} className="flex items-center space-x-1.5">
                  <span className={`w-8 text-center text-[9px] font-bold py-0.5 border rounded ${`cal-status-${code}`}`}>
                    {code}
                  </span>
                  <span className="truncate">{meta.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Override Request Modal */}
      {requestModalOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gov-navy/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative animate-[scaleIn_0.2s_ease-out]">
            <h3 className="font-display font-black text-lg text-gov-navy mb-4 border-b pb-2.5 border-slate-100">
              Submit Attendance Override Request
            </h3>
            
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Selected Date</label>
                <input 
                  type="text" 
                  value={new Date(selectedDay.dateStr).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  disabled 
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-600 text-sm font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Requested Status Code</label>
                <select
                  value={reqCode}
                  onChange={(e) => setReqCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                >
                  <option value="OD">OD - On Duty</option>
                  <option value="TR">TR - Tour</option>
                  <option value="TO">TO - Tour Off</option>
                  <option value="LEAVE">LEAVE - Approved Leave</option>
                  <option value="CO">CO - Compensatory Off</option>
                  <option value="P">P - Present (Regularise)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Reason / Justification</label>
                <textarea
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  required
                  rows={3}
                  placeholder="Provide details about official duty, tour, or emergency leave..."
                  className="w-full px-3 py-2 border rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="gov-btn-secondary py-1.5 px-4 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gov-btn-primary py-1.5 px-5 text-xs cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
