import React from 'react';
import PlayerCard from './PlayerCard.comp';

const RegionSlider = ({ leaders, currentIndex }) => {
    return (
      <div className="region-slider">
        <div className="player-card-container">
          <PlayerCard player={leaders[currentIndex]} isFocused={true} />
        </div>
      </div>
    );
  };
  
export default RegionSlider;