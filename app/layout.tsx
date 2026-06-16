import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { query, initializeDatabase } from '@/lib/db';
import { cache } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

const getStoreState = cache(async () => {
  try {
    await initializeDatabase();
    const rows = await query('SELECT data FROM store_state ORDER BY id DESC LIMIT 1') as any[];
    if (rows && rows.length > 0) {
      return JSON.parse(rows[0].data);
    }
  } catch (error) {
    console.error('Error fetching initial server state:', error);
  }
  return null;
});

export async function generateMetadata(): Promise<Metadata> {
  let metaTitle = 'Kain Sutra Sengkang | Luxury Silk';
  let metaDescription = 'Keindahan Kain Sutra Asli dari Sengkang';

  const state = await getStoreState();
  if (state) {
    if (state.metaTitle) metaTitle = state.metaTitle;
    if (state.metaDescription) metaDescription = state.metaDescription;
  }

  const siteUrl = 'https://khaki-dunlin-111283.hostingersite.com';

  return {
    metadataBase: new URL(siteUrl),
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: siteUrl,
      siteName: metaTitle,
      images: [
        {
          url: '/api/og-image', // Next.js will resolve this against metadataBase
          width: 800,
          height: 800,
          alt: metaTitle,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
  };
}

// We use dynamic rendering to ensure fresh data, but cache could be tweaked.
export const dynamic = 'force-dynamic';

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const initialServerState = await getStoreState();

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

