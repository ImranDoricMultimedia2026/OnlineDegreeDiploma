import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Download, Send, GraduationCap, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { COLLEGE_NAV_ITEMS, PROGRAM_NAV_ITEMS } from '../layout/Navbar';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: 'general' | 'brochure' | 'fee_structure';
  defaultCollege?: string;
  defaultProgram?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  title = 'Get Free Counselling & University Brochure',
  type = 'general',
  defaultCollege = '',
  defaultProgram = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    qualification: '',
    collegeName: defaultCollege || '',
    programName: defaultProgram || '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [collegeList, setCollegeList] = useState<{ name: string }[]>(
    COLLEGE_NAV_ITEMS.map((c) => ({ name: c.name }))
  );
  const [programList, setProgramList] = useState<{ title: string; type: string }[]>(
    PROGRAM_NAV_ITEMS.map((p) => ({ title: p.title, type: p.type }))
  );

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          api.get('/colleges'),
          api.get('/programs')
        ]);
        if (cRes.data.success && cRes.data.colleges?.length > 0) {
          const names = new Set(COLLEGE_NAV_ITEMS.map((c) => c.name));
          const list = COLLEGE_NAV_ITEMS.map((c) => ({ name: c.name }));
          cRes.data.colleges.forEach((c: any) => {
            if (c.name && !names.has(c.name)) {
              names.add(c.name);
              list.push({ name: c.name });
            }
          });
          setCollegeList(list);
        }
        if (pRes.data.success && pRes.data.programs?.length > 0) {
          const titles = new Set(PROGRAM_NAV_ITEMS.map((p) => p.title));
          const list = PROGRAM_NAV_ITEMS.map((p) => ({ title: p.title, type: p.type }));
          pRes.data.programs.forEach((p: any) => {
            if (p.title && !titles.has(p.title)) {
              titles.add(p.title);
              list.push({ title: p.title, type: p.degreeType || 'Degree' });
            }
          });
          setProgramList(list);
        }
      } catch (err) {
        // Fallback to nav items
      }
    };
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const cityVal = formData.city || formData.state;
      const res = await api.post('/enquiries', {
        ...formData,
        city: cityVal,
        state: cityVal,
        type
      });

      if (res.data.success) {
        setSubmitted(true);
        if (res.data.downloadUrl) {
          setDownloadUrl(res.data.downloadUrl);
        }
      } else {
        setError(res.data.message || 'Submission failed');
      }
    } catch (err: any) {
      setError('Error submitting enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-gray-100 my-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#FA394A] to-[#D92B3B] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Online Degree Admission Helpline</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">{title}</h3>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-extrabold text-[#333333]">Enquiry Submitted Successfully!</h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you, <span className="font-bold text-[#333333]">{formData.name}</span>. An official senior academic counsellor will call you at <span className="font-bold text-[#FA394A]">{formData.phone}</span> within 15 minutes.
              </p>

              {downloadUrl && (
                <div className="pt-2">
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center bg-[#FA394A] hover:bg-[#D92B3B] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Prospectus PDF
                  </a>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-[#333333] font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ankit Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ankit@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">City / State</label>
                  <input
                    type="text"
                    value={formData.city || formData.state}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, state: e.target.value })}
                    placeholder="e.g. Patna, Delhi, Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">Preferred College</label>
                  <select
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select College / Any</option>
                    {collegeList.map((c, idx) => (
                      <option key={idx} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">Preferred Program</label>
                  <select
                    value={formData.programName}
                    onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select Course / Any</option>
                    {programList.map((p, idx) => (
                      <option key={idx} value={p.title}>
                        {p.title} ({p.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Message / Specific Query (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ask about fee discount, exam centers, EMI, or eligibility..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FA394A] focus:border-transparent outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FA394A] hover:bg-[#D92B3B] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-[#FA394A]/20 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Request & Get Free Counselling</span>
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
