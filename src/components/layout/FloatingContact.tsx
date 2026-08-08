import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  MessageCircle,
  X,
} from 'lucide-react';
import { EnquiryModal } from '../common/EnquiryModal';

export const FloatingContact: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const expandedOptionsClassName = expanded
    ? 'flex flex-col items-end space-y-3 transition-all duration-300 ease-out pointer-events-auto opacity-100 scale-100 translate-y-0'
    : 'flex flex-col items-end space-y-3 transition-all duration-300 ease-out pointer-events-auto opacity-0 scale-90 translate-y-6 pointer-events-none';

  return (
    <>
      {/* Floating Contact Container */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3 pointer-events-none">

        {/* Expanded Contact Options */}
        <div className={expandedOptionsClassName}>

      
{/* WhatsApp Action */}
<a
  href="https://wa.me/918054100099?text=Hello!%20I%20want%20information%20about%20Online%20Degree%20and%20Diploma%20admissions."
  target="_blank"
  rel="noreferrer"
  className="group flex items-center bg-white/90 backdrop-blur-xl border border-white/60 text-[#1f1f1f] py-2.5 pl-4 pr-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 transition-all duration-300 text-xs font-bold"
>
  <span className="mr-3 tracking-tight">
    Chat on WhatsApp
  </span>

  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
    <MessageCircle className="w-4 h-4 text-white fill-current" />
  </div>
</a>



          {/* Call Action */}
          <a
            href="tel:+918054100099"
            className="group flex items-center bg-white/90 backdrop-blur-xl border border-white/60 text-[#1f1f1f] py-2.5 pl-4 pr-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(51,51,51,0.35)] hover:-translate-y-0.5 transition-all duration-300 text-xs font-bold"
          >
            <span className="mr-3 tracking-tight">
              Call Admission Helpline
            </span>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#333333] to-[#111111] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </a>

          {/* Enquiry Form Trigger */}
          <button
            type="button"
            onClick={() => {
              setModalOpen(true);
              setExpanded(false);
            }}
            className="group flex items-center bg-white/90 backdrop-blur-xl border border-white/60 text-[#1f1f1f] py-2.5 pl-4 pr-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(250,57,74,0.35)] hover:-translate-y-0.5 transition-all duration-300 text-xs font-bold"
          >
            <span className="mr-3 tracking-tight">
              Instant Counselling Form
            </span>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FA394A] to-[#D92B3B] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>

        {/* Main Trigger Button */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-label="Contact options"
          aria-expanded={expanded}
          className="pointer-events-auto relative bg-gradient-to-br from-[#FA394A] to-[#D92B3B] hover:from-[#ff4a5c] hover:to-[#c22536] text-white px-5 py-4 rounded-full shadow-[0_10px_40px_rgba(250,57,74,0.45)] hover:shadow-[0_14px_50px_rgba(250,57,74,0.6)] flex items-center space-x-2.5 font-bold text-xs transition-all duration-300 hover:scale-[1.03] active:scale-95 ring-1 ring-white/40"
        >
          {expanded ? (
            <>
              <X className="w-5 h-5" />

              <span className="hidden sm:inline tracking-tight">
                Close
              </span>
            </>
          ) : (
            <>
              <div className="relative">
                <MessageSquare className="w-5 h-5" />

                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#FA394A]" />
                </span>
              </div>

              <span className="tracking-tight">
                Need Help? Chat with us
              </span>
            </>
          )}
        </button>
      </div>

      {/* Instant Counselling Modal */}
      {modalOpen && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Need Admission Help? Talk to an Expert Counsellor"
          type="general"
        />
      )}
    </>
  );
};
