const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js');
const beatRoutes = require('./routes/beatRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

dotenv.config();  

const app = express();

app.use(cors({
  origin: "http://localhost:5174",
  credentials: false
}));

app.use(express.json());  


app.use('/api/users', userRoutes);
app.use('/api/beats', beatRoutes);
app.use('/api/auth', authRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
