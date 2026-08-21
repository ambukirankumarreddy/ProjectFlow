import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, CheckSquare, Folder, FileText, Cpu, Users, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { tasks, projects, requirements, bomItems, users, setCurrentView, setSelectedProjectId } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = query
    ? tasks.filter(
        t =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.key.toLowerCase().includes(query.toLowerCase()) ||
          t.workstream.toLowerCase().includes(query.toLowerCase())
      )
    : tasks.slice(0, 4);

  const filteredProjects = query
    ? projects.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.key.toLowerCase().includes(query.toLowerCase()) ||
          p.customer.toLowerCase().includes(query.toLowerCase())
      )
    : projects;

  const filteredReqs = query
    ? requirements.filter(
        r =>
          r.description.toLowerCase().includes(query.toLowerCase()) ||
          r.rfpReference.toLowerCase().includes(query.toLowerCase())
      )
    : requirements.slice(0, 2);

  const filteredBOM = query
    ? bomItems.filter(
        b =>
          b.description.toLowerCase().includes(query.toLowerCase()) ||
          b.itemCode.toLowerCase().includes(query.toLowerCase())
      )
    : bomItems.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl bg-[#0d1527] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/80">
          <Search className="w-5 h-5 text-brand-400 mr-3" />
          <input
            type="text"
            placeholder="Search tasks, RFP requirements, BOM parts, projects, or team..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-md mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-brand-400" />
                Projects
              </div>
              <div className="space-y-1">
                {filteredProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setCurrentView('projects');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-800/70 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-xs border border-brand-500/30">
                        {p.key}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-brand-300">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p.customer} • {p.workstreams.length} Workstreams
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Tasks & Simulator Workstreams
              </div>
              <div className="space-y-1">
                {filteredTasks.map(t => {
                  const assignee = users.find(u => u.id === t.assigneeId);
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setCurrentView('tasks');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-800/70 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Badge variant="neutral" size="sm">
                          {t.key}
                        </Badge>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-brand-300 truncate">
                            {t.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{t.workstream}</span>
                            <span>•</span>
                            <span>{t.status}</span>
                            {assignee && (
                              <>
                                <span>•</span>
                                <span>{assignee.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          t.status === 'Completed'
                            ? 'success'
                            : t.status === 'Blocked'
                            ? 'danger'
                            : t.status === 'In Progress'
                            ? 'primary'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {t.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Requirements */}
          {filteredReqs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                RFP Requirements & Traceability
              </div>
              <div className="space-y-1">
                {filteredReqs.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setCurrentView('requirements');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-800/70 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Badge variant="purple" size="sm">
                        {r.rfpReference}
                      </Badge>
                      <div className="text-xs text-slate-300 group-hover:text-purple-300 line-clamp-1">
                        {r.description}
                      </div>
                    </div>
                    <Badge
                      variant={r.complianceStatus === 'Compliant' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {r.complianceStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOM Items */}
          {filteredBOM.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Procurement / BOM Items
              </div>
              <div className="space-y-1">
                {filteredBOM.map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setCurrentView('procurement');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-800/70 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Badge variant="warning" size="sm">
                        {b.itemCode}
                      </Badge>
                      <div className="text-xs text-slate-300 group-hover:text-amber-300 line-clamp-1">
                        {b.description}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-400">
                      {b.unitPriceINR ? `₹${b.unitPriceINR.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 mr-1">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 mr-1">
                ↓
              </kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 mr-1">
                ↵
              </kbd>
              Select
            </span>
          </div>
          <span className="text-brand-400 font-medium">ProjectFlow AI Search</span>
        </div>
      </div>
    </div>
  );
};
