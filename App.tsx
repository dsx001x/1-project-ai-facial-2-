
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CameraScanner from './components/CameraScanner';
import StudentProfile from './components/StudentProfile';
import PythonCodeViewer from './components/PythonCodeViewer';
import { ViewMode, AttendanceRecord, Student } from './types';
import { MOCK_STUDENTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [lastMarkedMap, setLastMarkedMap] = useState<Record<string, number>>({});
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleMarkAttendance = useCallback((record: AttendanceRecord) => {
    setAttendanceRecords(prev => [record, ...prev]);
    setLastMarkedMap(prev => ({
      ...prev,
      [record.studentId]: Date.now()
    }));
  }, []);

  const handleStudentClick = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentView(ViewMode.STUDENT_PROFILE);
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Student Name', 'Student ID', 'Time', 'Status', 'AI Confidence'];
    const rows = attendanceRecords.map(r => [
      r.id,
      r.studentName,
      r.studentId,
      r.timestamp.toLocaleString(),
      r.status,
      `${(r.confidence * 100).toFixed(1)}%`
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.DASHBOARD:
        return <Dashboard records={attendanceRecords} students={MOCK_STUDENTS} />;
      
      case ViewMode.LIVE_SCAN:
        return (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Live AI Scanner</h2>
              <p className="text-slate-500">Position the student's face within the frame for automatic recognition.</p>
            </div>
            <CameraScanner 
              onMarkAttendance={handleMarkAttendance} 
              lastMarked={lastMarkedMap} 
            />
          </div>
        );

      case ViewMode.RECORDS:
        return (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Attendance Log</h2>
                <p className="text-slate-500">View and export system-generated attendance data.</p>
              </div>
              <button 
                onClick={downloadCSV}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <span>📥</span> Export CSV
              </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Student</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Time</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">AI Conf.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          <button 
                            onClick={() => handleStudentClick(record.studentId)}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {record.studentName}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{record.studentId}</td>
                        <td className="px-6 py-4 text-slate-500">{record.timestamp.toLocaleTimeString()}</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Present</span>
                        </td>
                        <td className="px-6 py-4 text-blue-600 font-mono text-sm">{(record.confidence * 100).toFixed(1)}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        No records found for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case ViewMode.STUDENTS:
        return (
          <div className="animate-fadeIn">
             <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Student Directory</h2>
              <p className="text-slate-500">Managed database of registered students for facial recognition.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_STUDENTS.map(student => (
                <button 
                  key={student.id} 
                  onClick={() => handleStudentClick(student.id)}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 text-left hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-full border-2 border-slate-100 object-cover" />
                  <div className="flex-1">
                    <p className="text-lg font-bold group-hover:text-blue-600 transition-colors">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.id} • {student.department}</p>
                    <div className="mt-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded">Active</div>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-500 transition-colors">→</span>
                </button>
              ))}
            </div>
          </div>
        );

      case ViewMode.STUDENT_PROFILE:
        const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
        if (!student) return null;
        return (
          <StudentProfile 
            student={student} 
            records={attendanceRecords} 
            onBack={() => setCurrentView(ViewMode.STUDENTS)}
          />
        );

      case ViewMode.PYTHON_CODE:
        return <PythonCodeViewer />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        currentView={currentView === ViewMode.STUDENT_PROFILE ? ViewMode.STUDENTS : currentView} 
        onViewChange={(view) => {
          setSelectedStudentId(null);
          setCurrentView(view);
        }} 
      />
      
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">VisionTrack AI v2.5</p>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p className="text-xs text-slate-400">Class: Computer Science 301</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
