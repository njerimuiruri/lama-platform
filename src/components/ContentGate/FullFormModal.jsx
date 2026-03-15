'use client';

import { useState } from 'react';
import { Lock, User, Mail, Globe, Building2, FileText, ChevronRight, Loader2 } from 'lucide-react';

const COUNTRIES = [
  'Kenya', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Somalia',
  'Sudan', 'South Sudan', 'DR Congo', 'Mozambique', 'Zambia', 'Zimbabwe',
  'Malawi', 'Madagascar', 'South Africa', 'Nigeria', 'Ghana', 'Senegal',
  'Cameroon', 'Ivory Coast', 'Egypt', 'Morocco', 'Tunisia', 'Algeria',
  'United Kingdom', 'United States', 'Canada', 'Germany', 'France',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Belgium',
  'India', 'China', 'Japan', 'Australia', 'Brazil', 'Other',
];


const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  organization: '',
  purpose: '',
};

export default function FullFormModal({ onUnlock, onSwitchMode }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.country) e.country = 'Please select your country';
    if (!form.purpose.trim()) e.purpose = 'Please describe your purpose';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/gate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.message || 'Something went wrong. Please try again.');
        return;
      }

      onUnlock();
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-t-2xl px-6 pt-8 pb-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 rounded-full p-2">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium uppercase tracking-wide text-green-100">
            Premium Content
          </span>
        </div>
        <h2 className="text-2xl font-bold leading-tight">
          Unlock Full Access to LAMA Platform
        </h2>
        <p className="mt-2 text-green-100 text-sm leading-relaxed">
          Join researchers, policymakers, and development practitioners accessing
          climate adaptation data across Africa.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4" noValidate>
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {serverError}
          </div>
        )}

        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Jane"
                className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
                autoFocus
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane.doe@example.com"
              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition appearance-none bg-no-repeat ${
                errors.country ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
              } ${!form.country ? 'text-gray-400' : 'text-gray-800'}`}
            >
              <option value="" disabled>Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {errors.country && (
            <p className="mt-1 text-xs text-red-500">{errors.country}</p>
          )}
        </div>

        {/* Organization */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Organization <span className="text-gray-400 font-normal normal-case">(optional)</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="organization"
              value={form.organization}
              onChange={handleChange}
              placeholder="University, NGO, Ministry..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Purpose of Visit <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="Describe your reason for visiting (e.g. research, policy work, journalism...)"
              rows={3}
              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none ${
                errors.purpose ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>
          {errors.purpose && (
            <p className="mt-1 text-xs text-red-500">{errors.purpose}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue Viewing
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Already registered link */}
        <p className="text-center text-sm text-gray-500 pb-2">
          Already registered?{' '}
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-green-700 hover:text-green-800 font-semibold underline underline-offset-2 transition-colors"
          >
            Enter your email to unlock
          </button>
        </p>
      </form>
    </div>
  );
}
