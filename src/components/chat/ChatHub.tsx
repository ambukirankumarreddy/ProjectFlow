import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConversationType, Conversation } from '../../types';
import { ChatWindow } from './ChatWindow';
import { Badge } from '../common/Badge';
import {
  MessageSquare,
  Users,
  FolderKanban,
  CheckSquare,
  Bot,
  Megaphone,
  Plus,
  Search,
  Hash,
  Shield,
  Phone,
  Layers,
  Sparkles,
  Sliders,
  Volume2
} from 'lucide-react';

export const ChatHub: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    currentUser,
    users,
    createConversation,
    setIsNotificationSettingsOpen
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | ConversationType>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false);
  const [newConvName, setNewConvName] = useState('');
  const [newConvType, setNewConvType] = useState<ConversationType>('group');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([currentUser.id]);

  const filteredConversations = conversations
    .filter(c => {
      if (activeCategory === 'all') return true;
      return c.type === activeCategory;
    })
    .filter(c => {
      if (!searchFilter.trim()) return true;
      const targetUser = c.type === 'direct' ? users.find(u => c.memberIds.includes(u.id) && u.id !== currentUser.id) : null;
      const displayName = targetUser ? targetUser.name : c.name;
      return displayName.toLowerCase().includes(searchFilter.toLowerCase());
    });

  const activeConversation =
    conversations.find(c => c.id === activeConversationId) || conversations[0];

  const handleCreateNewConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConvName.trim()) return;

    const newId = createConversation({
      type: newConvType,
      name: newConvName.startsWith('#') || newConvType === 'direct' ? newConvName : `#${newConvName}`,
      memberIds: selectedMemberIds,
    });

    setIsNewConvModalOpen(false);
    setNewConvName('');
    setActiveConversationId(newId);
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="space-y-4 h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Enterprise Communications & Chat Hub</span>
            <Badge variant="purple" size="sm">
              Real-Time WebSocket
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time direct messaging, multi-disciplinary workstream channels, and FlowPilot AI assistant
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotificationSettingsOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Audio & Alert Settings</span>
          </button>

          <button
            onClick={() => setIsNewConvModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Channel / Group</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Channel List Sidebar + Main Chat Window */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        {/* Left Sidebar Channel Browser (4 Cols) */}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col bg-[#090f1b] border border-slate-800 rounded-2xl overflow-hidden">
          {/* Category Filter Chips */}
          <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-900/60">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter channels & teammates..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Sub-Category Pills */}
            <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1 text-[11px] font-semibold">
              {[
                { id: 'all', label: 'All', icon: MessageSquare },
                { id: 'direct', label: 'Direct (1:1)', icon: Users },
                { id: 'project', label: 'Projects', icon: FolderKanban },
                { id: 'team', label: 'Teams', icon: Layers },
                { id: 'task', label: 'Tasks', icon: CheckSquare },
                { id: 'announcement', label: 'Notices', icon: Megaphone },
                { id: 'ai', label: 'AI Agent', icon: Bot },
              ].map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white font-bold shadow-glow-brand'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isActive = conv.id === activeConversationId;
                const targetUser =
                  conv.type === 'direct'
                    ? users.find(u => conv.memberIds.includes(u.id) && u.id !== currentUser.id)
                    : null;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
                      isActive
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                        : 'hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    {/* Avatar */}
                    {targetUser ? (
                      <div className="relative shrink-0">
                        <img
                          src={targetUser.avatar}
                          alt={targetUser.name}
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-800"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${
                            targetUser.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                          }`}
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                          conv.type === 'ai'
                            ? 'bg-purple-600'
                            : conv.type === 'announcement'
                            ? 'bg-amber-600'
                            : conv.type === 'project'
                            ? 'bg-brand-600'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {conv.type === 'ai' ? (
                          <Bot className="w-4 h-4" />
                        ) : conv.type === 'announcement' ? (
                          '📢'
                        ) : (
                          '#'
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate text-slate-100">
                          {targetUser ? targetUser.name : conv.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {conv.lastMessage?.createdAt || conv.updatedAt}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                        <span className="truncate max-w-[170px] text-slate-400">
                          {conv.lastMessage?.text || conv.description}
                        </span>
                        {conv.unreadCount !== undefined && conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0 animate-pulse">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Stream (8 Cols) */}
        <div className="md:col-span-8 lg:col-span-8 h-full">
          {activeConversation ? (
            <ChatWindow conversation={activeConversation} />
          ) : (
            <div className="flex items-center justify-center h-full bg-[#090f1b] border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>

      {/* New Channel / Group Modal */}
      {isNewConvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-400" />
              <span>Create New Communication Channel</span>
            </h3>

            <form onSubmit={handleCreateNewConversation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Channel / Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. bmp2-avionics-testers"
                  value={newConvName}
                  onChange={e => setNewConvName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Channel Type
                </label>
                <select
                  value={newConvType}
                  onChange={e => setNewConvType(e.target.value as ConversationType)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="group">Ad-Hoc Group Chat</option>
                  <option value="project">Project Workstream Channel</option>
                  <option value="team">Disciplinary Team Channel</option>
                  <option value="announcement">Announcement Broadcast</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Select Members ({selectedMemberIds.length})
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl custom-scrollbar">
                  {users.map(u => {
                    const isSelected = selectedMemberIds.includes(u.id);
                    return (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => toggleMemberSelection(u.id)}
                        className={`w-full p-1.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-brand-500/20 text-brand-300 font-semibold'
                            : 'hover:bg-slate-900 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-5 h-5 rounded-md object-cover"
                          />
                          <span className="truncate">{u.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{u.designation}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewConvModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-glow-brand"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
