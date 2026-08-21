import React, { useState } from 'react';
import { AIProjectWizard } from './AIProjectWizard';
import { AIManpowerPlanner } from './AIManpowerPlanner';
import { AIRiskForecast } from './AIRiskForecast';
import { AIReportGenerator } from './AIReportGenerator';
import { Sparkles, Zap, ShieldAlert, FileText, Users } from 'lucide-react';

export const AIAgentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wizard' | 'manpower' | 'risk' | 'reports'>('wizard');

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>FlowPilot Autonomous AI Hub</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/30">
              Agentic Mode
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Intelligent planning, WBS generation, manpower staffing in INR (₹), risk forecasting, and executive reporting
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto custom-scrollbar self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'wizard'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Prompt to Project</span>
          </button>

          <button
            onClick={() => setActiveTab('manpower')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'manpower'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manpower Planner (₹)</span>
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'risk'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Risk Predictor</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'reports'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report Generator</span>
          </button>
        </div>
      </div>

      {activeTab === 'wizard' && <AIProjectWizard />}
      {activeTab === 'manpower' && <AIManpowerPlanner />}
      {activeTab === 'risk' && <AIRiskForecast />}
      {activeTab === 'reports' && <AIReportGenerator />}
    </div>
  );
};
