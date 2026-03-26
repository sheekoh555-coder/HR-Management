import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeAttendanceData(csvData: string) {
  const prompt = `
    You are an HR assistant. Please analyze the following attendance data (provided as CSV).
    Extract the following information for each employee:
    - Employee Name (employee_name)
    - Employee Code (employee_code)
    - Total Working Hours (working_hours)
    - Total Lateness in minutes after 8:05 AM (lateness_minutes)

    If the data is incomplete or ambiguous, make your best estimate based on the available information.
    Return a list of objects containing these fields.
    
    Data:
    ${csvData}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              employee_name: { type: Type.STRING, description: 'The name of the employee' },
              employee_code: { type: Type.STRING, description: 'The code or ID of the employee' },
              working_hours: { type: Type.NUMBER, description: 'Total working hours for the period' },
              lateness_minutes: { type: Type.NUMBER, description: 'Total lateness in minutes after 8:05 AM' },
            },
            required: ['employee_name', 'employee_code', 'working_hours', 'lateness_minutes'],
          },
        },
      },
    });

    const jsonStr = response.text?.trim() || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error analyzing data with Gemini:', error);
    throw new Error('Failed to analyze attendance data.');
  }
}
