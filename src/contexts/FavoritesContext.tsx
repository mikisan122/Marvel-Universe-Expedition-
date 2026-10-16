import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  addCharacterToFavorites,
  removeCharacterFromFavorites,
  subscribeToUserFavorites,
} from '../services/favoritesService';
import type { Character, FavoriteItem } from '../types/character';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  favoriteIds: Set<number>;
  loading: boolean;
  toggleFavorite: (character: Character) => Promise<boolean>;
  removeFavorite: (characterId: number) => Promise<void>;
  isFavorite: (characterId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Subscribe to real-time changes in Firestore when user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserFavorites(
      user.uid,
      (items) => {
        setFavorites(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error in favorites subscription:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const favoriteIds = useMemo(() => {
    return new Set<number>(favorites.map((f) => f.characterId));
  }, [favorites]);

  const isFavorite = (characterId: number): boolean => {
    return favoriteIds.has(characterId);
  };

  const toggleFavorite = async (character: Character): Promise<boolean> => {
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar a favoritos.');
    }

    const currentlyFavorite = isFavorite(character.id);
    if (currentlyFavorite) {
      await removeCharacterFromFavorites(user.uid, character.id);
      return false; // Removed
    } else {
      await addCharacterToFavorites(user.uid, character);
      return true; // Added
    }
  };

  const removeFavorite = async (characterId: number): Promise<void> => {
    if (!user) return;
    await removeCharacterFromFavorites(user.uid, characterId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        loading,
        toggleFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser utilizado dentro de un FavoritesProvider');
  }
  return context;
};
