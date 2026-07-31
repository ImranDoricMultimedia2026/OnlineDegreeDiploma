import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword: password
      });
      if (res.data.success) {
        setSuccess(true);
      } else {
        setError(res.data.message || 'Reset failed');
      }
    } catch (err) {
      setError('Server error resetting password.');
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
        <h2 className="text-2xl sm:text-3xl font-black text-[#333333]">Set New Password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-gray-100 sm:px-10 space-y-6">
          {success ? (
            <div className="space-y-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-black text-[#333333]">Password Updated!</h3>
              <p className="text-xs text-gray-600">Your account password has been updated successfully.</p>
              <Link
                to="/login"
                className="inline-block bg-[#FA394A] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
              >
                Proceed to Login
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
                <label className="block text-xs font-bold text-[#333333] mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
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
                  <span>Saving Password...</span>
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
