import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Briefcase,
  Layers,
  FolderKanban,
  Box,
  Flame,
  CheckSquare,
  Sparkles
} from 'lucide-react';

export const ProjectHierarchyTree: React.FC = () => {
  const { selectedProject, epics, tasks } = useApp();

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    org: true,
    portfolio: true,
    program: true,
    project: true,
    'mod-1': true,
    'mod-2': true,
    'mod-3': true,
    'mod-4': true,
    'epic-1': true,
    'epic-2': true,
  });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            Full Enterprise Project & Simulator WBS Hierarchy
          </h3>
          <p className="text-xs text-slate-400">
            Organization → Portfolio → Program → Project → Workstream Module → Epic → User Story / Task
          </p>
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl border font-mono text-xs text-slate-300 space-y-2 select-none overflow-x-auto custom-scrollbar">
        {/* Org Node */}
        <div className="space-y-1">
          <div
            onClick={() => toggleNode('org')}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer text-slate-100 font-bold"
          >
            {expandedNodes['org'] ? <ChevronDown className="w-4 h-4 text-brand-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Organization: AeroSim & Tactical Systems Ltd.</span>
            <Badge variant="purple" size="sm">Root Org</Badge>
          </div>

          {expandedNodes['org'] && (
            <div className="pl-6 border-l border-slate-800 space-y-1">
              {/* Portfolio Node */}
              <div
                onClick={() => toggleNode('portfolio')}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer font-bold text-slate-200"
              >
                {expandedNodes['portfolio'] ? <ChevronDown className="w-4 h-4 text-brand-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                <Briefcase className="w-4 h-4 text-brand-400" />
                <span>Portfolio: Defense & Land Combat Systems</span>
                <Badge variant="primary" size="sm">Portfolio</Badge>
              </div>

              {expandedNodes['portfolio'] && (
                <div className="pl-6 border-l border-slate-800 space-y-1">
                  {/* Program Node */}
                  <div
                    onClick={() => toggleNode('program')}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer font-bold text-slate-200"
                  >
                    {expandedNodes['program'] ? <ChevronDown className="w-4 h-4 text-brand-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    <FolderKanban className="w-4 h-4 text-cyan-400" />
                    <span>Program: Armored Vehicle Simulator Modernization</span>
                    <Badge variant="info" size="sm">Program</Badge>
                  </div>

                  {expandedNodes['program'] && (
                    <div className="pl-6 border-l border-slate-800 space-y-2">
                      {/* Project Node */}
                      <div
                        onClick={() => toggleNode('project')}
                        className="flex items-center gap-2 p-2 rounded-xl bg-brand-500/15 border border-brand-500/30 cursor-pointer font-bold text-slate-100"
                      >
                        {expandedNodes['project'] ? <ChevronDown className="w-4 h-4 text-brand-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                        <Box className="w-4 h-4 text-amber-400" />
                        <span>Project: {selectedProject?.name} ({selectedProject?.key})</span>
                        <Badge variant="warning" size="sm">{selectedProject?.progress}% Done</Badge>
                      </div>

                      {expandedNodes['project'] && (
                        <div className="pl-6 border-l border-slate-800 space-y-3 pt-1">
                          {selectedProject?.modules.map(module => {
                            const isModExpanded = !!expandedNodes[module.id];
                            const moduleEpics = epics.filter(e => e.moduleId === module.id);
                            const moduleTasks = tasks.filter(t => t.moduleId === module.id);

                            return (
                              <div key={module.id} className="space-y-1.5">
                                <div
                                  onClick={() => toggleNode(module.id)}
                                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                                    {isModExpanded ? <ChevronDown className="w-3.5 h-3.5 text-brand-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Module: {module.name}</span>
                                    <Badge variant="neutral" size="sm">[{module.workstream}]</Badge>
                                  </div>
                                  <span className="text-slate-400 font-semibold text-[11px]">{module.progress}%</span>
                                </div>

                                {isModExpanded && (
                                  <div className="pl-6 border-l border-slate-800 space-y-2">
                                    {/* Epics */}
                                    {moduleEpics.map(epic => {
                                      const isEpicExpanded = !!expandedNodes[epic.id];
                                      const epicTasks = tasks.filter(t => t.epicId === epic.id);

                                      return (
                                        <div key={epic.id} className="space-y-1">
                                          <div
                                            onClick={() => toggleNode(epic.id)}
                                            className="flex items-center gap-2 p-1.5 rounded-lg bg-purple-950/20 border border-purple-500/20 cursor-pointer text-purple-300 font-semibold text-xs"
                                          >
                                            {isEpicExpanded ? <ChevronDown className="w-3 h-3 text-purple-400" /> : <ChevronRight className="w-3 h-3 text-purple-500" />}
                                            <Flame className="w-3.5 h-3.5 text-purple-400" />
                                            <span>Epic: {epic.title}</span>
                                            <Badge variant="purple" size="sm">{epicTasks.length} Stories</Badge>
                                          </div>

                                          {isEpicExpanded && (
                                            <div className="pl-6 border-l border-slate-800 space-y-1 pt-1">
                                              {epicTasks.map(t => (
                                                <div
                                                  key={t.id}
                                                  className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] hover:border-slate-700"
                                                >
                                                  <div className="flex items-center gap-2 truncate">
                                                    <CheckSquare className="w-3 h-3 text-brand-400 shrink-0" />
                                                    <span className="text-slate-400">{t.key}:</span>
                                                    <span className="text-slate-200 truncate">{t.title}</span>
                                                  </div>
                                                  <Badge
                                                    variant={t.status === 'Completed' ? 'success' : t.status === 'Blocked' ? 'danger' : 'neutral'}
                                                    size="sm"
                                                  >
                                                    {t.status}
                                                  </Badge>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}

                                    {/* Direct Module Tasks if not grouped by epic */}
                                    {moduleTasks
                                      .filter(t => !t.epicId)
                                      .map(t => (
                                        <div
                                          key={t.id}
                                          className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800/80 text-[11px]"
                                        >
                                          <div className="flex items-center gap-2 truncate">
                                            <CheckSquare className="w-3 h-3 text-cyan-400 shrink-0" />
                                            <span className="text-slate-400">{t.key}:</span>
                                            <span className="text-slate-200 truncate">{t.title}</span>
                                          </div>
                                          <Badge
                                            variant={t.status === 'Completed' ? 'success' : t.status === 'Blocked' ? 'danger' : 'neutral'}
                                            size="sm"
                                          >
                                            {t.status}
                                          </Badge>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
