To make the API for user authentication, profile management, and saving beats, you'll need a backend setup, likely using Node.js with Express. Below is a step-by-step guide to building this API.

1. Set Up Your Backend
First, initialize your backend project with npm init and install necessary dependencies:

```
npm init -y
npm install express bcryptjs jsonwebtoken mongoose dotenv
```

   * Express will handle the routes.
   * bcryptjs will hash passwords.
   * jsonwebtoken will manage JWTs.
   * mongoose will interact with your MongoDB database.
   * dotenv will store environment variables (e.g., database connection string, JWT secret).
<br></br>
2. Create the Folder Structure (Should be mostly determined)
   * Create /models and then User.js and Beat.js
  <br></br>

3. Set Up MongoDB (Mongoose) Models
Create User.js to store user information (email, password hash, and beats) and Beat.js for storing beats.
<br></br>

``` models/User.js ```
```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  beats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beat' }],
});

module.exports = mongoose.model('User', UserSchema);
```

``` models/Beat.js ```
```js
const mongoose = require('mongoose');

const BeatSchema = new mongoose.Schema({
  title: String,
  audioUrl: String, // Store the URL or path to the beat file
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Beat', BeatSchema);
```
<br></br>

4. Set Up API Routes
Create routes to handle user authentication (sign-up and login) and saving beats.
<br></br>

```routes/userRoutes.js```
```js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Sign-up Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(201).json({ token, user });
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, user });
});

module.exports = router;
```
<br></br>

```routes/beatRoutes.js```
```js
const express = require('express');
const Beat = require('../models/Beat');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Save Beat Route
router.post('/save-beat', verifyToken, async (req, res) => {
  const { title, audioUrl } = req.body;

  // Create a new beat
  const beat = new Beat({ title, audioUrl });

  await beat.save();

  // Associate the beat with the logged-in user
  await User.findByIdAndUpdate(req.user.userId, {
    $push: { beats: beat._id },
  });

  res.status(201).json(beat);
});

// Get User's Beats Route
router.get('/user-beats', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('beats');
  res.json(user.beats);
});

module.exports = router;
```

5. Set Up Server and Routes
In server.js, set up the Express server and route imports.

```js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const beatRoutes = require('./routes/beatRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/beat', beatRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

6. Environment Variables (.env)
Add environment variables for sensitive data (e.g., JWT secret, MongoDB URI).

```.env```:

```
MONGO_URI=mongodb://localhost:27017/beatmvp
JWT_SECRET=mysecretkey
```

7. Frontend Integration
On the frontend, you'll interact with these routes using fetch or a library like Axios for API requests.

  * Sign-up and Login: Create forms to call the signup and login routes and get the JWT token. Store it in localStorage or a cookie.
  * Save Beats: Once authenticated, users can send requests to the save-beat route to save beats.
  * Get Beats: Fetch the user's saved beats by calling the user-beats route.

8. Security and Improvements

  * Use HTTPS in production for secure communication.
  * Use httpOnly cookies for JWT storage in production to avoid client-side JavaScript access.
  * Add password validation and error handling for better UX.





