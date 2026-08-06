import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Lock, Mail, AlertCircle, Sparkles, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => (location.state as any)?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registeredMessage = (location.state as any)?.registeredMessage;
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate(from === '/admin' ? '/dashboard' : from);
      }
    } else {
      setError(res.message);
    }
  };

  const fillStudentDemo = () => {
    setEmail('student@example.com');
    setPassword('student123');
    setError('');
  };

  const fillAdminDemo = () => {
    setEmail('admin@onlinedegreediploma.com');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FA394A] flex items-center justify-center text-white shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-[#333333]">Sign In to Your Account</h2>
        <p className="text-xs text-gray-500 font-medium">
          Access your student portal, track applications, or manage university records.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-gray-100 sm:px-10 space-y-6">
          {/* Quick Demo Login Credentials Bar */}
          <div className="bg-[#FFE8EA] p-3.5 rounded-2xl border border-[#FA394A]/20 space-y-2">
            <p className="text-[11px] font-extrabold text-[#FA394A] uppercase flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Quick Demo One-Click Login:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillStudentDemo}
                className="bg-white hover:bg-gray-50 text-[#333333] border border-gray-300 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1"
              >
                <User className="w-3 h-3 text-[#FA394A]" />
                <span>Student Login</span>
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="bg-[#333333] hover:bg-black text-white py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {registeredMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center shadow-sm">
                <ShieldCheck className="w-4 h-4 mr-2 shrink-0 text-emerald-600" />
                <span className="font-semibold">{registeredMessage}</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com or admin@..."
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#333333]">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-[#FA394A] font-bold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] outline-none font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-[#FA394A]/20 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
            Don't have a student account yet?{' '}
            <Link to="/register" className="font-extrabold text-[#FA394A] hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
