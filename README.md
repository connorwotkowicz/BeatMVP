Project Title: Collaborative Beat Sketchpad (Solo MVP)

Stack:
- Frontend: React, CSS (or Tailwind)
- Backend: Node.js, Express
- Database: PostgreSQL
- Audio Engine: Tone.js
- Auth: JWT (JSON Web Tokens)
- Deployment: Render / Vercel / Railway

---

FULL STEP LIST

PHASE 1: Project Setup
1. Create folders: client/ (React), server/ (Express)
2. Initialize both projects (npm init -y, npx create-react-app client)
3. Set up CORS and connect frontend ↔ backend
4. Create PostgreSQL tables for users and patterns

PHASE 2: Authentication
5. Backend routes:
   - POST /auth/register → create user
   - POST /auth/login → return JWT
6. Create LoginForm.jsx, RegisterForm.jsx
7. Store JWT token on frontend
8. Add backend middleware to protect routes

PHASE 3: Sequencer UI + Tone.js
9. Install and integrate Tone.js
10. Create SequencerGrid.jsx
    - Render 4 rows (kick, snare, hat, clap) x 16 steps
    - Toggle cells on/off
11. Hook Tone.js to play sounds per active step
12. Add play/pause button and tempo slider

PHASE 4: Save/Load Patterns
13. Convert grid state to JSON format
14. Backend routes:
   - GET /patterns/:userId
   - POST /patterns (save pattern)
15. Create Dashboard.jsx to show saved patterns
16. Load saved pattern into grid from backend

PHASE 5: Styling + Deployment
17. Style the grid, buttons, and pages (CSS/Tailwind)
18. Add loading, error, and success feedback
19. Deploy backend (Render/Railway)
20. Deploy frontend (Vercel/Netlify)
21. Set up environment variables

---

DATABASE SCHEMA (PostgreSQL)

users
--------------------------------
id SERIAL PRIMARY KEY
username TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

patterns
--------------------------------
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
name TEXT
pattern_data JSONB
tempo INTEGER DEFAULT 120
created_at TIMESTAMP DEFAULT NOW()

---

COMPONENT STRUCTURE

src/
├── components/
│   ├── SequencerGrid.jsx
│   ├── SoundControls.jsx
│   ├── Navbar.jsx
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   └── PatternEditor.jsx
├── context/
│   └── AuthContext.jsx
├── App.jsx
└── index.js

---

SEQUENCERGRID.JSX TEMPLATE (STARTER)

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

---

STRETCH GOALS (BONUS)
- Export to WAV
- Add melody grid with Tone.Synth
- Real-time collab (Socket.io)
- Drag and drop sample uploader
- Public pattern sharing / likes
- Light/dark mode
