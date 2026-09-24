import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3030,
  mongoUri: required('MONGO_URI'),
  dbName: process.env.DB_NAME || 'todo-notebook',
  jwtSecret: required('JWT_SECRET'),
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
