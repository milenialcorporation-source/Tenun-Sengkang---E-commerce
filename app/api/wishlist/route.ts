import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    const rows: any = await query('SELECT product_id FROM wishlist WHERE user_email = ?', [email]);
    const productIds = rows.map((row: any) => row.product_id);

    return NextResponse.json({ success: true, wishlist: productIds });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, productId, action } = await req.json();

    if (!email || !productId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (action === 'add') {
      try {
        await query(
          'INSERT INTO wishlist (user_email, product_id) VALUES (?, ?)',
          [email, productId]
        );
      } catch (e: any) {
        if (e.code !== 'ER_DUP_ENTRY') throw e;
      }
    } else if (action === 'remove') {
      await query(
        'DELETE FROM wishlist WHERE user_email = ? AND product_id = ?',
        [email, productId]
      );
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // return new list
    const rows: any = await query('SELECT product_id FROM wishlist WHERE user_email = ?', [email]);
    const productIds = rows.map((row: any) => row.product_id);

    return NextResponse.json({ success: true, wishlist: productIds });
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
