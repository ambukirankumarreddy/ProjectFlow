import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({ isOpen, onClose }) => {
  const { selectedProject, projects, tasks, users, budget, bomItems } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; timestamp: string }[]
  >([
    {
      sender: 'ai',
      text: `Hello! I am **FlowPilot AI**, your autonomous project copilot. I am continuously monitoring ${selectedProject?.name || 'your program'}, analyzing 9 workstreams, and detecting risks in real-time.\n\nHow can I assist your engineering delivery today?`,
      timestamp: 'Just now',
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const quickQuestions = [
    'What is blocking the project right now?',
    'Which tasks are overdue or at risk?',
    'Who is overloaded across the team?',
    'What must be completed before HIL integration?',
    'Draft my daily stand-up notes',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      const q = text.toLowerCase();

      const blockedTasks = tasks.filter(t => t.status === 'Blocked' || t.priority === 'Critical');
      const inProgressTasks = tasks.filter(t => t.status === 'In Progress');

      if (q.includes('blocking') || q.includes('blocked')) {
        if (blockedTasks.length > 0) {
          reply = `**Current Blockers & High Risk Items Detected (${blockedTasks.length}):**\n\n` +
            blockedTasks.map(t => `- **Task:** \`${t.key}\` (${t.title})\n  - **Priority:** ${t.priority} | **Assignee:** ${users.find(u => u.id === t.assigneeId)?.name || 'Unassigned'}`).join('\n');
        } else {
          reply = `✅ **Zero Blockers Detected:** All tasks are currently flowing normally across active workstreams without dependency blocks.`;
        }
      } else if (q.includes('overdue') || q.includes('risk')) {
        reply = `**Risk Analysis for ${selectedProject?.name || 'Workspace'}:**\n\n` +
          `- **Total Tracked Tasks:** ${tasks.length}\n` +
          `- **In Progress:** ${inProgressTasks.length}\n` +
          `- **Critical Priority:** ${blockedTasks.length}\n` +
          `- **Overall Project Risk Score:** ${selectedProject?.riskScore || 15}%\n\n` +
          (tasks.length === 0 ? `*Tip: Create tasks in Kanban or Gantt to enable automated risk forecasting.*` : `*Delivery timeline is tracking to schedule.*`);
      } else if (q.includes('overloaded') || q.includes('workload')) {
        if (users.length > 0) {
          reply = `**Team Workload Distribution (${users.length} members):**\n\n` +
            users.map(u => {
              const userTasks = tasks.filter(t => t.assigneeId === u.id);
              return `- **${u.name}** (${u.role}): ${userTasks.length} assigned tasks (${userTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0)} hrs total)`;
            }).join('\n');
        } else {
          reply = `No team members registered yet. You can invite team members in the Admin or Manpower Hub.`;
        }
      } else if (q.includes('standup') || q.includes('daily')) {
        reply = `**AI-Synthesized Daily Standup Brief:**\n\n` +
          `- **Active Tasks in Flight:** ${inProgressTasks.length > 0 ? inProgressTasks.map(t => `\`${t.key}\` (${t.title})`).slice(0, 3).join(', ') : 'None in progress'}\n` +
          `- **Completed Recently:** ${tasks.filter(t => t.status === 'Completed').length} tasks done\n` +
          `- **Immediate Focus:** Coordinate sprint milestone deliverables and test coverage.`;
      } else {
        reply = `I have analyzed the **${selectedProject?.name || 'Enterprise Workspace'}** program.\n\n` +
          `- **Active Projects:** ${projects.length}\n` +
          `- **Work Items:** ${tasks.length} tasks\n` +
          `- **Team Size:** ${users.length} members\n` +
          `- **Allocated Budget:** ₹${(budget.totalBudgetINR || 0).toLocaleString('en-IN')}\n\n` +
          `How can I assist with your planning or resource optimization today?`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsThinking(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-lg bg-[#0a101d] border-l border-slate-800 h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-glow-brand">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                <span>FlowPilot Copilot</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 uppercase">
                  Agent Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Connected to {selectedProject?.name || 'Platform Context'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto flex gap-1.5 custom-scrollbar">
          {quickQuestions.map((qq, i) => (
            <button
              key={i}
              onClick={() => handleSend(qq)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-700 whitespace-nowrap transition-colors"
            >
              {qq}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className="text-[9px] text-slate-400 text-right mt-1.5 opacity-70">
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-brand-900 border border-brand-500/30 text-brand-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 text-xs flex items-center gap-2 ai-shimmer">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                <span>FlowPilot is reasoning across project graph...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about the schedule, risks, or blockers..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-2.5 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-glow-brand transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
