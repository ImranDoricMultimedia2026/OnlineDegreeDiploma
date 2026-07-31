import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Building2,
  CheckCircle2,
  Download,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { Program, College } from '../types';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { getAssetUrl } from '../utils/image';

export const ProgramDetailPage: React.FC = () => {
  const params = useParams<{ slugOrId?: string; slug?: string }>();
  const activeSlug = params.slug || params.slugOrId || '';
  const [program, setProgram] = useState<Program | null>(null);
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'general' | 'brochure' | 'fee_structure'>('general');

  useEffect(() => {
    const fetchProgram = async () => {
      if (!activeSlug) return;
      setLoading(true);
      try {
        const res = await api.get(`/programs/${encodeURIComponent(activeSlug)}`);
        if (res.data.success) {
          setProgram(res.data.program);
          setCollege(res.data.college);
        }
      } catch (err) {
        console.error('Error fetching program details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [activeSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] text-xs font-bold text-gray-500">
        Loading program curriculum & details...
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-6 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-extrabold text-[#333333]">Program Page Not Found</h2>
        <Link to="/programs" className="mt-4 bg-[#FA394A] text-white px-6 py-2.5 rounded-xl text-xs font-bold">
          Browse All Degree Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-16">
      {/* Hero Header */}
<div
  className="relative w-full min-h-[280px] sm:min-h-[380px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden border-b border-gray-800"
  style={{
    backgroundImage: program.image
      ? `url(${getAssetUrl(program.image)})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Premium Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/25 to-black/3"></div>

  {/* Content */}
  <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 md:py-32">

    <div className="max-w-4xl">

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        <span className="px-4 py-2 rounded-full bg-[#FA394A] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
          {program.degreeType} Program
        </span>

        <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold flex items-center shadow-lg">
          <Clock className="w-4 h-4 mr-2" />
          {program.duration}
        </span>

      </div>

      {/* Title */}
      <h1
        className="
          text-white
          text-3xl
          sm:text-4xl
          md:text-5xl
          lg:text-6xl
          xl:text-7xl
          font-black
          leading-tight
          drop-shadow-2xl
          [text-shadow:0_4px_18px_rgba(0,0,0,0.9)]
        "
      >
        {program.title}
      </h1>

    </div>

  </div>
</div>
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#333333]">Program Overview</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {program.overview}
            </p>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
            <h2 className="text-sm font-extrabold text-[#333333] uppercase tracking-wider flex items-center">
              <GraduationCap className="w-4 h-4 mr-2 text-[#FA394A]" /> Eligibility Requirements
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 font-medium bg-[#FFE8EA] p-4 rounded-2xl border border-[#FA394A]/20">
              {program.eligibility}
            </p>
          </div>

          {/* Specializations */}
          {program.specializations && program.specializations.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
              <h2 className="text-sm font-extrabold text-[#333333] uppercase tracking-wider flex items-center">
                <Layers className="w-4 h-4 mr-2 text-[#FA394A]" /> Available Specializations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {program.specializations.map((spec, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#333333] flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-[#FA394A] mr-2 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum / Semester Info */}
          {program.semesterInfo && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-[#333333]">Semester & Subject Information</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {program.semesterInfo}
              </p>
            </div>
          )}

          {/* Fee Structure */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#333333]">Fee Structure & EMI Options</h2>
            <div className="bg-[#FFE8EA] p-5 rounded-2xl border border-[#FA394A]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Total Estimated Program Fee</p>
                <p className="text-xl font-black text-[#FA394A]">{program.fee}</p>
              </div>
              <button
                onClick={() => {
                  setModalType('fee_structure');
                  setModalOpen(true);
                }}
                className="bg-[#FA394A] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
              >
                Get Full Semester Breakdown
              </button>
            </div>
          </div>

          {/* Career Opportunities */}
          {program.careerScope && program.careerScope.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
              <h2 className="text-sm font-extrabold text-[#333333] uppercase tracking-wider flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-[#FA394A]" /> Career Opportunities & Job Roles
              </h2>
              <div className="flex flex-wrap gap-2">
                {program.careerScope.map((role, i) => (
                  <span key={i} className="px-3.5 py-2 rounded-xl bg-gray-100 text-[#333333] font-bold text-xs border border-gray-200">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xl space-y-4 sticky top-24">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-[#FA394A] uppercase">Admission Helpline</span>
              <h3 className="text-lg font-black text-[#333333]">Enroll in {program.title}</h3>
              <p className="text-xs text-gray-500">
                Official admissions open for upcoming 2026 academic batch.
              </p>
            </div>

            <Link
              to={`/apply?programId=${program._id}&collegeId=${program.collegeId}`}
              className="w-full bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-[#FA394A]/20 flex items-center justify-center space-x-2 text-center"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Online Now</span>
            </Link>

            <button
              onClick={() => {
                setModalType('brochure');
                setModalOpen(true);
              }}
              className="w-full bg-[#333333] hover:bg-black text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Syllabus PDF</span>
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          defaultCollege={program.collegeName}
          defaultProgram={program.title}
          title={modalType === 'brochure' ? `Download Brochure for ${program.title}` : `Fee Enquiry for ${program.title}`}
        />
      )}
    </div>
  );
};
