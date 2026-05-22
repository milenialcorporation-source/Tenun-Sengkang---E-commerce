'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';

function CheckoutContent() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId');
  const qtyParam = searchParams?.get('qty');
  const { state } = useStore();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuth(loggedIn);
      if (loggedIn) {
        setEmail(localStorage.getItem('userEmail') || '');
      }
    }
  }, []);

  const product = (state.products || []).find(p => p.id === productId);
  const qtyNum = qtyParam ? parseFloat(qtyParam) : 1;

  // Fallback to a default if no product is selected (for direct visits)
  const itemName = product ? `${product.name} (${qtyNum}${product.productType === 'kain' ? 'm' : 'x'})` : 'Produk (1x)';
  const itemPrice = product ? Number(product.price || 0) * qtyNum : 1500000;
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-3xl md:text-4xl text-center mb-10">Fast Checkout</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Form Section */}
          <div className="flex-1 bg-white p-8 border border-gray-200">
            {step === 1 ? (
              <div>
                <h2 className="text-xl font-serif mb-6 border-b border-gray-100 pb-4">Informasi Pengiriman</h2>
                {!isAuth && (
                  <div className="bg-gray-50 border border-gray-200 p-4 mb-6 flex justify-between items-center">
                    <p className="text-sm">Sudah punya akun?</p>
                    <Link href="/login" className="text-xs uppercase tracking-widest font-semibold text-primary hover:underline">
                      Masuk Di Sini
                    </Link>
                  </div>
                )}
                <form 
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Nama Depan</label>
                      <input required type="text" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Nama Belakang</label>
                      <input required type="text" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Email (Untuk Notifikasi)</label>
                    <input id="checkout-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={isAuth} className={`w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${isAuth ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-gray-50 focus:bg-white'}`} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Nomor Telepon / WhatsApp</label>
                    <input required type="tel" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Alamat Lengkap</label>
                    <textarea required rows={3} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 focus:bg-white transition-colors"></textarea>
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="w-full bg-black text-white py-4 text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                      Lanjutkan ke Pembayaran
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-serif mb-6 border-b border-gray-100 pb-4">Pembayaran & Pengiriman</h2>
                <div className="space-y-4 mb-8">
                  <div className="border border-black p-4 bg-gray-50 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <input type="radio" id="xendit" name="payment" defaultChecked className="text-black focus:ring-black" />
                      <label htmlFor="xendit" className="text-sm font-medium uppercase tracking-widest cursor-pointer">Xendit (Virtual Account / QRIS)</label>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-widest mb-4">Pengiriman (KiriminAja)</h3>
                    <div className="border border-gray-200 p-4 flex items-center gap-4 cursor-pointer hover:border-black transition-colors">
                      <input type="radio" id="jneyes" name="shipping" defaultChecked className="text-black focus:ring-black" />
                      <label htmlFor="jneyes" className="text-sm font-medium uppercase tracking-widest cursor-pointer w-full flex justify-between">
                        <span>Reguler (2-3 Hari)</span>
                        <span>Gratis</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={async () => {
                    const emailInput = document.getElementById('checkout-email') as HTMLInputElement;
                    const email = emailInput?.value || localStorage.getItem('userEmail') || 'guest@example.com';
                    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

                    const newOrder = {
                      orderId: `ORD-${Date.now()}`,
                      total: itemPrice,
                      items: itemName,
                      isGuest: !isLoggedIn
                    };

                    try {
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...newOrder, email })
                      });
                      
                      const data = await res.json();
                      
                      if (res.ok && data.success) {
                        // Keep local fallback
                        if (!isLoggedIn) {
                           const userOrdersStr = localStorage.getItem('user_orders');
                           const userOrders = userOrdersStr ? JSON.parse(userOrdersStr) : [];
                           userOrders.push({
                             id: newOrder.orderId,
                             date: new Date().toISOString().split('T')[0],
                             total: newOrder.total,
                             status: 'Payment Pending',
                             items: newOrder.items
                           });
                           localStorage.setItem('user_orders', JSON.stringify(userOrders));
                        }
                        
                        if (!productId) localStorage.removeItem('cart');
                        
                        if (data.invoiceUrl && data.invoiceUrl !== '/account') {
                           window.location.href = data.invoiceUrl;
                        } else {
                           alert('Pesanan Berhasil! Invoice akan dikirimkan ke email Anda.');
                           window.location.href = '/account';
                        }
                      } else {
                        alert(data.error || 'Terjadi kesalahan saat checkout');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('Gagal menghubungi server.');
                    }
                  }}
                  className="w-full bg-primary text-white py-4 text-sm font-semibold uppercase tracking-widest hover:bg-[#a67c2e] transition-colors"
                >
                  Bayar dengan Xendit
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full mt-4 text-xs font-semibold uppercase tracking-widest opacity-60 hover:opacity-100"
                >
                  Kembali Edit Informasi
                </button>
              </div>
            )}
          </div>

          {/* Checkout Summary */}
          <div className="w-full md:w-80 flex-shrink-0">
             <div className="bg-white p-6 border border-gray-200">
               <h3 className="text-sm font-semibold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Ringkasan</h3>
               <div className="space-y-4 text-sm opacity-80 mb-6">
                 <div className="flex justify-between items-start">
                   <span className="pr-4">{itemName}</span>
                   <span className="whitespace-nowrap">Rp {itemPrice.toLocaleString('id-ID')}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Pengiriman</span>
                   <span>Gratis</span>
                 </div>
               </div>

               {/* Voucher Section */}
               <div className="mb-6 border-t border-gray-100 pt-6">
                 <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Kode Voucher</label>
                 <div className="flex gap-2">
                   <input type="text" placeholder="Masukkan kode" className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black bg-gray-50 focus:bg-white transition-colors uppercase" />
                   <button className="bg-black text-white px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors whitespace-nowrap">Terapkan</button>
                 </div>
                 <button className="text-[10px] uppercase tracking-widest font-semibold text-primary mt-2 hover:underline">Lihat Voucher Tersedia</button>
               </div>

               <div className="flex justify-between font-semibold border-t border-gray-200 pt-4 mb-4">
                 <span>Total Belanja</span>
                 <span>Rp {itemPrice.toLocaleString('id-ID')}</span>
               </div>
               
               <p className="text-[10px] text-gray-400 mt-6 leading-relaxed">
                 Dengan menyelesaikan pesanan, Anda setuju dengan Syarat & Ketentuan serta Kebijakan Privasi kami.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
