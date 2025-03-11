// authMiddleware.js
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No hi ha token, autorització denegada' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;  // Guarda userId a req.user
    next();
  } catch (error) {
    console.error('Token invàlid:', error);
    res.status(401).json({ message: 'Token invàlid' });
  }
};

module.exports = authMiddleware;