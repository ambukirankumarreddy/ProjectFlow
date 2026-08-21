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
  const { selectedProject, tasks, users, budget, bomItems } = useApp();

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

      if (q.includes('blocking') || q.includes('blocked')) {
        reply = `**Current Blocker Detected:**\n\n- **Task:** \`BMP2-104\` (Hydraulic Hexapod Motion Platform Servo Controller Calibration)\n- **Discipline:** Mechanical Engineering (Lead: Marcus Thorne)\n- **Root Cause:** Proportional valve shipment from Moog Controls is in transit (ETA: Aug 22).\n- **Mitigation:** Wiring harness continuity testing has been fast-tracked so integration can begin the moment the package arrives.`;
      } else if (q.includes('overdue') || q.includes('risk')) {
        reply = `**Overdue & Risk Analysis for ${selectedProject?.key}:**\n\n1. **High Risk (Critical Path):** Motion Base servo calibration has 0 days of buffer slack.\n2. **Thermal Shader Optics (\`BMP2-106\`):** Depth sorting on synthetic foliage LOD needs vertex shader review.\n3. Overall Project Risk Score is currently **${selectedProject?.riskScore || 42}%**.`;
      } else if (q.includes('overloaded') || q.includes('workload')) {
        reply = `**Team Workload Distribution:**\n\n- **Vikram Malhotra (Unity Architect):** 122% Capacity (Ballistics + Shader pipeline). Recommended to reassign shader tasks.\n- **David Chen (Embedded Systems):** 95% Capacity (CAN bus drivers).\n- **Elena Rostova (3D Art):** 75% Capacity (Available for UI assets).`;
      } else if (q.includes('hil') || q.includes('integration')) {
        reply = `**Pre-Requisites for HIL Integration Milestone:**\n\n1. ✅ CAN Bus STM32 Driver (200Hz packet rate verified).\n2. ✅ 30mm 2A42 Ballistic equations certified.\n3. ⏳ 24V MIL-DTL-38999 wiring harness loom continuity check (90% complete).\n4. ❌ 180-bar hydraulic bench test of proportional valves (Blocked until Aug 22).`;
      } else if (q.includes('standup') || q.includes('daily')) {
        reply = `**AI-Drafted Standup Brief:**\n\n- **Yesterday:** Finalized Runge-Kutta 4th order numerical ballistics curves in C# and tested against military dispersion standards.\n- **Today:** Resolving depth buffer sorting on BPK-1-42 thermal sight shaders; sync with David Chen on CAN bus joystick bridge.\n- **Blockers:** Awaiting Moog servo valve delivery for motion base rig.`;
      } else {
        reply = `I have analyzed your request against the active **${selectedProject?.name}** program. All **9 workstreams** (Software, 3D Modelling, Hardware, Mechanical, Electrical, Procurement, Integration, Testing, Deployment) are synchronized. 

Key Health Indicators:
- **Progress:** ${selectedProject?.progress}%
- **Budget Spent:** ${budget.actualSpendINR ? (budget.actualSpendINR / 100000).toFixed(1) + ' Lakhs' : '₹0'} of ${budget.totalBudgetINR ? (budget.totalBudgetINR / 10000000).toFixed(2) + ' Crores' : '₹0'}
- **Active Sprint:** Sprint 2 (36 / 54 pts delivered)`;
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
