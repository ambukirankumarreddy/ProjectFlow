import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import { formatINR } from '../../utils/formatters';
import {
  Briefcase,
  TrendingUp,
  IndianRupee,
  Users2,
  PieChart as PieIcon,
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const ManagementDashboard: React.FC = () => {
  const { projects, users, orgSettings } = useApp();

  const totalPortfolioBudgetINR = projects.reduce((acc, p) => acc + (p.budgetINR || 0), 0);
  const totalEmployees = users.length;
  const avgProgress = Math.round(
    projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1)
  );

  const deptUtilizationData = [
    { department: '3D Art', utilization: 92, headcount: 2 },
    { department: 'Software', utilization: 88, headcount: 3 },
    { department: 'Hardware', utilization: 95, headcount: 2 },
    { department: 'Mechanical', utilization: 84, headcount: 2 },
    { department: 'Electrical', utilization: 78, headcount: 2 },
    { department: 'QA/HIL', utilization: 80, headcount: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl border bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-brand-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100">
                Executive Portfolio & Governance Hub
              </h2>
              <Badge variant="purple" size="sm">
                C-Suite Overview (INR)
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {orgSettings.name} • {projects.length} Active Enterprise Programs • {totalEmployees} Specialists • Domain: @{orgSettings.companyDomain}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Portfolio Valuation (INR)"
          value={formatINR(totalPortfolioBudgetINR)}
          subtitle="Total Contract Value"
          change="+18% YoY"
          isPositive={true}
          icon={IndianRupee}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          title="Avg Delivery Progress"
          value={`${avgProgress}%`}
          subtitle="On schedule across portfolio"
          icon={TrendingUp}
          iconColor="text-brand-400 bg-brand-500/10 border-brand-500/20"
        />
        <MetricCard
          title="Department Utilization"
          value="86.2%"
          subtitle="Balanced engineering capacity"
          icon={Users2}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
        <MetricCard
          title="Delivery Health"
          value="92 / 100"
          subtitle="1 Project with flagged procurement lead time"
          icon={ShieldAlert}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
      </div>

      {/* Department Utilization Bar Chart */}
      <div className="glass-card p-5 rounded-2xl border">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Departmental Capacity & Workload Allocation
            </h3>
            <p className="text-xs text-slate-400">
              Balancing Unity, 3D modelling, mechanical, electrical, and embedded hardware teams
            </p>
          </div>
          <Badge variant="info" size="sm">
            Target: 85-95%
          </Badge>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptUtilizationData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Bar dataKey="utilization" fill="#0e8ce9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects Portfolio Table */}
      <div className="glass-card p-5 rounded-2xl border">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">
            Portfolio Health & Contract Status
          </h3>
          <span className="text-xs text-slate-400 font-mono">{projects.length} Programs Tracked</span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Budget (INR)</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Risk Factor</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-sans">
                    <div className="font-bold text-slate-100">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.key} • {p.methodology}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-sans">{p.customer}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-400">
                    {formatINR(p.budgetINR)}
                  </td>
                  <td className="py-3.5 px-3 font-sans">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-slate-300 font-semibold font-mono">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`font-semibold ${
                        p.riskScore > 35 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {p.riskScore}% Risk
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-sans">
                    <Badge variant={p.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
