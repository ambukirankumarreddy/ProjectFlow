import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { formatINR, calculateManpowerCost } from '../../utils/formatters';
import {
  Sparkles,
  Users,
  AlertTriangle,
  CheckCircle2,
  Send,
  Building2,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export const AIManpowerPlanner: React.FC = () => {
  const { users, selectedProject, setPendingAIAction } = useApp();

  const [prompt, setPrompt] = useState(
    'Create a manpower plan for a 120-day BMP-II simulator project with four Unity developers, one Unity lead, the full modelling team, one mechanical engineer, one electrical engineer and one QA engineer.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{
    projectDurationMonths: number;
    teamMembers: {
      role: string;
      suggestedUserId: string;
      suggestedName: string;
      allocationPercentage: number;
      monthlyCostINR: number;
      totalProjectCostINR: number;
      reportingToRole: string;
    }[];
    totalManpowerCostINR: number;
    aiInsights: string[];
  } | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const duration = 4; // 120 days = 4 months

      const planMembers = [
        {
          role: 'Unity Simulation Lead & Architect',
          suggestedUserId: 'usr-2',
          suggestedName: 'Vikram Malhotra',
          allocationPercentage: 80,
          monthlyCostINR: 180000,
          totalProjectCostINR: calculateManpowerCost(180000, 80, duration),
          reportingToRole: 'Project Manager (Sarah Jenkins)',
        },
        {
          role: 'Unity Simulation Developer 1',
          suggestedUserId: 'usr-u1',
          suggestedName: 'Kavita Sharma',
          allocationPercentage: 70,
          monthlyCostINR: 95000,
          totalProjectCostINR: calculateManpowerCost(95000, 70, duration),
          reportingToRole: 'Unity Simulation Lead',
        },
        {
          role: 'Unity Simulation Developer 2 (New Role)',
          suggestedUserId: 'usr-trainee',
          suggestedName: 'Arjun Das (Trainee Engineer)',
          allocationPercentage: 50,
          monthlyCostINR: 35000,
          totalProjectCostINR: calculateManpowerCost(35000, 50, duration),
          reportingToRole: 'Unity Simulation Lead',
        },
        {
          role: '3D Modelling & Hard-Surface Lead',
          suggestedUserId: 'usr-3',
          suggestedName: 'Elena Rostova',
          allocationPercentage: 100,
          monthlyCostINR: 160000,
          totalProjectCostINR: calculateManpowerCost(160000, 100, duration),
          reportingToRole: 'Project Manager (Sarah Jenkins)',
        },
        {
          role: 'Vehicle & Terrain Modeller',
          suggestedUserId: 'usr-art1',
          suggestedName: 'Rohan Mehra',
          allocationPercentage: 100,
          monthlyCostINR: 85000,
          totalProjectCostINR: calculateManpowerCost(85000, 100, duration),
          reportingToRole: '3D Modelling Lead',
        },
        {
          role: 'Lead Mechanical Designer',
          suggestedUserId: 'usr-5',
          suggestedName: 'Marcus Thorne',
          allocationPercentage: 100,
          monthlyCostINR: 165000,
          totalProjectCostINR: calculateManpowerCost(165000, 100, duration),
          reportingToRole: 'Project Manager (Sarah Jenkins)',
        },
        {
          role: 'Senior Electrical Wiring Engineer',
          suggestedUserId: 'usr-6',
          suggestedName: 'Aisha Patel',
          allocationPercentage: 100,
          monthlyCostINR: 120000,
          totalProjectCostINR: calculateManpowerCost(120000, 100, duration),
          reportingToRole: 'Hardware Lead (David Chen)',
        },
        {
          role: 'Lead QA & HIL Test Acceptance Engineer',
          suggestedUserId: 'usr-7',
          suggestedName: 'Alexander Volkov',
          allocationPercentage: 80,
          monthlyCostINR: 145000,
          totalProjectCostINR: calculateManpowerCost(145000, 80, duration),
          reportingToRole: 'Project Manager (Sarah Jenkins)',
        },
      ];

      const totalCost = planMembers.reduce((sum, m) => sum + m.totalProjectCostINR, 0);

      setGeneratedPlan({
        projectDurationMonths: duration,
        teamMembers: planMembers,
        totalManpowerCostINR: totalCost,
        aiInsights: [
          'Total Manpower Cost computed at ' + formatINR(totalCost) + ' over 120-day timeline.',
          'Vikram Malhotra is committed at 80% on BMP-II and 20% on Drone Swarm (100% total optimal load).',
          'Identified 1 trainee engineer allocation for junior scripting tasks to reduce overall program cost by ₹2,40,000.',
          'Zero reporting manager conflicts detected across 3-tier hierarchy.',
        ],
      });

      setIsGenerating(false);
    }, 1000);
  };

  const handleApplyManpowerPlan = () => {
    if (!generatedPlan) return;

    setPendingAIAction({
      id: `ai-manpower-${Date.now()}`,
      type: 'manpower_plan',
      title: `Apply AI Manpower Plan for ${selectedProject?.name}`,
      prompt,
      confidence: 96,
      proposedChanges: {
        manpowerPlan: generatedPlan,
      },
      executed: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Prompt Card */}
      <div className="glass-card p-6 rounded-3xl border space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Autonomous AI Manpower & Staffing Engine
            </h3>
            <p className="text-xs text-slate-400">
              Generate optimal team allocations, reporting hierarchies, and project manpower cost models in Indian Rupees (₹)
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <textarea
            rows={3}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe team requirements, project duration, skills, and discipline leads..."
            className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-slate-100 text-xs focus:outline-none focus:border-brand-500 leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Target Project: <strong className="text-slate-200">{selectedProject?.name}</strong>
            </span>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-glow-brand flex items-center gap-2 transition-all disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>Synthesizing Manpower Tree...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Generate Manpower Plan (₹)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Plan Output */}
      {generatedPlan && (
        <div className="glass-card p-6 rounded-3xl border space-y-6 animate-in fade-in duration-300">
          {/* Summary KPIs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">
                  AI Plan Ready (96% Confidence)
                </Badge>
                <Badge variant="purple" size="sm">
                  {generatedPlan.projectDurationMonths} Months (120 Days)
                </Badge>
              </div>
              <h4 className="text-base font-extrabold text-slate-100 mt-1">
                Synthesized Manpower Structure & Cost
              </h4>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Total Manpower Expenditure
              </span>
              <div className="text-lg font-black text-brand-300 font-mono">
                {formatINR(generatedPlan.totalManpowerCostINR)}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
            <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              FlowPilot Manpower Insights & Optimization
            </span>
            <ul className="text-xs text-slate-300 space-y-1">
              {generatedPlan.aiInsights.map((insight, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Manpower Staffing Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Assigned Specialist</th>
                  <th className="py-3 px-3">Reporting To</th>
                  <th className="py-3 px-3">Allocation</th>
                  <th className="py-3 px-3">Monthly Cost</th>
                  <th className="py-3 px-3">Total Project Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {generatedPlan.teamMembers.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-sans font-semibold text-slate-200">{m.role}</td>
                    <td className="py-3 px-3 font-sans text-brand-300 font-medium">{m.suggestedName}</td>
                    <td className="py-3 px-3 font-sans text-slate-400">{m.reportingToRole}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{m.allocationPercentage}%</td>
                    <td className="py-3 px-3 text-slate-300">{formatINR(m.monthlyCostINR)}</td>
                    <td className="py-3 px-3 font-bold text-slate-100">{formatINR(m.totalProjectCostINR)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Confirmation */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Requires Project Manager & Org Admin approval before database commit
            </span>

            <button
              onClick={handleApplyManpowerPlan}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold shadow-glow-brand flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Preview & Confirm Staged Manpower Plan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
