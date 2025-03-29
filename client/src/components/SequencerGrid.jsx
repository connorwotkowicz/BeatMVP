import React, { useState, useEffect, useRef } from 'react';
import SoundControls from './SoundControls';
import * as Tone from 'tone';

const SequencerGrid = () => {
  const rows = 4;
  const cols = 16;

  const [grid, setGrid] = useState(
    Array(rows)
      .fill()
      .map(() => Array(cols).fill(false))
  );

  const [visualStep, setVisualStep] = useState(0);
  const currentStepRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const repeatIdRef = useRef(null);

  const sounds = useRef([
    new Tone.Player({ url: '/assets/sounds/kick.mp3', autostart: false }).toDestination(),
    new Tone.Player({ url: '/assets/sounds/snare.mp3', autostart: false }).toDestination(),
    new Tone.Player({ url: '/assets/sounds/closedhat.mp3', autostart: false }).toDestination(),
    new Tone.Player({ url: '/assets/sounds/clap.mp3', autostart: false }).toDestination(),
  ]);

  const soundNames = ['Kick', 'Snare', 'Hi-Hat', 'Clap']; 

  useEffect(() => {
    Tone.Destination.volume.value = 0;
    console.log('Master volume set to', Tone.Destination.volume.value);

    const soundUrls = [
      '/assets/sounds/kick.mp3',
      '/assets/sounds/snare.mp3',
      '/assets/sounds/closedhat.mp3',
      '/assets/sounds/clap.mp3',
    ];

    sounds.current.forEach((sound, index) => {
      sound
        .load(soundUrls[index])
        .then(() => {
          console.log(`Sound ${index} loaded successfully.`);
        })
        .catch((error) => {
          console.error(`Error loading sound ${index}:`, error);
        });
    });
  }, []);

  const toggleCell = (r, c) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (rowIndex === r && colIndex === c ? !cell : cell))
    );
    setGrid(newGrid);
  };

  const clearGrid = () => {
    const emptyGrid = Array(rows)
      .fill()
      .map(() => Array(cols).fill(false));
    setGrid(emptyGrid);
  };

  const startTransport = async () => {
    await Tone.start();
    console.log('Audio context state:', Tone.context.state);
    Tone.Transport.bpm.value = tempo;
    currentStepRef.current = 0;
    setVisualStep(0);
    setIsPlaying(true);
  };

  const stopTransport = () => {
    Tone.Transport.stop();
    Tone.Transport.clear(repeatIdRef.current);
    setIsPlaying(false);
    setVisualStep(0);
    currentStepRef.current = 0;
  };

  useEffect(() => {
    if (isPlaying) {
      repeatIdRef.current = Tone.Transport.scheduleRepeat((time) => {
        let step = currentStepRef.current;

        for (let i = 0; i < rows; i++) {
          if (grid[i][step]) {
            sounds.current[i].start(time, 0);
          }
        }

        currentStepRef.current = (step + 1) % cols;

        Tone.Draw.schedule(() => {
          setVisualStep(currentStepRef.current);
        }, time);
      }, '16n');

      Tone.Transport.start();
    }

    return () => {
      Tone.Transport.stop();
      Tone.Transport.clear(repeatIdRef.current);
    };
  }, [isPlaying, grid]);

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  return (
    <div className="sequencer-container">
      <div className="grid">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="row-wrapper">
            <div className="row-label">{soundNames[rIdx]}</div>
            <div className="row">
              {row.map((cell, cIdx) => (
                <button
                  key={cIdx}
                  className={`cell ${cell ? 'active' : ''} ${cIdx === visualStep ? 'current-step' : ''}`}
                  onClick={() => toggleCell(rIdx, cIdx)}
                >
                  ▪
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SoundControls
        tempo={tempo}
        setTempo={setTempo}
        isPlaying={isPlaying}
        onPlayToggle={isPlaying ? stopTransport : startTransport}
      />

      <button onClick={clearGrid}>🧼 Clear Grid</button>

      <button
        onClick={async () => {
          await Tone.start();
          const synth = new Tone.Synth().toDestination();
          synth.triggerAttackRelease('C3', '8n');
        }}
      >
        Play Synth Test
      </button>
    </div>
  );
};

export default SequencerGrid;
