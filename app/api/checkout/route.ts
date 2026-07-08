import { NextResponse } from 'next/server';
import Xendit from 'xendit-node';
import { query } from '@/lib/db';

const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY || 'xnd_development_dummy' });
const { Invoice } = xenditClient;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, total, items, orderId, isGuest } = body;

    if (!total || !items || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Attempt to store in DB
    if (email) {
      try {
        await query(
          'INSERT INTO orders (id, user_email, total, status, items) VALUES (?, ?, ?, ?, ?)',
          [orderId, email, total, 'Pending', items]
        );
      } catch (dbError) {
        console.error('Failed to store order in database:', dbError);
        // Continue processing payment even if DB store fails (for guest checkout)
      }
    }

    // KiriminAja Dummy Call (Simulated for Shipping)
    // Real implementation would call KiriminAja API and add shipping cost to total
    const shippingCost = 0; 
    
    // Create Invoice with Xendit
    if (!process.env.XENDIT_SECRET_KEY) {
      console.warn("XENDIT_SECRET_KEY is missing, returning mock redirect.");
      return NextResponse.json({ 
        success: true, 
        invoiceUrl: `/checkout/payment-simulation?orderId=${orderId}invoiceUrl: '/account', // Redirect locally for demoamount=${Number(total) + shippingCost}`,
        orderId 
      });
    }

    const invoiceRes = await Invoice.createInvoice({
      data: {
        externalId: orderId,
        amount: Number(total) + shippingCost,
        payerEmail: email || 'guest@example.com',
        description: `Order Checkout ${orderId}`,
        invoiceDuration: 86400,
      }
    });

    return NextResponse.json({ 
      success: true, 
      invoiceUrl: invoiceRes.invoiceUrl,
      orderId 
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
