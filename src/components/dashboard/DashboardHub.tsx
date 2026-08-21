import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PersonalDashboard } from './PersonalDashboard';
import { ProjectManagerDashboard } from './ProjectManagerDashboard';
import { ManagementDashboard } from './ManagementDashboard';
import { User, FolderKanban, Shield, Sparkles } from 'lucide-react';

export const DashboardHub: React.FC = () => {
  const { activeRole } = useApp();

  // Pick initial tab based on role
  const getDefaultTab = () => {
    if (activeRole === 'Super Admin' || activeRole === 'Organization Admin') return 'management';
    if (activeRole === 'Project Manager' || activeRole === 'Team Lead') return 'pm';
    return 'personal';
  };

  const [activeTab, setActiveTab] = useState<'personal' | 'pm' | 'management'>(getDefaultTab());

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Dashboard Hub</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30">
              Live Real-time
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Switch between personal productivity, agile project oversight, and portfolio analytics
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'personal'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal</span>
          </button>

          <button
            onClick={() => setActiveTab('pm')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pm'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Project Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('management')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'management'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Management</span>
          </button>
        </div>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'personal' && <PersonalDashboard />}
      {activeTab === 'pm' && <ProjectManagerDashboard />}
      {activeTab === 'management' && <ManagementDashboard />}
    </div>
  );
};
