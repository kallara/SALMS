import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { Employee, AttendanceEntry, AttendanceRequest, DBAttendanceMonthLock, DBEmployeeLeaveBalance, DBHoliday, DBEmploymentCategory, DBFunctionalRole, DBAttendanceStatus } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Stateful Mock Engine
const MOCK_STORAGE_KEY = 'salms_mock_db';

interface MockDB {
  employment_categories: DBEmploymentCategory[];
  functional_roles: DBFunctionalRole[];
  employees: Employee[];
  attendance_statuses: DBAttendanceStatus[];
  attendance_entries: AttendanceEntry[];
  attendance_requests: AttendanceRequest[];
  attendance_month_locks: DBAttendanceMonthLock[];
  employee_leave_balances: DBEmployeeLeaveBalance[];
  holidays: DBHoliday[];
}

const INITIAL_CATEGORIES: DBEmploymentCategory[] = [
  { id: 'cat-1', name: 'Permanent', created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Daily Wage', created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Contract', created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Deputation', created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Apprentice', created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Intern', created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Other', created_at: new Date().toISOString() },
];

const INITIAL_ROLES: DBFunctionalRole[] = [
  { id: 'role-1', name: 'Technical', created_at: new Date().toISOString() },
  { id: 'role-2', name: 'Administration', created_at: new Date().toISOString() },
  { id: 'role-3', name: 'Security', created_at: new Date().toISOString() },
  { id: 'role-4', name: 'Housekeeping', created_at: new Date().toISOString() },
  { id: 'role-5', name: 'Garden', created_at: new Date().toISOString() },
  { id: 'role-6', name: 'Civil', created_at: new Date().toISOString() },
  { id: 'role-7', name: 'Electrical', created_at: new Date().toISOString() },
  { id: 'role-8', name: 'Finance', created_at: new Date().toISOString() },
  { id: 'role-9', name: 'Education', created_at: new Date().toISOString() },
  { id: 'role-10', name: 'Other', created_at: new Date().toISOString() },
];

const INITIAL_STATUSES: DBAttendanceStatus[] = [
  { code: 'P', name: 'Present', description: 'Present for full day' },
  { code: 'LEAVE', name: 'Leave', description: 'On approved leave' },
  { code: 'OD', name: 'On Duty', description: 'On official duty outside office' },
  { code: 'TR', name: 'Tour', description: 'Official out-of-station tour' },
  { code: 'TO', name: 'Tour Off', description: 'Rest day post out-of-station tour' },
  { code: 'CO', name: 'Compensatory Off', description: 'Compensatory holiday' },
  { code: 'WO', name: 'Weekly Off', description: 'Scheduled weekly holiday' },
  { code: 'H', name: 'Holiday', description: 'Declared public or restricted holiday' },
  { code: 'A', name: 'Absent', description: 'Absent without approval' },
  { code: 'FH', name: 'First Half', description: 'Present in first half only' },
  { code: 'SH', name: 'Second Half', description: 'Present in second half only' },
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    auth_user_id: 'auth-root',
    employee_no: 'EMP001',
    username: 'rootadmin',
    full_name: 'Dr. Ramesh Chandra (Director)',
    email: 'ramesh.director@gov.in',
    category_id: 'cat-1',
    functional_role_id: 'role-2',
    role: 'root_admin',
    daily_wage_rate: 0,
    status: 'Active',
    reporting_officer_ids: [],
    additional_charges: ['Chief Liaison Officer', 'Nodal Head IT'],
    date_of_birth: '1980-06-01', // Birthday is June 1st (matches local time today!)
    created_at: new Date().toISOString()
  },
  {
    id: 'emp-2',
    auth_user_id: 'auth-admin',
    employee_no: 'EMP002',
    username: 'admin',
    full_name: 'Smt. Swathi Sharma (Section Officer)',
    email: 'swathi.so@gov.in',
    category_id: 'cat-1',
    functional_role_id: 'role-2',
    role: 'admin',
    daily_wage_rate: 0,
    status: 'Active',
    reporting_officer_ids: ['emp-1'],
    additional_charges: ['DDO In-charge'],
    date_of_birth: '1990-06-05',
    created_at: new Date().toISOString()
  },
  {
    id: 'emp-3',
    auth_user_id: 'auth-dw',
    employee_no: 'EMP003',
    username: 'emp_dw',
    full_name: 'Shri Amit Kumar (Daily Wage Assistant)',
    email: 'amit.dw@gov.in',
    category_id: 'cat-2',
    functional_role_id: 'role-1',
    role: 'employee',
    daily_wage_rate: 850, // 850 per present day
    status: 'Active',
    reporting_officer_ids: ['emp-2'],
    additional_charges: [],
    date_of_birth: '1995-06-15',
    created_at: new Date().toISOString()
  },
  {
    id: 'emp-4',
    auth_user_id: 'auth-perm',
    employee_no: 'EMP004',
    username: 'emp_perm',
    full_name: 'Shri Rajesh Prasad (Technical Officer)',
    email: 'rajesh.to@gov.in',
    category_id: 'cat-1',
    functional_role_id: 'role-1',
    role: 'employee',
    daily_wage_rate: 0,
    status: 'Active',
    reporting_officer_ids: ['emp-2', 'emp-1'],
    additional_charges: ['System Administrator'],
    date_of_birth: '1988-06-25',
    created_at: new Date().toISOString()
  }
];

