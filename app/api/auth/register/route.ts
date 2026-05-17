import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const result: any = await query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      return NextResponse.json({ success: true, userId: result.insertId, name, email }, { status: 201 });
    } catch (dbError: any) {
      if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
