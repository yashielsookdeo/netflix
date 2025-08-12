import React, { useState, useEffect, useContext, createContext } from 'react';
import { Card, Header, Loading, Player } from '../components';
import * as ROUTES from '../constants/routes';
import logo from '../logo.svg';
import { CognitoContext } from '../context/cognito';
import { tmdbApi } from '../lib/tmdb';
import useSearch from '../hooks/use-search';
import { useHeroContent } from '../hooks/use-tmdb-content';
import { SelectProfileContainer } from './profiles';
import { FooterContainer } from './footer';

// Create context for hero player
export const HeroPlayerContext = createContext();

export function BrowseContainer({ slides }) {
  const [category, setCategory] = useState('series');
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [slideRows, setSlideRows] = useState([]);

  // Hero player state
  const [showHeroPlayer, setShowHeroPlayer] = useState(false);

  const { cognitoAuth } = useContext(CognitoContext);
  const [user, setUser] = useState({});

  // Use the search hook
  const { searchResults, isSearching } = useSearch(slides, category, searchTerm);

  // Use the hero content hook
  const { heroContent } = useHeroContent(category);

  useEffect(() => {
    cognitoAuth.getCurrentUser()
      .then(currentUser => setUser(currentUser))
      .catch(() => setUser({}));
  }, [cognitoAuth]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [profile.displayName]);

  useEffect(() => {
    if (searchTerm.length > 2 && searchResults.length > 0) {
      // Show search results
      setSlideRows(searchResults);
    } else {
      // Show normal category slides
      setSlideRows(slides[category] || []);
    }
  }, [searchTerm, searchResults, slides, category]);

  return profile.displayName ? (
    <HeroPlayerContext.Provider value={{ showHeroPlayer, setShowHeroPlayer, heroContent }}>
      {loading ? <Loading src={user.photoURL} /> : <Loading.ReleaseBody />}

      <Header
        src={heroContent?.backdrop_path ? tmdbApi.getImageUrl(heroContent.backdrop_path) : "joker1"}
        dontShowOnSmallViewPort
      >
        <Header.Frame>
          <Header.Group>
            <Header.Logo to={ROUTES.HOME} src={logo} alt="Netflix" />
            <Header.TextLink active={category === 'series' ? 'true' : 'false'} onClick={() => setCategory('series')}>
              Series
            </Header.TextLink>
            <Header.TextLink active={category === 'films' ? 'true' : 'false'} onClick={() => setCategory('films')}>
              Films
            </Header.TextLink>
          </Header.Group>
          <Header.Group>
            <Header.Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isSearching={isSearching}
            />
            <Header.Profile>
              <Header.Picture src={user.photoURL} />
              <Header.Dropdown>
                <Header.Group>
                  <Header.Picture src={user.photoURL} />
                  <Header.TextLink>{user.displayName}</Header.TextLink>
                </Header.Group>
                <Header.Group>
                  <Header.TextLink onClick={() => cognitoAuth.signOut()}>Sign out</Header.TextLink>
                </Header.Group>
              </Header.Dropdown>
            </Header.Profile>
          </Header.Group>
        </Header.Frame>

        <Header.Feature>
          <Header.FeatureCallOut>
            {heroContent ? (
              category === 'series' ? `Watch ${heroContent.title} Now` : `Watch ${heroContent.title} Now`
            ) : (
              category === 'series' ? 'Top Series' : 'Top Movies'
            )}
          </Header.FeatureCallOut>
          <Header.Text>
            {heroContent ? heroContent.description : (
              category === 'series'
                ? 'Discover the highest-rated TV series and shows that are captivating audiences worldwide.'
                : 'Explore the most acclaimed movies that have earned critical praise and audience acclaim.'
            )}
          </Header.Text>
          <Header.PlayButton onClick={() => setShowHeroPlayer(true)}>Play</Header.PlayButton>
        </Header.Feature>
      </Header>

      <Card.Group>
        {slideRows.map((slideItem) => (
          <Card key={`${category}-${slideItem.title.toLowerCase()}`}>
            <Card.Title>{slideItem.title}</Card.Title>
            <Card.Entities>
              {slideItem.data.map((item) => (
                <Card.Item key={item.docId} item={item}>
                  <Card.Image src={tmdbApi.getImageUrl(item.poster_path) || `/images/${category}/${item.genre}/${item.slug}/small.jpg`} />
                  <Card.Meta>
                    <Card.SubTitle>{item.title}</Card.SubTitle>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Meta>
                </Card.Item>
              ))}
            </Card.Entities>
            <Card.Feature category={category}>
              <Player>
                <Player.Button />
                <Player.Video />
              </Player>
            </Card.Feature>
          </Card>
        ))}
      </Card.Group>
      <FooterContainer />

      {/* Hero Player */}
      <HeroPlayer />
    </HeroPlayerContext.Provider>
  ) : (
    <SelectProfileContainer user={user} setProfile={setProfile} />
  );
}

// Hero Player Component
function HeroPlayer() {
  const { showHeroPlayer, setShowHeroPlayer, heroContent } = useContext(HeroPlayerContext);

  if (!showHeroPlayer || !heroContent) return null;

  return <HeroVideoPlayer heroContent={heroContent} onClose={() => setShowHeroPlayer(false)} />;
}

// Hero Video Player Component
function HeroVideoPlayer({ heroContent, onClose }) {
  const [streamingUrl, setStreamingUrl] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (heroContent && heroContent.tmdb_id) {
      // Import videasy service
      import('../lib/videasy').then(({ videasyService }) => {
        // Generate streaming URL
        const url = videasyService.getStreamingUrl(heroContent, {
          progress: 0,
          color: 'E50914' // Netflix red
        });
        setStreamingUrl(url);
      });
    }
  }, [heroContent]);

  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay, not the iframe
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get backdrop image URL
  const backdropUrl = heroContent?.backdrop_path
    ? tmdbApi.getImageUrl(heroContent.backdrop_path)
    : null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
      onClick={handleOverlayClick}
    >
      <div style={{ position: 'relative', width: '90%', maxWidth: '900px' }}>
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          backgroundColor: '#000'
        }}>
          {!showVideo && backdropUrl && !imageError ? (
            // Show backdrop image with play button overlay
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${backdropUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
              }} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideo(true);
                }}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: '#000'
                }}
              >
                ▶
              </button>
              <img
                src={backdropUrl}
                alt=""
                style={{ display: 'none' }}
                onError={() => setImageError(true)}
              />
            </div>
          ) : streamingUrl ? (
            // Show video iframe
            <iframe
              src={streamingUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allowFullScreen
              allow="encrypted-media"
              title={`${heroContent?.title || 'Video'} Player`}
            />
          ) : (
            // Loading or fallback
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px'
            }}>
              {streamingUrl ? 'Loading video...' : 'Video not available'}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            width: '30px',
            height: '30px',
            opacity: 0.8,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: 0,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* Content info */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: 'white',
          maxWidth: '60%'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            {heroContent?.title}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            opacity: 0.8,
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {heroContent?.description}
          </p>
        </div>
      </div>
    </div>
  );
}
