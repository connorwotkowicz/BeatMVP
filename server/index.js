const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });  

console.log('PORT from env:', process.env.PORT);

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: false
}));

app.use(express.json());  

app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/beats', require('./routes/beatRoutes.js'));
app.use('/api/auth', require('./routes/authRoutes.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
