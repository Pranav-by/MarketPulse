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
  Sparkles,
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
    <div className="min-h-screen bg-[#5B85FA] brutal-grid-bg flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Sticker */}
      <div className="text-center mb-8 animate-pop-in">
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-[#FEF08A] border-3 border-black shadow-brutal-lg mb-3 rotate-[-2deg]">
          <Layers className="w-8 h-8 text-black" />
          <span className="font-display font-black text-2xl text-black ml-2 tracking-tight">MarketPulse</span>
        </div>
        <p className="text-xs font-mono font-bold bg-white text-black px-3 py-1 rounded-full border-2 border-black shadow-brutal-sm inline-block">
          ⚡ Multi-Vendor Marketplace Platform
        </p>
      </div>

      <div className="w-full max-w-md animate-pop-in">
        <div className="bg-white border-3 border-black rounded-2xl shadow-brutal-xl p-6 sm:p-8 space-y-5">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#F3F4F6] p-1.5 rounded-xl border-2 border-black">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-2 rounded-lg text-xs font-display font-black transition border-2 border-black ${
                mode === 'login'
                  ? 'bg-[#FEF08A] shadow-brutal-sm'
                  : 'bg-transparent border-transparent text-slate-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`py-2 rounded-lg text-xs font-display font-black transition border-2 border-black ${
                mode === 'register'
                  ? 'bg-[#FEF08A] shadow-brutal-sm'
                  : 'bg-transparent border-transparent text-slate-600 hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#FF6B97]/20 border-2 border-black flex items-center gap-2.5 text-xs font-bold text-black shadow-brutal-sm">
              <AlertCircle className="w-4 h-4 text-black flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ─── Login Form ─── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-mono tracking-wider text-black">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-black text-black placeholder-slate-400 font-semibold shadow-brutal-sm focus:bg-[#FEFCE8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-mono tracking-wider text-black">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border-2 border-black text-black placeholder-slate-400 font-semibold shadow-brutal-sm focus:bg-[#FEFCE8] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black hover:opacity-70"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-black font-display font-black text-sm border-2.5 border-black shadow-brutal flex items-center justify-center space-x-2 transition hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50"
              >
                {submitting ? 'Authenticating...' : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 bg-[#EBF3FE] border-2 border-black rounded-xl text-[11px] font-mono text-black space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Seeded Accounts Available:</span>
                </div>
                <div className="text-[10px]">
                  Customer: <span className="font-bold">customer@marketpulse.io</span> (Pass: <span className="font-bold">Password123!</span>)
                </div>
                <div className="text-[10px]">
                  Admin: <span className="font-bold">admin@marketpulse.io</span> (Pass: <span className="font-bold">Password123!</span>)
                </div>
              </div>
            </form>
          )}

          {/* ─── Register Form ─── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-black">Full Name *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-black text-black font-semibold shadow-brutal-sm focus:bg-[#FEFCE8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-black">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-black text-black font-semibold shadow-brutal-sm focus:bg-[#FEFCE8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-black">Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black text-black font-mono shadow-brutal-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-black">Confirm *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black text-black font-mono shadow-brutal-sm"
                  />
                </div>
              </div>

              {/* Role Picker */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-black">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('customer')}
                    className={`p-2.5 rounded-xl border-2 border-black text-left transition ${
                      regRole === 'customer'
                        ? 'bg-[#C4B5FD] shadow-brutal-sm font-black'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs">
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>Customer</span>
                    </div>
                    <div className="text-[9px] opacity-80 mt-0.5">Shop & track orders</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('vendor')}
                    className={`p-2.5 rounded-xl border-2 border-black text-left transition ${
                      regRole === 'vendor'
                        ? 'bg-[#6EE7B7] shadow-brutal-sm font-black'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs">
                      <Store className="w-3.5 h-3.5" />
                      <span>Vendor</span>
                    </div>
                    <div className="text-[9px] opacity-80 mt-0.5">Sell products</div>
                  </button>
                </div>
              </div>

              {regRole === 'vendor' && (
                <div className="space-y-1 animate-pop-in">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-black">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={regStoreName}
                    onChange={(e) => setRegStoreName(e.target.value)}
                    placeholder="Apex Robotics"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-black text-black font-semibold shadow-brutal-sm focus:bg-[#FEFCE8]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#6EE7B7] hover:bg-[#34D399] text-black font-display font-black text-sm border-2.5 border-black shadow-brutal flex items-center justify-center space-x-2 transition disabled:opacity-50 mt-2"
              >
                {submitting ? 'Registering...' : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
