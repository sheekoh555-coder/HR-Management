import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { analyzeAttendanceData } from '../lib/gemini';
import { calculateSalary } from '../lib/salary';
import { EmployeeRecord } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface UploadSectionProps {
  onDataProcessed: (data: EmployeeRecord[]) => void;
}

export function UploadSection({ onDataProcessed }: UploadSectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Read Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to CSV for Gemini
      const csvData = XLSX.utils.sheet_to_csv(worksheet);

      // 2. Analyze with Gemini
      const extractedData = await analyzeAttendanceData(csvData);

      // 3. Calculate Salaries
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const processedRecords: EmployeeRecord[] = extractedData.map((record: any) => 
        calculateSalary(
          record.employee_code,
          record.employee_name,
          record.working_hours,
          record.lateness_minutes,
          currentMonth
        )
      );

      // 4. Save to Supabase (if configured)
      if (isSupabaseConfigured) {
        const { error: dbError } = await supabase!.from('employee_records').insert(processedRecords);
        if (dbError) {
          console.error('Supabase insert error:', dbError);
          setError('Failed to save data to database. Please check your Supabase configuration.');
        }
      } else {
        console.warn('Supabase is not configured. Data will only be shown locally.');
      }

      onDataProcessed(processedRecords);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isProcessing ? (
              <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-10 h-10 mb-3 text-gray-400" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Excel files only (.xlsx, .xlsm, .xls)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".xlsx, .xls, .xlsm"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </label>
      </div>
      
      {error && (
        <div className="mt-4 p-4 text-sm text-red-800 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
