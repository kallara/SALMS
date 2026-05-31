import React from 'react';
import { Employee, DBEmploymentCategory, DBFunctionalRole } from '../types/database.types';
import { mockDB } from '../services/supabase';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Archive,
  UserCheck,
  Building,
  Shield,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [categories, setCategories] = React.useState<DBEmploymentCategory[]>([]);
  const [roles, setRoles] = React.useState<DBFunctionalRole[]>([]);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingEmp, setEditingEmp] = React.useState<Employee | null>(null);

  // Form Fields State
  const [fullName, setFullName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [empNo, setEmpNo] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [roleSelection, setRoleSelection] = React.useState<'root_admin' | 'admin' | 'employee'>('employee');
  const [catId, setCatId] = React.useState('');
  const [roleId, setRoleId] = React.useState('');
  const [wageRate, setWageRate] = React.useState(0);
  const [selectedOfficerIds, setSelectedOfficerIds] = React.useState<string[]>([]);
  const [additionalCharges, setAdditionalCharges] = React.useState<string[]>([]);
  const [chargeInput, setChargeInput] = React.useState('');

  React.useEffect(() => {
    setEmployees(mockDB.getEmployees());
    const cats = mockDB.getCategories();
    setCategories(cats);
    if (cats.length > 0) setCatId(cats[0].id);

    const rls = mockDB.getFunctionalRoles();
    setRoles(rls);
    if (rls.length > 0) setRoleId(rls[0].id);
  }, [refreshTrigger]);

  const handleEditClick = (emp: Employee) => {
    setEditingEmp(emp);
    setFullName(emp.full_name);
    setUsername(emp.username);
    setEmail(emp.email);
    setEmpNo(emp.employee_number);
    setDob(emp.date_of_birth || '');
    setRoleSelection(emp.role);
    setCatId(emp.category_id);
    setRoleId(emp.functional_role_id);
    setWageRate(emp.daily_wage_rate);
    setSelectedOfficerIds(emp.reporting_officer_ids || []);
    setAdditionalCharges(emp.additional_charges || []);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingEmp(null);
    setFullName('');
    setUsername('');
    setEmail('');
    setEmpNo('');
    setDob('');
    setRoleSelection('employee');
    if (categories.length > 0) setCatId(categories[0].id);
    if (roles.length > 0) setRoleId(roles[0].id);
    setWageRate(0);
    setSelectedOfficerIds([]);
    setAdditionalCharges([]);
    setModalOpen(true);
  };

  const handleArchive = (id: string, name: string) => {
    if (confirm(`Are you sure you want to ARCHIVE employee "${name}"? Following standard rules, employees cannot be deleted, but archiving will suspend their active portal access.`)) {
      mockDB.archiveEmployee(id);
      setRefreshTrigger(t => t + 1);
    }
  };

  const handleAddCharge = () => {
    if (chargeInput.trim() && !additionalCharges.includes(chargeInput.trim())) {
      setAdditionalCharges([...additionalCharges, chargeInput.trim()]);
      setChargeInput('');
    }
  };

  const handleRemoveCharge = (c: string) => {
    setAdditionalCharges(additionalCharges.filter(charge => charge !== c));
  };

  const handleToggleOfficer = (oId: string) => {
    if (selectedOfficerIds.includes(oId)) {
      setSelectedOfficerIds(selectedOfficerIds.filter(id => id !== oId));
    } else {
      setSelectedOfficerIds([...selectedOfficerIds, oId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !username || !email || !empNo) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      mockDB.saveEmployee({
        id: editingEmp?.id,
        auth_user_id: editingEmp?.auth_user_id || null,
        full_name: fullName,
        username,
        email,
        employee_number: empNo,
        date_of_birth: dob || null,
        role: roleSelection,
        category_id: catId,
        functional_role_id: roleId,
        daily_wage_rate: wageRate,
        reporting_officer_ids: selectedOfficerIds,
        additional_charges: additionalCharges,
        status: editingEmp?.status || 'Active'
      });

      setModalOpen(false);
      setRefreshTrigger(t => t + 1);
      alert(`Employee profile successfully ${editingEmp ? 'updated' : 'created'}!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(search.toLowerCase()) || 
                          emp.employee_number.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? emp.category_id === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const selectedCategoryName = categories.find(c => c.id === catId)?.name || '';

  return (
    <div className="space-y-6">
      {/* Search and Action Header */}
      <div className="gov-card p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between space-y-3.5 md:space-y-0 md:space-x-4 bg-white">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by legal name or Employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddClick}
          className="gov-btn-gold text-xs py-2 px-5 flex items-center justify-center space-x-1.5 cursor-pointer flex-shrink-0"
        >
          <UserPlus size={15} />
          <span>Induct New Employee</span>
        </button>
      </div>

      {/* Employees Table Grid */}
      <div className="gov-card p-6 bg-white">
        <h4 className="font-display font-black text-sm text-gov-navy border-b border-slate-100 pb-3 mb-4 flex items-center">
          <Users size={16} className="text-gov-gold mr-2" />
          Active Service Register
        </h4>

        {filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pt-1">Employee Particulars</th>
                  <th className="pb-3 pt-1">Service category</th>
                  <th className="pb-3 pt-1">Designation / Role</th>
                  <th className="pb-3 pt-1">Reporting Officer(s)</th>
                  <th className="pb-3 pt-1">Additional charges</th>
                  <th className="pb-3 pt-1">Status</th>
                  <th className="pb-3 pt-1 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className={`hover:bg-slate-50/50 ${emp.status === 'Archived' ? 'opacity-50 bg-slate-50/20' : ''}`}>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-300">
                          {emp.full_name.substring(0, 2)}
                        </div>
                        <div>
                          <h5 className="text-xs font-extrabold text-gov-navy">{emp.full_name}</h5>
                          <span className="text-[10px] text-slate-400 block mt-0.5">ID: {emp.employee_number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="status-badge border py-0.5 px-2 font-semibold text-[10px] bg-slate-100 border-slate-200 text-slate-700 rounded-lg">
                        {emp.employment_category?.name || 'Permanent'}
                      </span>
                    </td>
                    <td className="py-4 text-slate-800 font-semibold">{emp.functional_role?.name}</td>
                    <td className="py-4 text-slate-500 font-medium">
                      {emp.reporting_officers && emp.reporting_officers.length > 0 ? (
                        <div className="space-y-0.5 max-w-[150px] truncate">
                          {emp.reporting_officers.map(o => o.full_name).join(', ')}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-4 text-[10px]">
                      {emp.additional_charges && emp.additional_charges.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {emp.additional_charges.map((c, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200">{c}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex space-x-1.5 justify-end">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="p-1.5 rounded bg-slate-100 text-gov-navy border border-slate-250 hover:bg-slate-200 cursor-pointer"
                          title="Edit profile"
                        >
                          <Edit size={12} />
                        </button>
                        {emp.status === 'Active' && (
                          <button
                            onClick={() => handleArchive(emp.id, emp.full_name)}
                            className="p-1.5 rounded bg-rose-50 text-rose-750 border border-rose-200 hover:bg-rose-100 cursor-pointer"
                            title="Archive employee only"
                          >
                            <Archive size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-12 text-center">
            No employees matching filters found.
          </p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gov-navy/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto my-8 animate-[scaleIn_0.2s_ease-out]">
            <h3 className="font-display font-black text-lg text-gov-navy mb-5 border-b pb-2.5 border-slate-100">
              {editingEmp ? 'Modify Employee Service Book' : 'Induct New Staff Member'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Shri Amit Sharma"
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. amit.sharma@gov.in"
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Employee ID Number *</label>
                  <input
                    type="text"
                    required
                    value={empNo}
                    onChange={(e) => setEmpNo(e.target.value)}
                    placeholder="e.g. EMP008"
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Government Portal Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. amitsharma"
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Portal Authorization Role</label>
                  <select
                    value={roleSelection}
                    onChange={(e) => setRoleSelection(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  >
                    <option value="employee">Employee (Standard Access)</option>
                    <option value="admin">Section Admin (Approvals / Mgmt)</option>
                    <option value="root_admin">Root Admin (Global Lock / System Controller)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Service Category (Dynamic) *</label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Functional Designation / Role (Dynamic) *</label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditionally render Daily Wage Rate config */}
              {selectedCategoryName === 'Daily Wage' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <label className="text-[11px] font-bold text-amber-800 block mb-1">Daily Wage Rate (INR) *</label>
                  <input
                    type="number"
                    required
                    value={wageRate}
                    onChange={(e) => setWageRate(Number(e.target.value))}
                    min={0}
                    placeholder="Enter rate per present day"
                    className="w-full max-w-xs px-3 py-2 border border-amber-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              )}

              {/* Multiple Reporting Officers Selector */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-[11px] font-bold text-slate-500 block">Assign Reporting Officers (Select Multiple)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                  {employees
                    .filter(e => e.id !== editingEmp?.id && e.role !== 'employee' && e.status === 'Active')
                    .map(officer => {
                      const isChecked = selectedOfficerIds.includes(officer.id);
                      return (
                        <label 
                          key={officer.id} 
                          className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer ${
                            isChecked ? 'bg-gov-gold/10 border-gov-gold/30 text-gov-navy-dark font-semibold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleOfficer(officer.id)}
                            className="rounded text-gov-gold focus:ring-gov-gold"
                          />
                          <span>{officer.full_name} ({officer.role.replace('_', ' ')})</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Multiple Additional Charges Tag Editor */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-[11px] font-bold text-slate-500 block">Assign Additional Charges / Portfolios</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Chief Vigilance Officer"
                    value={chargeInput}
                    onChange={(e) => setChargeInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCharge(); } }}
                    className="flex-grow px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddCharge}
                    className="gov-btn-secondary py-2 text-xs flex items-center justify-center px-4 cursor-pointer"
                  >
                    Add Charge
                  </button>
                </div>
                {additionalCharges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {additionalCharges.map(charge => (
                      <span 
                        key={charge} 
                        className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 rounded-lg space-x-1"
                      >
                        <span>{charge}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveCharge(charge)}
                          className="text-amber-500 hover:text-amber-700 font-extrabold focus:outline-none ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="gov-btn-secondary py-2 px-4 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gov-btn-gold py-2 px-6 text-xs cursor-pointer"
                >
                  Confirm Service Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
