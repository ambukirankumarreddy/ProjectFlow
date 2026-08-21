import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, WorkstreamType, TaskPriority } from '../../types';
import { Modal } from '../common/Modal';
import { CheckSquare, ArrowRight, Sparkles, FolderKanban } from 'lucide-react';

interface ConvertMessageToTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
}

export const ConvertMessageToTaskModal: React.FC<ConvertMessageToTaskModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  const { projects, selectedProjectId, users, convertMessageToTask } = useApp();

  if (!message) return null;

  const [title, setTitle] = useState(
    message.text.split('\n')[0].replace(/[*#]/g, '').substring(0, 60) || 'Action item from chat'
  );
  const [projectId, setProjectId] = useState(selectedProjectId);
  const [workstream, setWorkstream] = useState<WorkstreamType>('Software');
  const [assigneeId, setAssigneeId] = useState(message.senderId !== 'usr-ai' ? message.senderId : users[1]?.id || 'usr-2');
  const [priority, setPriority] = useState<TaskPriority>('High');

  const workstreams: WorkstreamType[] = [
    'Software',
    '3D Modelling',
    'Hardware',
    'Mechanical',
    'Electrical',
    'Testing',
    'Integration',
    'Procurement',
    'UI/UX'
  ];

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    convertMessageToTask(message, title, projectId, workstream, assigneeId, priority);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convert Message to Project Task"
      subtitle="Instantly convert a team discussion or instruction into a tracked task"
      maxWidth="lg"
    >
      <form onSubmit={handleConvert} className="space-y-4 text-xs">
        {/* Source Message Preview */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Original Chat Message:
          </span>
          <p className="text-slate-300 italic text-[11px] line-clamp-3">
            "{message.text}"
          </p>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Target Project
            </label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.key} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Workstream
            </label>
            <select
              value={workstream}
              onChange={e => setWorkstream(e.target.value as WorkstreamType)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
            >
              {workstreams.map(ws => (
                <option key={ws} value={ws}>
                  {ws}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.designation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as TaskPriority)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
              <option value="Blocker">Blocker</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold flex items-center gap-1.5 shadow-glow-brand"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
