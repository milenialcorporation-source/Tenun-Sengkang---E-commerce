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
    
    // Check previous status
    const currentOrders: any[] = await query('SELECT status, items FROM orders WHERE id = ?', [id]);
    
    let shouldReduceStock = false;
    let itemsData: any = null;
    
    if (currentOrders && currentOrders.length > 0) {
      const currentStatus = currentOrders[0].status;
      if (currentStatus !== 'Shipped' && status === 'Shipped') {
        shouldReduceStock = true;
        try {
          itemsData = JSON.parse(currentOrders[0].items);
        } catch(e) {}
      }
    }

    await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    
    if (shouldReduceStock && itemsData && itemsData.list && itemsData.list.length > 0) {
       const stateRows = await query('SELECT data FROM store_state ORDER BY id DESC LIMIT 1');
       if (stateRows && stateRows.length > 0) {
         const state = JSON.parse(stateRows[0].data);
         let stockChanged = false;
         if (state.products) {
           for (const item of itemsData.list) {
             const product = state.products.find((p: any) => p.id === item.id);
             if (product && product.stock !== undefined) {
               product.stock = Math.max(0, product.stock - item.quantity);
               stockChanged = true;
             }
           }
         }
         if (stockChanged) {
           await query('UPDATE store_state SET data = ?', [JSON.stringify(state)]);
         }
       }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Orders PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
