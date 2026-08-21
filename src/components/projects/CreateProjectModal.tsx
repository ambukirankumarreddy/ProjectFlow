import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, MethodologyType, WorkstreamType } from '../../types';
import { Modal } from '../common/Modal';
import { formatINR } from '../../utils/formatters';
import { FolderPlus, Sparkles, Layers, IndianRupee, Calendar, Shield } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject, users, currentUser } = useApp();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [customer, setCustomer] = useState('');
  const [methodology, setMethodology] = useState<MethodologyType>('Hybrid');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [budgetINR, setBudgetINR] = useState('54000000');
  const [selectedStreams, setSelectedStreams] = useState<WorkstreamType[]>([
    'Software',
    '3D Modelling',
    'Hardware',
    'Mechanical',
    'Electrical',
    'Testing',
    'Integration'
  ]);

  const allWorkstreams: WorkstreamType[] = [
    'Software',
    '3D Modelling',
    'Hardware',
    'Mechanical',
    'Electrical',
    'Procurement',
    'Integration',
    'Testing',
    'Deployment',
  ];

  const toggleStream = (stream: WorkstreamType) => {
    if (selectedStreams.includes(stream)) {
      setSelectedStreams(selectedStreams.filter(s => s !== stream));
    } else {
      setSelectedStreams([...selectedStreams, stream]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      key: key.toUpperCase(),
      name,
      description,
      customer: customer || 'Ministry of Defense India',
      projectManagerId: currentUser.id,
      department: 'Engineering & Simulation',
      startDate,
      endDate,
      priority: 'High',
      status: 'Active',
      budgetINR: Number(budgetINR) || 10000000,
      gstPercentage: 18,
      currency: 'INR',
      methodology,
      tags: ['New Program', methodology, ...selectedStreams.slice(0, 2)],
      workstreams: selectedStreams,
      modules: selectedStreams.map((ws, i) => ({
        id: `mod-${Date.now()}-${i}`,
        projectId: `proj-${Date.now()}`,
        name: `${ws} Workstream Module`,
        workstream: ws,
        description: `Initial delivery pipeline for ${ws}`,
        progress: 0,
        status: 'Planned',
        leadId: currentUser.id,
        targetCompletionDate: endDate,
        budgetINR: Math.round((Number(budgetINR) || 10000000) / (selectedStreams.length || 1)),
      })),
      progress: 0,
      riskScore: 10,
    };

    addProject(newProj);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Enterprise Project"
      subtitle="Configure project methodology, multi-disciplinary workstreams & budget in Indian Rupees (₹)"
      maxWidth="2xl"
    >
      <form onSubmit={handleCreate} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Autonomous Flight Control Suite"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (!key) {
                  const generated = e.target.value
                    .split(' ')
                    .map(w => w[0])
                    .join('')
                    .substring(0, 4)
                    .toUpperCase();
                  setKey(generated);
                }
              }}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Project Key *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. AFCS"
              value={key}
              onChange={e => setKey(e.target.value.toUpperCase())}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono uppercase font-bold text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Description & Program Scope
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            placeholder="Outline objectives, deliverables, and engineering scope..."
            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Customer / Sponsor</label>
            <input
              type="text"
              placeholder="e.g. Ministry of Defense / Armored Corps"
              value={customer}
              onChange={e => setCustomer(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Methodology</label>
            <select
              value={methodology}
              onChange={e => setMethodology(e.target.value as MethodologyType)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            >
              <option value="Hybrid">Hybrid (Agile + Stage-Gate)</option>
              <option value="Scrum">Scrum (Sprints & Velocity)</option>
              <option value="Kanban">Kanban (Continuous Flow)</option>
              <option value="Waterfall">Waterfall (Sequential)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Delivery Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Budget (₹ INR)</label>
            <input
              type="number"
              value={budgetINR}
              onChange={e => setBudgetINR(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Multi-Disciplinary Workstreams Checkboxes */}
        <div>
          <label className="block text-slate-300 font-semibold mb-2">
            Active Simulator Workstreams:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allWorkstreams.map(ws => {
              const checked = selectedStreams.includes(ws);
              return (
                <button
                  type="button"
                  key={ws}
                  onClick={() => toggleStream(ws)}
                  className={`p-2 rounded-xl text-left border flex items-center justify-between text-xs transition-colors ${
                    checked
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <span>{ws}</span>
                  <span className={`w-2 h-2 rounded-full ${checked ? 'bg-brand-400' : 'bg-slate-700'}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
