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

export async function generateMetadata(): Promise<Metadata> {
  let openGraphImage = 'https://picsum.photos/1200/630';
  let metaTitle = 'Kain Sutra Sengkang | Luxury Silk';
  let metaDescription = 'Keindahan Kain Sutra Asli dari Sengkang';

  try {
    await initializeDatabase();
    const rows = await query('SELECT data FROM store_state ORDER BY id DESC LIMIT 1') as any[];
    if (rows && rows.length > 0) {
      const state = JSON.parse(rows[0].data);
      if (state.openGraphImage?.data) {
        openGraphImage = state.openGraphImage.data;
      } else if (state.logo?.data) {
        openGraphImage = state.logo.data;
      }
      
      if (state.metaTitle) metaTitle = state.metaTitle;
      if (state.metaDescription) metaDescription = state.metaDescription;
    }
  } catch (error) {
    console.error('Error fetching initial server state for metadata:', error);
  }

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: 'https://khaki-dunlin-111283.hostingersite.com',
      siteName: metaTitle,
      images: [
        {
          url: openGraphImage,
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
  let initialServerState = null;
  
  try {
    await initializeDatabase();
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
