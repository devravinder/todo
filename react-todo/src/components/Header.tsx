import React from 'react';
import { Settings, Plus } from 'lucide-react';

interface HeaderProps {
  onNewTask: () => void;
  onSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewTask, onSettings }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Kanban Board</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onNewTask}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Task
          </button>
          <button
            onClick={onSettings}
            className="inline-flex items-center px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;