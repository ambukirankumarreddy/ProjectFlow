import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatWindow } from './ChatWindow';
import {
  MessageSquare,
  Bot,
  X,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users,
  Search
} from 'lucide-react';

export const FloatingChatDock: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    minimizedChatIds,
    toggleMinimizeChat,
    closeMinimizedChat,
    currentUser,
    users,
    setCurrentView,
  } = useApp();

  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const [activePopoutConvId, setActivePopoutConvId] = useState<string | null>(null);

  // Total unread messages
  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const activePopoutConv = conversations.find(c => c.id === activePopoutConvId);

  const openMiniChat = (convId: string) => {
    setActivePopoutConvId(convId);
    setActiveConversationId(convId);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto select-none">
      {/* Active Popout Mini Chat Window */}
      {activePopoutConv && (
        <div className="w-80 sm:w-96 h-[440px] shadow-2xl rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <ChatWindow
            conversation={activePopoutConv}
            onClose={() => setActivePopoutConvId(null)}
            compact
          />
        </div>
      )}

      {/* Floating Launcher Pill / Expanded Roster */}
      <div className="flex items-center gap-2">
        {/* Quick Launch FlowPilot AI */}
        <button
          onClick={() => openMiniChat('conv-ai-flowpilot')}
          className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-brand-600 text-white shadow-glow-purple hover:scale-105 transition-all flex items-center gap-2 group"
          title="Quick Chat with FlowPilot AI"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="hidden group-hover:inline text-xs font-bold whitespace-nowrap pr-1">
            FlowPilot AI
          </span>
        </button>

        {/* Main Floating Chat Dock Button */}
        <div className="relative">
          <button
            onClick={() => setIsDockExpanded(!isDockExpanded)}
            className="p-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand hover:scale-105 transition-all flex items-center gap-2"
            title="Team & Project Chat"
          >
            <MessageSquare className="w-5 h-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md">
                {totalUnread}
              </span>
            )}
            <span className="text-xs font-bold hidden sm:inline">
              Chat {totalUnread > 0 ? `(${totalUnread})` : ''}
            </span>
            {isDockExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {/* Expanded Quick Roster Popover */}
          {isDockExpanded && (
            <div className="absolute bottom-16 right-0 w-80 bg-[#090f1b] border border-slate-800 rounded-2xl shadow-2xl p-3 space-y-3 animate-in fade-in zoom-in-95">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">Team Chats & Channels</span>
                  {totalUnread > 0 && (
                    <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded-md font-bold">
                      {totalUnread} new
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setCurrentView('chat');
                    setIsDockExpanded(false);
                  }}
                  className="text-[10px] text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
                >
                  <span>Open Full Hub</span>
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>

              {/* Recent Teammates presence */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Online Specialists
                </span>
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                  {users.slice(0, 6).map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        const targetConv = conversations.find(
                          c => c.type === 'direct' && c.memberIds.includes(u.id)
                        );
                        if (targetConv) {
                          openMiniChat(targetConv.id);
                        } else {
                          setCurrentView('chat');
                        }
                        setIsDockExpanded(false);
                      }}
                      className="flex flex-col items-center shrink-0 group"
                      title={`${u.name} (${u.designation})`}
                    >
                      <div className="relative">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-800 group-hover:ring-brand-500 transition-all"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${
                            u.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                          }`}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 max-w-[50px] truncate mt-1">
                        {u.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Channel List */}
              <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Recent Channels
                </span>
                {conversations.slice(0, 5).map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      openMiniChat(conv.id);
                      setIsDockExpanded(false);
                    }}
                    className="w-full p-2 rounded-xl hover:bg-slate-900 flex items-center justify-between text-left text-xs text-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500 font-mono">
                        {conv.type === 'direct' ? '@' : '#'}
                      </span>
                      <span className="truncate font-medium">{conv.name}</span>
                    </div>
                    {conv.unreadCount !== undefined && conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
