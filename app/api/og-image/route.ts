import { NextRequest, NextResponse } from 'next/server';
import { query, initializeDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await initializeDatabase();
    const rows = await query('SELECT data FROM store_state ORDER BY id DESC LIMIT 1') as any[];
    if (rows && rows.length > 0) {
      const state = JSON.parse(rows[0].data);
      const ogImage = state.openGraphImage?.data || state.logo?.data;
      
      if (ogImage && ogImage.startsWith('data:image/')) {
        // Extract base64 part
        const matches = ogImage.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const type = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': `image/${type}`,
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      } else if (ogImage && ogImage.startsWith('http')) {
         return NextResponse.redirect(ogImage);
      }
    }
  } catch (error) {
    console.error('Error serving OG image:', error);
  }

  // Fallback image
  return NextResponse.redirect('https://picsum.photos/1200/630');
}
