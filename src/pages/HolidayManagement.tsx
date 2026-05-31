import React from 'react';
import { DBHoliday } from '../types/database.types';
import { mockDB } from '../services/supabase';
import { 
  FileSpreadsheet, 
  PlusCircle, 
  CalendarDays, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const HolidayManagement: React.FC = () => {
  const [holidays, setHolidays] = React.useState<DBHoliday[]>([]);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Form State
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [type, setType] = React.useState<'Gazetted' | 'Restricted'>('Gazetted');
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    setHolidays(mockDB.getHolidays().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, [refreshTrigger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (!name || !date) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      mockDB.saveHoliday({ name, date, type });
      setName('');
      setDate('');
      setSuccess(`Holiday "${name}" successfully scheduled!`);
      setRefreshTrigger(t => t + 1);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduled Holidays Listing */}
        <div className="gov-card p-6 bg-white lg:col-span-2">
          <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
            <FileSpreadsheet size={16} className="text-gov-gold mr-2" />
            Calendar of Declared Office Holidays (2026)
          </h4>

          {holidays.length > 0 ? (
            <div className="space-y-3.5">
              {holidays.map(hol => (
                <div 
                  key={hol.id} 
                  className={`p-4 border rounded-xl flex items-center justify-between shadow-sm transition-all duration-150 ${
                    hol.type === 'Gazetted' 
                      ? 'border-indigo-150 bg-indigo-50/20' 
                      : 'border-slate-200 bg-white hover:border-slate-350'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                      hol.type === 'Gazetted' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-slate-150 border-slate-250 text-slate-700'
                    }`}>
                      <CalendarDays size={20} />
                    </div>
                    <div>
                      <h5 className="text-sm font-extrabold text-gov-navy">{hol.name}</h5>
                      <span className="text-xs text-slate-500 font-semibold mt-1 block">
                        {new Date(hol.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <span className={`inline-flex px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase ${
                    hol.type === 'Gazetted' 
                      ? 'bg-indigo-100 border-indigo-200 text-indigo-750' 
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}>
                    {hol.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Sparkles size={24} className="text-slate-350" />
              <p className="text-xs italic">No declared holidays found in database ledger.</p>
            </div>
          )}
        </div>

        {/* Schedule Holiday Form */}
        <div className="gov-card p-6 bg-white h-fit">
          <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
            <PlusCircle size={16} className="text-gov-gold mr-2" />
            Declare Public Holiday
          </h4>

          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center space-x-2">
              <Sparkles size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Holiday Name / Description *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Republic Day"
                className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Holiday Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Holiday Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
              >
                <option value="Gazetted">Gazetted (Mandatory Office Closure)</option>
                <option value="Restricted">Restricted (RH - Optional Leave)</option>
              </select>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-relaxed flex items-start space-x-1.5">
              <AlertCircle size={14} className="text-gov-gold-dark mt-0.5 flex-shrink-0" />
              <span>
                <strong>System Notice:</strong> Declaring a public holiday will automatically map that date to code <code>H</code> on the attendance calendar of all active employees.
              </span>
            </div>

            <button
              type="submit"
              className="gov-btn-primary w-full flex items-center justify-center text-xs py-2.5 shadow-sm cursor-pointer"
            >
              Confirm Declaration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
