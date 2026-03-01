
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Map, GraduationCap, Plus, Minus, ArrowRight } from 'lucide-react';
import CTASection from '../components/CTASection';
import { getStartHereBlocks, StartHereBlock } from '../src/admin/startHereStore';

const StartHere: React.FC = () => {
  const [blocks, setBlocks] = useState<StartHereBlock[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    // Filter out unpublished blocks
    const allBlocks = getStartHereBlocks();
    setBlocks(allBlocks.filter(b => b.isPublished));
  }, []);

  const toggleStep = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="animate-fade-in min-h-screen bg-[#F9F9F7]">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Learning Pathway
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8">
            The Astrology Learning Roadmap
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Use this roadmap to learn Jyotish step-by-step. Each step links to the exact blog categories and resources designed to take you from curious beginner to competent practitioner.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500 font-medium">
            <GraduationCap className="h-5 w-5 text-amber-700" />
            <span>New here? Start at Step 1.</span>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-3 mb-12">
            <Map className="h-6 w-6 text-amber-700" />
            <h2 className="text-2xl font-serif font-bold text-gray-900 uppercase tracking-widest text-sm">Navigation Guide</h2>
          </div>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-amber-200 md:left-[23px]" />

            <div className="space-y-6">
              {blocks.map((block, index) => (
                <div key={block.id} className="relative pl-12 md:pl-16">
                  {/* Step Number Circle */}
                  <div 
                    className={`absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center font-bold z-10 transition-colors ${
                      openIndex === index 
                      ? 'bg-amber-700 border-amber-200 text-white' 
                      : 'bg-white border-amber-200 text-amber-700'
                    }`}
                  >
                    {index + 1}
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
                        {block.title}
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
                          {block.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {block.items.filter(i => i.isPublished).map((item) => (
                            <React.Fragment key={item.id}>
                              {item.type === 'external_link' || item.type === 'pdf' ? (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-900 transition-all group"
                                >
                                  {item.title}
                                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                                </a>
                              ) : (
                                <Link
                                  to={item.url}
                                  className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-900 transition-all group"
                                >
                                  {item.title}
                                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                                </Link>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {blocks.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <p>Roadmap content is currently being updated. Please check back shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="pb-24 pt-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-xl text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Not sure where to start?</h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto">
              The path of the seeker is long. Start with Foundations, then move step-by-step. If you want a shortcut to understanding your own chart, book a professional consultation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/blog?category=Foundations"
                className="px-8 py-4 bg-amber-700 text-white font-bold rounded-lg hover:bg-amber-800 transition-all shadow-md"
              >
                Go to Foundations
              </Link>
              <Link
                to="/consultations"
                className="px-8 py-4 border border-amber-700 text-amber-700 font-bold rounded-lg hover:bg-amber-50 transition-all"
              >
                Book Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        title="Deepen your practice."
        description="Our ebooks provide the technical depth missing from mainstream sources."
        primaryCTA={{ text: "Browse Ebooks", link: "/shop" }}
        secondaryCTA={{ text: "About Astrokarak", link: "/about" }}
      />
    </div>
  );
};

export default StartHere;
