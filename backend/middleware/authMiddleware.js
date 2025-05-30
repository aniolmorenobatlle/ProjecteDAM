const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionat' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token invàlid o expirat", error);
    res.status(401).json({ message: 'Token invàlid o expirat' });
  }
};


module.exports = authMiddleware;