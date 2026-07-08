'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SimulationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || 'UNKNOWN';
  const amount = searchParams?.get('amount') || '0';
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (success: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, success })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(success ? 'Payment Successful!' : 'Payment Failed.');
        window.location.href = '/account';
      } else {
        alert('Simulation API failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error simulating payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 border border-gray-200 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">XENDIT (Simulated)</h1>
        <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest">Test Environment</p>
        
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200">
           <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Order ID</p>
           <p className="font-mono text-sm mb-4">{orderId}</p>
           
           <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Amount to Pay</p>
           <p className="font-semibold text-2xl">Rp {Number(amount).toLocaleString('id-ID')}</p>
        </div>
        
        <div className="space-y-4">
           <button 
             onClick={() => handleSimulate(true)}
             disabled={loading}
             className="w-full bg-green-600 text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
           >
             {loading ? 'Processing...' : 'Simulate Success'}
           </button>
           <button 
             onClick={() => handleSimulate(false)}
             disabled={loading}
             className="w-full bg-red-600 text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
           >
             {loading ? 'Processing...' : 'Simulate Failure'}
           </button>
        </div>
        
        <Link href="/checkout" className="block mt-8 text-xs uppercase tracking-widest text-gray-400 hover:text-black">
          Cancel & Return
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSimulationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading simulation...</div>}>
      <SimulationContent />
    </Suspense>
  );
}
