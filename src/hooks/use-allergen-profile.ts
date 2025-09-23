"use client";

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lilunch-allergens';

export function useAllergenProfile() {
  const [selectedAllergens, setSelectedAllergens] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedAllergens = window.localStorage.getItem(STORAGE_KEY);
      if (storedAllergens) {
        setSelectedAllergens(new Set(JSON.parse(storedAllergens)));
      }
    } catch (error) {
      console.error("Failed to load allergens from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(selectedAllergens)));
      } catch (error) {
        console.error("Failed to save allergens to localStorage", error);
      }
    }
  }, [selectedAllergens, isLoaded]);

  const toggleAllergen = useCallback((allergenId: string) => {
    setSelectedAllergens(prev => {
      const newSet = new Set(prev);
      if (newSet.has(allergenId)) {
        newSet.delete(allergenId);
      } else {
        newSet.add(allergenId);
      }
      return newSet;
    });
  }, []);

  const isAllergenSelected = useCallback((allergenId: string) => {
    return selectedAllergens.has(allergenId);
  }, [selectedAllergens]);

  return {
    selectedAllergens,
    toggleAllergen,
    isAllergenSelected,
    isLoaded,
  };
}
