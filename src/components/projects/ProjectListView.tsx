import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectHierarchyTree } from './ProjectHierarchyTree';
import { Badge } from '../common/Badge';
import { formatINR } from '../../utils/formatters';
import {
  FolderKanban,
  Plus,
  Layers,
  Calendar,
  IndianRupee,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';

export const ProjectListView: React.FC<{ onOpenCreateProject: () => void }> = ({
  onOpenCreateProject,
}) => {
  const { projects, selectedProjectId, setSelectedProjectId, setCurrentView } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'cards' | 'hierarchy'>('cards');
  const [search, setSearch] = useState('');

  const filtered = projects.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.key.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Projects & Simulator Programs</span>
            <Badge variant="primary" size="sm">
              {projects.length} Active
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage multi-disciplinary programs, stage-gate deliverables, and simulator workstream modules in Indian Rupees (₹)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'cards'
                  ? 'bg-brand-500 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Programs List
            </button>
            <button
              onClick={() => setActiveSubTab('hierarchy')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'hierarchy'
                  ? 'bg-brand-500 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              WBS Hierarchy Tree
            </button>
          </div>

          <button
            onClick={onOpenCreateProject}
            className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'hierarchy' ? (
        <ProjectHierarchyTree />
      ) : (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search projects by name, key, or customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(project => {
              const isSelected = project.id === selectedProjectId;
              return (
                <div
                  key={project.id}
                  className={`glass-card p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    isSelected ? 'border-brand-500/60 ring-1 ring-brand-500/30' : ''
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Key, Methodology, Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 font-extrabold text-xs flex items-center justify-center border border-brand-500/30">
                          {project.key}
                        </span>
                        <Badge variant="neutral" size="sm">
                          {project.methodology}
                        </Badge>
                      </div>

                      <Badge
                        variant={
                          project.status === 'Active'
                            ? 'success'
                            : project.status === 'Planning'
                            ? 'info'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {project.status}
                      </Badge>
                    </div>

                    {/* Title & Customer */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-100 line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Client: <strong className="text-slate-300">{project.customer}</strong>
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Milestone Delivery</span>
                        <span className="text-brand-400 font-mono">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Workstreams Tags */}
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                        Workstreams ({project.workstreams?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.workstreams?.slice(0, 6).map(ws => (
                          <span
                            key={ws}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {ws}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats & Open Button */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Contract Budget</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {formatINR(project.budgetINR)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Risk Score</span>
                        <span
                          className={`font-bold font-mono ${
                            project.riskScore > 35 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {project.riskScore}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setCurrentView('kanban');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Open Board</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
