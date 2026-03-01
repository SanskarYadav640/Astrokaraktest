
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, Mail, Phone, AlertCircle, FileText, CheckCircle2, Sparkles, Plus } from 'lucide-react';

const TextReadingForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCount = location.state?.count || '1';

  const [questionCountStr, setQuestionCountStr] = useState(initialCount);
  const [customCount, setCustomCount] = useState<string>('');
  
  // Form State
  const [isPrecise, setIsPrecise] = useState<string | null>(null); // 'yes' | 'no'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    tob: '',
    pob: '',
    questions: ''
  });

  const getEffectiveCount = () => {
    if (questionCountStr === '10+') {
      return customCount ? parseInt(customCount) : 10;
    }
    return parseInt(questionCountStr);
  };

  const calculatePrice = () => {
    const count = getEffectiveCount();
    let total = count * 30; // Assuming $30 per question base price
    if (isPrecise === 'no') {
      total += 27; // Add BTR price
    }
    return total;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPrecise) return;
    // Handle form submission logic here (e.g., API call)
    alert(`Request submitted! Proceeding to payment ($${calculatePrice()})...`);
  };

  return (
    <div className="animate-fade-in min-h-screen bg-[#F9F9F7] pb-20">
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link to="/consultations" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-amber-700 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-3 w-3" /> Back to Services
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Text-Based Reading Request</h1>
          <p className="text-gray-600 max-w-xl">
            Please provide accurate birth details. Our analysis is strictly technical and relies on the precision of your timeline.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10">
          
          {/* Question Configuration */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
               <label className="text-xs font-bold uppercase tracking-widest text-amber-900">Number of Questions</label>
               <div className="flex items-center space-x-2">
                 <select 
                   value={questionCountStr}
                   onChange={(e) => setQuestionCountStr(e.target.value)}
                   className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                 >
                   {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n.toString()}>{n}</option>)}
                   <option value="10+">10+</option>
                 </select>
               </div>
             </div>

             {questionCountStr === '10+' && (
               <div className="animate-fade-in mb-4">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Enter Exact Quantity (10 or more)</label>
                 <input 
                   type="number" 
                   min="10"
                   value={customCount}
                   onChange={(e) => setCustomCount(e.target.value)}
                   className="w-full md:w-32 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                   placeholder="e.g. 12"
                   required
                 />
               </div>
             )}
             
             <div className="flex justify-between items-center border-t border-amber-100 pt-4">
               <span className="text-sm text-amber-800">Total Estimate</span>
               <div className="flex items-center space-x-2">
                  {isPrecise === 'no' && (
                    <span className="text-xs text-amber-600 font-bold bg-amber-100 px-2 py-1 rounded-md animate-pulse">
                      + $27 BTR Fee Included
                    </span>
                  )}
                  <span className="text-xl font-bold text-amber-900">${calculatePrice()}</span>
               </div>
             </div>
          </div>

          {/* Precision Check - CRITICAL */}
          <div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="mr-2 text-amber-700" size={20} /> Birth Time Precision
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Vedic Astrology uses divisional charts (Vargas) that change every few minutes. An inaccurate birth time will yield an incorrect reading.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsPrecise('yes')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isPrecise === 'yes' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isPrecise === 'yes' ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
                    {isPrecise === 'yes' && <CheckCircle2 size={12} />}
                  </div>
                  <span className="font-bold text-gray-900">Yes, it is precise.</span>
                </div>
                <p className="text-xs text-gray-500 pl-8">I have a precise time of birth.</p>
              </button>

              <button
                type="button"
                onClick={() => setIsPrecise('no')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isPrecise === 'no' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                   <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isPrecise === 'no' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'}`}>
                    {isPrecise === 'no' && <Plus size={12} />}
                  </div>
                  <span className="font-bold text-gray-900">No, I'm not sure.</span>
                </div>
                <p className="text-xs text-gray-500 pl-8">It might be off by 15+ minutes.</p>
              </button>
            </div>

            {isPrecise === 'no' && (
              <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Rectification Service Added (+ $27)</h4>
                    <p className="text-sm text-blue-800 leading-relaxed mb-0">
                      We've automatically added our <strong>Birth Time Rectification</strong> service to your order. 
                      Our team will first mathematically deduce your exact time before answering your questions. 
                      A seamless, all-in-one experience.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Details Form */}
          {isPrecise !== null && (
            <div className={`space-y-10 animate-fade-in`}>
              
              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center border-b border-gray-100 pb-4">
                  <User className="mr-2 text-gray-400" size={18} /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Birth Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center border-b border-gray-100 pb-4">
                  <Calendar className="mr-2 text-gray-400" size={18} /> Birth Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {isPrecise === 'no' ? 'Approximate Time' : 'Time of Birth'}
                    </label>
                    <input 
                      type="time" 
                      name="tob"
                      required
                      value={formData.tob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Place of Birth</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        name="pob"
                        required
                        value={formData.pob}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Specific Questions */}
              <div className="space-y-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center border-b border-gray-100 pb-4">
                  <FileText className="mr-2 text-gray-400" size={18} /> 
                  {isPrecise === 'no' ? 'Questions & Life Events' : 'Your Questions'}
                </h3>
                <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100 mb-4">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {isPrecise === 'no' ? (
                      <>
                        Since we need to rectify your chart, please use the box below to list <strong>3-4 major life events</strong> (e.g., marriage date, first job, childbirth, major travel) followed by your <strong>{getEffectiveCount()} specific questions</strong>.
                      </>
                    ) : (
                      <>
                        Please list your <strong>{getEffectiveCount()}</strong> questions below. Be specific. 
                        (e.g., "When will I likely move abroad?" is better than "What is my future?").
                      </>
                    )}
                  </p>
                </div>
                <textarea 
                  rows={8}
                  name="questions"
                  required
                  value={formData.questions}
                  onChange={handleInputChange}
                  placeholder={isPrecise === 'no' ? "Events:\n1. Marriage: Jan 2018\n2. Job: Aug 2020\n\nQuestions:\n1. ..." : "1. \n\n2. \n\n3. ..."}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm leading-relaxed"
                ></textarea>
              </div>

              {/* Submit Action */}
              <div className="pt-8">
                <button 
                  type="submit" 
                  disabled={isPrecise === null}
                  className="w-full py-5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Proceed to Payment (${calculatePrice()})
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4">
                  Secure payment processing. Analysis delivered via email within 72 hours.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TextReadingForm;
