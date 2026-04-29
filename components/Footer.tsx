'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/20 pb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-3xl mb-6">Kain Sutra Sengkang</h2>
            <p className="opacity-70 max-w-sm text-sm leading-relaxed mb-6">
              Keindahan abadi yang ditenun dengan dedikasi. Menghadirkan warisan budaya Bugis ke dalam kehidupan modern melalui kain sutra berkualitas tinggi.
            </p>
             <div className="text-xs uppercase tracking-widest text-primary font-medium">
               Explore The Heritage
             </div>
          </div>
          
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-6 opacity-50">Shop</h3>
            <ul className="space-y-4 text-sm opacity-80">
              <li><Link href="/shop" className="hover:text-primary hover:opacity-100 transition-colors">All Products</Link></li>
              <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">Lagosi</Link></li>
              <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">Cobba</Link></li>
              <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">Balo Renni</Link></li>
            </ul>
          </div>

          <div>
             <h3 className="text-xs uppercase tracking-widest font-semibold mb-6 opacity-50">Support</h3>
            <ul className="space-y-4 text-sm opacity-80">
               <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">Contact Us</Link></li>
               <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">Shipping & Returns</Link></li>
               <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">Care Guide</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-50">
          <p>&copy; {new Date().getFullYear()} Kain Sutra Sengkang. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <Link href="#">Instagram</Link>
             <Link href="#">Facebook</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
