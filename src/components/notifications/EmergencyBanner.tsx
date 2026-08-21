import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, VolumeX, ShieldAlert } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { isEmergencyAlarmActive, stopEmergencyAlarm, notifications } = useApp();

  if (!isEmergencyAlarmActive) return null;

  const emergencyNotif = notifications.find(n => n.severity === 'emergency');

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 border-b-2 border-rose-500 text-white px-4 py-2.5 shadow-2xl flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-rose-600 text-white shadow-glow-rose shrink-0 animate-bounce">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="truncate">
          <div className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
            <span>Critical Emergency Alert Active</span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <p className="text-[11px] text-rose-200 truncate">
            {emergencyNotif?.title || 'System / Simulator Deployment Critical Warning'} —{' '}
            {emergencyNotif?.message || 'Continuous audio alarm siren is sounding.'}
          </p>
        </div>
      </div>

      <button
        onClick={stopEmergencyAlarm}
        className="px-4 py-1.5 rounded-xl bg-white hover:bg-rose-100 text-rose-900 font-extrabold text-xs shadow-lg flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
      >
        <VolumeX className="w-4 h-4 text-rose-700" />
        <span>Acknowledge & Mute Alarm</span>
      </button>
    </div>
  );
};
