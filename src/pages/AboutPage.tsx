import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Target, Eye, Award, CheckCircle, Shield, Users, ArrowRight } from 'lucide-react';
export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-page font-sans pb-16 transition-colors duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden py-20 sm:py-28">

        <img
          src="/PagesBanner/1.png"
          alt="Students"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/40 to-black/25"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">

          <span className="inline-block px-4 py-2 rounded-full bg-[#FA394A]/20 border border-[#FA394A]/40 text-[#FA394A] text-xs font-bold uppercase tracking-[2px] mb-5">
            About Online Degree Diploma
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Empowering Learners with
            <span className="block text-[#FA394A]">
              Accessible Higher Education
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-gray-200 text-sm sm:text-lg leading-8">
            India's leading online degree and diploma discovery platform connecting
            aspiring learners with UGC-recognized universities. Compare courses,
            explore career opportunities, and secure admission through one trusted
            destination.
          </p>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Who We Are & What We Do */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-surface p-8 rounded-3xl border border-theme shadow-sm space-y-4">
            <h2 className="text-2xl font-extrabold text-heading">Who We Are</h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              <strong>Online Degree Diploma</strong> is an innovative EdTech platform established to revolutionize how working professionals and students discover, compare, and enroll in accredited online undergraduate, postgraduate, and diploma courses.
            </p>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              We bridge the gap between premier universities—such as LPU Online, CU Online, DU SOL, Amity Online, IGNOU, and Manipal—and learners who demand quality, flexibility, and affordability.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-theme shadow-sm space-y-4">
            <h2 className="text-2xl font-extrabold text-heading">What We Do</h2>
            <ul className="space-y-3 text-xs sm:text-sm text-muted">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#FA394A] mr-2 shrink-0 mt-0.5" />
                <span>Provide 100% unbiased counselling for 12+ top UGC-entitled universities.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#FA394A] mr-2 shrink-0 mt-0.5" />
                <span>Facilitate direct brochure downloads, fee breakdowns, and syllabus guides.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#FA394A] mr-2 shrink-0 mt-0.5" />
                <span>Streamline digital applications with 0% interest EMI payment guidance.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#FA394A] mr-2 shrink-0 mt-0.5" />
                <span>Assist students from document verification to degree completion.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#FA394A] to-[#D92B3B] text-white p-8 rounded-3xl shadow-xl space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black">Our Mission</h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              To democratize quality higher education by enabling every individual, regardless of location or schedule, to acquire UGC-accredited university degrees and diplomas that advance their career.
            </p>
          </div>

          <div className="bg-[#333333] dark:bg-black text-white p-8 rounded-3xl shadow-xl space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#FA394A]" />
            </div>
            <h3 className="text-2xl font-black">Our Vision</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              To become South Asia most trusted digital admission and career mentorship platform, empowering over 1 Million learners with world-class online education by 2030.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface rounded-3xl p-8 border border-theme text-center space-y-4 shadow-sm">
          <h3 className="text-2xl font-extrabold text-heading">Have Questions About University Approvals or Admissions?</h3>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
            Our team of expert academic counselors is available to answer all your queries regarding UGC DEB recognition, exam patterns, and fee structures.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center bg-[#FA394A] hover:bg-[#D92B3B] text-white px-8 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              <span>Talk to an Academic Advisor</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;