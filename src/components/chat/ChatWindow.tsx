import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Conversation, ChatMessage, MessageAttachment, VoiceNote } from '../../types';
import { Badge } from '../common/Badge';
import { VoiceNoteRecorder, VoiceNotePlayer } from './VoiceNoteRecorder';
import { ConvertMessageToTaskModal } from './ConvertMessageToTaskModal';
import {
  Send,
  Paperclip,
  Mic,
  Smile,
  Pin,
  Star,
  CornerUpLeft,
  CheckSquare,
  MoreVertical,
  Edit2,
  Trash2,
  Share2,
  Check,
  CheckCheck,
  FileText,
  FileCode,
  Image as ImageIcon,
  Download,
  X,
  Phone,
  Video,
  Info,
  Search,
  Sparkles,
  Bot,
  User as UserIcon,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
  onClose?: () => void;
  compact?: boolean;
}

const COMMON_EMOJIS = ['👍', '❤️', '🚀', '👀', '🎉', '🔥', '💡', '✅'];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onClose,
  compact = false,
}) => {
  const {
    currentUser,
    users,
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    pinMessage,
    starMessage,
    forwardMessage,
    conversations,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isMentionDropdownOpen, setIsMentionDropdownOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [convertingMessage, setConvertingMessage] = useState<ChatMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter messages for this conversation
  const convMessages = messages
    .filter(m => m.conversationId === conversation.id)
    .filter(m =>
      !searchQuery.trim()
        ? true
        : m.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const pinnedMessages = convMessages.filter(m => m.pinned);

  const targetUser =
    conversation.type === 'direct'
      ? users.find(u => conversation.memberIds.includes(u.id) && u.id !== currentUser.id)
      : null;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    // Detect @ mention
    const lastWord = val.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      setIsMentionDropdownOpen(true);
      setMentionFilter(lastWord.substring(1).toLowerCase());
    } else {
      setIsMentionDropdownOpen(false);
    }
  };

  const handleSelectMention = (user: { id: string; name: string }) => {
    const words = inputText.split(' ');
    words.pop();
    words.push(`@${user.name} `);
    setInputText(words.join(' '));
    setIsMentionDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    // Check for @ mentions in the text
    const mentions = users
      .filter(u => inputText.includes(`@${u.name}`))
      .map(u => u.id);

    sendMessage(
      conversation.id,
      inputText,
      undefined,
      replyingTo?.id,
      undefined,
      mentions.length > 0 ? mentions : undefined
    );

    setInputText('');
    setReplyingTo(null);
    setIsEmojiPickerOpen(false);
  };

  const handleMockAttachment = () => {
    const sampleAttachment: MessageAttachment = {
      id: `att-${Date.now()}`,
      name: 'BMP2_Ballistics_Telemetry_Data.pdf',
      type: 'pdf',
      sizeBytes: 1850000,
      url: '#',
    };

    sendMessage(
      conversation.id,
      'Shared attachment: BMP2_Ballistics_Telemetry_Data.pdf',
      [sampleAttachment],
      replyingTo?.id
    );
  };

  const handleSendVoiceNote = (voiceNote: VoiceNote) => {
    sendMessage(
      conversation.id,
      '',
      undefined,
      replyingTo?.id,
      voiceNote
    );
    setIsRecordingVoice(false);
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editText.trim()) return;
    editMessage(messageId, editText);
    setEditingMessageId(null);
    setEditText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#090f1b] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 min-w-0">
          {targetUser ? (
            <div className="relative">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-slate-900 ${
                  targetUser.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs shadow-glow-brand">
              {conversation.type === 'ai' ? (
                <Bot className="w-5 h-5" />
              ) : conversation.type === 'announcement' ? (
                '📢'
              ) : (
                '#'
              )}
            </div>
          )}

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-100 truncate">
                {targetUser ? targetUser.name : conversation.name}
              </h3>
              <Badge
                variant={
                  conversation.type === 'ai'
                    ? 'purple'
                    : conversation.type === 'project'
                    ? 'primary'
                    : conversation.type === 'announcement'
                    ? 'warning'
                    : 'neutral'
                }
                size="sm"
              >
                {conversation.type.toUpperCase()}
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {targetUser
                ? `${targetUser.designation} • ${targetUser.department}`
                : conversation.description || `${conversation.memberIds.length} Members`}
            </p>
          </div>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSearchActive(!isSearchActive)}
            className={`p-2 rounded-xl border transition-colors ${
              isSearchActive
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800'
            }`}
            title="Search in conversation"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            className={`p-2 rounded-xl border transition-colors ${
              showInfoPanel
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800'
            }`}
            title="Conversation Details & Pinned"
          >
            <Info className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* In-Chat Search Bar */}
      {isSearchActive && (
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs animate-in slide-in-from-top-1">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search messages in this thread..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-100 focus:outline-none placeholder-slate-500"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Body: Message Stream + Optional Info Sidebar */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Pinned Messages Banner */}
          {pinnedMessages.length > 0 && (
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200 mb-2">
              <div className="flex items-center gap-2 truncate">
                <Pin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="font-semibold text-purple-300">Pinned:</span>
                <span className="truncate italic">
                  "{pinnedMessages[0].text.substring(0, 65)}..."
                </span>
              </div>
              <span className="text-[10px] bg-purple-900/60 px-2 py-0.5 rounded-md font-bold font-mono">
                {pinnedMessages.length} Pinned
              </span>
            </div>
          )}

          {convMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs text-center">
              <Sparkles className="w-8 h-8 text-slate-700 mb-2" />
              <p>No messages yet in this conversation.</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Send a greeting, link a task, or record a voice note!
              </p>
            </div>
          ) : (
            convMessages.map(msg => {
              const isSelf = msg.senderId === currentUser.id;
              const isAI = msg.senderId === 'usr-ai';
              const sender = users.find(u => u.id === msg.senderId);
              const isEditing = editingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`group relative flex gap-3 ${
                    isSelf ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Sender Avatar */}
                  {!isSelf && (
                    <div className="shrink-0 mt-0.5">
                      {isAI ? (
                        <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-sm">
                          <Bot className="w-4 h-4" />
                        </div>
                      ) : (
                        <img
                          src={sender?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={sender?.name || 'User'}
                          className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-800"
                        />
                      )}
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] space-y-1.5 ${
                      isSelf ? 'items-end text-right' : 'items-start text-left'
                    }`}
                  >
                    {/* Sender Name & Timestamp */}
                    {!isSelf && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-200">
                          {sender?.name || 'FlowPilot AI'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {msg.createdAt}
                        </span>
                      </div>
                    )}

                    {/* Reply Preview if threaded */}
                    {msg.replyToSnippet && (
                      <div className="p-2 rounded-xl bg-slate-900/90 border-l-2 border-brand-500 text-[11px] text-slate-400 text-left line-clamp-2">
                        <span className="font-semibold text-brand-300">
                          Replying to {msg.replyToSnippet.senderName}:
                        </span>{' '}
                        {msg.replyToSnippet.text}
                      </div>
                    )}

                    {/* Forwarded Tag */}
                    {msg.isForwarded && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 italic">
                        <Share2 className="w-3 h-3" />
                        <span>Forwarded message</span>
                      </div>
                    )}

                    {/* Bubble Content */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all shadow-sm ${
                        isSelf
                          ? 'bg-brand-600 text-white rounded-tr-none'
                          : isAI
                          ? 'bg-purple-950/30 border border-purple-500/30 text-purple-100 rounded-tl-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      } ${msg.pinned ? 'ring-1 ring-purple-400/50' : ''}`}
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 text-[11px]">
                            <button
                              onClick={() => setEditingMessageId(null)}
                              className="px-2.5 py-1 text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(msg.id)}
                              className="px-3 py-1 bg-brand-500 hover:bg-brand-600 rounded-lg text-white font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )}

                      {/* File Attachments Preview */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          {msg.attachments.map(att => (
                            <div
                              key={att.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-300">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <div className="font-semibold text-slate-200 truncate">
                                    {att.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    {(att.sizeBytes / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Voice Note Player */}
                      {msg.voiceNote && (
                        <div className="pt-2">
                          <VoiceNotePlayer voiceNote={msg.voiceNote} />
                        </div>
                      )}

                      {/* Footer: Time & Receipts */}
                      {isSelf && (
                        <div className="flex items-center justify-end gap-1.5 text-[10px] text-brand-200 mt-1">
                          {msg.editedAt && <span className="italic">(edited)</span>}
                          <span>{msg.createdAt}</span>
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                        </div>
                      )}
                    </div>

                    {/* Reactions Display */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {msg.reactions.map((r, i) => (
                          <button
                            key={i}
                            onClick={() => reactToMessage(msg.id, r.emoji)}
                            className={`px-2 py-0.5 rounded-full text-[11px] border flex items-center gap-1 transition-colors ${
                              r.userIds.includes(currentUser.id)
                                ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 font-bold'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span>{r.userIds.length}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Floating Action Menu on Hover */}
                  <div
                    className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-xl flex items-center gap-1 z-20 ${
                      isSelf ? 'right-0 -top-8' : 'left-8 -top-8'
                    }`}
                  >
                    {/* Reaction Shortcuts */}
                    {['👍', '❤️', '🚀', '🔥'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => reactToMessage(msg.id, emoji)}
                        className="p-1 hover:bg-slate-800 rounded-lg text-xs"
                      >
                        {emoji}
                      </button>
                    ))}

                    <div className="w-px h-3 bg-slate-800 mx-0.5" />

                    {/* Reply */}
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
                      title="Reply"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Convert to Task */}
                    <button
                      onClick={() => setConvertingMessage(msg)}
                      className="p-1 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded-lg"
                      title="Convert to Project Task"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* Pin */}
                    <button
                      onClick={() => pinMessage(conversation.id, msg.id)}
                      className={`p-1 hover:bg-slate-800 rounded-lg ${
                        msg.pinned ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Pin Message"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    {/* Star */}
                    <button
                      onClick={() => starMessage(msg.id)}
                      className={`p-1 hover:bg-slate-800 rounded-lg ${
                        msg.starredByUserIds?.includes(currentUser.id)
                          ? 'text-amber-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Star Message"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit & Delete if author */}
                    {isSelf && (
                      <>
                        <button
                          onClick={() => {
                            setEditingMessageId(msg.id);
                            setEditText(msg.text);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
                          title="Edit Message"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                          title="Delete Message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Optional Right Details Panel */}
        {showInfoPanel && (
          <div className="w-64 border-l border-slate-800 p-4 space-y-4 text-xs bg-slate-950/60 overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 duration-150">
            <div>
              <h4 className="font-bold text-slate-200">Conversation Details</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {conversation.description || 'No description provided.'}
              </p>
            </div>

            {/* Pinned Messages */}
            <div>
              <h5 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Pin className="w-3 h-3 text-purple-400" />
                Pinned Messages ({pinnedMessages.length})
              </h5>
              {pinnedMessages.length === 0 ? (
                <p className="text-slate-500 text-[11px] italic">No pinned items.</p>
              ) : (
                <div className="space-y-2">
                  {pinnedMessages.map(pm => (
                    <div
                      key={pm.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1"
                    >
                      <div className="text-[10px] text-slate-500 font-mono">{pm.createdAt}</div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{pm.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Members List */}
            <div>
              <h5 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider mb-2">
                Members ({conversation.memberIds.length})
              </h5>
              <div className="space-y-2">
                {conversation.memberIds.map(uid => {
                  const mUser = users.find(u => u.id === uid);
                  if (!mUser) return null;
                  return (
                    <div key={uid} className="flex items-center gap-2">
                      <img
                        src={mUser.avatar}
                        alt={mUser.name}
                        className="w-6 h-6 rounded-lg object-cover"
                      />
                      <div className="truncate">
                        <div className="font-semibold text-slate-200 truncate">
                          {mUser.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {mUser.designation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Typing & Input Bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
        {/* Active Reply Banner */}
        {replyingTo && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-brand-500/30 text-xs text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <CornerUpLeft className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="font-semibold text-brand-300">
                Replying to {users.find(u => u.id === replyingTo.senderId)?.name || 'User'}:
              </span>
              <span className="truncate italic text-slate-400">"{replyingTo.text}"</span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mention Auto-Suggest Dropdown */}
        {isMentionDropdownOpen && (
          <div className="absolute bottom-16 left-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 w-64 max-h-48 overflow-y-auto custom-scrollbar z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">
              Mention Teammate
            </div>
            {users
              .filter(u => u.name.toLowerCase().includes(mentionFilter))
              .map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSelectMention(u)}
                  className="w-full p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-left text-xs transition-colors"
                >
                  <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-md object-cover" />
                  <div className="truncate">
                    <span className="font-bold text-slate-200">{u.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {u.designation}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        )}

        {/* Emoji Palette Popover */}
        {isEmojiPickerOpen && (
          <div className="absolute bottom-16 right-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 flex flex-wrap gap-1.5 max-w-xs z-30 animate-in fade-in zoom-in-95">
            {COMMON_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText(prev => prev + emoji);
                  setIsEmojiPickerOpen(false);
                  inputRef.current?.focus();
                }}
                className="p-2 hover:bg-slate-800 rounded-xl text-lg transition-transform active:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input or Voice Recording */}
        {isRecordingVoice ? (
          <VoiceNoteRecorder
            onSendVoiceNote={handleSendVoiceNote}
            onCancel={() => setIsRecordingVoice(false)}
          />
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={handleMockAttachment}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Attach Document or Schematics"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Emoji Trigger */}
            <button
              type="button"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Add Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              placeholder={
                conversation.type === 'ai'
                  ? 'Ask FlowPilot to summarize, analyze risks, or balance manpower...'
                  : `Message ${conversation.name} (use @ to mention)...`
              }
              value={inputText}
              onChange={handleInputChange}
              className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500 placeholder-slate-500"
            />

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-glow-brand transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Convert Message to Task Modal */}
      <ConvertMessageToTaskModal
        isOpen={!!convertingMessage}
        onClose={() => setConvertingMessage(null)}
        message={convertingMessage}
      />
    </div>
  );
};
