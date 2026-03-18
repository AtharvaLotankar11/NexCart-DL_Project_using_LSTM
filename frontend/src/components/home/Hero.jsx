"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-between pt-16 pb-20 px-4 max-w-7xl mx-auto w-full gap-16 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10" />

      <div className="flex-1 space-y-10 text-center lg:text-left z-10">
        <ScrollReveal direction="left">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-700 text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>NexCart AI v2.0 is Here</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-gray-900 leading-[1.05]">
            Smarter Shopping, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Personalized for You.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mt-8 leading-relaxed font-medium">
            Discover a shopping experience that predicts your style using deep learning. 
            No more endless searching—just perfectly curated choices.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-12">
            <Link 
              href="/products" 
              className="group relative px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold shadow-2xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Explore Catalog</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            
            <Link 
              href="/login" 
              className="px-10 py-5 bg-white/50 backdrop-blur-md border border-gray-200 hover:border-emerald-600 hover:bg-white text-gray-800 hover:text-emerald-700 rounded-2xl font-bold transition-all shadow-xl shadow-gray-100/50"
            >
              Create Account
            </Link>
          </div>

          {/* Social Proof Placeholder */}
          <div className="hidden md:flex items-center gap-4 mt-16 pt-8 border-t border-gray-100">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold">
                  JS
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Join <span className="text-gray-900 font-bold">2,000+</span> shoppers using AI today.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="flex-1 relative w-full aspect-square max-w-[600px] lg:max-w-none group">
        <ScrollReveal direction="right" delay={0.2}>
          <div className="relative w-full h-full perspective-1000 animate-hero-float">
            {/* Glossy Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 to-white rounded-[4rem] -rotate-6 transform scale-95 blur-sm border border-emerald-50/50 group-hover:rotate-0 transition-transform duration-700" />
            
            <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
              <Image 
                src="/hero-product.png"
                alt="Smart AI Product"
                fill
                className="object-contain drop-shadow-[0_35px_35px_rgba(16,185,129,0.15)] filter saturate-[1.1]"
                priority
              />
            </div>

            {/* AI HUD Decorations */}
            <div className="absolute -top-10 -right-10 p-4 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl animate-bounce duration-[3000ms]">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                     <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">PRED-CONFIDENCE</p>
                    <p className="text-lg font-black text-gray-900 leading-none">99.8%</p>
                  </div>
               </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
