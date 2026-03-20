"use client";

import React, { useEffect, useState, Suspense, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (/^\d$/.test(char) && index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    
    // Focus last filled or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex].focus();
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the 6-digit security code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/verify-email/', { 
        email, 
        code 
      });
      setSuccess(response.data.message || 'Identity verified successfully!');
      setTimeout(() => router.push('/login?verified=true'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Code may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Missing email identity. Please try registering again.');
      return;
    }

    setResending(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/send-otp/', { email });
      setSuccess('A fresh security code has been dispatched to your mail.');
    } catch (err) {
      setError('Failed to resend code. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (otp.every(digit => digit !== '') && !loading && !success) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white p-8 sm:p-12 text-center space-y-8">
        
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 relative">
             <ShieldCheck className="w-8 h-8" />
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Verify Identity.</h1>
          <p className="text-gray-400 text-sm font-semibold max-w-xs mx-auto">
            We've sent a 6-digit security code to <br />
            <span className="text-blue-600">{email || 'your registered mail'}</span>
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
             <p className="text-xs font-bold text-red-600 text-left">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
             <p className="text-xs font-bold text-emerald-600 text-left tracking-tight">{success}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex justify-between gap-2 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-full h-14 sm:h-16 text-center text-2xl font-black bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-gray-900"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.some(d => d === '')}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg tracking-widest uppercase"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Authorize Access <ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>

        <div className="pt-4 border-t border-gray-50 flex flex-col items-center gap-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-[11px] font-bold text-gray-400 hover:text-blue-600 flex items-center gap-2 transition-colors group"
          >
            {resending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            )}
            DIDN'T RECEIVE THE CODE? RESEND
          </button>

          <Link href="/login" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
            Back to Login Portal
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
