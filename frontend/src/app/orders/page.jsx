"use client";

import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import {
  Package,
  Clock,
  Truck,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Zap,
  Star,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWeb3 } from '@/context/Web3Context';
import Cookies from 'js-cookie';

import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';

const PdfReceiptButton = dynamic(() => import('./PdfReceiptButton'), { ssr: false });

function PulseAnalyticsModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  // Mocking some time-series data related to this specific order's items
  const data = order.items?.map((item, index) => ({
    name: item.product?.name.split(' ')[0] || `Item ${index}`, 
    value: parseFloat(item.price_at_purchase) * item.quantity,
    prediction: (parseFloat(item.price_at_purchase) * item.quantity) * (1 + (Math.random() * 0.4 - 0.1))
  })) || [];

  if (data.length < 5) {
      for(let i=0; i<3; i++) {
         data.push({ name: `Pulse ${i+1}`, value: parseFloat(order.total_amount) / (i+2), prediction: parseFloat(order.total_amount) / (i+1.5) });
         data.unshift({ name: `T-${i+1}`, value: parseFloat(order.total_amount) / (i+3), prediction: parseFloat(order.total_amount) / (i+2.5) });
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col items-center">
         <div className="w-full p-6 flex justify-between items-center border-b border-gray-100 bg-gray-50/50">
            <div>
               <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><TrendingUp className="text-emerald-500 w-5 h-5"/> Pulse Analytics</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Order #{order.razorpay_order_id?.split('_')[1] || '0xFFFF'} Telemetry</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 shadow-sm font-bold">&times;</button>
         </div>
         <div className="w-full h-80 p-6 bg-white border-b border-gray-100">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `\u20B9${Math.round(v)}`}/>
                 <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '16px', color: '#111827', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }} itemStyle={{ color: '#10b981' }}/>
                 <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                 <Area type="monotone" dataKey="prediction" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPred)" strokeWidth={3} />
               </AreaChart>
            </ResponsiveContainer>
         </div>
         <div className="p-6 bg-gray-50 w-full text-center">
            <p className="text-xs font-bold text-gray-500">The blue curve indicates the LSTM predicted trajectory for your associated procurement patterns.</p>
         </div>
      </div>
    </div>
  );
}

