const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3000;
const db = mongoose.connection;

app.use(session({
  secret: 'your_secret_key', // Secret key for signing the session ID cookie
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/' }), // If using MongoDB
  cookie: { secure: false, maxAge: 60000 } // Configure cookie settings
}));

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
        // Add other relevant user information, but avoid sensitive data
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

// Sign Up
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

app.get('/account', (req, res) => {
  if (req.session.user) {
    // User is logged in, render the account page
    res.sendFile(path.join(__dirname, '/account.html'));
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/login.html');
  }
});

app.get('/api/user-info', (req, res) => {
  if (req.session.user) {
    // Send back the user info
    res.json({ username: req.session.user.username });
  } else {
    // User is not logged in
    res.status(401).json({ message: 'Not logged in' });
  }
});

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
