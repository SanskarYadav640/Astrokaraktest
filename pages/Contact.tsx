
import React, { useState } from 'react';
import { Mail, MessageCircle, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600">Have questions about a consultation or ebook? We're here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4">Email Support</h4>
            <div className="flex items-center space-x-3 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>hello@astrokarak.com</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4">Community</h4>
            <div className="flex items-center space-x-3 text-gray-600">
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp Group Invite</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4">Hours</h4>
            <p className="text-sm text-gray-500">Mon-Fri: 10am - 6pm IST<br />Response time: within 24 hours.</p>
          </div>
        </div>

        <div className="md:col-span-2">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Subject</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all">
                  <option>Consultation Inquiry</option>
                  <option>Ebook Technical Issue</option>
                  <option>Bulk Order Inquiry</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                <textarea rows={5} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-amber-700 text-white font-bold rounded-lg hover:bg-amber-800 transition-all shadow-md">
                Send Message
              </button>
            </form>
          ) : (
            <div className="bg-green-50 p-12 rounded-xl border border-green-100 text-center animate-fade-in">
              <h3 className="text-2xl font-serif font-bold text-green-800 mb-2">Message Received.</h3>
              <p className="text-green-700">Thank you for reaching out. A team member will respond within 24 hours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
