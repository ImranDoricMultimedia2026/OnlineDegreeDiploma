import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  CheckCircle,
  Globe,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  Clock,
  ArrowRight,
  Download,
  ShieldCheck,
  Star,
  Users,
  TrendingUp,
  Briefcase,
  GraduationCap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import api from '../services/api';
import { College, Program } from '../types';
import { EnquiryModal } from '../components/common/EnquiryModal';

export const CollegeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [college, setCollege] = useState<College | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [relatedColleges, setRelatedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'general' | 'brochure' | 'fee_structure'>('general');
  const [selectedProgramTitle, setSelectedProgramTitle] = useState('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetchCollegeData();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchCollegeData = async () => {
    if (!slug) return;
    setLoading(true);
    setError(false);

    try {
      const res = await api.get(`/colleges/${slug}`);
      if (res.data.success && res.data.college) {
        setCollege(res.data.college);
        setPrograms(res.data.programs || []);
        setRelatedColleges(res.data.relatedColleges || []);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching university details:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: 'general' | 'brochure' | 'fee_structure' = 'general', programTitle: string = '') => {
    setModalType(type);
    setSelectedProgramTitle(programTitle);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] py-20">
        <div className="w-12 h-12 border-4 border-[#FA394A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-gray-600 tracking-wide uppercase">Loading University Profile...</p>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-[#FA394A] rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-[#333333]">University Profile Not Found</h1>
        <p className="text-xs text-gray-500 max-w-md mt-2 leading-relaxed">
          The requested university slug (<code className="text-[#FA394A] font-bold">{slug}</code>) does not exist or has been updated in MongoDB Atlas.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            to="/colleges"
            className="bg-[#FA394A] hover:bg-[#D92B3B] text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md"
          >
            Browse All Universities
          </Link>
          <Link
            to="/"
            className="bg-white hover:bg-gray-100 text-[#333333] border border-gray-300 px-6 py-3 rounded-2xl text-xs font-bold transition-all"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Default FAQs if college FAQs list is empty
  const defaultFaqs = college.faqs && college.faqs.length > 0 ? college.faqs : [
    {
      question: `Is an online degree from ${college.name} recognized for government jobs?`,
      answer: `Yes, degrees awarded by ${college.name} are UGC-DEB entitled and fully valid for central & state government exams, PSU job applications, higher studies, and global credential evaluations (WES/ECE).`
    },
    {
      question: 'How are semester examinations conducted for online programs?',
      answer: 'Examinations are conducted 100% online in remote-proctored mode. Students can appear for tests safely from home using a computer or laptop with a working webcam.'
    },
    {
      question: 'Can I pay my university tuition fee in easy monthly installments (EMI)?',
      answer: 'Yes, flexible zero-cost EMI options are available starting from ₹ 3,500/month in partnership with leading educational financing institutions.'
    },
    {
      question: 'Will I get access to recorded lectures and digital study material?',
      answer: 'Absolutely! Students receive 24/7 access to the Learning Management System (LMS) containing e-books, recorded video lectures, live webinar links, and discussion forums.'
    }
  ];

  // Approvals List
  const approvalsList = college.approvals && college.approvals.length > 0
    ? college.approvals
    : (college.accreditation && college.accreditation.length > 0 ? college.accreditation : ['UGC Entitled', 'NAAC A++', 'AICTE Approved', 'WES Listed']);

  // Highlights List
  const highlightsList = college.highlights && college.highlights.length > 0 ? college.highlights : [
    '100% Flexible Online & Distance Degree Curriculum',
    'Live Interactive Classes & Recorded Seminars on Mobile App / Portal',
    'Dedicated Personal Mentor & 24/7 Academic Support',
    'Industry-Aligned Electives & Certificate Modules',
    'Global Placement Cell with 300+ Active Hiring Partners',
    'Recognized Worldwide for Higher Studies & Visa Evaluation'
  ];

  // Admission Process steps
  const admissionSteps = college.admissionProcess && college.admissionProcess.length > 0 ? college.admissionProcess : [
    'Step 1: Fill out the online application form and choose your target program.',
    'Step 2: Upload 10th, 12th / Graduation marksheets and Govt ID proof.',
    'Step 3: Pay the initial admission fee or book seat via zero-cost EMI.',
    'Step 4: Receive university enrollment ID & instant LMS portal credentials.'
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-20">
      {/* HERO BANNER SECTION BELOW NAVBAR */}
   <div className="relative bg-[#222222] text-white overflow-hidden min-h-[420px] sm:min-h-[480px] flex items-center">

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/20 z-10" />

  {/* Banner Image */}
  <img
    src={
      college.banner ||
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"
    }
    alt={college.name}
    className="absolute inset-0 w-full h-full object-cover object-center sm:object-center md:object-center lg:object-center"
  />

  <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-20">

    <div className="flex items-center">

      {/* Left Content */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

        {/* Logo */}
        <img
          src={
            college.logo ||
            college.image ||
            "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&q=80"
          }
          alt={college.name}
          className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white p-2.5 shadow-2xl object-contain border-2 border-white/80 shrink-0"
        />

        {/* Details */}
        <div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#FA394A] text-white text-[11px] font-extrabold uppercase flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              {college.approval || "UGC Entitled"}
            </span>

            {college.naacGrade && (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-extrabold uppercase">
                NAAC Grade {college.naacGrade}
              </span>
            )}

            {college.establishedYear && (
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-bold">
                Estd. {college.establishedYear}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight">
            {college.name}
          </h1>

          {/* Location */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-200">

            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#FA394A]" />
              <span className="text-sm">
                {college.location}
              </span>
            </div>

            {college.rating && (
              <div className="flex items-center text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-current mr-1" />
                {college.rating} / 5.0 Rating
              </div>
            )}
          </div>

          {/* Buttons (Always below Rating) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">

            <button
              onClick={() => handleOpenModal("brochure")}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-3 rounded-2xl backdrop-blur transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Brochure
            </button>

            <button
              onClick={() => handleOpenModal("general")}
              className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg shadow-[#FA394A]/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Free Admission Counseling
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

      {/* MAIN BODY LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLUMNS - DETAILED CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* RANKING & RECOGNITION */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#333333] uppercase tracking-wider flex items-center">
              <Award className="w-5 h-5 mr-2 text-[#FA394A]" /> Rankings & Approvals
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-red-50/60 rounded-2xl border border-red-100 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">UGC Status</span>
                <span className="text-xs font-black text-[#FA394A]">UGC Entitled</span>
              </div>
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">NAAC Grade</span>
                <span className="text-xs font-black text-amber-700">{college.naacGrade || 'A++ Accredited'}</span>
              </div>
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Placement</span>
                <span className="text-xs font-black text-blue-700">{college.placementPercentage || '88%+ Support'}</span>
              </div>
              <div className="p-3.5 bg-green-50/60 rounded-2xl border border-green-100 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Global Value</span>
                <span className="text-xs font-black text-green-700">WES Approved</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {approvalsList.map((app, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 text-[#333333] font-bold text-xs flex items-center border border-gray-200"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-600" /> {app}
                </span>
              ))}
            </div>
          </div>

          {/* ABOUT UNIVERSITY */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#333333]">About {college.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {college.overview || college.description}
            </p>

            {college.website && (
              <div className="pt-2">
                <a
                  href={college.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-xs font-bold text-[#FA394A] hover:underline bg-red-50 px-4 py-2 rounded-xl border border-red-100"
                >
                  <Globe className="w-4 h-4 mr-2" /> Visit Official University Portal
                </a>
              </div>
            )}
          </div>

          {/* UNIVERSITY HIGHLIGHTS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#333333] flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#FA394A]" /> Key University Highlights
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlightsList.map((hl, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-5 h-5 rounded-full bg-[#FA394A] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-xs font-bold text-gray-700">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DOWNLOAD BROCHURE CARD */}
          <div className="bg-gradient-to-r from-[#333333] to-[#222222] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#FA394A]">
                Official Prospectus 2026
              </span>
              <h3 className="text-lg font-black text-white">Download {college.name} Brochure</h3>
              <p className="text-xs text-gray-300">
                Get detailed syllabus, semester fee breakup, faculty profile, and exam pattern in PDF format.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal('brochure')}
              className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md shrink-0 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* AVAILABLE PROGRAMS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#333333] flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-[#FA394A]" /> Available Programs
              </h2>
              <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                {programs.length} Courses
              </span>
            </div>

            {programs.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-3">
                <GraduationCap className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-xs font-bold text-gray-500">General admission open for all UG & PG programs.</p>
                <button
                  onClick={() => handleOpenModal('general')}
                  className="bg-[#FA394A] text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  Request Course Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programs.map((program) => (
                  <div
                    key={program._id}
                    className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-1 rounded-lg bg-[#FFE8EA] text-[#FA394A] text-[10px] font-extrabold uppercase">
                          {program.degreeType} Degree
                        </span>
                        <span className="text-[11px] text-gray-500 font-semibold flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" /> {program.duration}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-[#333333]">{program.title}</h3>
                      <p className="text-xs font-black text-[#FA394A]">{program.fee}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Link
                        to={`/programs/${program.slug}`}
                        className="text-xs font-bold text-[#333333] hover:text-[#FA394A] transition-colors"
                      >
                        Course Details →
                      </Link>

                      <button
                        onClick={() => handleOpenModal('general', program.title)}
                        className="bg-[#FA394A] hover:bg-[#D92B3B] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FEE STRUCTURE & EMI */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#333333] flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-[#FA394A]" /> Fee Structure & Payment Plans
            </h2>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs text-gray-500 font-bold">Estimated Annual Tuition Fee</span>
                <div className="text-xl font-black text-[#FA394A]">
                  {college.feesRange || '₹ 45,000 - ₹ 1,80,000 / Year'}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">Includes LMS access, exam fees, and digital study material.</p>
              </div>

              <button
                onClick={() => handleOpenModal('fee_structure')}
                className="bg-[#333333] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
              >
                Get Detailed Fee Sheet
              </button>
            </div>
          </div>

          {/* ELIGIBILITY & ADMISSION PROCESS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#333333]">Admission Process & Eligibility</h2>
              <p className="text-xs text-gray-500 mt-0.5">Simple 4-step direct online admission procedure</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {admissionSteps.map((step, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-[#FA394A]">Step 0{idx + 1}</div>
                  <p className="text-xs font-bold text-[#333333] leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PLACEMENT SUPPORT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#333333] flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#FA394A]" /> Career & Placement Cell
            </h2>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block">Placement Rate</span>
                <span className="text-base font-black text-[#FA394A]">{college.placementPercentage || '88%'}</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block">Average CTC</span>
                <span className="text-base font-black text-[#333333]">{college.averagePackage || '₹ 5.2 LPA'}</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block">Highest CTC</span>
                <span className="text-base font-black text-green-700">{college.highestPackage || '₹ 22.5 LPA'}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-500 block mb-2">Top Hiring Partners:</span>
              <div className="flex flex-wrap gap-2">
                {['Amazon', 'TCS', 'Deloitte', 'Wipro', 'Infosys', 'HDFC Bank', 'ICICI', 'Cognizant', 'Capgemini'].map((company, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SCHOLARSHIPS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
            <h2 className="text-lg font-extrabold text-[#333333]">Scholarship Schemes</h2>
            <div className="space-y-2 text-xs font-medium text-gray-600">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#FA394A]">Merit Scholarship:</span> Up to 30% tuition fee waiver for top scorers.
                </div>
                <span className="text-[10px] font-black bg-[#FA394A] text-white px-2.5 py-1 rounded-md">30% OFF</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-blue-700">Defense Personnel Concession:</span> 15% special discount for armed forces families.
                </div>
                <span className="text-[10px] font-black bg-blue-700 text-white px-2.5 py-1 rounded-md">15% OFF</span>
              </div>
            </div>
          </div>

          {/* FAQS ACCORDION */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#333333] flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-[#FA394A]" /> Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {defaultFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 text-left font-extrabold text-xs text-[#333333] bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#FA394A]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RELATED UNIVERSITIES */}
          {relatedColleges.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-[#333333]">Other Recommended Online Universities</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedColleges.map((rel) => (
                  <div key={rel._id} className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={rel.logo || rel.image || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100'}
                        alt={rel.name}
                        className="w-12 h-12 rounded-xl object-contain bg-white p-1 border shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-xs text-[#333333]">{rel.name}</h4>
                        <span className="text-[10px] text-gray-500">{rel.location}</span>
                      </div>
                    </div>

                    <Link
                      to={`/colleges/${rel.slug}`}
                      className="block w-full text-center bg-gray-100 hover:bg-[#FA394A] hover:text-white text-[#333333] font-bold text-xs py-2 rounded-xl transition-all"
                    >
                      View University Profile
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR - STICKY COUNSELING CARD */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xl space-y-5 sticky top-24">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-[#FA394A] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
                Free Admission Guidance
              </span>
              <h3 className="text-lg font-black text-[#333333] pt-1">Apply to {college.name}</h3>
              <p className="text-xs text-gray-500">
                Get free 1-on-1 counseling, syllabus brochure, and fee installment plan.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleOpenModal('general')}
                className="w-full bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-[#FA394A]/20 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Free University Prospectus</span>
              </button>

              <button
                onClick={() => navigate(`/apply?collegeId=${college._id}`)}
                className="w-full bg-[#333333] hover:bg-black text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center space-x-2"
              >
                <span>Apply Online Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenModal('fee_structure')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-[#333333] font-bold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center space-x-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Check EMI & Fee Schedule</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] font-medium text-gray-500">
              <div className="flex items-center">
                <Check className="w-3.5 h-3.5 text-green-600 mr-2 shrink-0" />
                <span>Direct University Admissions</span>
              </div>
              <div className="flex items-center">
                <Check className="w-3.5 h-3.5 text-green-600 mr-2 shrink-0" />
                <span>Zero Admission Processing Fee</span>
              </div>
              <div className="flex items-center">
                <Check className="w-3.5 h-3.5 text-green-600 mr-2 shrink-0" />
                <span>Official LMS Credentials</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENQUIRY / BROCHURE / FEE MODAL */}
      {modalOpen && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultCollege={college.name}
          defaultProgram={selectedProgramTitle}
          type={modalType}
          title={
            modalType === 'brochure'
              ? `Download ${college.name} Brochure`
              : modalType === 'fee_structure'
              ? `Get ${college.name} Fee Details`
              : `Enquiry for ${college.name}`
          }
        />
      )}
    </div>
  );
};
