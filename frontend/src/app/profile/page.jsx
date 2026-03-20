"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  TrendingUp, 
  PieChart as PieIcon, 
  LogOut, 
  Trash2, 
  AlertTriangle,
  Save,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { useWeb3 } from '@/context/Web3Context';
import axios from 'axios';
import Cookies from 'js-cookie';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ProfilePage() {
  const { user, logout, fetchUser } = useAuth();
  const { account, connectWallet, disconnectWallet, networkError } = useWeb3();
  const [analytics, setAnalytics] = useState({ timeline: [], categories: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    phone_number: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        phone_number: user.profile?.phone_number || '',
        address: user.profile?.address || '',
        city: user.profile?.city || '',
        pincode: user.profile?.pincode || ''
      });
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/user-analytics/', {
        headers: { Authorization: `Bearer ${Cookies.get('access_token')}` }
      });
      setAnalytics(resp.data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('phone_number', formData.phone_number);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('pincode', formData.pincode);
      if (profileImage) {
        data.append('profile_picture', profileImage);
      }

      await axios.patch('http://127.0.0.1:8000/api/auth/me/', data, {
        headers: { 
          Authorization: `Bearer ${Cookies.get('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsEditing(false);
      fetchUser();
      alert("Profile intelligence updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Update failed. " + (err.response?.data?.error || "Please check your inputs."));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE PERMANENTLY') return;
    try {
      await axios.delete('http://127.0.0.1:8000/api/auth/me/', {
        headers: { Authorization: `Bearer ${Cookies.get('access_token')}` }
      });
      logout();
      window.location.href = '/login';
    } catch (err) {
      alert("Account deletion failed.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
         <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
         <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Initializing Identity Core...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      
      {/* Header Profile Section */}
      <section className="flex flex-col lg:flex-row gap-8 items-start">
         <div className="w-full lg:w-1/3 space-y-6">
            <div className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 relative group">
               <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl">
                  {profileImage ? (
                    <img 
                      src={URL.createObjectURL(profileImage)} 
                      alt="Preview" 
                      className="object-cover w-full h-full" 
                    />
                  ) : user.profile?.profile_picture ? (
                    <img 
                      src={user.profile.profile_picture.startsWith('http') ? user.profile.profile_picture : `http://127.0.0.1:8000${user.profile.profile_picture}`} 
                      alt="Profile" 
                      className="object-cover w-full h-full" 
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                       <User className="w-20 h-20" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="profile-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={e => setProfileImage(e.target.files[0])} 
                  />
                  <button 
                    onClick={() => document.getElementById('profile-upload').click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-black text-[10px] uppercase tracking-widest"
                  >
                    <Camera className="w-5 h-5" /> Update Photo
                  </button>
               </div>
               
               <div className="mt-8 text-center space-y-2">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tighter">{user.first_name || user.username}</h1>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                     <ShieldCheck className="w-3 h-3" />
                     <span>{user.profile?.is_email_verified ? 'Verified Human' : 'Unverified Identity'}</span>
                  </div>
               </div>

               <div className="mt-8 space-y-4 pt-8 border-t border-gray-50 text-sm font-bold text-gray-500">
                  <div className="flex items-center gap-4"><Mail className="w-4 h-4 text-emerald-500" /> <span>{user.email}</span></div>
                  <div className="flex items-center gap-4"><Phone className="w-4 h-4 text-emerald-500" /> <span>{user.profile?.phone_number || 'No contact registered'}</span></div>
                  <div className="flex items-center gap-4"><MapPin className="w-4 h-4 text-emerald-500" /> <span className="line-clamp-1">{user.profile?.address || 'No deployment location'}</span></div>
               </div>
               
               <button onClick={() => setIsEditing(!isEditing)} className="mt-10 w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                  {isEditing ? 'Cancel Edit' : 'Edit Intelligence'}
               </button>

               <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4 text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Decentralized Logistics Protocol</div>
                  {account ? (
                      <div className="space-y-4">
                        <div className="inline-flex flex-col items-center bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl border border-emerald-100 w-full">
                           <span className="text-[10px] uppercase font-black tracking-widest mb-1">Connected Wallet (Sepolia)</span>
                           <span className="text-xs font-bold font-mono truncate w-full" title={account}>{account}</span>
                        </div>
                        <button onClick={disconnectWallet} className="text-[10px] font-black tracking-widest uppercase text-red-500 hover:text-red-700">Disconnect Wallet</button>
                      </div>
                  ) : (
                      <div className="space-y-2">
                        <button onClick={connectWallet} className="w-full py-3 bg-[#f6851b] hover:bg-[#e07514] text-white rounded-2xl font-black text-xs tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-5 h-5"/>
                           CONNECT METAMASK
                        </button>
                        {networkError && <p className="text-xs text-red-500 font-bold">{networkError}</p>}
                      </div>
                  )}
               </div>
            </div>
         </div>

         <div className="flex-1 w-full p-10 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
            <div className="space-y-1">
               <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Identity Parameters.</h2>
               <p className="text-xs font-bold text-gray-400 tracking-widest">USER ID: 0x{user.id.toString(16).toUpperCase().padStart(4, '0')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
               <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Legal First Name</label>
                  <input readOnly={!isEditing} type="text" className={`w-full p-4 border rounded-2xl font-bold transition-all ${isEditing ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-gray-50 border-gray-100'}`} value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
               </div>
               <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Primary Mobile Pulse</label>
                  <input readOnly={!isEditing} type="text" className={`w-full p-4 border rounded-2xl font-bold transition-all ${isEditing ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-gray-50 border-gray-100'}`} value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
               </div>
            </div>
            <div className="space-y-2 group">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Deployment Destination</label>
               <textarea readOnly={!isEditing} className={`w-full p-4 border rounded-2xl font-bold transition-all min-h-[120px] ${isEditing ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-gray-50 border-gray-100'}`} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
               <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Logistics City</label>
                  <input readOnly={!isEditing} type="text" className={`w-full p-4 border rounded-2xl font-bold transition-all ${isEditing ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-gray-50 border-gray-100'}`} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
               </div>
               <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mb-1 block group-focus-within:text-emerald-600 transition-colors">Postal Pulse (PIN)</label>
                  <input readOnly={!isEditing} type="text" className={`w-full p-4 border rounded-2xl font-bold transition-all ${isEditing ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-gray-50 border-gray-100'}`} value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
               </div>
            </div>

            {isEditing && (
              <button onClick={handleUpdate} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all">
                <Save className="w-6 h-6" /> SAVE UPDATED PARAMETERS
              </button>
            )}
         </div>
      </section>

      {/* Analytics Visualization Hub */}
      <section className="space-y-8 pb-12">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl"><TrendingUp className="w-8 h-8" /></div>
            <div>
               <h2 className="text-3xl font-black tracking-tighter">Behavioral Analytics.</h2>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Real-time engagement telemetry</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 min-h-[450px] flex flex-col">
               <div className="mb-8 space-y-1">
                  <h3 className="font-black text-gray-900 text-xl tracking-tight leading-none uppercase">Cumulative Finance Timeline</h3>
                  <p className="text-xs font-bold text-gray-400">Total Expenditure Trends (INR)</p>
               </div>
               <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.timeline}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={5} dot={{ r: 6, fill: '#10b981', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 10 }} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 min-h-[450px] flex flex-col">
               <div className="mb-8 space-y-1">
                  <h3 className="font-black text-gray-900 text-xl tracking-tight leading-none uppercase">Category Distribution</h3>
                  <p className="text-xs font-bold text-gray-400">Inventory Classification Patterns</p>
               </div>
               <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="product__category__name"
                      >
                        {analytics.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </section>

      {/* Account Control Center */}
      <section className="p-12 bg-gray-900 text-white rounded-[45px] relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 blur-[130px] -z-0 group-hover:bg-red-500/20 transition-all duration-1000" />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4">
               <h2 className="text-4xl font-black tracking-tighter">Security Protocols.</h2>
               <p className="text-gray-400 font-medium max-w-sm">Manage your session authentication or permanently deactivate your profile from the NexCart Grid.</p>
               <div className="flex gap-4 pt-4">
                  <button onClick={logout} className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center gap-3 font-black text-sm transition-all border border-white/5">
                    <LogOut className="w-5 h-5" /> LOG OUT SESSION
                  </button>
                  <button onClick={() => setShowDeleteModal(true)} className="px-8 py-4 bg-red-500/10 hover:bg-red-500 text-white rounded-2xl flex items-center gap-3 font-black text-sm transition-all border border-red-500/20 group/del">
                    <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" /> TERMINATE ACCOUNT
                  </button>
               </div>
            </div>
            
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md space-y-3">
               <div className="flex items-center gap-3 text-emerald-400"><ShieldCheck className="w-5 h-5" /> <span className="text-[10px] font-black uppercase tracking-widest">Protocol Version 4.0.2</span></div>
               <p className="text-xs text-gray-500 font-bold">Authenticated via JSON Web Token High-Entropy RSA-256</p>
            </div>
         </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" onClick={() => setShowDeleteModal(false)} />
           <div className="relative bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="p-6 bg-red-50 text-red-500 rounded-full"><AlertTriangle className="w-12 h-12" /></div>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tighter">PERMANENT DELETION</h3>
                 <p className="text-gray-500 font-medium leading-relaxed">This action will erase your orders, behavioral pulse, and AI curation data. There is no recovery protocol.</p>
              </div>
              
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Type "DELETE PERMANENTLY" to confirm</label>
                 <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center font-black tracking-widest text-red-500 focus:bg-white focus:border-red-500 transition-all" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} />
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">ABORT</button>
                 <button onClick={handleDeleteAccount} className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${deleteConfirm === 'DELETE PERMANENTLY' ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-500/20' : 'bg-gray-100 text-gray-200 cursor-not-allowed'}`}>EXECUTE DELETION</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
