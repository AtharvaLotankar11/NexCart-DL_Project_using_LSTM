"use client";

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, onOpen }) {
  const { addToCart } = useCart();

  // Handle potential null image and ensure correct URL format with 127.0.0.1 (IPv4)
  // We use 127.0.0.1 instead of localhost for images to avoid IPv6 resolution issues in Next.js
  let imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`)
    : '/placeholder.png';

  // Normalize localhost to 127.0.0.1 if backend sent it as localhost
  imageUrl = imageUrl.replace('localhost', '127.0.0.1');

  return (
    <div 
      onClick={() => onOpen(product)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image 
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Rapid Action Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="p-3 bg-white rounded-2xl shadow-lg text-gray-700 hover:bg-emerald-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
             <Heart className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white rounded-2xl shadow-lg text-gray-700 hover:bg-emerald-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
             <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-gray-500 shadow-sm border border-white/50">
            {product.category?.name || 'General'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-[10px] text-gray-400 font-medium line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Price</span>
            <span className="text-base font-black text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
