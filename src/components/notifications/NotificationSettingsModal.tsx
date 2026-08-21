import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { audioEngine, SoundEffectType } from '../../utils/audioEngine';
import {
  Volume2,
  VolumeX,
  Bell,
  Moon,
  Shield,
  Smartphone,
  Mail,
  Laptop,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders
} from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { notificationPreferences, updateNotificationPreferences } = useApp();

  const [masterVolume, setMasterVolume] = useState(notificationPreferences.masterVolume);
  const [chatVolume, setChatVolume] = useState(notificationPreferences.chatVolume);
  const [alertVolume, setAlertVolume] = useState(notificationPreferences.alertVolume);
  const [soundEnabled, setSoundEnabled] = useState(notificationPreferences.soundEnabled);
  const [soundOnlyForMentions, setSoundOnlyForMentions] = useState(
    notificationPreferences.soundOnlyForMentions
  );
  const [criticalAlertsOverrideDnd, setCriticalAlertsOverrideDnd] = useState(
    notificationPreferences.criticalAlertsOverrideDnd
  );
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(
    notificationPreferences.quietHoursEnabled
  );
  const [quietHoursStart, setQuietHoursStart] = useState(notificationPreferences.quietHoursStart);
  const [quietHoursEnd, setQuietHoursEnd] = useState(notificationPreferences.quietHoursEnd);
  const [dndActive, setDndActive] = useState(notificationPreferences.dndActive);

  // Delivery channels
  const [inAppEnabled, setInAppEnabled] = useState(notificationPreferences.inAppEnabled);
  const [browserDesktopEnabled, setBrowserDesktopEnabled] = useState(
    notificationPreferences.browserDesktopEnabled
  );
  const [mobilePushEnabled, setMobilePushEnabled] = useState(
    notificationPreferences.mobilePushEnabled
  );
  const [emailEnabled, setEmailEnabled] = useState(notificationPreferences.emailEnabled);
  const [privacyMode, setPrivacyMode] = useState(notificationPreferences.privacyMode);

  const [browserPermissionStatus, setBrowserPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  const handleRequestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermissionStatus(permission);
      if (permission === 'granted') {
        setBrowserDesktopEnabled(true);
        audioEngine.playSound('approval_result');
      }
    }
  };

  const handleTestSound = (type: SoundEffectType) => {
    audioEngine.unlockAudio();
    audioEngine.playSound(type, true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences({
      masterVolume,
      chatVolume,
      alertVolume,
      soundEnabled,
      soundOnlyForMentions,
      criticalAlertsOverrideDnd,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      dndActive,
      inAppEnabled,
      browserDesktopEnabled,
      mobilePushEnabled,
      emailEnabled,
      privacyMode,
    });
    audioEngine.playSound('approval_result');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Audio & Notification Preferences"
      subtitle="Configure Web Audio synthesized sound levels, quiet hours, delivery channels and desktop alerts"
      maxWidth="2xl"
    >
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SECTION 1: Web Audio Synthesis & Master Volume */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-brand-400" />
              <h4 className="font-bold text-slate-100 text-sm">
                Web Audio Engine & Volume Control
              </h4>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-slate-400 font-semibold">Enable Audio:</span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={e => {
                  setSoundEnabled(e.target.checked);
                  if (e.target.checked) audioEngine.unlockAudio();
                }}
                className="w-4 h-4 text-brand-500 rounded bg-slate-900 border-slate-700"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Master Volume */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Master Volume</span>
                <span className="font-mono font-bold text-slate-200">
                  {Math.round(masterVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={masterVolume}
                disabled={!soundEnabled}
                onChange={e => setMasterVolume(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            {/* Chat Messages Volume */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Chat Volume</span>
                <span className="font-mono font-bold text-slate-200">
                  {Math.round(chatVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={chatVolume}
                disabled={!soundEnabled}
                onChange={e => setChatVolume(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Alert / Alarm Volume */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Alert Volume</span>
                <span className="font-mono font-bold text-slate-200">
                  {Math.round(alertVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={alertVolume}
                disabled={!soundEnabled}
                onChange={e => setAlertVolume(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          {/* Sound Presets Tester */}
          <div className="pt-3 border-t border-slate-900">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Synthesized Audio Preset Testers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Direct Message', type: 'direct_message' as SoundEffectType },
                { label: 'Channel Post', type: 'channel_message' as SoundEffectType },
                { label: '@Mention', type: 'mention' as SoundEffectType },
                { label: 'Task Assigned', type: 'task_assigned' as SoundEffectType },
                { label: 'Deadline Warning', type: 'deadline_warning' as SoundEffectType },
                { label: 'Approval Result', type: 'approval_result' as SoundEffectType },
                { label: 'Critical Risk', type: 'critical_risk' as SoundEffectType },
                { label: 'AI Sparkle', type: 'ai_recommendation' as SoundEffectType },
              ].map(preset => (
                <button
                  type="button"
                  key={preset.type}
                  onClick={() => handleTestSound(preset.type)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] flex items-center gap-1 transition-all active:scale-95"
                >
                  <Play className="w-3 h-3 text-brand-400" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: Quiet Hours & Do Not Disturb */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-slate-100 text-sm">Quiet Hours & DND Mode</h4>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-slate-400 font-semibold">Do Not Disturb (DND):</span>
              <input
                type="checkbox"
                checked={dndActive}
                onChange={e => setDndActive(e.target.checked)}
                className="w-4 h-4 text-purple-500 rounded bg-slate-900 border-slate-700"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={soundOnlyForMentions}
                onChange={e => setSoundOnlyForMentions(e.target.checked)}
                className="w-4 h-4 text-brand-500 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300">Play sound only when @Mentioned</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={criticalAlertsOverrideDnd}
                onChange={e => setCriticalAlertsOverrideDnd(e.target.checked)}
                className="w-4 h-4 text-rose-500 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300">Emergency & Critical alerts override DND</span>
            </label>
          </div>

          {/* Quiet Hours Time Range */}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-900">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quietHoursEnabled}
                onChange={e => setQuietHoursEnabled(e.target.checked)}
                className="w-4 h-4 text-brand-500 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300">Schedule Quiet Hours:</span>
            </label>

            <div className="flex items-center gap-2 font-mono">
              <input
                type="time"
                value={quietHoursStart}
                disabled={!quietHoursEnabled}
                onChange={e => setQuietHoursStart(e.target.value)}
                className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
              />
              <span className="text-slate-500">to</span>
              <input
                type="time"
                value={quietHoursEnd}
                disabled={!quietHoursEnabled}
                onChange={e => setQuietHoursEnd(e.target.value)}
                className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Multi-Channel Delivery Matrix */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-slate-100 text-sm">Delivery Channels & Privacy</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {/* In-App */}
            <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <Laptop className="w-4 h-4 text-brand-400" />
                <input
                  type="checkbox"
                  checked={inAppEnabled}
                  onChange={e => setInAppEnabled(e.target.checked)}
                  className="w-4 h-4 text-brand-500 rounded"
                />
              </div>
              <span className="font-semibold text-slate-200">In-App Alerts</span>
            </label>

            {/* Browser Desktop */}
            <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <input
                  type="checkbox"
                  checked={browserDesktopEnabled}
                  onChange={e => setBrowserDesktopEnabled(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 rounded"
                />
              </div>
              <span className="font-semibold text-slate-200">Desktop Push</span>
            </label>

            {/* Mobile Push */}
            <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <input
                  type="checkbox"
                  checked={mobilePushEnabled}
                  onChange={e => setMobilePushEnabled(e.target.checked)}
                  className="w-4 h-4 text-purple-500 rounded"
                />
              </div>
              <span className="font-semibold text-slate-200">Mobile Push</span>
            </label>

            {/* Email */}
            <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <Mail className="w-4 h-4 text-amber-400" />
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={e => setEmailEnabled(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded"
                />
              </div>
              <span className="font-semibold text-slate-200">Daily Digest</span>
            </label>
          </div>

          {/* Browser Permission Prompt Banner */}
          {browserPermissionStatus !== 'granted' && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-cyan-300">
                  Enable Desktop Browser Notifications
                </span>
                <p className="text-[11px] text-slate-400">
                  Receive task assignments and chat mentions when working in another tab
                </p>
              </div>
              <button
                type="button"
                onClick={handleRequestBrowserPermission}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] shadow-sm transition-all"
              >
                Allow Notifications
              </button>
            </div>
          )}

          {/* Privacy Mode Toggle */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Defense Privacy Mode (Mask Desktop Notification Body)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Obfuscates confidential weapon/mil-spec descriptions from popping up on external screens
              </p>
            </div>

            <input
              type="checkbox"
              checked={privacyMode}
              onChange={e => setPrivacyMode(e.target.checked)}
              className="w-4 h-4 text-emerald-500 rounded bg-slate-950 border-slate-700"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-glow-brand"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </Modal>
  );
};
