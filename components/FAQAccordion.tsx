
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ } from '../types';

interface FAQAccordionProps {
  faqs: FAQ[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium text-gray-900">{faq.question}</span>
            {openIndex === index ? <ChevronUp className="h-5 w-5 text-amber-700" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </button>
          {openIndex === index && (
            <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed animate-fade-in">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
