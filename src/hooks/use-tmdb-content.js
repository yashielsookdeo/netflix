import { useEffect, useState } from 'react';
import { tmdbApi } from '../lib/tmdb';

export default function useTMDBContent(target) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        let data = [];

        if (target === 'films') {
          data = await tmdbApi.getAllMovies();
        } else if (target === 'series') {
          data = await tmdbApi.getAllTVShows();
        }

        setContent(data);
      } catch (err) {
        console.error(`Error fetching ${target}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [target]);

  return { [target]: content, loading, error };
}

// Hook for fetching hero content (top-rated item for the category)
export function useHeroContent(category) {
  const [heroContent, setHeroContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        setError(null);

        let topRatedContent = [];

        if (category === 'films') {
          topRatedContent = await tmdbApi.getTopRatedMovies();
        } else if (category === 'series') {
          topRatedContent = await tmdbApi.getTopRatedTVShows();
        }

        // Get the first (highest rated) item for the hero
        if (topRatedContent.length > 0) {
          setHeroContent(topRatedContent[0]);
        }
      } catch (err) {
        console.error(`Error fetching hero content for ${category}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, [category]);

  return { heroContent, loading, error };
}
