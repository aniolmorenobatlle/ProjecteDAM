// userRoutes.js
const { compare, hash } = require('bcrypt');
const dotenv = require('dotenv');
const { Router } = require('express');
const pkg = require('jsonwebtoken');
const pool = require('../config/db.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const { sign } = pkg;
dotenv.config();

const router = Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Registre
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  console.log("Secret", SECRET_KEY)

  try {
    const hashedPassword = await hash(password, 10);

    const result = await pool.query(
      `INSERT INTO "user" ("name", "username", "email", "password", "created_at") 
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
      [name, username, email, hashedPassword]
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
      `SELECT * FROM "user" WHERE "username" = $1`,
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

// User info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT name, username, email, image FROM "user" WHERE id = $1`,
      [req.user.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuari no trobat' })
    }

    const user = result.rows[0]
    res.json(user)
  } catch (error) {
    console.log("Error en crear l'informació de l'usuari")
    res.status(500).json({ message: 'Error en el servidor' })
  }
})

module.exports = router;  // Export using module.exports
