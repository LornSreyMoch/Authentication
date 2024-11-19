require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const conDB = require('./db');

const app = express();
const port = process.env.PORT || 5000;

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Connect to MongoDB
conDB(); 

// Register Endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Home Endpoint
app.get('/home', (req, res) => {
    res.status(200).json('You are welcome');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
