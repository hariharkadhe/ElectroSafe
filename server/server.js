const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve frontend files

// Mock Database (In-memory for demo until Firebase credentials are real)
// In a real scenario, we would use the firebase-admin SDK here.
// I will setup the structure for Firebase but provide a fallback so it works out-of-the-box.
const complaints = [];

// Routes
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/admin');

app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend Entry
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