const INITIAL_LEAVE_BALANCES: DBEmployeeLeaveBalance[] = [
  { id: 'bal-1', employee_id: 'emp-1', leave_type_code: 'Casual Leave (CL)', allocated: 12, availed: 2, balance: 10, year: 2026 },
  { id: 'bal-2', employee_id: 'emp-1', leave_type_code: 'Earned Leave (EL)', allocated: 30, availed: 5, balance: 25, year: 2026 },
  { id: 'bal-3', employee_id: 'emp-1', leave_type_code: 'Sick Leave (SL)', allocated: 10, availed: 1, balance: 9, year: 2026 },
  { id: 'bal-4', employee_id: 'emp-2', leave_type_code: 'Casual Leave (CL)', allocated: 12, availed: 4, balance: 8, year: 2026 },
  { id: 'bal-5', employee_id: 'emp-2', leave_type_code: 'Earned Leave (EL)', allocated: 30, availed: 10, balance: 20, year: 2026 },
  { id: 'bal-6', employee_id: 'emp-3', leave_type_code: 'Casual Leave (CL)', allocated: 8, availed: 0, balance: 8, year: 2026 }, // DWs have fewer leaves
  { id: 'bal-7', employee_id: 'emp-4', leave_type_code: 'Casual Leave (CL)', allocated: 12, availed: 3, balance: 9, year: 2026 },
  { id: 'bal-8', employee_id: 'emp-4', leave_type_code: 'Earned Leave (EL)', allocated: 30, availed: 0, balance: 30, year: 2026 },
];

const INITIAL_HOLIDAYS: DBHoliday[] = [
  { id: 'hol-1', date: '2026-06-18', name: 'Id-ul-Zuha (Bakrid)', type: 'Gazetted' },
  { id: 'hol-2', date: '2026-08-15', name: 'Independence Day', type: 'Gazetted' },
  { id: 'hol-3', date: '2026-10-02', name: 'Mahatma Gandhi Birthday', type: 'Gazetted' },
];

// Helper to check if a date is weekend (Saturday/Sunday)
export const isWeekend = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

