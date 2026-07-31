import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Building2, MapPin, Award, CheckCircle, ArrowRight, Filter, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { College } from '../types';
import { EnquiryModal } from '../components/common/EnquiryModal';

export const CollegesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollegeName, setSelectedCollegeName] = useState('');

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/colleges?search=${encodeURIComponent(search)}&state=${encodeURIComponent(selectedState)}`);
      if (res.data.success) {
        let list = res.data.colleges;
        if (sortBy === 'name') {
          list.sort((a: College, b: College) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortBy === 'year') {
          list.sort((a: College, b: College) => String(b.establishedYear || '').localeCompare(String(a.establishedYear || '')));
        }
        setColleges(list);
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [search, selectedState, sortBy]);

  const uniqueStates = ['Delhi', 'Punjab', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Uttarakhand', 'Mizoram'];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-[#333333] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold text-[#FA394A] uppercase tracking-wider">UGC-Recognized Institutions</span>
          <h1 className="text-2xl sm:text-4xl font-black">Top Online Degree Universities & Colleges</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Compare NAAC A+ accredited partner institutions offering accredited online degrees with flexible exams and placement support.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search university name or location..."
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FA394A]"
              />
            </div>

            {/* Filter State */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FA394A]"
              >
                <option value="">All States / Locations</option>
                {uniqueStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Option */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FA394A]"
              >
                <option value="name">Sort by Name (A-Z)</option>
                <option value="year">Sort by Establishment Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-500 font-bold">
            Loading accredited universities...
          </div>
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-extrabold text-[#333333]">No Universities Found</h3>
            <p className="text-xs text-gray-500">Try adjusting your search criteria or clear state filter.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedState('');
              }}
              className="bg-[#FA394A] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <div
                key={college._id}
                className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={college.banner}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center space-x-3">
                    <img
                      src={college.logo}
                      alt={college.name}
                      className="w-12 h-12 rounded-xl bg-white p-1 shadow-md object-contain border border-gray-200"
                    />
                    <div>
                      <h3 className="text-white font-black text-sm drop-shadow">{college.name}</h3>
                      <p className="text-gray-200 text-[11px] font-medium flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-[#FA394A]" /> {college.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {college.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(college.approvals)
                      ? college.approvals
                      : typeof college.approvals === 'string'
                      ? (college.approvals as string).split(',')
                      : []
                    ).map((app, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-[#FFE8EA] text-[#FA394A] text-[10px] font-bold"
                      >
                        {typeof app === 'string' ? app.trim() : app}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/colleges/${college.slug}`}
                      className="text-xs font-bold text-[#333333] hover:text-[#FA394A] flex items-center transition-colors"
                    >
                      <span>Explore University</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Link>

                    <button
                      onClick={() => {
                        setSelectedCollegeName(college.name);
                        setModalOpen(true);
                      }}
                      className="bg-[#FA394A] hover:bg-[#D92B3B] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Enquire
                    </button>
                  </div>
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
          defaultCollege={selectedCollegeName}
          title={`Enquire for ${selectedCollegeName}`}
        />
      )}
    </div>
  );
};
