import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle
} from 'lucide-react';

export const AIRiskForecast: React.FC = () => {
  const { selectedProject, tasks, sprints } = useApp();

  const risks = [
    {
      id: 'risk-1',
      title: 'Hydraulic Moog Valve Lead-Time Delay',
      stream: 'Mechanical',
      severity: 'Critical',
      impact: '6 Days slip on Motion Platform Milestone',
      rootCause: 'Global aerospace valve allocation backlog.',
      aiMitigation: 'Authorize overtime for hydraulic rig assembly upon Aug 22 valve receipt; pre-wire harness in parallel.',
      confidence: 94,
    },
    {
      id: 'risk-2',
      title: 'Unity Thermal Shader Depth Sorting Artifacts',
      stream: 'Software',
      severity: 'Medium',
      impact: 'Visual noise in night gunnery sight beyond 1200m.',
      rootCause: 'Z-buffer resolution clipping against dense synthetic foliage LOD.',
      aiMitigation: 'Implement logarithmic depth buffer in custom HLSL vertex shader pass.',
      confidence: 88,
    },
    {
      id: 'risk-3',
      title: 'Gunner Handle CAN Bus Jitter under Extreme Turret Slew',
      stream: 'Hardware',
      severity: 'Low',
      impact: 'Minor interrupt latency spike (<3.5ms).',
      rootCause: 'DMA buffer overflow on STM32 when handling high-speed rotary encoders.',
      aiMitigation: 'Increase ring buffer allocation from 64 to 256 bytes in firmware v0.8.5.',
      confidence: 92,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl border bg-gradient-to-r from-amber-950/30 via-slate-900/80 to-purple-950/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <span>Autonomous Risk & Delay Prediction Engine</span>
              <Badge variant="warning" size="sm">
                Active Analysis
              </Badge>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              FlowPilot analyzes team velocity, hardware procurement lead-times, critical path slack, and historical bug burn rates to proactively detect slips before milestones are missed.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Project Health Index"
          value="78 / 100"
          subtitle="Moderate risk on motion base"
          icon={ShieldAlert}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <MetricCard
          title="Predicted Completion"
          value="Nov 24, 2026"
          subtitle="6 Days ahead of Nov 30 deadline"
          change="On Track"
          isPositive={true}
          icon={Clock}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          title="Critical Path Slippage"
          value="+2.5 Days"
          subtitle="Absorbed by sprint buffer"
          icon={AlertTriangle}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />
        <MetricCard
          title="AI Recovery Confidence"
          value="93%"
          subtitle="3 Actionable mitigations generated"
          icon={Sparkles}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Active Predicted Risks List */}
      <div className="glass-card rounded-2xl border overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Detected Program Risks & Mitigation Strategies
          </h3>
          <span className="text-xs text-slate-400">{risks.length} Risks Flagged</span>
        </div>

        <div className="space-y-4">
          {risks.map(risk => (
            <div
              key={risk.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-xs">{risk.title}</span>
                  <Badge variant="neutral" size="sm">
                    {risk.stream}
                  </Badge>
                  <Badge
                    variant={
                      risk.severity === 'Critical'
                        ? 'danger'
                        : risk.severity === 'Medium'
                        ? 'warning'
                        : 'info'
                    }
                    size="sm"
                  >
                    {risk.severity}
                  </Badge>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                  AI Confidence: {risk.confidence}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-slate-400 font-bold block mb-1">Impact & Root Cause:</span>
                  <p className="text-rose-300 mb-1">{risk.impact}</p>
                  <p className="text-slate-400 text-[11px]">{risk.rootCause}</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
                  <span className="text-purple-300 font-bold block mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    AI Recommended Recovery Plan:
                  </span>
                  <p className="text-slate-200 text-[11px] leading-relaxed">{risk.aiMitigation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
