import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { LockClosedIcon, XCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '500ms' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-6 lg:max-w-lg">
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.02] hover:bg-white/15">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            {/* Logo */}
            <div className="relative mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:rotate-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">B</span>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 blur-xl opacity-20 animate-pulse"></div>
            </div>
            
            {/* Brand Name */}
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 text-transparent bg-clip-text drop-shadow-sm">
                BlinkIt
              </span>
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl font-semibold text-white/90 mb-2">Welcome back</h2>
            <p className="text-sm sm:text-base text-white/60">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-purple-300 hover:text-white font-semibold transition-colors duration-200 hover:underline underline-offset-2"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Error Message with Headless UI Transition */}
          <Transition
            show={!!error}
            enter="transition duration-300 ease-out"
            enterFrom="opacity-0 -translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition duration-200 ease-in"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-y-4 scale-95"
          >
            <div className="mb-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <XCircleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300 leading-relaxed">{error}</p>
              </div>
            </div>
          </Transition>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none hover:border-white/30 hover:bg-white/7 transition-all duration-300 text-base"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-4 pr-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none hover:border-white/30 hover:bg-white/7 transition-all duration-300 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white/70 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500/50 focus:ring-2 transition-all duration-200"
                  />
                </div>
                <span className="text-white/70 group-hover:text-white/90 transition-colors duration-200">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="font-semibold text-purple-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] text-base"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.64z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Bottom decoration */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-white/40">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;