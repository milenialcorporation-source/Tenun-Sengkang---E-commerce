'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { state } = useStore();
  const product = (state.products || []).find(p => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [kainLength, setKainLength] = React.useState('1');

  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true') {
      const fetchWishlist = async () => {
        const email = localStorage.getItem('userEmail');
        if (email) {
          try {
            const res = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (res.ok && data.success) {
              setWishlist(data.wishlist);
              localStorage.setItem('wishlist', JSON.stringify(data.wishlist));
            }
          } catch (error) {
            console.error(error);
          }
        }
      };
      
      const timeout = setTimeout(() => {
        fetchWishlist();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, []);

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') !== 'true') {
      router.push('/login');
      return;
    }

    const email = localStorage.getItem('userEmail');
    const isAdding = !wishlist.includes(productId);

    setWishlist(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      if (typeof window !== 'undefined') localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });

    if (email) {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, productId, action: isAdding ? 'add' : 'remove' })
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

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
             <div className="relative aspect-square bg-gray-50 overflow-hidden">
               <Image 
                 src={Array.isArray(product.images) && product.images.length > 0 && selectedImageIndex > 0 ? (product.images[selectedImageIndex - 1].data || 'https://picsum.photos/800/1000') : (product.image?.data || 'https://picsum.photos/800/1000')}
                 alt={product.name}
                 fill
                 className="object-contain"
                 referrerPolicy="no-referrer"
                 priority
               />
             </div>
             {(Array.isArray(product.images) && product.images.length > 0) && (
               <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                 <button onClick={() => setSelectedImageIndex(0)} className={`relative w-20 aspect-square flex-shrink-0 snap-start border-2 ${selectedImageIndex === 0 ? 'border-primary' : 'border-transparent'} hover:border-gray-300 transition-colors`}>
                   <Image src={product.image?.data || 'https://picsum.photos/800/1000'} fill alt="Main" className="object-contain" />
                 </button>
                 {product.images.map((img: any, idx: number) => (
                   <button key={idx} onClick={() => setSelectedImageIndex(idx + 1)} className={`relative w-20 aspect-square flex-shrink-0 snap-start border-2 ${selectedImageIndex === idx + 1 ? 'border-primary' : 'border-transparent'} hover:border-gray-300 transition-colors`}>
                     <Image src={img.data || 'https://picsum.photos/800/1000'} fill alt={`Variant ${idx + 1}`} className="object-contain" />
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
             <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">{product.name}</h1>
             <p className="text-2xl opacity-80 mb-2">
               Rp {Number(product.price || 0).toLocaleString('id-ID')}
               <span className="text-sm border ml-2 border-gray-200 px-2 py-1 rounded text-gray-500 font-sans tracking-wide">
                 {product.uom || (product.productType === 'kain' ? 'Per Meter' : 'Per Pcs')}
               </span>
             </p>
             {product.stock !== undefined && (
               <p className="text-sm font-semibold text-gray-600 mb-6">
                 Stock Tersedia: {product.stock} {product.productType === 'kain' ? 'Meter' : 'Pcs'}
               </p>
             )}
             {product.productType === 'kain' && (
               <div className="mb-8">
                 <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Panjang Pesanan (Meter)</label>
                 <div className="flex items-center gap-4">
                   <input 
                     type="number" 
                     min="0.1" 
                     step="0.01" 
                     value={kainLength} 
                     onChange={(e) => setKainLength(e.target.value)}
                     className="w-24 border border-gray-300 rounded px-3 py-2 text-center focus:outline-none focus:border-primary"
                   />
                   <p className="text-sm font-semibold">
                     Total: Rp {(Number(product.price || 0) * (parseFloat(kainLength) || 0)).toLocaleString('id-ID')}
                   </p>
                 </div>
               </div>
             )}
             {product.productType !== 'kain' && <div className="mb-8"></div>}
             
             <div className="prose prose-sm opacity-70 mb-12 whitespace-pre-wrap">
               <p>{product.description}</p>
             </div>

             <div className="space-y-6">
               <div className="flex gap-4">
                 <button disabled={product.stock !== undefined && product.stock <= 0} onClick={() => {
                   if (typeof window !== 'undefined') {
                     const existingCartStr = localStorage.getItem('cart');
                     let cart = existingCartStr ? JSON.parse(existingCartStr) : [];
                     
                     let qty = 1;
                     if (product.productType === 'kain') {
                       qty = parseFloat(kainLength);
                       if (isNaN(qty) || qty <= 0) {
                         alert('Masukkan panjang pesanan yang valid.');
                         return;
                       }
                     }

                     const itemIndex = cart.findIndex((item: any) => item.id === product.id && item.isKain === (product.productType === 'kain'));
                     const currentQtyInCart = itemIndex > -1 ? cart[itemIndex].quantity : 0;
                     if (product.stock !== undefined && currentQtyInCart + qty > product.stock) {
                       alert(`Maaf, stock tidak mencukupi. Stock tersisa: ${product.stock - currentQtyInCart}`);
                       return;
                     }

                     if (itemIndex > -1) {
                       cart[itemIndex].quantity += qty;
                     } else {
                       cart.push({ ...product, quantity: qty, isKain: product.productType === 'kain' });
                     }
                     localStorage.setItem('cart', JSON.stringify(cart));
                     alert('Produk ditambahkan ke keranjang!');
                   }
                 }} className="flex-1 text-center bg-secondary text-white py-4 text-xs lg:text-sm uppercase tracking-widest font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                   Add to Cart
                 </button>
                 <button disabled={product.stock !== undefined && product.stock <= 0} onClick={() => {
                   let qty = 1;
                   if (product.productType === 'kain') {
                     qty = parseFloat(kainLength);
                     if (isNaN(qty) || qty <= 0) {
                       alert('Masukkan panjang pesanan yang valid.');
                       return;
                     }
                   }
                   if (product.stock !== undefined && qty > product.stock) {
                     alert(`Maaf, stock tidak mencukupi. Stock tersisa: ${product.stock}`);
                     return;
                   }
                   router.push(`/checkout?productId=${product.id}&qty=${qty}`);
                 }} className="flex-1 text-center bg-transparent text-secondary border border-secondary py-4 text-xs lg:text-sm uppercase tracking-widest font-semibold hover:bg-secondary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                   Beli Sekarang
                 </button>
                 <button onClick={(e) => toggleWishlist(e, product.id)} className={`px-5 border border-gray-200 transition-colors flex items-center justify-center ${wishlist.includes(product.id) ? 'text-red-500 border-red-200' : 'hover:border-black text-gray-600'}`}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                   </svg>
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

               <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                 {state.whatsappNumber && (
                   <a href={state.whatsappNumber.startsWith('http') ? state.whatsappNumber : `https://wa.me/${state.whatsappNumber.replace(/\D/g,'')}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk ${product.name}.`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-4 bg-[#25D366] text-white text-sm font-semibold uppercase tracking-widest hover:bg-[#1ebd5b] transition-colors rounded">
                     Pesan via WhatsApp
                   </a>
                 )}
                 {(state.offlineStoreLink || '/locations') && (
                   <a href={state.offlineStoreLink || '/locations'} target={(state.offlineStoreLink || '').startsWith('http') ? "_blank" : "_self"} rel={(state.offlineStoreLink || '').startsWith('http') ? "noopener noreferrer" : ""} className="flex items-center justify-center w-full py-4 border border-black text-black text-sm font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded">
                     Kunjungi Toko Offline
                   </a>
                 )}
               </div>

               <p className="text-xs text-center opacity-50 pt-2">Pengiriman gratis untuk pesanan di atas Rp 2.000.000</p>
             </div>

             <div className="mt-16 border-t border-gray-200 divide-y divide-gray-200">
               {/* Informasi Ongkos Kirim */}
               <details className="group py-5">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm uppercase tracking-widest hover:text-primary">
                   <span>Informasi Ongkos Kirim</span>
                   <span className="transition group-open:rotate-180">
                     <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                   </span>
                 </summary>
                 <div className="text-secondary opacity-60 mt-4 text-sm leading-relaxed space-y-3">
                   <p>Pilih tipe pengiriman untuk melihat estimasi ongkos kirim. Pengiriman tersedia ke seluruh Indonesia.</p>
                   <select className="w-full p-3 border border-gray-200 bg-white text-sm focus:outline-none focus:border-black appearance-none">
                     <option>Pilih Provinsi Tujuan</option>
                     <option>Sulawesi Selatan</option>
                     <option>DKI Jakarta</option>
                     <option>Jawa Barat</option>
                   </select>
                 </div>
               </details>

               {/* Informasi Panduan Ukuran */}
               <details className="group py-5">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm uppercase tracking-widest hover:text-primary">
                   <span>Informasi Panduan Ukuran</span>
                   <span className="transition group-open:rotate-180">
                     <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                   </span>
                 </summary>
                 <div className="text-secondary opacity-60 mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                   <p>{product.sizeGuide || "Setiap produk memiliki ukuran standar. Untuk produk kain, lebar standar adalah 115cm. Silakan hubungi admin untuk ukuran khusus (custom)."}</p>
                 </div>
               </details>

               {/* Informasi Deskripsi Produk */}
               <details className="group py-5">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm uppercase tracking-widest hover:text-primary">
                   <span>Informasi Deskripsi Produk</span>
                   <span className="transition group-open:rotate-180">
                     <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                   </span>
                 </summary>
                 <div className="text-secondary opacity-60 mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                   <p>{product.description}</p>
                 </div>
               </details>

               {/* Rincian / Spesifikasi Bahan & Material */}
               <details className="group py-5" open>
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm uppercase tracking-widest hover:text-primary">
                   <span>Rincian Bahan & Material</span>
                   <span className="transition group-open:rotate-180">
                     <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                   </span>
                 </summary>
                 <p className="text-secondary opacity-60 mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                   {product.material || "Ditenun menggunakan 100% benang sutra asli pilihan dengan teknik tradisional Sengkang. Kain ini memiliki kilau alami dan tekstur yang lembut serta nyaman di kulit."}
                 </p>
               </details>

               {/* Panduan Perawatan */}
               <details className="group py-5">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm uppercase tracking-widest hover:text-primary">
                   <span>Panduan Perawatan</span>
                   <span className="transition group-open:rotate-180">
                     <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                   </span>
                 </summary>
                 <p className="text-secondary opacity-60 mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                   {product.careInstructions || "Keringkan di tempat teduh. Cuci kering (dry clean) sangat disarankan untuk menjaga keawetan warna dan kilau sutra. Jangan gunakan pemutih atau pelembut pakaian kimia. Setrika dengan suhu rendah atau gunakan pelapis."}
                 </p>
               </details>

               {/* Penilaian Pelanggan */}
               <details className="group py-5">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm uppercase tracking-widest hover:text-primary">
                   <span>Penilaian Pelanggan</span>
                   <span className="transition group-open:rotate-180">
                     <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                   </span>
                 </summary>
                 <div className="text-secondary opacity-60 mt-4 text-sm leading-relaxed text-center py-6">
                   <p>Belum ada ulasan untuk produk ini.</p>
                 </div>
               </details>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
