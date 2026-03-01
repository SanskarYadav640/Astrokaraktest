
import React from 'react';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
      <Quote className="h-8 w-8 text-amber-100 mb-4" />
      <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">
        "{testimonial.content}"
      </p>
      <div className="mt-auto">
        <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{testimonial.role}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
