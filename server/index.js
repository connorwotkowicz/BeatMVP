const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js');
const beatRoutes = require('./routes/beatRoutes.js');
const authRoutes = require('./routes/authRoutes.js'); // ✅ correctly named

dotenv.config();  

const app = express();

app.use(cors()); // ✅ Don't forget to use cors before routes
app.use(express.json());  

// ✅ Mount routes
app.use('/api/users', userRoutes);
app.use('/api/beats', beatRoutes);
app.use('/api/auth', authRoutes); // ✅ This is now correct

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
