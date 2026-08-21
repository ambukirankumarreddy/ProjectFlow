import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { formatINR } from '../../utils/formatters';
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  IndianRupee,
  Repeat,
  AlertTriangle
} from 'lucide-react';

export const AIReportGenerator: React.FC = () => {
  const { selectedProject, sprints, tasks, budget, bomItems, users } = useApp();
  const [reportType, setReportType] = useState<'weekly' | 'client' | 'sprint' | 'delay'>('weekly');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSprint = sprints.find(s => s.status === 'active') || sprints[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>AI Automated Reporting Assistant</span>
            <Badge variant="purple" size="sm">
              FlowPilot Report Writer
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Instant generation of executive status briefs, client progress summaries, sprint retrospectives, and delay justifications in Indian Rupees (₹)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => {
            setReportType('weekly');
            handleGenerate();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            reportType === 'weekly'
              ? 'bg-brand-500 text-white shadow-glow-brand'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Weekly Status Brief</span>
        </button>

        <button
          onClick={() => {
            setReportType('client');
            handleGenerate();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            reportType === 'client'
              ? 'bg-brand-500 text-white shadow-glow-brand'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Client Progress Report</span>
        </button>

        <button
          onClick={() => {
            setReportType('sprint');
            handleGenerate();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            reportType === 'sprint'
              ? 'bg-brand-500 text-white shadow-glow-brand'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Sprint Retrospective</span>
        </button>

        <button
          onClick={() => {
            setReportType('delay');
            handleGenerate();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            reportType === 'delay'
              ? 'bg-brand-500 text-white shadow-glow-brand'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Delay Justification</span>
        </button>
      </div>

      {/* Rendered Document Sheet (A4-Style Glass Card) */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl border shadow-2xl max-w-4xl mx-auto space-y-8 bg-[#0b1220]/95 print:bg-white print:text-black print:p-0 print:border-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              ProjectFlow AI Executive Document
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">
              {reportType === 'weekly' && 'Weekly Executive Program Brief'}
              {reportType === 'client' && 'Client Milestone Progress Report'}
              {reportType === 'sprint' && `Sprint Delivery & Retrospective: ${activeSprint.name}`}
              {reportType === 'delay' && 'Technical Delay Justification & Mitigation Brief'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Program: {selectedProject?.name} ({selectedProject?.key}) • Sponsor: {selectedProject?.customer}
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono">
            <div>Date: 21/08/2026</div>
            <div>Classification: RESTRICTED</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            1. Executive Overview & Milestone Velocity
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The {selectedProject?.name} is progressing at <strong>{selectedProject?.progress}% completion</strong> across 9 multi-disciplinary workstreams. Sprint velocity is sustained at <strong>4.2 story points/day</strong>. Ballistics physics simulations and CAN bus driver interfaces are verified with zero latency defects.
          </p>
        </div>

        {/* Key Metrics Table in INR */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            2. Program Health & Financial Summary (INR)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Contract Budget</span>
              <span className="font-bold text-emerald-400 text-sm font-mono">
                {formatINR(budget.totalBudgetINR)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Actual Incurred</span>
              <span className="font-bold text-brand-400 text-sm font-mono">
                {formatINR(budget.actualSpendINR)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Tasks Completed</span>
              <span className="font-bold text-slate-100 text-sm font-mono">
                {tasks.filter(t => t.status === 'Completed').length} / {tasks.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">HIL Pass Rate</span>
              <span className="font-bold text-emerald-400 text-sm">100% (Passed)</span>
            </div>
          </div>
        </div>

        {/* Workstream Accomplishments */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            3. Disciplinary Accomplishments & Deliverables
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 list-disc pl-5 leading-relaxed">
            <li>
              <strong>Software & Physics:</strong> Completed Runge-Kutta 4th order numerical ballistics integrator in C#; validated against 30mm 2A42 military firing dispersion tables.
            </li>
            <li>
              <strong>3D Art & Terrain:</strong> Baked 4K PBR textures for vehicle hull and turret assembly with LOD 0-4 performance optimization.
            </li>
            <li>
              <strong>Embedded & Hardware:</strong> STM32 CAN Bus driver verified at 200Hz with zero frame drops on gunner control handles.
            </li>
            <li>
              <strong>Electrical Engineering:</strong> 24V MIL-DTL-38999 wiring harness assembled and verified for insulation continuity.
            </li>
          </ul>
        </div>

        {/* Critical Risks & Action Items */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            4. Critical Path Risks & Forward Plan
          </h3>
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Moog Hydraulic Servo Valve Lead-Time Buffer
            </div>
            <p className="text-[11px] leading-relaxed">
              Delivery confirmed for August 22. Mechanical assembly crew scheduled for weekend integration to preserve September 1 milestone delivery.
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-xs text-slate-400">
          <div>
            <div className="border-b border-slate-700 pb-8 mb-2" />
            <div className="font-bold text-slate-200">Sarah Jenkins</div>
            <div className="text-[11px]">Senior Technical Project Manager</div>
          </div>
          <div>
            <div className="border-b border-slate-700 pb-8 mb-2" />
            <div className="font-bold text-slate-200">Col. Arthur Hastings</div>
            <div className="text-[11px]">Client Technical Representative</div>
          </div>
        </div>
      </div>
    </div>
  );
};