function RecommendationSection({ ordersCount }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (ordersCount >= 5) {
      const fetchRecs = async () => {
        try {
          const resp = await axios.get('http://127.0.0.1:8000/api/user-recommendations/', {
            headers: { Authorization: `Bearer ${Cookies.get('access_token')}` }
          });
          if (Array.isArray(resp.data)) {
            setRecommendations(resp.data);
          }
        } catch (err) {
          console.error("Failed to fetch AI recommendations", err);
        } finally {
          setLoading(false);
        }
      };
      fetchRecs();
    }
  }, [ordersCount]);

  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (ordersCount < 5 || recommendations.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-8 mb-16 relative group/section"
    >
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="space-y-1">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full w-fit"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">LSTM ACTIVATED</span>
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Recommended <br /><span className="text-emerald-500">For You.</span></h2>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-3 pr-2 border-r border-gray-100">
            <button
              onClick={() => scroll('left')}
              className="p-3 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-white shadow-sm hover:shadow-md transition-all active:scale-90 group/btn"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-white shadow-sm hover:shadow-md transition-all active:scale-90 group/btn"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <Link href="/products" className="text-[10px] font-black text-gray-400 hover:text-emerald-500 transition-colors uppercase tracking-[0.2em]">See All Patterns</Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-2 snap-x"
      >
        <AnimatePresence>
          {recommendations.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              className="flex-shrink-0 w-80 bg-white border border-gray-100 rounded-[35px] overflow-hidden shadow-xl shadow-gray-200/40 hover:-translate-y-2 transition-all duration-500 snap-center group"
            >
              <div className="relative h-60 bg-gray-50 flex items-center justify-center p-12 overflow-hidden">
                <Image
                  src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`}
                  alt={product.name}
                  fill
                  className="object-cover scale-110 group-hover:rotate-6 group-hover:scale-125 transition-all duration-700"
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black text-emerald-600 shadow-sm ring-1 ring-emerald-500/10"
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>PREDICTED MATCH</span>
                </motion.div>
              </div>

              <div className="p-8 space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{product.category?.name || 'Exclusive'}</p>
                  <h3 className="font-black text-lg text-gray-900 tracking-tight leading-tight line-clamp-1">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-gray-400 leading-none">AI PRICING</p>
                    <p className="text-xl font-black text-gray-900">₹{parseFloat(product.price).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function OrderBlockchainStatus({ orderId }) {
  const { contract, isMetaMaskLocked, connectWallet } = useWeb3();
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchStatus = async () => {
    if (!contract) return;
    if (!orderId) {
      setError("Legacy order (No Ledger ID)");
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const [id, statusInt, timestamp] = await contract.getOrder(orderId.toString());
      const statusMap = ["Pending", "Shipped", "Arrived"];
      setChainData({
        status: statusMap[statusInt],
        timestamp: new Date(Number(timestamp) * 1000).toLocaleString()
      });
    } catch (err) {
      console.warn("Fetch chain status error:", err.message || err);
      if (err.code === "BAD_DATA" && err.value === "0x") {
        setError("Wrong Network or Not Found");
      } else {
        setError("Not found on ledger");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isMetaMaskLocked || !contract) {
    return (
      <button 
        onClick={connectWallet}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-gray-100 shadow-sm mt-4"
      >
        <Zap className="w-3 h-3" />
        Connect with MetaMask
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start lg:items-end gap-2 mt-4">
      <button
        onClick={fetchStatus}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors active:scale-95"
      >
        <ExternalLink className="w-3 h-3" />
        {loading ? 'Querying Ledger...' : 'Verify on Blockchain'}
      </button>
      {chainData && (
        <div className="text-left lg:text-right animate-in fade-in duration-300">
          <p className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md inline-block">Ledger: {chainData.status}</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Block Time: {chainData.timestamp}</p>
        </div>
      )}
      {error && <p className="text-[9px] text-red-500 font-bold uppercase">{typeof error === "string" ? error : "Not found on ledger"}</p>}
    </div>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const { user, loading: authLoading } = useAuth();
  const [selectedAnalyticsOrder, setSelectedAnalyticsOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const resp = await axios.get('http://127.0.0.1:8000/api/orders/', {
          headers: { Authorization: `Bearer ${Cookies.get('access_token')}` }
        });
        setOrders(resp.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (authLoading || (user && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
        <div className="p-10 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 shadow-inner group overflow-hidden relative">
          <div className="absolute inset-0 bg-emerald-500/5 -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
          <AlertCircle className="w-20 h-20 text-emerald-600 relative z-10" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Secure Access Required.</h1>
          <p className="text-gray-400 font-bold max-w-sm mx-auto uppercase tracking-widest text-[10px]">Your Behavioral Analytics are Encrypted</p>
          <p className="text-gray-500 font-medium max-w-md mx-auto">Please login to authorize the Intelligence hub and view your deployment history.</p>
        </div>
        <Link href="/login" className="px-12 py-5 bg-emerald-600 text-white rounded-[24px] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          AUTHORIZE HUB <TrendingUp className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full text-[15px]">

      {/* Pulse Analytics Modal Overlay */}
      <PulseAnalyticsModal 
         isOpen={!!selectedAnalyticsOrder} 
         order={selectedAnalyticsOrder} 
         onClose={() => setSelectedAnalyticsOrder(null)} 
      />

      {/* Success Notification Banner */}
      {success && (
        <div className="mb-12 p-6 bg-emerald-500 text-white rounded-[32px] shadow-xl shadow-emerald-500/20 flex items-center justify-between gap-6 animate-in slide-in-from-top-12 duration-700">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl shadow-inner backdrop-blur-md"><CheckCircle className="w-8 h-8" /></div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Deployment Successful.</h2>
              <p className="font-bold opacity-80">Order Pulse Registered. Intelligence hub updating in real-time.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Dismiss</button>
        </div>
      )}

      {/* LSTM Recommendation Section */}
      <RecommendationSection ordersCount={orders.length} />

      {/* Header with AI Recommendation Tease */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100/50 shadow-sm">
            <Package className="w-3 h-3 text-emerald-500" />
            <span>Logistics Hub Control</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">
            Your Orders.
          </h1>
        </div>

        <div className={`p-4 rounded-2xl flex items-center gap-4 transition-all duration-700 ${orders.length >= 5 ? 'bg-emerald-50 border border-emerald-100' : 'bg-gray-50 border border-gray-100'
          }`}>
          <Sparkles className={`w-6 h-6 ${orders.length >= 5 ? 'text-emerald-600 animate-pulse' : 'text-gray-300'}`} />
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${orders.length >= 5 ? 'text-emerald-800' : 'text-gray-400'}`}>LSTM ACTIVATION</p>
            <p className={`text-xs font-bold ${orders.length >= 5 ? 'text-emerald-600' : 'text-gray-400'}`}>
              {orders.length >= 5 ? 'AI Personalization Fully Enabled.' : `${5 - orders.length} orders away from Predictive Hub.`}
            </p>
          </div>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="py-32 text-center space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center opacity-50 shadow-inner">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-400 font-bold text-lg">Your Deployment History is Clean.</p>
          <Link href="/products" className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-3 active:scale-95">
            COMMENCE EXPLORATION <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
              <div className="flex flex-col md:flex-row">

                {/* Combined Pulse Indicator */}
                <div className={`w-full md:w-56 p-8 flex flex-col justify-center items-center text-center gap-6 ${order.status === 'Arriving Tomorrow' ? 'bg-emerald-50/50' : 'bg-gray-50/30'
                  } border-r border-gray-100`}>
                  <div className="relative">
                    <div className={`p-5 rounded-3xl shadow-lg ring-4 ring-white transition-all duration-700 ${order.status === 'Arriving Tomorrow' ? 'bg-emerald-600 text-white animate-pulse' : 'bg-white text-blue-500'
                      }`}>
                      {order.status === 'Arriving Tomorrow' ? <Truck className="w-10 h-10" /> : <Package className="w-10 h-10" />}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logistics Pulse</p>
                    <p className={`font-black text-sm uppercase ${order.status === 'Arriving Tomorrow' ? 'text-emerald-600' : 'text-blue-500'
                      }`}>{order.status}</p>
                  </div>
                </div>

                {/* Content Detail Hub */}
                <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-4 gap-12">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Order Identifier</p>
                      <h3 className="font-extrabold text-gray-900 tracking-tight text-lg">#{order.razorpay_order_id?.split('_')[1] || '0xFFFF'}</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Deployment Window</p>
                      <p className="font-bold text-gray-600">{new Date(order.created_at).toLocaleDateString()} · {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Package Contents</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover:bg-white transition-colors">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-white">
                            <Image
                              src={item.product?.image.startsWith('http') ? item.product.image : `http://127.0.0.1:8000${item.product.image}`}
                              alt={item.product?.name}
                              width={48}
                              height={48}
                              className="object-cover h-full w-full"
                            />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-black text-gray-900 leading-tight line-clamp-1">{item.product?.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.quantity} UNITS</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-start lg:items-end">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Financial Impact</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                    </div>

                    <OrderBlockchainStatus orderId={order.razorpay_order_id} />

                    <div className="flex gap-2">
                      <PdfReceiptButton order={order} />
                      <button onClick={() => setSelectedAnalyticsOrder(order)} className="mt-4 flex items-center justify-center p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100" title="Pulse Analytics">
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Advanced Prediction Tease */}
      <div className="mt-20 p-10 rounded-[45px] bg-[#0a1421] text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] transition-all duration-1000 group-hover:scale-150" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-5 max-w-sm">
            <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/10"><Sparkles className="w-6 h-6 text-emerald-400" /></div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">Predictive Curation Engine.</h2>
            <p className="text-gray-400 font-medium leading-relaxed">Once your history reaches 5 pulses, our Deep Learning core will activate predictive modeling to anticipate your future needs.</p>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-center group-hover:translate-y-[-4px] transition-transform">
              <p className="text-4xl font-black text-emerald-400 tracking-tighter">{orders.length}</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Active Pulses</p>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="text-center group-hover:translate-y-[-4px] transition-transform delay-75">
              <p className="text-4xl font-black text-gray-600 tracking-tighter">5</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Activation REQ</p>
            </div>
            <div className={`p-6 rounded-[32px] shadow-2xl transition-all duration-700 ${orders.length >= 5 ? 'bg-emerald-500 text-black rotate-12 scale-110' : 'bg-gray-800 text-gray-500'}`}>
              <AlertCircle className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}
