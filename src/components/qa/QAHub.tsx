import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestCase, Bug, TaskPriority } from '../../types';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import { Modal } from '../common/Modal';
import {
  Bug as BugIcon,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Plus,
  Play,
  FileCheck,
  Search,
  Check,
  RefreshCw
} from 'lucide-react';

export const QAHub: React.FC = () => {
  const { testCases, updateTestCaseStatus, bugs, addBug, updateBug, users, currentUser, selectedProject, projects } = useApp();
  const [activeTab, setActiveTab] = useState<'tests' | 'bugs'>('tests');
  const [search, setSearch] = useState('');
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  // New bug state
  const [bugTitle, setBugTitle] = useState('');
  const [bugEnvironment, setBugEnvironment] = useState('Hardware / Simulation Rig');
  const [buildVersion, setBuildVersion] = useState('v1.0.0-rc1');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [severity, setSeverity] = useState<Bug['severity']>('Major');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [assignedDevId, setAssignedDevId] = useState(() => users[0]?.id || '');

  const passedCount = testCases.filter(t => t.executionStatus === 'passed').length;
  const failedCount = testCases.filter(t => t.executionStatus === 'failed').length;
  const blockedCount = testCases.filter(t => t.executionStatus === 'blocked').length;
  const openBugsCount = bugs.filter(b => b.status !== 'Completed').length;

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle) return;

    const newBug: Bug = {
      id: `bug-${Date.now()}`,
      key: `${selectedProject?.key || 'BUG'}-BUG-${bugs.length + 1}`,
      title: bugTitle,
      environment: bugEnvironment,
      buildVersion,
      stepsToReproduce: steps,
      expectedResult: expected,
      actualResult: actual,
      severity,
      priority,
      assignedDeveloperId: assignedDevId,
      retestStatus: 'Pending',
      status: 'In Progress',
      projectId: selectedProject?.id || projects[0]?.id || '',
    };

    addBug(newBug);
    setIsBugModalOpen(false);
    setBugTitle('');
    setSteps('');
    setExpected('');
    setActual('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Quality Assurance & Defect Engine</span>
            <Badge variant="success" size="sm">
              HIL Acceptance Ready
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hardware-in-the-loop test suite execution, regression cycles, and mil-spec defect lifecycle
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tests'
                  ? 'bg-brand-500 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Test Suites ({testCases.length})
            </button>
            <button
              onClick={() => setActiveTab('bugs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bugs'
                  ? 'bg-brand-500 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bug Tracker ({openBugsCount} Open)
            </button>
          </div>

          <button
            onClick={() => setIsBugModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Report Bug</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Tests Passed"
          value={`${passedCount} / ${testCases.length}`}
          subtitle={`${Math.round((passedCount / (testCases.length || 1)) * 100)}% Pass Rate`}
          icon={CheckCircle}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          title="Active Bug Defects"
          value={openBugsCount}
          subtitle="1 Major blocker on motion base"
          icon={BugIcon}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />
        <MetricCard
          title="Blocked Test Plans"
          value={blockedCount}
          subtitle="Waiting on Moog valve delivery"
          icon={AlertOctagon}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <MetricCard
          title="HIL Coverage"
          value="91.5%"
          subtitle="Hardware & Ballistics certified"
          icon={FileCheck}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Main Tab Content */}
      {activeTab === 'tests' ? (
        <div className="glass-card rounded-2xl border overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand-400" />
              Automated & Manual Test Case Execution
            </h3>
            <span className="text-xs text-slate-400">Click pass/fail to record results</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {testCases.map(tc => (
              <div key={tc.id} className="p-4 hover:bg-slate-800/30 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-xs">{tc.title}</span>
                    <Badge variant="purple" size="sm">
                      {tc.type}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {tc.suite}
                    </Badge>
                  </div>

                  {/* Execution Action Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => updateTestCaseStatus(tc.id, 'passed')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        tc.executionStatus === 'passed'
                          ? 'bg-emerald-500 text-white shadow-glow-emerald'
                          : 'bg-slate-800 text-slate-400 hover:text-emerald-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Pass</span>
                    </button>

                    <button
                      onClick={() => updateTestCaseStatus(tc.id, 'failed')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        tc.executionStatus === 'failed'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-rose-300'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Fail</span>
                    </button>

                    <button
                      onClick={() => updateTestCaseStatus(tc.id, 'blocked')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        tc.executionStatus === 'blocked'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-amber-300'
                      }`}
                    >
                      <AlertOctagon className="w-3 h-3" />
                      <span>Block</span>
                    </button>
                  </div>
                </div>

                {/* Steps and Expected Result */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Execution Steps:</span>
                    <ol className="list-decimal list-inside text-slate-300 space-y-0.5">
                      {tc.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Expected Result:</span>
                    <p className="text-emerald-300 leading-snug">{tc.expectedResult}</p>
                    {tc.defectId && (
                      <div className="mt-2 text-rose-400 flex items-center gap-1">
                        <BugIcon className="w-3 h-3" />
                        <span>Linked Defect: {tc.defectId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Bug Tracker Table */
        <div className="glass-card rounded-2xl border overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BugIcon className="w-4 h-4 text-rose-400" />
              Active Hardware & Software Defects
            </h3>
            <span className="text-xs text-slate-400">{bugs.length} Defects Logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Bug Key</th>
                  <th className="py-3 px-4">Title & Symptoms</th>
                  <th className="py-3 px-4">Environment</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Assigned Engineer</th>
                  <th className="py-3 px-4">Retest State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bugs.map(bug => {
                  const dev = users.find(u => u.id === bug.assignedDeveloperId);
                  return (
                    <tr key={bug.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">
                        {bug.key}
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-slate-200">{bug.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {bug.actualResult}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <div>{bug.environment}</div>
                        <div className="text-[10px] text-slate-500">{bug.buildVersion}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant={
                            bug.severity === 'Critical' || bug.severity === 'Blocker'
                              ? 'danger'
                              : bug.severity === 'Major'
                              ? 'warning'
                              : 'info'
                          }
                          size="sm"
                        >
                          {bug.severity}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {dev ? (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={dev.avatar}
                              alt={dev.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-slate-300">{dev.name.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant={
                            bug.retestStatus === 'Verified'
                              ? 'success'
                              : bug.retestStatus === 'Retesting'
                              ? 'info'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {bug.retestStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() =>
                            updateBug({
                              ...bug,
                              retestStatus: 'Verified',
                              status: 'Completed',
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Verify Fix</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Bug Modal */}
      {isBugModalOpen && (
        <Modal
          isOpen={isBugModalOpen}
          onClose={() => setIsBugModalOpen(false)}
          title="Report Engineering Defect / Bug"
          subtitle="Log reproduction steps, environment details & assign to developer"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateBug} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Defect Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Hydraulic servo oscillation during rapid turret slew"
                value={bugTitle}
                onChange={e => setBugTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Environment</label>
                <input
                  type="text"
                  value={bugEnvironment}
                  onChange={e => setBugEnvironment(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Build Version</label>
                <input
                  type="text"
                  value={buildVersion}
                  onChange={e => setBuildVersion(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                >
                  <option value="Trivial">Trivial</option>
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Critical">Critical</option>
                  <option value="Blocker">Blocker</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Developer</label>
                <select
                  value={assignedDevId}
                  onChange={e => setAssignedDevId(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Steps to Reproduce</label>
              <textarea
                rows={2}
                value={steps}
                onChange={e => setSteps(e.target.value)}
                placeholder="1. Power on simulator&#10;2. Slew turret 180 deg..."
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expected Result</label>
                <textarea
                  rows={2}
                  value={expected}
                  onChange={e => setExpected(e.target.value)}
                  placeholder="Smooth continuous damping..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Actual Result</label>
                <textarea
                  rows={2}
                  value={actual}
                  onChange={e => setActual(e.target.value)}
                  placeholder="Platform vibration at 14Hz..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBugModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm"
              >
                Submit Bug Report
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
