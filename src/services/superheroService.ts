import type { Character } from '../types/character';

const BASE_URL = import.meta.env.VITE_SUPERHERO_API_URL || 'https://akabab.github.io/superhero-api/api';

// In-memory cache for the session
let cachedMarvelCharacters: Character[] | null = null;
let fetchPromise: Promise<Character[]> | null = null;

export class SuperheroApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'SuperheroApiError';
  }
}

/**
 * Consumes the Superhero REST Web Service and filters Marvel Comics characters.
 */
export async function fetchAllMarvelCharacters(forceReload = false): Promise<Character[]> {
  if (!forceReload && cachedMarvelCharacters) {
    return cachedMarvelCharacters;
  }

  if (!forceReload && fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}/all.json`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new SuperheroApiError(
          `Error al acceder al archivo central de personajes de Marvel (Código ${response.status})`,
          response.status
        );
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new SuperheroApiError('El archivo central no contiene una lista válida de personajes de Marvel');
      }

      // Filter characters strictly published by Marvel Comics
      const marvelList = (data as Character[]).filter((char) => {
        const publisher = char.biography?.publisher?.trim();
        return publisher === 'Marvel Comics';
      });

      // Filter out characters without names or valid images
      const validatedList = marvelList.filter((char) => {
        return char.name && char.images && (char.images.lg || char.images.md || char.images.sm);
      });

      cachedMarvelCharacters = validatedList;
      return validatedList;
    } catch (error) {
      if (error instanceof SuperheroApiError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new SuperheroApiError(
          'Error de conexión al acceder a los archivos de Marvel. Verifica tu acceso a internet.'
        );
      }
      throw new SuperheroApiError(
        error instanceof Error ? error.message : 'Error desconocido al cargar los personajes de Marvel.'
      );
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * Fetches a single character by numeric ID.
 */
export async function getCharacterById(id: number): Promise<Character | null> {
  const characters = await fetchAllMarvelCharacters();
  const found = characters.find((c) => c.id === id);
  if (found) return found;

  // Fallback to direct REST endpoint if not in filtered list
  try {
    const response = await fetch(`${BASE_URL}/id/${id}.json`);
    if (!response.ok) return null;
    const char: Character = await response.json();
    return char.biography?.publisher === 'Marvel Comics' ? char : null;
  } catch {
    return null;
  }
}

/**
 * Returns a curated list of iconic Marvel characters for the home hero/featured section.
 */
export async function getFeaturedMarvelCharacters(): Promise<Character[]> {
  const characters = await fetchAllMarvelCharacters();
  const iconicNames = [
    'Spider-Man',
    'Iron Man',
    'Wolverine',
    'Thor',
    'Captain America',
    'Scarlet Witch',
    'Deadpool',
    'Thanos',
    'Hulk',
    'Doctor Strange',
    'Black Panther',
    'Magneto',
  ];

  const featured: Character[] = [];
  for (const name of iconicNames) {
    const match = characters.find(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.images?.lg
    );
    if (match && !featured.some((f) => f.id === match.id)) {
      featured.push(match);
    }
  }

  // If some couldn't be matched by exact name, fill from the top
  if (featured.length < 6) {
    for (const char of characters) {
      if (featured.length >= 8) break;
      if (!featured.some((f) => f.id === char.id) && char.images?.lg) {
        featured.push(char);
      }
    }
  }

  return featured;
}

/**
 * Filter, search, and sort utilities
 */
export type AlignmentFilter = 'all' | 'heroes' | 'villains' | 'neutral';
export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'power-desc'
  | 'combat-desc'
  | 'intelligence-desc'
  | 'strength-desc'
  | 'speed-desc'
  | 'durability-desc'
  | 'overall-desc';

export function filterAndSortCharacters(
  characters: Character[],
  query: string,
  alignment: AlignmentFilter,
  sort: SortOption
): Character[] {
  let result = [...characters];

  // 1. Text Search (Name, Real Name, Aliases)
  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery) {
    result = result.filter((char) => {
      const matchName = char.name?.toLowerCase().includes(trimmedQuery);
      const matchReal = char.biography?.fullName?.toLowerCase().includes(trimmedQuery);
      const matchAliases = char.biography?.aliases?.some((a) =>
        a?.toLowerCase().includes(trimmedQuery)
      );
      return matchName || matchReal || matchAliases;
    });
  }

  // 2. Alignment Filter
  if (alignment !== 'all') {
    result = result.filter((char) => {
      const align = char.biography?.alignment?.toLowerCase();
      if (alignment === 'heroes') return align === 'good';
      if (alignment === 'villains') return align === 'bad';
      if (alignment === 'neutral') return align === 'neutral' || align === '-' || !align;
      return true;
    });
  }

  // 3. Sorting
  result.sort((a, b) => {
    switch (sort) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'intelligence-desc':
        return (b.powerstats?.intelligence || 0) - (a.powerstats?.intelligence || 0);
      case 'strength-desc':
        return (b.powerstats?.strength || 0) - (a.powerstats?.strength || 0);
      case 'speed-desc':
        return (b.powerstats?.speed || 0) - (a.powerstats?.speed || 0);
      case 'durability-desc':
        return (b.powerstats?.durability || 0) - (a.powerstats?.durability || 0);
      case 'power-desc':
        return (b.powerstats?.power || 0) - (a.powerstats?.power || 0);
      case 'combat-desc':
        return (b.powerstats?.combat || 0) - (a.powerstats?.combat || 0);
      case 'overall-desc': {
        const sumA = Object.values(a.powerstats || {}).reduce((acc, v) => acc + (v || 0), 0);
        const sumB = Object.values(b.powerstats || {}).reduce((acc, v) => acc + (v || 0), 0);
        return sumB - sumA;
      }
      default:
        return 0;
    }
  });

  return result;
}
