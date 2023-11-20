const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const db = mongoose.connection;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, ''))); // Serve static files from the 'public' folder

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Successfully connected to the database');
});

// Handle requests to the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
