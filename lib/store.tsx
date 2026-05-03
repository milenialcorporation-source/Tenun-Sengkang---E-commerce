'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreState, HeroSlide, Collection, Product, ImageInput } from './types';

const defaultState: StoreState = {
  heroSlides: [],
  collections: [],
  products: [],
  showOlsera: true,
  profileSlides: [],
  featuredSections: [],
  megaMenuCards: [],
  hamburgerProducts: [],
  hamburgerCollections: [],
  storyTitle: 'Profil Kami',
  storyDescription: 'Terletak di jantung Sulawesi Selatan, Sengkang telah lama dikenal sebagai kota sutra. Sejak tahun 1990, Kain Sutra Sengkang telah berkomitmen untuk melestarikan tradisi luhur ini melalui keahlian dan dedikasi.\n\nKami bekerja berdampingan dengan para pengrajin lokal, memastikan setiap helai benang ditenun dengan presisi dan cinta, menghasilkan karya seni yang tak lekang oleh waktu dan menghargai nilai sejarah. Misi kami adalah menghadirkan kemewahan sutra Sengkang ke seluruh penjuru negeri, menggabungkan desain klasik dengan sentuhan modern.',
  storyImages: [],
};

type StoreContextType = {
  state: StoreState;
  setState: React.Dispatch<React.SetStateAction<StoreState>>;
  savedState: StoreState;
  isLoaded: boolean;
  saveToDb: () => Promise<void>;
  discardChanges: () => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kainsutra_state_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setLocalState] = useState<StoreState>(defaultState);
  const [savedState, setSavedState] = useState<StoreState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoreState;
        const mergedData = { ...defaultState, ...parsed };
        setSavedState(mergedData);
        setLocalState(mergedData);
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
    }
    setIsLoaded(true);
  }, []);

  const saveToDb = async () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      setSavedState(state);
    } catch (error) {
      console.error('Error saving config locally:', error);
      throw error;
    }
  };

  const discardChanges = () => {
    setLocalState(savedState);
  };

  const setState: React.Dispatch<React.SetStateAction<StoreState>> = (value) => {
    setLocalState((prevState) => {
      const newState = typeof value === 'function' ? value(prevState) : value;
      return newState;
    });
  };

  if (!isLoaded) return null; // Or a loader

  return (
    <StoreContext.Provider value={{ state, setState, savedState, isLoaded, saveToDb, discardChanges }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
