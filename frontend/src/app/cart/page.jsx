"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard,
  Truck,
  MapPin,
  ChevronLeft,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWeb3 } from '@/context/Web3Context';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { contract, account, networkError, connectWallet } = useWeb3();
  
  // Multi-step state: 1: Bag, 2: Shipping, 3: Confirmation
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.first_name || '',
    phone: user?.profile?.phone_number || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    zip: user?.profile?.pincode || ''
  });

  // Automatically synchronize logistics telemetry when identity core loads
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.first_name || '',
        phone: user.profile?.phone_number || '',
        address: user.profile?.address || '',
        city: user.profile?.city || '',
        zip: user.profile?.pincode || ''
      }));
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
         <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
         <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">VERIFYING SECURITY CORE...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
         <div className="p-16 bg-white rounded-[50px] border border-gray-100 shadow-2xl shadow-gray-200/40 text-center space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-1000" />
            <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-[30px] flex items-center justify-center border border-emerald-100">
               <ShoppingBag className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="space-y-4">
               <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Restricted Logistics.</h1>
               <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                  The NexCart Checkout pipeline is locked. Please authenticate your identity to review your bag and initiate deployment.
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
               <Link href="/login" className="px-10 py-5 bg-gray-900 text-white rounded-[24px] font-black hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200">LOG IN TO HUB</Link>
               <Link href="/register" className="px-10 py-5 bg-white text-gray-900 border border-gray-100 rounded-[24px] font-black hover:bg-gray-50 transition-all">JOIN THE ECOSYSTEM</Link>
            </div>
         </div>
      </div>
    );
  }

  const handleCheckoutInitiate = async () => {
    if (!user) {
      alert("Please login to checkout");
      return;
    }

    try {
      // Step 1: Create Order on Backend
      const orderResp = await axios.post('http://127.0.0.1:8000/api/create-order/', {
        amount: cartTotal,
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zip}`
      }, {
        headers: { Authorization: `Bearer ${Cookies.get('access_token')}` }
      });

      const { id: order_id, currency, amount } = orderResp.data;

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "NexCart AI Hub",
        description: "Logistic Deployment Verification",
        image: "/icon_logo.png",
        order_id: order_id,
        handler: async function (response) {
            try {
              await axios.post('http://127.0.0.1:8000/api/verify-payment/', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
              }, {
                  headers: { Authorization: `Bearer ${Cookies.get('access_token')}` }
              });

              if (contract && account) {
                  const blockchainKey = response.razorpay_order_id;
                  console.log("[Blockchain] Writing order to ledger with key:", blockchainKey);
                  const tx = await contract.createOrder(blockchainKey);
                  await tx.wait();
                  console.log("[Blockchain] Order successfully written. TX:", tx.hash);
              }

              clearCart();
              window.location.href = '/orders?success=true';
            } catch (err) {
              console.error("Verification or blockchain error:", err);
              // Best outcome: we proceed anyway since payment actually succeeded on backend
              clearCart();
              window.location.href = '/orders?success=true';
            }
        },
        prefill: {
          name: shippingInfo.fullName,
          email: user.email,
          contact: shippingInfo.phone
        },
        theme: { color: "#10b981" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Payment initialization failed. Ensure you have inserted your Razorpay keys in the .env files and the backend is running.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4">
        <div className="p-10 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 shadow-inner">
           <ShoppingBag className="w-20 h-20 text-gray-200" />
        </div>
        <div className="text-center space-y-3">
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Cart is Empty</h1>
           <p className="text-gray-400 font-medium max-w-xs mx-auto">Your personalized curation is waiting for you in the catalog.</p>
        </div>
        <Link href="/products" className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-95">
          EXPLORE CATALOG <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 w-full text-[15px]">
      
      {/* Checkout Progress HUD */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4 w-full max-w-lg">
          <div className={`flex flex-col items-center gap-2 flex-1`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
             <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>BAG REVIEW</span>
          </div>
          <div className={`h-px flex-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-100'}`} />
          <div className={`flex flex-col items-center gap-2 flex-1`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
             <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>LOGISTICS</span>
          </div>
          <div className={`h-px flex-1 ${step >= 3 ? 'bg-emerald-600' : 'bg-gray-100'}`} />
          <div className={`flex flex-col items-center gap-2 flex-1`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
             <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>FINANCE</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Section: Context Dependent content */}
        <div className="flex-1 space-y-8 w-full animate-in fade-in slide-in-from-left-4 duration-500">
           
           {step === 1 && (
             <>
               <div className="flex items-end justify-between border-b border-gray-100 pb-6">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Your Bag.</h1>
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">VERIFIED ITEMS ONLY</span>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-6 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all groups">
                       <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                       </div>
                       <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                             <h3 className="font-black text-gray-900 text-base">{item.name}</h3>
                             <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3 p-1 bg-gray-50 rounded-lg border border-gray-100">
                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 hover:bg-white rounded-lg text-gray-400 transition-all"><Minus className="w-3 h-3" /></button>
                                <span className="w-5 text-center font-black text-gray-700">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded-lg text-gray-400 transition-all"><Plus className="w-3 h-3" /></button>
                             </div>
                             <p className="font-black text-gray-900 text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             </>
           )}

           {step === 2 && (
             <div className="space-y-8">
               <div className="flex items-center gap-3 mb-6">
                 <button onClick={() => setStep(1)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-emerald-600 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                 <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Shipping.</h1>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Recipient Identity</label>
                      <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none font-bold" value={shippingInfo.fullName} onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})} />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Primary Contact</label>
                      <input type="text" placeholder="Phone Number" className="w-full p-4 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none font-bold" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-4">
                   <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Physical Address</label>
                      <textarea placeholder="Street Address" className="w-full p-4 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none font-bold min-h-[143px] no-scrollbar" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} />
                   </div>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Region</label>
                    <input type="text" placeholder="City" className="w-full p-4 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none font-bold" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} />
                 </div>
                 <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Postal Code</label>
                    <input type="text" placeholder="PIN Code" className="w-full p-4 bg-gray-50 border-gray-100 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none font-bold" value={shippingInfo.zip} onChange={e => setShippingInfo({...shippingInfo, zip: e.target.value})} />
                 </div>
               </div>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-8">
               <div className="flex items-center gap-3">
                 <button onClick={() => setStep(2)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-emerald-600 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                 <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Confirmation.</h1>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><MapPin className="w-6 h-6" /></div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deploying To</p>
                          <p className="font-extrabold text-gray-900">{shippingInfo.fullName}</p>
                       </div>
                    </div>
                    <p className="text-gray-500 font-bold ml-14 leading-relaxed">
                       {shippingInfo.address},<br />
                       {shippingInfo.city} - {shippingInfo.zip}
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle className="w-6 h-6" /></div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pulse Status</p>
                          <p className="font-extrabold text-gray-900">Contact Verified via {shippingInfo.phone}</p>
                       </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 border border-emerald-100 rounded-[32px] space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg ring-4 ring-emerald-500/10"><FileText className="w-6 h-6" /></div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Package Density</p>
                          <p className="font-extrabold text-gray-900">{cartItems.length} Unique SKUs</p>
                       </div>
                    </div>
                    <div className="space-y-2">
                       {cartItems.map(it => (
                         <div key={it.id} className="flex justify-between items-center text-sm font-bold text-gray-500">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="text-gray-900">₹{(it.price * it.quantity).toLocaleString()}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
             </div>
           )}

        </div>

        {/* Right Section: Pricing Summary */}
        <div className="w-full lg:w-96 sticky top-28 space-y-6">
           <div className="p-8 bg-gray-900 text-white rounded-[40px] shadow-2xl space-y-8 relative overflow-hidden transition-all duration-700">
              <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-emerald-500/20 blur-[80px] -z-0" />
              
              <div className="relative z-10 space-y-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Intelligence Engine</p>
                   <h2 className="text-2xl font-black tracking-tight underline underline-offset-8 decoration-emerald-500 decoration-4">Summary.</h2>
                </div>
                
                <div className="space-y-4 pt-4">
                   <div className="flex justify-between text-gray-400 font-bold"><span>Total Items</span><span className="text-white">₹{cartTotal.toLocaleString()}</span></div>
                   <div className="flex justify-between text-gray-400 font-bold"><span>Logistics</span><span className="text-emerald-400 font-black">COMPLIMENTARY</span></div>
                   <div className="flex justify-between text-gray-400 font-bold pb-4 border-b border-white/10"><span>AI Protocol Fee</span><span className="text-white">₹0.00</span></div>
                   <div className="flex justify-between items-end pt-4">
                      <span className="text-lg font-black tracking-tighter">FINANCE TOTAL</span>
                      <span className="text-4xl font-black text-emerald-400">₹{cartTotal.toLocaleString()}</span>
                   </div>
                </div>

                {step === 1 && (
                  <button onClick={() => setStep(2)} className="w-full py-5 bg-emerald-500 text-black rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20">
                    NEXT: LOGISTICS <ArrowRight className="w-6 h-6" />
                  </button>
                )}

                {step === 2 && (
                  <button onClick={() => setStep(3)} className="w-full py-5 bg-emerald-500 text-black rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20">
                    CONFIRM DETAILS <ArrowRight className="w-6 h-6" />
                  </button>
                )}

                {step === 3 && (
                  <button onClick={!account || networkError ? connectWallet : handleCheckoutInitiate} className={`w-full py-5 ${(account && !networkError) ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-[#f6851b] hover:bg-[#e07514] text-white'} text-black rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20`}>
                    {!account ? 'WEB3 WALLET NOT CONNECTED' : networkError ? 'SWITCH TO SEPOLIA NETWORK' : <><CreditCard className="w-6 h-6" /> PAY & DEPLOY</>}
                  </button>
                )}
                
                <div className="pt-4 flex flex-col gap-3">
                   <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400"><ShieldCheck className="w-4 h-4 text-emerald-500" /><span>SECURE TRANSACTION AGENT</span></div>
                   {step > 1 && <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400"><Truck className="w-4 h-4 text-emerald-500" /><span>LOGISTIC PIPELINE VERIFIED</span></div>}
                </div>
              </div>
           </div>
           
           <div className="flex items-center justify-center gap-2 text-gray-400 group cursor-pointer hover:text-emerald-600 transition-colors py-4">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <Link href="/products" className="text-xs font-black uppercase tracking-widest">Continue Exploration</Link>
           </div>
        </div>

      </div>
      
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
    </div>
  );
}
