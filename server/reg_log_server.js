import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyToken } from './verifyToken.js'; 
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then(() => console.log(`Connected to MongoDB database: ${process.env.DB_NAME}`))
  .catch(err => console.log('MongoDB connection error: ', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Register user 
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user 
app.post('/api/auth/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    // Find the user by name
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'Invalid name or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid name or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, name: user.name }); // Return the token and user name
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route to get current user profile
app.get('/api/users/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT_REG_and_LOG || 3031;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


