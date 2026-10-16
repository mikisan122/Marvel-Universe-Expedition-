import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchAllMarvelCharacters,
  filterAndSortCharacters,
  type AlignmentFilter,
  type SortOption,
} from '../services/superheroService';
import type { Character } from '../types/character';

interface UseCharactersReturn {
  characters: Character[];
  allCharacters: Character[];
  filteredCharacters: Character[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  alignment: AlignmentFilter;
  setAlignment: (a: AlignmentFilter) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  pageSize: number;
  reload: () => Promise<void>;
}

export function useCharacters(initialPageSize = 16): UseCharactersReturn {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [alignment, setAlignment] = useState<AlignmentFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [page, setPage] = useState<number>(1);
  const pageSize = initialPageSize;

  const loadData = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllMarvelCharacters(force);
      setAllCharacters(data);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener los personajes de Marvel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page when search, filter or sort changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, alignment, sortBy]);

  // Filtered & sorted character list
  const filteredCharacters = useMemo(() => {
    return filterAndSortCharacters(allCharacters, searchQuery, alignment, sortBy);
  }, [allCharacters, searchQuery, alignment, sortBy]);

  const totalResults = filteredCharacters.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  // Paginated slice for current page
  const characters = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredCharacters.slice(startIndex, startIndex + pageSize);
  }, [filteredCharacters, page, pageSize]);

  const reload = useCallback(() => loadData(true), [loadData]);

  return {
    characters,
    allCharacters,
    filteredCharacters,
    totalResults,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    alignment,
    setAlignment,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    pageSize,
    reload,
  };
}
