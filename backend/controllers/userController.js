const dotenv = require('dotenv');
const pkg = require('jsonwebtoken');
const userModel = require('../models/userModel.js');

dotenv.config();

const { sign } = pkg;
const SECRET_KEY = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  const { name, username, email, password, avatar, poster } = req.body;

  try {
    const userId = await userModel.createUser(name, username, email, password, avatar, poster);

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
};

exports.checkUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const exists = await userModel.checkUserExists(username);

    if (exists) {
      return res.status(400).json({ message: "El nom d'usuari ja està en ús" });
    }

    res.status(200).json({ message: "El nom d'usuari està disponible" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en la verificació del nom d'usuari" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Usuari no trobat' });
    }

    const isMatch = await userModel.comparePasswords(password, user.password);

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
};

exports.me = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuari no trobat' });
    }

    res.json(user);
  } catch (error) {
    console.log("Error en crear l'informació de l'usuari");
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
