import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, Task, Sprint, AIActionPreview } from '../../types';
import { Badge } from '../common/Badge';
import { formatINR } from '../../utils/formatters';
import {
  Sparkles,
  Layers,
  Repeat,
  CheckSquare,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Play,
  RotateCcw,
  Zap,
  IndianRupee
} from 'lucide-react';

export const AIProjectWizard: React.FC = () => {
  const { setPendingAIAction, users, currentUser } = useApp();
  const [prompt, setPrompt] = useState(
    'Create a 120-day BMP-II Combat Simulator project with 4 Unity developers, 3D modelling team, and separate hardware, electrical and mechanical workstreams.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const samplePrompts = [
    'Create a 120-day BMP-II simulator project with 4 Unity developers, full modelling team and separate hardware, electrical and mechanical streams.',
    'Generate an Autonomous Tactical Drone Swarm program with ROS2, computer vision, flight controllers, and HIL regression tests.',
    'Build a NextGen Mil-Spec Command & Control tactical radar interface with 60-day delivery sprints.',
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      // Synthesize realistic comprehensive multi-stream WBS in INR
      const newProjectId = `proj-ai-${Date.now()}`;
      const projectKey = 'BMP-AI';

      const generatedProject: Project = {
        id: newProjectId,
        key: projectKey,
        name: 'BMP-II Combat Simulator (AI Synthesized 120-Day Program)',
        description: 'Multi-stream armored vehicle simulator with hydraulic motion base, physical cockpit CAN bus controls, Unity rendering engine, and tactical instructor station.',
        customer: 'Ministry of Defense / Armored Directorate',
        projectManagerId: currentUser.id,
        department: 'Defense Simulation',
        startDate: '2026-09-01',
        endDate: '2026-12-30',
        priority: 'Critical',
        status: 'Active',
        budgetINR: 54000000, // ₹5,40,00,000 (5.4 Crores INR)
        gstPercentage: 18,
        currency: 'INR',
        methodology: 'Hybrid',
        tags: ['AI Generated', 'Simulator', 'Hardware-in-Loop', 'Mil-Spec', 'INR Budget'],
        workstreams: [
          'Software',
          '3D Modelling',
          'Hardware',
          'Mechanical',
          'Electrical',
          'Procurement',
          'Integration',
          'Testing',
          'Deployment'
        ],
        modules: [
          {
            id: `mod-ai-1`,
            projectId: newProjectId,
            name: '3D Photorealistic Hull & Turret',
            workstream: '3D Modelling',
            description: 'PBR 4K assets, interior viewports and damage models.',
            progress: 0,
            status: 'Planned',
            leadId: users[2]?.id || 'usr-3',
            targetCompletionDate: '2026-10-15',
            budgetINR: 6500000,
          },
          {
            id: `mod-ai-2`,
            projectId: newProjectId,
            name: 'Simulation Physics & Ballistics',
            workstream: 'Software',
            description: '30mm 2A42 automatic cannon trajectory and recoil dynamics in C#.',
            progress: 0,
            status: 'Planned',
            leadId: users[1]?.id || 'usr-2',
            targetCompletionDate: '2026-11-01',
            budgetINR: 12000000,
          },
          {
            id: `mod-ai-3`,
            projectId: newProjectId,
            name: 'CAN Bus Gunner Control Handles',
            workstream: 'Hardware',
            description: 'STM32 microcontroller firmware and 200Hz joystick packets.',
            progress: 0,
            status: 'Planned',
            leadId: users[3]?.id || 'usr-4',
            targetCompletionDate: '2026-10-30',
            budgetINR: 14500000,
          },
          {
            id: `mod-ai-4`,
            projectId: newProjectId,
            name: '6-DOF Hydraulic Motion Base',
            workstream: 'Mechanical',
            description: 'Hexapod motion platform with Moog proportional servo valves.',
            progress: 0,
            status: 'Planned',
            leadId: users[4]?.id || 'usr-5',
            targetCompletionDate: '2026-11-15',
            budgetINR: 13000000,
          },
        ],
        progress: 0,
        riskScore: 15,
        aiHealthInsight: 'Autonomous WBS generated with zero critical path conflicts.',
      };

      const generatedSprints: Sprint[] = [
        {
          id: `sprint-ai-1`,
          projectId: newProjectId,
          name: 'Sprint 1: I/O Architecture & Hull Modelling',
          objective: 'Establish CAN bus communication and complete low-poly hull mesh.',
          startDate: '2026-09-01',
          endDate: '2026-09-14',
          capacity: 160,
          plannedPoints: 42,
          completedPoints: 0,
          status: 'active',
          riskLevel: 'low',
        },
        {
          id: `sprint-ai-2`,
          projectId: newProjectId,
          name: 'Sprint 2: Ballistics & Hydraulic Calibration',
          objective: 'Integrate 30mm trajectory equations with motion base feedback.',
          startDate: '2026-09-15',
          endDate: '2026-09-28',
          capacity: 180,
          plannedPoints: 50,
          completedPoints: 0,
          status: 'planning',
          riskLevel: 'medium',
        },
      ];

      const generatedTasks: Task[] = [
        {
          id: `task-ai-1`,
          key: `${projectKey}-101`,
          title: '30mm 2A42 Cannon High-Res 3D Mesh & LOD 0-4',
          description: 'Construct detailed exterior weapon assembly in Blender with PBR weathering maps.',
          projectId: newProjectId,
          moduleId: 'mod-ai-1',
          workstream: '3D Modelling',
          type: 'Task',
          priority: 'High',
          status: 'Selected',
          assigneeId: users[2]?.id || 'usr-3',
          reporterId: currentUser.id,
          sprintId: 'sprint-ai-1',
          startDate: '2026-09-01',
          dueDate: '2026-09-10',
          estimatedHours: 35,
          actualHours: 0,
          storyPoints: 8,
          labels: ['3D Asset', 'AI Generated'],
          dependencies: [],
          checklist: [
            { id: 'ca-1', text: 'High-poly cage creation', completed: false },
            { id: 'ca-2', text: 'Substance Painter texturing', completed: false },
          ],
          acceptanceCriteria: ['Draw calls < 15 per asset', 'Accurate military dimensional tolerance'],
          comments: [],
          activityLog: [],
          approvalStatus: 'none',
          progress: 0,
        },
        {
          id: `task-ai-2`,
          key: `${projectKey}-102`,
          title: 'C# 4th Order Runge-Kutta Ballistics Integrator',
          description: 'Implement realistic bullet drop, drag, air density, and wind drift.',
          projectId: newProjectId,
          moduleId: 'mod-ai-2',
          workstream: 'Software',
          type: 'Task',
          priority: 'Critical',
          status: 'Selected',
          assigneeId: users[1]?.id || 'usr-2',
          reporterId: currentUser.id,
          sprintId: 'sprint-ai-1',
          startDate: '2026-09-02',
          dueDate: '2026-09-12',
          estimatedHours: 40,
          actualHours: 0,
          storyPoints: 13,
          labels: ['Physics', 'Ballistics', 'Unity'],
          dependencies: [],
          checklist: [
            { id: 'ca-3', text: 'Numerical solver integration', completed: false },
            { id: 'ca-4', text: 'Unit tests against military firing tables', completed: false },
          ],
          acceptanceCriteria: ['Dispersion error < 0.5 mil at 1500m range'],
          comments: [],
          activityLog: [],
          approvalStatus: 'none',
          progress: 0,
        },
        {
          id: `task-ai-3`,
          key: `${projectKey}-103`,
          title: 'CAN Bus Microcontroller Firmware for Gunner Controls',
          description: 'Flash STM32 firmware and bridge 200Hz joystick inputs to simulation host.',
          projectId: newProjectId,
          moduleId: 'mod-ai-3',
          workstream: 'Hardware',
          type: 'Task',
          priority: 'High',
          status: 'Selected',
          assigneeId: users[3]?.id || 'usr-4',
          reporterId: currentUser.id,
          sprintId: 'sprint-ai-1',
          startDate: '2026-09-03',
          dueDate: '2026-09-14',
          estimatedHours: 32,
          actualHours: 0,
          storyPoints: 8,
          labels: ['Firmware', 'STM32', 'CAN Bus'],
          dependencies: [],
          checklist: [],
          acceptanceCriteria: ['Zero frame drops at 200Hz packet rate'],
          comments: [],
          activityLog: [],
          approvalStatus: 'none',
          progress: 0,
        },
      ];

      setGeneratedPlan({
        project: generatedProject,
        sprints: generatedSprints,
        tasks: generatedTasks,
      });

      setIsGenerating(false);
    }, 1200);
  };

  const handleOpenSafetyPreview = () => {
    if (!generatedPlan) return;

    const actionPreview: AIActionPreview = {
      id: `act-prev-${Date.now()}`,
      type: 'create_project',
      title: `Create Project: ${generatedPlan.project.name}`,
      prompt,
      confidence: 96,
      proposedChanges: generatedPlan,
      executed: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setPendingAIAction(actionPreview);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl border bg-gradient-to-r from-purple-950/40 via-brand-950/30 to-slate-900/60">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white shadow-glow-purple">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <span>FlowPilot AI Project & WBS Synthesis Engine</span>
              <Badge variant="purple" size="sm">
                Safety Controlled
              </Badge>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Describe your project requirement or upload an RFP. FlowPilot generates full workstreams, modules, milestones, sprints, tasks, effort estimations, and risk forecasts in Indian Rupees (₹) with preview & confirmation before committing.
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Form */}
      <div className="glass-card p-6 rounded-2xl border space-y-4">
        <form onSubmit={handleGenerate} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Project Prompt / Scope Specification:
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Create a 120-day BMP-II simulator with 4 Unity devs, modelling team, and hardware/electrical streams..."
            className="w-full p-3.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-slate-100 text-xs focus:outline-none focus:border-brand-500 leading-relaxed font-sans"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Try Sample:</span>
              {samplePrompts.map((sp, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setPrompt(sp)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors truncate max-w-[200px]"
                >
                  Option {i + 1}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-xs font-bold shadow-glow-brand flex items-center gap-2 transition-all disabled:opacity-50 self-end sm:self-auto"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isGenerating ? 'Synthesizing WBS & Tasks...' : 'Generate Project WBS (₹)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Plan Preview & Apply Action */}
      {generatedPlan && (
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">
                  96% Confidence Score
                </Badge>
                <Badge variant="purple" size="sm">
                  {generatedPlan.project.workstreams.length} Workstreams
                </Badge>
              </div>
              <h3 className="text-base font-extrabold text-slate-100 mt-1">
                {generatedPlan.project.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Methodology: {generatedPlan.project.methodology} • Budget: {formatINR(generatedPlan.project.budgetINR)} • 120-Day Timeline
              </p>
            </div>

            {/* Apply & Commit Button triggering Safety Modal */}
            <button
              onClick={handleOpenSafetyPreview}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-glow-emerald flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Preview & Confirm Execution</span>
            </button>
          </div>

          {/* Workstream Modules Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              Generated Workstream Modules ({generatedPlan.project.modules.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {generatedPlan.project.modules.map((m: any) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{m.name}</span>
                    <Badge variant="neutral" size="sm">
                      {m.workstream}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Sprints */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-purple-400" />
              Generated Agile Sprints ({generatedPlan.sprints.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {generatedPlan.sprints.map((s: any) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="font-bold text-slate-200">{s.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{s.objective}</div>
                  <div className="text-[10px] text-brand-400 font-mono mt-1">
                    {s.plannedPoints} pts planned • {s.startDate} → {s.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Tasks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              Synthesized Engineering Tasks ({generatedPlan.tasks.length})
            </h4>
            <div className="space-y-2">
              {generatedPlan.tasks.map((t: any) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-400">{t.key}</span>
                      <span className="font-semibold text-slate-200">{t.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{t.workstream}</span>
                      <span>•</span>
                      <span>{t.storyPoints} pts ({t.estimatedHours}h)</span>
                    </div>
                  </div>
                  <Badge variant={t.priority === 'Critical' ? 'danger' : 'warning'} size="sm">
                    {t.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
