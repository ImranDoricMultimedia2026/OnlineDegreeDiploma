import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { seedInitialDataToMongo } from '../../../backend/services/mongoService';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DbSchema {
  users: any[];
  colleges: any[];
  programs: any[];
  enquiries: any[];
  applications: any[];
  documents: any[];
  contacts: any[];
  subscribers: any[];
  faqs: any[];
  testimonials: any[];
  sliders: any[];
  notifications: any[];
  settings?: any;
}

let dbData: DbSchema = {
  users: [],
  colleges: [],
  programs: [],
  enquiries: [],
  applications: [],
  documents: [],
  contacts: [],
  subscribers: [],
  faqs: [],
  testimonials: [],
  sliders: [],
  notifications: [],
  settings: null
};

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export const defaultProgramsList = [
  // --- POSTGRADUATE (PG) COURSES ---
  {
    _id: 'prog_pg_mba',
    title: 'MBA',
    name: 'Master of Business Administration',
    slug: 'mba',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹40,400 /sem',
    eligibility: 'Graduation in any discipline with 50% marks',
    specializations: ['12 Specializations', 'Marketing', 'Finance', 'HR', 'Business Analytics'],
    overview: 'Develop leadership and management skills with 12 specializations.',
    semesterInfo: 'Covers Corporate Strategy, Managerial Economics, Financial Management, AI in Business, and Industry Capstone.',
    careerScope: ['Brand Manager', 'Financial Advisor', 'Management Consultant', 'HR Director'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mca',
    title: 'MCA',
    name: 'Master of Computer Applications',
    slug: 'mca',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹32,400 /sem',
    eligibility: 'Graduation with Mathematics/Statistics',
    specializations: ['5 Specializations', 'AI', 'Cloud', 'Cybersecurity', 'Full Stack'],
    overview: 'Advanced computing with specializations in AI, Cloud, Cybersecurity.',
    semesterInfo: 'Advanced Programming, Cloud Computing, Cyber Security, Web Architecture, Data Science, Capstone.',
    careerScope: ['Senior Software Architect', 'Cloud Lead', 'Cyber Security Specialist', 'Tech Lead'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mcom',
    title: 'M.Com',
    name: 'Master of Commerce',
    slug: 'mcom',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹20,400 /sem',
    eligibility: 'B.Com or equivalent with 50% marks',
    specializations: ['1 Specialization', 'Accounting & Finance'],
    overview: 'Advanced commerce education covering Accounting and Finance.',
    semesterInfo: 'Advanced Financial Accounting, Corporate Taxation, Managerial Economics, Financial Markets.',
    careerScope: ['Financial Controller', 'Auditor', 'Taxation Consultant', 'Investment Executive'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mscit',
    title: 'M.Sc. IT',
    name: 'M.Sc. Information Technology',
    slug: 'msc-it',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹16,500 /sem',
    eligibility: 'Graduation with relevant subject',
    specializations: ['1 Specialization', 'Information Technology'],
    overview: 'Advanced IT program with industry-relevant curriculum.',
    semesterInfo: 'Enterprise Software, Advanced DBMS, Network Security, Web Engineering, Capstone.',
    careerScope: ['IT Consultant', 'Systems Analyst', 'Database Administrator', 'Network Engineer'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_maeng',
    title: 'MA English',
    name: 'M.A. English',
    slug: 'ma-english',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation in any discipline',
    specializations: ['1 Specialization', 'English Literature'],
    overview: 'Advanced English literature and language studies.',
    semesterInfo: 'British Literature, Postcolonial Studies, Literary Theory, Critical Criticism, Linguistics.',
    careerScope: ['Content Writer', 'Editor', 'Academician', 'PR Executive'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mahist',
    title: 'MA History',
    name: 'M.A. History',
    slug: 'ma-history',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation in any discipline',
    specializations: ['1 Specialization', 'History'],
    overview: 'In-depth study of Indian and world history.',
    semesterInfo: 'Ancient Indian History, Medieval India, Modern World Civilizations, Historiography.',
    careerScope: ['Archivist', 'Historian', 'Civil Services Specialist', 'Researcher'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mahin',
    title: 'MA Hindi',
    name: 'M.A. Hindi',
    slug: 'ma-hindi',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation in any discipline',
    specializations: ['1 Specialization', 'Hindi Literature'],
    overview: 'Advanced Hindi language and literature.',
    semesterInfo: 'Hindi Kavya, Prose & Drama, Bhasha Vigyan, Modern Literature Criticism.',
    careerScope: ['Hindi Officer', 'Translator', 'Educator', 'Journalist'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mapun',
    title: 'MA Punjabi',
    name: 'M.A. Punjabi',
    slug: 'ma-punjabi',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation in any discipline',
    specializations: ['1 Specialization', 'Punjabi Literature'],
    overview: 'Punjabi language and literary studies.',
    semesterInfo: 'Punjabi Poetry, Sufi Literature, Modern Fiction, Cultural Studies.',
    careerScope: ['Language Specialist', 'Media Writer', 'Educator', 'Translator'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mapol',
    title: 'MA Pol. Sci.',
    name: 'M.A. Political Science',
    slug: 'ma-political-science',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation in any discipline',
    specializations: ['1 Specialization', 'Political Science'],
    overview: 'Political theory, governance, and international relations.',
    semesterInfo: 'Political Thought, International Relations, Public Administration, Constitutional Law.',
    careerScope: ['Policy Analyst', 'Political Advisor', 'Civil Services Candidate', 'PR Specialist'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mamath',
    title: 'MA Maths',
    name: 'M.A. Mathematics',
    slug: 'ma-mathematics',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation with Mathematics',
    specializations: ['1 Specialization', 'Mathematics'],
    overview: 'Advanced mathematical concepts and applications.',
    semesterInfo: 'Real Analysis, Abstract Algebra, Complex Analysis, Topology, Differential Equations.',
    careerScope: ['Data Analyst', 'Math Educator', 'Statistical Associate', 'Research Scientist'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_masoc',
    title: 'MA Sociology',
    name: 'M.A. Sociology',
    slug: 'ma-sociology',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation in any discipline',
    specializations: ['1 Specialization', 'Sociology'],
    overview: 'Study of society, social behavior and institutions.',
    semesterInfo: 'Sociological Theories, Research Methodology, Indian Social Structure, Development Studies.',
    careerScope: ['Social Worker', 'NGO Consultant', 'Policy Associate', 'Researcher'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_maedu',
    title: 'MA Education',
    name: 'M.A. Education',
    slug: 'ma-education',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation in any discipline',
    specializations: ['1 Specialization', 'Education'],
    overview: 'Educational theory, pedagogy and curriculum development.',
    semesterInfo: 'Pedagogy, Educational Psychology, Curriculum Planning, Educational Technology.',
    careerScope: ['Curriculum Specialist', 'Educational Administrator', 'Academic Counselor'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_maeco',
    title: 'MA Economics',
    name: 'M.A. Economics',
    slug: 'ma-economics',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '2 Years',
    fee: '₹8,000 /sem',
    eligibility: 'Graduation in any discipline',
    specializations: ['1 Specialization', 'Economics'],
    overview: 'Advanced study of economic theory and policy.',
    semesterInfo: 'Microeconomics, Macroeconomics, Econometrics, Public Finance, Development Economics.',
    careerScope: ['Economist', 'Financial Analyst', 'Policy Researcher', 'Risk Consultant'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_pg_mlis',
    title: 'MLIS',
    name: 'Master of Library & Information Science',
    slug: 'mlis',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'PG',
    duration: '1 Year',
    fee: '₹7,500 /sem',
    eligibility: 'BLIS or equivalent',
    specializations: ['1 Specialization', 'Library Science'],
    overview: 'Advanced library science and information management.',
    semesterInfo: 'Digital Library Architecture, Information Retrieval, Knowledge Management Systems.',
    careerScope: ['Chief Librarian', 'Knowledge Officer', 'Information Specialist'],
    isActive: true,
    createdAt: new Date().toISOString()
  },

  // --- UNDERGRADUATE (UG) COURSES ---
  {
    _id: 'prog_ug_bba',
    title: 'BBA',
    name: 'Bachelor of Business Administration',
    slug: 'bba',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'UG',
    duration: '3 Years',
    fee: '₹20,400 /sem',
    eligibility: '10+2 in any stream with 50% marks',
    specializations: ['1 Specialization', 'Business Management'],
    overview: 'Foundation in business management and leadership skills.',
    semesterInfo: 'Management Principles, Accounting, Marketing, HR, Business Law, Operations.',
    careerScope: ['Management Executive', 'Marketing Assistant', 'Business Development Officer'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_ug_bca',
    title: 'BCA',
    name: 'Bachelor of Computer Applications',
    slug: 'bca',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'UG',
    duration: '3 Years',
    fee: '₹20,400 /sem',
    eligibility: '10+2 with Mathematics',
    specializations: ['1 Specialization', 'Computer Applications'],
    overview: 'Comprehensive IT program with practical skills.',
    semesterInfo: 'C Programming, Java, Data Structures, DBMS, Web Development, Software Engineering.',
    careerScope: ['Software Developer', 'Web Developer', 'System Executive'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_ug_ba',
    title: 'BA',
    name: 'Bachelor of Arts',
    slug: 'ba',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'UG',
    duration: '3 Years',
    fee: '₹16,400 /sem',
    eligibility: '10+2 in any stream',
    specializations: ['1 Specialization', 'Arts & Humanities'],
    overview: 'Versatile arts program with multiple specializations.',
    semesterInfo: 'English Literature, History, Political Science, Sociology, Environmental Science.',
    careerScope: ['Civil Services Candidate', 'Content Writer', 'PR Assistant'],
    isActive: true,
    createdAt: new Date().toISOString()
  },

  // --- DIPLOMA COURSES ---
  {
    _id: 'prog_dip_dba',
    title: 'DBA',
    name: 'Diploma in Business Administration',
    slug: 'dba',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'Diploma',
    duration: '1 Year',
    fee: '₹20,400 /sem',
    eligibility: '10+2 in any stream',
    specializations: ['1 Specialization', 'Business Administration'],
    overview: 'Entry-level business program for career foundation.',
    semesterInfo: 'Principles of Management, Office Practice, Business Communication, Accounting Basics.',
    careerScope: ['Office Administrator', 'Junior Supervisor', 'Front Desk Executive'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prog_dip_dca',
    title: 'DCA',
    name: 'Diploma in Computer Applications',
    slug: 'dca',
    collegeId: 'col_02',
    collegeName: 'CU Online',
    degreeType: 'Diploma',
    duration: '1 Year',
    fee: '₹20,400 /sem',
    eligibility: '10+2 in any stream',
    specializations: ['1 Specialization', 'Computer Applications'],
    overview: 'Foundation computer applications program.',
    semesterInfo: 'Computer Fundamentals, MS Office, HTML/CSS, Database Basics, Internet Applications.',
    careerScope: ['Computer Operator', 'Data Entry Executive', 'IT Assistant'],
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export function syncDefaultPrograms() {
  const validSlugs = new Set(defaultProgramsList.map((p) => p.slug));
  const validIds = new Set(defaultProgramsList.map((p) => p._id));

  // Retain non-legacy custom admin created programs if any exist
  const customAdminPrograms = (dbData.programs || []).filter(
    (p) =>
      !validIds.has(p._id) &&
      !validSlugs.has(p.slug) &&
      p._id &&
      !p._id.startsWith('prog_0') &&
      !p._id.startsWith('prog_1')
  );

  dbData.programs = [...defaultProgramsList, ...customAdminPrograms];
}

export async function initDbStore() {
  ensureDirectoryExists(DATA_DIR);
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  ensureDirectoryExists(uploadsDir);


  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(content);
      console.log('⚡ Data store loaded from disk');
      syncDefaultPrograms();
      saveDbStore();
      await seedInitialDataToMongo(dbData.colleges, dbData.programs, dbData.users, dbData.faqs, dbData.testimonials);
      return;
    } catch (e) {
      console.error('Failed to read db.json, generating fresh seeds:', e);
    }
  }

  // Generate Seed Data
  await seedInitialData();
  saveDbStore();
  await seedInitialDataToMongo(dbData.colleges, dbData.programs, dbData.users, dbData.faqs, dbData.testimonials);
}

export function saveDbStore() {
  try {
    ensureDirectoryExists(DATA_DIR);
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

export function getDb(): DbSchema {
  return dbData;
}

async function seedInitialData() {
  console.log('🌱 Seeding database with initial data...');

  // 1. Password Hashing
  const hashedAdminPassword = await bcrypt.hash('adminpassword123', 10);
  const hashedStudentPassword = await bcrypt.hash('studentpassword123', 10);

  // Users
  dbData.users = [
    {
      _id: 'usr_admin_01',
      name: 'System Administrator',
      email: 'admin@onlinedegreediploma.com',
      password: hashedAdminPassword,
      role: 'admin',
      phone: '+91 9999900000',
      state: 'Delhi',
      status: 'active',
      savedPrograms: [],
      createdAt: new Date().toISOString()
    }
  ];

  // Colleges (12 Colleges)
  dbData.colleges = [
    {
      _id: 'col_01',
      name: 'LPU Online',
      slug: 'lpu-online',
      location: 'Jalandhar, Punjab',
      state: 'Punjab',
      description: 'Lovely Professional University Online offers UGC-entitled degree programs with flexible learning and world-class faculty.',
      overview: 'LPU Online provides high-quality online degrees crafted for working professionals and ambitious students with global curriculum standards.',
      approvals: ['UGC Entitled', 'NAAC A++', 'AICTE Approved', 'WES Listed'],
      logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop&q=80',
      website: 'https://www.lpuonline.com',
      establishedYear: '2005',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_02',
      name: 'CU Online',
      slug: 'cu-online',
      location: 'Mohali, Punjab',
      state: 'Punjab',
      description: 'Chandigarh University Online offers NAAC A+ accredited online degree and diploma courses with placement support.',
      overview: 'CU Online combines experiential learning, industry immersion, and comprehensive digital LMS for seamless education.',
      approvals: ['UGC', 'NAAC A+', 'QS World Ranked', 'AICTE'],
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop&q=80',
      website: 'https://www.onlinecu.in',
      establishedYear: '2012',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_03',
      name: 'Delhi University (DU) SOL',
      slug: 'delhi-university-du-sol',
      location: 'Delhi, India',
      state: 'Delhi',
      description: 'School of Open Learning, University of Delhi, pioneer in distance and online education with affordable fee structure.',
      overview: 'DU SOL is one of India premier distance education institutions providing central university degrees recognized nationwide.',
      approvals: ['UGC-DEB Approved', 'Central University', 'NAAC A+'],
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=400&fit=crop&q=80',
      website: 'https://sol.du.ac.in',
      establishedYear: '1962',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_04',
      name: 'Amity Online',
      slug: 'amity-online',
      location: 'Noida / Gurugram',
      state: 'Uttar Pradesh',
      description: 'Amity University Online provides top-tier India first UGC recognized online degree programs with global mentorship.',
      overview: 'Amity Online empowers learners with interactive live sessions, global career services, and top recruiter tie-ups.',
      approvals: ['UGC Recognized', 'NAAC A+', 'WES Approved', 'QS Ranked'],
      logo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=400&fit=crop&q=80',
      website: 'https://amityonline.com',
      establishedYear: '2003',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_05',
      name: 'IGNOU',
      slug: 'ignou',
      location: 'New Delhi, India',
      state: 'Delhi',
      description: 'Indira Gandhi National Open University is the world largest open university offering recognized distance and online courses.',
      overview: 'IGNOU serves millions of students across India and globally with accredited degrees, flexible exam schedules, and extensive study centers.',
      approvals: ['Central University', 'UGC-DEB', 'NAAC A++'],
      logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop&q=80',
      website: 'https://www.ignou.ac.in',
      establishedYear: '1985',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_06',
      name: 'GLA University Online',
      slug: 'gla-university-online',
      location: 'Mathura, Uttar Pradesh',
      state: 'Uttar Pradesh',
      description: 'GLA University Online offers industry-aligned online degrees with personalized learning paths and mentorship.',
      overview: 'GLA Online focuses on practical learning, skill enhancement, and flexible examination for undergraduate and postgraduate programs.',
      approvals: ['UGC Approved', 'NAAC A+', 'IACBE Accredited'],
      logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&h=400&fit=crop&q=80',
      website: 'https://glaonline.com',
      establishedYear: '2010',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_07',
      name: 'SSODL',
      slug: 'ssodl',
      location: 'Pune, India',
      state: 'Maharashtra',
      description: 'Symbiosis Centre for Distance Learning (SSODL) offers premium online diplomas and degree credentials from Symbiosis.',
      overview: 'Symbiosis Open & Distance Learning provides flexible management, IT, and literature programs with high market reputation.',
      approvals: ['UGC-DEB Entitled', 'AICTE Approved', 'NAAC A++'],
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop&q=80',
      website: 'https://www.scdl.net',
      establishedYear: '2001',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_08',
      name: 'AMU Online',
      slug: 'amu-online',
      location: 'Aligarh, Uttar Pradesh',
      state: 'Uttar Pradesh',
      description: 'Aligarh Muslim University Online offers accredited degree and diploma courses with rich academic heritage.',
      overview: 'AMU Centre for Distance and Online Education brings central university education directly to your screen with affordable tuition.',
      approvals: ['Central University', 'UGC-DEB Entitled', 'NAAC A+'],
      logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop&q=80',
      website: 'https://amuonline.in',
      establishedYear: '1920',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_09',
      name: 'Online Manipal University',
      slug: 'online-manipal-university',
      location: 'Karnataka',
      state: 'Karnataka',
      description: 'Online Manipal brings top-tier UGC-entitled degrees from Manipal Academy of Higher Education (MAHE) & MUJ.',
      overview: 'Online Manipal features world-class LMS, interactive live classes, virtual labs, and corporate placement support.',
      approvals: ['UGC Entitled', 'NAAC A+', 'AICTE Approved', 'WES Listed'],
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=400&fit=crop&q=80',
      website: 'https://www.onlinemanipal.com',
      establishedYear: '1953',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_10',
      name: 'Jamia Hamdard Online',
      slug: 'jamia-hamdard-online',
      location: 'New Delhi',
      state: 'Delhi',
      description: 'Jamia Hamdard University Centre for Distance and Online Education offers professional degrees with NAAC A+ standards.',
      overview: 'Jamia Hamdard Online emphasizes career-oriented learning, state-of-the-art e-library access, and expert mentor support.',
      approvals: ['Deemed University', 'UGC-DEB Approved', 'NAAC A+'],
      logo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=400&fit=crop&q=80',
      website: 'https://jamiahamdard.edu',
      establishedYear: '1989',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_11',
      name: 'Online Uttaranchal University',
      slug: 'online-uttaranchal-university',
      location: 'Dehradun, Uttarakhand',
      state: 'Uttarakhand',
      description: 'Uttaranchal University Online provides accredited degree and diploma programs designed for flexible remote learning.',
      overview: 'Experience high-impact online education backed by interactive virtual classrooms and comprehensive student care.',
      approvals: ['UGC Entitled', 'NAAC A+', 'AICTE Approved'],
      logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop&q=80',
      website: 'https://onlineuu.in',
      establishedYear: '2013',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'col_12',
      name: 'Online Mizoram University',
      slug: 'online-mizoram-university',
      location: 'Aizawl, Mizoram',
      state: 'Mizoram',
      description: 'Mizoram University Online offers central university degree programs with accessible fees and comprehensive online portals.',
      overview: 'As a Grade A NAAC accredited central university, Mizoram University Online delivers career-focused degrees with digital learning modules.',
      approvals: ['Central University', 'UGC-DEB Entitled', 'NAAC A'],
      logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop&q=80',
      website: 'https://mzuonline.in',
      establishedYear: '2001',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Programs (19 Dynamic Courses)
  dbData.programs = defaultProgramsList;


  // Enquiries
  dbData.enquiries = [];

  // Applications
  dbData.applications = [];

  // Documents
  dbData.documents = [
    {
      _id: 'doc_01',
      title: 'LPU Online MBA Official Syllabus & Prospectus',
      type: 'brochure',
      collegeName: 'LPU Online',
      programName: 'MBA with Dual Specialization',
      fileUrl: '/uploads/LPU_MBA_Prospectus.pdf',
      fileSize: '2.4 MB',
      uploadedBy: 'Admin',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'doc_02',
      title: 'CU Online BCA Course Structure & Fee Guide',
      type: 'fee_structure',
      collegeName: 'CU Online',
      programName: 'BCA with Dual Specialization',
      fileUrl: '/uploads/CU_BCA_Fee_Structure.pdf',
      fileSize: '1.8 MB',
      uploadedBy: 'Admin',
      createdAt: new Date().toISOString()
    }
  ];

  // FAQs
  dbData.faqs = [
    {
      _id: 'faq_01',
      question: 'Are online degree programs UGC entiteld and valid for government jobs?',
      answer: 'Yes! As per UGC notification, online degrees awarded by recognized universities under UGC-DEB regulations are completely equivalent to regular degrees and valid for all government jobs, higher education, and corporate employment.',
      category: 'General',
      order: 1,
      isActive: true
    },
    {
      _id: 'faq_02',
      question: 'How are examinations conducted for online degrees?',
      answer: 'Most accredited universities conduct online proctored examinations that can be taken securely from home using a computer with webcam, or at designated examination centers.',
      category: 'Exam',
      order: 2,
      isActive: true
    },
    {
      _id: 'faq_03',
      question: 'Can I pay my tuition fee in installments or No-Cost EMI?',
      answer: 'Yes, almost all partner universities offer flexible semester-wise fee payment options as well as zero-interest EMI schemes through corporate banking partners.',
      category: 'Fees',
      order: 3,
      isActive: true
    },
    {
      _id: 'faq_04',
      question: 'What is the complete process to apply through Online Degree Diploma?',
      answer: 'Select your preferred university and program, submit a free enquiry or counselling request, speak with an academic advisor, upload eligibility documents, and complete your admission online.',
      category: 'Admission',
      order: 4,
      isActive: true
    }
  ];

  // Testimonials
  dbData.testimonials = [
    {
      _id: 'tst_01',
      name: 'Vikramaditya Roy',
      course: 'Online MBA Dual Specialization',
      college: 'LPU Online',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
      quote: 'Online Degree Diploma helped me compare fee structures and accreditation transparently. I completed my MBA while working full time and received a 40% salary hike!',
      rating: 5,
      isActive: true
    },
    {
      _id: 'tst_02',
      name: 'Sneha Kulkarni',
      course: 'MCA Cloud Computing',
      college: 'Online Manipal University',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
      quote: 'The free counselling team answered every query with clarity. The portal made my application and document submission completely hassle-free.',
      rating: 5,
      isActive: true
    },
    {
      _id: 'tst_03',
      name: 'Amitabh Sen',
      course: 'BCA Dual Specialization',
      college: 'CU Online',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
      quote: 'Direct brochure downloads and fee breakdowns allowed me to choose the best program within my budget. Truly recommended for all online learners.',
      rating: 5,
      isActive: true
    }
  ];

  // Sliders
  dbData.sliders = [
    {
      _id: 'sld_01',
      title: 'Accelerate Your Career with UGC-Recognized Online Degrees',
      subtitle: 'Explore 100+ accredited Bachelor, Master & Diploma programs from top Indian universities.',
      badge: '🎓 Admissions Open for 2026 Batch',
      bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=800&fit=crop&q=80',
      primaryBtnText: 'Explore Programs',
      primaryBtnLink: '/programs',
      secondaryBtnText: 'Apply Now',
      secondaryBtnLink: '/apply',
      order: 1,
      isActive: true
    },
    {
      _id: 'sld_02',
      title: 'Study at Top Universities like LPU, DU, Amity & Manipal',
      subtitle: 'Flexible online learning, zero-interest EMI options, and dedicated placement assistance.',
      badge: '✨ Verified & Accredited Universities',
      bgImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=800&fit=crop&q=80',
      primaryBtnText: 'View Colleges',
      primaryBtnLink: '/colleges',
      secondaryBtnText: 'Get Free Counselling',
      secondaryBtnLink: '/contact',
      order: 2,
      isActive: true
    }
  ];

  // Contacts
  dbData.contacts = [
    {
      _id: 'cnt_01',
      name: 'Rohan Malhotra',
      email: 'rohan.m@example.com',
      phone: '+91 9777788888',
      subject: 'Query regarding DU SOL examination centers',
      message: 'Hello, I live in Gurgaon. Can I choose examination center near NCR for DU SOL courses?',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Subscribers
  dbData.subscribers = [
    {
      _id: 'sub_01',
      email: 'learner.test@example.com',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ];

  // Notifications
  dbData.notifications = [
    {
      _id: 'notif_01',
      userId: 'usr_std_01',
      title: 'Application Received',
      message: 'Your application for MBA at LPU Online has been submitted successfully.',
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];

  console.log('✅ Seed data successfully prepared!');
}
