import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import confetti from 'canvas-confetti';
import {
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  Clock,
  Briefcase,
  GitFork,
  Check
} from 'lucide-react';

export const OrgOnboardingWizard: React.FC = () => {
  const { orgSettings, updateOrgSettings, users } = useApp();

  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState(orgSettings.name);
  const [industry, setIndustry] = useState(orgSettings.industry);
  const [departments, setDepartments] = useState<string[]>(orgSettings.departments);
  const [newDept, setNewDept] = useState('');
  const [workingHours, setWorkingHours] = useState(orgSettings.workingHours);
  const [aiAssistantActive, setAiAssistantActive] = useState(true);

  const steps = [
    { num: 1, title: 'Organization' },
    { num: 2, title: 'Company Logo' },
    { num: 3, title: 'Industry' },
    { num: 4, title: 'Departments' },
    { num: 5, title: 'Working Hours' },
    { num: 6, title: 'Invite Specialists' },
    { num: 7, title: 'First Program' },
    { num: 8, title: 'Template' },
    { num: 9, title: 'Workflow' },
    { num: 10, title: 'Activate AI' },
  ];

  const handleNext = () => {
    if (step < 10) {
      setStep(step + 1);
    } else {
      updateOrgSettings({
        name: orgName,
        industry,
        departments,
        workingHours,
        isConfigured: true,
      });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.trim()) return;
    setDepartments([...departments, newDept.trim()]);
    setNewDept('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="purple" size="md">
          10-Step Interactive Onboarding
        </Badge>
        <h2 className="text-2xl font-black text-slate-100">
          Organization Setup & Governance Wizard
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Configure multi-department enterprise settings, working calendars, default workflows, and activate FlowPilot AI
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="flex items-center justify-between overflow-x-auto py-2 px-1 custom-scrollbar">
        {steps.map(s => (
          <div key={s.num} className="flex items-center gap-1.5 shrink-0 px-2">
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                s.num < step
                  ? 'bg-emerald-500 text-white'
                  : s.num === step
                  ? 'bg-brand-500 text-white shadow-glow-brand ring-2 ring-brand-400/50'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {s.num < step ? <Check className="w-3.5 h-3.5" /> : s.num}
            </div>
            <span
              className={`text-[11px] font-semibold hidden md:inline ${
                s.num === step ? 'text-slate-100' : 'text-slate-500'
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Card Container */}
      <div className="glass-card p-8 rounded-3xl border shadow-2xl space-y-6 min-h-[380px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Step 1: Organization Name</h3>
                <p className="text-xs text-slate-400">Enter legal company name for multi-tenant isolation</p>
              </div>
            </div>
            <input
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-100">Step 2: Company Branding & Logo</h3>
            <div className="flex items-center gap-4">
              <img
                src={orgSettings.logo}
                alt="Logo"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-slate-200">High-Resolution Crest / Brand Logo</div>
                <p className="text-slate-400 text-[11px]">Rendered on reports, client dashboards, and navigation</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-100">Step 3: Primary Industry Domain</h3>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="Defense & Aerospace Simulation">Defense & Aerospace Simulation</option>
              <option value="Autonomous Robotics & Embedded">Autonomous Robotics & Embedded</option>
              <option value="Enterprise Agile Software">Enterprise Agile Software</option>
              <option value="Automotive & Hardware Engineering">Automotive & Hardware Engineering</option>
            </select>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h3 className="text-base font-bold text-slate-100">Step 4: Configure Multidisciplinary Departments</h3>
            <div className="flex flex-wrap gap-2">
              {departments.map((d, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 font-semibold border border-slate-700 flex items-center gap-2"
                >
                  <span>{d}</span>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddDept} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add department name..."
                value={newDept}
                onChange={e => setNewDept(e.target.value)}
                className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
              >
                Add
              </button>
            </form>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h3 className="text-base font-bold text-slate-100">Step 5: Working Days & Shift Schedule</h3>
            <input
              type="text"
              value={workingHours}
              onChange={e => setWorkingHours(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>
        )}

        {step >= 6 && step <= 9 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h3 className="text-base font-bold text-slate-100">
              {step === 6 && 'Step 6: Team Roster & Role Permissions'}
              {step === 7 && 'Step 7: First Enterprise Program Setup'}
              {step === 8 && 'Step 8: Program Template: Multi-Disciplinary Workstream'}
              {step === 9 && 'Step 9: Agile Workflow Engine: Backlog → Selected → In Progress → Review → Testing → Approved → Done'}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Default enterprise presets loaded and validated for 8-role permission matrix, stage-gate milestones, and timesheet approvals.
            </p>
          </div>
        )}

        {step === 10 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Step 10: Activate FlowPilot AI Assistant</h3>
                <p className="text-xs text-slate-400">Enables automated WBS generation, risk forecasting & standup summaries</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
              <span className="font-semibold text-slate-200">Autonomous FlowPilot Agent Active</span>
              <Badge variant="success" size="sm">Enabled</Badge>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 disabled:opacity-30 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold shadow-glow-brand flex items-center gap-2 transition-all"
          >
            <span>{step === 10 ? 'Finish & Complete Setup' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
