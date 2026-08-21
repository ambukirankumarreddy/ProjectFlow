import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import { formatINR, calculateGST } from '../../utils/formatters';
import {
  IndianRupee,
  TrendingUp,
  PieChart as PieIcon,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  Receipt
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

export const ProjectBudgetView: React.FC = () => {
  const { budget, selectedProject } = useApp();

  const categories = [
    { name: 'Hardware', planned: budget.hardwareCostINR, actual: 8500000, color: '#0e8ce9' },
    { name: 'Mechanical', planned: budget.mechanicalCostINR, actual: 7200000, color: '#f59e0b' },
    { name: 'Software', planned: budget.softwareCostINR, actual: 4800000, color: '#8b5cf6' },
    { name: 'Electrical', planned: budget.electricalCostINR, actual: 2800000, color: '#06b6d4' },
    { name: 'Procurement', planned: budget.procurementCostINR, actual: 4200000, color: '#10b981' },
    { name: 'Manpower', planned: budget.manpowerCostINR, actual: 2100000, color: '#ec4899' },
  ];

  const totalSpent = categories.reduce((acc, c) => acc + c.actual, 0);
  const remainingBudget = budget.totalBudgetINR - totalSpent;
  const burnRatePercent = Math.round((totalSpent / budget.totalBudgetINR) * 100);

  const { subtotal, gstAmount, grandTotal } = calculateGST(budget.totalBudgetINR, budget.gstPercentage || 18);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Budget & Financial Costing</span>
            <Badge variant="success" size="sm">
              Profitability Margin: 28.4%
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Planned vs actual expenditure across Hardware, Software, Mechanical, Electrical, Procurement and Manpower in Indian Rupees (₹)
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
          <Receipt className="w-4 h-4" />
          <span>GST Rate: 18% Inclusive</span>
        </div>
      </div>

      {/* KPI Cards in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Project Subtotal (Excl. GST)"
          value={formatINR(budget.totalBudgetINR)}
          subtitle="Fixed-Price Turnkey Program"
          icon={IndianRupee}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          title="Actual Incurred Spend"
          value={formatINR(totalSpent)}
          subtitle={`${burnRatePercent}% of total allocated`}
          icon={TrendingUp}
          iconColor="text-brand-400 bg-brand-500/10 border-brand-500/20"
        />
        <MetricCard
          title="Remaining Variance"
          value={formatINR(remainingBudget)}
          subtitle="Positive cashflow buffer"
          isPositive={true}
          change="On Target"
          icon={Award}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
        <MetricCard
          title="Grand Total (with 18% GST)"
          value={formatINR(grandTotal)}
          subtitle={`GST (18%): ${formatINR(gstAmount)}`}
          icon={CheckCircle2}
          iconColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />
      </div>

      {/* Planned vs Actual Spend Chart */}
      <div className="glass-card p-5 rounded-2xl border">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Planned vs Actual Expenditure by Engineering Stream
            </h3>
            <p className="text-xs text-slate-400">Values in Indian Rupees (₹)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded bg-slate-700 inline-block" /> Planned Budget (₹)
            </span>
            <span className="flex items-center gap-1.5 text-brand-400 font-bold">
              <span className="w-3 h-3 rounded bg-brand-500 inline-block" /> Actual Spend (₹)
            </span>
          </div>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickFormatter={val => `₹${(val / 100000).toFixed(0)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [formatINR(Number(val)), '']}
              />
              <Bar dataKey="planned" fill="#334155" radius={[4, 4, 0, 0]} name="Planned" />
              <Bar dataKey="actual" fill="#0e8ce9" radius={[4, 4, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disciplinary Cost Breakdown Table */}
      <div className="glass-card rounded-2xl border overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">
            Disciplinary Cost Variance Matrix
          </h3>
          <span className="text-xs text-slate-400 font-mono">Financial Year 2026-27</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Engineering Stream</th>
                <th className="py-3 px-4">Planned Allocation</th>
                <th className="py-3 px-4">Actual Spend</th>
                <th className="py-3 px-4">Variance (₹)</th>
                <th className="py-3 px-4">Consumption Rate</th>
                <th className="py-3 px-4">Financial Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {categories.map((c, i) => {
                const variance = c.planned - c.actual;
                const percent = Math.round((c.actual / c.planned) * 100);
                return (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-200">{c.name} Stream</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {formatINR(c.planned)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      {formatINR(c.actual)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      +{formatINR(variance)}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-brand-500 h-full rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-300 font-mono">{percent}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <Badge variant={percent < 90 ? 'success' : 'warning'} size="sm">
                        {percent < 90 ? 'Within Budget' : 'Near Threshold'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
