"use client";

import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const recaptchaRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }

    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      return setError('Please complete the CAPTCHA');
    }

    setLoading(true);

    try {
      // Assuming backend runs on 8000
      const response = await axios.post('http://localhost:8000/api/auth/register/', {
        ...formData,
        recaptchaToken
      });
      
      setSuccess(true);
      // Wait a bit, then redirect to login
      setTimeout(() => router.push('/login'), 3000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed due to a server error.');
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border border-emerald-200 bg-emerald-50 rounded-xl shadow-sm text-center">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">Registration Successful!</h2>
        <p className="text-emerald-700">Please check your email to verify your account. Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create an Account</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" required minLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input 
            type="password" required minLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.confirm_password} onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
          />
        </div>

        <div className="flex justify-center pt-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-emerald-600 hover:underline">Log in</a>
      </p>
    </div>
  );
}
