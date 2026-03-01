
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-16 md:pt-24">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8">Astrokarak.</h1>
        <p className="text-2xl text-amber-700 font-serif italic mb-12">"Grounded intelligence for an ancient science."</p>
        
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p>
            Vedic astrology (Jyotish) is often surrounded by mysticism that obscures its technical brilliance. 
            Astrokarak was founded to change that. Our mission is to provide clear, logical, and technically rigorous astrology education.
          </p>
          <p>
            We don't sell gemstones, we don't make vague promises of overnight luck, and we don't use fear-based predictions. 
            We believe that understanding your birth chart is about understanding the fundamental architecture of your psychology and the timing of your growth.
          </p>
          
          <div className="my-16 py-12 border-y border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">Our Methodology</h3>
              <p className="text-sm">We utilize the Sidereal zodiac with Lahiri ayanamsa. Our interpretations are primarily derived from the BPHS and Jaimini Sutras, adapted for modern contexts without losing traditional integrity.</p>
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">Our Promise</h3>
              <p className="text-sm">Direct answers. No fluff. Technical explanations. We want you to understand *how* we arrived at an observation, giving you the power to learn for yourself.</p>
            </div>
          </div>

          <h3 className="text-3xl font-serif font-bold text-gray-900 mt-20 mb-8">Who we are.</h3>
          <p>
            A collective of researchers, students, and practitioners dedicated to the preservation and technical advancement of Vedic astrology. 
            Our lead educators have over 15 years of experience in chart analysis and technical Sanskrit literature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
