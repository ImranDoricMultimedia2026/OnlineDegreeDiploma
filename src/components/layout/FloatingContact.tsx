import React, { useState } from 'react';
import { MessageSquare, Phone, MessageCircle, X } from 'lucide-react';
import { EnquiryModal } from '../common/EnquiryModal';

export const FloatingContact: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3 pointer-events-none">
        {/* Expanded Options */}
        <div
          className={`flex flex-col items-end space-y-2.5 transition-all duration-300 pointer-events-auto ${
            expanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          }`}
        >
          {/* WhatsApp Action */}
          <a
            href="https://wa.me/919876543210?text=Hello!%20I%20want%20information%20about%20Online%20Degree%20and%20Diploma%20admissions."
            target="_blank"
            rel="noreferrer"
            className="flex items-center bg-[#25D366] text-white py-2.5 px-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-xs font-bold group"
          >
            <span className="mr-2">Chat on WhatsApp</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
          </a>

          {/* Call Action */}
          <a
            href="tel:+919876543210"
            className="flex items-center bg-[#333333] text-white py-2.5 px-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-xs font-bold group"
          >
            <span className="mr-2">Call Admission Helpline</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          {/* Enquiry Form Trigger */}
          <button
            onClick={() => {
              setModalOpen(true);
              setExpanded(false);
            }}
            className="flex items-center bg-[#FA394A] text-white py-2.5 px-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-xs font-bold group"
          >
            <span className="mr-2">Instant Counselling Form</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Main Trigger Toggle Pill */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="pointer-events-auto bg-[#FA394A] hover:bg-[#D92B3B] text-white px-4 py-3.5 rounded-full shadow-2xl flex items-center space-x-2 font-bold text-xs transition-all hover:scale-105 active:scale-95 border-2 border-white"
          aria-label="Contact options"
        >
          {expanded ? (
            <>
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <div className="relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#FA394A] animate-ping" />
              </div>
              <span>Need Help? Chat with us</span>
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
