import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // <-- SEO ke liye import
import { GraduationCap, Mail, Lock, User, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/login', {
        state: {
          registeredMessage: '🎉 Account created successfully! Please sign in with your email & password.',
          email: formData.email
        }
      });
    } else {
      setError(res.message);
    }
  };

  return (
    <>
      {/* ================= ADVANCED SEO & SCHEMA MARKUP (DORIC FORMAT) ================= */}
      <Helmet>
        {/* 1. PRIMARY SEO - Noindex for Register Page */}
        <title>Student Registration | Online Degree Diploma Portal</title>
        
        <meta
          name="description"
          content="Create your student account on Online Degree Diploma. Register now to apply for UGC-recognized online degrees, save courses, and track admission status."
        />
        
        <meta
          name="keywords"
          content="student registration online degree, create student account, online degree portal sign up"
        />
        
        {/* NOINDEX: Search engines ko is page ko index karne se rokein */}
        <meta name="robots" content="noindex, nofollow" />
        
        <link rel="canonical" href="https://onlinedegreediploma.com/register" />

        {/* 2. OPEN GRAPH (Social Media) */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Online Degree Diploma" />
        <meta property="og:title" content="Register | Online Degree Diploma Portal" />
        <meta property="og:description" content="Create your student account to apply for online degrees and track admissions." />
        <meta property="og:url" content="https://onlinedegreediploma.com/register" />
        <meta property="og:image" content="https://onlinedegreediploma.com/icons/android-chrome-512x512.png" />

        {/* 3. TWITTER CARD */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Register | Online Degree Diploma Portal" />
        <meta name="twitter:description" content="Create your student account to apply for online degrees and track admissions." />
        <meta name="twitter:image" content="https://onlinedegreediploma.com/icons/android-chrome-512x512.png" />

        {/* 4. SCHEMA MARKUP (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": "https://onlinedegreediploma.com/register/#webpage",
                "url": "https://onlinedegreediploma.com/register",
                "name": "Student Registration | Online Degree Diploma Portal",
                "description": "Create your student account on Online Degree Diploma. Register now to apply for UGC-recognized online degrees.",
                "isPartOf": { "@id": "https://onlinedegreediploma.com/#website" }
              },
              {
                "@type": "BreadcrumbList",
                "@id": "https://onlinedegreediploma.com/register/#breadcrumb",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://onlinedegreediploma.com/" },
                  { "@type": "ListItem", "position": 2, "name": "Register", "item": "https://onlinedegreediploma.com/register" }
                ]
              }
            ]
          })}
        </script>
      </Helmet>
      {/* ================= SEO & SCHEMA MARKUP END ================= */}

      <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FA394A] flex items-center justify-center text-white shadow-lg">
              <GraduationCap className="w-7 h-7" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-[#333333]">Create Student Account</h2>
          <p className="text-xs text-gray-500 font-medium">
            Register to apply for online degrees, save preferred courses, and track admission status.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-gray-100 sm:px-10 space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ankit Verma"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ankit@gmail.com"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765..."
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">State / Region</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Delhi, Punjab"
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 characters"
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
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
              Already registered?{' '}
              <Link to="/login" className="font-extrabold text-[#FA394A] hover:underline">
                Sign In Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
