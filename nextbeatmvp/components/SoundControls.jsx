'use client'

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react'; 

const SoundControls = ({
  tempo,
  setTempo,
  isPlaying,
  onPlayToggle,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
}) => {
  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(0.5); 
    } else {
      setIsMuted(true);
      setVolume(0); 
    }
  };

  return (
    <div className="sound-controls">
      <h2>Sound Controls</h2>

      <div className="volume-control">
        <label htmlFor="volume">
          <button className="mute-button" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </label>

        <input
          type="range"
          id="volume"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          disabled={isMuted}
        />
      </div>

      <div className="tempo-control">
        <label htmlFor="tempo">Tempo: {tempo} BPM</label>
        <input
          type="range"
          id="tempo"
          min="60"
          max="200"
          value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
        />
      </div>

      <button className="play-button" onClick={onPlayToggle}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  );
};

export default SoundControls;
