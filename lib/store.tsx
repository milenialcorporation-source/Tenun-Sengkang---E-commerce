'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreState, HeroSlide, Collection, Product, ImageInput } from './types';
import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

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

const CONFIG_DOC_ID = 'main';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setLocalState] = useState<StoreState>(defaultState);
  const [savedState, setSavedState] = useState<StoreState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'config', CONFIG_DOC_ID);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as StoreState;
        const mergedData = { ...defaultState, ...data };
        setSavedState(mergedData);
        setLocalState(mergedData); // Sync local state when remote updates
      } else {
        // Initialize if it doesn't exist
        setDoc(docRef, defaultState).catch((err) => {
          // Ignore permission-denied errors on initialization (expected for non-admins)
          if (err.code !== 'permission-denied') {
            console.error('Failed to initialize config:', err);
          }
        });
      }
      setIsLoaded(true);
    }, (error) => {
      console.error('Error listening to config:', error);
      // Fallback to local state if offline/error
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const saveToDb = async () => {
    try {
      await setDoc(doc(db, 'config', CONFIG_DOC_ID), state, { merge: true });
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
      // Removed auto save
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
