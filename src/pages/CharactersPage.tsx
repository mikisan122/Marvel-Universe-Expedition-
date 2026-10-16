import React from 'react';
import { useCharacters } from '../hooks/useCharacters';
import { FilterBar } from '../components/FilterBar';
import { CharacterCard } from '../components/CharacterCard';
import { ChevronLeft, ChevronRight, AlertTriangle, RefreshCw, SearchX, Loader2 } from 'lucide-react';

export const CharactersPage: React.FC = () => {
  const {
    characters,
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
  } = useCharacters(16);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    setPage(pageNumber);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Generate pagination window
  const getPaginationNumbers = () => {
    const range: number[] = [];
    const delta = 2;
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    const numbers: (number | string)[] = [1];
    if (range.length > 0 && range[0] > 2) {
      numbers.push('...');
    }
    numbers.push(...range);
    if (range.length > 0 && range[range.length - 1] < totalPages - 1) {
      numbers.push('...');
    }
    if (totalPages > 1) {
      numbers.push(totalPages);
    }
    return numbers;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#222222] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[#ED1D24] text-xs font-bold uppercase tracking-widest block mb-1">
            Archivo Oficial Marvel
          </span>
          <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-wider uppercase leading-none">
            EXPEDIENTES DE PERSONAJES
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">
            Catálogo completo de personajes de Marvel Comics. Explora sus identidades secretas,
            atributos de combate y organiza tus favoritos.
          </p>
        </div>

        <button
          onClick={reload}
          disabled={loading}
          className="self-start md:self-auto flex items-center space-x-2 bg-[#181818] hover:bg-[#252525] border border-[#333333] hover:border-[#ED1D24] text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white px-4 py-2.5 transition-colors"
          title="Actualizar archivo clasificado"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ED1D24]' : ''}`} />
          <span>Actualizar Archivo</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        alignment={alignment}
        onAlignmentChange={setAlignment}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalResults={totalResults}
      />

      {/* Content Rendering: Loading, Error, Empty, or Characters Grid */}
      {loading ? (
        <div className="space-y-8">
          <div className="flex items-center justify-center space-x-3 py-12 text-gray-400">
            <Loader2 className="w-8 h-8 text-[#ED1D24] animate-spin" />
            <span className="font-oswald text-lg uppercase tracking-wider">
              Accediendo a los archivos clasificados de Marvel...
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-[#121212] border border-[#222222] h-96 animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="bg-[#1a1a1a] w-full h-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="bg-[#1a1a1a] h-5 w-3/4" />
                  <div className="bg-[#1a1a1a] h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-[#161111] border border-red-900/60 p-8 text-center space-y-4 max-w-2xl mx-auto my-12">
          <AlertTriangle className="w-12 h-12 text-[#ED1D24] mx-auto" />
          <h2 className="font-oswald text-2xl text-white uppercase tracking-wider font-bold">
            Falla de Acceso al Archivo
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{error}</p>
          <button
            onClick={reload}
            className="px-6 py-2.5 bg-[#ED1D24] hover:bg-red-700 text-white font-oswald text-xs uppercase tracking-wider font-bold transition-colors"
          >
            Reintentar Acceso
          </button>
        </div>
      ) : characters.length === 0 ? (
        <div className="bg-[#121212] border border-[#222222] p-12 text-center space-y-4 max-w-xl mx-auto my-12">
          <SearchX className="w-12 h-12 text-gray-500 mx-auto" />
          <h2 className="font-oswald text-2xl text-white uppercase tracking-wider font-bold">
            Sin Resultados Encontrados
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No se encontraron personajes que coincidan con &ldquo;<span className="text-white font-semibold">{searchQuery}</span>&rdquo;
            {alignment !== 'all' && ` con el filtro de bando seleccionado.`}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setAlignment('all');
            }}
            className="px-6 py-2.5 bg-[#181818] hover:bg-[#ED1D24] border border-[#333333] hover:border-[#ED1D24] text-white font-oswald text-xs uppercase tracking-wider font-bold transition-colors"
          >
            Limpiar Filtros y Búsqueda
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Characters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#1f1f1f]">
              <div className="text-xs text-gray-400 font-mono">
                Página <span className="text-white font-bold">{page}</span> de{' '}
                <span className="text-white font-bold">{totalPages}</span> — (
                {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, totalResults)} de {totalResults} personajes)
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-3 py-2 bg-[#181818] border border-[#2e2e2e] text-gray-300 hover:text-white hover:border-[#ED1D24] disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <div className="flex items-center space-x-1">
                  {getPaginationNumbers().map((num, idx) =>
                    typeof num === 'number' ? (
                      <button
                        key={idx}
                        onClick={() => handlePageSelect(num)}
                        className={`w-9 h-9 text-xs font-bold font-mono transition-colors ${
                          num === page
                            ? 'bg-[#ED1D24] text-white border border-[#ED1D24]'
                            : 'bg-[#181818] border border-[#2e2e2e] text-gray-300 hover:text-white hover:border-[#ED1D24]'
                        }`}
                      >
                        {num}
                      </button>
                    ) : (
                      <span key={idx} className="px-2 text-gray-500 font-mono">
                        ...
                      </span>
                    )
                  )}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="px-3 py-2 bg-[#181818] border border-[#2e2e2e] text-gray-300 hover:text-white hover:border-[#ED1D24] disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
