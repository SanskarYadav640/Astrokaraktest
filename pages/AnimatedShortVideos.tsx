
import React from 'react';
import { Play, ArrowLeft, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimatedShortVideos: React.FC = () => {
  const reels = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    title: `Visualizing ${['Shani', 'Rahu', 'Guru', 'Ketu', 'Mangal', 'Budh', 'Shukra', 'Surya'][i % 8]} Placement ${Math.floor(i / 8) + 1}`,
    image: `https://picsum.photos/450/800?random=${i + 300}&sig=reels`
  }));

  return (
    <div className="animate-fade-in min-h-screen bg-[#0A0A0A] text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <Link to="/blog" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-3 w-3" /> Back to Research
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Animated Short Videos</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Technical Jyotish concepts brought to life through visual motion. Explore the mechanics of the sidereal sky in high-definition 9:16 format.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {reels.map((reel) => (
            <div key={reel.id} className="group flex flex-col bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-amber-700/50 transition-all duration-300">
              <div className="relative aspect-[9/16] overflow-hidden bg-gray-900">
                <img 
                  src={reel.image} 
                  alt={reel.title} 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                {/* Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-80 group-hover:opacity-100 group-hover:bg-amber-700/80 transition-all">
                    <Play className="h-8 w-8 text-white fill-current" />
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-2 border border-white/10">
                  <Radio className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Animated</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-sm leading-tight text-gray-200 group-hover:text-white">
                  {reel.title}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">9:16 HD Production</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-[#151515] rounded-3xl border border-white/5 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Want the source research?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Each of these animations is based on a deep technical research paper available in our shop or blog archives.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all">
              Visit Shop
            </Link>
            <Link to="/courses" className="px-8 py-3 border border-gray-700 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/5 transition-all">
              Join Academy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedShortVideos;
