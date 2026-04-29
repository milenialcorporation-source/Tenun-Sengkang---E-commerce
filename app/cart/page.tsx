import React from 'react';
import Link from 'next/link';

// Using a generic cart page design since this is just UI
export default function CartPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl border-b border-gray-200 pb-6 mb-8">Keranjang Belanja</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1">
             <div className="text-center py-24 bg-gray-50 border border-dashed border-gray-200">
                <p className="opacity-50 text-sm mb-4">Keranjang Anda kosong.</p>
                <Link href="/shop" className="inline-block bg-secondary text-white px-8 py-3 text-sm uppercase tracking-widest font-semibold hover:bg-primary hover:text-secondary transition-colors">
                  Mulai Belanja
                </Link>
             </div>
          </div>

          {/* Order Summary */}
          <div className="w-full md:w-80 flex-shrink-0">
             <div className="bg-gray-50 p-6 border border-gray-100">
               <h3 className="text-sm font-semibold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Ringkasan Pesanan</h3>
               <div className="space-y-4 text-sm opacity-80 mb-6">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span>Rp 0</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Pengiriman</span>
                   <span>Dihitung saat checkout</span>
                 </div>
               </div>
               <div className="flex justify-between font-semibold border-t border-gray-200 pt-4 mb-8">
                 <span>Total</span>
                 <span>Rp 0</span>
               </div>
               <Link href="/checkout" className="w-full block text-center bg-secondary text-white py-4 text-sm uppercase tracking-widest font-semibold hover:bg-primary transition-colors">
                 Checkout
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
