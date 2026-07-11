const fs = require('fs');
let content = `import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { orderId, success } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const status = success ? 'Paid' : 'Failed';
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    if (success) {
      const orders = await query('SELECT items FROM orders WHERE id = ?', [orderId]);
      if (orders && orders.length > 0) {
        const itemsStr = orders[0].items;
        try {
          const itemsData = JSON.parse(itemsStr);
          if (itemsData.list && itemsData.list.length > 0) {
            const stateRows = await query('SELECT data FROM store_state ORDER BY id DESC LIMIT 1');
            if (stateRows && stateRows.length > 0) {
              const state = JSON.parse(stateRows[0].data);
              let stockChanged = false;
              if (state.products) {
                for (const item of itemsData.list) {
                  const product = state.products.find((p) => p.id === item.id);
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
        } catch (e) {
          console.error('Failed to parse order items or update stock', e);
        }
      }
    }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error('Payment simulation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;

fs.writeFileSync('app/api/checkout/simulate-payment/route.ts', content);
