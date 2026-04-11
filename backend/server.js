require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // allow cookies cross-origin
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AtlasAura API is running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
