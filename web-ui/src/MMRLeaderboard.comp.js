import React, { useState, useEffect, useCallback } from 'react';
import { fetchRegionData, getAvailableRegions } from './DotaApiClient'
import PlayerCard from './PlayerCard.comp'
import KeyboardHints from './KeyboardHints.comp';



const MMRLeaderboard = () => {
  const [leaders, setLeaders] = useState({});
  const [activeRegion, setActiveRegion] = useState('Americas');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState({});




  const fetchData = useCallback(async (region) => {
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'shortGeneric' };

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRegionData(region);
      if (data && data.leaders) {
        setLeaders(prevLeaders => ({
          ...prevLeaders,
          [region]: data.leaders.map(player => ({
            rank: player.rank,
            name: player.name,
            teamTag: player.teamTag,
            teamName: player.teamName,
            nationality: player.nationality,
            mmr: player.mmr || 'N/A', // API doesn't provide MMR
            image: '/placeholder.jpg', // Use a placeholder image
            sponsor: player.sponsor
          }))
        }));
        setLastUpdated(prevUpdated => ({
          ...prevUpdated,
          [region]: new Date(data.lastFetchTime * 1000).toLocaleString('en-US', dateOpts)
        }));
      } else {
        setLeaders(prevLeaders => ({ ...prevLeaders, [region]: [] }));
      }
    } catch (error) {
      setError(`Failed to load leaderboard data for ${region}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeRegion);
  }, [activeRegion, fetchData]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          setCurrentPlayerIndex((prev) =>
            (prev - 1 + leaders[activeRegion]?.length) % leaders[activeRegion]?.length
          );
          break;
        case 'ArrowRight':
          setCurrentPlayerIndex((prev) => (prev + 1) % leaders[activeRegion]?.length);
          break;
        case 'Tab':
          event.preventDefault();
          const regions = getAvailableRegions();
          const currentIndex = regions.indexOf(activeRegion);
          const newRegion = regions[(currentIndex + (event.shiftKey ? -1 : 1) + regions.length) % regions.length];
          setActiveRegion(newRegion);
          setCurrentPlayerIndex(0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRegion, leaders]);

  const handleRegionClick = (region) => {
    setActiveRegion(region);
    setCurrentPlayerIndex(0);
  };

  const handleRetry = () => {
    fetchData(activeRegion);
  };

  return (
    <div className="mmr-leaderboard">
      <h1>Dota 2 Top 10 Leaderboard</h1>
      <KeyboardHints />
      <div className="region-selector">
        {getAvailableRegions().map((region) => (
          <button
            key={region}
            onClick={() => handleRegionClick(region)}
            className={`region-indicator ${activeRegion === region ? 'active' : ''}`}
          >
            {region}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="loading">Loading leaderboard data...</div>
      ) : error ? (
        <div className="error">
          {error}
          <button onClick={handleRetry} className="retry-button">Retry</button>
        </div>
      ) : leaders[activeRegion] && leaders[activeRegion].length > 0 ? (
        <div className="player-card-container">
          <PlayerCard player={leaders[activeRegion][currentPlayerIndex]} />
          <div className="player-navigation">
            <button onClick={() => setCurrentPlayerIndex((prev) => (prev - 1 + leaders[activeRegion].length) % leaders[activeRegion].length)}>Previous</button>
            <button onClick={() => setCurrentPlayerIndex((prev) => (prev + 1) % leaders[activeRegion].length)}>Next</button>
          </div>
          <div className="last-updated">
            Last updated: {lastUpdated[activeRegion] || 'Unknown'}
          </div>
        </div>
      ) : (
        <div className="no-data">No data available for this region.</div>
      )}
    </div>
  );
};

export default MMRLeaderboard;