import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  GraduationCap,
  Sparkles,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Building2,
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { College, Program } from '../types';

export const ApplyNowPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const preselectedCollegeId = searchParams.get('collegeId') || '';
  const preselectedProgramId = searchParams.get('programId') || '';

  const [colleges, setColleges] = useState<College[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    collegeId: preselectedCollegeId,
    programId: preselectedProgramId,
    studentName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: 'Male',
    dob: '',
    address: '',
    state: user?.state || '',
    category: 'General',
    tenthPercentage: '',
    twelfthPercentage: '',
    graduationPercentage: ''
  });

  // Files
  const [photo, setPhoto] = useState<File | null>(null);
  const [idProof, setIdProof] = useState<File | null>(null);
  const [marksheets, setMarksheets] = useState<File | null>(null);

  // Fetch colleges and programs
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [cRes, pRes] = await Promise.all([api.get('/colleges'), api.get('/programs')]);
        let loadedColleges: College[] = [];
        let loadedPrograms: Program[] = [];

        if (cRes.data.success) {
          loadedColleges = cRes.data.colleges;
          setColleges(loadedColleges);
        }
        if (pRes.data.success) {
          loadedPrograms = pRes.data.programs;
          setPrograms(loadedPrograms);
          setFilteredPrograms(loadedPrograms);
        }

        // Auto-select college if preselected query param matches a college slug/id/name
        if (preselectedCollegeId && loadedColleges.length > 0) {
          const matchCol = loadedColleges.find(
            (c) => c._id === preselectedCollegeId || c.slug === preselectedCollegeId || c.name === preselectedCollegeId
          );
          if (matchCol) {
            setFormData((prev) => ({ ...prev, collegeId: matchCol._id }));
          }
        }

        // Auto-select program if preselected query param matches a program slug/id/title
        if (preselectedProgramId && loadedPrograms.length > 0) {
          const matchProg = loadedPrograms.find(
            (p) => p._id === preselectedProgramId || p.slug === preselectedProgramId || p.title === preselectedProgramId
          );
          if (matchProg) {
            setFormData((prev) => ({ ...prev, programId: matchProg._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching application dropdowns:', err);
      }
    };
    fetchDropdowns();
  }, [preselectedCollegeId, preselectedProgramId]);

  // Ensure all programs appear in select program dropdown for all universities
  useEffect(() => {
    setFilteredPrograms(programs);
  }, [programs]);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.collegeId || !formData.programId) {
        setError('Please select both a university and a program.');
        return;
      }
    } else if (step === 2) {
      if (!formData.studentName || !formData.email || !formData.phone) {
        setError('Please enter your name, email, and phone number.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedCollege = colleges.find(
        (c) => c._id === formData.collegeId || c.slug === formData.collegeId || c.name === formData.collegeId
      );
      const selectedProgram = programs.find(
        (p) => p._id === formData.programId || p.slug === formData.programId || p.title === formData.programId
      );

      const formPayload = new FormData();
      formPayload.append('collegeId', formData.collegeId);
      formPayload.append('programId', formData.programId);
      formPayload.append('studentName', formData.studentName);
      formPayload.append('email', formData.email);
      formPayload.append('phone', formData.phone);
      formPayload.append('dob', formData.dob);
      formPayload.append('gender', formData.gender);
      formPayload.append('address', formData.address);
      formPayload.append('state', formData.state);
      formPayload.append('qualification', formData.category);
      formPayload.append('tenthPercentage', formData.tenthPercentage);
      formPayload.append('twelfthPercentage', formData.twelfthPercentage);
      formPayload.append('graduationPercentage', formData.graduationPercentage);
      formPayload.append('collegeName', selectedCollege?.name || 'Partner University');
      formPayload.append('programName', selectedProgram?.title || 'Degree Program');
      formPayload.append('programTitle', selectedProgram?.title || 'Degree Program');
      if (idProof) formPayload.append('idProof', idProof);
      if (marksheets) formPayload.append('marksheets', marksheets);
      if (photo) formPayload.append('photo', photo);

      const res = await api.post('/applications', formPayload);

      if (res.data.success) {
        setApplicationId(res.data.application._id || res.data.application.id);
        setStep(4); // Success step
      } else {
        setError(res.data.message || 'Application submission failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error submitting application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Apply Online | Online Degree Diploma Admissions 2026</title>
        <meta name="description" content="Submit your application for 2026 Academic Batches in 3 simple steps." />
      </Helmet>
      <div className="min-h-screen bg-[#F5F5F5] font-sans pb-16">
        {/* Header Banner */}
        <div className="relative overflow-hidden text-white py-16 sm:py-20 lg:py-24 px-4">
          {/* Background Image */}
          <img
            src="/PagesBanner/4.png"
            alt="Online Degree Application"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-black/45"></div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FA394A]">
              <Sparkles className="w-4 h-4 mr-2" />
              Direct University Admission Form
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight">
              Online Degree Application Portal
            </h1>

            <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Submit your application for <strong>2026 Academic Batches</strong> in
              <span className="text-[#FA394A] font-bold"> 3 simple steps</span>.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Progress Tracker Bar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm mb-8 flex justify-between items-center text-xs font-bold">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#FA394A]' : 'text-gray-400'}`}>
              <span className="w-6 h-6 rounded-full bg-current text-white flex items-center justify-center text-[10px]">1</span>
              <span className="hidden sm:inline">Select Course</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200" />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#FA394A]' : 'text-gray-400'}`}>
              <span className="w-6 h-6 rounded-full bg-current text-white flex items-center justify-center text-[10px]">2</span>
              <span className="hidden sm:inline">Personal Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200" />
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#FA394A]' : 'text-gray-400'}`}>
              <span className="w-6 h-6 rounded-full bg-current text-white flex items-center justify-center text-[10px]">3</span>
              <span className="hidden sm:inline">Submit & Confirm</span>
            </div>
          </div>

          {/* Form Container Card */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/80 shadow-2xl space-y-6">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Select College & Program */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-[#333333] flex items-center">
                  <Building2 className="w-5 h-5 text-[#FA394A] mr-2" /> Step 1: Choose University & Degree
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Select University *</label>
                    <select
                      value={
                        colleges.find(
                          (c) => c._id === formData.collegeId || c.slug === formData.collegeId || c.name === formData.collegeId
                        )?._id || formData.collegeId
                      }
                      onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none bg-white"
                    >
                      <option value="">-- Choose University --</option>
                      {colleges.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.location || 'Online Campus'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Select Program / Course *</label>
                    <select
                      value={
                        programs.find(
                          (p) => p._id === formData.programId || p.slug === formData.programId || p.title === formData.programId
                        )?._id || formData.programId
                      }
                      onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none bg-white"
                    >
                      <option value="">-- Choose Degree Program --</option>
                      {filteredPrograms.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title} ({p.degreeType} — {p.duration})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs transition-all flex items-center"
                  >
                    <span>Continue to Step 2</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-[#333333] flex items-center">
                  <User className="w-5 h-5 text-[#FA394A] mr-2" /> Step 2: Personal & Academic Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Full Student Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="As per 10th marksheet"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">State of Residence</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Delhi, Punjab, UP"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">10th Marks (%)</label>
                    <input
                      type="text"
                      value={formData.tenthPercentage}
                      onChange={(e) => setFormData({ ...formData, tenthPercentage: e.target.value })}
                      placeholder="e.g. 82%"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#FA394A] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">ID Proof (PDF, JPG, PNG)</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setIdProof(e.target.files?.[0] || null)}
                      className="w-full text-xs text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Marksheets (PDF, JPG, PNG)</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setMarksheets(e.target.files?.[0] || null)}
                      className="w-full text-xs text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Recent Photograph (JPG, PNG, WEBP)</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                      className="w-full text-xs text-gray-600"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-100 hover:bg-gray-200 text-[#333333] font-bold px-6 py-3 rounded-2xl text-xs flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs transition-all flex items-center"
                  >
                    <span>Review & Submit</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Final Submission */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-black text-[#333333] flex items-center">
                  <FileText className="w-5 h-5 text-[#FA394A] mr-2" /> Step 3: Confirm Application Summary
                </h2>

                <div className="bg-[#F5F5F5] p-5 rounded-2xl border border-gray-200 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Applicant:</span>
                    <span className="font-bold text-[#333333]">{formData.studentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Selected University:</span>
                    <span className="font-bold text-[#FA394A]">
                      {colleges.find((c) => c._id === formData.collegeId || c.slug === formData.collegeId || c.name === formData.collegeId)?.name || 'Selected University'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Selected Course:</span>
                    <span className="font-bold text-[#333333]">
                      {programs.find((p) => p._id === formData.programId || p.slug === formData.programId || p.title === formData.programId)?.title || 'Selected Course'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact Email & Phone:</span>
                    <span className="font-bold text-[#333333]">{formData.email} ({formData.phone})</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-gray-100 hover:bg-gray-200 text-[#333333] font-bold px-6 py-3 rounded-2xl text-xs flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-[#FA394A]/20 flex items-center"
                  >
                    {loading ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <span>Submit Application Now</span>
                        <CheckCircle className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Success Screen */}
            {step === 4 && (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-[#333333]">Application Submitted Successfully!</h2>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Your admission application tracking ID is{' '}
                  <span className="font-extrabold text-[#FA394A] bg-[#FFE8EA] px-2 py-1 rounded">
                    {applicationId}
                  </span>
                  . An admission officer will review your record and email you official university registration steps.
                </p>

                <div className="pt-4 flex justify-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="bg-[#FA394A] text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md"
                  >
                    Go to Student Dashboard
                  </Link>
                  <Link
                    to="/"
                    className="bg-gray-100 text-[#333333] px-6 py-3 rounded-2xl font-bold text-xs"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};
