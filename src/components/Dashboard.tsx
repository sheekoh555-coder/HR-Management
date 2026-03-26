import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { EmployeeRecord } from '../types';
import { Users, DollarSign, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  data: EmployeeRecord[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function Dashboard({ data }: DashboardProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        No data available. Please upload an attendance file.
      </div>
    );
  }

  const totalEmployees = data.length;
  const totalNetSalary = data.reduce((sum, record) => sum + record.net_salary, 0);
  const totalLateness = data.reduce((sum, record) => sum + record.lateness_minutes, 0);
  const avgWorkingHours = data.reduce((sum, record) => sum + record.working_hours, 0) / totalEmployees;

  // Prepare data for charts
  const salaryData = data.map(record => ({
    name: record.employee_name,
    Basic: record.basic_salary,
    Net: record.net_salary,
    Overtime: record.overtime_pay,
  })).slice(0, 10); // Show top 10

  const latenessData = data
    .filter(record => record.lateness_minutes > 0)
    .map(record => ({
      name: record.employee_name,
      value: record.lateness_minutes,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 late employees

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={<Users className="w-6 h-6 text-blue-500" />}
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Total Net Salary"
          value={`EGP ${totalNetSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={<DollarSign className="w-6 h-6 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Lateness (Mins)"
          value={totalLateness}
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          bgColor="bg-red-50"
        />
        <StatCard
          title="Avg Working Hours"
          value={`${avgWorkingHours.toFixed(1)}h`}
          icon={<Clock className="w-6 h-6 text-purple-500" />}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Salary Overview (Top 10)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="Basic" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Net" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Lateness (Minutes)</h3>
          <div className="h-80 flex items-center justify-center">
            {latenessData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={latenessData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {latenessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No lateness recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }: { title: string; value: string | number; icon: React.ReactNode; bgColor: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
