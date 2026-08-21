import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { formatINR, calculateManpowerCost } from '../../utils/formatters';
import {
  Users,
  Network,
  Building2,
  Briefcase,
  UserCheck,
  GitBranch,
  Shield,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { User, ProjectAllocation } from '../../types';

export const ManpowerHub: React.FC = () => {
  const { users, teams, projects, selectedProject } = useApp();

  const [activeTab, setActiveTab] = useState<
    'org_tree' | 'dept_tree' | 'project_tree' | 'allocations' | 'approval_matrix'
  >('org_tree');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('usr-2'); // Vikram Malhotra by default
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEmployee = users.find(u => u.id === selectedEmployeeId) || users[0];

  // Helper to find a user by ID
  const getUserById = (id?: string) => users.find(u => u.id === id);

  // Group users by department
  const departmentsList = Array.from(new Set(users.map(u => u.department)));

  // Calculate total allocation percentage for an employee
  const getTotalAllocation = (user: User) => {
    return user.projectAllocations.reduce((acc, curr) => acc + curr.allocationPercentage, 0);
  };

  // Get status badge for allocation %
  const getAllocationBadge = (total: number, status: string) => {
    if (status === 'On Leave') return <Badge variant="primary" size="sm">On Leave</Badge>;
    if (status === 'Deactivated') return <Badge variant="neutral" size="sm">Deactivated</Badge>;
    if (total === 0) return <Badge variant="neutral" size="sm">0% (Unallocated)</Badge>;
    if (total > 100) return <Badge variant="danger" size="sm">{total}% (Overloaded)</Badge>;
    if (total > 80) return <Badge variant="warning" size="sm">{total}% (High Load)</Badge>;
    return <Badge variant="success" size="sm">{total}% (Optimal)</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Manpower & Organization Reporting Tree</span>
            <Badge variant="purple" size="sm">
              3-Tier Architecture
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Functional, Project, and Administrative reporting hierarchies with multi-project allocation in Indian Rupees (₹)
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto custom-scrollbar self-start md:self-auto">
          <button
            onClick={() => setActiveTab('org_tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'org_tree'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Company Tree</span>
          </button>

          <button
            onClick={() => setActiveTab('dept_tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'dept_tree'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Departments</span>
          </button>

          <button
            onClick={() => setActiveTab('project_tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'project_tree'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Project Tree</span>
          </button>

          <button
            onClick={() => setActiveTab('allocations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'allocations'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Multi-Project Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('approval_matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'approval_matrix'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Approval Chain</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tree / Content (Left 8 cols) + Employee 360° Inspector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side View */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: Company Organization Tree */}
          {activeTab === 'org_tree' && (
            <div className="glass-card p-6 rounded-3xl border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Edgeforce Company Organization Hierarchy
                  </h3>
                </div>
                <Badge variant="success" size="sm">
                  Functional Reporting
                </Badge>
              </div>

              {/* Tree Visual Levels */}
              <div className="space-y-6">
                {/* Level 1: Managing Director */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => setSelectedEmployeeId('usr-md')}
                    className={`p-4 rounded-2xl border cursor-pointer max-w-sm w-full transition-all text-center space-y-2 ${
                      selectedEmployeeId === 'usr-md'
                        ? 'bg-purple-950/40 border-purple-500 shadow-glow-brand ring-2 ring-purple-500/50'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={getUserById('usr-md')?.avatar}
                      alt="MD"
                      className="w-12 h-12 rounded-full mx-auto ring-2 ring-purple-500/50 object-cover"
                    />
                    <div>
                      <div className="text-xs font-black text-slate-100">{getUserById('usr-md')?.name}</div>
                      <div className="text-[11px] text-purple-300 font-semibold">{getUserById('usr-md')?.designation}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Cost: {formatINR(getUserById('usr-md')?.monthlySalaryINR || 0)} / mo</div>
                    </div>
                    <Badge variant="purple" size="sm">Managing Director / Super Admin</Badge>
                  </div>

                  {/* Connector Line */}
                  <div className="w-0.5 h-6 bg-slate-700 my-1" />

                  {/* Level 2: Delivery Head */}
                  <div
                    onClick={() => setSelectedEmployeeId('usr-1')}
                    className={`p-3.5 rounded-2xl border cursor-pointer max-w-sm w-full transition-all text-center space-y-1.5 ${
                      selectedEmployeeId === 'usr-1'
                        ? 'bg-brand-950/40 border-brand-500 shadow-glow-brand ring-2 ring-brand-500/50'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={getUserById('usr-1')?.avatar}
                      alt="Delivery Head"
                      className="w-10 h-10 rounded-full mx-auto ring-2 ring-brand-500/50 object-cover"
                    />
                    <div>
                      <div className="text-xs font-black text-slate-100">{getUserById('usr-1')?.name}</div>
                      <div className="text-[11px] text-brand-300 font-semibold">{getUserById('usr-1')?.designation}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Cost: {formatINR(getUserById('usr-1')?.monthlySalaryINR || 0)} / mo</div>
                    </div>
                    <Badge variant="primary" size="sm">Delivery Head & Principal PM</Badge>
                  </div>

                  {/* Connector Line */}
                  <div className="w-0.5 h-6 bg-slate-700 my-1" />

                  {/* Level 3: Department Heads */}
                  <div className="w-full">
                    <div className="text-center text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">
                      Department Heads & Discipline Leads
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {users
                        .filter(u => ['usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-7'].includes(u.id))
                        .map(dh => {
                          const isSelected = selectedEmployeeId === dh.id;
                          return (
                            <div
                              key={dh.id}
                              onClick={() => setSelectedEmployeeId(dh.id)}
                              className={`p-3 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                                isSelected
                                  ? 'bg-brand-950/40 border-brand-400 shadow-glow-brand ring-1 ring-brand-400'
                                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={dh.avatar}
                                  alt={dh.name}
                                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700"
                                />
                                <div>
                                  <div className="text-xs font-bold text-slate-100">{dh.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{dh.department}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/80">
                                <span className="text-slate-400 font-mono">{formatINR(dh.monthlySalaryINR)}</span>
                                {getAllocationBadge(getTotalAllocation(dh), dh.status)}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Department Tree */}
          {activeTab === 'dept_tree' && (
            <div className="glass-card p-6 rounded-3xl border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Employees by Multidisciplinary Departments
                  </h3>
                </div>
                <Badge variant="primary" size="sm">
                  {departmentsList.length} Departments
                </Badge>
              </div>

              <div className="space-y-4">
                {departmentsList.map(dept => {
                  const deptUsers = users.filter(u => u.department === dept);
                  return (
                    <div key={dept} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
                          <h4 className="text-xs font-extrabold text-slate-200">{dept}</h4>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {deptUsers.length} Specialists
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {deptUsers.map(u => (
                          <div
                            key={u.id}
                            onClick={() => setSelectedEmployeeId(u.id)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              selectedEmployeeId === u.id
                                ? 'bg-brand-950/40 border-brand-400 ring-1 ring-brand-400'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                              <div>
                                <div className="text-xs font-bold text-slate-200">{u.name}</div>
                                <div className="text-[10px] text-slate-400">{u.designation}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {formatINR(u.monthlySalaryINR)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Project Manpower Tree */}
          {activeTab === 'project_tree' && (
            <div className="glass-card p-6 rounded-3xl border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Project Manpower Reporting Tree: <strong className="text-brand-400">[{selectedProject?.name}]</strong>
                  </h3>
                </div>
                <Badge variant="purple" size="sm">
                  Project Reporting
                </Badge>
              </div>

              {/* Project Tree Hierarchy */}
              <div className="space-y-4 text-xs">
                {/* Project Manager */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-brand-500/40 flex items-center justify-between shadow-glow-brand">
                  <div className="flex items-center gap-3">
                    <img
                      src={getUserById(selectedProject?.projectManagerId)?.avatar}
                      alt="PM"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/50"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-100">
                        {getUserById(selectedProject?.projectManagerId)?.name}
                      </div>
                      <div className="text-[11px] text-brand-300">Project Manager & Contract Sign-off</div>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">Level 1 - Program Head</Badge>
                </div>

                {/* Sub-tree branches */}
                <div className="pl-6 border-l-2 border-slate-800 space-y-4">
                  {/* Discipline Leads & Developers */}
                  {selectedProject?.modules.map(mod => {
                    const lead = getUserById(mod.leadId);
                    const engineers = users.filter(u =>
                      u.projectAllocations.some(
                        pa => pa.projectId === selectedProject.id && pa.moduleLeadId === mod.id && u.id !== mod.leadId
                      )
                    );

                    return (
                      <div key={mod.id} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                              {mod.workstream}
                            </span>
                            <span className="font-bold text-slate-200">{mod.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Budget: {formatINR(mod.budgetINR || 0)}
                          </span>
                        </div>

                        {/* Module Lead */}
                        {lead && (
                          <div
                            onClick={() => setSelectedEmployeeId(lead.id)}
                            className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
                          >
                            <div className="flex items-center gap-2">
                              <img src={lead.avatar} alt={lead.name} className="w-6 h-6 rounded-lg object-cover" />
                              <span className="font-semibold text-slate-200">{lead.name}</span>
                              <span className="text-[10px] text-slate-400">({lead.designation})</span>
                            </div>
                            <Badge variant="warning" size="sm">Module Lead</Badge>
                          </div>
                        )}

                        {/* Assigned Engineers under Lead */}
                        {engineers.length > 0 && (
                          <div className="pl-4 border-l border-slate-800 space-y-1.5 pt-1">
                            {engineers.map(eng => (
                              <div
                                key={eng.id}
                                onClick={() => setSelectedEmployeeId(eng.id)}
                                className="p-2 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 text-[11px]"
                              >
                                <div className="flex items-center gap-2">
                                  <img src={eng.avatar} alt={eng.name} className="w-5 h-5 rounded-md object-cover" />
                                  <span className="text-slate-300">{eng.name}</span>
                                </div>
                                <span className="text-slate-400 font-mono">
                                  {eng.projectAllocations.find(p => p.projectId === selectedProject.id)?.allocationPercentage}% Allocation
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Multi-Project Allocation Matrix */}
          {activeTab === 'allocations' && (
            <div className="glass-card p-6 rounded-3xl border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Employee Multi-Project Allocation Matrix & Workload
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> ≤80% Optimal
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> 81-100% Full
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> &gt;100% Overloaded
                  </span>
                </div>
              </div>

              {/* Allocations Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Employee</th>
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3">BMP-II Simulator</th>
                      <th className="py-3 px-3">Drone Swarm</th>
                      <th className="py-3 px-3">Total Load</th>
                      <th className="py-3 px-3">Monthly Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users
                      .filter(u => u.role !== 'AI Agent' && u.role !== 'Client/Viewer')
                      .map(u => {
                        const total = getTotalAllocation(u);
                        const bmpAlloc = u.projectAllocations.find(p => p.projectId === 'proj-1')?.allocationPercentage || 0;
                        const droneAlloc = u.projectAllocations.find(p => p.projectId === 'proj-2')?.allocationPercentage || 0;

                        return (
                          <tr
                            key={u.id}
                            onClick={() => setSelectedEmployeeId(u.id)}
                            className={`cursor-pointer transition-colors ${
                              selectedEmployeeId === u.id ? 'bg-brand-950/30' : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-lg object-cover" />
                                <div>
                                  <div className="font-bold text-slate-200">{u.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{u.employeeId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-300 text-[11px]">{u.department}</td>
                            <td className="py-3 px-3 font-mono text-[11px]">
                              {bmpAlloc > 0 ? (
                                <span className="font-bold text-brand-300">{bmpAlloc}%</span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px]">
                              {droneAlloc > 0 ? (
                                <span className="font-bold text-purple-300">{droneAlloc}%</span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              {getAllocationBadge(total, u.status)}
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                              {formatINR(u.monthlySalaryINR)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Approval Routing Chain */}
          {activeTab === 'approval_matrix' && (
            <div className="glass-card p-6 rounded-3xl border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Enterprise Multi-Stage Approval Routing Chain
                  </h3>
                </div>
                <Badge variant="success" size="sm">
                  Configured SLAs
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                {[
                  { request: 'Task Completion Sign-off', first: 'Team Lead', final: 'Project Lead', sla: '24 Hours' },
                  { request: 'Timesheet & Hour Approvals', first: 'Project Lead', final: 'Project Manager', sla: 'Weekly (Friday)' },
                  { request: 'Employee Leave & Attendance', first: 'Reporting Manager', final: 'Department Head', sla: '48 Hours' },
                  { request: 'Project Expenses & Travel', first: 'Project Manager', final: 'Finance Directorate', sla: '3 Days' },
                  { request: 'Procurement PO & BOM Items', first: 'Project Manager', final: 'Organization Admin', sla: '48 Hours' },
                  { request: 'Technical Change Requests', first: 'Project Lead', final: 'Project Manager / Client', sla: '5 Days' },
                  { request: 'Overtime Work Authorization', first: 'Team Lead', final: 'Department Head', sla: '24 Hours' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{item.request}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>1st Approver: <strong className="text-brand-300">{item.first}</strong></span>
                        <span>→</span>
                        <span>Final Sign-off: <strong className="text-purple-300">{item.final}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] text-slate-400 font-mono">SLA: {item.sla}</span>
                      <Badge variant="neutral" size="sm">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Employee 360° Profile Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-3xl border space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Employee 360° Profile
              </span>
              <Badge variant="primary" size="sm">
                {selectedEmployee.role}
              </Badge>
            </div>

            {/* Profile Avatar & Title */}
            <div className="text-center space-y-2">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-20 h-20 rounded-3xl mx-auto object-cover ring-4 ring-brand-500/30 shadow-glow-brand"
              />
              <div>
                <h4 className="text-base font-extrabold text-slate-100 flex items-center justify-center gap-1.5">
                  <span>{selectedEmployee.name}</span>
                  {selectedEmployee.isGoogleVerified && (
                    <span title="Google Verified">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </span>
                  )}
                </h4>
                <p className="text-xs text-brand-300 font-medium">{selectedEmployee.designation}</p>
                <p className="text-[11px] text-slate-400">{selectedEmployee.department}</p>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {selectedEmployee.employeeId} • {selectedEmployee.googleEmail || selectedEmployee.email}
                </div>
              </div>
            </div>

            {/* 3-Tier Reporting Relationships */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                3-Tier Reporting Matrix
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Functional Manager:</span>
                <span className="font-bold text-slate-200">
                  {getUserById(selectedEmployee.functionalManagerId)?.name || 'Direct to Board'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Department Head:</span>
                <span className="font-bold text-slate-200">
                  {getUserById(selectedEmployee.departmentHeadId)?.name || 'Self / Direct'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Admin (Leave/Appraisal):</span>
                <span className="font-bold text-slate-200">
                  {getUserById(selectedEmployee.administrativeManagerId)?.name || 'Self'}
                </span>
              </div>
            </div>

            {/* Financial Parameters in Indian Rupees (INR) */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Costing in Indian Rupees
                </span>
                <Badge variant="purple" size="sm">INR (₹)</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Monthly Cost</div>
                  <div className="text-xs font-bold text-slate-100 font-mono">
                    {formatINR(selectedEmployee.monthlySalaryINR)}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Hourly Cost</div>
                  <div className="text-xs font-bold text-slate-100 font-mono">
                    {formatINR(selectedEmployee.hourlyCostINR)}
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-Project Allocation Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Project Allocations:</span>
                <span>{getAllocationBadge(getTotalAllocation(selectedEmployee), selectedEmployee.status)}</span>
              </div>

              {selectedEmployee.projectAllocations.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No active project assignments.</p>
              ) : (
                <div className="space-y-2">
                  {selectedEmployee.projectAllocations.map((alloc, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 text-[11px] truncate max-w-[170px]">
                          {alloc.projectName}
                        </span>
                        <span className="font-mono font-bold text-brand-400 text-[11px]">
                          {alloc.allocationPercentage}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Role: {alloc.projectRole}</span>
                        <span>{formatINR(alloc.monthlyCostINR)}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">Skills & Competencies:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEmployee.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
