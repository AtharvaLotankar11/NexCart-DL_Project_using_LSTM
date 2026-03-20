"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShieldAlert, Search, Filter, ShoppingBag, Loader2, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import ScrollReveal from '@/components/ScrollReveal';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

import { Suspense } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(50000); 
  const { addToCart } = useCart(); 

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/products/'),
          axios.get('http://127.0.0.1:8000/api/categories/')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to load ecosystem data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryScrollRef = React.useRef(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const { scrollLeft, clientWidth } = categoryScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      categoryScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
         <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
         <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">VERIFYING SECURITY CORE...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-700">
         <div className="p-16 bg-white rounded-[50px] border border-gray-100 shadow-2xl shadow-gray-200/40 text-center space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-1000" />
            <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-[30px] flex items-center justify-center border border-emerald-100">
               <ShieldAlert className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="space-y-4">
               <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Secure Access Required.</h1>
               <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                  The NexCart AI catalog is reserved for authenticated workspace identities. Please authorize your session to continue.
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
               <Link href="/login" className="px-10 py-5 bg-gray-900 text-white rounded-[24px] font-black hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200">HUB AUTHORIZATION</Link>
               <Link href="/register" className="px-10 py-5 bg-white text-gray-900 border border-gray-100 rounded-[24px] font-black hover:bg-gray-50 transition-all">JOIN ECOSYSTEM</Link>
            </div>
         </div>
      </div>
    );
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col space-y-8 pb-16 max-w-7xl mx-auto w-full">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-4">
        <ScrollReveal direction="left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100/50">
               <Sparkles className="w-3 h-3" />
               <span>AI-Powered Catalog</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
               Explore Our <br />
               <span className="text-emerald-600">Premium Range.</span>
            </h1>
          </div>
        </ScrollReveal>

        <div className="w-full lg:max-w-md space-y-4">
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
             </div>
             <input 
               type="text"
               placeholder="Search by name or category..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder:text-gray-400 font-medium"
             />
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery('')}
                 className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600"
               >
                 <X className="h-4 w-4" />
               </button>
             )}
          </div>
          <p className="text-xs text-gray-400 font-medium px-2">
             Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> curated products 
             {selectedCategory !== 'All' && <span> in <span className="text-emerald-600 font-black">{selectedCategory}</span></span>}
          </p>
        </div>
      </section>

      <section className="relative px-4 group">
        <div className="flex items-center justify-between mb-4 md:hidden">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Filter Catalog</p>
           <div className="flex gap-2">
              <button onClick={() => scrollCategories('left')} className="p-2 bg-gray-50 rounded-lg text-gray-400 transition-all active:scale-90"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => scrollCategories('right')} className="p-2 bg-gray-50 rounded-lg text-gray-400 transition-all active:scale-90"><ChevronRight className="w-4 h-4" /></button>
           </div>
        </div>
        
        <div 
          ref={categoryScrollRef}
          className="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-3"
        >
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${selectedCategory === 'All' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-100 text-gray-500 hover:border-emerald-300'}`}
        >
          All Domains
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${selectedCategory === cat.name ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-100 text-gray-500 hover:border-emerald-300'}`}
          >
            {cat.name}
          </button>
        ))}
        </div>
      </section>

      <section className="px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-40">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <p className="font-bold text-emerald-900 uppercase tracking-widest text-[10px]">Initializing AI Catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8">
            {filteredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={idx % 4 * 0.1}>
                 <ProductCard 
                   product={product} 
                   onOpen={(p) => {
                     setSelectedProduct(p);
                     setIsModalOpen(true);
                   }} 
                 />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
             <div className="p-8 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                <ShoppingBag className="w-16 h-16 text-gray-200" />
             </div>
             <div className="text-center">
                <h3 className="text-2xl font-black text-gray-700">No matches found</h3>
                <p className="text-gray-400 max-w-xs mx-auto mt-2 font-medium">We couldn't find any products matching your current criteria.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                  className="mt-6 text-emerald-600 font-bold hover:underline underline-offset-4"
                >
                  Reset All Filters
                </button>
             </div>
          </div>
        )}
      </section>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-96 bg-emerald-50/20 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />

      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
       <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
         <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
       </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
