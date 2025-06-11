# BeatMVP — Web-Based Beat Sequencer

![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=white)
![Tone.js](https://img.shields.io/badge/audio-Tone.js-ff7373)
![Node.js](https://img.shields.io/badge/backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/server-Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/auth-JWT-yellowgreen)
![Vite](https://img.shields.io/badge/build-Vite-646CFF?logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/styles-SCSS-CC6699?logo=sass&logoColor=white)

BeatMVP is a simple full-stack web application for building, playing, and saving drum patterns using a basic sequencer grid. It features real-time audio playback and pattern persistence. 





---

## Overview

- Sequencer grid
- Real-time audio playback with Tone.js
- Tempo, volume, and mute controls
- JWT-based user authentication
- Pattern saving and loading per user
- REST API powered by Express and PostgreSQL
- SASS styling 

---

## Functionality

### Authentication

- `POST /api/auth/register` — Register new users
- `POST /api/auth/login` — Log in and receive a token
- Middleware protects authenticated routes

### Sequencer

- Toggleable grid for beat creation
- Instruments: kick, snare, hi-hat, clap
- Playback managed via Tone.Transport
- Visual playhead synced to playback

### Pattern Storage

- `POST /api/beat` — Save pattern with title and user ID
- `GET /api/beat` — Fetch patterns for logged-in user

---

## Structure

### Backend (Express)

- `config/` — DB and JWT config
- `controllers/` — Auth and pattern logic
- `models/` — SQL queries for users and beats
- `routes/` — API endpoints
- `middleware/` — JWT protection
- `db/schema.sql` — PostgreSQL schema

### Frontend (React + Vite)

- `components/` — Grid, controls, auth forms, navigation
- `pages/` — Home, dashboard, pattern editor
- `context/` — Auth and theme providers
- `services/api.js` — API communication layer
- `styles/` — SCSS modules (global, components)

---

### Possible / Planned Improvements

- Real-time collaboration (WebSockets or Firebase)
- Expandable instrument kits and custom samples
- Pattern sharing and profile pages
- Greater mobile responsiveness and touch support
- Further, more calibrated styling 

---


## Getting Started

### Requirements

- Node.js (v18+ recommended)
- PostgreSQL database
- npm or Yarn

### 1. Clone the repository

```bash
git clone https://github.com/connorwotko/beatmvp.git
cd beatmvp
```


### 2. Backend
```bash
cd server
npm install
```
Create a .env file in server/ with the following:
```bash
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/beatmvp
JWT_SECRET=your_jwt_secret
```
Then set up your database:
```bash
npm run init-db
```

Start the server:
``` bash
npm run start:dev
```

### 1. Frontend
```bash
cd ../client
npm install
npm run dev
```


## Author

## Author

- Connor Wotkowicz
- - [GitHub](https://github.com/connorwotkowicz)
- - [LinkedIn](https://www.linkedin.com/in/wotkowicz)


---

