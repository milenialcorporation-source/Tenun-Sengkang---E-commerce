'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ShopContent() {
  const { state } = useStore();
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category');
  const initialQuery = searchParams?.get('q');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [searchQuery, setSearchQuery] = useState<string | null>(initialQuery || null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(searchParams?.get('q') || null);
    const categoryFromQuery = searchParams?.get('category');
    if (categoryFromQuery) {
       setSelectedCategory(categoryFromQuery);
    }
  }, [searchParams]);

  // Derive categories from products + collections
  const categories = useMemo(() => {
    const ObjectProducts = state.products || [];
    const ObjectCollections = state.collections || [];
    const cats = new Set(ObjectProducts.map(p => p.category));
    ObjectCollections.forEach(c => cats.add(c.name));
    return Array.from(cats);
  }, [state.products, state.collections]);

  const filteredProducts = useMemo(() => {
    let p = state.products || [];
    if (selectedCategory) {
      p = p.filter(prod => prod.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      p = p.filter(prod => 
        (prod.name && prod.name.toLowerCase().includes(q)) || 
        (prod.description && prod.description.toLowerCase().includes(q)) ||
        (prod.category && prod.category.toLowerCase().includes(q))
      );
    }
    // Handle mock Olsera integration logic if needed (currently UI only)
    return p;
  }, [state.products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Shop Header */}
      <div className="bg-gradient-to-b from-[#fdfbf7] to-white py-16 px-4 mb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center mt-8">
           <h1 className="font-serif text-5xl md:text-6xl mb-4">
             {searchQuery ? `Pencarian: "${searchQuery}"` : 'Koleksi Lengkap'}
           </h1>
           <p className="text-secondary opacity-60 max-w-xl mx-auto text-sm leading-relaxed">
             Temukan berbagai macam motif dan warna kain sutra Sengkang asli. Setiap potong adalah hasil karya seni yang bernilai tinggi.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-6 pb-4 border-b border-gray-200 hidden md:block">Kategori</h3>
            
            {/* Mobile Dropdown Menu */}
            <div className="md:hidden mb-8">
              <select 
                value={selectedCategory || ''} 
                onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
                className="w-full p-3 border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none rounded-sm"
              >
                <option value="">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Desktop List Menu */}
            <ul className="space-y-4 hidden md:block">
              <li>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`text-sm tracking-wide transition-opacity ${selectedCategory === null ? 'font-semibold text-primary' : 'opacity-60 hover:opacity-100'}`}
                >
                  Semua
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-sm tracking-wide transition-opacity ${selectedCategory === cat ? 'font-semibold text-primary' : 'opacity-60 hover:opacity-100'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
             
             {/* Catalog Toggle Display Info */}
             <div className="mt-8 md:mt-12 p-4 bg-gray-50 text-xs text-center border border-gray-100 rounded-sm">
                <span className="block opacity-50 mb-1 uppercase tracking-widest">Sistem Katalog</span>
                <span className="font-semibold">{state.showOlsera ? 'Hibrida (Olsera + Manual)' : 'Manual Saja'}</span>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-8 lg:gap-y-12">
            {filteredProducts.map(product => (
              <Link href={`/product/${product.id}`} key={product.id} className="group block">
                <div className="relative aspect-square mb-4 bg-gray-50 border border-gray-200 overflow-hidden">
                  {product.isManual && (
                     <div className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] px-2 py-1 uppercase tracking-wider">
                       Eksklusif
                     </div>
                  )}
                  <Image 
                    src={product.image?.data || 'https://picsum.photos/600/800'} 
                    alt={product.name} 
                    fill 
                    className={`object-contain transition-opacity duration-500 ${(Array.isArray(product.images) && product.images.length > 0) ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                    referrerPolicy="no-referrer"
                  />
                  {(Array.isArray(product.images) && product.images.length > 0) && (
                    <Image
                      src={product.images[0].data || 'https://picsum.photos/600/800'}
                      alt={`${product.name} alternate`}
                      fill
                      className="object-contain absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="mt-3 w-full min-w-0">
                  <h3 className="font-serif text-sm sm:text-lg mb-1 leading-tight line-clamp-2 break-words w-full" title={product.name}>{product.name}</h3>
                  <div className="flex flex-col gap-1 mt-1 w-full min-w-0">
                    <span className="text-[10px] sm:text-xs text-gray-500 truncate w-full" title={product.category}>{product.category}</span>
                    <span className="font-semibold text-accent text-sm sm:text-base mt-0.5 w-full flex flex-wrap items-center">
                      Rp {Number(product.price || 0).toLocaleString('id-ID')}
                      <span className="text-[10px] sm:text-xs text-gray-400 ml-1 font-normal lowercase flex-shrink-0">
                        / {product.uom?.replace(/per /i, '') || 'pcs'}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-24 text-gray-400">
                Tidak ada produk di kategori ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-20 flex items-center justify-center">Memuat katalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
