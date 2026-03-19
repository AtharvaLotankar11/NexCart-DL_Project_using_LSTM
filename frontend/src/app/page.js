"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import NavigationHub from '@/components/home/NavigationHub';

export default function Home() {
  return (
    <div className="flex flex-col space-y-2 pb-10 overflow-hidden bg-white min-h-screen">
      <Hero />
      <Features />
      <NavigationHub />
      
      {/* Subtle Background Articulation */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-50/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
}
