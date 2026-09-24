import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.clientOrigins }));
  app.use(express.json({ limit: '20kb' }));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);

  app.use((_req, res) => res.status(404).json({ message: 'Not found.' }));

  // Last stop for unexpected errors: log them, but don't leak details
  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong on the server.' });
  });

  return app;
}
