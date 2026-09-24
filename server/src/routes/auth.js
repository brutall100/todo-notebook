import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { User } from '../models/user.js';
import { requireAuth } from '../middleware/require-auth.js';

const router = Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asText = (value) => (typeof value === 'string' ? value.trim() : '');

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, config.jwtSecret, { expiresIn: '1d' });
}

router.post('/register', async (req, res, next) => {
  const name = asText(req.body.name);
  const email = asText(req.body.email).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!name || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ message: 'Please enter your name and a valid email.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'The password must be at least 8 characters.' });
  }

  try {
    if (await User.exists({ email })) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    return res.status(201).json({ token: signToken(user), user: user.toPublic() });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const email = asText(req.body.email).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  try {
    const user = email ? await User.findOne({ email }) : null;
    const isMatch = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong email or password.' });
    }
    return res.json({ token: signToken(user), user: user.toPublic() });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: 'Account not found.' });
    }
    return res.json({ user: user.toPublic() });
  } catch (error) {
    return next(error);
  }
});

export default router;
