import { NextResponse } from 'next/server';
import { query, initializeDatabase } from '@/lib/db';

let initialized = false;

export async function GET() {
  try {
    if (!initialized) {
      await initializeDatabase();
      initialized = true;
    }
    
    const rows = await query('SELECT data FROM store_state ORDER BY id DESC LIMIT 1') as any[];
    
    if (rows && rows.length > 0) {
      return NextResponse.json(JSON.parse(rows[0].data));
    }
    
    return NextResponse.json({});
  } catch (error) {
    console.error('Error fetching state from DB:', error);
    return NextResponse.json({ error: 'Failed to fetch state' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!initialized) {
      await initializeDatabase();
      initialized = true;
    }
    
    const body = await request.json();
    
    // We update the single row (we can just ensure there's only one row or always update id 1)
    await query('UPDATE store_state SET data = ? WHERE id = 1', [JSON.stringify(body)]);
    
    // If no rows were affected (e.g. table was empty and id=1 didn't exist), insert it
    // Using a simple check to be safe
    const rows = await query('SELECT COUNT(*) as count FROM store_state') as any[];
    if (rows[0].count === 0) {
      await query('INSERT INTO store_state (data) VALUES (?)', [JSON.stringify(body)]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving state to DB:', error);
    return NextResponse.json({ error: 'Failed to save state' }, { status: 500 });
  }
}
