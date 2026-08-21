import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Shield, ChevronDown, Check, Sparkles, User, Briefcase, Code, CheckCircle, Eye, Cpu } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { activeRole, switchRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roles: { role: UserRole; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      role: 'Super Admin',
      icon: <Shield className="w-4 h-4 text-purple-400" />,
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      desc: 'Full platform governance, security & orgs',
    },
    {
      role: 'Organization Admin',
      icon: <Briefcase className="w-4 h-4 text-blue-400" />,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      desc: 'Departments, team settings & workflows',
    },
    {
      role: 'Project Manager',
      icon: <User className="w-4 h-4 text-brand-400" />,
      color: 'bg-brand-500/20 text-brand-300 border-brand-500/40',
      desc: 'Sprints, tasks, budget & resource planning',
    },
    {
      role: 'Team Lead',
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      desc: 'Review work, approve tasks & team workload',
    },
    {
      role: 'Developer/Member',
      icon: <Code className="w-4 h-4 text-cyan-400" />,
      color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      desc: 'My Work, active timer, task updates',
    },
    {
      role: 'QA/Reviewer',
      icon: <Check className="w-4 h-4 text-amber-400" />,
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      desc: 'Test cases, HIL verification & bug reporting',
    },
    {
      role: 'Client/Viewer',
      icon: <Eye className="w-4 h-4 text-slate-400" />,
      color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
      desc: 'View permitted milestones, roadmap & reports',
    },
    {
      role: 'AI Agent',
      icon: <Cpu className="w-4 h-4 text-pink-400" />,
      color: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      desc: 'Autonomous planning, risk alerts & generators',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRoleInfo = roles.find(r => r.role === activeRole) || roles[2];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm ${currentRoleInfo.color}`}
        title="Switch active user role for permission testing"
      >
        <span className="flex items-center gap-1.5">
          {currentRoleInfo.icon}
          <span className="hidden md:inline text-slate-400 font-normal">Role:</span>
          <span>{activeRole}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Role-Based Access (RBAC)
            </span>
            <span className="text-[10px] text-slate-500">8 Roles Available</span>
          </div>

          <div className="py-1 max-h-96 overflow-y-auto custom-scrollbar">
            {roles.map(item => {
              const isSelected = item.role === activeRole;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                    isSelected
                      ? 'bg-brand-500/20 border border-brand-500/30 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5 p-1 rounded-lg bg-slate-800/80">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">
                        {item.role}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-brand-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/40 rounded-b-xl text-[10px] text-slate-400 text-center">
            Switching instantly adapts permissions, buttons & visible workflows
          </div>
        </div>
      )}
    </div>
  );
};
