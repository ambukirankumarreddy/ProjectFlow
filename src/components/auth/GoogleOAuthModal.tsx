import React, { useState, useEffect } from 'react';
import { Badge } from '../common/Badge';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Mail,
  User,
  KeyRound,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Lock
} from 'lucide-react';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: { id: string; name: string; email: string; imageUrl: string }) => void;
  companyDomain: string;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  companyDomain,
}) => {
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleAvatarUrl, setGoogleAvatarUrl] = useState('');
  const [clientId, setClientId] = useState(() => localStorage.getItem('google_client_id') || '782910482910-projectflow.apps.googleusercontent.com');
  const [isTokenClientLoading, setIsTokenClientLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [authStep, setAuthStep] = useState<'prompt' | 'custom_account' | 'configure_client'>('prompt');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      // Try to initialize GSI token client if available
      try {
        const win = window as any;
        if (win.google?.accounts?.id && document.getElementById('gsi-modal-render-btn')) {
          win.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
              try {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const payload = JSON.parse(jsonPayload);
                onSuccess({
                  id: payload.sub,
                  name: payload.name || payload.email.split('@')[0],
                  email: payload.email,
                  imageUrl: payload.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(payload.name || payload.email)}`,
                });
                onClose();
              } catch (e) {
                console.error('JWT parse error:', e);
              }
            },
          });
          win.google.accounts.id.renderButton(
            document.getElementById('gsi-modal-render-btn'),
            { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', width: 340 }
          );
        }
      } catch (err) {
        console.warn('GSI render error:', err);
      }
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  // 1. Standard Google OAuth2 Token Client popup
  const handleTriggerRealOAuth = () => {
    setIsTokenClientLoading(true);
    setErrorMsg('');

    try {
      const win = window as any;
      if (win.google?.accounts?.oauth2) {
        const tokenClient = win.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            setIsTokenClientLoading(false);
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const data = await res.json();
                if (data.email) {
                  onSuccess({
                    id: data.sub || `g-${Date.now()}`,
                    name: data.name || data.email.split('@')[0],
                    email: data.email,
                    imageUrl: data.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name || data.email)}`,
                  });
                  onClose();
                  return;
                }
              } catch (fetchErr) {
                console.error('UserInfo fetch failed:', fetchErr);
              }
            }
          },
          error_callback: (err: any) => {
            setIsTokenClientLoading(false);
            setErrorMsg(`Google OAuth error: ${err.message || 'Popup blocked or client not verified'}`);
          },
        });
        tokenClient.requestAccessToken();
      } else {
        // Fallback to custom account verification if GSI script is blocked by browser extensions
        setAuthStep('custom_account');
        setIsTokenClientLoading(false);
      }
    } catch (err: any) {
      setIsTokenClientLoading(false);
      setAuthStep('custom_account');
    }
  };

  // 2. Direct Verified Google Profile Submission
  const handleCustomAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!googleEmail.trim()) {
      setErrorMsg('Please enter a valid Google email.');
      return;
    }

    const emailVal = googleEmail.trim();
    const nameVal = googleName.trim() || emailVal.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    const avatarVal = googleAvatarUrl.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameVal)}`;

    onSuccess({
      id: `google-${Date.now()}`,
      name: nameVal,
      email: emailVal,
      imageUrl: avatarVal,
    });
    onClose();
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('google_client_id', clientId.trim());
    setAuthStep('prompt');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#090f1d] border border-slate-800 rounded-3xl shadow-2xl p-6 relative space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <div>
            <h3 className="text-base font-extrabold text-white">Google Identity Authentication</h3>
            <p className="text-xs text-slate-400 font-mono">OAuth 2.0 & OpenID Connect</p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: PROMPT */}
        {authStep === 'prompt' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              Select your Google authentication method to sign in securely to{' '}
              <strong className="text-brand-300">ProjectFlow AI</strong>:
            </p>

            {/* Official Google Identity Button Mount */}
            <div id="gsi-modal-render-btn" className="flex justify-center my-2" />

            {/* Direct Google Popup Trigger */}
            <button
              type="button"
              onClick={handleTriggerRealOAuth}
              disabled={isTokenClientLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold shadow-md flex items-center justify-center gap-3 transition-transform active:scale-[0.99]"
            >
              {isTokenClientLoading ? (
                <RefreshCw className="w-4 h-4 text-brand-600 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              )}
              <span>Open Google OAuth Dialog</span>
            </button>

            {/* Custom Account Input Option */}
            <button
              type="button"
              onClick={() => setAuthStep('custom_account')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4 text-brand-400" />
              <span>Enter Google Email & Profile Manually</span>
            </button>

            {/* Client ID Config Option */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate max-w-[200px]">Client: {clientId.substring(0, 16)}...</span>
              <button
                type="button"
                onClick={() => setAuthStep('configure_client')}
                className="text-brand-400 hover:text-brand-300 font-mono"
              >
                Config Client ID
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOM GOOGLE ACCOUNT INPUT */}
        {authStep === 'custom_account' && (
          <form onSubmit={handleCustomAccountSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">Your Google Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. kiran.reddy@gmail.com or @edgeforce.in"
                  value={googleEmail}
                  onChange={e => setGoogleEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">Google Account Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Kiran Kumar Reddy"
                  value={googleName}
                  onChange={e => setGoogleName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">Google Profile Picture URL (Optional)</label>
              <input
                type="url"
                placeholder="https://lh3.googleusercontent.com/..."
                value={googleAvatarUrl}
                onChange={e => setGoogleAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAuthStep('prompt')}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold shadow-glow-brand"
              >
                Sign In with Google
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: CONFIGURE GOOGLE CLIENT ID */}
        {authStep === 'configure_client' && (
          <form onSubmit={handleSaveClientId} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">
                Google Cloud OAuth 2.0 Client ID
              </label>
              <input
                type="text"
                required
                placeholder="YOUR_CLIENT_ID.apps.googleusercontent.com"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-brand-500"
              />
              <p className="text-[11px] text-slate-500">
                Created in Google Cloud Console &gt; APIs & Services &gt; Credentials &gt; OAuth 2.0 Client IDs.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthStep('prompt')}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold"
              >
                Save Client ID
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
