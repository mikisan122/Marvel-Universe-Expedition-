import { useState, useEffect } from 'react';
import { getCharacterById } from '../services/superheroService';
import type { Character } from '../types/character';

export function useCharacterDetail(characterId: number | undefined) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId || isNaN(characterId)) {
      setLoading(false);
      setError('Identificador de personaje inválido.');
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    getCharacterById(characterId)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError('El personaje de Marvel no fue encontrado.');
        } else {
          setCharacter(data);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Error al obtener los detalles del personaje.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [characterId]);

  return { character, loading, error };
}
