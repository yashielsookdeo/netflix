import React, { useState, useContext, createContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Container, Button, Overlay, Inner, Close } from './styles/player';
import { videasyService } from '../../lib/videasy';
import { FeatureContext } from '../card';

export const PlayerContext = createContext();

export default function Player({ children, ...restProps }) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <PlayerContext.Provider value={{ showPlayer, setShowPlayer }}>
      <Container {...restProps}>{children}</Container>
    </PlayerContext.Provider>
  );
}

Player.Video = function PlayerVideo({ ...restProps }) {
  const { showPlayer, setShowPlayer } = useContext(PlayerContext);
  const { itemFeature } = useContext(FeatureContext);
  const [streamingUrl, setStreamingUrl] = useState('');

  useEffect(() => {
    if (itemFeature && itemFeature.tmdb_id && showPlayer) {
      // Load saved progress
      const savedProgress = videasyService.loadProgress(itemFeature.tmdb_id);
      const progressSeconds = savedProgress ? savedProgress.timestamp : 0;

      // Generate streaming URL with progress
      const url = videasyService.getStreamingUrl(itemFeature, {
        progress: progressSeconds,
        color: 'E50914' // Netflix red
      });

      setStreamingUrl(url);

      // Setup progress tracking
      const cleanup = videasyService.setupProgressTracking((progressData) => {
        videasyService.saveProgress(itemFeature.tmdb_id, progressData);
      });

      return cleanup;
    }
  }, [itemFeature, showPlayer]);

  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay, not the iframe
    if (e.target === e.currentTarget) {
      setShowPlayer(false);
    }
  };

  return showPlayer && streamingUrl
    ? ReactDOM.createPortal(
        <Overlay onClick={handleOverlayClick} data-testid="player">
          <Inner>
            <div style={videasyService.getResponsiveContainerStyle()}>
              <iframe
                src={streamingUrl}
                style={videasyService.getResponsiveIframeStyle()}
                frameBorder="0"
                allowFullScreen
                allow="encrypted-media"
                title={`${itemFeature?.title || 'Video'} Player`}
              />
            </div>
            <Close onClick={() => setShowPlayer(false)} />
          </Inner>
        </Overlay>,
        document.body
      )
    : null;
};

Player.Button = function PlayerButton({ ...restProps }) {
  const { showPlayer, setShowPlayer } = useContext(PlayerContext);

  return (
    <Button onClick={() => setShowPlayer((showPlayer) => !showPlayer)} {...restProps}>
      Play
    </Button>
  );
};
