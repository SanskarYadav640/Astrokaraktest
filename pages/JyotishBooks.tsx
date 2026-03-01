
import React from 'react';
import { Book, Library, ChevronRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export const BOOK_CATEGORIES = [
  {
    id: 'A',
    title: "Beginner and Core Learning",
    description: "The fundamental grammar of Vedic Astrology.",
    items: [
      "Foundations",
      "Core chart interpretation (D1 reading method)",
      "Graha books (planets)",
      "Bhāva books (houses)",
      "Rāśi books (signs)",
      "Nakshatra books",
      "Yogas and combinations"
    ]
  },
  {
    id: 'B',
    title: "Timing and Forecasting",
    description: "Systems for predicting when events will manifest.",
    items: [
      "Daśā systems",
      "Transits (Gocara)",
      "Varga charts (D9, D10, etc.)",
      "Strength and validation (Shadbala, Ashtakavarga, avasthas)"
    ]
  },
  {
    id: 'C',
    title: "Perception Frameworks",
    description: "How the world perceives the native versus reality.",
    items: [
      "Arudha and perception layer"
    ]
  },
  {
    id: 'D',
    title: "Major Systems & Branches",
    description: "Specialized methodologies within the Vedic tradition.",
    items: [
      "Jaimini system",
      "Prashna (horary)",
      "Muhurta (elections)",
      "Panchanga, tithi, vratas"
    ]
  },
  {
    id: 'E',
    title: "Application Specializations",
    description: "Applying technical Jyotish to specific life areas.",
    items: [
      "Marriage and relationships",
      "Career, money, business",
      "Health and medical Jyotish",
      "Remedies, ethics, spiritual practice"
    ]
  },
  {
    id: 'F',
    title: "Evidence & Learning Style",
    description: "Reference materials and empirical studies.",
    items: [
      "Case studies and chart collections",
      "Dictionaries, glossaries, quick reference handbooks"
    ]
  }
];

export const CLASSICAL_TEXTS = {
  title: "Classical Texts (Library)",
  description: "The source material of all Jyotish vidya.",
  items: [
    "Core Hora and Jataka treatises",
    "Samhita and mundane astrology",
    "Muhurta and Panchanga classics",
    "Prashna classics",
    "Jaimini sutras and classical Jaimini commentaries",
    "Nadi literature",
    "Tajika / Varshaphal texts",
    "Bhashya and Teeka (commentaries)"
  ]
};

const JyotishBooks: React.FC = () => {
  return (
    <div className="animate-fade-in bg-[#F9F9F7] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Library className="h-4 w-4 mr-2" />
            Curated Bibliography
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Jyotish Books</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            A comprehensive categorization of essential reading for the serious student. From foundational grammar to classical Sanskrit treatises.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 space-y-16">
        
        {/* Main Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BOOK_CATEGORIES.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700 font-bold text-sm">
                  {cat.id}
                </div>
                <h2 className="font-serif font-bold text-xl text-gray-900">{cat.title}</h2>
              </div>
              <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest font-bold">
                {cat.description}
              </p>
              <ul className="space-y-3">
                {cat.items.map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      to={`/jyotish-books/${cat.id}/${slugify(item)}`}
                      className="flex items-start text-sm text-gray-700 group-hover:text-amber-700 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-amber-300 mr-2 shrink-0 mt-0.5 group-hover:text-amber-700 transition-colors" />
                      <span>{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Classical Texts Section (G) */}
        <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-700/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/20">
                <Bookmark className="h-3 w-3 mr-2" />
                Category G
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{CLASSICAL_TEXTS.title}</h2>
              <p className="text-gray-400 text-lg mb-8">
                {CLASSICAL_TEXTS.description} We recommend starting with Brihat Parashara Hora Shastra (BPHS) before diverging into Jaimini or Nadi systems.
              </p>
              <Link to="/start-here" className="inline-flex items-center text-amber-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
                View Learning Roadmap <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CLASSICAL_TEXTS.items.map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group">
                  <Link to={`/jyotish-books/G/${slugify(item)}`} className="flex items-start">
                    <Book className="h-4 w-4 text-amber-700 mr-3 shrink-0 mt-0.5 group-hover:text-amber-500 transition-colors" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{item}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JyotishBooks;
