
import React from 'react';
import { Star, CheckCircle2, Quote, UserCheck } from 'lucide-react';
import { ALL_REVIEWS } from '../constants';
import CTASection from '../components/CTASection';

const Reviews: React.FC = () => {
  return (
    <div className="animate-fade-in bg-[#F9F9F7] min-h-screen pb-20">
      <div className="bg-white py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <UserCheck className="h-4 w-4 mr-2" />
            Client Success Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Voices of Clarity</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
            Real experiences from students, professionals, and seekers who found technical grounding in our approach. 
            We prioritize accuracy, logic, and ethical guidance.
          </p>
          <div className="flex justify-center space-x-2 items-center">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 text-amber-500 fill-current" />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-900 ml-2">4.9/5 Average Rating</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-3">
                    <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full bg-gray-100" />
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{review.role}</p>
                    </div>
                 </div>
                 <Quote className="text-amber-100 w-8 h-8" />
              </div>
              
              <div className="flex space-x-1 mb-4">
                 {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={12} 
                        className={`${i < Math.floor(review.rating) ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                    />
                 ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                "{review.content}"
              </p>
              
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-400">{review.date}</span>
                {review.verified && (
                    <span className="flex items-center text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                        <CheckCircle2 size={10} className="mr-1" /> Verified Client
                    </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <CTASection 
            title="Experience the difference."
            description="Join hundreds of others who have moved from confusion to clarity."
            primaryCTA={{ text: "Book a Reading", link: "/consultations" }}
            secondaryCTA={{ text: "Read Research", link: "/blog" }}
        />
      </div>
    </div>
  );
};

export default Reviews;
