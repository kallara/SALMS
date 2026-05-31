import React from 'react';
import { 
  User, 
  Mail, 
  Hash, 
  Calendar, 
  Briefcase, 
  Award,
  Users,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Employee } from '../types/database.types';

interface ProfileProps {
  user: Employee;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [profileUser] = React.useState<Employee>(user);
  const [activeTab, setActiveTab] = React.useState<'personal' | 'professional' | 'hierarchy'>('personal');

  return (
    <div className="space-y-6">
      {/* Profile Header Folder */}
      <div className="gov-card p-6 md:p-8 bg-white border-b-4 border-gov-gold relative overflow-hidden flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Profile Emblem Avatar */}
        <div className="w-24 h-24 rounded-full bg-gov-navy border-4 border-gov-gold shadow-md flex items-center justify-center font-display font-black text-3xl text-gov-gold-light uppercase flex-shrink-0">
          {profileUser.full_name.substring(0, 2)}
        </div>
        
        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-1.5 md:space-y-0">
            <h2 className="text-2xl font-display font-black text-gov-navy">
              {profileUser.full_name}
            </h2>
            <span className="inline-flex self-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gov-gold/15 border border-gov-gold/30 text-gov-gold-dark">
              Active Service
            </span>
          </div>

          <p className="text-sm font-medium text-slate-500 flex items-center justify-center md:justify-start">
            <Hash size={14} className="mr-1 text-slate-400" />
            Employee ID: <strong className="ml-1 text-slate-700">{profileUser.employee_number}</strong>
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 pt-4 justify-center md:justify-start border-t border-slate-100 mt-4">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'professional'
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Professional Details
            </button>
            <button
              onClick={() => setActiveTab('hierarchy')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'hierarchy'
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Reporting & Charges
            </button>
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="gov-card p-6 md:p-8 bg-white min-h-[300px]">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h3 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 flex items-center">
              <User size={16} className="text-gov-gold mr-2" />
              Personal Records
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Legal Name</label>
                <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700">
                  {profileUser.full_name}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Official Email Address</label>
                <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700 flex items-center">
                  <Mail size={14} className="mr-2 text-slate-400" />
                  {profileUser.email}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Date of Birth</label>
                <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700 flex items-center">
                  <Calendar size={14} className="mr-2 text-slate-400" />
                  {profileUser.date_of_birth 
                    ? new Date(profileUser.date_of_birth).toLocaleDateString('en-US', { dateStyle: 'medium' })
                    : 'Not Entered'}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Government Username</label>
                <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700">
                  {profileUser.username}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="space-y-6">
            <h3 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 flex items-center">
              <Briefcase size={16} className="text-gov-gold mr-2" />
              Service & Professional Allocations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Employment Category</label>
                <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm font-bold text-gov-navy flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gov-gold mr-2.5"></span>
                  {profileUser.employment_category?.name || 'Permanent'}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Functional Designation / Role</label>
                <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700">
                  {profileUser.functional_role?.name || 'Administration'}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Security Authorization Role</label>
                <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700 flex items-center">
                  <ShieldCheck size={14} className="mr-2 text-gov-gold" />
                  <span className="capitalize">{profileUser.role.replace('_', ' ')}</span>
                </div>
              </div>

              {profileUser.employment_category?.name === 'Daily Wage' && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Daily Wage Rate (INR)</label>
                  <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-amber-50 text-sm font-black text-amber-800 flex items-center">
                    ₹ {profileUser.daily_wage_rate} / Present Day
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <div className="space-y-8">
            {/* Multiple Reporting Officers Section */}
            <div className="space-y-4">
              <h3 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 flex items-center">
                <Users size={16} className="text-gov-gold mr-2" />
                Assigned Reporting Hierarchy
              </h3>
              
              {profileUser.reporting_officers && profileUser.reporting_officers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileUser.reporting_officers.map(officer => (
                    <div key={officer.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center space-x-3.5 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-gov-navy flex items-center justify-center font-bold text-sm text-gov-gold-light uppercase flex-shrink-0 border border-gov-gold/30">
                        {officer.full_name.substring(0, 2)}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-extrabold text-gov-navy truncate">{officer.full_name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{officer.role.replace('_', ' ')}</p>
                        <p className="text-[10px] text-slate-500 font-semibold truncate flex items-center mt-1">
                          <Mail size={10} className="mr-1 text-slate-400 flex-shrink-0" />
                          {officer.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center border border-slate-150">
                  No Reporting Officers assigned to your profile. (Highest hierarchy).
                </p>
              )}
            </div>

            {/* Multiple Additional Charges Section */}
            <div className="space-y-4">
              <h3 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 flex items-center">
                <Building size={16} className="text-gov-gold mr-2" />
                Additional Portfolio & charges Held
              </h3>
              
              {profileUser.additional_charges && profileUser.additional_charges.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {profileUser.additional_charges.map((charge, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:border-gov-gold/30 text-gov-navy text-xs rounded-xl shadow-sm font-bold flex items-center space-x-2 transition-all duration-200 hover:shadow-md"
                    >
                      <Award size={14} className="text-gov-gold-dark flex-shrink-0" />
                      <span>{charge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center border border-slate-150">
                  No additional department charges or dual-office mandates assigned.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
