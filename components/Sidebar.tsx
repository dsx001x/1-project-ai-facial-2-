
import React from 'react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: ViewMode.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: ViewMode.LIVE_SCAN, label: 'Live Scanner', icon: '📹' },
    { id: ViewMode.RECORDS, label: 'Attendance Log', icon: '📝' },
    { id: ViewMode.STUDENTS, label: 'Student Directory', icon: '👥' },
    { id: ViewMode.PYTHON_CODE, label: 'Python Script', icon: '🐍' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-xl z-20">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-400">Vision</span>Track AI
        </h1>
        <p className="text-xs text-slate-400 mt-1">Attendance Management</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-400">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-200">AI Model Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
