import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { RoleSwitcher } from './RoleSwitcher';
import { formatIndianDate } from '../../utils/formatters';
import {
  Search,
  Sparkles,
  Play,
  Pause,
  Square,
  Bell,
  CheckCircle2,
  FolderKanban,
  RotateCcw,
  Calendar,
  IndianRupee,
  ShieldCheck,
  User as UserIcon,
  MessageSquare,
  Volume2,
  VolumeX,
  AlertOctagon,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAICopilot: () => void;
  onOpenCreateProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAICopilot,
  onOpenCreateProject,
}) => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    projects,
    activeTimer,
    pauseTimer,
    resumeTimer,
    stopAndLogTimer,
    notifications,
    setIsNotificationCentreOpen,
    setIsNotificationSettingsOpen,
    notificationPreferences,
    updateNotificationPreferences,
    resetToDemoData,
    currentUser,
    setIsGoogleAuthModalOpen,
    setCurrentView,
    conversations,
    isEmergencyAlarmActive,
    stopEmergencyAlarm,
    unlockAudio,
    playNotificationSound,
  } = useApp();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const totalUnreadChat = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const hrs = Math.floor(mins / 60);
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins % 60).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleSound = () => {
    unlockAudio();
    const nextState = !notificationPreferences.soundEnabled;
    updateNotificationPreferences({ soundEnabled: nextState });
    if (nextState) {
      playNotificationSound('approval_result');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#080d17]/80 backdrop-blur-xl border-b border-slate-800">
      {/* Left: Project Selector & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <FolderKanban className="w-4 h-4" />
          </div>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-100 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer shadow-sm"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.key} - {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Currency & Financial Year Tag */}
        <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-emerald-400 font-semibold">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>INR (₹) • FY 2026-27</span>
        </div>

        {/* Emergency Alert Indicator if Active */}
        {isEmergencyAlarmActive && (
          <button
            onClick={stopEmergencyAlarm}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-600 text-white font-extrabold text-[11px] animate-pulse shadow-glow-rose"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>ALARM ACTIVE (MUTE)</span>
          </button>
        )}
      </div>

      {/* Center: Global Search & Active Timer */}
      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs w-60 shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left truncate">Search tasks, RFP, BOM...</span>
          <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Live Stopwatch Badge if Active */}
        {activeTimer && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-950/80 border border-brand-500/40 text-brand-300 shadow-glow-brand animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider">
              {formatTimer(activeTimer.elapsedSeconds)}
            </span>
            <span className="text-[11px] font-medium max-w-[100px] truncate hidden sm:inline text-slate-300">
              {activeTimer.taskTitle}
            </span>

            <div className="flex items-center gap-1 ml-1">
              {activeTimer.isRunning ? (
                <button
                  onClick={pauseTimer}
                  className="p-1 rounded hover:bg-brand-900/50 text-slate-300 hover:text-white"
                  title="Pause Timer"
                >
                  <Pause className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="p-1 rounded hover:bg-brand-900/50 text-slate-300 hover:text-white"
                  title="Resume Timer"
                >
                  <Play className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={() => stopAndLogTimer()}
                className="p-1 rounded hover:bg-rose-900/50 text-rose-300 hover:text-white"
                title="Stop & Log Time"
              >
                <Square className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: AI Copilot, Audio Toggle, Chat Hub, Notifications, Google Auth, Role Switcher */}
      <div className="flex items-center gap-2">
        {/* FlowPilot AI Trigger */}
        <button
          onClick={onOpenAICopilot}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-glow-brand transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span className="hidden lg:inline">FlowPilot Copilot</span>
        </button>

        {/* Audio Synthesizer Toggle */}
        <button
          onClick={handleToggleSound}
          className={`p-2 rounded-xl border transition-colors ${
            notificationPreferences.soundEnabled
              ? 'bg-slate-900/90 border-slate-800 text-emerald-400 hover:text-emerald-300'
              : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title={
            notificationPreferences.soundEnabled
              ? 'Web Audio Synthesizer Active (Click to Mute)'
              : 'Web Audio Muted (Click to Enable)'
          }
        >
          {notificationPreferences.soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Real-Time Chat Hub Trigger */}
        <button
          onClick={() => setCurrentView('chat')}
          className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-colors"
          title="Open Chat & Channel Communications Hub"
        >
          <MessageSquare className="w-4 h-4" />
          {totalUnreadChat > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce shadow-md">
              {totalUnreadChat}
            </span>
          )}
        </button>

        {/* Notification Centre Trigger Modal */}
        <button
          onClick={() => setIsNotificationCentreOpen(true)}
          className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-colors"
          title="Open Notification Centre"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce shadow-md">
              {unreadNotifs}
            </span>
          )}
        </button>

        {/* Google Authentication Account Picker Trigger */}
        <button
          onClick={() => setIsGoogleAuthModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors shadow-sm"
          title="Google Workspace SSO Account"
        >
          <div className="w-4 h-4 rounded-full flex items-center justify-center bg-white shadow-xs">
            <svg className="w-3 h-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <span className="hidden md:inline font-mono text-[11px] text-slate-300">
            {currentUser.googleEmail || currentUser.email}
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </button>

        {/* 8-Role Switcher */}
        <RoleSwitcher />

        {/* Reset Demo Button */}
        <button
          onClick={resetToDemoData}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
          title="Reset to Initial Demo State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
