import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { query, initializeDatabase } from '@/lib/db';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Kain Sutra Sengkang | Luxury Silk',
  description: 'Keindahan Kain Sutra Asli dari Sengkang',
  openGraph: {
    title: 'Kain Sutra Sengkang | Luxury Silk',
    description: 'Keindahan Kain Sutra Asli dari Sengkang',
    url: 'https://khaki-dunlin-111283.hostingersite.com',
    siteName: 'Kain Sutra Sengkang',
    images: [
      {
        url: 'https://picsum.photos/1200/630',
        width: 1200,
        height: 630,
        alt: 'Kain Sutra Sengkang',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

let dbInitialized = false;

// We use dynamic rendering to ensure fresh data, but cache could be tweaked.
export const dynamic = 'force-dynamic';

export default async function RootLayout({children}: {children: React.ReactNode}) {
  let initialServerState = null;
  
  try {
    if (!dbInitialized) {
      await initializeDatabase();
      dbInitialized = true;
    }
    const rows = await query('SELECT data FROM store_state ORDER BY id DESC LIMIT 1') as any[];
    if (rows && rows.length > 0) {
      initialServerState = JSON.parse(rows[0].data);
    }
  } catch (error) {
    console.error('Error fetching initial server state:', error);
  }

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col">
        <StoreProvider initialServerState={initialServerState}>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
