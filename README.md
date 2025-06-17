# BeatSeq — Web-Based Beat Sequencer


![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-cc6699?style=for-the-badge&logo=sass&logoColor=white)
![Tone.js](https://img.shields.io/badge/Tone.js-ff7373?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)



> ### This project has a Vite version and a Next.js version ([branch](https://github.com/connorwotkowicz/BeatSeq/tree/next)).
> Both run seamelessly locally but the deployed site's functionality is still pending 
> > ##### [Current Next.js Build/Deploy](https://beatseq.vercel.app)






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
