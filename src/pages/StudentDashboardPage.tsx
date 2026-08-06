import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  User,
  FileText,
  Bookmark,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  BookOpen,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Save,
  Download
} from 'lucide-react';
import api from '../services/api';
import { Application, Enquiry, Notification, Program } from '../types';

export const StudentDashboardPage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'enquiries' | 'notifications' | 'profile'>('applications');

  const [applications, setApplications] = useState<Application[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [state, setState] = useState(user?.state || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let apps: Application[] = [];
      let enqs: Enquiry[] = [];

      try {
        const appRes = await api.get('/applications/my-applications');
        if (appRes.data.success && Array.isArray(appRes.data.applications)) {
          apps = appRes.data.applications;
        }
      } catch {
        const appRes = await api.get('/applications');
        if (appRes.data.success && Array.isArray(appRes.data.applications)) {
          apps = appRes.data.applications;
        }
      }

      try {
        const enqRes = await api.get('/enquiries/my-enquiries');
        if (enqRes.data.success && Array.isArray(enqRes.data.enquiries)) {
          enqs = enqRes.data.enquiries;
        }
      } catch {
        const enqRes = await api.get('/enquiries');
        if (enqRes.data.success && Array.isArray(enqRes.data.enquiries)) {
          enqs = enqRes.data.enquiries;
        }
      }

      try {
        const notifRes = await api.get('/notifications');
        if (notifRes.data.success && Array.isArray(notifRes.data.notifications)) {
          setNotifications(notifRes.data.notifications);
        }
      } catch {
        setNotifications([]);
      }

      setApplications(apps);
      setEnquiries(enqs);
    } catch (err) {
      console.error('Error loading student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await updateProfile({ name, phone, state });
      if (res.success) {
        setProfileSuccess('Profile details updated successfully!');
      } else {
        setProfileError(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setProfileError('Server error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-green-100 text-green-700">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-100 text-red-700">
            <XCircle className="w-3.5 h-3.5 mr-1" /> Rejected
          </span>
        );
      case 'In Review':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-700">
            <Clock className="w-3.5 h-3.5 mr-1" /> Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-700">
            <Clock className="w-3.5 h-3.5 mr-1" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-[#333333] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#FA394A] flex items-center justify-center text-2xl font-black shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-[#FA394A] tracking-wider uppercase flex items-center justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Student Admission Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-black">{user?.name || 'Welcome Back'}</h1>
              <p className="text-xs text-gray-300">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/apply"
              className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md"
            >
              + New Application
            </Link>
            <button
              onClick={logout}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-sm space-y-2">
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'applications'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4" />
                  <span>My Applications</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === 'applications' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {applications.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('enquiries')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'enquiries'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>My Enquiries</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === 'enquiries' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {enquiries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === 'notifications' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {notifications.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </div>
              </button>
            </div>

            {/* Helpline Box */}
            <div className="bg-[#333333] text-white p-5 rounded-3xl space-y-3">
              <span className="text-[10px] font-extrabold text-[#FA394A] uppercase tracking-wider">
                Admission Helpdesk
              </span>
              <h3 className="text-sm font-black">Need Admission Guidance?</h3>
              <p className="text-xs text-gray-300">
                Speak directly with an expert counsellor to clear program or fee structure doubts.
              </p>
              <div className="pt-2 text-xs font-extrabold text-[#FA394A] flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 1800 123 4567</span>
              </div>
            </div>
          </div>

          {/* Right Main Panel */}
          <div className="lg:col-span-3">
            {/* APPLICATIONS TAB */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Submitted Admission Applications</h2>
                    <p className="text-xs text-gray-500">Track the real-time review status of your applications</p>
                  </div>
                  <Link
                    to="/apply"
                    className="bg-[#FA394A] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl hover:bg-[#D92B3B] transition-all"
                  >
                    + Apply for Course
                  </Link>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-xs text-gray-500">Loading your applications...</div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12 space-y-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-sm font-black text-[#333333]">No Applications Found</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                        You have not submitted any course admission form yet. Apply now for top online programs.
                      </p>
                    </div>
                    <Link
                      to="/apply"
                      className="inline-block bg-[#FA394A] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs"
                    >
                      Apply Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        className="p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-[#FA394A]/30 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              App ID: #{app._id ? String(app._id).slice(-6) : 'N/A'}
                            </span>
                            <h3 className="text-sm font-black text-[#333333]">{app.programName}</h3>
                            <p className="text-xs font-bold text-[#FA394A] flex items-center mt-0.5">
                              <Building2 className="w-3.5 h-3.5 mr-1" /> {app.collegeName}
                            </p>
                          </div>
                          <div>{getStatusBadge(app.status)}</div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Submitted On</span>
                            <span className="font-bold">
                              {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block">Contact Phone</span>
                            <span className="font-bold">{app.studentPhone || (app as any).phone || user?.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block">Contact Email</span>
                            <span className="font-bold">{app.studentEmail || (app as any).email || user?.email || 'N/A'}</span>
                          </div>
                        </div>

                        {app.adminRemarks && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                            <span className="font-bold">Admission Remarks:</span> {app.adminRemarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-black text-[#333333]">My Callback & Information Requests</h2>
                  <p className="text-xs text-gray-500">History of requested callbacks and downloaded brochures</p>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-xs text-gray-500">Loading your enquiries...</div>
                ) : enquiries.length === 0 ? (
                  <div className="text-center py-12 space-y-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <MessageSquare className="w-10 h-10 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-sm font-black text-[#333333]">No Enquiries Submitted</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                        Request a free callback or syllabus brochure from any university or program page.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map((enq) => (
                      <div key={enq._id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                            {enq.type}
                          </span>
                          <span className="text-[10px] font-extrabold text-[#FA394A]">{enq.status}</span>
                        </div>
                        <h4 className="text-xs font-black text-[#333333]">
                          {enq.collegeName ? `${enq.collegeName} — ` : ''}
                          {enq.programName || 'General Enquiry'}
                        </h4>
                        <p className="text-xs text-gray-600">{enq.message || 'Callback request submitted'}</p>
                        <div className="text-[10px] text-gray-400">
                          Requested on {new Date(enq.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">My Notifications</h2>
                    <p className="text-xs text-gray-500">Messages broadcast by the admin and alerts for your account.</p>
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500">
                    No notifications available yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="text-xs font-black text-[#333333]">{notif.title}</h3>
                            <p className="text-[11px] text-gray-500">{notif.type.toUpperCase()}</p>
                          </div>
                          <span className="text-[10px] text-gray-400">{new Date(notif.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-black text-[#333333]">Account Profile Details</h2>
                  <p className="text-xs text-gray-500">Update your basic contact info for admission communications</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                  {profileSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> {profileSuccess}
                    </div>
                  )}
                  {profileError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" /> {profileError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Email Address (Read-only)</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-xs font-medium text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">State of Residence</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Delhi, Maharashtra, Punjab"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-6 py-3 rounded-xl text-xs transition-all flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
