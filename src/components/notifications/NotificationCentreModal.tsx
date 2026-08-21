import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationCategory, NotificationSeverity } from '../../types';
import { Badge } from '../common/Badge';
import {
  Bell,
  CheckCheck,
  Clock,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  FileCheck,
  Cpu,
  IndianRupee,
  Calendar,
  X,
  ExternalLink,
  Sliders
} from 'lucide-react';

export const NotificationCentreModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    snoozeNotification,
    deleteNotification,
    setCurrentView,
    setIsNotificationSettingsOpen,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  if (!isOpen) return null;

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'chat', label: 'Chat & Mentions', icon: MessageSquare },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'approvals', label: 'Approvals', icon: FileCheck },
    { id: 'risks', label: 'Risks & Lead-Times', icon: AlertTriangle },
    { id: 'procurement', label: 'Procurement / BOM', icon: Cpu },
    { id: 'system', label: 'System & Security', icon: ShieldAlert },
    { id: 'ai', label: 'AI Insights', icon: Sparkles },
  ];

  const filtered = notifications
    .filter(n => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'chat') return n.category === 'chat' || n.category === 'mentions';
      return n.category === selectedCategory;
    })
    .filter(n => (filterUnreadOnly ? !n.read : true));

  const unreadCount = notifications.filter(n => !n.read).length;

  const getSeverityBadge = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'emergency':
        return <Badge variant="danger" size="sm">EMERGENCY</Badge>;
      case 'critical':
        return <Badge variant="danger" size="sm">CRITICAL</Badge>;
      case 'warning':
        return <Badge variant="warning" size="sm">WARNING</Badge>;
      case 'success':
        return <Badge variant="success" size="sm">SUCCESS</Badge>;
      default:
        return <Badge variant="primary" size="sm">INFO</Badge>;
    }
  };

  const handleOpenRecord = (referenceType?: string, referenceId?: string) => {
    if (referenceType === 'chat') {
      setCurrentView('chat');
    } else if (referenceType === 'task') {
      setCurrentView('tasks');
    } else if (referenceType === 'project') {
      setCurrentView('projects');
    } else if (referenceType === 'procurement') {
      setCurrentView('procurement');
    } else {
      setCurrentView('dashboard');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#090f1b] border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <span>Enterprise Notification Centre</span>
                {unreadCount > 0 && (
                  <Badge variant="danger" size="sm">
                    {unreadCount} Unread
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Audited alerts, task reminders, chat mentions, and system updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsNotificationSettingsOpen(true);
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              title="Configure Notification & Audio Preferences"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs shrink-0">
          <div className="flex items-center gap-1">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-brand-500 text-white font-bold shadow-glow-brand'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                filterUnreadOnly
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Unread only
            </button>

            <button
              onClick={markAllNotificationsAsRead}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-400 text-[11px] font-bold border border-slate-800 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
              <CheckCheck className="w-8 h-8 text-slate-700 mb-2" />
              <p>No notifications matching this filter.</p>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                  notif.read
                    ? 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                    : 'bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-900 border-brand-500/30 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(notif.severity)}
                    <span className="font-bold text-slate-100">{notif.title}</span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">{notif.message}</p>

                {notif.snoozedUntil && (
                  <div className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>Snoozed until {notif.snoozedUntil}</span>
                  </div>
                )}

                {/* Notification Footer Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    {notif.referenceType && (
                      <button
                        onClick={() => handleOpenRecord(notif.referenceType, notif.referenceId)}
                        className="px-2.5 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 font-bold border border-brand-500/30 flex items-center gap-1 transition-colors"
                      >
                        <span>Open Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Snooze Options */}
                    <button
                      onClick={() => snoozeNotification(notif.id, 60)}
                      className="text-slate-400 hover:text-amber-300 flex items-center gap-1"
                      title="Snooze for 1 hour"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Snooze 1h</span>
                    </button>

                    {/* Mark Read */}
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark read</span>
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-slate-500 hover:text-rose-400"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
