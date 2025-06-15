'use client'
import React from 'react';

const SavedBeats = ({ userBeats }) => {
  return (
    <div className="saved-beats-container">
      <h3>Your Saved Beats</h3>
      {userBeats.length === 0 ? (
        <p>No saved beats found.</p>
      ) : (
        <ul>
          {userBeats.map((beat) => (
            <li key={beat.id} className="beat-item">
              <h4>{beat.title}</h4>
              <audio controls>
                <source src={beat.audio_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedBeats;
