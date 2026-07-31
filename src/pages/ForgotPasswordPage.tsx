import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage(res.data.message);
        if (res.data.resetToken) {
          setResetToken(res.data.resetToken);
        }
      } else {
        setError(res.data.message || 'Request failed');
      }
    } catch (err) {
      setError('Server error processing request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FA394A] flex items-center justify-center text-white shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-[#333333]">Reset Your Password</h2>
        <p className="text-xs text-gray-500 font-medium">
          Enter your registered student email address to receive password recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-gray-100 sm:px-10 space-y-6">
          {message ? (
            <div className="space-y-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <p className="text-xs text-gray-700 font-semibold">{message}</p>
              {resetToken && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs space-y-1">
                  <p className="font-extrabold text-amber-800">Development Reset Link:</p>
                  <Link
                    to={`/reset-password/${resetToken}`}
                    className="text-[#FA394A] font-bold underline break-all"
                  >
                    Click here to set new password →
                  </Link>
                </div>
              )}
              <Link to="/login" className="block text-xs font-bold text-[#FA394A] hover:underline pt-2">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
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
                  <span>Generating Reset Link...</span>
                ) : (
                  <>
                    <span>Send Password Reset Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs">
            <Link to="/login" className="font-bold text-[#333333] hover:text-[#FA394A]">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
