"use client";

import React from 'react';
import { Zap, ShieldCheck, TrendingUp, Sparkles, Brain, Cpu } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function Features() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "LSTM-Powered Curation",
      desc: "Our Long Short-Term Memory neural networks learn your long-term style preferences and short-term trends to curate a unique store just for you.",
      color: "emerald",
      tag: "Deep Learning"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Predictive Analytics",
      desc: "Stay ahead of fashion curves with AI that analyzes millions of web-trends and data points to predict what will be hot next season.",
      color: "blue",
      tag: "Big Data"
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Real-time Personalization",
        desc: "The more you click, the smarter we get. NexCart adjusts your home feed in real-time as you interact with our platform.",
        color: "amber",
        tag: "Edge Computing"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Secure Enterprise Infrastructure",
      desc: "Benefit from bank-grade authentication via Firebase and multi-layered protection for your shopping data and payments.",
      color: "purple",
      tag: "Encryption"
    }
  ];

  return (
    <section className="bg-gray-50/50 py-12 border-y border-gray-100/50 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative SVG Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] -z-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <defs>
               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
               </pattern>
             </defs>
             <rect width="100" height="100" fill="url(#grid)" />
          </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8 space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                <Cpu className="w-3 h-3" />
                <span>The NexCart Engine</span>
             </div>
             <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                Built with <span className="text-emerald-600">Enterprise AI.</span>
             </h2>
             <p className="text-gray-500 max-w-lg mx-auto text-base font-medium leading-relaxed">
                NexCart isn't just a store—it's a smart agent that works for you, 
                leveraging the latest in AI research to maximize your time.
             </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="flex flex-col h-full items-start space-y-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-emerald-100/30 transition-all group duration-500">
                <div className={`p-3 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm ring-1 ring-${feature.color}-100/50`}>
                  {React.cloneElement(feature.icon, { className: 'w-6 h-6' })}
                </div>
                
                <div className="space-y-3">
                  <span className={`text-[9px] font-bold text-${feature.color}-600 tracking-tighter uppercase px-2 py-0.5 rounded-md bg-${feature.color}-50/50`}>
                    {feature.tag}
                  </span>
                  <h3 className="text-base font-black text-gray-900 leading-snug">{feature.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
