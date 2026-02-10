
import React from 'react';
import { Student, AttendanceRecord } from '../types';

interface StudentProfileProps {
  student: Student;
  records: AttendanceRecord[];
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, records, onBack }) => {
  const studentRecords = records.filter(r => r.studentId === student.id);
  const attendanceRate = studentRecords.length > 0 ? "95%" : "0%"; // Mock logic for rate

  return (
    <div className="animate-fadeIn">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <span>←</span> Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-24 bg-blue-600"></div>
            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4">
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-white object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
              <p className="text-blue-600 font-medium mb-4">{student.department}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 w-5">🆔</span>
                  <span className="text-slate-700 font-mono">{student.id}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 w-5">📧</span>
                  <span className="text-slate-700">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 w-5">📞</span>
                  <span className="text-slate-700">{student.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 w-5">📅</span>
                  <span className="text-slate-700">Enrolled: {student.enrollmentDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">About Student</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {student.bio || "No bio available for this student."}
            </p>
          </div>
        </div>

        {/* History & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase mb-1">Attendance Rate</p>
              <p className="text-2xl font-bold text-blue-900">{attendanceRate}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <p className="text-xs text-green-600 font-bold uppercase mb-1">Total Classes</p>
              <p className="text-2xl font-bold text-green-900">{studentRecords.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Attendance History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold uppercase text-slate-400 bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-3">Date & Time</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Device</th>
                    <th className="px-6 py-3 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentRecords.length > 0 ? (
                    studentRecords.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {record.timestamp.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">Main Entrance Cam</td>
                        <td className="px-6 py-4 text-sm text-right font-mono text-blue-600">
                          {(record.confidence * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                        No history found for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
