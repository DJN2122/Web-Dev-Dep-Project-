const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Criminal = require('../models/criminal');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3000;
const db = mongoose.connection;

// Middleware
app.use(session({
  secret: 'your_secret_key', // Secret key for signing the session ID cookie
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/' }), // Store session in MongoDB
  cookie: { secure: false, maxAge: 300000 } // 5 Minutes
}));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from the 'public' folder

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// MongoDB error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Handle requests to the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/login.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      // User found and password is correct

      // Store user info in session
      req.session.user = {
        id: user._id,
        username: user.username
      };

      res.send('Login successful');
    } else {
      // User not found or password does not match
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// Sign Up Endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = new User({ username, password: hashedPassword });
    await user.save(); // Save the new user
    res.status(201).send('User successfully created.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user.');
  }
});

// Session Validation Endpoint
app.get('/api/user-info', (req, res) => {
  if (req.session.user) {
    // Send back the user info
    res.json({ username: req.session.user.username });
  } else {
    // User is not logged in
    res.status(401).json({ message: 'Not logged in' });
  }
});

// Change Password Endpoint
app.post('/change-password', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Not logged in');
    }

    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.session.user.id);

        if (user && await bcrypt.compare(currentPassword, user.password)) {
            // Update the password
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.send('Password changed successfully.');
        } else {
            res.status(401).send('Current password is incorrect.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Delete Account Endpoint
app.post('/delete-account', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Not logged in');
    }

    try {
        await User.findByIdAndDelete(req.session.user.id);
        req.session.destroy();
        res.send('Account deleted successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Search Criminal Endpoint
app.get('/search-criminals', async (req, res) => {
  const searchQuery = req.query.name;
  if (!searchQuery) {
    return res.status(400).send('Please provide a search term.');
  }

  try {
    const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex for partial match
    const criminals = await Criminal.find({ Name: regex }).limit(100);

    if (criminals.length >= 100) {
      return res.status(400).json({ message: 'Too many results, please specify a more detailed name.' });
    } else {
      res.json(criminals);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching for criminals');
  }
});

// Logout Endpoint
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Could not log out, try again');
    } else {
      // Clear the cookie
      res.clearCookie('connect.sid');
      res.redirect('../pages/login.html');
    }
  });
});