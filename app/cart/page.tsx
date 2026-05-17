'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCartStr = localStorage.getItem('cart');
      if (storedCartStr) {
        setCartItems(JSON.parse(storedCartStr));
      }
    }
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl border-b border-gray-200 pb-6 mb-8">Keranjang Belanja</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1">
            {cartItems.length > 0 ? (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6">
                    <div className="relative w-24 aspect-[3/4] bg-gray-50">
                       <Image src={item.image?.data || `https://picsum.photos/seed/${item.id}/400/600`} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm uppercase tracking-widest mb-1">{item.name}</h3>
                      <p className="text-secondary opacity-60 text-sm mb-4">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                          <span className="px-3 py-1 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 underline">Hapus</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gray-50 border border-dashed border-gray-200">
                <p className="opacity-50 text-sm mb-4">Keranjang Anda kosong.</p>
                <Link href="/shop" className="inline-block bg-secondary text-white px-8 py-3 text-sm uppercase tracking-widest font-semibold hover:bg-primary hover:text-secondary transition-colors">
                  Mulai Belanja
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="w-full md:w-80 flex-shrink-0">
               <div className="bg-gray-50 p-6 border border-gray-100">
                 <h3 className="text-sm font-semibold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Ringkasan Pesanan</h3>
                 <div className="space-y-4 text-sm opacity-80 mb-6">
                   <div className="flex justify-between">
                     <span>Subtotal</span>
                     <span>Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Pengiriman</span>
                     <span>Dihitung saat checkout</span>
                   </div>
                 </div>
                 <div className="flex justify-between font-semibold border-t border-gray-200 pt-4 mb-8">
                   <span>Total</span>
                   <span>Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                 </div>
                 <Link href="/checkout" className="w-full block text-center bg-secondary text-white py-4 text-sm uppercase tracking-widest font-semibold hover:bg-primary transition-colors">
                   Checkout
                 </Link>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
