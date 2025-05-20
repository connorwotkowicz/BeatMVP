-- Drop existing tables in correct dependency order
DROP TABLE IF EXISTS patterns;
DROP TABLE IF EXISTS beats;
DROP TABLE IF EXISTS users;

-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- BEATS (added user_id foreign key + data column)
CREATE TABLE beats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- 🔑 links beat to user
  title TEXT NOT NULL,
  audio_url TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PATTERNS
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
