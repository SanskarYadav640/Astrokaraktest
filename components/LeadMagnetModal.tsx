
import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';

const LeadMagnetModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('hasSeenLeadMagnet');
      if (!hasSeen) {
        setIsOpen(true);
      }
    }, 10000); // 10 seconds delay
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenLeadMagnet', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {!submitted ? (
          <>
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 text-amber-700 rounded-full mb-6">
              <Mail className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Start your Vedic journey.</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Get our free technical guide: <span className="font-semibold italic">"How to read your birth chart from scratch"</span>. Join 10,000+ students learning the craft.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-4 bg-amber-700 text-white font-bold rounded-lg hover:bg-amber-800 transition-all shadow-lg"
              >
                Send Me the Guide
              </button>
            </form>
            <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-widest text-center">
              No spam. Unsubscribe anytime. Grounded knowledge only.
            </p>
          </>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Check your inbox.</h2>
            <p className="text-gray-600">The guide is on its way. Welcome to the community.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadMagnetModal;
