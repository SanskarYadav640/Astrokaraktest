
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ArrowRight } from 'lucide-react';

interface RoadmapStep {
  number: string;
  title: string;
  description: string;
  links: { label: string; path: string }[];
}

const steps: RoadmapStep[] = [
  {
    number: '1',
    title: 'Foundations',
    description: 'Start with the building blocks of a chart. Learn how the sky looked at the moment of your birth and how those patterns translate to human traits.',
    links: [
      { label: 'Start Here', path: '/category/start-here' },
      { label: 'Houses (Bhāva)', path: '/category/houses' },
      { label: 'Planets (Graha)', path: '/category/planets' },
      { label: 'Signs (Rāśi)', path: '/category/signs' },
      { label: 'Nakshatra', path: '/category/nakshatra' },
    ],
  },
  {
    number: '2',
    title: 'Core Techniques',
    description: 'Learn the systems that power prediction and timing. Understand why some periods of life feel like expansion while others feel like contraction.',
    links: [
      { label: 'Dasha and Timing', path: '/category/dasha' },
      { label: 'Transits (Gochara)', path: '/category/transits' },
      { label: 'Yogas', path: '/category/yogas' },
      { label: 'Varga Charts', path: '/category/varga-charts' },
    ],
  },
  {
    number: '3',
    title: 'Life Topics',
    description: 'Apply astrology to real-life questions. From relational compatibility to identifying the right career path based on your 10th house strength.',
    links: [
      { label: 'Marriage and Relationships', path: '/category/relationships' },
      { label: 'Career and Money', path: '/category/career' },
      { label: 'Wealth', path: '/category/wealth' },
      { label: 'Health (Educational)', path: '/category/health' },
    ],
  },
  {
    number: '4',
    title: 'Practical Guidance',
    description: 'Do it responsibly, with clean remedies and ethics. We focus on lifestyle shifts and behavioral changes that balance planetary energy.',
    links: [
      { label: 'Remedies & Ethics', path: '/category/remedies' },
      { label: 'FAQs', path: '/category/faq' },
    ],
  },
  {
    number: '5',
    title: 'Deepen Your Study',
    description: 'Go deeper with structured reading across advanced topics. Peer into the D60, understand precise degree-based Yogas, and master Nakshatra padas.',
    links: [
      { label: 'Varga Charts', path: '/category/varga-charts' },
      { label: 'Nakshatra', path: '/category/nakshatra' },
      { label: 'Yogas', path: '/category/yogas' },
    ],
  },
  {
    number: '6',
    title: 'Get Help',
    description: 'If you want personalized guidance, book a session. A direct reading removes the guesswork and provides clarity on your specific path.',
    links: [
      { label: 'Consultations', path: '/consultations' },
      { label: 'Book Session', path: '/consultations' },
    ],
  },
];

const RoadmapStepperAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleStep = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-amber-200 md:left-[23px]" />

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-12 md:pl-16">
            {/* Step Number Circle */}
            <div 
              className={`absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center font-bold z-10 transition-colors ${
                openIndex === index 
                ? 'bg-amber-700 border-amber-200 text-white' 
                : 'bg-white border-amber-200 text-amber-700'
              }`}
            >
              {step.number}
            </div>

            {/* Accordion Card */}
            <div 
              className={`bg-white rounded-xl border transition-all duration-200 ${
                openIndex === index 
                ? 'border-amber-700 shadow-md ring-1 ring-amber-700/10' 
                : 'border-gray-100 shadow-sm hover:border-amber-200'
              }`}
            >
              <button
                onClick={() => toggleStep(index)}
                aria-expanded={openIndex === index}
                className="w-full text-left px-6 py-4 flex items-center justify-between group focus:outline-none"
              >
                <h2 className={`text-lg md:text-xl font-serif font-bold transition-colors ${
                  openIndex === index ? 'text-amber-900' : 'text-gray-800'
                }`}>
                  {step.title}
                </h2>
                <div className={`p-1 rounded-full transition-colors ${
                  openIndex === index ? 'bg-amber-50 text-amber-700' : 'text-gray-400 group-hover:text-amber-700'
                }`}>
                  {openIndex === index ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-8 animate-fade-in">
                  <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {step.links.map((link, lIdx) => (
                      <Link
                        key={lIdx}
                        to={link.path}
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-900 transition-all group"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapStepperAccordion;
