import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, BookOpen, Clock, Building2, Filter, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { Program, College } from '../types';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { getAssetUrl } from '../utils/image';

export const ProgramsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedDegreeType, setSelectedDegreeType] = useState(searchParams.get('degreeType') || '');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'general' | 'brochure' | 'fee_structure'>('brochure');
  const [selectedCollegeName, setSelectedCollegeName] = useState('');
  const [selectedProgramName, setSelectedProgramName] = useState('');

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const colRes = await api.get('/colleges');
        if (colRes.data.success) setColleges(colRes.data.colleges);
      } catch (e) {
        console.error('Error fetching colleges list:', e);
      }
    };
    fetchInitial();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/programs?search=${encodeURIComponent(search)}&degreeType=${encodeURIComponent(selectedDegreeType)}&collegeId=${encodeURIComponent(selectedCollegeId)}`
      );
      if (res.data.success) {
        setPrograms(res.data.programs);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [search, selectedDegreeType, selectedCollegeId]);

  const openModal = (type: 'general' | 'brochure' | 'fee_structure', colName = '', progName = '') => {
    setModalType(type);
    setSelectedCollegeName(colName);
    setSelectedProgramName(progName);
    setModalOpen(true);
  };

  return (
 <>

<Helmet>
  <title>Online Degree & Diploma Courses 2026 | MBA, BCA, MCA & More</title>

  <meta
    name="description"
    content="Explore UGC-recognized online degree and diploma courses including MBA, BCA, MCA, BBA and more from LPU, CU, IGNOU and other leading universities. Compare fees, duration and eligibility."
  />

  <link
    rel="canonical"
    href="https://onlinedegreediploma.com/programs"
  />
</Helmet>
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-16">
      {/* Header Banner */}
     <div className="relative overflow-hidden py-16 sm:py-20 lg:py-24">

  {/* Background Image */}
  <img
    src="/PagesBanner/5.png"
    alt="Online Courses"
    className="absolute inset-0 w-full h-full object-cover object-center"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/20"></div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">

    <span className="text-xs sm:text-sm font-bold text-[#FA394A] uppercase tracking-[3px]">
      Online Degree Directory
    </span>

    <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
      Explore All
      <span className="block text-[#FA394A]">
        17 Degree & Diploma Courses
      </span>
    </h1>

    <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-lg text-gray-200 leading-7">
      Find the right online program matching your qualification, budget,
      and career goals with verified university accreditations.
    </p>

  </div>

</div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search & Filter Options */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Keyword Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search program title or specialization..."
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FA394A]"
              />
            </div>

            {/* Degree Type Filter */}
            <div>
              <select
                value={selectedDegreeType}
                onChange={(e) => setSelectedDegreeType(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FA394A]"
              >
                <option value="">All Degree Types (UG, PG, Diploma)</option>
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma Courses</option>
              </select>
            </div>

            {/* College Filter */}
            <div>
              <select
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FA394A]"
              >
                <option value="">All Partner Universities</option>
                {colleges.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Program Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-500 font-bold">
            Loading online degree programs...
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-extrabold text-[#333333]">No Courses Found</h3>
            <p className="text-xs text-gray-500">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedDegreeType('');
                setSelectedCollegeId('');
              }}
              className="bg-[#FA394A] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program._id}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {program.image && (
                    <img
                      src={getAssetUrl(program.image)}
                      alt={program.title}
                      className="h-36 w-full rounded-2xl object-cover border border-gray-200"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FFE8EA] text-[#FA394A] text-[10px] font-bold uppercase">
                      {program.degreeType}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" /> {program.duration}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#333333] group-hover:text-[#FA394A] transition-colors leading-snug">
                    {program.title}
                  </h3>

                  <p className="text-xs font-bold text-gray-500 flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-[#FA394A]" /> {program.collegeName}
                  </p>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {program.overview}
                  </p>

                  {program.specializations && program.specializations.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Key Specializations</p>
                      <div className="flex flex-wrap gap-1">
                        {program.specializations.slice(0, 3).map((spec, idx) => (
                          <span key={idx} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Estimated Fee</p>
                    <p className="text-xs font-black text-[#FA394A]">{program.fee}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <Link
                    to={`/programs/${program.slug || program._id}`}
                    className="text-center py-2.5 border border-gray-300 text-[#333333] hover:border-[#FA394A] hover:text-[#FA394A] font-bold text-xs rounded-xl transition-colors"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => openModal('brochure', program.collegeName, program.title)}
                    className="bg-[#FA394A] hover:bg-[#D92B3B] text-white py-2.5 font-bold text-xs rounded-xl transition-all flex items-center justify-center"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Brochure
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

   {modalOpen && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          defaultCollege={selectedCollegeName}
          defaultProgram={selectedProgramName}
          title={`Download Prospectus for ${selectedProgramName}`}
        />
      )}
    </div>
 
 </>
  );
};
