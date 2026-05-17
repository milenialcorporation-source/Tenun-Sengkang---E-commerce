'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/';
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-24 overflow-hidden">
      <div className="max-w-md mx-auto px-4 relative">
        <AnimatePresence mode="wait">
          {!isRegistering ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-serif text-4xl text-center mb-2">My Account</h1>
              <p className="text-center text-sm text-gray-500 mb-10 uppercase tracking-widest font-semibold">Sign In to Continue</p>
              
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                    placeholder="e.g. name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2 flex justify-between">
                    <span>Password</span>
                    <Link href="#" className="font-normal opacity-70 hover:opacity-100">Forgot?</Link>
                  </label>
                  <input 
                    type="password" 
                    required
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
                
                <button className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Sign In
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <h2 className="font-serif text-2xl mb-4">New to Kain Sutra?</h2>
                <p className="text-sm text-gray-500 mb-6">Create an account to track your orders, save your wishlist, and enjoy exclusive benefits.</p>
                <button 
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="w-full bg-white text-black border border-black py-4 uppercase tracking-widest text-sm font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-serif text-4xl text-center mb-2">Create Account</h1>
              <p className="text-center text-sm text-gray-500 mb-10 uppercase tracking-widest font-semibold">Join Kain Sutra Sengkang</p>
              
              <form className="space-y-6" onSubmit={handleRegister}>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                    placeholder="e.g. Andi Tenri"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                    placeholder="e.g. name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Password</label>
                  <input 
                    type="password" 
                    required
                    minLength={8}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
                
                <button className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Create Account
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <h2 className="font-serif text-2xl mb-4">Already have an account?</h2>
                <p className="text-sm text-gray-500 mb-6">Sign in to access your orders, wishlist and details.</p>
                <button 
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="w-full bg-white text-black border border-black py-4 uppercase tracking-widest text-sm font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
