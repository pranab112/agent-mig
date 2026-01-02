import React, { useState } from 'react';
import { UserRole } from '../types';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay and security handshake
    setTimeout(() => {
      if (email === 'admin@mindisgear.com' && password === 'admin123') {
        onLogin('ADMIN', email);
      } else if (email === 'alex@mindisgear.com' && password === 'agent123') {
        onLogin('AGENT', email);
      } else {
        setError('Invalid credentials. Please check your email and password.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-900">
      {/* Left Side - Branding / Visuals */}
      <div className="hidden lg:flex w-1/2 bg-slate-800 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 opacity-90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="Network Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 p-12 text-white max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Mind is Gear</h1>
          </div>
          <h2 className="text-2xl font-light mb-6 text-blue-100">Advanced Referral Intelligence System</h2>
          <p className="text-slate-400 leading-relaxed text-lg">
            Manage your network, visualize commissions, and leverage MIG AI to close deals faster. Secure access for authorized agents and administrators only.
          </p>
          
          <div className="mt-12 flex space-x-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">99.9%</span>
              <span className="text-sm text-slate-500 uppercase tracking-wider">Uptime</span>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
             <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">256-bit</span>
              <span className="text-sm text-slate-500 uppercase tracking-wider">Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to access your dashboard</p>
          </div>

          {/* Demo Credentials Hint */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
             <p className="font-bold mb-1">Demo Credentials:</p>
             <div className="flex justify-between">
               <span>Admin: admin@mindisgear.com</span>
               <span>Pass: admin123</span>
             </div>
             <div className="flex justify-between mt-1">
               <span>Agent: alex@mindisgear.com</span>
               <span>Pass: agent123</span>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-slate-400">
            Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;