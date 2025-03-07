import { compare, hash } from 'bcrypt';
import dotenv from 'dotenv'; // Import dotenv here
import { Router } from 'express';
import pkg from 'jsonwebtoken';
import pool from '../config/db.js';

const { sign } = pkg;
dotenv.config(); // Use dotenv.config() in the ES module style

const router = Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Registre
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await hash(password, 10);

    const result = await pool.query(
      `INSERT INTO "User" ("username", "email", "password", "created_at") 
       VALUES ($1, $2, $3, NOW()) RETURNING id`,
      [username, email, hashedPassword]
    );

    const userId = result.rows[0].id;
    
    // Crear token JWS
    const token = sign({ userId }, SECRET_KEY, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Usuari creat correctament',
      userId: userId,
      token: token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el registre' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM "User" WHERE "username" = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuari no trobat' });
    }

    const user = result.rows[0];

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contrasenya incorrecta' });
    }

    // Crear token JWS
    const token = sign({ userId: user.id }, SECRET_KEY, { expiresIn: '7d' });

    res.status(200).json({ 
      message: 'Login correcte', 
      userId: user.id,
      token: token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el login' });
  }
});

export default router;
