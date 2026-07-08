import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { orderId, success } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const status = success ? 'Paid' : 'Failed';
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error('Payment simulation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
