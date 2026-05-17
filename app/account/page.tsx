'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [userName, setUserName] = useState<string | null>('');
  const [userEmail, setUserEmail] = useState<string | null>('');
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
            <Link href="/account" className="block px-4 py-3 bg-white border border-black font-semibold text-sm uppercase tracking-widest">
              Dashboard
            </Link>
            <Link href="#" className="block px-4 py-3 bg-transparent text-gray-500 hover:bg-white hover:text-black transition-colors font-semibold text-sm uppercase tracking-widest">
              Orders
            </Link>
            <Link href="#" className="block px-4 py-3 bg-transparent text-gray-500 hover:bg-white hover:text-black transition-colors font-semibold text-sm uppercase tracking-widest">
              Wishlist
            </Link>
            <Link href="#" className="block px-4 py-3 bg-transparent text-gray-500 hover:bg-white hover:text-black transition-colors font-semibold text-sm uppercase tracking-widest">
              Account Details
            </Link>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
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

            <div className="bg-white p-8 border border-gray-100 shadow-sm">
              <h2 className="font-serif text-2xl mb-6">Recent Orders</h2>
              <p className="text-gray-500 italic text-sm">No recent orders found. <Link href="/shop" className="text-primary underline not-italic hover:opacity-70">Start shopping.</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
