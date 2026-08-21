import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskType, TaskPriority, WorkstreamType, TaskStatus } from '../../types';
import { Modal } from '../common/Modal';
import { CheckSquare, Plus, Sparkles, User, Calendar, Layers } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask, selectedProject, users, currentUser, sprints, epics } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('Task');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [workstream, setWorkstream] = useState<WorkstreamType>('Software');
  const [assigneeId, setAssigneeId] = useState<string>(currentUser.id);
  const [sprintId, setSprintId] = useState<string>(sprints[0]?.id || '');
  const [epicId, setEpicId] = useState<string>('');
  const [storyPoints, setStoryPoints] = useState<number>(5);
  const [estimatedHours, setEstimatedHours] = useState<number>(20);
  const [startDate, setStartDate] = useState('2026-08-20');
  const [dueDate, setDueDate] = useState('2026-08-30');
  const [acceptanceCriteriaText, setAcceptanceCriteriaText] = useState('');

  const taskTypes: TaskType[] = [
    'Epic',
    'User Story',
    'Task',
    'Subtask',
    'Bug',
    'Change Request',
    'Risk',
    'Issue',
    'Procurement Item',
    'Approval',
    'Milestone',
    'Test Case',
    'Meeting Action Item',
  ];

  const workstreams: WorkstreamType[] = [
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const taskKey = `${selectedProject?.key || 'PRJ'}-${Math.floor(100 + Math.random() * 900)}`;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      key: taskKey,
      title,
      description,
      projectId: selectedProject?.id || 'proj-1',
      workstream,
      epicId: epicId || undefined,
      type,
      priority,
      status: 'Selected',
      assigneeId,
      reporterId: currentUser.id,
      sprintId: sprintId || undefined,
      startDate,
      dueDate,
      estimatedHours: Number(estimatedHours) || 8,
      actualHours: 0,
      storyPoints: Number(storyPoints) || 3,
      labels: [type, workstream],
      dependencies: [],
      checklist: [
        { id: `c-${Date.now()}-1`, text: 'Initial design and requirements review', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Implementation and verification', completed: false },
      ],
      acceptanceCriteria: acceptanceCriteriaText
        ? acceptanceCriteriaText.split('\n').filter(Boolean)
        : ['Deliverable verified and signed off'],
      comments: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          action: 'Created task',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
      approvalStatus: 'none',
      progress: 0,
    };

    addTask(newTask);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Work Item / Task"
      subtitle={`Adding to ${selectedProject?.name || 'Active Project'}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleCreate} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Task Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as TaskType)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            >
              {taskTypes.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Workstream</label>
            <select
              value={workstream}
              onChange={e => setWorkstream(e.target.value as WorkstreamType)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            >
              {workstreams.map(w => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Title / Summary *</label>
          <input
            type="text"
            required
            placeholder="e.g. Calibrate CAN Bus baud rate for gunner joystick"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            placeholder="Technical details, reproduction steps, or requirements..."
            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Assignee</label>
            <select
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as TaskPriority)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
              <option value="Blocker">Blocker</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Sprint</label>
            <select
              value={sprintId}
              onChange={e => setSprintId(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            >
              <option value="">Backlog (No Sprint)</option>
              {sprints.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Story Points</label>
            <input
              type="number"
              value={storyPoints}
              onChange={e => setStoryPoints(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Est. Hours</label>
            <input
              type="number"
              value={estimatedHours}
              onChange={e => setEstimatedHours(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Acceptance Criteria (1 per line)
          </label>
          <textarea
            value={acceptanceCriteriaText}
            onChange={e => setAcceptanceCriteriaText(e.target.value)}
            rows={2}
            placeholder="e.g. Signal jitter < 2ms under 200Hz load&#10;Zero packet drop over 10,000 cycles"
            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
          />
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
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
