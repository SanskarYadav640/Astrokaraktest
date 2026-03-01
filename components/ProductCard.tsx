
import React from 'react';
import { ShoppingCart, Calendar } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md h-full flex flex-col relative">
      {product.isUpcoming && (
        <div className="absolute top-2 right-2 z-20 bg-amber-700 text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-lg">
          Upcoming
        </div>
      )}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-amber-800 transition-colors leading-tight min-h-[2.5rem] line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center mt-1">
            <span className="text-amber-700 font-bold text-sm">{product.price}</span>
          </div>
        </div>
        <p className="text-gray-500 text-[11px] mb-4 leading-relaxed flex-grow line-clamp-3">
          {product.description}
        </p>
        <button 
          className={`w-full flex items-center justify-center space-x-1.5 py-2 border rounded transition-all text-[10px] font-bold uppercase tracking-widest ${
            product.isUpcoming 
            ? 'border-gray-200 text-gray-400 hover:bg-gray-50' 
            : 'border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white'
          }`}
        >
          {product.isUpcoming ? (
            <>
              <Calendar className="h-3 w-3" />
              <span>Waitlist</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3 w-3" />
              <span>Access</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
