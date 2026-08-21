import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskPriority, WorkstreamType, Conversation } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ChatWindow } from '../chat/ChatWindow';
import {
  CheckSquare,
  Clock,
  User,
  Calendar,
  Layers,
  Sparkles,
  Play,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MessageSquare,
  History,
  Info
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const {
    updateTask,
    deleteTask,
    duplicateTask,
    users,
    currentUser,
    startTimer,
    logAction,
    conversations,
    createConversation,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'activity'>('details');
  const [commentText, setCommentText] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  if (!task) return null;

  const assignee = users.find(u => u.id === task.assigneeId);
  const reporter = users.find(u => u.id === task.reporterId);
  const reviewer = users.find(u => u.id === task.reviewerId);

  // Find or construct Task Conversation
  let taskConv = conversations.find(c => c.type === 'task' && c.taskId === task.id);
  if (!taskConv) {
    taskConv = {
      id: `conv-task-${task.id}`,
      type: 'task',
      name: `Task Chat: ${task.key}`,
      description: `Task discussion for ${task.title}`,
      taskId: task.id,
      projectId: task.projectId,
      memberIds: [task.assigneeId, task.reporterId, currentUser.id],
      isPrivate: false,
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask({
      ...task,
      status: newStatus,
      progress: newStatus === 'Completed' ? 100 : task.progress,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          action: `Status changed to ${newStatus}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...task.activityLog,
      ],
    });
  };

  const handleToggleChecklist = (checkId: string) => {
    const updatedChecklist = task.checklist.map(c =>
      c.id === checkId ? { ...c, completed: !c.completed } : c
    );
    const completedCount = updatedChecklist.filter(c => c.completed).length;
    const progress =
      updatedChecklist.length > 0
        ? Math.round((completedCount / updatedChecklist.length) * 100)
        : task.progress;

    updateTask({
      ...task,
      checklist: updatedChecklist,
      progress,
    });
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const updated = [
      ...task.checklist,
      { id: `c-${Date.now()}`, text: newChecklistText.trim(), completed: false },
    ];
    updateTask({ ...task, checklist: updated });
    setNewChecklistText('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `cm-${Date.now()}`,
      authorId: currentUser.id,
      text: commentText.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    updateTask({
      ...task,
      comments: [...task.comments, newComment],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          action: 'Added comment',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...task.activityLog,
      ],
    });
    setCommentText('');
  };

  const handleApprove = () => {
    updateTask({
      ...task,
      approvalStatus: 'approved',
      status: 'Approved',
      activityLog: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          action: 'Approved deliverable',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...task.activityLog,
      ],
    });
    logAction(`Approved task deliverable [${task.key}]`, 'Task Engine');
  };

  return (
    <Modal
      isOpen={!!task}
      onClose={onClose}
      title={`${task.key}: ${task.title}`}
      subtitle={`${task.type} • ${task.workstream} Workstream`}
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Details & Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Task Live Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'activity'
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History ({task.activityLog.length})</span>
          </button>
        </div>

        {activeTab === 'chat' ? (
          <div className="h-[420px]">
            <ChatWindow conversation={taskConv} compact />
          </div>
        ) : activeTab === 'activity' ? (
          <div className="space-y-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs max-h-96 overflow-y-auto custom-scrollbar">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Task Mutation & Approval Audit Trail
            </h4>
            {task.activityLog.map(act => {
              const u = users.find(usr => usr.id === act.userId);
              return (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={u?.avatar || currentUser.avatar}
                      alt={u?.name}
                      className="w-5 h-5 rounded-md object-cover"
                    />
                    <span className="font-semibold text-slate-200">{u?.name || 'User'}</span>
                    <span className="text-slate-400">{act.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            {/* Left 2 Cols: Main Content, Checklist, Comments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Action Bar: Timer, Duplicate, Delete */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startTimer(task)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Live Stopwatch</span>
                  </button>

                  {task.approvalStatus === 'pending' && (
                    <button
                      onClick={handleApprove}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Deliverable</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      duplicateTask(task.id);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Duplicate task"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description & Technical Specifications
                </h4>
                <p className="text-slate-300 leading-relaxed p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Acceptance Criteria & Subtasks Checklist ({task.checklist.length})
                  </h4>
                  <span className="text-xs font-mono font-bold text-brand-400">
                    {task.checklist.filter(c => c.completed).length} / {task.checklist.length} ({task.progress}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-500 h-full rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>

                <div className="space-y-1.5">
                  {task.checklist.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleToggleChecklist(c.id)}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={c.completed}
                        onChange={() => {}}
                        className="w-4 h-4 text-brand-500 rounded bg-slate-950 border-slate-700"
                      />
                      <span
                        className={`text-xs ${
                          c.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {c.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add Checklist Item input */}
                <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add checklist step..."
                    value={newChecklistText}
                    onChange={e => setNewChecklistText(e.target.value)}
                    className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Comments Stream */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Comments ({task.comments.length})
                </h4>

                <div className="space-y-3 mb-3">
                  {task.comments.map(comment => {
                    const author = users.find(u => u.id === comment.authorId);
                    return (
                      <div
                        key={comment.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={author?.avatar || currentUser.avatar}
                              alt={author?.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                            />
                            <span className="font-bold text-slate-200">
                              {author?.name || 'Team Member'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 pl-7 leading-relaxed">{comment.text}</p>
                      </div>
                    );
                  })}
                </div>

                {/* New Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment or mention team members with @..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-glow-brand"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right 1 Col: Attributes, Assignee, Status, Time Details */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
                Task Parameters
              </h4>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Status</label>
                <select
                  value={task.status}
                  onChange={e => handleStatusChange(e.target.value as TaskStatus)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-bold focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="Backlog">Backlog</option>
                  <option value="Selected">Selected for Dev</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Testing">Testing / HIL</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Priority</label>
                <select
                  value={task.priority}
                  onChange={e => updateTask({ ...task, priority: e.target.value as TaskPriority })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-semibold focus:outline-none focus:border-brand-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                  <option value="Blocker">Blocker</option>
                </select>
              </div>

              {/* Workstream */}
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Workstream</label>
                <select
                  value={task.workstream}
                  onChange={e => updateTask({ ...task, workstream: e.target.value as WorkstreamType })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-semibold focus:outline-none focus:border-brand-500"
                >
                  <option value="Software">Software</option>
                  <option value="3D Modelling">3D Modelling</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Testing">Testing</option>
                  <option value="Integration">Integration</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Deployment">Deployment</option>
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Assignee</label>
                <select
                  value={task.assigneeId}
                  onChange={e => updateTask({ ...task, assigneeId: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-semibold focus:outline-none focus:border-brand-500"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Story Points & Estimated Hours */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Story Points</span>
                  <input
                    type="number"
                    value={task.storyPoints}
                    onChange={e => updateTask({ ...task, storyPoints: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Est. Hours</span>
                  <input
                    type="number"
                    value={task.estimatedHours}
                    onChange={e => updateTask({ ...task, estimatedHours: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Start Date:</span>
                  <span className="font-semibold text-slate-200">{task.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Due Date:</span>
                  <span className="font-semibold text-slate-200">{task.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Actual Logged:</span>
                  <span className="font-bold text-emerald-400">{task.actualHours} hrs</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
