import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Send, CheckCircle, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import api from '../../services/api';
import { SiteSettings } from '../../types';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.get('/settings').then((res) => {
      if (res.data.success && res.data.settings) {
        setSettings(res.data.settings);
      }
    }).catch(() => null);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/subscribers', { email: newsletterEmail });
      if (res.data.success) {
        setSubscribed(true);
        setNewsletterEmail('');
      } else {
        setErrorMsg(res.data.message || 'Subscription failed');
      }
    } catch (err: any) {
      setErrorMsg('Subscription error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const phoneText = settings?.phonePrimary || '+91 98765 43210';
  const emailText = settings?.emailPrimary || 'admissions@onlinedegreediploma.com';
  const addressText = settings?.address || 'Connaught Place, New Delhi, India — 110001';
  const aboutText = settings?.footerAboutText || 'India premier higher education & online admission platform enabling working professionals and students to enroll in top UGC-entitled degrees, diplomas, and certifications seamlessly.';

  return (
    <footer className="bg-[#333333] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Card */}
        <div className="bg-gradient-to-r from-[#FA394A] to-[#D92B3B] rounded-3xl p-8 mb-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Stay Updated on Online Degree Admissions & Scholarships
            </h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl">
              Subscribe to get official exam notifications, university updates, fee discounts, and brochure downloads directly in your inbox.
            </p>
          </div>
          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="bg-white/20 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full md:w-[420px]">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-white text-[#333333] placeholder-gray-400 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white w-full"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#333333] hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center shrink-0 shadow-md"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
            )}
            {errorMsg && <p className="text-xs text-amber-200 mt-2 font-medium">{errorMsg}</p>}
          </div>
        </div>

          {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-700/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/images/footerLogo.webp"
                alt="Online Degree Diploma"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              India premier higher education & online admission platform enabling working professionals and students to enroll in top UGC-entitled degrees, diplomas, and certifications seamlessly.
            </p>
            <div className="space-y-2 pt-2 text-xs text-gray-300">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[#FA394A] shrink-0" />
                <span>1st Floor Gulati Market, Near CMC Chowk, Ludhiana</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#FA394A] shrink-0" />
                <span>+91 80541-00099</span>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-[#FA394A] shrink-0" />
                <span>admissions@onlinedegreediploma.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#FA394A] pl-2.5">
              Important
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <Link to="/about" className="hover:text-[#FA394A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-[#FA394A] transition-colors">
                  Colleges & Universities
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-[#FA394A] transition-colors">
                  Programs & Degrees
                </Link>
              </li>
              <li>
                <Link to="/programs?degreeType=UG" className="hover:text-[#FA394A] transition-colors">
                  Undergraduate Study
                </Link>
              </li>
              <li>
                <Link to="/programs?degreeType=PG" className="hover:text-[#FA394A] transition-colors">
                  Postgraduate Study
                </Link>
              </li>
              <li>
                <Link to="/programs?degreeType=Diploma" className="hover:text-[#FA394A] transition-colors">
                  Diploma Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#FA394A] pl-2.5">
              Get In Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <Link to="/contact" className="hover:text-[#FA394A] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-[#FA394A] transition-colors">
                  Admission Guidance
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FA394A] transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FA394A] transition-colors">
                  Create Student Account
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#FA394A] transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Us */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#FA394A] pl-2.5">
              Connect Us
            </h4>
            <p className="text-xs text-gray-400 mb-4">
              Follow our social channels for live counsellor sessions, campus alerts, and admission highlights.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#FA394A] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#FA394A] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#FA394A] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#FA394A] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#FA394A] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-4 sm:space-y-0">
          <p>Online Degree Diploma © 2026. All Rights Reserved.</p>
          <div className="flex space-x-6 text-gray-400">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
