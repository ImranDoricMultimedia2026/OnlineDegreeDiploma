import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Sparkles,
  BookOpen,
  Building2,
  PhoneCall,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { SiteSettings, College, Program } from '../../types';

export const COLLEGE_NAV_ITEMS = [
  { name: 'LPU Online', slug: 'lpu-online', loc: 'Jalandhar, Punjab' },
  { name: 'CU Online', slug: 'cu-online', loc: 'Mohali, Punjab' },
  { name: 'Delhi University (DU) SOL', slug: 'delhi-university-du-sol', loc: 'Delhi, India' },
  { name: 'Amity Online', slug: 'amity-online', loc: 'Noida / Gurugram' },
  { name: 'IGNOU', slug: 'ignou', loc: 'New Delhi, India' },
  { name: 'GLA University Online', slug: 'gla-university-online', loc: 'Mathura, UP' },
  { name: 'SSODL', slug: 'ssodl', loc: 'Pune, Maharashtra' },
  { name: 'AMU Online', slug: 'amu-online', loc: 'Aligarh, UP' },
  { name: 'Online Manipal University', slug: 'online-manipal-university', loc: 'Karnataka' },
  { name: 'Online Mizoram University', slug: 'online-mizoram-university', loc: 'Aizawl, Mizoram' },
  { name: 'Online Uttaranchal University', slug: 'online-uttaranchal-university', loc: 'Dehradun, UK' },
  { name: 'Jamia Hamdard Online', slug: 'jamia-hamdard-online', loc: 'New Delhi' }
];

