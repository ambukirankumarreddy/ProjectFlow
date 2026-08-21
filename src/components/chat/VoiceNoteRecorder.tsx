import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Send } from 'lucide-react';
import { VoiceNote } from '../../types';

interface VoiceNoteRecorderProps {
  onSendVoiceNote: (voiceNote: VoiceNote) => void;
  onCancel: () => void;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  onSendVoiceNote,
  onCancel,
}) => {
  const [isRecording, setIsRecording] = useState(true);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
      // Generate realistic dynamic audio waveform amplitude (0-100)
      setWaveform(prev => [
        ...prev.slice(-35),
        Math.floor(20 + Math.random() * 80),
      ]);
    }, 200);

    return () => clearInterval(timerRef.current);
  }, []);

  const formatSeconds = (totalSeconds: number) => {
    const s = Math.floor(totalSeconds / 5);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStopAndSend = () => {
    clearInterval(timerRef.current);
    const finalDurationSeconds = Math.max(1, Math.floor(duration / 5));
    const finalWaveform = waveform.length > 0 ? waveform : [30, 50, 80, 60, 90, 40, 70, 50];

    onSendVoiceNote({
      durationSeconds: finalDurationSeconds,
      waveform: finalWaveform,
      audioUrl: '#',
    });
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-slate-900 border border-brand-500/40 rounded-2xl animate-in fade-in slide-in-from-bottom-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
        <span className="font-mono font-bold text-rose-400">
          REC {formatSeconds(duration)}
        </span>
      </div>

      {/* Simulated Live Waveform */}
      <div className="flex-1 flex items-center gap-0.5 h-7 px-2 bg-slate-950/80 rounded-xl overflow-hidden">
        {waveform.map((amp, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-brand-500 to-rose-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(15, amp)}%` }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
          title="Cancel Voice Note"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleStopAndSend}
          className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold flex items-center gap-1 shadow-glow-brand transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

// Reusable Player for Rendered Voice Notes
export const VoiceNotePlayer: React.FC<{ voiceNote: VoiceNote }> = ({ voiceNote }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 10;
        });
      }, (voiceNote.durationSeconds * 1000) / 10);
    }
    return () => clearInterval(interval);
  }, [isPlaying, voiceNote.durationSeconds]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2.5 p-2 bg-slate-950/70 border border-slate-800 rounded-xl min-w-[200px] max-w-xs text-xs">
      <button
        type="button"
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Visual Waveform */}
      <div className="flex-1 flex items-center gap-0.5 h-5">
        {(voiceNote.waveform || [30, 50, 80, 40, 70, 90, 60, 40, 75, 50]).map((amp, idx) => {
          const isPassed = (idx / voiceNote.waveform.length) * 100 <= progress;
          return (
            <div
              key={idx}
              className={`w-1 rounded-full transition-colors ${
                isPassed ? 'bg-brand-400' : 'bg-slate-700'
              }`}
              style={{ height: `${Math.max(20, amp)}%` }}
            />
          );
        })}
      </div>

      <span className="text-[10px] font-mono text-slate-400 shrink-0">
        {formatDuration(voiceNote.durationSeconds)}
      </span>
    </div>
  );
};
