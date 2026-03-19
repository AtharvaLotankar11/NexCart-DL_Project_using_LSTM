"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 md:ml-64 overflow-y-auto p-4 md:p-8 bg-[#f9f9fa]">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
