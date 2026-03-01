
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Book, ShoppingBag, Star, ExternalLink } from 'lucide-react';
import { BOOK_CATEGORIES, CLASSICAL_TEXTS, slugify } from './JyotishBooks';

const JyotishBookSubcategory: React.FC = () => {
  const { categoryId, subcategorySlug } = useParams<{ categoryId: string; subcategorySlug: string }>();

  // Find the subcategory title
  let subcategoryTitle = '';
  let categoryTitle = '';
  
  if (categoryId === 'G') {
    categoryTitle = CLASSICAL_TEXTS.title;
    const item = CLASSICAL_TEXTS.items.find(i => slugify(i) === subcategorySlug);
    subcategoryTitle = item || 'Unknown Subcategory';
  } else {
    const category = BOOK_CATEGORIES.find(c => c.id === categoryId);
    categoryTitle = category?.title || 'Unknown Category';
    const item = category?.items.find(i => slugify(i) === subcategorySlug);
    subcategoryTitle = item || 'Unknown Subcategory';
  }

  // Mock Books Generator (Visual Placeholder)
  const getMockBooks = () => {
    // Deterministic pseudo-random based on slug length
    const count = Math.max(3, (subcategorySlug?.length || 0) % 8); 
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      title: `The Essence of ${subcategoryTitle.split(' ')[0]} Vol. ${i + 1}`,
      author: i % 2 === 0 ? "Dr. B.V. Raman" : "Sanjay Rath",
      description: "A definitive guide exploring the technical nuances and traditional applications of this specific Jyotish branch.",
      rating: 4.5 + (i * 0.1),
      price: "$25.00",
      image: `https://picsum.photos/300/450?random=${subcategorySlug?.length}${i}&grayscale`
    }));
  };

  const books = getMockBooks();

  return (
    <div className="animate-fade-in bg-[#F9F9F7] min-h-screen pb-20">
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/jyotish-books" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-amber-700 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-3 w-3" /> Back to Library
          </Link>
          <div className="max-w-3xl">
            <span className="text-amber-700 font-bold uppercase tracking-widest text-xs mb-2 block">{categoryTitle}</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">{subcategoryTitle}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Recommended reading list for {subcategoryTitle}. These texts have been vetted for technical accuracy and traditional integrity.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
              <div className="aspect-[2/3] bg-gray-100 relative overflow-hidden">
                 <img src={book.image} alt={book.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center shadow-sm">
                   <Star className="w-3 h-3 text-amber-500 mr-1 fill-current" /> {book.rating.toFixed(1)}
                 </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1 leading-tight">{book.title}</h3>
                <p className="text-xs text-amber-700 font-bold uppercase tracking-widest mb-4">{book.author}</p>
                <p className="text-sm text-gray-500 mb-6 line-clamp-3 flex-grow">{book.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="font-bold text-gray-900">{book.price}</span>
                  <button className="text-gray-400 hover:text-amber-700 transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Suggest a book card */}
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]">
            <Book className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="font-serif font-bold text-gray-900 mb-2">Suggest a Title</h3>
            <p className="text-sm text-gray-500 mb-6">Know a great book on {subcategoryTitle}?</p>
            <Link to="/contact" className="px-6 py-2 bg-white border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:border-amber-700 hover:text-amber-700 transition-all">
              Submit Recommendation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JyotishBookSubcategory;
