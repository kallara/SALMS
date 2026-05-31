import { Database } from './supabase';

export type DBEmployee = Database['public']['Tables']['employees']['Row'];
export type DBAttendanceEntry = Database['public']['Tables']['attendance_entries']['Row'];
export type DBAttendanceRequest = Database['public']['Tables']['attendance_requests']['Row'];
export type DBAttendanceMonthLock = Database['public']['Tables']['attendance_month_locks']['Row'];
export type DBEmployeeLeaveBalance = Database['public']['Tables']['employee_leave_balances']['Row'];
export type DBHoliday = Database['public']['Tables']['holidays']['Row'];
export type DBEmploymentCategory = Database['public']['Tables']['employment_categories']['Row'];
export type DBFunctionalRole = Database['public']['Tables']['functional_roles']['Row'];
export type DBAttendanceStatus = Database['public']['Tables']['attendance_statuses']['Row'];

// UI-friendly Populated Interfaces
export interface Employee extends DBEmployee {
  employment_category?: DBEmploymentCategory;
  functional_role?: DBFunctionalRole;
  reporting_officers?: Employee[]; // Details of actual reporting officers
}

export interface AttendanceEntry extends DBAttendanceEntry {
  employee?: Employee;
  status_details?: DBAttendanceStatus;
}

export interface AttendanceRequest extends DBAttendanceRequest {
  employee?: Employee;
  status_details?: DBAttendanceStatus;
}

// Attendance Code metadata
export const ATTENDANCE_STATUSES: Record<string, { code: string; name: string; color: string; description: string; qualifiesForWage: boolean }> = {
  P: { code: 'P', name: 'Present', color: 'status-P', description: 'Present for full day', qualifiesForWage: true },
  LEAVE: { code: 'LEAVE', name: 'Leave', color: 'status-LEAVE', description: 'On approved leave', qualifiesForWage: false },
  OD: { code: 'OD', name: 'On Duty', color: 'status-OD', description: 'On official duty outside office', qualifiesForWage: true },
  TR: { code: 'TR', name: 'Tour', color: 'status-TR', description: 'Official out-of-station tour', qualifiesForWage: true },
  TO: { code: 'TO', name: 'Tour Off', color: 'status-TO', description: 'Rest day post out-of-station tour', qualifiesForWage: true },
  CO: { code: 'CO', name: 'Compensatory Off', color: 'status-CO', description: 'Compensatory holiday', qualifiesForWage: false },
  WO: { code: 'WO', name: 'Weekly Off', color: 'status-WO', description: 'Scheduled weekly holiday', qualifiesForWage: false },
  H: { code: 'H', name: 'Holiday', color: 'status-H', description: 'Declared public or restricted holiday', qualifiesForWage: false },
  A: { code: 'A', name: 'Absent', color: 'status-A', description: 'Absent without approval', qualifiesForWage: false },
  FH: { code: 'FH', name: 'First Half', color: 'status-FH', description: 'Present in first half only', qualifiesForWage: false }, // Will count as 0.5 present in calculations
  SH: { code: 'SH', name: 'Second Half', color: 'status-SH', description: 'Present in second half only', qualifiesForWage: false } // Will count as 0.5 present in calculations
};

export interface DashboardStats {
  totalEmployees: number;
  presentCount: number;
  leaveCount: number;
  onDutyCount: number;
  tourCount: number;
  absentCount: number;
  lockedMonthsCount: number;
}
