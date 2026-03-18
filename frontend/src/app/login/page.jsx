"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';

export default function Login() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Setup Firebase Recaptcha
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username: email,
        password: password
      });

      // Save tokens
      Cookies.set('access_token', response.data.access);
      Cookies.set('refresh_token', response.data.refresh);
      
      router.push('/products');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
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
      setError(err.message || 'Failed to send OTP.');
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
      const user = result.user;
      
      // In a real flow, you would now exchange the Firebase token with a Django token securely
      // For now, we simulate success
      alert('Firebase Login Success! Redirecting...');
      router.push('/products');

    } catch (err) {
      setError('Invalid OTP Code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`flex-1 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'email' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setActiveTab('email'); setError(''); }}
        >
          Email & Password
        </button>
        <button 
          className={`flex-1 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'phone' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setActiveTab('phone'); setError(''); }}
        >
          Phone (OTP)
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Unconditionally render recaptcha-container but hide it if needed */}
      <div id="recaptcha-container"></div>

      {/* Email Login Form */}
      {activeTab === 'email' && (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      )}

      {/* Phone OTP Login Form */}
      {activeTab === 'phone' && (
        <div className="space-y-4">
          
          {!confirmationResult ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (with Country Code e.g. 919876543210)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +
                  </span>
                  <input 
                    type="text" required placeholder="919876543210"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit" disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit OTP code sent to +{phone}</label>
                <input 
                  type="text" required maxLength="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 tracking-widest text-center text-lg"
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Log In'}
              </button>
            </form>
          )}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account? <a href="/register" className="text-emerald-600 hover:underline">Register</a>
      </p>
    </div>
  );
}
