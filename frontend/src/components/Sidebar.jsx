"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, PackageSearch, ShoppingBag, User, Menu } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: PackageSearch },
  { name: 'Your Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link key={item.name} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer font-bold text-sm group">
                <item.icon className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                <span>{item.name}</span>
            </Link>
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
