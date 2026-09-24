/* global process */
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined in the environment variables')
}

// Middleware to check if the user is authenticated
const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization');
	if (!authHeader) {
	  return res.status(401).json({ message: 'Access denied. No Authorization header provided.' });
	}
  
	const parts = authHeader.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
	  return res.status(401).json({ message: 'Access denied. Invalid token.' });
	}
  
	try {
	  const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
	  req.user = decoded;  // Attach the decoded token data to req.user
	  next();
	} catch (error) {
	  console.error('JWT Verification Error: ', error);
	  res.status(400).json({ message: 'Invalid token.' });
	}
  };
  
  

export { verifyToken }
