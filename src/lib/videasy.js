// Videasy streaming service
export const videasyService = {
  // Base URL for Videasy player
  baseUrl: 'https://player.videasy.net',

  // Generate movie streaming URL
  getMovieUrl: (tmdbId, options = {}) => {
    const { color = '8B5CF6', progress = 0 } = options;
    let url = `${videasyService.baseUrl}/movie/${tmdbId}`;
    
    const params = new URLSearchParams();
    if (color) params.append('color', color);
    if (progress > 0) params.append('progress', progress);
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  },

  // Generate TV show streaming URL
  getTVShowUrl: (tmdbId, season = 1, episode = 1, options = {}) => {
    const { 
      color = '8B5CF6', 
      progress = 0, 
      nextEpisode = true, 
      episodeSelector = true, 
      autoplayNextEpisode = false 
    } = options;
    
    let url = `${videasyService.baseUrl}/tv/${tmdbId}/${season}/${episode}`;
    
    const params = new URLSearchParams();
    if (color) params.append('color', color);
    if (progress > 0) params.append('progress', progress);
    if (nextEpisode) params.append('nextEpisode', 'true');
    if (episodeSelector) params.append('episodeSelector', 'true');
    if (autoplayNextEpisode) params.append('autoplayNextEpisode', 'true');
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  },

  // Generate streaming URL based on content type
  getStreamingUrl: (content, options = {}) => {
    if (!content || !content.tmdb_id) {
      console.warn('Content or TMDB ID missing for streaming URL generation');
      return null;
    }

    // Check if it's a TV show (has first_air_date) or movie (has release_date)
    if (content.first_air_date) {
      // It's a TV show
      return videasyService.getTVShowUrl(content.tmdb_id, 1, 1, options);
    } else {
      // It's a movie
      return videasyService.getMovieUrl(content.tmdb_id, options);
    }
  },

  // Create iframe element for embedding
  createIframe: (streamingUrl, options = {}) => {
    const { width = '100%', height = '100%', className = '' } = options;
    
    const iframe = document.createElement('iframe');
    iframe.src = streamingUrl;
    iframe.width = width;
    iframe.height = height;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.allow = 'encrypted-media';
    if (className) iframe.className = className;
    
    return iframe;
  },

  // Setup progress tracking listener
  setupProgressTracking: (callback) => {
    const handleMessage = (event) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          if (callback && typeof callback === 'function') {
            callback(data);
          }
        }
      } catch (error) {
        console.error('Error parsing Videasy progress data:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  },

  // Save progress to localStorage
  saveProgress: (contentId, progressData) => {
    try {
      const key = `videasy_progress_${contentId}`;
      localStorage.setItem(key, JSON.stringify({
        ...progressData,
        lastUpdated: Date.now()
      }));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  // Load progress from localStorage
  loadProgress: (contentId) => {
    try {
      const key = `videasy_progress_${contentId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  },

  // Get responsive container styles
  getResponsiveContainerStyle: () => ({
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden'
  }),

  // Get responsive iframe styles
  getResponsiveIframeStyle: () => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  })
};
