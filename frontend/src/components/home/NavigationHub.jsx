"use client";

import React from 'react';
import Link from 'next/link';
import { Package, TrendingUp, User, Layout, ArrowRightCircle } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function NavigationHub() {
  const cards = [
    {
      title: "The Storefront",
      desc: "AI-Curation with real-time updates.",
      link: "/products",
      icon: <Package className="w-8 h-8" />,
      theme: "bg-emerald-600",
      textColor: "text-white",
      tag: "Live Inventory"
    },
    {
      title: "Orders & Analytics",
      desc: "Track your arrivals and historical trends.",
      link: "/orders",
      icon: <TrendingUp className="w-8 h-8" />,
      theme: "bg-slate-900",
      textColor: "text-white",
      tag: "Secure Hub"
    },
    {
      title: "Smart Profile",
      desc: "Manage your personalized AI settings.",
      link: "/profile",
      icon: <User className="w-8 h-8" />,
      theme: "bg-white border-2 border-slate-100",
      textColor: "text-slate-900",
      tag: "Identity"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 w-full relative">
      {/* HUD Label */}
      <div className="absolute top-0 right-10 flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold tracking-widest uppercase rounded-b-xl border-x border-b border-gray-100/50">
        <Layout className="w-3 h-3 text-emerald-500" />
        <span>Control Center</span>
      </div>

      <ScrollReveal>
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-snug lg:leading-normal">
             Take Control of <span className="text-emerald-600">Your Hub.</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium leading-relaxed">
             Quickly navigate between your personalized store, your history, and your profile.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.15}>
            <Link href={card.link} className="block group">
              <div className={`h-80 p-10 rounded-[3rem] ${card.theme} ${card.textColor} flex flex-col justify-between transition-all duration-500 group-hover:-translate-y-4 shadow-2xl shadow-gray-200/50 group-hover:shadow-[0_45px_70px_-15px_rgba(16,185,129,0.3)] relative overflow-hidden`}>
                
                {/* Background Decoration for Cards */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:scale-150 transition-transform duration-700 bg-white/20 blur-3xl -z-10`} />

                <div className="space-y-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${idx === 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-white/10 text-white'} shadow-inner`}>
                      {card.icon}
                   </div>
                   <span className={`text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full ${idx === 2 ? 'bg-slate-50 text-slate-400' : 'bg-white/10 text-white/50'}`}>
                     {card.tag}
                   </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                     <div>
                        <h3 className="text-3xl font-black tracking-tight">{card.title}</h3>
                        <p className={`text-base font-medium mt-1 ${idx === 2 ? 'text-slate-400' : 'text-white/60'}`}>{card.desc}</p>
                     </div>
                     <ArrowRightCircle className={`w-10 h-10 transition-transform group-hover:rotate-[-45deg] ${idx === 2 ? 'text-emerald-600' : 'text-white'}`} />
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
