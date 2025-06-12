const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes'); // ✅ Add test route

app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes); // ✅ Mount test route

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
