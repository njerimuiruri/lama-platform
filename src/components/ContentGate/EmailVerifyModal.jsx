'use client';

import { useState } from 'react';
import { Mail, ChevronRight, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function EmailVerifyModal({ onUnlock, onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotFound(false);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/gate/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 404 || data.found === false) {
        setNotFound(true);
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }

      onUnlock();
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-t-2xl px-6 pt-8 pb-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 rounded-full p-2">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium uppercase tracking-wide text-green-100">
            Returning Visitor
          </span>
        </div>
        <h2 className="text-2xl font-bold leading-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-green-100 text-sm leading-relaxed">
          Enter the email you used to register and we&apos;ll unlock the content instantly.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4" noValidate>
        {/* Email field */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Registered Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
                setNotFound(false);
              }}
              placeholder="you@example.com"
              autoFocus
              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${error || notFound ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        {/* Not found message */}
        {notFound && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <p className="text-sm text-amber-800 font-medium">Email not found</p>
            <p className="text-xs text-amber-700 mt-0.5">
              This email isn&apos;t registered yet.{' '}
              <button
                type="button"
                onClick={onSwitchMode}
                className="underline font-semibold hover:text-amber-900 transition-colors"
              >
                Complete the full form
              </button>{' '}
              to get access.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Unlock Content
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Back to full form */}
        <button
          type="button"
          onClick={onSwitchMode}
          className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          First time here? Register for access
        </button>
      </form>
    </div>
  );
}
