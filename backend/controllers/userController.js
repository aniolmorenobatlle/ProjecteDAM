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

    res.status(200).json({
      message: 'Usuari creat correctament',
      userId: userId,
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

exports.checkEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const exists = await userModel.checkEmailExists(email);

    if (exists) {
      return res.status(400).json({ message: "L'email ja està en ús" });
    }

    res.status(200).json({ message: "L'email està disponible" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en la verificació de l'email" });
  }
}

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
    const token = sign({ userId: user.id }, SECRET_KEY, { expiresIn: '30d' });

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
    console.error('Error en obtenir la informació de l\'usuari:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.editProfile = async (req, res) => {
  const { name, username } = req.body;
  const userId = req.user.userId;

  try {
    const currentUsername = await userModel.getCurrentUsername(userId);

    if (username && username !== currentUsername) {
      const exists = await userModel.checkUserExists(username);
      if (exists) {
        return res.status(400).json({ message: "El nom d'usuari ja està en ús" });
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (username !== undefined) updates.username = username;

    // Actualitzar només si hi ha canvis
    const user = await userModel.editProfile(userId, updates);

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "No s'ha trobat cap usuari amb aquest ID" });
    }

    res.status(200).json({
      message: "Perfil modificat correctament",
      name: user.rows[0].name,
      username: user.rows[0].username
    });

  } catch (error) {
    console.error("Error en editar el perfil:", error);
    res.status(500).json({ message: "Error al modificar el perfil" });
  }
};

exports.editProfilePoster = async (req, res) => {
  const { poster } = req.body;
  const userId = req.user.userId;

  try {
    const user = await userModel.editProfilePoster(userId, poster);

    if (!user) {
      return res.status(404).json({ message: "No s'ha trobat cap usuari amb aquest ID" });
    }

    res.status(200).json({
      message: "Poster modificat correctament",
      poster: user.poster
    });

  } catch (error) {
    console.error("Error en editar el poster:", error);
    res.status(500).json({ message: "Error al modificar el poster" });
  }
};

exports.editProfileAvatar = async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user.userId;

  try {
    const user = await userModel.editProfileAvatar(userId, avatar);

    if (!user) {
      return res.status(404).json({ message: "No s'ha trobat cap usuari amb aquest ID" });
    }

    res.status(200).json({
      message: "Avatar modificat correctament",
      avatar: user.avatar
    });

  } catch (error) {
    console.error("Error en editar l'avatar:", error);
    res.status(500).json({ message: "Error al modificar l'avatar" });
  }
};

exports.fetchFavorites = async (req, res) => {
  const userId = req.user.userId;

  try {
    const favorites = await userModel.getFavorites(userId);

    if (!favorites) {
      return res.status(404).json({ message: "No s'han trobat pel·lícules favorites" });
    }

    const movies = favorites.map(movie => ({
      id_api: movie.id_api,
      poster: movie.poster
    }));

    res.status(200).json({
      message: "Pel·lícules favorites obtingudes correctament",
      favorites: movies
    });

  } catch (error) {
    console.error("Error en obtenir les pel·lícules favorites:", error);
    res.status(500).json({ message: "Error al obtenir les pel·lícules favorites" });
  }
};

exports.addFavorite = async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.userId;

  try {
    const exists = await userModel.checkFavoriteExists(userId, movieId);

    if (exists) {
      return res.status(400).json({ message: "La pel·lícula ja és una de les favorites" });
    }

    const result = await userModel.addFavorite(userId, movieId);

    res.status(200).json({
      message: "Pel·lícula afegida a les favorites correctament",
      movieId: result.movie_id
    });

  } catch (error) {
    console.error("Error en afegir la pel·lícula a les favorites:", error);
    res.status(500).json({ message: "Error al afegir la pel·lícula a les favorites" });
  }
}

exports.deleteFavorite = async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.userId;

  try {
    const result = await userModel.deleteFavorite(userId, movieId);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No s'ha trobat cap pel·lícula amb aquest ID" });
    }

    res.status(200).json({
      message: "Pel·lícula eliminada de les favorites correctament",
      movieId: result.movie_id
    });

  } catch (error) {
    console.error("Error en eliminar la pel·lícula favorita:", error);
    res.status(500).json({ message: "Error al eliminar la pel·lícula favorita" });
  }
}

exports.fetchCounts = async (req, res) => {
  const userId = req.user.userId;

  try {
    const counts = await userModel.fetchCounts(userId);

    if (!counts) {
      return res.status(404).json({ message: "No s'han trobat comptes" });
    }

    res.status(200).json({
      message: "Comptes obtinguts correctament",
      counts: counts
    });

  } catch (error) {
    console.error("Error en obtenir els comptes:", error);
    res.status(500).json({ message: "Error al obtenir els comptes" });
  }
}