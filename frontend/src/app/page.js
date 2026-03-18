"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Package, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import NavigationHub from '@/components/home/NavigationHub';

export default function Home() {
  return (
    <div className="flex flex-col space-y-32 pb-32 overflow-hidden bg-[#f9f9fa]">
      <Hero />
      <Features />
      <NavigationHub />
      
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-96 bg-emerald-50/20 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
}
