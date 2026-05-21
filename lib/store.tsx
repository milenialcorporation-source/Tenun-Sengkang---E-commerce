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

export function StoreProvider({ children, initialServerState }: { children: React.ReactNode, initialServerState?: StoreState | null }) {
  const initialStateToUse = initialServerState ? { ...defaultState, ...initialServerState } : defaultState;
  
  // ensure arrays
  initialStateToUse.heroSlides = Array.isArray(initialStateToUse.heroSlides) ? initialStateToUse.heroSlides : [];
  initialStateToUse.collections = Array.isArray(initialStateToUse.collections) ? initialStateToUse.collections : [];
  initialStateToUse.products = Array.isArray(initialStateToUse.products) ? initialStateToUse.products : [];
  initialStateToUse.featuredSections = Array.isArray(initialStateToUse.featuredSections) ? initialStateToUse.featuredSections : [];
  initialStateToUse.megaMenuCards = Array.isArray(initialStateToUse.megaMenuCards) ? initialStateToUse.megaMenuCards : [];
  initialStateToUse.hamburgerProducts = Array.isArray(initialStateToUse.hamburgerProducts) ? initialStateToUse.hamburgerProducts : [];
  initialStateToUse.hamburgerCollections = Array.isArray(initialStateToUse.hamburgerCollections) ? initialStateToUse.hamburgerCollections : [];
  initialStateToUse.storyImages = Array.isArray(initialStateToUse.storyImages) ? initialStateToUse.storyImages : [];
  initialStateToUse.profileSlides = Array.isArray(initialStateToUse.profileSlides) ? initialStateToUse.profileSlides : [];

  const [state, setLocalState] = useState<StoreState>(initialStateToUse);
  const [savedState, setSavedState] = useState<StoreState>(initialStateToUse);
  // If we have initialServerState, we consider it loaded immediately.
  const [isLoaded, setIsLoaded] = useState(!!initialServerState);

  useEffect(() => {
    if (initialServerState) {
      // If we got state from server, optionally sync local storage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialServerState));
      } catch(e) {}
      return; // Skip client side fetching if server provided it
    }

    const loadState = async () => {
      try {
        // Try fetching from MySQL via our API route
        const response = await fetch('/api/state?t=' + Date.now(), { 
          cache: 'no-store'
        });

        if (response.ok) {
          const fetchedState = await response.json();
          if (Object.keys(fetchedState).length > 0) {
             const mergedData = { ...defaultState, ...fetchedState };
             // Ensure arrays are present to avoid crashes
             mergedData.heroSlides = Array.isArray(mergedData.heroSlides) ? mergedData.heroSlides : [];
             mergedData.collections = Array.isArray(mergedData.collections) ? mergedData.collections : [];
             mergedData.products = Array.isArray(mergedData.products) ? mergedData.products : [];
             mergedData.featuredSections = Array.isArray(mergedData.featuredSections) ? mergedData.featuredSections : [];
             mergedData.megaMenuCards = Array.isArray(mergedData.megaMenuCards) ? mergedData.megaMenuCards : [];
             mergedData.hamburgerProducts = Array.isArray(mergedData.hamburgerProducts) ? mergedData.hamburgerProducts : [];
             mergedData.hamburgerCollections = Array.isArray(mergedData.hamburgerCollections) ? mergedData.hamburgerCollections : [];
             mergedData.storyImages = Array.isArray(mergedData.storyImages) ? mergedData.storyImages : [];
             mergedData.profileSlides = Array.isArray(mergedData.profileSlides) ? mergedData.profileSlides : [];

             setSavedState(mergedData);
             setLocalState(mergedData);
             setIsLoaded(true);
             return;
          }
        }
      } catch (error) {
        console.error('Failed to load from MySQL API:', error);
      }

      // Fallback to local storage if API fails or is empty
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoreState;
          const mergedData = { ...defaultState, ...parsed };
             mergedData.heroSlides = Array.isArray(mergedData.heroSlides) ? mergedData.heroSlides : [];
             mergedData.collections = Array.isArray(mergedData.collections) ? mergedData.collections : [];
             mergedData.products = Array.isArray(mergedData.products) ? mergedData.products : [];
             mergedData.featuredSections = Array.isArray(mergedData.featuredSections) ? mergedData.featuredSections : [];
             mergedData.megaMenuCards = Array.isArray(mergedData.megaMenuCards) ? mergedData.megaMenuCards : [];
             mergedData.hamburgerProducts = Array.isArray(mergedData.hamburgerProducts) ? mergedData.hamburgerProducts : [];
             mergedData.hamburgerCollections = Array.isArray(mergedData.hamburgerCollections) ? mergedData.hamburgerCollections : [];
             mergedData.storyImages = Array.isArray(mergedData.storyImages) ? mergedData.storyImages : [];
             mergedData.profileSlides = Array.isArray(mergedData.profileSlides) ? mergedData.profileSlides : [];
          setSavedState(mergedData);
          setLocalState(mergedData);
        }
      } catch (e) {
        console.error('Failed to load from local storage', e);
      }
      setIsLoaded(true);
    };

    loadState();
  }, []);

  const saveToDb = async () => {
    try {
      // Save locally as a fallback
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn("Local storage full, proceeding to save to DB only", e);
      }
      setSavedState(state);

      // Save to MySQL
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error('Error saving config:', error);
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

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
