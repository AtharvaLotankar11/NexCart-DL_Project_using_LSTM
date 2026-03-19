"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User as UserIcon, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-16 transition-all">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3 h-full">
          <Link href="/" className="flex items-center h-full">
            <Image 
              src="/icon_logo.png" 
              alt="NexCart Logo" 
              width={240} 
              height={80} 
              className="drop-shadow-sm object-contain h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* User Details & Cart Section */}
        <div className="flex items-center gap-4">
          <Link href="/orders" className="text-xs font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-colors mr-4">
            Orders
          </Link>

          <Link href="/cart" className="relative p-2 text-gray-500 hover:text-emerald-600 transition-colors">
            <ShoppingCart className="w-5 h-5 shadow-sm" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[8px] font-black text-white bg-emerald-600 rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-gray-800">{user.first_name || user.username}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden shadow-sm transition-all group">
                {user.profile?.profile_picture ? (
                   <img 
                     src={user.profile.profile_picture.startsWith('http') ? user.profile.profile_picture : `http://127.0.0.1:8000${user.profile.profile_picture}`} 
                     alt="Avatar" 
                     className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                   />
                ) : (
                   <UserIcon className="w-5 h-5 text-emerald-700" />
                )}
              </div>

              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
            >
              Log In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
