"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Home, PackageSearch, ShoppingBag, User, Menu, ChevronDown, ChevronRight } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: PackageSearch, isDropdown: true },
  { name: 'Your Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/categories/');
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <button 
        className="md:hidden fixed top-4 right-4 z-[60] p-2 bg-white rounded-md shadow-sm border border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-100 w-56 p-3 transition-transform z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        <nav className="flex flex-col gap-2 mt-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.name}>
              {item.isDropdown ? (
                <div>
                  <button 
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer font-bold text-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                    {isProductsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                  
                  {isProductsOpen && (
                    <div className="ml-9 mt-1 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200 ease-out">
                      <Link 
                        href="/products" 
                        className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-emerald-600 py-1.5 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        All Domains
                      </Link>
                      {categories.map((cat) => (
                        <Link 
                          key={cat.id}
                          href={`/products?category=${encodeURIComponent(cat.name)}`}
                          className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-emerald-600 py-1.5 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href={item.href} 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer font-bold text-sm group"
                  onClick={() => setIsOpen(false)}
                >
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
