"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Loader2, Key } from 'lucide-react';

const API = 'http://127.0.0.1:8000/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await axios.post(`${API}/auth/send-otp/`, { email });
      setOtpSent(true);
      setSuccess('Security code dispatched — check your inbox.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(''); setSuccess(''); setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password/`, { email, code: otp, password: newPassword });
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Try again.');
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
        
        {/* Left Branding */}
        <div className="hidden lg:flex w-1/2 bg-[#0a0f1a] relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none opacity-40" />
          <div className="relative z-10">
            <Link href="/">
              <Image src="/icon_logo.png" alt="NexCart" width={150} height={50} className="brightness-0 invert h-10 w-auto object-contain" />
            </Link>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                <span>Security Core</span>
              </div>
              <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">
                Recover <br /><span className="text-emerald-400">Access.</span>
              </h1>
              <p className="text-gray-400 text-base font-medium max-w-[280px] leading-relaxed">
                Vault recovery powered by secure OTP verification.
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">© 2026 NEXCART SYSTEMS</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-1/2 p-10 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full space-y-7">
            <div className="space-y-1.5 text-center lg:text-left">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recovery.</h2>
              <p className="text-gray-400 text-sm font-semibold">Restore your neural link access.</p>
            </div>

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

            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div className="relative group">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">
                    Registered Email
                  </label>
                  <div className="relative">
                    <input type="email" required placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg disabled:opacity-60">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>SEND RECOVERY CODE <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="relative group">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block text-center">
                    6-Digit Recovery Code
                  </label>
                  <input type="text" required maxLength="6" placeholder="······"
                    className="w-full text-center py-4 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-black text-2xl tracking-[0.4em] text-emerald-600"
                    value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
                </div>

                <div className="relative group">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">
                    New Access Key
                  </label>
                  <div className="relative">
                    <input type="password" required placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">
                    Confirm Access Key
                  </label>
                  <div className="relative">
                    <input type="password" required placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-60">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>RECOVER IDENTITY <ArrowRight className="w-5 h-5" /></>}
                </button>

                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setError(''); setSuccess(''); }}
                  className="w-full text-[11px] font-black text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest">
                  ← Re-enter email
                </button>
              </form>
            )}

            <div className="pt-2 text-center">
              <Link href="/login" className="text-[11px] font-bold text-gray-400 hover:text-emerald-600 uppercase tracking-widest">
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