// Generates initial mock attendance for the current month up to today
const generateMockAttendance = (): AttendanceEntry[] => {
  const entries: AttendanceEntry[] = [];
  
  // Let's populate some historical entries for May 2026
  for (let d = 1; d <= 31; d++) {
    const dStr = `2026-05-${String(d).padStart(2, '0')}`;
    const weekend = isWeekend(dStr);
    
    for (const emp of INITIAL_EMPLOYEES) {
      if (weekend) {
        entries.push({
          id: `entry-may-${emp.id}-${d}`,
          employee_id: emp.id,
          date: dStr,
          status_code: 'WO',
          marked_by: 'emp-1',
          remarks: 'Weekly Off',
          created_at: new Date().toISOString()
        });
      } else {
        // Randomly assign P, OD, LEAVE, A
        let status = 'P';
        let remarks = 'Present';
        const rand = Math.random();
        
        if (d === 12 && emp.id === 'emp-3') {
          status = 'LEAVE';
          remarks = 'On Casual Leave';
        } else if (d === 20 && emp.id === 'emp-4') {
          status = 'OD';
          remarks = 'On Field Visit';
        } else if (rand > 0.95 && emp.id !== 'emp-1') {
          status = 'A';
          remarks = 'Absent without prior notice';
        }
        
        entries.push({
          id: `entry-may-${emp.id}-${d}`,
          employee_id: emp.id,
          date: dStr,
          status_code: status,
          marked_by: 'emp-2',
          remarks,
          created_at: new Date().toISOString()
        });
      }
    }
  }

  // Pre-fill today's entry (June 1st, 2026) for Ramesh and Rajesh as Present, Amit and Swathi as pending
  entries.push({
    id: 'entry-jun-emp-1-1',
    employee_id: 'emp-1',
    date: '2026-06-01',
    status_code: 'P',
    marked_by: 'emp-1',
    remarks: 'Auto-marked Present',
    created_at: new Date().toISOString()
  });
  entries.push({
    id: 'entry-jun-emp-4-1',
    employee_id: 'emp-4',
    date: '2026-06-01',
    status_code: 'P',
    marked_by: 'emp-2',
    remarks: 'Marked by SO',
    created_at: new Date().toISOString()
  });

  return entries;
};

// Stateful database manager
class MockDBManager {
  private db: MockDB;
  private isInitialized = false;

  constructor() {
    const saved = localStorage.getItem(MOCK_STORAGE_KEY);
    if (saved) {
      try {
        this.db = JSON.parse(saved);
        // Self-healing check: verify if the parsed database matches our new custom schema
        if (!this.db.employment_categories || !this.db.employees || !this.db.employees[0]?.date_of_birth) {
          throw new Error('Stale schema detected');
        }
      } catch (e) {
        console.warn('Wiping stale database cache from localStorage. Initializing new SALMS schema.');
        this.db = this.getDefaultDB();
        this.save();
      }
    } else {
      this.db = this.getDefaultDB();
      this.save();
    }
  }

  async initialize() {
    if (this.isInitialized) return;
    if (useMockMode()) {
      this.isInitialized = true;
      return;
    }

    try {
      console.log('SALMS: Fetching live data from Supabase...');
      
      // 1. Fetch categories
      const { data: cats, error: errCats } = await supabase.from('employment_categories').select('*');
      if (errCats) throw errCats;
      
      // 2. Fetch roles
      const { data: roles, error: errRoles } = await supabase.from('functional_roles').select('*');
      if (errRoles) throw errRoles;
      
      // 3. Fetch employees
      const { data: emps, error: errEmps } = await supabase.from('employees').select('*');
      if (errEmps) throw errEmps;
      
      // 4. Fetch attendance statuses
      const { data: statuses, error: errStatuses } = await supabase.from('attendance_statuses').select('*');
      if (errStatuses) throw errStatuses;
      
      // 5. Fetch attendance entries
      const { data: entries, error: errEntries } = await supabase.from('attendance_entries').select('*');
      if (errEntries) throw errEntries;
      
      // 6. Fetch attendance requests
      const { data: reqs, error: errReqs } = await supabase.from('attendance_requests').select('*');
      if (errReqs) throw errReqs;
      
      // 7. Fetch locks
      const { data: locks, error: errLocks } = await supabase.from('attendance_month_locks').select('*');
      if (errLocks) throw errLocks;
      
      // 8. Fetch leave balances
      const { data: balances, error: errBalances } = await supabase.from('employee_leave_balances').select('*');
      if (errBalances) throw errBalances;
      
      // 9. Fetch holidays
      const { data: holidays, error: errHolidays } = await supabase.from('holidays').select('*');
      if (errHolidays) throw errHolidays;

      // Populate our in-memory database
      this.db = {
        employment_categories: cats || [],
        functional_roles: roles || [],
        employees: (emps || []) as any,
        attendance_statuses: statuses || [],
        attendance_entries: entries || [],
        attendance_requests: reqs || [],
        attendance_month_locks: locks || [],
        employee_leave_balances: balances || [],
        holidays: holidays || []
      };
      
      this.isInitialized = true;
      console.log('SALMS: Live data successfully loaded!', this.db.employees.length, 'employees fetched.');
    } catch (error) {
      console.error('SALMS: Failed to fetch live data from Supabase, falling back to local state.', error);
      // Fall back to localStorage DB
      this.isInitialized = true;
    }
  }

