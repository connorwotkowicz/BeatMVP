'use client'
import React, { useState, useEffect, useRef } from 'react';
import SoundControls from './SoundControls';

const SequencerGrid = ({ pattern, onPatternChange }) => {
  const rows = 4;
  const cols = 16;
  const [toneLoaded, setToneLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true); // Fixed typo here
  const ToneRef = useRef(null);
  const sounds = useRef([]);
  const soundNames = ['Kick', 'Snare', 'Hi-Hat', 'Clap'];

  const defaultPattern = Array(rows).fill().map(() => Array(cols).fill(false));
  const controlledPattern = pattern || defaultPattern;

  const [visualStep, setVisualStep] = useState(0);
  const currentStepRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const repeatIdRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const isTestEnvironment = process.env.NODE_ENV === 'test';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initializeTone = async () => {
      try {
     
        if (isTestEnvironment) {
        
          setTimeout(() => {
            setToneLoaded(true);
            setShowLoading(false);
          }, 100);
          return;
        }

        const Tone = await import('tone');
        ToneRef.current = Tone;
        
        sounds.current = [
          new Tone.Player({ url: '/assets/sounds/kick.mp3', autostart: false }).toDestination(),
          new Tone.Player({ url: '/assets/sounds/snare.mp3', autostart: false }).toDestination(),
          new Tone.Player({ url: '/assets/sounds/closedhat.mp3', autostart: false }).toDestination(),
          new Tone.Player({ url: '/assets/sounds/clap.mp3', autostart: false }).toDestination(),
        ];

        const soundUrls = [
          '/assets/sounds/kick.mp3',
          '/assets/sounds/snare.mp3',
          '/assets/sounds/closedhat.mp3',
          '/assets/sounds/clap.mp3',
        ];

        await Promise.all(
          sounds.current.map((sound, index) =>
            sound.load(soundUrls[index]).catch(error => {
              console.error(`Error loading sound ${index}:`, error);
            })
          )
        );
        
        Tone.Destination.volume.value = 0;
        setToneLoaded(true);
        setShowLoading(false);
      } catch (error) {
        console.error('Failed to initialize Tone.js:', error);
        setShowLoading(false);
      }
    };

    initializeTone();
    
    return () => {
      if (ToneRef.current) {
        const Tone = ToneRef.current;
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
        
        if (sounds.current) {
          sounds.current.forEach(sound => {
            if (sound instanceof Tone.Player) {
              sound.dispose();
            }
          });
          sounds.current = [];
        }
      }
    };
  }, [isTestEnvironment]);

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
    if (!toneLoaded || !ToneRef.current) return;
    
   
    if (isTestEnvironment) {
      setIsPlaying(true);
      return;
    }

    const Tone = ToneRef.current;
    await Tone.start();
    Tone.Transport.bpm.value = tempo;
    currentStepRef.current = 0;
    setVisualStep(0);
    setIsPlaying(true);
  };

  const stopTransport = () => {
    if (!toneLoaded || !ToneRef.current) return;
    
  
    if (isTestEnvironment) {
      setIsPlaying(false);
      setVisualStep(0);
      currentStepRef.current = 0;
      return;
    }
    
    const Tone = ToneRef.current;
    Tone.Transport.stop();
    Tone.Transport.clear(repeatIdRef.current);
    setIsPlaying(false);
    setVisualStep(0);
    currentStepRef.current = 0;
  };

  useEffect(() => {
    if (!toneLoaded || !ToneRef.current || !isPlaying) return;
    
  
    if (isTestEnvironment) {
      const stepInterval = 60000 / tempo / 4;
      const testInterval = setInterval(() => {
        setVisualStep(prev => (prev + 1) % cols);
        currentStepRef.current = (currentStepRef.current + 1) % cols;
      }, stepInterval);
      
      return () => clearInterval(testInterval);
    }

    const Tone = ToneRef.current;
    
    repeatIdRef.current = Tone.Transport.scheduleRepeat((time) => {
      const step = currentStepRef.current;

      for (let i = 0; i < rows; i++) {
        if (controlledPattern[i][step] && sounds.current[i]) {
          sounds.current[i].start(time, 0);
        }
      }

      currentStepRef.current = (step + 1) % cols;

      Tone.Draw.schedule(() => {
        setVisualStep(currentStepRef.current);
      }, time);
    }, '16n');

    Tone.Transport.start();

    return () => {
      if (ToneRef.current) {
        const Tone = ToneRef.current;
        Tone.Transport.stop();
        Tone.Transport.clear(repeatIdRef.current);
      }
    };
  }, [isPlaying, controlledPattern, toneLoaded, tempo, isTestEnvironment]);

  useEffect(() => {
    if (!toneLoaded || !ToneRef.current) return;
    
    const Tone = ToneRef.current;
    Tone.Transport.bpm.value = tempo;
  }, [tempo, toneLoaded]);

  useEffect(() => {
    if (!toneLoaded || !ToneRef.current) return;
    
    const Tone = ToneRef.current;
    if (isMuted || volume === 0) {
      Tone.Destination.volume.value = -Infinity;
    } else {
      Tone.Destination.volume.value = Tone.gainToDb(volume);
    }
  }, [volume, isMuted, toneLoaded]);

  if (showLoading) {
    return (
      <div className="sequencer-container">
        <div className="loading-overlay">
          <p>Loading audio engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sequencer-container">
      <div className="grid-scroll-wrapper">
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
        isAudioReady={toneLoaded}
      />

      <button className="clear-button" onClick={clearGrid}>Clear Grid</button>
    </div>
  );
};

export default SequencerGrid;