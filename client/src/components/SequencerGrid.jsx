import React, { useState, useEffect, useRef } from 'react';
import SoundControls from './SoundControls';
import * as Tone from 'tone';


const SequencerGrid = ({ pattern, onPatternChange }) => {
  const rows = 4;
  const cols = 16;


  const defaultPattern = Array(rows).fill().map(() => Array(cols).fill(false));
  const controlledPattern = pattern || defaultPattern;

  const [visualStep, setVisualStep] = useState(0);
  const currentStepRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const repeatIdRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);


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
    if (!onPatternChange) return;
    const newPattern = controlledPattern.map(row => [...row]);
    newPattern[r][c] = !newPattern[r][c];
    onPatternChange(newPattern);
  };

  const clearGrid = () => {
    if (!onPatternChange) return;
    const emptyPattern = Array(rows).fill().map(() => Array(cols).fill(false));
    onPatternChange(emptyPattern);
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
          if (controlledPattern[i][step]) {
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
  }, [isPlaying, controlledPattern]);

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

useEffect(() => {
  if (isMuted || volume === 0) {
    Tone.Destination.volume.value = -Infinity;
  } else {

    Tone.Destination.volume.value = Tone.gainToDb(volume);
  }
}, [volume, isMuted]);



  return (
    <div className="sequencer-container">
      <div className="grid">
        {controlledPattern.map((row, rIdx) => (
          <div key={rIdx} className="row-wrapper">
            <div className="row-label">{soundNames[rIdx]}</div>
            <div className="row">
              {row.map((cell, cIdx) => (
                <button
                  key={cIdx}
                  className={`cell ${cell ? 'active' : ''} ${cIdx === visualStep ? 'current-step' : ''}`}
                  onClick={() => toggleCell(rIdx, cIdx)}
                  aria-pressed={cell}
                  aria-label={`${soundNames[rIdx]} step ${cIdx + 1}`}
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
  volume={volume}
  setVolume={setVolume}
  isMuted={isMuted}
  setIsMuted={setIsMuted}
/>

      <button className="clear-button" onClick={clearGrid}>Clear Grid</button>

      <button className="play-synth-button"
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
