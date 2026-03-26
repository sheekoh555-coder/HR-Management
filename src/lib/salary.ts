import { EmployeeRecord } from '../types';

const DEFAULT_BASIC_SALARY = 5000;
const STANDARD_HOURS = 160;
const INSURANCE_RATE = 0.11;
const TAX_RATE = 0.10;

export function calculateSalary(
  employee_code: string,
  employee_name: string,
  working_hours: number,
  lateness_minutes: number,
  month: string
): EmployeeRecord {
  const basic_salary = DEFAULT_BASIC_SALARY;
  const hourly_rate = basic_salary / STANDARD_HOURS;
  
  // Overtime pay (1.5x rate for hours over standard)
  const overtime_hours = Math.max(0, working_hours - STANDARD_HOURS);
  const overtime_pay = overtime_hours * hourly_rate * 1.5;
  
  // Lateness deduction (minute by minute)
  const lateness_deduction = lateness_minutes * (hourly_rate / 60);
  
  // Insurance deduction
  const insurance_deduction = basic_salary * INSURANCE_RATE;
  
  // Taxable income
  const taxable_income = Math.max(0, basic_salary + overtime_pay - lateness_deduction - insurance_deduction);
  const tax_deduction = taxable_income * TAX_RATE;
  
  // Net salary
  const net_salary = basic_salary + overtime_pay - lateness_deduction - insurance_deduction - tax_deduction;

  return {
    employee_code,
    employee_name,
    working_hours,
    lateness_minutes,
    basic_salary,
    overtime_pay,
    insurance_deduction,
    tax_deduction,
    net_salary,
    month,
  };
}
