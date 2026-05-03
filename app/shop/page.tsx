'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ShopContent() {
  const { state } = useStore();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

  // Derive categories from products + collections
  const categories = useMemo(() => {
    const cats = new Set(state.products.map(p => p.category));
    state.collections.forEach(c => cats.add(c.name));
    return Array.from(cats);
  }, [state.products, state.collections]);

  const filteredProducts = useMemo(() => {
    let p = state.products;
    if (selectedCategory) {
      p = p.filter(prod => prod.category === selectedCategory);
    }
    // Handle mock Olsera integration logic if needed (currently UI only)
    return p;
  }, [state.products, selectedCategory]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Shop Header */}
      <div className="bg-gradient-to-b from-[#fdfbf7] to-white py-16 px-4 mb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center mt-8">
           <h1 className="font-serif text-5xl md:text-6xl mb-4">Koleksi Lengkap</h1>
           <p className="text-secondary opacity-60 max-w-xl mx-auto text-sm leading-relaxed">
             Temukan berbagai macam motif dan warna kain sutra Sengkang asli. Setiap potong adalah hasil karya seni yang bernilai tinggi.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-6 pb-4 border-b border-gray-200">Kategori</h3>
            <ul className="space-y-4">
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
             <div className="mt-12 p-4 bg-gray-50 text-xs text-center border border-gray-100 rounded-sm">
                <span className="block opacity-50 mb-1 uppercase tracking-widest">Sistem Katalog</span>
                <span className="font-semibold">{state.showOlsera ? 'Hibrida (Olsera + Manual)' : 'Manual Saja'}</span>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProducts.map(product => (
              <Link href={`/product/${product.id}`} key={product.id} className="group block">
                <div className="relative aspect-[3/4] mb-4 bg-gray-50 overflow-hidden">
                  {product.isManual && (
                     <div className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] px-2 py-1 uppercase tracking-wider">
                       Eksklusif
                     </div>
                  )}
                  <Image 
                    src={product.image?.data || 'https://picsum.photos/600/800'} 
                    alt={product.name} 
                    fill 
                    className={`object-cover transition-opacity duration-500 ${(product.images && product.images.length > 0) ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                    referrerPolicy="no-referrer"
                  />
                  {(product.images && product.images.length > 0) && (
                    <Image
                      src={product.images[0].data}
                      alt={`${product.name} alternate`}
                      fill
                      className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-60">{product.category}</span>
                    <span className="font-semibold text-accent">Rp {product.price.toLocaleString('id-ID')}</span>
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
