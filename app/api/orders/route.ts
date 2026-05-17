import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    const rows: any = await query('SELECT * FROM orders WHERE user_email = ? ORDER BY created_at DESC', [email]);
    
    return NextResponse.json({ success: true, orders: rows });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, orderId, total, items } = await req.json();

    if (!email || !orderId || !total || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await query(
      'INSERT INTO orders (id, user_email, total, status, items) VALUES (?, ?, ?, ?, ?)',
      [orderId, email, total, 'Processing', items]
    );

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
