import React, { useState, useEffect } from 'react';
import API from '../services/api';
import * as Tone from 'tone';

const sounds = [
  new Tone.Player('kick.wav').toDestination(),
  new Tone.Player('snare.wav').toDestination(),
  new Tone.Player('hihat.wav').toDestination(),
  new Tone.Player('clap.wav').toDestination(),
];

const SequencerGrid = () => {
  const rows = 4;
  const cols = 16;
  const [grid, setGrid] = useState(
    Array(rows).fill().map(() => Array(cols).fill(false))
  );
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);

  useEffect(() => {
    const repeat = (time) => {
      setStep((prevStep) => {
        const nextStep = (prevStep + 1) % cols;
        for (let i = 0; i < rows; i++) {
          if (grid[i][prevStep]) {
            sounds[i].start(time);
          }
        }
        return nextStep;
      });
    };

    if (isPlaying) {
      Tone.Transport.bpm.value = tempo;
      Tone.Transport.scheduleRepeat(repeat, '16n');
      Tone.Transport.start();
    }

    return () => {
      Tone.Transport.cancel(); // stop all scheduled events
      Tone.Transport.stop();
    };
  }, [isPlaying, grid, tempo]);

  const toggleCell = (r, c) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (rowIndex === r && colIndex === c ? !cell : cell))
    );
    setGrid(newGrid);
  };

  const startTransport = async () => {
    await Tone.start();
    setIsPlaying(true);
  };

  const stopTransport = () => {
    setIsPlaying(false);
    setStep(0);
  };

  return (
    <div className="sequencer-container">
      <div className="grid">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="row">
            {row.map((cell, cIdx) => (
              <button
                key={cIdx}
                className={`cell ${cell ? 'active' : ''} ${cIdx === step ? 'current-step' : ''}`}
                onClick={() => toggleCell(rIdx, cIdx)}
              >
                ▪
              </button>
            ))}
          </div>
        ))}
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

      <button onClick={isPlaying ? stopTransport : startTransport}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  );
};

export default SequencerGrid;
