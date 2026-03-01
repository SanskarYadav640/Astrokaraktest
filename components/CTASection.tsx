
import React from 'react';
import { Link } from 'react-router-dom';

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: { text: string; link: string };
  secondaryCTA?: { text: string; link: string };
}

const CTASection: React.FC<CTASectionProps> = ({ title, description, primaryCTA, secondaryCTA }) => {
  return (
    <section className="bg-amber-50 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">{title}</h2>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={primaryCTA.link}
            className="px-8 py-4 bg-amber-700 text-white font-medium rounded-md hover:bg-amber-800 transition-all shadow-md"
          >
            {primaryCTA.text}
          </Link>
          {secondaryCTA && (
            <Link
              to={secondaryCTA.link}
              className="px-8 py-4 bg-white border border-amber-700 text-amber-700 font-medium rounded-md hover:bg-amber-50 transition-all"
            >
              {secondaryCTA.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
