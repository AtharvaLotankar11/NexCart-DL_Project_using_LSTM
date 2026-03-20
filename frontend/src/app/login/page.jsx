"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Loader2, Zap } from 'lucide-react';

const API = 'http://127.0.0.1:8000/api';

export default function Login() {
  const [activeTab, setActiveTab] = useState('email');

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Email OTP state
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      setSuccess('Identity Authenticated! Access to NexCart Grid Granted.');
    } else if (params.get('registered') === 'true') {
      setSuccess('Identity Protocol Initiated. Check your mail for the security code.');
    }
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    setOtpSent(false);
    setOtp('');
  };

  // ── Email + Password Login ──────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login/`, {
        username: email,
        password,
      });
      Cookies.set('access_token', data.access);
      Cookies.set('refresh_token', data.refresh);
      setSuccess('Neural Link Established! Accessing Hub...');
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // ── Send OTP ────────────────────────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await axios.post(`${API}/auth/send-otp/`, { email: otpEmail });
      setOtpSent(true);
      setSuccess('Security code dispatched — check your inbox.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/verify-otp/`, { email: otpEmail, code: otp });
      Cookies.set('access_token', data.access);
      Cookies.set('refresh_token', data.refresh);
      setSuccess('Identity Verified! Establishing Pulse...');
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect or expired OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-[980px] flex bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white min-h-[620px]">

        {/* ── Left: Branding ── */}
        <div className="hidden lg:flex w-1/2 bg-[#0a0f1a] relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none opacity-40" />

          <div className="relative z-10">
            <Link href="/">
              <Image src="/icon_logo.png" alt="NexCart" width={150} height={50}
                className="brightness-0 invert h-10 w-auto object-contain" />
            </Link>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>Neural Link</span>
              </div>
              <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">
                NexCart <br /><span className="text-emerald-400">Intelligence.</span>
              </h1>
              <p className="text-gray-400 text-base font-medium max-w-[280px] leading-relaxed">
                Personalized insights powered by deep learning research.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
              <div className="space-y-1.5">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <p className="text-white font-black text-sm">Secure Core</p>
                <p className="text-gray-500 text-[10px] font-bold">Encrypted Auth</p>
              </div>
              <div className="space-y-1.5">
                <Zap className="w-6 h-6 text-emerald-500" />
                <p className="text-white font-black text-sm">OTP Login</p>
                <p className="text-gray-500 text-[10px] font-bold">Passwordless</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">© 2026 NEXCART SYSTEMS</p>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="w-full lg:w-1/2 p-10 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full space-y-7">

            <div className="space-y-1.5 text-center lg:text-left">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Login.</h2>
              <p className="text-gray-400 text-sm font-semibold">Enter your workspace identity.</p>
            </div>

            {/* Tab switcher */}
            <div className="p-1 bg-gray-50 rounded-2xl flex gap-1">
              <button
                onClick={() => switchTab('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] transition-all uppercase tracking-widest ${activeTab === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Lock className="w-3.5 h-3.5" /> Password
              </button>
              <button
                onClick={() => switchTab('otp')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] transition-all uppercase tracking-widest ${activeTab === 'otp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Mail className="w-3.5 h-3.5" /> Email OTP
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-[11px] font-bold text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                <p className="text-[11px] font-bold text-emerald-600 tracking-tight">{success}</p>
              </div>
            )}

            {/* ── Password Tab ── */}
            {activeTab === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-5">
                <div className="relative group">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">
                    Workspace ID
                  </label>
                  <div className="relative">
                    <input type="email" required placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                </div>

                <div className="relative group">
                  <div className="flex justify-between items-center pr-3">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">
                      Access Key
                    </label>
                    <Link href="/forgot-password" className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
                      Lost?
                    </Link>
                  </div>
                  <div className="relative">
                    <input type="password" required placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900"
                      value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg disabled:opacity-60">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>ACCESS HUB <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            )}

            {/* ── Email OTP Tab ── */}
            {activeTab === 'otp' && (
              <div className="space-y-5">
                {!otpSent ? (
                  /* Step 1: enter email → request OTP */
                  <form onSubmit={handleSendOTP} className="space-y-5">
                    <div className="relative group">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">
                        Registered Email
                      </label>
                      <div className="relative">
                        <input type="email" required placeholder="name@company.com"
                          className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900"
                          value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg disabled:opacity-60">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>SEND CODE <ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </form>
                ) : (
                  /* Step 2: enter OTP */
                  <form onSubmit={handleVerifyOTP} className="space-y-5">
                    <div className="text-center space-y-1">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Code sent to</p>
                      <p className="text-sm font-black text-gray-900">{otpEmail}</p>
                    </div>

                    <div className="relative group">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block text-center">
                        6-Digit Security Code
                      </label>
                      <input type="text" required maxLength="6" placeholder="······"
                        className="w-full text-center py-5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-black text-3xl tracking-[0.4em] text-emerald-600"
                        value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-60">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>VERIFY &amp; LOGIN <ArrowRight className="w-5 h-5" /></>}
                    </button>

                    <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setError(''); setSuccess(''); }}
                      className="w-full text-[11px] font-black text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest">
                      ← Use a different email
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="pt-2 text-center">
              <p className="text-[11px] font-bold text-gray-400">
                NEW TO NEXCART?{' '}
                <Link href="/register" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  CREATE IDENTITY
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
