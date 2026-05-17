'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const pass = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userName', data.name);
          window.location.href = '/account';
        }
      } else {
        alert(data.error || 'Invalid email or password');
      }
    } catch (err) {
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const pass = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPass = (e.currentTarget.elements.namedItem('confirmPassword') as HTMLInputElement).value;
    
    if (pass !== confirmPass) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', data.name);
          localStorage.setItem('userEmail', data.email);
          window.location.href = '/account';
        }
      } else {
        alert(data.error || 'Failed to register account');
      }
    } catch (err) {
      alert('An error occurred during registration. Please try again.');
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
                    name="email"
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
                  <div className="relative">
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      required
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white pr-10"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                    name="name"
                    type="text" 
                    required
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                    placeholder="e.g. Andi Tenri"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Email Address</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                    placeholder="e.g. name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Password</label>
                  <div className="relative">
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      required
                      minLength={8}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white pr-10"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input 
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      minLength={8}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white pr-10"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
