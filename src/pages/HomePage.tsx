import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Building2,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Download,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Briefcase,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import { College, Program, FAQ, Testimonial, HeroSlide } from '../types';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { getAssetUrl } from '../utils/image';
import { Helmet } from 'react-helmet-async';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [sliders, setSliders] = useState<HeroSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [colleges, setColleges] = useState<College[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegreeType, setSelectedDegreeType] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'general' | 'brochure' | 'fee_structure'>('general');
  const [selectedCollegeName, setSelectedCollegeName] = useState('');
  const [selectedProgramName, setSelectedProgramName] = useState('');

  // Helper function to truncate text with HTML tag stripping
  const truncateText = (text: string, maxLength: number = 80) => {
    if (!text) return 'No description available.';
    // Remove HTML tags
    const cleanText = text.replace(/<[^>]*>/g, '');
    // Trim extra spaces
    const trimmedText = cleanText.trim();
    if (trimmedText.length <= maxLength) return trimmedText;
    return trimmedText.substring(0, maxLength) + '...';
  };

  // Fetch Homepage API Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidersRes, collegesRes, programsRes, faqsRes, tstRes] = await Promise.all([
          api.get('/sliders'),
          api.get('/colleges?limit=50'),
          api.get('/programs?limit=100'),
          api.get('/faqs'),
          api.get('/testimonials')
        ]);

        if (slidersRes.data.success) setSliders(slidersRes.data.sliders);
        if (collegesRes.data.success) setColleges(collegesRes.data.colleges);
        if (programsRes.data.success) setPrograms(programsRes.data.programs);
        if (faqsRes.data.success) {
          setFaqs(faqsRes.data.faqs.filter((faq: any) => faq.isActive !== false));
        }
        if (tstRes.data.success) {
          setTestimonials(tstRes.data.testimonials.filter((t: any) => t.isActive !== false));
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      }
    };

    fetchData();
  }, []);

  // Hero Slider Auto-play
  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliders.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [sliders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/programs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/programs');
    }
  };

  const openEnquiry = (type: 'general' | 'brochure' | 'fee_structure', colName = '', progName = '') => {
    setModalType(type);
    setSelectedCollegeName(colName);
    setSelectedProgramName(progName);
    setModalOpen(true);
  };

  return (
 <>
  <Helmet>
  <title>Online Degree Diploma | LPU, CU & 12+ UGC Online Universities</title>
  <meta name="description" content="Free counselling for online degrees & diplomas from LPU Online, CU Online, IGNOU, Amity & 8+ UGC-recognized universities. Compare fees, apply online, download brochures." />
  <meta name="keywords" content="LPU online admission, CU online admission, online degree India, UGC online university, online MBA LPU, distance education 2026" />
</Helmet>
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900 font-sans transition-colors duration-300">
      {/* HERO SLIDER SECTION */}
      <section className="relative bg-[#333333] dark:bg-black text-white overflow-hidden min-h-[520px] sm:min-h-[600px] flex items-center">
        {sliders.length > 0 ? (
          sliders.map((slide, idx) => (
            <div
              key={slide._id}
              className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img
                loading="lazy"
                decoding="async"
                src={slide.bgImage}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-12">
                <div className="max-w-3xl space-y-5">
                  {slide.badge && (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#FA394A] text-white shadow-lg animate-pulse">
                      {slide.badge}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-200 font-medium max-w-2xl leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-3.5 pt-2">
                    <Link
                      to={slide.primaryBtnLink || '/programs'}
                      className="bg-[#FA394A] hover:bg-[#D92B3B] text-white px-7 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl transition-all hover:scale-105 flex items-center"
                    >
                      <span>{slide.primaryBtnText}</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                    <Link
                      to={slide.secondaryBtnLink || '/apply'}
                      className="bg-[#ff3b57] hover:bg-[#e62f4d] text-white px-7 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      {slide.secondaryBtnText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center text-white relative z-20 w-full">
            <h1 className="text-3xl sm:text-5xl font-black mb-4">
              Find India Top Online Degrees & Diplomas
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8">
              Compare 12+ UGC-recognized universities, explore 17+ online degree programs, download official syllabus PDFs, and apply online with expert counselling.
            </p>
          </div>
        )}

        {/* Slider Controls */}
        {sliders.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
            <button
              onClick={() =>
                setCurrentSlideIndex((prev) => (prev === 0 ? sliders.length - 1 : prev - 1))
              }
              className="p-2 rounded-full bg-black/40 hover:bg-[#FA394A] text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex space-x-2">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === currentSlideIndex ? 'bg-[#FA394A] w-6' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % sliders.length)}
              className="p-2 rounded-full bg-black/40 hover:bg-[#FA394A] text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* QUICK SEARCH & FILTER BAR */}
      <div className="max-w-6xl mx-auto px-4 -mt-4 relative z-30 overflow-hidden">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full"
        >
          {/* Search Input */}
          <div className="flex-1 relative min-w-0">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by degree name (e.g. MBA, BCA, MCA, BBA, Diploma)..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl text-xs sm:text-sm text-[#333333] dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FA394A] font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex w-full md:w-auto gap-3">
            <button
              type="submit"
              className="flex-1 md:flex-none bg-[#FA394A] hover:bg-[#D92B3B] text-white px-4 sm:px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center whitespace-nowrap"
            >
              <Search className="w-4 h-4 mr-2 flex-shrink-0" />
              Search Programs
            </button>
            <button
              type="button"
              onClick={() => openEnquiry("general")}
              className="flex-1 md:flex-none bg-[#333333] dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white px-4 sm:px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap"
            >
              Get Counselling
            </button>
          </div>
        </form>
      </div>

      {/* STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#FA394A]">12+</p>
            <p className="text-xs font-bold text-[#333333] dark:text-gray-200 uppercase mt-1">UGC Accredited Universities</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#FA394A]">17+</p>
            <p className="text-xs font-bold text-[#333333] dark:text-gray-200 uppercase mt-1">Online Degrees & Diplomas</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#FA394A]">100%</p>
            <p className="text-xs font-bold text-[#333333] dark:text-gray-200 uppercase mt-1">Government Job Valid Degrees</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#FA394A]">25,000+</p>
            <p className="text-xs font-bold text-[#333333] dark:text-gray-200 uppercase mt-1">Students Counselled & Enrolled</p>
          </div>
        </div>
      </section>

      {/* POPULAR COLLEGES SECTION - WITH SHORTENED DESCRIPTIONS */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-[#FA394A] uppercase tracking-wider">Top Ranked Partners</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#333333] dark:text-gray-100 mt-1">
                Explore Premier Online Universities
              </h2>
            </div>
            <Link
              to="/colleges"
              className="mt-3 md:mt-0 inline-flex items-center text-xs font-bold text-[#FA394A] hover:underline"
            >
              <span>View All 12 Universities</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <div
                key={college._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 overflow-hidden shadow-sm transition-all duration-300 flex flex-col group"
              >
                {/* College Banner & Logo */}
                <div className="relative h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={college.banner}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center space-x-3">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={college.logo}
                      alt={college.name}
                      className="w-12 h-12 rounded-xl bg-white p-1 shadow-md object-contain border border-gray-200"
                    />
                    <div>
                      <h3 className="text-white font-extrabold text-sm drop-shadow line-clamp-1 max-w-[150px]">
                        {college.name}
                      </h3>
                      <p className="text-gray-200 text-[11px] font-medium flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-[#FA394A]" /> {college.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body Details - SHORTENED DESCRIPTION (80 characters max) */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {truncateText(college.description, 80)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(Array.isArray(college.approvals)
                      ? college.approvals
                      : typeof college.approvals === 'string'
                        ? (college.approvals as string).split(',')
                        : []
                    ).slice(0, 3).map((app, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#FFE8EA] dark:bg-[#4a1d21] text-[#FA394A] text-[10px] font-bold"
                      >
                        {typeof app === 'string' ? app.trim() : app}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <Link
                      to={`/colleges/${college.slug}`}
                      className="text-xs font-bold text-[#333333] dark:text-gray-200 hover:text-[#FA394A] transition-colors"
                    >
                      View Details →
                    </Link>
                    <button
                      onClick={() => openEnquiry('general', college.name)}
                      className="bg-[#FA394A] hover:bg-[#D92B3B] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PROGRAMS SECTION */}
      <section className="py-16 bg-[#F5F5F5] dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#FA394A] uppercase tracking-wider">Career Focused Education</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#333333] dark:text-gray-100 mt-1">
              Popular Online Degree & Diploma Courses
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
              Select from top-rated Bachelor, Master, and Diploma programs with flexible examinations and affordable tuition.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center flex-wrap gap-2 mb-8">
            {['ALL', 'UG', 'PG', 'Diploma'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedDegreeType(type)}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${selectedDegreeType === type
                    ? 'bg-[#FA394A] text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-[#333333] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
              >
                {type === 'ALL' ? 'All Programs' : type === 'UG' ? 'Undergraduate (UG)' : type === 'PG' ? 'Postgraduate (PG)' : 'Diplomas'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programs
              .filter((p) => selectedDegreeType === 'ALL' || p.degreeType === selectedDegreeType)
              .map((program) => (
                <div
                  key={program._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 flex flex-col justify-between group relative"
                >
                  <div className="space-y-3">
                    {program.image ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={getAssetUrl(program.image)}
                        alt={program.title}
                        className="h-36 w-full rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="h-36 w-full rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gradient-to-br from-[#FFE8EA] dark:from-[#4a1d21] to-gray-50 dark:to-gray-800 flex items-center justify-center text-[11px] font-bold text-gray-500 dark:text-gray-400">
                        No Cover Image
                      </div>
                    )}
                    {/* Top Row: PG/UG/Diploma badge & Fee */}
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                      <span className="px-2.5 py-1 rounded-md bg-[#FFE8EA] dark:bg-[#4a1d21] text-[#FA394A] text-[11px] font-black uppercase tracking-wider">
                        {program.degreeType || 'PG'}
                      </span>
                      <span className="text-sm font-black text-[#FA394A] tracking-tight">
                        {program.fee || '₹40,400 /sem'}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="font-black text-lg text-[#333333] dark:text-gray-100 group-hover:text-[#FA394A] transition-colors leading-snug">
                        {program.title}
                      </h3>
                      {program.name && program.name !== program.title && (
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                          {program.name}
                        </p>
                      )}
                    </div>

                    {/* Overview - SHORTENED (80 characters) */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {truncateText(program.overview || 'Career focused online degree program.', 80)}
                    </p>

                    {/* Key Attributes */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300 gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#FA394A] flex-shrink-0" />
                        <span>{program.duration || '2 Years'}</span>
                      </div>
                      {program.specializations && program.specializations.length > 0 && (
                        <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300 gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-[#FA394A] flex-shrink-0" />
                          <span className="truncate">{program.specializations[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Eligibility - SHORTENED (50 characters) */}
                    {program.eligibility && (
                      <div className="bg-gray-50 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 text-[11px] text-gray-600 dark:text-gray-400 font-medium">
                        <span className="font-bold text-[#333333] dark:text-gray-200">Eligibility:</span> {truncateText(program.eligibility, 50)}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">
                    <Link
                      to={`/apply?programId=${program._id}&collegeId=${program.collegeId || 'col_02'}`}
                      className="text-center py-2.5 bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                    >
                      Apply Now
                    </Link>
                    <Link
                      to={`/programs/${program.slug || program._id}`}
                      className="text-center py-2.5 border border-gray-300 dark:border-gray-600 text-[#333333] dark:text-gray-200 hover:border-[#FA394A] hover:text-[#FA394A] font-bold text-xs rounded-xl transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/programs"
              className="inline-flex items-center bg-[#333333] dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <span>Explore All Degree & Diploma Courses</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FA394A] uppercase tracking-wider">Trusted Education Platform</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#333333] dark:text-gray-100 mt-1">
              Why Choose Online Degree Diploma?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#F5F5F5] dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700 space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-[#FA394A] text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#333333] dark:text-gray-100">Verified Universities</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                All listed institutions are 100% UGC-entitled, NAAC accredited, and recognized by DEB/AICTE for higher education & job eligibility.
              </p>
            </div>

            <div className="bg-[#F5F5F5] dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700 space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-[#FA394A] text-white flex items-center justify-center shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#333333] dark:text-gray-100">Flexible Learning</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Learn at your own pace with self-paced online portals, recorded lectures, digital libraries, and online proctored exams.
              </p>
            </div>

            <div className="bg-[#F5F5F5] dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700 space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-[#FA394A] text-white flex items-center justify-center shadow-md">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#333333] dark:text-gray-100">Career-Focused Programs</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Industry-aligned curriculum tailored to job market needs, with soft-skills training and dedicated placement support.
              </p>
            </div>

            <div className="bg-[#F5F5F5] dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700 space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-[#FA394A] text-white flex items-center justify-center shadow-md">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#333333] dark:text-gray-100">1-on-1 Expert Guidance</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Get free unbiased counselling from senior admission experts to choose the perfect course and university for your budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ADMISSION PROCESS STEPS */}
      <section className="py-16 bg-[#333333] dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FA394A] uppercase tracking-wider">Simple 5-Step Path</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              How Admission Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: '1', title: 'Choose Program', desc: 'Browse 17+ online degree and diploma courses.' },
              { num: '2', title: 'Submit Enquiry', desc: 'Fill out our free counselling or brochure request form.' },
              { num: '3', title: 'Get Counselling', desc: 'Speak with an academic advisor regarding fee & eligibility.' },
              { num: '4', title: 'Apply Online', desc: 'Upload documents & complete university registration.' },
              { num: '5', title: 'Confirm Admission', desc: 'Receive student ID, LMS credentials & begin learning!' }
            ].map((step) => (
              <div key={step.num} className="bg-gray-800/80 p-6 rounded-3xl border border-gray-700 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#FA394A] text-white font-black text-lg flex items-center justify-center">
                  {step.num}
                </div>
                <h3 className="font-extrabold text-sm text-white">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FA394A] uppercase tracking-wider">Student Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#333333] dark:text-gray-100 mt-1">
              What Our Learners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t._id} className="bg-[#F5F5F5] dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700 space-y-4 flex flex-col justify-between">
                <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {t.image ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={t.image}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#FA394A]"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gray-200 border-2 border-[#FA394A] text-[#333333] flex items-center justify-center font-black text-xs">
                      {t.name?.charAt(0) || 'S'}
                    </div>
                  )}
                  <div>
                    <p className="font-extrabold text-xs text-[#333333] dark:text-gray-100">{t.name}</p>
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{t.course} — {t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-16 bg-[#F5F5F5] dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#FA394A] uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#333333] dark:text-gray-100 mt-1">
              Admission & Degree Validity FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={faq._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                  className="w-full text-left p-5 flex justify-between items-center font-bold text-sm text-[#333333] dark:text-gray-100 hover:text-[#FA394A] transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-[#FA394A] shrink-0 transition-transform ${activeFaqIndex === idx ? 'rotate-90' : ''
                      }`}
                  />
                </button>
                {activeFaqIndex === idx && (
                  <div className="p-5 pt-0 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-[#FA394A] to-[#D92B3B] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black">Ready to Take the Next Step in Your Career?</h2>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
            Get expert guidance from senior admission advisors, check scholarship eligibility, and apply for 2026 online degree batches today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/apply"
              className="bg-white text-[#FA394A] hover:bg-gray-100 px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl transition-all"
            >
              Apply Online Now
            </Link>
            <button
              onClick={() => openEnquiry('general')}
              className="bg-[#333333] hover:bg-black text-white px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xl"
            >
              Request Free Callback
            </button>
          </div>
        </div>
      </section>

      {/* Instant Enquiry Modal Trigger */}
 {modalOpen && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          defaultCollege={selectedCollegeName}
          defaultProgram={selectedProgramName}
        />
      )}
    </div>
 </>
  );
};