"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = recaptchaRef.current.getValue();
    if (!token) {
      setError("Please complete the reCAPTCHA");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Adjusted for common development environments
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          password: formData.password,
          first_name: formData.name,
          recaptcha_token: token
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

      setSuccess("Identity Protocol Registered! Security Code Dispatched...");
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-emerald-100/40 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-[980px] flex bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white min-h-[640px] flex-row-reverse text-[15px]">
        
        {/* Branding Section */}
        <div className="hidden lg:flex w-1/2 bg-[#0a1421] relative p-12 flex-col justify-between overflow-hidden">
           <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
           
           <div className="relative z-10">
              <Link href="/">
                <Image src="/icon_logo.png" alt="NexCart" width={150} height={50} className="brightness-0 invert h-10 w-auto object-contain" />
              </Link>
           </div>

           <div className="relative z-10 space-y-6">
              <div className="space-y-3">
                 <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    <span>Neural Network</span>
                 </div>
                 <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">
                    NexCart <br />
                    <span className="text-blue-400">Ecosystem.</span>
                 </h1>
                 <p className="text-gray-400 text-base font-medium max-w-[280px]">
                    Join the ecosystem of predictive commerce insights.
                 </p>
              </div>
           </div>

           <div className="relative z-10">
              <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 space-y-3">
                 <p className="text-white text-xs font-bold italic leading-relaxed">"Accurate style forecasting at your fingertips."</p>
                 <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 shadow-lg" />
                    <div>
                       <p className="text-white text-[9px] font-black">Core Dev</p>
                       <p className="text-white/40 text-[8px]">System Verification</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-10 sm:p-12 flex flex-col justify-center bg-white">
           <div className="max-w-sm mx-auto w-full space-y-8">
              
              <div className="space-y-1.5 text-center lg:text-left">
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Register.</h2>
                 <p className="text-gray-400 text-sm font-semibold">Join the predictive commerce revolution.</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in shake duration-500">
                   <div className="w-1 h-1 rounded-full bg-red-500" />
                   <p className="text-[11px] font-bold text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                   <p className="text-[11px] font-bold text-emerald-600 tracking-tight">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                 <div className="space-y-4">
                    
                    <div className="relative group">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-blue-600 transition-colors">Identity Name</label>
                       <div className="relative">
                          <input 
                            type="text" required placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-bold text-sm text-gray-900"
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                       </div>
                    </div>

                    <div className="relative group">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-blue-600 transition-colors">Workspace Mail</label>
                       <div className="relative">
                          <input 
                            type="email" required placeholder="john@example.com"
                            className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-bold text-sm text-gray-900"
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <div className="relative group">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-blue-600 transition-colors">Secret</label>
                          <div className="relative">
                             <input 
                               type="password" required minLength="6" placeholder="••••••••"
                               className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-bold text-sm text-gray-900"
                               value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                             />
                             <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                       </div>
                       <div className="relative group">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1.5 block group-focus-within:text-blue-600 transition-colors">Confirm</label>
                          <div className="relative">
                             <input 
                               type="password" required minLength="6" placeholder="••••••••"
                               className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-bold text-sm text-gray-900"
                               value={formData.confirm_password} onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                             />
                             <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-center transform scale-[0.8] py-1">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    />
                 </div>

                 <button 
                   type="submit" disabled={loading}
                   className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg mt-2 tracking-widest"
                 >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>CREATE IDENTITY <ArrowRight className="w-5 h-5" /></>}
                 </button>
              </form>

              <div className="pt-4 text-center">
                 <p className="text-[11px] font-bold text-gray-400">
                    ALREADY PART OF THE NETWORK?{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 underline underline-offset-4">
                       LOG IN TO HUB
                    </Link>
                 </p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
