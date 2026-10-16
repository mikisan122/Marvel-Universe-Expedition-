import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { handleFirestoreError, OperationType } from './errorHandling';
import type { Character, FavoriteItem } from '../types/character';

const USERS_COLLECTION = 'users';
const FAVORITES_SUBCOLLECTION = 'favorites';

/**
 * Adds a Marvel character to the user's private favorites subcollection.
 */
export async function addCharacterToFavorites(
  userId: string,
  character: Character
): Promise<FavoriteItem> {
  if (!userId) {
    throw new Error('Debes estar autenticado para guardar favoritos.');
  }

  const charIdStr = String(character.id);
  const favoriteDocPath = `${USERS_COLLECTION}/${userId}/${FAVORITES_SUBCOLLECTION}/${charIdStr}`;

  const favoriteData: FavoriteItem = {
    characterId: character.id,
    name: character.name,
    realName: character.biography?.fullName || '',
    image: character.images?.lg || character.images?.md || character.images?.sm || '',
    publisher: character.biography?.publisher || 'Marvel Comics',
    alignment: character.biography?.alignment || 'good',
    createdAt: new Date().toISOString(),
    powerstats: character.powerstats,
  };

  try {
    const favoriteRef = doc(db, USERS_COLLECTION, userId, FAVORITES_SUBCOLLECTION, charIdStr);
    await setDoc(favoriteRef, favoriteData);
    return favoriteData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, favoriteDocPath);
  }
}

/**
 * Removes a character from the user's favorites subcollection.
 */
export async function removeCharacterFromFavorites(
  userId: string,
  characterId: number
): Promise<void> {
  if (!userId) {
    throw new Error('Debes estar autenticado para modificar favoritos.');
  }

  const charIdStr = String(characterId);
  const favoriteDocPath = `${USERS_COLLECTION}/${userId}/${FAVORITES_SUBCOLLECTION}/${charIdStr}`;

  try {
    const favoriteRef = doc(db, USERS_COLLECTION, userId, FAVORITES_SUBCOLLECTION, charIdStr);
    await deleteDoc(favoriteRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, favoriteDocPath);
  }
}

/**
 * Gets all favorite characters for a user as a one-time fetch.
 */
export async function getUserFavorites(userId: string): Promise<FavoriteItem[]> {
  if (!userId) return [];

  const favoritesPath = `${USERS_COLLECTION}/${userId}/${FAVORITES_SUBCOLLECTION}`;
  try {
    const favoritesRef = collection(db, USERS_COLLECTION, userId, FAVORITES_SUBCOLLECTION);
    const snapshot = await getDocs(favoritesRef);
    return snapshot.docs.map((docSnap) => docSnap.data() as FavoriteItem);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, favoritesPath);
  }
}

/**
 * Subscribes to real-time updates for the user's favorites collection.
 */
export function subscribeToUserFavorites(
  userId: string,
  onUpdate: (favorites: FavoriteItem[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }

  const favoritesPath = `${USERS_COLLECTION}/${userId}/${FAVORITES_SUBCOLLECTION}`;
  const favoritesRef = collection(db, USERS_COLLECTION, userId, FAVORITES_SUBCOLLECTION);

  return onSnapshot(
    favoritesRef,
    (snapshot) => {
      const items: FavoriteItem[] = snapshot.docs.map(
        (docSnap) => docSnap.data() as FavoriteItem
      );
      onUpdate(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, favoritesPath);
    }
  );
}
