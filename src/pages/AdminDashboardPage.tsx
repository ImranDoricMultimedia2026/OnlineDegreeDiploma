import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  College,
  Program,
  Enquiry,
  Application,
  User,
  ContactMessage,
  FAQ,
  Testimonial,
  HeroSlide,
  Notification,
  DocumentItem,
  DashboardStats,
  SiteSettings
} from '../types';
import api from '../services/api';
import * as Icons from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'stats'
    | 'enquiries'
    | 'applications'
    | 'colleges'
    | 'programs'
    | 'students'
    | 'contacts'
    | 'faqs'
    | 'testimonials'
    | 'sliders'
    | 'notifications'
    | 'documents'
    | 'settings'
    | 'profile'
  >('stats');

  // Main Data Arrays
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sliders, setSliders] = useState<HeroSlide[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    phonePrimary: '+91 98765 43210',
    phoneSecondary: '1800-123-4567',
    whatsappNumber: '+919876543210',
    emailPrimary: 'admissions@onlinedegreediploma.com',
    emailSupport: 'support@onlinedegreediploma.com',
    address: 'Statesman House, Building 12, Connaught Place, New Delhi, India — 110001',
    googleMapUrl: 'https://maps.google.com/maps?q=Connaught+Place+New+Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://twitter.com',
    youtubeUrl: 'https://youtube.com',
    siteName: 'Online Degree Diploma',
    siteTitle: 'Online Degree & Diploma Admission Portal 2026',
    siteLogoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2923b92552?w=150',
    headerAnnouncement: '⚡ Spring Batch 2026 Admissions Open — UGC & AICTE Entitled Online Degrees',
    footerAboutText: 'India premier higher education & online admission platform enabling working professionals and students to enroll in top UGC-entitled degrees, diplomas, and certifications seamlessly.',
    defaultApplyUrl: '/apply',
    defaultBrochureUrl: '/brochures'
  });

  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Modals & Form States
  // 1. College Modal
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [collegeFormData, setCollegeFormData] = useState({
    name: '',
    code: '',
    slug: '',
    location: '',
    state: '',
    description: '',
    overview: '',
    approvals: 'UGC, DEB, AICTE, NAAC A+',
    website: '',
    applyUrl: '',
    videoUrl: '',
    brochureUrl: '',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150',
    banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000',
    establishedYear: '2005',
    rating: '4.8',
    naacGrade: 'A+',
    feesRange: '₹ 30,000 - ₹ 1,50,000',
    placementPercentage: '85%',
    averagePackage: '₹ 4.5 LPA',
    highestPackage: '₹ 18.0 LPA',
    isActive: true
  });

  // 2. Program Modal
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programFormData, setProgramFormData] = useState({
    title: '',
    slug: '',
    collegeId: '',
    collegeName: '',
    degreeType: 'UG',
    duration: '3 Years (6 Semesters)',
    fee: '₹45,000 / Year',
    eligibility: '10+2 from recognized board',
    specializations: 'Finance, Marketing, HR, IT',
    overview: 'Comprehensive online degree program designed for flexible distance learning.',
    image: '',
    applyUrl: '',
    brochurePdfUrl: '',
    syllabusPdfUrl: '',
    isActive: true
  });

  // 3. Document Modal
  const [showDocModal, setShowDocModal] = useState(false);
  const [docFormData, setDocFormData] = useState({
    title: '',
    type: 'brochure',
    collegeName: '',
    programName: '',
    fileUrl: ''
  });

  // 4. FAQ Modal
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 1,
    isActive: true
  });

  // 5. Testimonial Modal
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState({
    name: '',
    course: 'MBA Online',
    college: 'LPU Online',
    quote: 'The flexible online degree transformed my career trajectory.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isActive: true
  });

  // 6. Hero Slider Modal
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<HeroSlide | null>(null);
  const [sliderFormData, setSliderFormData] = useState({
    title: 'Admissions Open 2026-27',
    subtitle: 'UGC-Approved Online Degrees & Diplomas',
    badge: 'SPRING BATCH 2026',
    bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600',
    mobileBgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
    primaryBtnText: 'Explore Programs',
    primaryBtnLink: '/programs',
    secondaryBtnText: 'Apply Online',
    secondaryBtnLink: '/apply',
    order: 1,
    isActive: true
  });

  // 7. Notification Modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationFormData, setNotificationFormData] = useState({
    title: '',
    message: '',
    userId: 'all',
    type: 'info'
  });

  // Admin Profile Form
  const [adminName, setAdminName] = useState(user?.name || '');
  const [adminPhone, setAdminPhone] = useState(user?.phone || '');
  const [adminState, setAdminState] = useState(user?.state || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Student Detail Modal
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<{
    student: User;
    applications: Application[];
    enquiries: Enquiry[];
  } | null>(null);

  // Helper for single file upload to server
  const uploadFile = async (file: File): Promise<string> => {
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showToast('File uploaded successfully!');
        return data.fileUrl;
      } else {
        throw new Error(data.message || 'File upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
      return '';
    } finally {
      setUploadingFile(false);
    }
  };

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Fetch All Admin Data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        collegesRes,
        programsRes,
        enquiriesRes,
        appsRes,
        studentsRes,
        contactsRes,
        faqsRes,
        testimonialsRes,
        slidersRes,
        notificationsRes,
        docsRes,
        settingsRes
      ] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { success: false } })),
        api.get('/colleges?limit=200').catch(() => ({ data: { success: false } })),
        api.get('/programs?limit=500').catch(() => ({ data: { success: false } })),
        api.get('/enquiries').catch(() => ({ data: { success: false } })),
        api.get('/applications').catch(() => ({ data: { success: false } })),
        api.get('/students').catch(() => ({ data: { success: false } })),
        api.get('/contacts').catch(() => ({ data: { success: false } })),
        api.get('/faqs?all=true').catch(() => ({ data: { success: false } })),
        api.get('/testimonials?all=true').catch(() => ({ data: { success: false } })),
        api.get('/sliders?all=true').catch(() => ({ data: { success: false } })),
        api.get('/notifications').catch(() => ({ data: { success: false } })),
        api.get('/documents').catch(() => ({ data: { success: false } })),
        api.get('/settings').catch(() => ({ data: { success: false } }))
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (collegesRes.data.success) setColleges(collegesRes.data.colleges);
      if (programsRes.data.success) setPrograms(programsRes.data.programs);
      if (enquiriesRes.data.success) setEnquiries(enquiriesRes.data.enquiries);
      if (appsRes.data.success) setApplications(appsRes.data.applications);
      if (studentsRes.data.success) setStudents(studentsRes.data.students);
      if (contactsRes.data.success) setContacts(contactsRes.data.contacts);
      if (faqsRes.data.success) setFaqs(faqsRes.data.faqs);
      if (testimonialsRes.data.success) setTestimonials(testimonialsRes.data.testimonials);
      if (slidersRes.data.success) setSliders(slidersRes.data.sliders);
      if (notificationsRes.data.success) setNotifications(notificationsRes.data.notifications);
      if (docsRes.data.success) setDocuments(docsRes.data.documents);
      if (settingsRes.data.success && settingsRes.data.settings) {
        setSiteSettings(settingsRes.data.settings);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update Application Status
  const handleUpdateAppStatus = async (appId: string, status: string, adminRemarks = '') => {
    try {
      const res = await api.patch(`/applications/${appId}/status`, { status, adminRemarks });
      if (res.data.success) {
        showToast(`Application #${appId.substring(0, 6)} updated to ${status}`);
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: status as any, adminRemarks } : a))
        );
      }
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  // Update Enquiry Lead Status
  const handleUpdateEnquiryStatus = async (enqId: string, status: string, remarks = '') => {
    try {
      const res = await api.patch(`/enquiries/${enqId}/status`, { status, remarks });
      if (res.data.success) {
        showToast(`Enquiry updated to ${status}`);
        setEnquiries((prev) =>
          prev.map((e) => (e._id === enqId ? { ...e, status: status as any, remarks } : e))
        );
      }
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  // 1. SAVE UNIVERSITY
  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCollege) {
        const res = await api.put(`/colleges/${editingCollege._id}`, collegeFormData);
        if (res.data.success) {
          showToast('University updated successfully!');
          setShowCollegeModal(false);
          fetchAllData();
        }
      } else {
        const res = await api.post('/colleges', collegeFormData);
        if (res.data.success) {
          showToast('New University added successfully!');
          setShowCollegeModal(false);
          fetchAllData();
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving university record');
    }
  };

  const handleEditCollege = (col: College) => {
    setEditingCollege(col);
    setCollegeFormData({
      name: col.name,
      code: col.code || '',
      slug: col.slug || '',
      location: col.location || '',
      state: col.state || '',
      description: col.description || '',
      overview: col.overview || '',
      approvals: Array.isArray(col.approvals) ? col.approvals.join(', ') : 'UGC, DEB',
      website: col.website || '',
      applyUrl: col.applyUrl || '',
      videoUrl: col.videoUrl || '',
      brochureUrl: col.brochureUrl || '',
      logo: col.logo || '',
      banner: col.banner || '',
      establishedYear: String(col.establishedYear || '2005'),
      rating: String(col.rating || '4.8'),
      naacGrade: col.naacGrade || 'A+',
      feesRange: col.feesRange || '₹ 30,000 - ₹ 1,50,000',
      placementPercentage: col.placementPercentage || '85%',
      averagePackage: col.averagePackage || '₹ 4.5 LPA',
      highestPackage: col.highestPackage || '₹ 18.0 LPA',
      isActive: col.isActive !== undefined ? col.isActive : true
    });
    setShowCollegeModal(true);
  };

  const handleDeleteCollege = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this university? All linked programs will remain.')) return;
    try {
      const res = await api.delete(`/colleges/${id}`);
      if (res.data.success) {
        showToast('University deleted');
        setColleges((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      alert('Error deleting university');
    }
  };

  // 2. SAVE PROGRAM
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        const res = await api.put(`/programs/${editingProgram._id}`, programFormData);
        if (res.data.success) {
          showToast('Program updated successfully!');
          setShowProgramModal(false);
          fetchAllData();
        }
      } else {
        const res = await api.post('/programs', programFormData);
        if (res.data.success) {
          showToast('New Program added successfully!');
          setShowProgramModal(false);
          fetchAllData();
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving program');
    }
  };

  const handleEditProgram = (prog: Program) => {
    setEditingProgram(prog);
    setProgramFormData({
      title: prog.title,
      slug: prog.slug || '',
      collegeId: prog.collegeId,
      collegeName: prog.collegeName,
      degreeType: prog.degreeType,
      duration: prog.duration,
      fee: prog.fee || prog.fees || '',
      eligibility: prog.eligibility,
      specializations: Array.isArray(prog.specializations) ? prog.specializations.join(', ') : '',
      overview: prog.overview || prog.description || '',
      image: prog.image || '',
      applyUrl: prog.applyUrl || '',
      brochurePdfUrl: prog.brochurePdfUrl || '',
      syllabusPdfUrl: prog.syllabusPdfUrl || '',
      isActive: prog.isActive !== undefined ? prog.isActive : true
    });
    setShowProgramModal(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      const res = await api.delete(`/programs/${id}`);
      if (res.data.success) {
        showToast('Program deleted');
        setPrograms((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert('Error deleting program');
    }
  };

  // 3. SAVE FAQ
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        const res = await api.put(`/faqs/${editingFaq._id}`, faqFormData);
        if (res.data.success) {
          showToast('FAQ updated');
          setShowFaqModal(false);
          fetchAllData();
        }
      } else {
        const res = await api.post('/faqs', faqFormData);
        if (res.data.success) {
          showToast('New FAQ created');
          setShowFaqModal(false);
          fetchAllData();
        }
      }
    } catch (err) {
      alert('Error saving FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      const res = await api.delete(`/faqs/${id}`);
      if (res.data.success) {
        showToast('FAQ removed');
        setFaqs((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err) {
      alert('Error deleting FAQ');
    }
  };

  // 4. SAVE TESTIMONIAL
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        const res = await api.put(`/testimonials/${editingTestimonial._id}`, testimonialFormData);
        if (res.data.success) {
          showToast('Testimonial updated');
          setShowTestimonialModal(false);
          fetchAllData();
        }
      } else {
        const res = await api.post('/testimonials', testimonialFormData);
        if (res.data.success) {
          showToast('Review added');
          setShowTestimonialModal(false);
          fetchAllData();
        }
      }
    } catch (err) {
      alert('Error saving testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await api.delete(`/testimonials/${id}`);
      if (res.data.success) {
        showToast('Review deleted');
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      alert('Error deleting testimonial');
    }
  };

  // 5. SAVE SLIDER
  const handleSaveSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlider) {
        const res = await api.put(`/sliders/${editingSlider._id}`, sliderFormData);
        if (res.data.success) {
          showToast('Hero Banner updated');
          setShowSliderModal(false);
          fetchAllData();
        }
      } else {
        const res = await api.post('/sliders', sliderFormData);
        if (res.data.success) {
          showToast('Hero Banner added');
          setShowSliderModal(false);
          fetchAllData();
        }
      }
    } catch (err) {
      alert('Error saving slider');
    }
  };

  const handleDeleteSlider = async (id: string) => {
    if (!window.confirm('Delete this hero banner?')) return;
    try {
      const res = await api.delete(`/sliders/${id}`);
      if (res.data.success) {
        showToast('Hero Banner deleted');
        setSliders((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      alert('Error deleting slider');
    }
  };

  // 6. SAVE DOCUMENT
  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/documents', docFormData);
      if (res.data.success) {
        showToast('Document uploaded successfully!');
        setShowDocModal(false);
        fetchAllData();
      }
    } catch (err) {
      alert('Error uploading document');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const res = await api.delete(`/documents/${id}`);
      if (res.data.success) {
        showToast('Document deleted');
        setDocuments((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (err) {
      alert('Error deleting document');
    }
  };

  // 7. SAVE WEBSITE SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/settings', siteSettings);
      if (res.data.success) {
        showToast('Website contact and site settings updated successfully!');
      }
    } catch (err) {
      alert('Error saving site settings');
    }
  };

  // Broadcast Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/notifications', notificationFormData);
      if (res.data.success) {
        showToast('Notification broadcasted');
        setShowNotificationModal(false);
        setNotificationFormData({ title: '', message: '', userId: 'all', type: 'info' });
        fetchAllData();
      }
    } catch (err) {
      alert('Error broadcasting notification');
    }
  };

  // Save Admin Profile
  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload: any = { name: adminName, phone: adminPhone, state: adminState };
      if (newPassword) payload.password = newPassword;

      await updateProfile(payload);
      showToast('Admin Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // View Student Linked Data
  const handleViewStudentDetail = async (std: User) => {
    const studentApps = applications.filter((a) => a.userId === std._id || a.studentEmail === std.email);
    const studentEnqs = enquiries.filter((e) => e.email === std.email || e.phone === std.phone);
    setSelectedStudentDetail({
      student: std,
      applications: studentApps,
      enquiries: studentEnqs
    });
  };

  // Filtered Lists
  const filteredEnquiries = enquiries.filter((e) => {
    if (!e) return false;
    const term = (searchTerm || '').toLowerCase();
    const matchSearch =
      (e.name || '').toLowerCase().includes(term) ||
      (e.email || '').toLowerCase().includes(term) ||
      (e.phone || '').includes(searchTerm) ||
      (e.collegeName || e.college || '').toLowerCase().includes(term) ||
      (e.programName || e.program || '').toLowerCase().includes(term);
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredApplications = applications.filter((a) => {
    if (!a) return false;
    const term = (searchTerm || '').toLowerCase();
    const matchSearch =
      (a.studentName || '').toLowerCase().includes(term) ||
      (a.studentEmail || '').toLowerCase().includes(term) ||
      (a.studentPhone || '').includes(searchTerm) ||
      (a.collegeName || '').toLowerCase().includes(term) ||
      (a.programName || '').toLowerCase().includes(term);
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredStudents = students.filter(
    (s) =>
      s &&
      ((s.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (s.email || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (s.phone || '').includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-16">
      {/* Toast Banner */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center space-x-2 animate-bounce">
          <Icons.CheckCircle2 className="w-5 h-5 text-white" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-[#333333] text-white py-8 px-4 sm:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#FA394A] text-white px-2.5 py-0.5 rounded-md font-black text-[10px] uppercase tracking-wider">
                Full CMS Control Panel
              </span>
              <span className="text-gray-400 text-xs">MongoDB Atlas Connected</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
              Online Degree & Diploma CMS Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNotificationModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 border border-white/20"
            >
              <Icons.Bell className="w-4 h-4 text-amber-400" />
              <span>Broadcast Alert</span>
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-colors flex items-center space-x-1.5"
            >
              <Icons.LogOut className="w-4 h-4" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR NAVIGATION TABS */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-sm space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-1">
                Overview & Analytics
              </p>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'stats'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icons.BarChart3 className="w-4 h-4" />
                <span>Dashboard Stats</span>
              </button>

              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-1 pt-2">
                Leads & Admissions
              </p>
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'enquiries'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.Users className="w-4 h-4" />
                  <span>Student Enquiries</span>
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px]">
                  {enquiries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'applications'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.GraduationCap className="w-4 h-4" />
                  <span>Admission Applications</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">
                  {applications.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'students'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.UserCheck className="w-4 h-4" />
                  <span>Student Accounts</span>
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px]">
                  {students.length}
                </span>
              </button>

              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-1 pt-2">
                Dynamic CMS Control
              </p>
              <button
                onClick={() => setActiveTab('colleges')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'colleges'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.Building2 className="w-4 h-4" />
                  <span>Universities</span>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                  {colleges.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('programs')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'programs'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.BookOpen className="w-4 h-4" />
                  <span>Programs & Fees</span>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                  {programs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('sliders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'sliders'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.Image className="w-4 h-4" />
                  <span>Homepage Sliders</span>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                  {sliders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'testimonials'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.Star className="w-4 h-4" />
                  <span>Student Reviews</span>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                  {testimonials.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'faqs'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.HelpCircle className="w-4 h-4" />
                  <span>FAQs Manager</span>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                  {faqs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'documents'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.FileText className="w-4 h-4" />
                  <span>Brochures & PDFs</span>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                  {documents.length}
                </span>
              </button>

              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-1 pt-2">
                Settings & Contacts
              </p>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icons.PhoneCall className="w-4 h-4" />
                <span>Website Contact & Info</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'contacts'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icons.Mail className="w-4 h-4" />
                  <span>Contact Inbox</span>
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                  {contacts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#FA394A] text-white shadow-md shadow-[#FA394A]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icons.Lock className="w-4 h-4" />
                <span>Admin Password</span>
              </button>
            </div>
          </div>

          {/* MAIN DISPLAY CONTENT AREA */}
          <div className="lg:col-span-9">
            {/* 1. DASHBOARD STATS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Icons.Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Total Enquiries</p>
                      <h3 className="text-2xl font-black text-[#333333]">{stats?.totalEnquiries || enquiries.length}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Icons.GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Applications</p>
                      <h3 className="text-2xl font-black text-[#333333]">{stats?.totalApplications || applications.length}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icons.Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Universities</p>
                      <h3 className="text-2xl font-black text-[#333333]">{stats?.totalColleges || colleges.length}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Icons.BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Degree Programs</p>
                      <h3 className="text-2xl font-black text-[#333333]">{stats?.totalPrograms || programs.length}</h3>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-[#333333]">Quick CMS Content Manager</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => {
                        setEditingCollege(null);
                        setShowCollegeModal(true);
                      }}
                      className="p-3 bg-gray-50 hover:bg-[#FFE8EA] border rounded-2xl text-left transition-colors"
                    >
                      <Icons.Plus className="w-4 h-4 text-[#FA394A] mb-1" />
                      <span className="block text-xs font-bold text-[#333333]">Add University</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingProgram(null);
                        setShowProgramModal(true);
                      }}
                      className="p-3 bg-gray-50 hover:bg-[#FFE8EA] border rounded-2xl text-left transition-colors"
                    >
                      <Icons.Plus className="w-4 h-4 text-[#FA394A] mb-1" />
                      <span className="block text-xs font-bold text-[#333333]">Add Program</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingSlider(null);
                        setShowSliderModal(true);
                      }}
                      className="p-3 bg-gray-50 hover:bg-[#FFE8EA] border rounded-2xl text-left transition-colors"
                    >
                      <Icons.Plus className="w-4 h-4 text-[#FA394A] mb-1" />
                      <span className="block text-xs font-bold text-[#333333]">Add Hero Banner</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingTestimonial(null);
                        setShowTestimonialModal(true);
                      }}
                      className="p-3 bg-gray-50 hover:bg-[#FFE8EA] border rounded-2xl text-left transition-colors"
                    >
                      <Icons.Plus className="w-4 h-4 text-[#FA394A] mb-1" />
                      <span className="block text-xs font-bold text-[#333333]">Add Review</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ENQUIRIES / LEADS TAB */}
            {activeTab === 'enquiries' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Student Counselling Enquiries</h2>
                    <p className="text-xs text-gray-500">Track and update lead status for interested students</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search name, phone, course..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border text-xs outline-none"
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border text-xs outline-none bg-white font-medium"
                    >
                      <option value="">All Status</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-extrabold uppercase">
                        <th className="py-3 px-3">Student Name</th>
                        <th className="py-3 px-3">Contact Email & Phone</th>
                        <th className="py-3 px-3">Course / University</th>
                        <th className="py-3 px-3">Lead Status</th>
                        <th className="py-3 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredEnquiries.map((enq) => (
                        <tr key={enq._id} className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-bold text-[#333333]">{enq.name}</td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-gray-800">{enq.email}</p>
                            <p className="text-[11px] text-[#FA394A] font-bold">{enq.phone}</p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-[#333333]">{enq.programName || enq.program || 'General'}</p>
                            <p className="text-[10px] text-gray-500">{enq.collegeName || enq.college || 'Platform'}</p>
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                              className="px-2 py-1 rounded-lg border text-[11px] font-bold outline-none bg-white"
                            >
                              <option value="New">New Lead</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Interested">Interested</option>
                              <option value="Follow Up">Follow Up</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-gray-500">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. ADMISSION APPLICATIONS TAB */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Submitted Admission Applications</h2>
                    <p className="text-xs text-gray-500">Review student documents and update review status</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Search applicant name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border text-xs font-medium outline-none"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-extrabold uppercase">
                        <th className="py-3 px-3">App ID</th>
                        <th className="py-3 px-3">Student Name</th>
                        <th className="py-3 px-3">Contact Phone & Email</th>
                        <th className="py-3 px-3">Program & University</th>
                        <th className="py-3 px-3">Review Status</th>
                        <th className="py-3 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredApplications.map((app) => (
                        <tr key={app._id} className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-mono font-bold text-gray-500">#{app._id ? String(app._id).substring(0, 6) : 'N/A'}</td>
                          <td className="py-3 px-3 font-bold text-[#333333]">{app.studentName}</td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-[#FA394A]">{app.studentPhone || 'N/A'}</p>
                            <p className="text-[11px] text-gray-600">{app.studentEmail || 'N/A'}</p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-black text-[#333333]">{app.programName}</p>
                            <p className="text-[10px] text-gray-500">{app.collegeName}</p>
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                              className="px-2 py-1 rounded-lg border text-[11px] font-bold outline-none bg-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Review">In Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => {
                                const remarks = prompt('Enter Admin Review Remarks:', app.adminRemarks || '');
                                if (remarks !== null) {
                                  handleUpdateAppStatus(app._id, app.status, remarks);
                                }
                              }}
                              className="text-xs text-blue-600 hover:underline font-bold"
                            >
                              Add Remark
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. UNIVERSITIES TAB */}
            {activeTab === 'colleges' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Manage Universities</h2>
                    <p className="text-xs text-gray-500">Add, edit logos, banners, brochure PDFs, video URLs, and apply URLs</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCollege(null);
                      setCollegeFormData({
                        name: '',
                        code: '',
                        slug: '',
                        location: '',
                        state: '',
                        description: '',
                        overview: '',
                        approvals: 'UGC, DEB, AICTE, NAAC A+',
                        website: '',
                        applyUrl: '',
                        videoUrl: '',
                        brochureUrl: '',
                        logo: '',
                        banner: '',
                        establishedYear: '2005',
                        rating: '4.8',
                        naacGrade: 'A+',
                        feesRange: '₹ 30,000 - ₹ 1,50,000',
                        placementPercentage: '85%',
                        averagePackage: '₹ 4.5 LPA',
                        highestPackage: '₹ 18.0 LPA',
                        isActive: true
                      });
                      setShowCollegeModal(true);
                    }}
                    className="bg-[#FA394A] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-[#FA394A]/20"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Add University</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {colleges.map((col) => (
                    <div key={col._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <img
                          src={col.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150'}
                          alt={col.name}
                          className="w-12 h-12 rounded-xl object-contain bg-white p-1 border"
                        />
                        <div>
                          <h3 className="text-xs font-black text-[#333333]">{col.name}</h3>
                          <p className="text-[10px] text-gray-500">{col.location || col.state || 'Online'}</p>
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            {col.approvals?.[0] || 'UGC Entitled'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a href={`/colleges/${col.slug || col._id}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-600 hover:text-[#FA394A]">
                          <Icons.Eye className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleEditCollege(col)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Icons.Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCollege(col._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PROGRAMS TAB */}
            {activeTab === 'programs' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Manage Programs</h2>
                    <p className="text-xs text-gray-500">Configure online degree courses, fee structures, eligibility, and brochure PDFs</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProgram(null);
                      setProgramFormData({
                        title: '',
                        slug: '',
                        collegeId: colleges[0]?._id || '',
                        collegeName: colleges[0]?.name || '',
                        degreeType: 'UG',
                        duration: '3 Years (6 Semesters)',
                        fee: '₹45,000 / Year',
                        eligibility: '10+2 from recognized board',
                        specializations: 'Finance, Marketing, HR, IT',
                        overview: 'Comprehensive online degree program designed for flexible distance learning.',
                        image: '',
                        applyUrl: '',
                        brochurePdfUrl: '',
                        syllabusPdfUrl: '',
                        isActive: true
                      });
                      setShowProgramModal(true);
                    }}
                    className="bg-[#FA394A] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-[#FA394A]/20"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Add Program</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {programs.map((prog) => (
                    <div key={prog._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#FA394A] uppercase">{prog.degreeType || 'Degree'}</span>
                        <h3 className="text-xs font-black text-[#333333]">{prog.title}</h3>
                        <p className="text-[10px] text-gray-500">{prog.collegeName} • {prog.duration} • {prog.fee || prog.fees}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a href={`/programs/${prog.slug || prog._id}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-600 hover:text-[#FA394A]">
                          <Icons.Eye className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleEditProgram(prog)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Icons.Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProgram(prog._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. HOMEPAGE SLIDERS TAB */}
            {activeTab === 'sliders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Manage Homepage Sliders</h2>
                    <p className="text-xs text-gray-500">Add or edit hero banners, titles, background images, and action buttons</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSlider(null);
                      setSliderFormData({
                        title: 'Admissions Open 2026-27',
                        subtitle: 'UGC-Approved Online Degrees & Diplomas',
                        badge: 'SPRING BATCH 2026',
                        bgImage: '',
                        mobileBgImage: '',
                        primaryBtnText: 'Explore Programs',
                        primaryBtnLink: '/programs',
                        secondaryBtnText: 'Apply Online',
                        secondaryBtnLink: '/apply',
                        order: sliders.length + 1,
                        isActive: true
                      });
                      setShowSliderModal(true);
                    }}
                    className="bg-[#FA394A] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-[#FA394A]/20"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Add Hero Banner</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {sliders.map((sld) => (
                    <div key={sld._id} className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 text-white p-6 flex flex-col justify-between min-h-[160px]">
                      <img src={sld.bgImage} alt={sld.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                      <div className="relative z-10 flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#FA394A] text-white uppercase">
                            {sld.badge || 'Banner'}
                          </span>
                          <h3 className="text-lg font-black text-white mt-1">{sld.title}</h3>
                          <p className="text-xs text-gray-200 max-w-lg">{sld.subtitle}</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-black/60 p-1.5 rounded-xl backdrop-blur-md">
                          <button onClick={() => {
                            setEditingSlider(sld);
                            setSliderFormData({
                              title: sld.title,
                              subtitle: sld.subtitle,
                              badge: sld.badge || '',
                              bgImage: sld.bgImage,
                              mobileBgImage: sld.mobileBgImage || sld.bgImage,
                              primaryBtnText: sld.primaryBtnText,
                              primaryBtnLink: sld.primaryBtnLink,
                              secondaryBtnText: sld.secondaryBtnText || '',
                              secondaryBtnLink: sld.secondaryBtnLink || '',
                              order: sld.order || 1,
                              isActive: sld.isActive
                            });
                            setShowSliderModal(true);
                          }} className="p-1.5 text-blue-400 hover:text-blue-200">
                            <Icons.Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteSlider(sld._id)} className="p-1.5 text-red-400 hover:text-red-200">
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Manage Student Testimonials</h2>
                    <p className="text-xs text-gray-500">Control student photos, course details, ratings, and quotes</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTestimonial(null);
                      setTestimonialFormData({
                        name: '',
                        course: 'MBA Online',
                        college: 'LPU Online',
                        quote: '',
                        rating: 5,
                        image: '',
                        isActive: true
                      });
                      setShowTestimonialModal(true);
                    }}
                    className="bg-[#FA394A] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-[#FA394A]/20"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Add Student Review</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {testimonials.map((tst) => (
                    <div key={tst._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <img src={tst.image} alt={tst.name} className="w-10 h-10 rounded-full object-cover border" />
                          <div>
                            <h3 className="text-xs font-black text-[#333333]">{tst.name}</h3>
                            <p className="text-[10px] text-gray-500">{tst.course} • {tst.college}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => {
                            setEditingTestimonial(tst);
                            setTestimonialFormData({
                              name: tst.name,
                              course: tst.course,
                              college: tst.college,
                              quote: tst.quote,
                              rating: tst.rating,
                              image: tst.image,
                              isActive: tst.isActive
                            });
                            setShowTestimonialModal(true);
                          }} className="p-1 text-blue-600">
                            <Icons.Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteTestimonial(tst._id)} className="p-1 text-red-600">
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 italic">"{tst.quote}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. FAQS MANAGER TAB */}
            {activeTab === 'faqs' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Manage Frequently Asked Questions</h2>
                    <p className="text-xs text-gray-500">Add or edit questions, answers, and display ordering</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingFaq(null);
                      setFaqFormData({
                        question: '',
                        answer: '',
                        category: 'General',
                        order: faqs.length + 1,
                        isActive: true
                      });
                      setShowFaqModal(true);
                    }}
                    className="bg-[#FA394A] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-[#FA394A]/20"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div key={faq._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-black text-[#333333]">Q: {faq.question}</h3>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => {
                            setEditingFaq(faq);
                            setFaqFormData({
                              question: faq.question,
                              answer: faq.answer,
                              category: faq.category || 'General',
                              order: faq.order || 1,
                              isActive: faq.isActive
                            });
                            setShowFaqModal(true);
                          }} className="p-1 text-blue-600">
                            <Icons.Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteFaq(faq._id)} className="p-1 text-red-600">
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. BROCHURES & DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-[#333333]">Manage Brochures & Syllabus PDFs</h2>
                    <p className="text-xs text-gray-500">Upload official PDF downloads for universities and programs</p>
                  </div>
                  <button
                    onClick={() => {
                      setDocFormData({ title: '', type: 'brochure', collegeName: '', programName: '', fileUrl: '' });
                      setShowDocModal(true);
                    }}
                    className="bg-[#FA394A] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-[#FA394A]/20"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Upload Brochure PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div key={doc._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold text-[#FA394A] uppercase">{doc.type || 'PDF'}</span>
                        <h3 className="text-xs font-black text-[#333333]">{doc.title}</h3>
                        <p className="text-[10px] text-gray-500">{doc.collegeName || 'All Universities'} • {doc.fileSize || '1.2 MB'}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                          <Icons.Download className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleDeleteDocument(doc._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. WEBSITE CONTACT SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-black text-[#333333]">Website Settings & Contact Configuration</h2>
                  <p className="text-xs text-gray-500">Update phone numbers, emails, office address, map embed, announcement banner, and social media handles</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-bold">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Primary Helpline Phone *</label>
                      <input
                        type="text"
                        required
                        value={siteSettings.phonePrimary}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phonePrimary: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Support / Toll-Free Phone</label>
                      <input
                        type="text"
                        value={siteSettings.phoneSecondary}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phoneSecondary: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">WhatsApp Helpline Number</label>
                      <input
                        type="text"
                        value={siteSettings.whatsappNumber}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Primary Admissions Email *</label>
                      <input
                        type="email"
                        required
                        value={siteSettings.emailPrimary}
                        onChange={(e) => setSiteSettings({ ...siteSettings, emailPrimary: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Corporate Office Address</label>
                    <textarea
                      rows={2}
                      value={siteSettings.address}
                      onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Google Maps Embed URL</label>
                    <input
                      type="text"
                      value={siteSettings.googleMapUrl}
                      onChange={(e) => setSiteSettings({ ...siteSettings, googleMapUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>

                  <hr className="my-4 border-gray-200" />
                  <p className="text-xs font-black text-[#333333]">Social Media Handles & Site Branding</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Facebook URL</label>
                      <input
                        type="text"
                        value={siteSettings.facebookUrl}
                        onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={siteSettings.instagramUrl}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={siteSettings.linkedinUrl}
                        onChange={(e) => setSiteSettings({ ...siteSettings, linkedinUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">YouTube URL</label>
                      <input
                        type="text"
                        value={siteSettings.youtubeUrl}
                        onChange={(e) => setSiteSettings({ ...siteSettings, youtubeUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Top Header Announcement Banner Text</label>
                    <input
                      type="text"
                      value={siteSettings.headerAnnouncement}
                      onChange={(e) => setSiteSettings({ ...siteSettings, headerAnnouncement: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#FA394A]/20"
                  >
                    Save All Website Settings
                  </button>
                </form>
              </div>
            )}

            {/* 11. CONTACT MESSAGES INBOX TAB */}
            {activeTab === 'contacts' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-black text-[#333333]">Contact Us Submissions Inbox</h2>
                  <p className="text-xs text-gray-500">Messages sent by visitors via the Contact Us page</p>
                </div>

                <div className="space-y-3">
                  {contacts.map((c) => (
                    <div key={c._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xs font-black text-[#333333]">{c.name}</h3>
                          <p className="text-[11px] text-[#FA394A] font-bold">{c.email} • {c.phone}</p>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-800">Subject: {c.subject || 'General Query'}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. ADMIN PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-black text-[#333333]">Admin Account Security</h2>
                  <p className="text-xs text-gray-500">Update your name, contact phone, and admin security password</p>
                </div>

                <form onSubmit={handleSaveAdminProfile} className="space-y-4 text-xs font-bold">
                  <div>
                    <label className="block text-gray-700 mb-1">Admin Name</label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Admin Phone</label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>

                  <hr className="my-4 border-gray-200" />

                  <div>
                    <label className="block text-gray-700 mb-1">New Password (Optional)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#FA394A]/20"
                  >
                    {savingProfile ? 'Updating...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. College Modal */}
      {showCollegeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-[#333333]">
                {editingCollege ? 'Edit Partner University' : 'Add New Partner University'}
              </h3>
              <button onClick={() => setShowCollegeModal(false)}>
                <Icons.X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveCollege} className="space-y-3 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">University Name *</label>
                  <input
                    type="text"
                    required
                    value={collegeFormData.name}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Custom Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="lpu-online"
                    value={collegeFormData.slug}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Location / City</label>
                  <input
                    type="text"
                    value={collegeFormData.location}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">State</label>
                  <input
                    type="text"
                    value={collegeFormData.state}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, state: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
              </div>

              {/* Logo Upload File + URL */}
              <div>
                <label className="block mb-1">University Logo Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://... or upload file"
                    value={collegeFormData.logo}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, logo: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setCollegeFormData((prev) => ({ ...prev, logo: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Banner Upload File + URL */}
              <div>
                <label className="block mb-1">University Banner Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://... or upload file"
                    value={collegeFormData.banner}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, banner: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse Banner'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setCollegeFormData((prev) => ({ ...prev, banner: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Brochure Upload File + URL */}
              <div>
                <label className="block mb-1">Brochure PDF Document</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://.../brochure.pdf"
                    value={collegeFormData.brochureUrl}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, brochureUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse PDF'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setCollegeFormData((prev) => ({ ...prev, brochureUrl: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Website URL</label>
                  <input
                    type="text"
                    placeholder="https://www.university.edu"
                    value={collegeFormData.website}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, website: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Direct Apply Link</label>
                  <input
                    type="text"
                    placeholder="https://apply.university.edu"
                    value={collegeFormData.applyUrl}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, applyUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">YouTube Video URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={collegeFormData.videoUrl}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, videoUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Approvals (Comma-separated)</label>
                <input
                  type="text"
                  value={collegeFormData.approvals}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, approvals: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">University Description & Overview</label>
                <textarea
                  rows={3}
                  value={collegeFormData.overview}
                  onChange={(e) =>
                    setCollegeFormData({
                      ...collegeFormData,
                      overview: e.target.value,
                      description: e.target.value
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <button type="submit" className="w-full bg-[#FA394A] text-white py-3 rounded-xl font-extrabold mt-2 shadow-md">
                Save University Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Program Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-[#333333]">
                {editingProgram ? 'Edit Degree Program' : 'Add New Degree Program'}
              </h3>
              <button onClick={() => setShowProgramModal(false)}>
                <Icons.X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveProgram} className="space-y-3 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Program Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master of Business Administration (MBA)"
                    value={programFormData.title}
                    onChange={(e) => setProgramFormData({ ...programFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Link University *</label>
                  <select
                    required
                    value={programFormData.collegeId}
                    onChange={(e) => {
                      const selectedCol = colleges.find((c) => c._id === e.target.value);
                      setProgramFormData({
                        ...programFormData,
                        collegeId: e.target.value,
                        collegeName: selectedCol?.name || ''
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none bg-white"
                  >
                    <option value="">-- Select University --</option>
                    {colleges.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Degree Level</label>
                  <select
                    value={programFormData.degreeType}
                    onChange={(e) => setProgramFormData({ ...programFormData, degreeType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none bg-white"
                  >
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="Diploma">Diploma / Cert</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Years"
                    value={programFormData.duration}
                    onChange={(e) => setProgramFormData({ ...programFormData, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Annual Fee *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹ 45,000 / Year"
                    value={programFormData.fee}
                    onChange={(e) => setProgramFormData({ ...programFormData, fee: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. Graduation in any stream with 50% marks"
                  value={programFormData.eligibility}
                  onChange={(e) => setProgramFormData({ ...programFormData, eligibility: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Specializations (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Finance, Marketing, HR, Business Analytics"
                  value={programFormData.specializations}
                  onChange={(e) => setProgramFormData({ ...programFormData, specializations: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              {/* Program Image Upload */}
              <div>
                <label className="block mb-1">Program Cover Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://... or upload image"
                    value={programFormData.image}
                    onChange={(e) => setProgramFormData({ ...programFormData, image: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setProgramFormData((prev) => ({ ...prev, image: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Program Brochure PDF Upload */}
              <div>
                <label className="block mb-1">Brochure PDF Document</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://.../brochure.pdf"
                    value={programFormData.brochurePdfUrl}
                    onChange={(e) => setProgramFormData({ ...programFormData, brochurePdfUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse Brochure'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setProgramFormData((prev) => ({ ...prev, brochurePdfUrl: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Program Syllabus PDF Upload */}
              <div>
                <label className="block mb-1">Syllabus PDF Document</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://.../syllabus.pdf"
                    value={programFormData.syllabusPdfUrl}
                    onChange={(e) => setProgramFormData({ ...programFormData, syllabusPdfUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse Syllabus'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setProgramFormData((prev) => ({ ...prev, syllabusPdfUrl: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-1">Direct Apply Link</label>
                <input
                  type="text"
                  placeholder="https://.../apply"
                  value={programFormData.applyUrl}
                  onChange={(e) => setProgramFormData({ ...programFormData, applyUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Overview & Description</label>
                <textarea
                  rows={3}
                  value={programFormData.overview}
                  onChange={(e) => setProgramFormData({ ...programFormData, overview: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <button type="submit" className="w-full bg-[#FA394A] text-white py-3 rounded-xl font-extrabold mt-2 shadow-md">
                Save Program Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Document Modal */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-[#333333]">Upload Brochure / PDF Document</h3>
              <button onClick={() => setShowDocModal(false)}>
                <Icons.X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveDocument} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LPU Online MBA Official Syllabus 2026"
                  value={docFormData.title}
                  onChange={(e) => setDocFormData({ ...docFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Document Type</label>
                <select
                  value={docFormData.type}
                  onChange={(e) => setDocFormData({ ...docFormData, type: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none bg-white"
                >
                  <option value="brochure">University Brochure</option>
                  <option value="syllabus">Program Syllabus</option>
                  <option value="fee_structure">Fee Structure Chart</option>
                  <option value="course_pdf">Course Guide</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">PDF File Document</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://.../brochure.pdf"
                    value={docFormData.fileUrl}
                    onChange={(e) => setDocFormData({ ...docFormData, fileUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse PDF'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setDocFormData((prev) => ({ ...prev, fileUrl: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#FA394A] text-white py-2.5 rounded-xl font-extrabold mt-2 shadow-md">
                Save Document
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-[#333333]">Frequently Asked Question</h3>
              <button onClick={() => setShowFaqModal(false)}>
                <Icons.X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqFormData.question}
                  onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Answer *</label>
                <textarea
                  required
                  rows={3}
                  value={faqFormData.answer}
                  onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-[#FA394A] text-white py-2.5 rounded-xl font-extrabold mt-2 shadow-md">
                Save FAQ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Testimonial Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-[#333333]">Student Review</h3>
              <button onClick={() => setShowTestimonialModal(false)}>
                <Icons.X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={testimonialFormData.name}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Course</label>
                  <input
                    type="text"
                    value={testimonialFormData.course}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, course: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">University</label>
                  <input
                    type="text"
                    value={testimonialFormData.college}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, college: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Student Photo</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://... or upload photo"
                    value={testimonialFormData.image}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, image: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setTestimonialFormData((prev) => ({ ...prev, image: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-1">Review Quote *</label>
                <textarea
                  required
                  rows={3}
                  value={testimonialFormData.quote}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, quote: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <button type="submit" className="w-full bg-[#FA394A] text-white py-2.5 rounded-xl font-extrabold mt-2 shadow-md">
                Save Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Hero Slider Modal */}
      {showSliderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-[#333333]">Hero Banner Details</h3>
              <button onClick={() => setShowSliderModal(false)}>
                <Icons.X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveSlider} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1">Slide Title *</label>
                <input
                  type="text"
                  required
                  value={sliderFormData.title}
                  onChange={(e) => setSliderFormData({ ...sliderFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Subtitle *</label>
                <input
                  type="text"
                  required
                  value={sliderFormData.subtitle}
                  onChange={(e) => setSliderFormData({ ...sliderFormData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Desktop Background Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://... or upload image"
                    value={sliderFormData.bgImage}
                    onChange={(e) => setSliderFormData({ ...sliderFormData, bgImage: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border text-gray-700 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
                    <span>{uploadingFile ? 'Uploading...' : 'Browse Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) setSliderFormData((prev) => ({ ...prev, bgImage: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Button 1 Text</label>
                  <input
                    type="text"
                    value={sliderFormData.primaryBtnText}
                    onChange={(e) => setSliderFormData({ ...sliderFormData, primaryBtnText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Button 1 Link</label>
                  <input
                    type="text"
                    value={sliderFormData.primaryBtnLink}
                    onChange={(e) => setSliderFormData({ ...sliderFormData, primaryBtnLink: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#FA394A] text-white py-2.5 rounded-xl font-extrabold mt-2 shadow-md">
                Save Hero Banner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-[#333333]">Broadcast Student Notification</h3>
              <button onClick={() => setShowNotificationModal(false)}>
                <Icons.X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSendNotification} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scholarship Deadline Reminder"
                  value={notificationFormData.title}
                  onChange={(e) => setNotificationFormData({ ...notificationFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Message Content *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Last date for Spring 2026 fee submission is approaching."
                  value={notificationFormData.message}
                  onChange={(e) => setNotificationFormData({ ...notificationFormData, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-[#FA394A] text-white py-2.5 rounded-xl font-extrabold mt-2 shadow-md">
                Broadcast Notification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-[#333333]">Student Profile: {selectedStudentDetail.student.name}</h3>
              <button onClick={() => setSelectedStudentDetail(null)}>
                <Icons.X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-2xl border space-y-1">
                <p><strong>Email:</strong> {selectedStudentDetail.student.email}</p>
                <p><strong>Phone:</strong> {selectedStudentDetail.student.phone || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedStudentDetail.student.status || 'Active'}</p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#FA394A] mb-1">Linked Applications ({selectedStudentDetail.applications.length})</h4>
                {selectedStudentDetail.applications.map((app) => (
                  <div key={app._id} className="p-2.5 border rounded-xl bg-gray-50 mb-1">
                    <p className="font-bold">{app.programName} ({app.collegeName})</p>
                    <p className="text-[10px] text-gray-500">Status: {app.status}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-extrabold text-[#FA394A] mb-1">Linked Lead Enquiries ({selectedStudentDetail.enquiries.length})</h4>
                {selectedStudentDetail.enquiries.map((enq) => (
                  <div key={enq._id} className="p-2.5 border rounded-xl bg-gray-50 mb-1">
                    <p className="font-bold">{enq.programName || enq.program} ({enq.collegeName || enq.college})</p>
                    <p className="text-[10px] text-gray-500">Status: {enq.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
