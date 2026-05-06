'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ShoppingBag, Menu, X, Search, Heart, User, Camera, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { state } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const getLogo = () => {
    if (state.logo?.type === 'base64') return state.logo.data;
    if (state.logo?.type === 'url') return state.logo.data;
    return null;
  };

  const logoSrc = getLogo();

  const hProducts = (state.products || []).filter(p => (state.hamburgerProducts || []).includes(p.id));
  const hCollections = (state.collections || []).filter(c => (state.hamburgerCollections || []).includes(c.id));

  return (
    <>
      <nav ref={searchRef} className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 md:px-8 bg-transparent relative z-50">
            {/* Mobile Search Overlay */}
            {isSearchOpen && (
              <div className="absolute inset-0 bg-white flex items-center px-4 md:hidden z-20">
                 <button onClick={() => setIsSearchOpen(false)} className="mr-4">
                    <Search className="w-5 h-5 text-black" />
                 </button>
                 <input 
                    type="text" 
                    placeholder="SEARCH" 
                    className="outline-none text-sm w-full uppercase tracking-widest bg-transparent outline-none ring-0 border-none placeholder:text-gray-400"
                    autoFocus
                  />
                 <button onClick={() => setIsSearchOpen(false)} className="ml-4">
                    <X className="w-5 h-5 text-black" />
                 </button>
              </div>
            )}

            <div className="flex justify-between items-center h-20">
              {/* Left section: Hamburger & Search */}
              <div className="flex items-center space-x-4 md:space-x-6 flex-1">
                <button 
                  onClick={() => {
                    setIsMenuOpen(true);
                    setIsSearchOpen(false);
                  }} 
                  className="hover:opacity-70 transition-opacity"
                >
                  <Menu className="w-6 h-6 text-black" strokeWidth={1.5} />
                </button>
                <div className="flex items-center relative">
                  <button 
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="hover:opacity-70 transition-opacity flex items-center"
                  >
                    <Search className="w-5 h-5 text-black" strokeWidth={1.5} />
                  </button>
                  {/* Collapsible Search Input Space (Desktop) */}
                  <div 
                    className={`hidden md:flex items-center overflow-hidden transition-all duration-500 ease-in-out border-b border-black ${isSearchOpen ? 'w-48 md:w-64 opacity-100 ml-2 pb-1' : 'w-0 opacity-0 ml-0 border-transparent'}`}
                  >
                    <input 
                      type="text" 
                      placeholder="SEARCH" 
                      className="outline-none text-xs w-full uppercase tracking-widest bg-transparent placeholder:text-gray-400"
                      autoFocus={isSearchOpen}
                    />
                    {isSearchOpen && (
                      <button className="text-gray-600 hover:text-black transition-colors">
                        <Camera className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Center section: Logo */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center flex-1">
                <Link href="/" className="flex flex-col items-center">
                  {logoSrc ? (
                    <div className="relative h-14 w-48 md:h-16 md:w-64 mb-1">
                      <Image src={logoSrc} alt="Website Logo" fill className="object-contain" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <span className="font-serif text-2xl md:text-3xl font-bold tracking-[0.15em] text-[#1a1a1a]">
                      KAIN<span className="text-primary">.</span>SUTRA
                    </span>
                  )}
                </Link>
              </div>

              {/* Right section: Icons */}
              <div className="flex items-center justify-end space-x-4 md:space-x-6 flex-1">
                <Link href="/login" className="hover:opacity-70 transition-opacity">
                  <User className="w-5 h-5 md:w-[22px] md:h-[22px] text-black" strokeWidth={1.5} />
                </Link>
                <Link href="/cart" className="hover:opacity-70 transition-opacity">
                  <ShoppingBag className="w-5 h-5 md:w-[22px] md:h-[22px] text-black" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
        </div>

        {/* Mega Menu / Search Panel */}
        <AnimatePresence>
          {isSearchOpen && (
            <>
              {/* Overlay for closing search */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-20 bg-black/20 z-30"
                onClick={() => setIsSearchOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden shadow-sm z-40"
              >
              <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                  
                  {/* Left Column: Popular Searches */}
                  <div className="lg:w-1/3">
                    <h3 className="font-serif text-xl mb-6">Popular</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['New Designs', 'Sutra Premium', 'Motif Lagosi', 'Motif Cobba', 'Sutra Balo Renni', 'Best-Sellers', 'Classics'].map(tag => (
                        <Link 
                          key={tag} 
                          href="/shop" 
                          className="px-3 py-1.5 border border-gray-200 text-[10px] uppercase tracking-widest text-gray-600 hover:border-black hover:text-black transition-colors"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4" /> Search By Image
                    </button>
                  </div>

                  {/* Right Column: Featured Cards */}
                  <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {state.megaMenuCards?.slice(0, 4).map((card, idx) => (
                      <Link key={card.id || idx} href={card.link || '/shop'} className="group" onClick={() => setIsSearchOpen(false)}>
                        <div className="relative aspect-[16/9] md:aspect-[3/2] overflow-hidden mb-3 bg-gray-100">
                          <Image src={card.image?.data || `https://picsum.photos/seed/mm${idx}/800/500`} alt={card.title || 'Category'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                        </div>
                        <h4 className="font-serif text-lg group-hover:text-primary transition-colors">{card.title}</h4>
                      </Link>
                    ))}
                  </div>

                </div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Hamburger Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-full max-w-[400px] bg-white z-[60] overflow-y-auto flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center px-6 h-20 border-b border-gray-100">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-6 h-6 text-black" strokeWidth={1.5} />
                </button>
                <div className="flex-1 flex justify-center pr-6">
                  <div className="flex flex-col items-center">
                    <span className="font-serif text-xl font-bold tracking-[0.15em] text-[#1a1a1a]">
                      KAIN<span className="text-primary">.</span>SUTRA
                    </span>
                  </div>
                </div>
              </div>

              {/* Drawer Links */}
              <div className="py-6 px-8 flex-1">
                <ul className="space-y-6">
                  <li>
                    <Link href="/shop" className="text-xl font-serif hover:text-gray-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Semua Produk
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => setExpandedMenu(expandedMenu === 'products' ? null : 'products')}
                      className="w-full flex items-center justify-between text-xl font-serif hover:text-gray-500 transition-colors group"
                    >
                      <span>Terlaris</span>
                      <ChevronRight className={`w-5 h-5 opacity-40 group-hover:opacity-100 transition-all ${expandedMenu === 'products' ? 'rotate-90' : ''}`} strokeWidth={1.5} />
                    </button>
                    <AnimatePresence>
                      {expandedMenu === 'products' && (
                        <motion.ul 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 mt-4 space-y-4 overflow-hidden"
                        >
                          {hProducts.map((product) => (
                            <li key={product.id}>
                              <Link href={`/product/${product.id}`} className="text-base font-serif hover:text-gray-500 transition-colors block" onClick={() => setIsMenuOpen(false)}>
                                {product.name}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                  <li>
                    <button 
                      onClick={() => setExpandedMenu(expandedMenu === 'collections' ? null : 'collections')}
                      className="w-full flex items-center justify-between text-xl font-serif hover:text-gray-500 transition-colors group"
                    >
                      <span>Koleksi Kami</span>
                      <ChevronRight className={`w-5 h-5 opacity-40 group-hover:opacity-100 transition-all ${expandedMenu === 'collections' ? 'rotate-90' : ''}`} strokeWidth={1.5} />
                    </button>
                    <AnimatePresence>
                      {expandedMenu === 'collections' && (
                        <motion.ul 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 mt-4 space-y-4 overflow-hidden"
                        >
                          {hCollections.map((col) => (
                            <li key={col.id}>
                              <Link href={`/shop?category=${encodeURIComponent(col.name)}`} className="text-base font-serif hover:text-gray-500 transition-colors block" onClick={() => setIsMenuOpen(false)}>
                                {col.name}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                  <li className="pt-6 border-t border-gray-100 mt-6">
                    <Link href="/profile" className="text-xl font-serif hover:text-gray-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Cerita Kami
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Drawer Footer */}
              <div className="p-8 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-4">
                  <Link href="/login" className="text-xs font-semibold uppercase tracking-widest border-b border-black pb-1 hover:text-primary hover:border-primary transition-all" onClick={() => setIsMenuOpen(false)}>
                    Sign In / Register
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
