"use client";

import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('Invalid confirmation link.');
      setError(true);
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.post('http://localhost:8000/api/auth/verify-email/', { token });
        setStatus('Email verified successfully!');
        setTimeout(() => router.push('/login'), 3000);
      } catch (err) {
        setStatus('Verification failed. Token may be expired or invalid.');
        setError(true);
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-200 bg-white rounded-xl shadow-sm text-center">
      <h2 className={`text-2xl font-bold mb-2 ${error ? 'text-red-700' : 'text-emerald-700'}`}>
        {status}
      </h2>
      {!error && (
        <p className="text-gray-600 mt-2">Redirecting you to the login page...</p>
      )}
      {error && (
        <a href="/login" className="text-emerald-600 hover:underline mt-4 inline-block">Go to Login</a>
      )}
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
