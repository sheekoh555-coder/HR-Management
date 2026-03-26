/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UploadSection } from './components/UploadSection';
import { Dashboard } from './components/Dashboard';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeRecord } from './types';
import { Building2, LayoutDashboard, Table as TableIcon } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<EmployeeRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table'>('dashboard');

  const handleDataProcessed = (processedData: EmployeeRecord[]) => {
    setData(processedData);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">HR Management</h1>
            </div>
            <div className="text-sm text-gray-500">
              Powered by Gemini AI
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Upload Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload Attendance Data</h2>
            <p className="text-sm text-gray-500">Upload your Excel file to automatically extract data and calculate salaries.</p>
          </div>
          <UploadSection onDataProcessed={handleDataProcessed} />
        </section>

        {/* Content Section */}
        {data.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'table' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TableIcon className="w-4 h-4" />
                <span>Data Table</span>
              </button>
            </div>

            <div className="animate-in fade-in duration-500">
              {activeTab === 'dashboard' ? (
                <Dashboard data={data} />
              ) : (
                <EmployeeTable data={data} />
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
