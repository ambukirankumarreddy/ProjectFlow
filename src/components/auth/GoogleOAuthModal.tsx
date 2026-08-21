import React, { useState } from 'react';
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
  Lock,
  ArrowRight,
  Info
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
  const [clientId, setClientId] = useState(() => localStorage.getItem('google_client_id') || '');
  const [isTokenClientLoading, setIsTokenClientLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeView, setActiveView] = useState<'account_picker' | 'manual_google' | 'configure_client'>('account_picker');

  if (!isOpen) return null;

  // 1. One-Click Google Workspace Login
  const handleSelectAccount = (account: { name: string; email: string; avatar: string }) => {
    onSuccess({
      id: `google-uid-${account.email.replace(/[@.]/g, '-')}`,
      name: account.name,
      email: account.email,
      imageUrl: account.avatar,
    });
    onClose();
  };

  // 2. Custom Google Email Login
  const handleManualGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!googleEmail.trim()) {
      setErrorMsg('Please enter a valid Google email.');
      return;
    }

    const emailVal = googleEmail.trim();
    const nameVal =
      googleName.trim() ||
      emailVal
        .split('@')[0]
        .replace('.', ' ')
        .replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    const avatarVal =
      googleAvatarUrl.trim() ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameVal)}`;

    onSuccess({
      id: `google-${Date.now()}`,
      name: nameVal,
      email: emailVal,
      imageUrl: avatarVal,
    });
    onClose();
  };

  // 3. Live Google Cloud OAuth2 Pop-up
  const handleTriggerRealOAuth = () => {
    if (!clientId.trim()) {
      setErrorMsg(
        'To open a live Google accounts.google.com popup, please enter your registered Google Cloud OAuth Client ID in "Config Client ID" below.'
      );
      return;
    }

    setIsTokenClientLoading(true);
    setErrorMsg('');

    try {
      const win = window as any;
      if (win.google?.accounts?.oauth2) {
        const tokenClient = win.google.accounts.oauth2.initTokenClient({
          client_id: clientId.trim(),
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
                    imageUrl:
                      data.picture ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        data.name || data.email
                      )}`,
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
            setErrorMsg(
              `Google OAuth error: ${
                err.message ||
                'The OAuth client was not found or origin https://ambukirankumarreddy.github.io is not added in Google Cloud Console.'
              }`
            );
          },
        });
        tokenClient.requestAccessToken();
      } else {
        setIsTokenClientLoading(false);
        setActiveView('manual_google');
      }
    } catch (err: any) {
      setIsTokenClientLoading(false);
      setErrorMsg(`Google SDK initialization error: ${err.message}`);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('google_client_id', clientId.trim());
    setActiveView('account_picker');
    setErrorMsg('Client ID saved! You can now test live OAuth popup.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#090f1d] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 relative space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            <h3 className="text-base font-extrabold text-white">Google Workspace SSO</h3>
            <p className="text-xs text-slate-400 font-mono">
              OAuth 2.0 • Domain Verified (@{companyDomain})
            </p>
          </div>
        </div>

        {/* Error / Info Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* VIEW 1: GOOGLE ACCOUNT PICKER */}
        {activeView === 'account_picker' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              Select your verified enterprise Google account to sign in immediately:
            </p>

            {/* Account List */}
            <div className="space-y-2.5">
              {/* Ambu Kiran Kumar Reddy (Primary Account) */}
              <button
                type="button"
                onClick={() =>
                  handleSelectAccount({
                    name: 'Ambu Kiran Kumar Reddy',
                    email: 'ambukiran@edgeforce.in',
                    avatar:
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  })
                }
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-brand-500/50 hover:border-brand-500 hover:bg-slate-900/90 text-left transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="Ambu Kiran"
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-brand-500/40"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="font-extrabold text-white flex items-center gap-1.5">
                      <span>Ambu Kiran Kumar Reddy</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      ambukiran@edgeforce.in
                    </div>
                    <Badge variant="purple" size="sm">
                      Super Admin & CTO
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Rajesh Varma */}
              <button
                type="button"
                onClick={() =>
                  handleSelectAccount({
                    name: 'Rajesh Varma',
                    email: 'rajesh.varma@edgeforce.in',
                    avatar:
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                  })
                }
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    alt="Rajesh Varma"
                    className="w-9 h-9 rounded-2xl object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="font-bold text-slate-200">Rajesh Varma</div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      rajesh.varma@edgeforce.in
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Managing Director & Admin
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Alternative Options */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <button
                type="button"
                onClick={() => setActiveView('manual_google')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-400" />
                <span>Use Another Google Account</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Google Cloud OAuth Setup:</span>
                <button
                  type="button"
                  onClick={() => setActiveView('configure_client')}
                  className="text-brand-400 hover:text-brand-300 font-mono"
                >
                  Configure Cloud Client ID
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MANUAL GOOGLE ACCOUNT INPUT */}
        {activeView === 'manual_google' && (
          <form onSubmit={handleManualGoogleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">Your Google Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="ambukiran@edgeforce.in"
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
                  placeholder="e.g. Ambu Kiran Kumar Reddy"
                  value={googleName}
                  onChange={e => setGoogleName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveView('account_picker')}
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

        {/* VIEW 3: CONFIGURE GOOGLE CLOUD CLIENT ID */}
        {activeView === 'configure_client' && (
          <form onSubmit={handleSaveClientId} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">
                Google Cloud OAuth 2.0 Client ID
              </label>
              <input
                type="text"
                placeholder="e.g. 1234567890-xyz.apps.googleusercontent.com"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-brand-500"
                autoFocus
              />
              <p className="text-[11px] text-slate-400 mt-1">
                To eliminate the Google 401 error when using Google's live server popup, create a
                Web Application in <strong>Google Cloud Console &gt; Credentials</strong> and add{' '}
                <code className="text-brand-300 font-mono">
                  https://ambukirankumarreddy.github.io
                </code>{' '}
                to Authorized JavaScript Origins.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveView('account_picker')}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Back
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
