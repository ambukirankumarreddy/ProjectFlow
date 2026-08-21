import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Meeting } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Video,
  Sparkles,
  CheckCircle2,
  Plus,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  FileText,
  CheckSquare
} from 'lucide-react';

export const MeetingMinutesView: React.FC = () => {
  const { meetings, extractAndCreateMeetingTasks, users } = useApp();
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.id || '');
  const [isExtracting, setIsExtracting] = useState(false);

  const selectedMeeting = meetings.find(m => m.id === selectedMeetingId) || meetings[0];

  const handleRunAIExtraction = (meetingId: string) => {
    setIsExtracting(true);
    setTimeout(() => {
      extractAndCreateMeetingTasks(meetingId);
      setIsExtracting(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Meeting Minutes & AI Action Item Extractor</span>
            <Badge variant="purple" size="sm">
              FlowPilot NLP
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Convert standup & systems integration transcripts into structured decisions and actionable engineering tasks
          </p>
        </div>
      </div>

      {/* Main Grid: Left Meetings list & Right Selected Meeting Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Meetings List */}
        <div className="glass-card p-4 rounded-2xl border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Video className="w-4 h-4 text-brand-400" />
            Meeting Records ({meetings.length})
          </h3>

          <div className="space-y-2">
            {meetings.map(m => {
              const isSelected = m.id === selectedMeeting?.id;
              const pendingCount = m.actionItems.filter(a => !a.createdTaskId).length;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeetingId(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-500/20 border-brand-500/40 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-bold text-xs line-clamp-1">{m.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{m.date}</span>
                    <span>{m.duration}</span>
                  </div>
                  {pendingCount > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1 w-max">
                        <Sparkles className="w-2.5 h-2.5" />
                        {pendingCount} Tasks Ready to Extract
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Transcript, Decisions, and AI Extracted Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMeeting ? (
            <div className="glass-card p-6 rounded-2xl border space-y-6">
              {/* Meeting Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">
                    {selectedMeeting.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{selectedMeeting.date}</span>
                    <span>•</span>
                    <span>{selectedMeeting.duration}</span>
                    <span>•</span>
                    <span>{selectedMeeting.attendees.length} Attendees</span>
                  </div>
                </div>

                {/* 1-Click AI Task Extraction Button */}
                <button
                  onClick={() => handleRunAIExtraction(selectedMeeting.id)}
                  disabled={isExtracting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-xs font-bold shadow-glow-brand flex items-center gap-2 transition-all self-start sm:self-auto disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow text-amber-300" />
                  <span>{isExtracting ? 'Analyzing NLP...' : 'Extract & Create Tasks'}</span>
                </button>
              </div>

              {/* Transcript Viewer */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                  Audio Transcript
                </h4>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                  {selectedMeeting.transcript}
                </div>
              </div>

              {/* Key Decisions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Agreed Technical Decisions
                </h4>
                <div className="space-y-2">
                  {selectedMeeting.decisions.map((dec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-200 flex items-start gap-2"
                    >
                      <span className="font-bold text-emerald-400 mt-0.5">•</span>
                      <span>{dec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted Action Items & One-Click Creation */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                  Action Items & Task Sync ({selectedMeeting.actionItems.length})
                </h4>

                <div className="space-y-2.5">
                  {selectedMeeting.actionItems.map(item => {
                    const assignee = users.find(u => u.id === item.assigneeId);
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-slate-100">{item.taskTitle}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>Assignee: {assignee?.name || 'Engineer'}</span>
                            <span>•</span>
                            <span>Due: {item.dueDate}</span>
                          </div>
                        </div>

                        <div>
                          {item.createdTaskId ? (
                            <Badge variant="success" size="sm">
                              Task Created
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="sm">
                              Pending Extraction
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500 rounded-2xl">
              Select a meeting to view transcripts and AI actions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
