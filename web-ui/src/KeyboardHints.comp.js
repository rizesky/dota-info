import React, { useState } from 'react';
import './KeyboardHints.comp.css'

const KeyboardHints = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="keyboard-hints-container">
      <button 
        className="keyboard-hints-button" 
        onClick={toggleTooltip} 
        aria-label="Keyboard shortcuts"
      >
        ?
      </button>
      {showTooltip && (
        <div className="keyboard-hints-tooltip" style={{animation: 'fadeIn 0.3s ease-out'}}>
          <h3 className="keyboard-hints-title">Tips</h3>
          <table className="keyboard-hints-table">
            <tbody>
              <tr>
                <td>← →</td>
                <td>Previous/Next Player</td>
              </tr>
              <tr>
                <td>Tab</td>
                <td>Next Region</td>
              </tr>
              <tr>
                <td>Shift+Tab</td>
                <td>Previous Region</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KeyboardHints;