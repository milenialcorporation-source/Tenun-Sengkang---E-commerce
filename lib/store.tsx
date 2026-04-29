'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreState, HeroSlide, Collection, Product, ImageInput } from './types';

const defaultState: StoreState = {
  heroSlides: [
    {
      id: '1',
      title: 'Tiga Dimensi Keindahan',
      subtitle: 'Koleksi Eksklusif Sengkang',
      ctaText: 'Belanja Sekarang',
      image: { type: 'url', data: 'https://picsum.photos/seed/kain1/1920/1080' },
    },
     {
      id: '2',
      title: 'Warisan Tenun Asli',
      subtitle: 'Dibuat dengan Dedikasi',
      ctaText: 'Lihat Lookbook',
      image: { type: 'url', data: 'https://picsum.photos/seed/kain2/1920/1080' },
    }
  ],
  collections: [
    { id: 'c1', name: 'Lagosi', description: 'Motif klasik yang mewah', image: { type: 'url', data: 'https://picsum.photos/seed/col1/800/1000' } },
    { id: 'c2', name: 'Cobba', description: 'Elegan dan berani', image: { type: 'url', data: 'https://picsum.photos/seed/col2/800/1000' } },
    { id: 'c3', name: 'Balo Renni', description: 'Detail yang memikat', image: { type: 'url', data: 'https://picsum.photos/seed/col3/800/1000' } },
  ],
  products: [
    { id: 'p1', name: 'Sutra Lagosi Premium', price: 1500000, description: 'Kain sutra sengkang premium', category: 'Lagosi', isManual: true, image: { type: 'url', data: 'https://picsum.photos/seed/p1/600/800' } },
    { id: 'p2', name: 'Sutra Cobba Emas', price: 1200000, description: 'Kilau emas menawan', category: 'Cobba', isManual: true, image: { type: 'url', data: 'https://picsum.photos/seed/p2/600/800' } },
    { id: 'p3', name: 'Balo Renni Hitam', price: 950000, description: 'Minimalis namum mewah', category: 'Balo Renni', isManual: true, image: { type: 'url', data: 'https://picsum.photos/seed/p3/600/800' } },
    { id: 'p4', name: 'Sutra Pucuk Rebung', price: 1800000, description: 'Motif pucuk rebung asli', category: 'Lagosi', isManual: true, image: { type: 'url', data: 'https://picsum.photos/seed/p4/600/800' } },
  ],
  showOlsera: true,
  profileSlides: [
    { type: 'url', data: 'https://picsum.photos/seed/brandprofile1/800/1000' },
    { type: 'url', data: 'https://picsum.photos/seed/brandprofile2/800/1000' },
    { type: 'url', data: 'https://picsum.photos/seed/brandprofile3/800/1000' },
  ],
  featuredSections: [
    {
      id: 'fs1',
      title: 'New Designs',
      type: 'products',
      productIds: ['p1', 'p2', 'p3', 'p4'],
    }
  ],
  megaMenuCards: [
    { id: 'mm1', title: 'Pesona Balo Renni', image: { type: 'url', data: 'https://picsum.photos/seed/radiance/800/500' }, link: '/shop' },
    { id: 'mm2', title: 'Desain Terbaru', image: { type: 'url', data: 'https://picsum.photos/seed/newdesigns/800/500' }, link: '/shop' }
  ],
};

type StoreContextType = {
  state: StoreState;
  setState: React.Dispatch<React.SetStateAction<StoreState>>;
  isLoaded: boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kainSutraStore');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => setState(parsed));
      } catch (e) {
        console.error('Failed to parse state from localStorage');
      }
    }
    queueMicrotask(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kainSutraStore', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  if (!isLoaded) return null; // Or a loader

  return (
    <StoreContext.Provider value={{ state, setState, isLoaded }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