export const PROGRAM_NAV_ITEMS = [
  // PG Courses
  { title: 'MBA', slug: 'mba', type: 'PG' },
  { title: 'MCA', slug: 'mca', type: 'PG' },
  { title: 'M.Com', slug: 'mcom', type: 'PG' },
  { title: 'M.Sc. IT', slug: 'msc-it', type: 'PG' },
  { title: 'MA English', slug: 'ma-english', type: 'PG' },
  { title: 'MA History', slug: 'ma-history', type: 'PG' },
  { title: 'MA Hindi', slug: 'ma-hindi', type: 'PG' },
  { title: 'MA Punjabi', slug: 'ma-punjabi', type: 'PG' },
  { title: 'MA Pol. Sci.', slug: 'ma-political-science', type: 'PG' },
  { title: 'MA Maths', slug: 'ma-mathematics', type: 'PG' },
  { title: 'MA Sociology', slug: 'ma-sociology', type: 'PG' },
  { title: 'MA Education', slug: 'ma-education', type: 'PG' },
  { title: 'MA Economics', slug: 'ma-economics', type: 'PG' },
  { title: 'MLIS', slug: 'mlis', type: 'PG' },

  // UG Courses
  { title: 'BBA', slug: 'bba', type: 'UG' },
  { title: 'BCA', slug: 'bca', type: 'UG' },
  { title: 'BA', slug: 'ba', type: 'UG' },

  // Diploma Courses
  { title: 'DBA', slug: 'dba', type: 'Diploma' },
  { title: 'DCA', slug: 'dca', type: 'Diploma' }
];

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collegesDropdownOpen, setCollegesDropdownOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCollegesOpen, setMobileCollegesOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);

  const collegeMenuRef = useRef<HTMLDivElement>(null);
  const programMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [programNavItems, setProgramNavItems] = useState<Program[]>([]);

  useEffect(() => {
    api.get('/settings').then((res) => {
      if (res.data.success && res.data.settings) {
        setSettings(res.data.settings);
      }
    }).catch(() => null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    api.get('/programs?limit=100')
      .then((res) => {
        if (isMounted && res.data.success && Array.isArray(res.data.programs)) {
          setProgramNavItems(res.data.programs);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProgramNavItems([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setCollegesDropdownOpen(false);
    setProgramsDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (collegeMenuRef.current && !collegeMenuRef.current.contains(e.target as Node)) {
        setCollegesDropdownOpen(false);
      }
      if (programMenuRef.current && !programMenuRef.current.contains(e.target as Node)) {
        setProgramsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fallbackPrograms: Program[] = PROGRAM_NAV_ITEMS.map((item, index) => ({
    _id: item.slug || `fallback-${index}`,
    title: item.title,
    slug: item.slug,
    collegeId: '',
    collegeName: '',
    degreeType: item.type,
    duration: '',
    fee: '',
    eligibility: '',
    specializations: [],
    overview: '',
    isActive: true
  }));

  const displayPrograms = programNavItems.length > 0 ? programNavItems : fallbackPrograms;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      {/* Top Bar Banner */}
      <div className="bg-[#333333] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> {settings?.headerAnnouncement || 'Free Admission & Career Counselling Available'}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">UGC & AICTE Entitled Online Degree Programs</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href={`tel:${settings?.phonePrimary || '+919876543210'}`} className="hover:text-[#FA394A] transition-colors flex items-center">
              <PhoneCall className="w-3 h-3 mr-1 text-[#FA394A]" /> Helpline: {settings?.phonePrimary || '+91 98765 43210'}
            </a>
            <Link to="/contact" className="hover:text-[#FA394A] transition-colors">
              Support Center
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
       {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
       <div className="flex items-center">
  <img
    src="/images/online-Degree-Diploma-1.webp"
    alt="Online Degree Diploma"
    className="h-12 w-auto object-contain"
  />
</div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-[#333333]">
            <Link
              to="/"
              className={`hover:text-[#FA394A] transition-colors ${
                location.pathname === '/' ? 'text-[#FA394A] font-bold' : ''
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`hover:text-[#FA394A] transition-colors ${
                location.pathname === '/about' ? 'text-[#FA394A] font-bold' : ''
              }`}
            >
              About Us
            </Link>

            {/* Colleges Dropdown */}
            <div className="relative" ref={collegeMenuRef}>
              <button
                onClick={() => {
                  setCollegesDropdownOpen(!collegesDropdownOpen);
                  setProgramsDropdownOpen(false);
                }}
                className={`flex items-center space-x-1 py-2 hover:text-[#FA394A] transition-colors ${
                  location.pathname.startsWith('/colleges') ? 'text-[#FA394A] font-bold' : ''
                }`}
              >
                <span>Colleges</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    collegesDropdownOpen ? 'rotate-180 text-[#FA394A]' : ''
                  }`}
                />
              </button>

              {/* Colleges Mega Menu */}
              {collegesDropdownOpen && (
                <div className="absolute top-full left-0 w-[600px] -ml-20 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center text-[#FA394A] font-bold text-sm">
                      <Building2 className="w-4 h-4 mr-2" /> Top Accredited Universities
                    </div>
                    <Link
                      to="/colleges"
                      className="text-xs text-[#FA394A] hover:underline font-semibold"
                    >
                      View All 12 Universities →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                    {COLLEGE_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/colleges/${item.slug}`}
                        className="p-2 rounded-xl hover:bg-[#FFE8EA] transition-colors flex flex-col group/item"
                      >
                        <span className="text-xs font-bold text-[#333333] group-hover/item:text-[#FA394A]">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#999999]">{item.loc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Programs Dropdown */}
            <div className="relative" ref={programMenuRef}>
              <button
                onClick={() => {
                  setProgramsDropdownOpen(!programsDropdownOpen);
                  setCollegesDropdownOpen(false);
                }}
                className={`flex items-center space-x-1 py-2 hover:text-[#FA394A] transition-colors ${
                  location.pathname.startsWith('/programs') ? 'text-[#FA394A] font-bold' : ''
                }`}
              >
                <span>Programs</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    programsDropdownOpen ? 'rotate-180 text-[#FA394A]' : ''
                  }`}
                />
              </button>

              {/* Programs Mega Menu */}
              {programsDropdownOpen && (
                <div className="absolute top-full left-0 w-[580px] -ml-28 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center text-[#FA394A] font-bold text-sm">
                      <BookOpen className="w-4 h-4 mr-2" /> Explore Degrees & Diplomas
                    </div>
                    <Link
                      to="/programs"
                      className="text-xs text-[#FA394A] hover:underline font-semibold"
                    >
                      View All {displayPrograms.length} Programs →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
                    {displayPrograms.map((item) => {
                      const programRoute = `/programs/${encodeURIComponent(item.slug || item._id)}`;
                      return (
                        <Link
                          key={item.slug || item._id}
                          to={programRoute}
                          className="p-2.5 rounded-xl hover:bg-[#FFE8EA] transition-colors flex items-center justify-between group/p"
                        >
                        <span className="text-xs font-bold text-[#333333] group-hover/p:text-[#FA394A]">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 group-hover/p:bg-[#FA394A] group-hover/p:text-white">
                          {item.degreeType || 'PG'}
                        </span>
                      </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`hover:text-[#FA394A] transition-colors ${
                location.pathname === '/contact' ? 'text-[#FA394A] font-bold' : ''
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Desktop User / Auth Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/apply"
              className="bg-[#FA394A] hover:bg-[#D92B3B] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#FA394A]/20 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Apply Now
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 py-2 px-3.5 rounded-xl transition-colors border border-gray-200"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FA394A] text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-[#333333] max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#333333]">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#FFE8EA] text-[#FA394A] font-bold text-[10px] rounded uppercase">
                        {user.role} Account
                      </span>
                    </div>

                    <Link
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      className="flex items-center px-4 py-2.5 text-xs font-semibold text-[#333333] hover:bg-[#FFE8EA] hover:text-[#FA394A] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      {user.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[#333333] hover:text-[#FA394A] font-bold text-sm py-2 px-3 border border-gray-300 hover:border-[#FA394A] rounded-xl transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <Link
              to="/apply"
              className="bg-[#FA394A] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#333333] hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#FA394A]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Drawer Navigation Portal - Placed OUTSIDE sticky header to avoid CSS backdrop-blur containment */}
    {mobileMenuOpen && (
      <div className="relative z-[999] lg:hidden">
        {/* Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-in Drawer Panel */}
         <div className="fixed inset-y-0 right-0 w-[85vw] max-w-xs bg-white shadow-2xl flex flex-col justify-between overflow-y-auto p-6 z-[1000] border-l border-gray-200">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center space-x-2">
                {/* <div className="w-8 h-8 rounded-lg bg-[#FA394A] flex items-center justify-center text-white shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div> */}
             <div className="flex items-center">
  <img
    src="/images/online-Degree-Diploma-1.webp"
    alt="Online Degree Diploma"
    className="h-12 w-auto object-contain"
  />
</div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#FA394A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-3 text-sm font-bold text-[#333333]">
              <Link
                to="/"
                className={`block py-2.5 px-3 rounded-xl hover:bg-gray-50 hover:text-[#FA394A] transition-colors ${
                  location.pathname === '/' ? 'bg-[#FFE8EA] text-[#FA394A]' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/about"
                className={`block py-2.5 px-3 rounded-xl hover:bg-gray-50 hover:text-[#FA394A] transition-colors ${
                  location.pathname === '/about' ? 'bg-[#FFE8EA] text-[#FA394A]' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>

              {/* Colleges Accordion */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setMobileCollegesOpen(!mobileCollegesOpen)}
                  className="w-full flex justify-between items-center py-2.5 px-3 text-left hover:bg-gray-50 hover:text-[#FA394A] transition-colors"
                >
                  <span className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-[#FA394A]" /> Colleges
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileCollegesOpen ? 'rotate-180 text-[#FA394A]' : 'text-gray-400'
                    }`}
                  />
                </button>
                {mobileCollegesOpen && (
                  <div className="bg-gray-50/80 p-2 space-y-1 max-h-60 overflow-y-auto border-t border-gray-100">
                    {COLLEGE_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/colleges/${item.slug}`}
                        className="block text-xs font-semibold text-gray-700 hover:text-[#FA394A] hover:bg-white p-2 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Programs Accordion */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setMobileProgramsOpen(!mobileProgramsOpen)}
                  className="w-full flex justify-between items-center py-2.5 px-3 text-left hover:bg-gray-50 hover:text-[#FA394A] transition-colors"
                >
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-[#FA394A]" /> Programs
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileProgramsOpen ? 'rotate-180 text-[#FA394A]' : 'text-gray-400'
                    }`}
                  />
                </button>
                {mobileProgramsOpen && (
                  <div className="bg-gray-50/80 p-2 space-y-1 max-h-60 overflow-y-auto border-t border-gray-100">
                    {displayPrograms.map((item) => {
                      const programRoute = `/programs/${encodeURIComponent(item.slug || item._id)}`;
                      return (
                        <Link
                          key={item.slug || item._id}
                          to={programRoute}
                          className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-[#FA394A] hover:bg-white p-2 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                        <span>{item.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">
                          {item.degreeType || 'PG'}
                        </span>
                      </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className={`block py-2.5 px-3 rounded-xl hover:bg-gray-50 hover:text-[#FA394A] transition-colors ${
                  location.pathname === '/contact' ? 'bg-[#FFE8EA] text-[#FA394A]' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
            <a
              href="tel:+919876543210"
              className="w-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-extrabold py-2.5 rounded-xl text-xs border border-emerald-200"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Helpline: +91 98765 43210
            </a>

            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="w-full flex items-center justify-center bg-gray-100 text-[#333333] font-bold py-2.5 rounded-xl text-xs hover:bg-gray-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-xs hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="w-full text-center border border-gray-300 text-[#333333] font-bold py-2.5 rounded-xl text-xs hover:border-[#FA394A] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/apply"
                  className="w-full text-center bg-[#FA394A] text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-[#FA394A]/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>
);
};
