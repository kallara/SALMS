export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employment_categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      functional_roles: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          id: string
          auth_user_id: string | null
          employee_number: string
          username: string
          full_name: string
          email: string
          category_id: string
          functional_role_id: string
          role: 'root_admin' | 'admin' | 'employee'
          daily_wage_rate: number
          status: 'Active' | 'Archived'
          reporting_officer_ids: string[] | null // Support multiple reporting officers
          additional_charges: string[] | null     // Support multiple additional charges
          date_of_birth: string | null            // For Birthday dashboard widget
          created_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          employee_number: string
          username: string
          full_name: string
          email: string
          category_id: string
          functional_role_id: string
          role?: 'root_admin' | 'admin' | 'employee'
          daily_wage_rate?: number
          status?: 'Active' | 'Archived'
          reporting_officer_ids?: string[] | null
          additional_charges?: string[] | null
          date_of_birth?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          employee_number?: string
          username?: string
          full_name?: string
          email?: string
          category_id?: string
          functional_role_id?: string
          role?: 'root_admin' | 'admin' | 'employee'
          daily_wage_rate?: number
          status?: 'Active' | 'Archived'
          reporting_officer_ids?: string[] | null
          additional_charges?: string[] | null
          date_of_birth?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "employment_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_functional_role_id_fkey"
            columns: ["functional_role_id"]
            isOneToOne: false
            referencedRelation: "functional_roles"
            referencedColumns: ["id"]
          }
        ]
      }
      attendance_statuses: {
        Row: {
          code: string // P, LEAVE, OD, TR, TO, CO, WO, H, A, FH, SH
          name: string
          description: string | null
        }
        Insert: {
          code: string
          name: string
          description?: string | null
        }
        Update: {
          code?: string
          name?: string
          description?: string | null
        }
        Relationships: []
      }
      attendance_entries: {
        Row: {
          id: string
          employee_id: string
          date: string
          status_code: string
          marked_by: string | null
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date: string
          status_code: string
          marked_by?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string
          status_code?: string
          marked_by?: string | null
          remarks?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_entries_status_code_fkey"
            columns: ["status_code"]
            isOneToOne: false
            referencedRelation: "attendance_statuses"
            referencedColumns: ["code"]
          }
        ]
      }
      attendance_requests: {
        Row: {
          id: string
          employee_id: string
          date: string | null             // Specific date (for attendance regularisation)
          start_date: string | null       // Start date (for leave workflow)
          end_date: string | null         // End date (for leave workflow)
          requested_status_code: string   // e.g., 'LEAVE', 'OD', 'TR', 'TO', 'CO'
          reason: string
          status: 'Pending' | 'Approved' | 'Rejected'
          actioned_by: string | null
          actioned_at: string | null
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date?: string | null
          start_date?: string | null
          end_date?: string | null
          requested_status_code: string
          reason: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          actioned_by?: string | null
          actioned_at?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string | null
          start_date?: string | null
          end_date?: string | null
          requested_status_code?: string
          reason?: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          actioned_by?: string | null
          actioned_at?: string | null
          remarks?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_requests_requested_status_code_fkey"
            columns: ["requested_status_code"]
            isOneToOne: false
            referencedRelation: "attendance_statuses"
            referencedColumns: ["code"]
          }
        ]
      }
      attendance_month_locks: {
        Row: {
          id: string
          year: number
          month: number // 1-12
          locked: boolean
          locked_by: string | null
          locked_at: string | null
        }
        Insert: {
          id?: string
          year: number
          month: number
          locked?: boolean
          locked_by?: string | null
          locked_at?: string | null
        }
        Update: {
          id?: string
          year?: number
          month?: number
          locked?: boolean
          locked_by?: string | null
          locked_at?: string | null
        }
        Relationships: []
      }
      employee_leave_balances: {
        Row: {
          id: string
          employee_id: string
          leave_type_code: string // e.g., CL, EL, SL, etc.
          allocated: number
          availed: number
          balance: number
          year: number
        }
        Insert: {
          id?: string
          employee_id: string
          leave_type_code: string
          allocated: number
          availed?: number
          balance: number
          year: number
        }
        Update: {
          id?: string
          employee_id?: string
          leave_type_code?: string
          allocated?: number
          availed?: number
          balance?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      holidays: {
        Row: {
          id: string
          date: string
          name: string
          type: 'Gazetted' | 'Restricted'
        }
        Insert: {
          id?: string
          date: string
          name: string
          type?: 'Gazetted' | 'Restricted'
        }
        Update: {
          id?: string
          date?: string
          name?: string
          type?: 'Gazetted' | 'Restricted'
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
