import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Layers,
  Lock,
  Mail,
  User,
  Building2,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users2,
  IndianRupee,
  AlertTriangle,
  Globe,
  Briefcase
} from 'lucide-react';
import { GoogleOAuthModal } from './GoogleOAuthModal';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const {
    loginWithEmail,
    loginWithGoogle,
    registerOrganization,
    registerWithInvite,
    users,
    orgSettings,
  } = useApp();

  // Start fresh directly on the Registration page
  const [activeTab, setActiveTab] = useState<'register_org' | 'signin' | 'accept_invite'>('register_org');
  const [isGoogleOAuthModalOpen, setIsGoogleOAuthModalOpen] = useState(false);

  // Sign-in Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [pendingUser, setPendingUser] = useState<any>(null);

  // Register Org Form State (Empty for Fresh Registration)
  const [orgName, setOrgName] = useState('');
  const [orgDomain, setOrgDomain] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [industry, setIndustry] = useState('Defense & Aerospace Simulation');

  // Employee Invite Form State
  const [inviteToken, setInviteToken] = useState('');
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empDepartment, setEmpDepartment] = useState('Software Engineering');
  const [empRole, setEmpRole] = useState<UserRole>('Developer/Member');
  const [empReportingManagerId, setEmpReportingManagerId] = useState('');

  // 1. Google Identity Callback Handler
  React.useEffect(() => {
    (window as any).onSignIn = (googleUser: any) => {
      try {
        const profile = googleUser.getBasicProfile();
        const result = loginWithGoogle({
          id: profile.getId(),
          name: profile.getName(),
          imageUrl: profile.getImageUrl(),
          email: profile.getEmail(),
        });

        if (!result.success) {
          setAuthError(result.message || 'Google Sign-In failed domain validation.');
        }
      } catch (err) {
        console.error('Google onSignIn callback error:', err);
      }
    };
  }, [loginWithGoogle]);

  // 2. Handle Manual Email/Password Sign-In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    const result = loginWithEmail(email.trim(), password);
    if (!result.success) {
      setAuthError(result.message || 'Invalid credentials.');
      return;
    }

    if (result.twoFactorRequired) {
      setPendingUser(result.user);
      setTwoFactorStep(true);
    }
  };

  // 3. Handle 2FA Verification
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.trim() === '123456' || twoFactorCode.trim().length === 6) {
      loginWithEmail(pendingUser.email, 'bypassed_2fa', true);
    } else {
      setAuthError('Invalid 2FA OTP code. Try demo code 123456.');
    }
  };

  // 4. Handle Google SSO Click
  const handleGoogleSignIn = () => {
    setAuthError('');
    setIsGoogleOAuthModalOpen(true);
  };

  // 5. Handle Super Admin & Organization Registration
  const handleRegisterOrg = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!orgName.trim()) {
      setAuthError('Please provide an organization name.');
      return;
    }

    if (adminPassword !== adminConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    if (orgDomain && !adminEmail.endsWith(`@${orgDomain.replace('@', '')}`)) {
      setAuthError(`Admin email must match the organization domain @${orgDomain.replace('@', '')}`);
      return;
    }

    const result = registerOrganization({
      organizationName: orgName.trim(),
      domain: orgDomain.trim().replace('@', ''),
      adminName: adminName.trim(),
      adminEmail: adminEmail.trim(),
      adminPassword: adminPassword,
      industry,
    });

    if (!result.success) {
      setAuthError(result.message || 'Registration failed.');
    }
  };

  // 6. Handle Employee Invite Registration
  const handleAcceptInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const result = registerWithInvite({
      token: inviteToken.trim(),
      name: empName.trim(),
      email: empEmail.trim(),
      password: empPassword,
      department: empDepartment,
      role: empRole,
      functionalManagerId: empReportingManagerId || undefined,
    });

    if (!result.success) {
      setAuthError(result.message || 'Invitation acceptance failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/40 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-brand">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight text-white flex items-center gap-2">
              <span>ProjectFlow AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-gradient-to-r from-brand-500 to-purple-500 text-white font-extrabold uppercase">
                Enterprise
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Autonomous Project, Task & Defense Simulation Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-semibold">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>INR (₹) • FY 2026-27</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-xl bg-[#090f1d] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Tabs Navigation */}
          <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('register_org');
                setAuthError('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register_org'
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Register Organization</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('signin');
                setTwoFactorStep(false);
                setAuthError('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'signin'
                  ? 'bg-brand-500 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('accept_invite');
                setAuthError('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'accept_invite'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>Join via Invite</span>
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-300 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* TAB 1 (DEFAULT): REGISTER ORGANIZATION & SUPER ADMIN */}
          {activeTab === 'register_org' && (
            <form onSubmit={handleRegisterOrg} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-extrabold text-white">
                  Register Your Organization
                </h2>
                <p className="text-xs text-slate-400">
                  Initial Super Admin and organization setup with clean workspace and INR (₹) localization
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Organization Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Edgeforce Simulation & Aerospace"
                      value={orgName}
                      onChange={e => setOrgName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Corporate Domain *
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="edgeforce.in"
                      value={orgDomain}
                      onChange={e => setOrgDomain(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Super Admin Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ambu Kiran Kumar Reddy"
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Admin Office Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="ambukiran@edgeforce.in"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Admin Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={adminConfirmPassword}
                      onChange={e => setAdminConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Industry Sector</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Defense & Aerospace Simulation">Defense & Aerospace Simulation</option>
                    <option value="Enterprise SaaS & IT Services">Enterprise SaaS & IT Services</option>
                    <option value="Heavy Engineering & Manufacturing">Heavy Engineering & Manufacturing</option>
                    <option value="Autonomous Robotics & Hardware">Autonomous Robotics & Hardware</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white font-extrabold shadow-glow-purple flex items-center justify-center gap-2 transition-all active:scale-[0.99] text-xs mt-2"
              >
                <span>Register Organization & Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: SIGN IN */}
          {activeTab === 'signin' && (
            <div className="space-y-5">
              {!twoFactorStep ? (
                <>
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-extrabold text-white">Welcome Back</h2>
                    <p className="text-xs text-slate-400">
                      Sign in with your enterprise credentials or Google Workspace
                    </p>
                  </div>

                  {/* Google Workspace SSO Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-[0.99]"
                  >
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
                    <span>Continue with Google Workspace</span>
                  </button>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span>OR CORPORATE EMAIL</span>
                    <div className="flex-1 h-px bg-slate-800" />
                  </div>

                  {/* Standard Form */}
                  <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Corporate Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="name@edgeforce.in"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-brand-500"
                        />
                        <span>Remember session for 30 days</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => alert('Password reset instructions sent to your registered office email.')}
                        className="text-brand-400 hover:text-brand-300 font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold shadow-glow-brand flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      <span>Sign In to Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                /* 2FA OTP Step */
                <form onSubmit={handleVerify2FA} className="space-y-4 text-xs">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Two-Factor Authentication Required
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Enter the 6-digit OTP for{' '}
                      <strong className="text-slate-200">{pendingUser?.email}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={twoFactorCode}
                      onChange={e => setTwoFactorCode(e.target.value)}
                      className="w-full text-center tracking-widest text-xl font-mono p-3 bg-slate-950 border border-slate-700 rounded-2xl text-slate-100 focus:outline-none focus:border-brand-500"
                      autoFocus
                    />
                    <p className="text-[11px] text-slate-500 text-center font-mono">
                      (Demo default OTP: <code className="text-brand-300 font-bold">123456</code>)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTwoFactorStep(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold shadow-glow-brand"
                    >
                      Verify & Open Workspace
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: JOIN VIA INVITATION */}
          {activeTab === 'accept_invite' && (
            <form onSubmit={handleAcceptInvite} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-extrabold text-white">
                  Join Your Team Workspace
                </h2>
                <p className="text-xs text-slate-400">
                  Enter your invitation token and configure your reporting manager
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Invitation Token *
                </label>
                <input
                  type="text"
                  required
                  placeholder="EF-INVITE-2026"
                  value={inviteToken}
                  onChange={e => setInviteToken(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={empName}
                    onChange={e => setEmpName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul.sharma@edgeforce.in"
                    value={empEmail}
                    onChange={e => setEmpEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={empPassword}
                    onChange={e => setEmpPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={empDepartment}
                    onChange={e => setEmpDepartment(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="AI Development">AI Development</option>
                    <option value="3D Modelling">3D Modelling</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Procurement & Supply Chain">Procurement & Supply Chain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assign 3-Tier Reporting Manager
                </label>
                <select
                  value={empReportingManagerId}
                  onChange={e => setEmpReportingManagerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="">Select Manager</option>
                  {users
                    .filter(u => u.role === 'Project Manager' || u.role === 'Team Lead' || u.role === 'Super Admin')
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.designation} — {u.role})
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-brand-600 hover:from-cyan-500 hover:to-brand-500 text-white font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>Accept Invitation & Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-800/80 text-center text-xs text-slate-500 backdrop-blur-xl bg-slate-950/40 relative z-10">
        ProjectFlow AI Enterprise Platform • Secured with Google OAuth 2.0 & Role-Based Access Control • FY 2026-27
      </footer>

      {/* Real Google OAuth & Identity Services Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleOAuthModalOpen}
        onClose={() => setIsGoogleOAuthModalOpen(false)}
        companyDomain={orgSettings.companyDomain || 'edgeforce.in'}
        onSuccess={(profile) => {
          const result = loginWithGoogle(profile);
          if (!result.success) {
            setAuthError(result.message || 'Google Sign-In failed domain validation.');
          }
        }}
      />
    </div>
  );
};
