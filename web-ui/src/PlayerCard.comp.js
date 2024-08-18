import React, { useState, useEffect } from 'react';

const playerImagePlaceholder = 'data:image/webp;base64,UklGRsQEAABXRUJQVlA4WAoAAAAMAAAAdQAAdQAAVlA4IDgBAADwDgCdASp2AHYAPjEYikMiIaEVDMxEIAMEtIAAF1eaKRZTRrDNrl91rt6X5UlnRR81clEUmoA+hqGpS8ofSQWm7cztsEH0DSEH9kB0EvOM8W49hWq2N7im0sbqedWJ5jzflsRuJYvYUKbf3BL7iBHiiBp9p814VfZcVaGPjQVQAAD+/e4DYCfMTIS1IAfp8eVUCJx6LEccj7rM0cEs25mt/rREfRL6KKwuVTJDMCIa6y4WKiGh5BpkZGoRU4lO1OI2svKjJcYjfktMDxo2hAYzet/z/ar78VLEVE+xmOdYnWPBedw1lL1oamq9lFQmlwaN67mojcmobvhFoCYwj+s58gIZmbkG0XcR42ReOKynNtXrMACWWuEixmjQHpM/xuWi3+J3tuUnTkyuQEnj3xBjGn311L4AAABFWElGEAAAAElJKgAIAAAAAAAAAAAAAABYTVAgTgMAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBM0VDNEJCRUM3QTlFMDExQUQxMjlBOEEwOTA3OUZBMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5QzE5RTA0OUM3RDMxMUUwQjZBODkzNzI2RDFEMEY5RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5QzE5RTA0OEM3RDMxMUUwQjZBODkzNzI2RDFEMEY5RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQzBBNzY2M0QzQzdFMDExQUM4MUU1M0Y3QjU2MkFGNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBM0VDNEJCRUM3QTlFMDExQUQxMjlBOEEwOTA3OUZBMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg==';

const getNationalFlag = (code) => {
  return `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${code.toLowerCase()}.svg`;
};

const PlayerCard = ({ player }) => {
  const [flagUrl, setFlagUrl] = useState(null);

  useEffect(() => {
    if (player.nationality && player.nationality !== 'N/A') {
      setFlagUrl(getNationalFlag(player.nationality));
    } else {
      setFlagUrl(null);
    }
  }, [player.nationality]);

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  const getRankLabel = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className={`player-card ${getRankClass(player.rank)}`}>
      <div className="player-card-inner">
        <div className="player-image-wrapper">
          <div className="player-image-container">
            <img
              src={playerImagePlaceholder}
              alt={player.name}
              className="player-image"
            />
            <div className="player-image-overlay"></div>
            <div className="rank-badge" title={`Rank ${player.rank}`}>
              {getRankLabel(player.rank)}
            </div>
          </div>
        </div>
        <div className="player-info">
          <h2 className="player-name">{player.name}</h2>
          {player.teamTag ?
            <p className='player-team'>{player.teamName} ({player.teamTag})</p> :
            <p className='player-team'>Not In Pro Team</p>
          }
          <div className="player-details">
            {flagUrl && (
              <span className="player-nationality">
                <img src={flagUrl} alt={player.nationality} className='national-flag' />
              </span>
            )}
            {player.mmr && player.mmr !== 'N/A' && (
              <span className="player-mmr">{player.mmr} MMR</span>
            )}

            {player.sponsor && (
              <span className="player-mmr">{player.sponsor}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;