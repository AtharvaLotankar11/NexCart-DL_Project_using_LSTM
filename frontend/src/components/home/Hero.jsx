"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-12 w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <ScrollReveal direction="up" distance={30}>
          
          {/* Light Glassmorphic Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-blue-50/80 backdrop-blur-md border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>NexCart AI v2.0 Platform</span>
          </div>
          
          <div className="space-y-6 mb-12">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-gray-900 leading-[1.05]">
               Personalized <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 animate-gradient-x">
                 Intelligence.
               </span>
             </h1>
             
             <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
               Deep learning predictions for a curated shopping experience. 
               Smart curation for the modern identity.
             </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4">
             <Link 
               href="/products" 
               className="group w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-gray-200 hover:bg-blue-600 transform transition-all active:scale-95 flex items-center justify-center gap-3"
             >
               EXPLORE CATALOG
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
             
             <Link 
               href="/login" 
               className="w-full sm:w-auto px-10 py-5 bg-white backdrop-blur-md border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-800 rounded-2xl font-black text-sm tracking-widest transition-all"
             >
               JOIN PLATFORM
             </Link>
          </div>

          {/* Hero Image Integration - Main Section Visual */}
          <div className="relative w-full max-w-4xl mx-auto group">
             <div className="absolute inset-0 bg-blue-500/5 blur-[100px] -z-10 rounded-full" />
             
             <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden border border-gray-100 shadow-2xl shadow-blue-900/10">
                <Image 
                  src="/hero-img.jpg" 
                  alt="NexCart Intelligence Center" 
                  width={1200} 
                  height={675}
                  className="w-full h-auto object-cover transform scale-[1.01] group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
                
                {/* Frosted Glass Overlay Elements on Image */}
                <div className="absolute top-6 right-6 p-4 bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl hidden md:flex items-center gap-4 animate-in slide-in-from-top-4 duration-1000">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-blue-600" />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-gray-500 tracking-wider">PRED-CONFIDENCE</p>
                      <p className="text-xl font-black text-gray-900">99.8%</p>
                   </div>
                </div>

                <div className="absolute bottom-6 left-6 p-4 bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl hidden md:flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                   <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-gray-500 tracking-wider">SECURE LAYER</p>
                      <p className="text-xl font-black text-gray-900">ACTIVE</p>
                   </div>
                </div>
             </div>
          </div>
        </ScrollReveal>
      </div>

    </section>
  );
}
