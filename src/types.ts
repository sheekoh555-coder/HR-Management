export interface EmployeeRecord {
  id?: string;
  employee_code: string;
  employee_name: string;
  working_hours: number;
  lateness_minutes: number;
  basic_salary: number;
  overtime_pay: number;
  insurance_deduction: number;
  tax_deduction: number;
  net_salary: number;
  month: string;
  created_at?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalNetSalary: number;
  totalLatenessMinutes: number;
  averageWorkingHours: number;
}
