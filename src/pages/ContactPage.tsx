import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { SiteSettings } from '../types';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.get('/settings').then((res) => {
      if (res.data.success && res.data.settings) {
        setSettings(res.data.settings);
      }
    }).catch(() => null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/contacts', formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError(res.data.message || 'Submission failed');
      }
    } catch (err) {
      setError('Error submitting message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const phonePrimary = settings?.phonePrimary || '+91 98765 43210';
  const phoneSecondary = settings?.phoneSecondary || '1800-123-4567';
  const emailAdmissions = settings?.emailPrimary ?? '';
  const address = settings?.address || 'Online Degree Diploma Platform,\nStatesman House, Building 12, Connaught Place,\nNew Delhi, India — 110001';

  return (
    <div className="min-h-screen bg-page font-sans pb-16 transition-colors duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden py-16 sm:py-20 lg:py-24">

        {/* Background Image */}
        <img
          src="/PagesBanner/3.png" // Apni image ka naam yaha likho
          alt="Contact Banner"
          className="absolute inset-0 w-full h-full object-cover object-center md:object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/45 to-black/45"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <span className="inline-block text-xs sm:text-sm font-bold text-[#FA394A] uppercase tracking-[3px] mb-4">
            Get In Touch
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Admission Support &
            <span className="block text-[#FA394A]">
              Support Desk
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-lg text-gray-200 leading-7 sm:leading-8">
            Have questions about UGC approvals, online exam centers, fee payment,
            EMI options, or document uploads? Speak with our expert counselors
            today for personalized admission guidance.
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-3xl border border-theme shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-heading flex items-center">
              <Phone className="w-5 h-5 text-[#FA394A] mr-2" /> Admission Helplines
            </h3>
            <div className="space-y-2 text-xs font-semibold text-muted">
              <p>Primary Call: <a href={`tel:${phonePrimary}`} className="text-[#FA394A] hover:underline">{phonePrimary}</a></p>
              <p>Toll-Free Desk: <a href={`tel:${phoneSecondary}`} className="text-heading hover:underline">{phoneSecondary}</a></p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-normal">Mon - Sat: 9:00 AM to 7:00 PM IST</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-3xl border border-theme shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-heading flex items-center">
              <Mail className="w-5 h-5 text-[#FA394A] mr-2" /> Email Support
            </h3>
            <div className="space-y-2 text-xs font-semibold text-muted">
              <p>Admissions: <a href={`mailto:${emailAdmissions}`} className="text-[#FA394A] hover:underline">{emailAdmissions}</a></p>
              <p>Student Desk: <a href={`mailto:${emailAdmissions}`} className="text-heading hover:underline">{emailAdmissions}</a></p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-3xl border border-theme shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-heading flex items-center">
              <MapPin className="w-5 h-5 text-[#FA394A] mr-2" /> Corporate Office
            </h3>
            <p className="text-xs text-muted leading-relaxed font-medium whitespace-pre-line">
              {address}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface p-8 rounded-3xl border border-theme shadow-xl space-y-6">
            <div className="border-b border-theme pb-4">
              <h2 className="text-xl font-extrabold text-heading">Send Us a Direct Message</h2>
              <p className="text-xs text-muted mt-1">
                Fill in your enquiry details below. An advisor will get back to you within 24 hours.
              </p>
            </div>

            {success ? (
              <div className="p-8 text-center bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-900/50 space-y-3">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto" />
                <h3 className="text-lg font-black text-heading">Message Sent Successfully!</h3>
                <p className="text-xs text-muted">
                  Thank you for reaching out. An academic counselor has been assigned to your query and will contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#FA394A] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-heading mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-heading text-xs focus:ring-2 focus:ring-[#FA394A] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-heading mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-heading text-xs focus:ring-2 focus:ring-[#FA394A] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-heading mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-heading text-xs focus:ring-2 focus:ring-[#FA394A] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-heading mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Fee installment, MBA eligibility"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-heading text-xs focus:ring-2 focus:ring-[#FA394A] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heading mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your query in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-heading text-xs focus:ring-2 focus:ring-[#FA394A] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-[#FA394A]/20 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;