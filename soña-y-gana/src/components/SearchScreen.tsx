import React, { useState, useMemo } from 'react';
import type { Dream } from '../types';
import { SearchIcon } from './Icons';

interface SearchScreenProps {
  dreams: Dream[];
  onSearch: (dream: Dream) => void;
}

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const SearchScreen: React.FC<SearchScreenProps> = ({ dreams, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const normalizedSearch = normalizeText(searchTerm.trim());
    
    // Check if input is purely numeric
    if (/^\d+$/.test(normalizedSearch)) {
        return dreams.filter(dream => dream.numero.startsWith(normalizedSearch)).slice(0, 6);
    }
    
    // Otherwise, search by word
    return dreams.filter(dream => normalizeText(dream.palabra).includes(normalizedSearch)).slice(0, 6);
  }, [searchTerm, dreams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if(error) setError(null);
  };

  const handleSuggestionClick = (dream: Dream) => {
    setSearchTerm(dream.palabra);
    onSearch(dream);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const normalizedSearch = normalizeText(searchTerm.trim());

    // Prioritize exact match
    const exactMatch = dreams.find(dream => 
      normalizeText(dream.palabra) === normalizedSearch || dream.numero === normalizedSearch
    );

    if (exactMatch) {
      onSearch(exactMatch);
    } else if (suggestions.length > 0) {
      // If no exact match but suggestions exist, take the first one
      onSearch(suggestions[0]);
    } else {
      setError('No lo encontramos. Probá con otra palabra o número.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Escribí una palabra (agua) o un número (01)"
            className="w-full pl-4 pr-12 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full bg-light dark:bg-dark focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent outline-none transition-all"
            autoComplete="off"
          />
          <button type="submit" className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-primary dark:hover:text-accent transition-colors rounded-full">
            <SearchIcon className="h-6 w-6" />
          </button>
        </div>
        
        {suggestions.length > 0 && searchTerm.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
            {suggestions.map((dream) => (
              <li key={dream.numero}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(dream)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold">{dream.palabra}</span> - <span className="text-gray-500 dark:text-gray-400">{dream.numero}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default SearchScreen;
