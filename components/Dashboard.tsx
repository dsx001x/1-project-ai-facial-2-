
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { AttendanceRecord, Student } from '../types';

interface DashboardProps {
  records: AttendanceRecord[];
  students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ records, students }) => {
  const today = new Date().toLocaleDateString();
  const todayRecords = records.filter(r => new Date(r.timestamp).toLocaleDateString() === today);
  
  const stats = [
    { label: 'Total Students', value: students.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Present Today', value: todayRecords.length, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Absent Today', value: students.length - todayRecords.length, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Avg. Attendance', value: '92%', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  // Process data for chart
  const attendanceByDay = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 20 },
    { day: 'Fri', count: todayRecords.length || 0 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.bg} p-6 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]`}>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-blue-600">📈</span> Weekly Attendance Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceByDay}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-green-600">📋</span> Recent Activity
          </h3>
          <div className="space-y-4">
            {todayRecords.length > 0 ? (
              todayRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <p className="text-sm font-bold">{record.studentName}</p>
                      <p className="text-xs text-slate-500">{new Date(record.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">Present</span>
                </div>
              ))
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                <span className="text-4xl mb-2">🔭</span>
                <p>No activity recorded yet today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