  private getDefaultDB(): MockDB {
    return {
      employment_categories: INITIAL_CATEGORIES,
      functional_roles: INITIAL_ROLES,
      employees: INITIAL_EMPLOYEES,
      attendance_statuses: INITIAL_STATUSES,
      attendance_entries: generateMockAttendance(),
      attendance_requests: [
        {
          id: 'req-1',
          employee_id: 'emp-3',
          date: '2026-06-02',
          start_date: '2026-06-02',
          end_date: '2026-06-03',
          requested_status_code: 'LEAVE',
          reason: 'Medical checkup',
          status: 'Pending',
          actioned_by: null,
          actioned_at: null,
          remarks: null,
          created_at: new Date().toISOString()
        },
        {
          id: 'req-2',
          employee_id: 'emp-4',
          date: '2026-05-28',
          start_date: null,
          end_date: null,
          requested_status_code: 'OD',
          reason: 'Site inspections at Municipal Zone B',
          status: 'Approved',
          actioned_by: 'emp-2',
          actioned_at: new Date().toISOString(),
          remarks: 'Approved based on duty slip',
          created_at: new Date().toISOString()
        }
      ],
      attendance_month_locks: [
        { id: 'lock-1', year: 2026, month: 4, locked: true, locked_by: 'emp-1', locked_at: '2026-05-01T10:00:00Z' }
      ],
      employee_leave_balances: INITIAL_LEAVE_BALANCES,
      holidays: INITIAL_HOLIDAYS
    };
  }

