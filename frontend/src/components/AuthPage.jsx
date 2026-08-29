import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  Mail,
  Lock,
  User,
  Store,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  Database,
  Zap,
  PackageCheck,
} from 'lucide-react';

export const AuthPage = () => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('customer');
  const [regStoreName, setRegStoreName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(loginEmail, loginPassword);
      if (!result.success) {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (regRole === 'vendor' && !regStoreName.trim()) {
      setError('Please provide a store name');
      return;
    }

    setSubmitting(true);
    try {
      const result = await register(regName, regEmail, regPassword, regRole, regStoreName);
      if (!result.success) {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.1] mb-4">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">MarketPulse</h1>
          <p className="text-sm text-slate-400 mt-1">Multi-Vendor Marketplace Platform</p>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="neo-card p-6 sm:p-8 space-y-5">
            {/* Tabs */}
            <div className="flex items-center border-b border-white/[0.06] pb-3 gap-1">
              <button
                onClick={() => { setMode('login'); setError(null); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                  mode === 'login'
                    ? 'bg-white text-[#090a0f]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); setError(null); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                  mode === 'register'
                    ? 'bg-white text-[#090a0f]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/[0.06] border border-rose-500/20 flex items-center gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ─── Login ─── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:border-white/[0.2] focus:bg-white/[0.05] transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:border-white/[0.2] focus:bg-white/[0.05] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full neo-btn-primary text-sm flex items-center justify-center gap-2 py-2.5 disabled:opacity-50"
                >
                  {submitting ? 'Signing in...' : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { setMode('register'); setError(null); }} className="text-white font-semibold hover:underline">
                    Create one
                  </button>
                </p>
              </form>
            )}

            {/* ─── Register ─── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:border-white/[0.2] focus:bg-white/[0.05] transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:border-white/[0.2] focus:bg-white/[0.05] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:border-white/[0.2] focus:bg-white/[0.05] transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:border-white/[0.2] focus:bg-white/[0.05] transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="rounded bg-white/[0.05] border-white/[0.12] text-indigo-500 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>Show passwords</span>
                  </label>
                </div>

                {/* Role Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Account Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('customer')}
                      className={`p-3 rounded-xl border text-left transition ${
                        regRole === 'customer'
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Customer</span>
                      </div>
                      <div className="text-[10px] opacity-70 mt-0.5">Browse & purchase products</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('vendor')}
                      className={`p-3 rounded-xl border text-left transition ${
                        regRole === 'vendor'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Store className="w-3.5 h-3.5" />
                        <span>Vendor</span>
                      </div>
                      <div className="text-[10px] opacity-70 mt-0.5">Open your own store & sell</div>
                    </button>
                  </div>
                </div>

                {regRole === 'vendor' && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-semibold text-slate-300">Store Name</label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={regStoreName}
                        onChange={(e) => setRegStoreName(e.target.value)}
                        placeholder="My Awesome Store"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:border-white/[0.2] focus:bg-white/[0.05] transition"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full neo-btn-primary text-sm flex items-center justify-center gap-2 py-2.5 disabled:opacity-50"
                >
                  {submitting ? 'Creating Account...' : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setMode('login'); setError(null); }} className="text-white font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* Feature chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: Shield, label: 'JWT Authentication' },
              { icon: Database, label: 'MongoDB Atlas' },
              { icon: Zap, label: 'Real-time Inventory' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[10px] text-slate-500 font-mono">
                <f.icon className="w-3 h-3" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-mono text-slate-600">
          © {new Date().getFullYear()} MarketPulse. All rights reserved.
        </div>
      </div>
    </div>
  );
};
