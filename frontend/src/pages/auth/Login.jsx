import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  CheckCircle,
  User,
  UserPlus,
  Phone,
  ShieldCheck,
  Headphones,
  UserCheck,
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, registerOnly, logout, isAuthenticated } = useAuth();

  // Active tab: 'login' or 'register'
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const initialEmail = searchParams.get('email') || '';

  const [activeTab, setActiveTab] = useState(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState(initialEmail);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);


  // Register form state (Standard User registration)
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  // Feedback alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    searchParams.get('registered') === 'true'
      ? 'Account created successfully! Please enter your password to Sign In.'
      : ''
  );

  useEffect(() => {
    if (searchParams.get('tab') === 'register') {
      setActiveTab('register');
    }
  }, [location.search]);

  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please provide both email and password');
      return;
    }

    try {
      setLoginLoading(true);
      const user = await login(loginEmail.trim(), loginPassword.trim());

      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'agent') {
        navigate('/agent/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register submission -> switch to Login tab for authentication
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!registerData.name || !registerData.email || !registerData.password) {
      setErrorMessage('Please fill in all required fields (Name, Email, Password)');
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setRegisterLoading(true);
      await registerOnly({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        role: registerData.role || 'user',
        password: registerData.password,
        phone: registerData.phone,
      });

      // Clear register form, fill login email, switch tab, and show success message
      setLoginEmail(registerData.email.trim());
      setLoginPassword('');

      setSuccessMessage(
        `🎉 ${registerData.role.toUpperCase()} account created successfully! Please enter your password to Sign In.`
      );

      setRegisterData({
        name: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: '',
        phone: '',
      });

      setActiveTab('login');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div>
      {/* Tab Switcher: Sign In / Register */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setErrorMessage('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'login'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            setErrorMessage('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'register'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Account</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {activeTab === 'login' ? 'Sign in to SupportDesk' : 'Create an Account'}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {activeTab === 'login'
            ? 'Enter your email and password to access your dashboard'
            : 'Fill in your details to create a new user account'}
        </p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-semibold">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: SIGN IN */}
      {activeTab === 'login' && (
        <>
          {/* Active Session Notification if already logged in */}
          {isAuthenticated && user && (
            <div className="mb-5 p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="truncate text-slate-600">
                  Signed in: <strong className="text-slate-800">{user.name}</strong> ({user.role})
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (user.role === 'admin') navigate('/admin/dashboard');
                    else if (user.role === 'agent') navigate('/agent/dashboard');
                    else navigate('/user/dashboard');
                  }}
                  className="px-2 py-1 text-xs font-semibold text-indigo-700 bg-white border border-slate-200 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="px-2 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
            
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/25 transition-all"
            >
              {loginLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Sign In</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Register here
            </button>
          </div>
        </>
      )}

      {/* TAB 2: REGISTER */}
      {activeTab === 'register' && (
        <>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Registering For (Account Role) *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterData((prev) => ({ ...prev, role: 'user' }))}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    registerData.role === 'user'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      registerData.role === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
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
                  onClick={() => setRegisterData((prev) => ({ ...prev, role: 'agent' }))}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    registerData.role === 'agent'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      registerData.role === 'agent' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
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
                  onClick={() => setRegisterData((prev) => ({ ...prev, role: 'admin' }))}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    registerData.role === 'admin'
                      ? 'bg-purple-50 border-purple-500 text-purple-700 font-semibold ring-2 ring-purple-500/20 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      registerData.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
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
                  value={registerData.name}
                  onChange={handleRegisterChange}
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
                  value={registerData.email}
                  onChange={handleRegisterChange}
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
                  value={registerData.phone}
                  onChange={handleRegisterChange}
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
                    value={registerData.password}
                    onChange={handleRegisterChange}
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
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/25 transition-all"
            >
              {registerLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>Create Account & Proceed to Sign In</span>
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign in here
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
