import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { RoleSwitcher } from './RoleSwitcher';
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
  IndianRupee,
  ShieldCheck,
  User as UserIcon,
  MessageSquare,
  Volume2,
  VolumeX,
  AlertOctagon,
  Sliders,
  Settings,
  Users2,
  ChevronDown
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
    setCurrentView,
    conversations,
    isEmergencyAlarmActive,
    stopEmergencyAlarm,
    unlockAudio,
    playNotificationSound,
    logout,
    orgSettings,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#080d17]/90 backdrop-blur-xl border-b border-slate-800/90 shadow-md">
      {/* Left: Project Selector & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <FolderKanban className="w-4 h-4" />
          </div>
          {projects.length > 0 ? (
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
          ) : (
            <button
              onClick={onOpenCreateProject}
              className="px-3 py-1.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-bold hover:bg-brand-500/30 transition-colors shadow-sm"
            >
              + Create First Project
            </button>
          )}
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

      {/* Right: AI Copilot, Audio Toggle, Chat Hub, Notifications, User Profile & Role */}
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

        {/* 8-Role RBAC Switcher */}
        <RoleSwitcher />

        {/* User Profile Chip & Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors group shadow-sm"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-xl object-cover ring-1 ring-brand-500/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                {currentUser.designation}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Profile Dropdown Popover */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#090f1b] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-brand-500/30"
                />
                <div className="truncate">
                  <div className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {currentUser.email}
                  </div>
                  <Badge variant="purple" size="sm">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <button
                  onClick={() => {
                    setCurrentView('manpower');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-900 flex items-center gap-2.5 text-left transition-colors"
                >
                  <Users2 className="w-4 h-4 text-brand-400" />
                  <span>Manpower Tree & Reporting</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('onboarding');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-900 flex items-center gap-2.5 text-left transition-colors"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>Organization Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsNotificationSettingsOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-900 flex items-center gap-2.5 text-left transition-colors"
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Audio & Alert Preferences</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 flex items-center gap-2.5 text-left transition-colors font-semibold"
                >
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">{orgSettings.name.split(' ')[0]}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SSO Active</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={resetToDemoData}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
          title="Reset Workspace State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
