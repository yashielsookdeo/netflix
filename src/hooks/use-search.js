import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { tmdbApi } from '../lib/tmdb';

export default function useSearch(slides, category, searchTerm) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        
        try {
          // First, search locally in current slides
          const allItems = slides[category]?.flatMap(slideItem => 
            slideItem.data.map(item => ({
              ...item,
              slideTitle: slideItem.title
            }))
          ) || [];

          const fuse = new Fuse(allItems, { 
            keys: ['title', 'description', 'genre', 'slideTitle'],
            threshold: 0.3,
            includeScore: true
          });

          const localResults = fuse.search(searchTerm).map(({ item }) => item);

          // Then, search TMDB API for additional results
          let tmdbResults = [];
          if (searchTerm.length > 3) {
            if (category === 'films') {
              tmdbResults = await tmdbApi.searchMovies(searchTerm);
            } else if (category === 'series') {
              tmdbResults = await tmdbApi.searchTVShows(searchTerm);
            } else {
              tmdbResults = await tmdbApi.searchMulti(searchTerm);
            }
          }

          // Combine and deduplicate results
          const combinedResults = [...localResults];
          
          // Add TMDB results that aren't already in local results
          tmdbResults.forEach(tmdbItem => {
            const exists = localResults.some(localItem => 
              localItem.tmdb_id === tmdbItem.tmdb_id || 
              localItem.title.toLowerCase() === tmdbItem.title.toLowerCase()
            );
            if (!exists) {
              combinedResults.push(tmdbItem);
            }
          });

          if (combinedResults.length > 0) {
            setSearchResults([{
              title: `Search Results for "${searchTerm}" (${combinedResults.length} found)`,
              data: combinedResults.slice(0, 20) // Limit to 20 results
            }]);
          } else {
            setSearchResults([{
              title: `No results found for "${searchTerm}"`,
              data: []
            }]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([{
            title: `Search error for "${searchTerm}"`,
            data: []
          }]);
        } finally {
          setIsSearching(false);
        }
      } else {
        // Search term too short, clear results
        setSearchResults([]);
        setIsSearching(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, slides, category]);

  return { searchResults, isSearching };
}
