import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const rows: any = await query('SELECT * FROM orders ORDER BY created_at DESC');
    return NextResponse.json({ success: true, orders: rows });
  } catch (error) {
    console.error('Admin Orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Orders PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
