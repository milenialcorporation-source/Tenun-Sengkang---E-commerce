'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { state } = useStore();
  const product = (state.products || []).find(p => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-secondary opacity-60">Produk tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/shop" className="inline-flex items-center text-sm uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-primary transition-colors mb-12">
          <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-4">
             <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
               <Image 
                 src={Array.isArray(product.images) && product.images.length > 0 && selectedImageIndex > 0 ? (product.images[selectedImageIndex - 1].data || 'https://picsum.photos/800/1000') : (product.image?.data || 'https://picsum.photos/800/1000')}
                 alt={product.name}
                 fill
                 className="object-cover"
                 referrerPolicy="no-referrer"
                 priority
               />
             </div>
             {(Array.isArray(product.images) && product.images.length > 0) && (
               <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                 <button onClick={() => setSelectedImageIndex(0)} className={`relative w-20 aspect-[3/4] flex-shrink-0 snap-start border-2 ${selectedImageIndex === 0 ? 'border-primary' : 'border-transparent'} hover:border-gray-300 transition-colors`}>
                   <Image src={product.image?.data || 'https://picsum.photos/800/1000'} fill alt="Main" className="object-cover" />
                 </button>
                 {product.images.map((img: any, idx: number) => (
                   <button key={idx} onClick={() => setSelectedImageIndex(idx + 1)} className={`relative w-20 aspect-[3/4] flex-shrink-0 snap-start border-2 ${selectedImageIndex === idx + 1 ? 'border-primary' : 'border-transparent'} hover:border-gray-300 transition-colors`}>
                     <Image src={img.data || 'https://picsum.photos/800/1000'} fill alt={`Variant ${idx + 1}`} className="object-cover" />
                   </button>
                 ))}
               </div>
             )}
          </div>

          {/* Product Details */}
          <div className="py-10">
             <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="mb-2 text-xs uppercase tracking-widest text-accent font-semibold hover:underline block w-fit">
               {product.category}
             </Link>
             <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">{product.name}</h1>
             <p className="text-2xl opacity-80 mb-10">Rp {Number(product.price || 0).toLocaleString('id-ID')}</p>
             
             <div className="prose prose-sm opacity-70 mb-12">
               <p>{product.description}</p>
             </div>

             <div className="space-y-6">
               <div className="flex gap-4">
                 <Link href={`/checkout?productId=${product.id}`} className="flex-1 text-center bg-secondary text-white py-4 text-xs lg:text-sm uppercase tracking-widest font-semibold hover:bg-black transition-colors">
                   Add to Cart
                 </Link>
                 <Link href={`/checkout?productId=${product.id}`} className="flex-1 text-center bg-transparent text-secondary border border-secondary py-4 text-xs lg:text-sm uppercase tracking-widest font-semibold hover:bg-secondary hover:text-white transition-colors">
                   Beli Sekarang
                 </Link>
                 <button className="px-5 border border-gray-200 hover:border-black transition-colors">
                   ♡
                 </button>
               </div>
               
               {(product.tokopediaLink || product.shopeeLink) && (
                 <div className="flex flex-col gap-3 pt-2">
                   <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1 text-center">Atau beli di</p>
                   <div className="flex gap-4">
                     {product.tokopediaLink && (
                       <a href={product.tokopediaLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 border border-[#42b549] text-[#42b549] hover:bg-[#42b549] hover:text-white transition-colors text-sm font-semibold">
                         Tokopedia
                       </a>
                     )}
                     {product.shopeeLink && (
                       <a href={product.shopeeLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 border border-[#ee4d2d] text-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white transition-colors text-sm font-semibold">
                         Shopee
                       </a>
                     )}
                   </div>
                 </div>
               )}

               <p className="text-xs text-center opacity-50 pt-2">Pengiriman gratis untuk pesanan di atas Rp 2.000.000</p>
             </div>

             <div className="mt-16 border-t border-gray-200 pt-8">
               <details className="group">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm uppercase tracking-widest">
                   <span>Rincian Bahan & Perawatan</span>
                   <span className="transition group-open:rotate-180">
                     <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                   </span>
                 </summary>
                 <p className="text-secondary opacity-60 mt-4 text-sm leading-relaxed">
                   Ditenun menggunakan 100% benang sutra asli. Keringkan di tempat teduh. Cuci kering (dry clean) sangat disarankan untuk menjaga keawetan warna dan kilau sutra.
                 </p>
               </details>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