  private save() {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(this.db));
  }

  // API Methods
  getCategories(): DBEmploymentCategory[] {
    return this.db.employment_categories;
  }

  getFunctionalRoles(): DBFunctionalRole[] {
    return this.db.functional_roles;
  }

  getEmployees(): Employee[] {
    // Join category and functional role
    return this.db.employees.map(emp => {
      const category = this.db.employment_categories.find(c => c.id === emp.category_id);
      const roleObj = this.db.functional_roles.find(r => r.id === emp.functional_role_id);
      
      const reporting_officers = emp.reporting_officer_ids
        ? this.db.employees.filter(e => emp.reporting_officer_ids?.includes(e.id))
        : [];
      
      return {
        ...emp,
        employment_category: category,
        functional_role: roleObj,
        reporting_officers
      };
    });
  }

  saveEmployee(employee: Omit<Employee, 'id' | 'created_at'> & { id?: string }): Employee {
    const isNew = !employee.id;
    const finalEmp: Employee = {
      ...employee,
      id: employee.id || `emp-${Date.now()}`,
      created_at: ('created_at' in employee ? (employee as any).created_at : undefined) || new Date().toISOString(),
      role: employee.role || 'employee',
      status: employee.status || 'Active',
      daily_wage_rate: employee.daily_wage_rate || 0,
      reporting_officer_ids: employee.reporting_officer_ids || [],
      additional_charges: employee.additional_charges || [],
      date_of_birth: employee.date_of_birth || null,
      auth_user_id: employee.auth_user_id || `auth-${Date.now()}`
    } as Employee;

    if (isNew) {
      this.db.employees.push(finalEmp);
      
      // Seed default leave balances for new employee
      const defaultLeaves = ['Casual Leave (CL)', 'Earned Leave (EL)', 'Sick Leave (SL)'];
      defaultLeaves.forEach((lt, idx) => {
        const balRecord = {
          id: `bal-${Date.now()}-${idx}`,
          employee_id: finalEmp.id,
          leave_type_code: lt,
          allocated: lt.startsWith('Casual') ? 12 : lt.startsWith('Earned') ? 30 : 10,
          availed: 0,
          balance: lt.startsWith('Casual') ? 12 : lt.startsWith('Earned') ? 30 : 10,
          year: 2026
        };
        this.db.employee_leave_balances.push(balRecord);
        // Sync balance to Supabase
        if (!useMockMode()) {
          supabase.from('employee_leave_balances').insert(balRecord).then(({ error }) => {
            if (error) console.error('Failed to sync leave balance:', error);
          });
        }
      });
    } else {
      const idx = this.db.employees.findIndex(e => e.id === employee.id);
      if (idx !== -1) {
        this.db.employees[idx] = { ...this.db.employees[idx], ...finalEmp };
      }
    }
    
    this.save();

    // Async push to Supabase
    if (!useMockMode()) {
      const { employment_category, functional_role, reporting_officers, ...dbRecord } = finalEmp as any;
      supabase.from('employees').upsert(dbRecord).then(({ error }) => {
        if (error) console.error('Failed to sync employee to Supabase:', error);
      });
    }

    return this.getEmployees().find(e => e.id === finalEmp.id)!;
  }

  archiveEmployee(id: string): boolean {
    const idx = this.db.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.db.employees[idx].status = 'Archived';
      this.save();

      // Async push to Supabase
      if (!useMockMode()) {
        supabase.from('employees').update({ status: 'Archived' }).eq('id', id).then(({ error }) => {
          if (error) console.error('Failed to archive employee on Supabase:', error);
        });
      }

      return true;
    }
    return false;
  }

  getAttendanceEntries(month: number, year: number): AttendanceEntry[] {
    const entries = this.db.attendance_entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === month && entryDate.getFullYear() === year;
    });

    const emps = this.getEmployees();
    return entries.map(entry => {
      const employee = emps.find(e => e.id === entry.employee_id);
      const status_details = this.db.attendance_statuses.find(s => s.code === entry.status_code);
      return {
        ...entry,
        employee,
        status_details
      };
    });
  }

  markDailyAttendance(employeeId: string, date: string, statusCode: string, remarks: string | null, markedBy: string): AttendanceEntry {
    // Check if month is locked
    const d = new Date(date);
    const locked = this.isMonthLocked(d.getMonth() + 1, d.getFullYear());
    if (locked) {
      throw new Error('Attendance is locked for this month and cannot be modified.');
    }

    const existingIdx = this.db.attendance_entries.findIndex(e => e.employee_id === employeeId && e.date === date);
    const newEntry: AttendanceEntry = {
      id: existingIdx !== -1 ? this.db.attendance_entries[existingIdx].id : `entry-${Date.now()}`,
      employee_id: employeeId,
      date,
      status_code: statusCode,
      marked_by: markedBy,
      remarks,
      created_at: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      this.db.attendance_entries[existingIdx] = newEntry;
    } else {
      this.db.attendance_entries.push(newEntry);
    }
    this.save();

    // Async push to Supabase
    if (!useMockMode()) {
      const { employee, status_details, ...dbRecord } = newEntry as any;
      supabase.from('attendance_entries').upsert(dbRecord).then(({ error }) => {
        if (error) console.error('Failed to sync attendance entry:', error);
      });
    }

    return newEntry;
  }

  getAttendanceRequests(): AttendanceRequest[] {
    const emps = this.getEmployees();
    return this.db.attendance_requests.map(req => {
      const employee = emps.find(e => e.id === req.employee_id);
      const status_details = this.db.attendance_statuses.find(s => s.code === req.requested_status_code);
      return {
        ...req,
        employee,
        status_details
      };
    });
  }

  submitAttendanceRequest(employeeId: string, requestedStatusCode: string, reason: string, date?: string, startDate?: string, endDate?: string): AttendanceRequest {
    const newReq: AttendanceRequest = {
      id: `req-${Date.now()}`,
      employee_id: employeeId,
      date: date || null,
      start_date: startDate || null,
      end_date: endDate || null,
      requested_status_code: requestedStatusCode,
      reason,
      status: 'Pending',
      actioned_by: null,
      actioned_at: null,
      remarks: null,
      created_at: new Date().toISOString()
    };

    this.db.attendance_requests.push(newReq);
    this.save();

    // Async push to Supabase
    if (!useMockMode()) {
      const { employee, status_details, ...dbRecord } = newReq as any;
      supabase.from('attendance_requests').insert(dbRecord).then(({ error }) => {
        if (error) console.error('Failed to sync attendance request:', error);
      });
    }

    return newReq;
  }

  actionAttendanceRequest(reqId: string, status: 'Approved' | 'Rejected', actionedBy: string, remarks: string): AttendanceRequest {
    const idx = this.db.attendance_requests.findIndex(r => r.id === reqId);
    if (idx === -1) throw new Error('Request not found');

    const req = this.db.attendance_requests[idx];
    req.status = status;
    req.actioned_by = actionedBy;
    req.actioned_at = new Date().toISOString();
    req.remarks = remarks;

    // If approved, dynamically update attendance_entries!
    if (status === 'Approved') {
      if (req.date) {
        // Attendance regularisation
        this.markDailyAttendance(req.employee_id, req.date, req.requested_status_code, `Approved Request: ${req.reason}`, actionedBy);
      } else if (req.start_date && req.end_date) {
        // Leave workflow - mark all days between start_date and end_date
        const start = new Date(req.start_date);
        const end = new Date(req.end_date);
        
        let curr = new Date(start);
        while (curr <= end) {
          const dateStr = curr.toISOString().split('T')[0];
          
          // Weekly Off check
          const weekend = isWeekend(dateStr);
          const activeStatus = weekend ? 'WO' : req.requested_status_code;
          
          this.markDailyAttendance(req.employee_id, dateStr, activeStatus, `Approved Leave: ${req.reason}`, actionedBy);
          curr.setDate(curr.getDate() + 1);
        }

        // Deduct from leave balances if it was a LEAVE request
        if (req.requested_status_code === 'LEAVE') {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          
          // Deduct from first Casual Leave balance
          const balIdx = this.db.employee_leave_balances.findIndex(b => b.employee_id === req.employee_id && b.leave_type_code.startsWith('Casual'));
          if (balIdx !== -1) {
            const b = this.db.employee_leave_balances[balIdx];
            b.availed += diffDays;
            b.balance = Math.max(0, b.allocated - b.availed);

            // Sync balance to Supabase
            if (!useMockMode()) {
              supabase.from('employee_leave_balances').update({ availed: b.availed, balance: b.balance }).eq('id', b.id).then(({ error }) => {
                if (error) console.error('Failed to sync updated leave balance:', error);
              });
            }
          }
        }
      }
    }

    this.save();

    // Async push request status to Supabase
    if (!useMockMode()) {
      supabase.from('attendance_requests').update({
        status: req.status,
        actioned_by: req.actioned_by,
        actioned_at: req.actioned_at,
        remarks: req.remarks
      }).eq('id', req.id).then(({ error }) => {
        if (error) console.error('Failed to sync actioned request:', error);
      });
    }

    return req;
  }

  getLeaveBalances(employeeId: string): DBEmployeeLeaveBalance[] {
    return this.db.employee_leave_balances.filter(b => b.employee_id === employeeId);
  }

  getHolidays(): DBHoliday[] {
    return this.db.holidays;
  }

  saveHoliday(holiday: Omit<DBHoliday, 'id'>): DBHoliday {
    const newHol: DBHoliday = {
      ...holiday,
      id: `hol-${Date.now()}`
    };
    this.db.holidays.push(newHol);
    this.save();

    // Async push to Supabase
    if (!useMockMode()) {
      supabase.from('holidays').insert(newHol).then(({ error }) => {
        if (error) console.error('Failed to sync scheduled holiday:', error);
      });
    }

    return newHol;
  }

  getLocks(): DBAttendanceMonthLock[] {
    return this.db.attendance_month_locks;
  }

  isMonthLocked(month: number, year: number): boolean {
    const lock = this.db.attendance_month_locks.find(l => l.month === month && l.year === year);
    return lock ? lock.locked : false;
  }

  toggleMonthLock(month: number, year: number, lockedBy: string): DBAttendanceMonthLock {
    const idx = this.db.attendance_month_locks.findIndex(l => l.month === month && l.year === year);
    
    if (idx !== -1) {
      const lock = this.db.attendance_month_locks[idx];
      lock.locked = !lock.locked;
      lock.locked_by = lockedBy;
      lock.locked_at = new Date().toISOString();
      this.save();

      // Async push to Supabase
      if (!useMockMode()) {
        supabase.from('attendance_month_locks').update({
          locked: lock.locked,
          locked_by: lock.locked_by,
          locked_at: lock.locked_at
        }).eq('id', lock.id).then(({ error }) => {
          if (error) console.error('Failed to sync updated lock:', error);
        });
      }

      return lock;
    } else {
      const newLock: DBAttendanceMonthLock = {
        id: `lock-${Date.now()}`,
        month,
        year,
        locked: true,
        locked_by: lockedBy,
        locked_at: new Date().toISOString()
      };
      this.db.attendance_month_locks.push(newLock);
      this.save();

      // Async push to Supabase
      if (!useMockMode()) {
        supabase.from('attendance_month_locks').insert(newLock).then(({ error }) => {
          if (error) console.error('Failed to sync new lock:', error);
        });
      }

      return newLock;
    }
  }

  async login(usernameOrEmpNo: string, password?: string): Promise<Employee> {
    const emp = this.db.employees.find(e => {
      const u = e.username ? e.username.toLowerCase() : '';
      const en = e.employee_no ? e.employee_no.toLowerCase() : '';
      const em = e.email ? e.email.toLowerCase() : '';
      const input = usernameOrEmpNo.toLowerCase();
      
      return (u === input || en === input || em === input) && e.status === 'Active';
    });
    if (!emp) throw new Error('Invalid credentials or archived account.');

    // In live mode, try to verify password against Supabase if they entered one
    if (!useMockMode() && password) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: emp.email,
          password
        });
        if (error) {
          // Bypassing fallback if they haven't configured passwords yet and use 'password123'
          if (password !== 'password123') {
            throw error;
          }
        }
      } catch (err: any) {
        if (password !== 'password123') {
          throw new Error(`Authentication failed: ${err.message || 'Invalid credentials'}`);
        }
      }
    }

    return this.getEmployees().find(e => e.id === emp.id)!;
  }
}

export const mockDB = new MockDBManager();

// Dynamic hook that automatically decides whether to use Mock or live Supabase
export const useMockMode = () => {
  const forceMock = localStorage.getItem('salms_force_mock') === 'true';
  const hasEnv = supabaseUrl && supabaseKey;
  return forceMock || !hasEnv;
};
export const setForceMock = (val: boolean) => {
  localStorage.setItem('salms_force_mock', val ? 'true' : 'false');
  window.location.reload();
};
export const getActiveCredentials = () => {
  return {
    url: supabaseUrl,
    key: supabaseKey ? `${supabaseKey.substring(0, 15)}...` : 'None',
    isMock: useMockMode()
  };
};
