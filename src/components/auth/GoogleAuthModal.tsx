import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { formatINR } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Mail,
  Building2,
  User,
  KeyRound,
  X,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Users
} from 'lucide-react';
import { User as UserType } from '../../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, loginWithGoogleUser, orgSettings, logAction } = useApp();

  const [authStep, setAuthStep] = useState<'account_select' | 'two_factor' | 'new_invite' | 'company_details'>('account_select');
  const [selectedGoogleUser, setSelectedGoogleUser] = useState<UserType | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [domainError, setDomainError] = useState('');

  // New Employee Onboarding details
  const [empId, setEmpId] = useState('EF-2026-110');
  const [department, setDepartment] = useState('Unity Development');
  const [designation, setDesignation] = useState('Senior Simulation Engineer');
  const [monthlySalary, setMonthlySalary] = useState('110000');
  const [reportingManagerId, setReportingManagerId] = useState('usr-2');

  if (!isOpen) return null;

  const handleSelectAccount = (user: UserType) => {
    // Check company domain restriction
    if (orgSettings.enforceCompanyDomain && user.companyDomain !== orgSettings.companyDomain) {
      setDomainError(`Only verified accounts from @${orgSettings.companyDomain} are permitted.`);
      return;
    }

    setDomainError('');
    setSelectedGoogleUser(user);

    // If Admin/Super Admin, require 2FA
    if (user.role === 'Super Admin' || user.role === 'Organization Admin' || user.twoFactorEnabled) {
      setAuthStep('two_factor');
    } else {
      finalizeLogin(user);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.trim() === '123456' || twoFactorCode.trim().length === 6) {
      setTwoFactorError(false);
      if (selectedGoogleUser) {
        finalizeLogin(selectedGoogleUser);
      }
    } else {
      setTwoFactorError(true);
    }
  };

  const finalizeLogin = (user: UserType) => {
    loginWithGoogleUser(user);
    onClose();
  };

  const handleJoinWithInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !customEmail.trim()) return;

    if (orgSettings.enforceCompanyDomain && !customEmail.endsWith(`@${orgSettings.companyDomain}`)) {
      setDomainError(`Invitation valid only for official domain @${orgSettings.companyDomain}`);
      return;
    }

    setAuthStep('company_details');
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserType = {
      id: `usr-${Date.now()}`,
      employeeId: empId,
      name: customEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      email: customEmail,
      googleEmail: customEmail,
      googleId: `google-uid-${Date.now()}`,
      isGoogleVerified: true,
      companyDomain: orgSettings.companyDomain,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Developer/Member',
      department,
      designation,
      grade: 'L3 - Specialist',
      branch: 'Bengaluru HQ (Whitefield)',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Permanent',
      skills: ['Simulation', 'Agile Delivery'],
      functionalManagerId: reportingManagerId,
      departmentHeadId: reportingManagerId,
      administrativeManagerId: reportingManagerId,
      monthlySalaryINR: Number(monthlySalary) || 85000,
      hourlyCostINR: Math.round((Number(monthlySalary) || 85000) / 160),
      dailyCostINR: Math.round((Number(monthlySalary) || 85000) / 20),
      billableRateINR: 1800,
      availabilityHoursPerWeek: 40,
      projectAllocations: [],
      status: 'Active',
    };

    finalizeLogin(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0b1324] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header with Google Logo & Brand */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google G SVG */}
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md">
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
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <span>Google Workspace SSO</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  OAuth 2.0
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Enterprise Single Sign-On for <strong className="text-brand-300">@{orgSettings.companyDomain}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {domainError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{domainError}</span>
            </div>
          )}

          {/* STEP 1: Account Selection */}
          {authStep === 'account_select' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Choose a Verified Account
                </span>
                <span className="text-[11px] text-brand-400 font-medium">
                  {users.filter(u => u.isGoogleVerified).length} Verified Accounts
                </span>
              </div>

              {/* Account list */}
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {users
                  .filter(u => u.isGoogleVerified)
                  .map(user => {
                    const isCurrent = currentUser.id === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelectAccount(user)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-brand-950/30 border-brand-500/50 shadow-glow-brand ring-1 ring-brand-500/40'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              {user.twoFactorEnabled && (
                                <span title="2FA Required">
                                  <Lock className="w-3 h-3 text-amber-400" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {user.googleEmail || user.email}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {user.designation} • {user.department}
                            </div>
                          </div>
                        </div>

                        <Badge
                          variant={
                            user.role === 'Super Admin'
                              ? 'purple'
                              : user.role === 'Project Manager'
                              ? 'primary'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {user.role}
                        </Badge>
                      </div>
                    );
                  })}
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setAuthStep('new_invite')}
                  className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Join with Invitation Code</span>
                </button>

                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Domain Restricted: @edgeforce.in</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 2-Factor Authentication */}
          {authStep === 'two_factor' && selectedGoogleUser && (
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">
                  Two-Factor Authentication Required
                </h4>
                <p className="text-xs text-slate-400">
                  Enter the 6-digit Google Authenticator OTP for <strong className="text-slate-200">{selectedGoogleUser.googleEmail}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono p-3 bg-slate-950 border border-slate-700 rounded-2xl text-slate-100 focus:outline-none focus:border-brand-500"
                  autoFocus
                />
                {twoFactorError && (
                  <p className="text-[11px] text-rose-400 text-center font-medium">
                    Invalid 2FA code. Try demo code <code className="text-slate-200 font-bold">123456</code>.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthStep('account_select')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold shadow-glow-brand"
                >
                  Verify & Sign In
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Join with Invitation Code */}
          {authStep === 'new_invite' && (
            <form onSubmit={handleJoinWithInvite} className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">
                  Employee Invitation Onboarding
                </h4>
                <p className="text-xs text-slate-400">
                  Enter your company Google email and 8-character invitation token from your admin
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Google Email</label>
                  <input
                    type="email"
                    placeholder="firstname.lastname@edgeforce.in"
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Invitation Code</label>
                  <input
                    type="text"
                    placeholder="EF-INVITE-2026"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthStep('account_select')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold shadow-glow-brand"
                >
                  Verify Invitation
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Company Profile Registration */}
          {authStep === 'company_details' && (
            <form onSubmit={handleCompleteOnboarding} className="space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">
                  Company HR Profile & Manpower Setup
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Configuring enterprise designation, department, and salary parameters in INR
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={empId}
                    onChange={e => setEmpId(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  >
                    {orgSettings.departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Monthly Cost (₹)</label>
                  <input
                    type="number"
                    value={monthlySalary}
                    onChange={e => setMonthlySalary(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Primary Reporting Manager</label>
                <select
                  value={reportingManagerId}
                  onChange={e => setReportingManagerId(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                >
                  {users
                    .filter(u => u.role === 'Project Manager' || u.role === 'Team Lead' || u.role === 'Super Admin')
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.designation})
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold shadow-glow-brand"
              >
                Complete Onboarding & Enter Workspace
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
