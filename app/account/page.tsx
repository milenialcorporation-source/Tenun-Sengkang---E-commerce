'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Image from 'next/image';

type Tab = 'account' | 'orders' | 'wishlist';

export default function AccountPage() {
  const [userName, setUserName] = useState<string | null>('');
  const [userEmail, setUserEmail] = useState<string | null>('');
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { state } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn !== 'true') {
        router.push('/login');
        return;
      }
      
      const timeout = setTimeout(() => {
        setUserName(storedName || 'Anda');
        setUserEmail(storedEmail || 'email@example.com');

        const fetchUserData = async (email: string) => {
          try {
            // Fetch Orders
            const ordersRes = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
            const ordersData = await ordersRes.json();
            if (ordersRes.ok && ordersData.success) {
              setOrders(ordersData.orders.map((o: any) => ({
                id: o.id,
                date: new Date(o.created_at).toISOString().split('T')[0],
                total: o.total,
                status: o.status,
                items: o.items
              })));
            }
            
            // Fetch Wishlist
            const wishlistRes = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
            const wishlistData = await wishlistRes.json();
            if (wishlistRes.ok && wishlistData.success) {
              setWishlistIds(wishlistData.wishlist);
              localStorage.setItem('wishlist', JSON.stringify(wishlistData.wishlist));
            }
          } catch (e) {
            console.error(e);
          }
        };

        if (storedEmail) {
          fetchUserData(storedEmail);
        } else {
          // Fallback if no email (shouldn't happen if logged in)
          const userOrdersStr = localStorage.getItem('user_orders');
          if (userOrdersStr) setOrders(JSON.parse(userOrdersStr));

          const wishlistStr = localStorage.getItem('wishlist');
          if (wishlistStr) setWishlistIds(JSON.parse(wishlistStr));
        }
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      router.push('/');
    }
  };

  const wishlistProducts = (state.products || []).filter(p => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="font-serif text-4xl mb-2">My Account</h1>
        <p className="text-sm text-gray-500 mb-10 uppercase tracking-widest font-semibold flex items-center justify-between">
          <span>Welcome back, {userName}</span>
          <button onClick={handleLogout} className="text-primary hover:opacity-70 transition-opacity underline">Sign Out</button>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('account')}
              className={`w-full text-left block px-4 py-3 border font-semibold text-sm uppercase tracking-widest transition-colors ${activeTab === 'account' ? 'bg-white border-black text-black' : 'bg-transparent border-transparent text-gray-500 hover:bg-white hover:text-black'}`}
            >
              Account Details
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left block px-4 py-3 border font-semibold text-sm uppercase tracking-widest transition-colors ${activeTab === 'orders' ? 'bg-white border-black text-black' : 'bg-transparent border-transparent text-gray-500 hover:bg-white hover:text-black'}`}
            >
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left block px-4 py-3 border font-semibold text-sm uppercase tracking-widest transition-colors ${activeTab === 'wishlist' ? 'bg-white border-black text-black' : 'bg-transparent border-transparent text-gray-500 hover:bg-white hover:text-black'}`}
            >
              Wishlist
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {activeTab === 'account' && (
              <div className="bg-white p-8 border border-gray-100 shadow-sm mb-8">
                <h2 className="font-serif text-2xl mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-1">Name</p>
                    <p className="text-base">{userName}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-1">Email</p>
                    <p className="text-base">{userEmail}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white p-8 border border-gray-100 shadow-sm mb-8">
                <h2 className="font-serif text-2xl mb-6">Recent Orders</h2>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.slice().reverse().map((order: any) => (
                      <div key={order.id} className="border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Order {order.id}</p>
                            <p className="text-sm font-medium">{order.date}</p>
                          </div>
                          <div className="text-right">
                            {(() => {
                              switch (order.status) {
                                case 'Pending': return <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Belum Bayar</span>;
                                case 'Paid': return <span className="inline-block bg-blue-100 text-blue-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Menunggu Pengiriman</span>;
                                case 'Processing': return <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Diproses</span>;
                                case 'Shipped': return <span className="inline-block bg-purple-100 text-purple-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Dikirim</span>;
                                case 'Delivered': return <span className="inline-block bg-green-100 text-green-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Selesai</span>;
                                case 'Cancelled': return <span className="inline-block bg-red-100 text-red-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Dibatalkan</span>;
                                default: return <span className="inline-block bg-gray-100 text-gray-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">{order.status}</span>;
                              }
                            })()}
                            <p className="text-sm font-medium mt-2">Rp {Number(order.total).toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        {(() => {
    try {
      const parsed = JSON.parse(order.items);
      return (
        <div>
          <p className="text-sm font-medium">{parsed.summary || order.items}</p>
          {parsed.list && parsed.list.length > 0 && (
             <ul className="text-xs text-gray-500 mt-2 space-y-1">
               {parsed.list.map((item: any, i: number) => (
                  <li key={i}>• {item.name} x {item.quantity} {item.isKain ? 'Meter' : 'Pcs'}</li>
               ))}
             </ul>
          )}
        </div>
      );
    } catch {
      const fallbackStr = typeof order.items === 'string' ? (order.items.length > 50 ? order.items.substring(0, 50) + '...' : order.items) : 'Format produk tidak valid';
      return <p className="text-sm">{fallbackStr}</p>;
    }
  })()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No recent orders found. <Link href="/shop" className="text-primary underline not-italic hover:opacity-70">Start shopping.</Link></p>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white p-8 border border-gray-100 shadow-sm mb-8">
                <h2 className="font-serif text-2xl mb-6">Your Wishlist</h2>
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistProducts.map(product => (
                      <Link key={product.id} href={`/product/${product.id}`} className="group block border border-gray-100 p-4 hover:border-gray-300 transition-colors">
                        <div className="relative aspect-square mb-4 bg-gray-50">
                          {product.images && product.images.length > 0 ? (
                            <Image src={product.images[0]?.data || `https://picsum.photos/seed/${product.id}1/400/600`} alt={product.name || 'Product'} fill className="object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest min-h[40px] leading-tight mb-2 group-hover:text-primary transition-colors">{product.name}</h4>
                        <p className="text-sm">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">Your wishlist is empty. <Link href="/shop" className="text-primary underline not-italic hover:opacity-70">Find something you love.</Link></p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
