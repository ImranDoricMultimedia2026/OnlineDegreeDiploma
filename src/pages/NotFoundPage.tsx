import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-[#F5F5F5] flex items-center justify-center px-4 py-16 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 text-[#FA394A] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <GraduationCap className="w-10 h-10" />
        </div>

        <div>
          <span className="text-4xl font-black text-[#FA394A] block mb-1">404</span>
          <h1 className="text-xl sm:text-2xl font-black text-[#333333]">Page Not Found</h1>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Oops! The page or course link you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 bg-[#FA394A] hover:bg-[#D92B3B] text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all shadow-md shadow-[#FA394A]/20 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/programs"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#333333] font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
