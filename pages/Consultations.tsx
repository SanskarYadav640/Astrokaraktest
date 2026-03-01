import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CONSULTATION_FAQS, ALL_REVIEWS } from '../constants';
import FAQAccordion from '../components/FAQAccordion';
import { 
  Video, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  BarChart3,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Star,
  Lock,
  Clock,
  X,
  Calendar,
  Phone,
  Mail,
  User,
  Loader2
} from 'lucide-react';
import { Service } from '../types';
import { listActiveServices, seedDefaultServicesIfEmpty } from '../src/admin/servicesStore';
import { createBooking } from '../src/admin/bookingsStore';

const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState<string>('1');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    date: '',
    time: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Ensure we have something to show if fresh install
    seedDefaultServicesIfEmpty();
    setServices(listActiveServices());
  }, []);

  const handleStartTextReading = () => {
    navigate('/text-reading', { state: { count: questionCount } });
  };

  const openBookingModal = (service: Service) => {
    setSelectedService(service);
    setBookingSuccess(false);
    setFormData({ name: '', email: '', whatsapp: '', date: '', time: '', message: '' });
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    createBooking({
      serviceId: selectedService.id,
      serviceTitleSnapshot: selectedService.title,
      servicePriceSnapshot: selectedService.priceInr,
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      preferredDate: formData.date,
      preferredTime: formData.time,
      message: formData.message
    });

    setIsSubmitting(false);
    setBookingSuccess(true);
  };

  return (
    <div className="animate-fade-in pb-20 bg-[#F9F9F7]">
      {/* Premium Hero Section */}
      <div className="bg-white py-20 md:py-28 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <ShieldCheck className="h-3 w-3 mr-2" />
            Vetted Technical Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight">
            Predictive Accuracy for <br />Life’s Transitions
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
            We move beyond generic advice. Every session is a deep dive into your sidereal geometry, using multiple divisional charts to ensure technical rigor and clarity.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-[11px] text-gray-400 font-bold uppercase tracking-[0.15em]">
            <span className="flex items-center"><Video className="mr-2 h-4 w-4 text-amber-700" /> High-Definition Video</span>
            <span className="flex items-center"><FileText className="mr-2 h-4 w-4 text-amber-700" /> Digital Summary Report</span>
            <span className="flex items-center"><BarChart3 className="mr-2 h-4 w-4 text-amber-700" /> Dasha Timeline Prep</span>
          </div>
        </div>
      </div>

      {/* Review Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-gray-200">
           <div className="flex items-center space-x-6 mb-6 md:mb-0">
             <div className="flex -space-x-3">
               {ALL_REVIEWS.slice(0, 4).map((r, i) => (
                 <img key={i} src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full border-2 border-gray-900" />
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-amber-700 text-white flex items-center justify-center text-[10px] font-bold">
                 +500
               </div>
             </div>
             <div>
                <div className="flex items-center space-x-1 mb-1">
                   {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-amber-400 fill-current" />)}
                </div>
                <p className="text-xs text-gray-300">Rated <span className="text-white font-bold">4.9/5</span> by clients</p>
             </div>
           </div>
           
           <div className="flex items-center space-x-6 w-full md:w-auto">
             <div className="hidden md:block h-8 w-px bg-white/10"></div>
             <p className="text-sm text-gray-300 italic flex-grow md:flex-grow-0 line-clamp-1 md:line-clamp-none">
               "{ALL_REVIEWS[0].content.substring(0, 60)}..." 
             </p>
             <Link to="/reviews" className="shrink-0 text-amber-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center">
               See All Reviews <ArrowRight size={12} className="ml-2" />
             </Link>
           </div>
        </div>
      </div>

      {/* DYNAMIC SERVICES SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-amber-700 uppercase tracking-[0.3em] mb-3">Service Tiers</h2>
          <h3 className="text-3xl font-serif font-bold text-gray-900">1:1 Video Consultations</h3>
        </div>
        
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div 
                key={service.id} 
                className={`relative bg-white border rounded-2xl p-10 flex flex-col transition-all duration-300 group hover:-translate-y-1 ${
                  idx === 0 
                  ? 'border-amber-700 shadow-xl shadow-amber-900/5 ring-1 ring-amber-700/10' 
                  : 'border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200'
                }`}
              >
                {idx === 0 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-700 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Recommended
                  </div>
                )}
                
                <div className="mb-8">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Time Investment</span>
                  <h4 className="text-2xl font-serif font-bold text-gray-900">{service.durationMins} Mins Session</h4>
                </div>
                
                <div className="mb-8">
                  <p className="text-4xl font-bold text-gray-900">₹{service.priceInr.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Single upfront payment</p>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>
                
                <div className="space-y-4 mb-10 pt-8 border-t border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Technical Deliverables:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-amber-700 mr-3 shrink-0 mt-0.5" />
                      <span>Recording + Notes</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-amber-700 mr-3 shrink-0 mt-0.5" />
                      <span>D1, D9, & D10 Synthesis</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-amber-700 mr-3 shrink-0 mt-0.5" />
                      <span>Logical Remedial Roadmap</span>
                    </li>
                  </ul>
                </div>
                
                <button
                  onClick={() => openBookingModal(service)}
                  className={`w-full py-4 font-bold rounded-lg text-center transition-all shadow-sm uppercase tracking-widest text-xs flex items-center justify-center space-x-2 ${
                    idx === 0 
                    ? 'bg-amber-700 text-white hover:bg-amber-800' 
                    : 'bg-white border border-amber-700 text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span>Book Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p>Loading active services...</p>
          </div>
        )}
      </div>

      {/* Text-Based Reading Section (Kept as requested) */}
      <div className="max-w-5xl mx-auto px-4 mt-32">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
           <div className="p-10 md:p-16 relative z-10 flex flex-col md:flex-row gap-12">
             <div className="md:w-1/2">
                <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                  <MessageSquare className="h-3 w-3 mr-2" />
                  Written Analysis
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Written Analysis</h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Prefer a permanent record? Submit specific questions and receive a detailed, technical PDF dossier analyzing your chart's geometry. 
                  Ideal for focused queries that require precision without the need for a live call.
                </p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>Delivered within 72 Hours</span>
                </div>
             </div>

             <div className="md:w-1/2 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col justify-center">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">How many questions?</label>
                
                <div className="grid grid-cols-5 gap-2 mb-8">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`py-3 rounded-lg text-sm font-bold transition-all ${
                        questionCount === num 
                        ? 'bg-amber-700 text-white shadow-md transform scale-105' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-700 hover:text-amber-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-xs text-gray-500">
                    Estimated Cost: <span className="text-gray-900 font-bold text-lg align-middle ml-2">
                      ${questionCount === '10+' ? '150+' : parseInt(questionCount) * 30}
                    </span>
                  </div>
                  <button 
                    onClick={handleStartTextReading}
                    className="px-8 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-lg flex items-center"
                  >
                    Proceed to Form <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Methodology & Privacy Section */}
      <div className="max-w-7xl mx-auto px-4 mt-16 mb-24">
        <div className="bg-amber-50/50 rounded-[2rem] p-8 md:p-12 border border-amber-100/50 relative overflow-hidden">
          {/* Decorative subtle background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative z-10">
             
             {/* Left: Value Prop & Privacy */}
             <div className="lg:w-1/3 shrink-0">
                <div className="inline-flex items-center px-3 py-1 bg-white border border-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                  <ShieldCheck className="h-3 w-3 mr-2" />
                  Strictly Private
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">How we work.</h2>
                <p className="text-gray-600 leading-relaxed text-sm mb-8">
                  A professional reading is a technical procedure, not a performance. We respect your privacy and your intelligence. No automated reports, just human expertise.
                </p>
                
                <div className="p-5 bg-white rounded-2xl border border-amber-100 shadow-sm flex items-start space-x-4">
                   <div className="p-2 bg-amber-50 rounded-lg text-amber-700 shrink-0">
                     <Lock size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-1.5">Confidentiality Guarantee</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Your session recording and chart data are 100% private. We never use client data for AI training or public content.
                      </p>
                   </div>
                </div>
             </div>

             {/* Right: The Process Steps */}
             <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {[
                  { 
                    icon: Clock, 
                    title: "Live, Interactive Analysis", 
                    desc: "Your chart is analyzed live during the session. No pre-written reports, no scripted interpretations." 
                  },
                  { 
                    icon: CheckCircle2, 
                    title: "Event Calibration", 
                    desc: "The first 10 mins are spent verifying past life events to lock in the birth time precision." 
                  },
                  { 
                    icon: BarChart3, 
                    title: "Timeline Decoding", 
                    desc: "We map your current Dasha period against real-time planetary transits to find your windows of opportunity." 
                  },
                  { 
                    icon: FileText, 
                    title: "No Upsells", 
                    desc: "We focus on logic and behavioral remedies. No fear-mongering or expensive gemstone pushing." 
                  }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col">
                     <div className="flex items-center space-x-3 mb-3">
                       <div className="w-8 h-8 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-amber-700 shadow-sm">
                          <step.icon size={16} />
                       </div>
                       <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                     </div>
                     <p className="text-xs text-gray-500 leading-relaxed pl-11 border-l border-gray-200">
                       {step.desc}
                     </p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 mt-40">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-amber-700 uppercase tracking-[0.3em] mb-3">Questions</h2>
          <h3 className="text-3xl font-serif font-bold text-gray-900">Consultation FAQ</h3>
        </div>
        <FAQAccordion faqs={CONSULTATION_FAQS || []} />
      </div>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {!bookingSuccess ? (
              <div className="p-8">
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">New Request</span>
                  <h3 className="font-serif font-bold text-2xl text-gray-900 mt-1 mb-2">{selectedService.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 gap-3">
                    <span className="flex items-center"><Clock size={14} className="mr-1"/> {selectedService.durationMins} Mins</span>
                    <span>•</span>
                    <span className="font-bold">₹{selectedService.priceInr.toLocaleString()}</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">WhatsApp Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="tel" 
                        required
                        placeholder="+91..."
                        value={formData.whatsapp}
                        onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Preferred Date</label>
                      <input 
                        type="date" 
                        required
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Time Slot</label>
                      <input 
                        type="time" 
                        required
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Specific Questions / Context</label>
                    <textarea 
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="Briefly describe your query..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-lg mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Request Booking</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-gray-900 mb-2">Request Received</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Thank you, {formData.name}. We have received your request for <strong>{selectedService.title}</strong>. 
                  <br/><br/>
                  Our team will contact you on WhatsApp at <span className="font-bold text-gray-900">{formData.whatsapp}</span> within 24 hours to confirm the slot and payment details.
                </p>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-8 py-3 bg-amber-700 text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-amber-800 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Consultations;
