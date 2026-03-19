"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Phone, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';

export default function Login() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('email'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier && typeof window !== 'undefined') {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
        });
      } catch (e) {
        console.error("Firebase Recaptcha initialization failed", e);
      }
    }
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        username: email,
        password: password
      });

      Cookies.set('access_token', response.data.access);
      Cookies.set('refresh_token', response.data.refresh);
      
      router.push('/products');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmObj = await signInWithPhoneNumber(auth, `+${phone}`, appVerifier);
      setConfirmationResult(confirmObj);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your phone number format.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      alert('OTP Verified Successfully!');
      router.push('/products');
    } catch (err) {
      setError('The security code entered is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-[980px] flex bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white min-h-[620px]">
        
        {/* Left Section: Branding & Visual */}
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
                    <Sparkles className="w-3 h-3" />
                    <span>Neural Link</span>
                 </div>
                 <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">
                    NexCart <br />
                    <span className="text-emerald-400">Intelligence.</span>
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
                    <Phone className="w-6 h-6 text-emerald-500" />
                    <p className="text-white font-black text-sm">Rapid Sync</p>
                    <p className="text-gray-500 text-[10px] font-bold">Passwordless</p>
                 </div>
              </div>
           </div>

           <div className="relative z-10">
              <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">
                 © 2026 NEXCART SYSTEMS
              </p>
           </div>
        </div>

        {/* Right Section: Form */}
        <div className="w-full lg:w-1/2 p-10 sm:p-12 flex flex-col justify-center bg-white">
           <div className="max-w-sm mx-auto w-full space-y-8">
              
              <div className="space-y-1.5 text-center lg:text-left">
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Login.</h2>
                 <p className="text-gray-400 text-sm font-semibold">Enter your workspace identity.</p>
              </div>

              <div className="p-1 bg-gray-50 rounded-2xl flex gap-1">
                 <button 
                   onClick={() => { setActiveTab('email'); setError(''); }}
                   className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] transition-all uppercase tracking-widest ${activeTab === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   <Mail className="w-3.5 h-3.5" />
                   E-Mail
                 </button>
                 <button 
                    onClick={() => { setActiveTab('phone'); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] transition-all uppercase tracking-widest ${activeTab === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   <Phone className="w-3.5 h-3.5" />
                   Phone
                 </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                   <div className="w-1 h-1 rounded-full bg-red-500" />
                   <p className="text-[11px] font-bold text-red-600">{error}</p>
                </div>
              )}

              <div id="recaptcha-container"></div>

              <div className="mt-6">
                 {activeTab === 'email' ? (
                   <form onSubmit={handleEmailLogin} className="space-y-5">
                      <div className="space-y-5">
                        <div className="relative group">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">Workspace ID</label>
                           <div className="relative">
                              <input 
                                type="email" required placeholder="name@company.com"
                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                              />
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                           </div>
                        </div>

                        <div className="relative group">
                           <div className="flex justify-between items-center pr-3">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">Access Key</label>
                              <Link href="/forgot-password" title="Forgot Password?" className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Lost?</Link>
                           </div>
                           <div className="relative">
                              <input 
                                type="password" required placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                              />
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                           </div>
                        </div>
                      </div>

                      <button 
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg"
                      >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>ACCESS HUB <ArrowRight className="w-5 h-5" /></>}
                      </button>
                   </form>
                 ) : (
                   <div className="space-y-5">
                      {!confirmationResult ? (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                           <div className="relative group">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-emerald-500 transition-colors">Mobile Verification</label>
                              <div className="relative flex">
                                 <span className="inline-flex items-center px-4 bg-gray-50 border-l border-t border-b border-gray-100 rounded-l-2xl text-gray-400 font-bold tracking-widest text-xs">+</span>
                                 <input 
                                   type="text" required placeholder="919876543210"
                                   className="w-full px-4 py-3.5 bg-gray-50 border-gray-100 border border-l-0 rounded-r-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-sm text-gray-900 tracking-widest"
                                   value={phone} onChange={(e) => setPhone(e.target.value)}
                                 />
                              </div>
                           </div>
                           <button 
                              type="submit" disabled={loading}
                              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg"
                           >
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "REQUEST OTP"}
                           </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-5 animate-in zoom-in-95">
                           <div className="relative group text-center space-y-2">
                              <h4 className="text-lg font-black text-gray-900">Enter Code</h4>
                              <div className="mt-8">
                                <input 
                                  type="text" required maxLength="6"
                                  className="w-full text-center py-5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-black text-3xl tracking-[0.4em] text-blue-600"
                                  value={otp} onChange={(e) => setOtp(e.target.value)}
                                />
                              </div>
                           </div>
                           <button 
                              type="submit" disabled={loading}
                              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg"
                           >
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "COMPLETE LOGIN"}
                           </button>
                        </form>
                      )}
                   </div>
                 )}
              </div>

              <div className="pt-6 text-center">
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
