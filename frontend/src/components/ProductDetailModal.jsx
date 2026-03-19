"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, Minus, Plus, Star, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import axios from 'axios';

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Track interaction when modal opens
  useEffect(() => {
    if (isOpen && product) {
      axios.post('http://127.0.0.1:8000/api/track-interaction/', {
        product_id: product.id,
        action: 'view'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }).catch(err => {
        // Silently fail if interaction tracking endpoint is not fully ready
        console.warn("Telemetry interaction failed: User likely not authenticated or backend busy.");
      });
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`)
    : '/placeholder.png';

  const normalizedImageUrl = imageUrl.replace('localhost', '127.0.0.1');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Content Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-emerald-900/20 overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col md:flex-row text-[15px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-all active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left: Image Section */}
        <div className="w-full md:w-1/2 relative bg-gray-50 h-[300px] md:h-auto overflow-hidden">
          <Image 
            src={normalizedImageUrl}
            alt={product.name}
            fill
            className="object-cover p-12 transition-transform hover:scale-105 duration-700"
          />
          {/* AI Badge Overlay */}
          <div className="absolute bottom-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-emerald-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">AI Verified Quality</span>
          </div>
        </div>

        {/* Right: Content Section */}
        <div className="w-full md:w-1/2 p-7 md:p-10 overflow-y-auto no-scrollbar">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-100/50">
                {product.category?.name || 'Essential Item'}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                 <div className="flex text-emerald-500">
                    {[1,2,3,4,5].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                 </div>
                 <span>|</span>
                 <span>Highly Rated</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest opacity-30">About Product</h4>
              <p className="text-gray-500 font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price & Quantity */}
            <div className="flex flex-wrap items-end justify-between gap-6 pt-6 border-t border-gray-100">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Premium Price</span>
                <div className="text-3xl font-black text-gray-900 tracking-tighter">
                  ₹{parseFloat(product.price).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-emerald-600 transition-all active:scale-90"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-8 text-center font-black text-lg text-gray-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-emerald-600 transition-all active:scale-90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-900">2 Year Warranty</p>
                    <p className="text-[9px] text-gray-400 font-medium">Certified Protection</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <Truck className="w-6 h-6 text-emerald-500" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-900">Fast Shipping</p>
                    <p className="text-[9px] text-gray-400 font-medium">Safe Local Delivery</p>
                  </div>
               </div>
            </div>

            {/* CTA */}
            <button 
              onClick={handleAddToCart}
              className="group relative w-full py-5 bg-gray-900 text-white rounded-[32px] overflow-hidden hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-gray-900/20 active:scale-[0.98]"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 font-black text-lg">
                <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
                <span>Add to NexCart</span>
              </div>
              <div className="absolute inset-0 bg-emerald-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>

            <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
               Processing and Recommendations Managed by AI
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
