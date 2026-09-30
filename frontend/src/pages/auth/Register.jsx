import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Phone,
  UserPlus,
  AlertCircle,
  UserCheck,
  Headphones,
  ShieldCheck,
} from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerOnly } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await registerOnly({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role || 'user',
        password: formData.password,
        phone: formData.phone,
      });

      navigate(`/login?registered=true&email=${encodeURIComponent(formData.email.trim())}`, {
        replace: true,
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Create an account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Get started with SupportDesk to submit and track support requests
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Registering For (Account Role) *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'user' }))}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                formData.role === 'user'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  formData.role === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                }`}
              >
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">User</span>
                <span className="text-[10px] text-slate-400 block">Create Tickets</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'agent' }))}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                formData.role === 'agent'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  formData.role === 'agent' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">Agent</span>
                <span className="text-[10px] text-slate-400 block">Resolve Tickets</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'admin' }))}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                formData.role === 'admin'
                  ? 'bg-purple-50 border-purple-500 text-purple-700 font-semibold ring-2 ring-purple-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  formData.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">Admin</span>
                <span className="text-[10px] text-slate-400 block">Manage System</span>
              </div>
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Phone (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              name="phone"
            
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/25 transition-all"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          <span>Create Account & Proceed to Sign In</span>
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
};

export default Register;
