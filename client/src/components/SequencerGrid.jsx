

// SEQUENCERGRID.JSX TEMPLATE (STARTER)


import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    Tone.Transport.scheduleRepeat((time) => {
      for (let i = 0; i < rows; i++) {
        if (grid[i][step]) {
          sounds[i].start(time);
        }
      }
      setStep((prev) => (prev + 1) % cols);
    }, '16n');
  }, [grid, step]);

  const toggleCell = (r, c) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (rowIndex === r && colIndex === c ? !cell : cell))
    );
    setGrid(newGrid);
  };

  const startTransport = async () => {
    await Tone.start();
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stopTransport = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
    setStep(0);
  };

  return (
    <div>
      <div className="grid">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="row">
            {row.map((cell, cIdx) => (
              <button
                key={cIdx}
                className={cell ? 'active' : 'inactive'}
                onClick={() => toggleCell(rIdx, cIdx)}
              >
                ▪
              </button>
            ))}
          </div>
        ))}
      </div>
      <button onClick={isPlaying ? stopTransport : startTransport}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  );
};

export default SequencerGrid;