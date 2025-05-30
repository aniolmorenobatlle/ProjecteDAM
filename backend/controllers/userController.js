const dotenv = require('dotenv');
const pkg = require('jsonwebtoken');
const userModel = require('../models/userModel.js');

dotenv.config();

const { sign } = pkg;
const SECRET_KEY = process.env.SECRET_KEY;

exports.fetchUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const query = req.query.query || '';

  try {
    const users = await userModel.getUsers(limit, offset, query);
    const totalUsers = await userModel.countUsers();
    const totalPages = Math.ceil(totalUsers / limit);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No s\'han trobat usuaris' });
    }

    res.status(200).json({
      users,
      currentPage: page,
      totalUsers,
      totalPages,
    });

  } catch (error) {
    console.error('Error en obtenir els usuaris:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.fetchUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuari no trobat' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error en obtenir l\'usuari:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.fetchUserAvatar = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.getUserAvatar(userId);

    if (!user || !user.avatar_binary) {
      return res.status(404).json({ message: 'Avatar no trobat' });
    }

    const imgBuffer = Buffer.from(user.avatar_binary);

    res.set('Content-Type', user.avatar_mime_type || 'image/jpeg');
    res.status(200).send(imgBuffer);
  } catch (error) {
    console.error('Error en obtenir l\'avatar de l\'usuari:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

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

exports.loginDesktop = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userAdmin = await userModel.findUserAdmin(username);

    if (!userAdmin) {
      return res.status(401).json({ message: 'Usuari no trobat' });
    }

    const isMatch = await userModel.comparePasswords(password, userAdmin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contrasenya incorrecta' });
    }

    // Crear token JWS
    const token = sign({ userId: userAdmin.id, is_admin: true }, SECRET_KEY, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login correcte',
      userId: userAdmin.id,
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el login' });
  }
};

exports.fetchUsersDesktop = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const offset = (page - 1) * limit;

  const query = req.query.query || '';

  try {
    const users = await userModel.getUsersDesktop(limit, offset, query);
    const totalUsers = await userModel.countUsers();
    const totalPages = Math.ceil(totalUsers / limit);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No s\'han trobat usuaris' });
    }

    res.status(200).json({
      users,
      currentPage: page,
      totalUsers,
      totalPages,
    });

  } catch (error) {
    console.error('Error en obtenir els usuaris:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
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
  const { name, username, email } = req.body;
  const userId = req.user.userId;

  try {
    const currentUsername = await userModel.getCurrentUsername(userId);

    if (username && username !== currentUsername) {
      const exists = await userModel.checkUserExists(username);
      if (exists) {
        return res.status(400).json({ message: "El nom d'usuari ja està en ús" });
      }
    }

    const currentEmail = await userModel.getCurrentEmail(userId);
    if (email && email !== currentEmail) {
      const exists = await userModel.checkEmailExists(email);
      if (exists) {
        return res.status(400).json({ message: "El correu ja està en ús" });
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;

    // Actualitzar només si hi ha canvis
    const user = await userModel.editProfile(userId, updates);

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "No s'ha trobat cap usuari amb aquest ID" });
    }

    res.status(200).json({
      name: user.rows[0].name,
      username: user.rows[0].username,
      email: user.rows[0].email,
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
  const userId = req.user.userId;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No s'ha carregat cap imatge" });
    }

    const avatarBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const user = await userModel.editProfileAvatar(userId, avatarBuffer, mimeType);

    if (!user) {
      return res.status(404).json({ message: "No s'ha trobat cap usuari amb aquest ID" });
    }

    res.status(200).json({
      message: "Avatar modificat correctament",
      avatar: user.avatar,
      avatar_mime_type: user.avatar_mime_type,
    });
  } catch (error) {
    console.log("Error en editar l'avatar:", error);
    res.status(500).json({ message: "Error al modificar l'avatar" });
  }
};

exports.fetchFavorites = async (req, res) => {
  const { userId } = req.params;

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

exports.fetchWatchlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const watchlist = await userModel.getWatchlist(userId);

    if (!watchlist || watchlist.length === 0) {
      return res.status(200).json({ message: "No s'han trobat pel·lícules a la llista de seguiment", movies: [] });
    }

    const movies = watchlist.map(movie => ({
      id_api: movie.id_api,
      poster: movie.poster
    }));

    res.status(200).json({
      message: "Pel·lícules de la llista de seguiment obtingudes correctament",
      movies: movies
    });

  } catch (error) {
    console.error("Error en obtenir la llista de pel·lícules:", error);
    res.status(500).json({ message: "Error al obtenir la llista de pel·lícules" });
  }
};

exports.fetchWatched = async (req, res) => {
  const { userId } = req.params;

  try {
    const watched = await userModel.getWatched(userId);

    if (!watched || watched.length === 0) {
      return res.status(200).json({ message: "No s'han trobat pel·lícules a la llista de seguiment", movies: [] });
    }

    const movies = watched.map(movie => ({
      id_api: movie.id_api,
      poster: movie.poster
    }));

    res.status(200).json({
      message: "Pel·lícules de la llista de seguiment obtingudes correctament",
      movies: movies
    });

  } catch (error) {
    console.error("Error en obtenir la llista de pel·lícules:", error);
    res.status(500).json({ message: "Error al obtenir la llista de pel·lícules" });
  }
};

exports.fetchWatchedThisYear = async (req, res) => {
  const { userId } = req.params;

  try {
    const watchedThisYear = await userModel.getWatchedThisYear(userId);

    if (!watchedThisYear || watchedThisYear.length === 0) {
      return res.status(200).json({ message: "No s'han trobat pel·lícules a la llista de seguiment", movies: [] });
    }

    const movies = watchedThisYear.map(movie => ({
      id_api: movie.id_api,
      poster: movie.poster
    }));

    res.status(200).json({
      message: "Pel·lícules de la llista de seguiment obtingudes correctament",
      movies: movies
    });

  } catch (error) {
    console.error("Error en obtenir la llista de pel·lícules:", error);
    res.status(500).json({ message: "Error al obtenir la llista de pel·lícules" });
  }
};

exports.fetchReviews = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviewsResult = await userModel.getReviews(userId);

    if (!reviewsResult || reviewsResult.length === 0) {
      return res.status(200).json({ message: "No s'han trobat pel·lícules a la llista de seguiment", reviews: [] });
    }

    const reviews = reviewsResult.map(review => ({
      id_api: review.id_api,
      poster: review.poster,
      comment: review.comment,
      created_at: review.created_at
    }));

    res.status(200).json({
      message: "Pel·lícules de la llista de seguiment obtingudes correctament",
      reviews: reviews
    });

  } catch (error) {
    console.error("Error en obtenir la llista de pel·lícules:", error);
    res.status(500).json({ message: "Error al obtenir la llista de pel·lícules" });
  }
};

exports.fetchLikes = async (req, res) => {
  const { userId } = req.params;

  try {
    const likes = await userModel.getLikes(userId);

    if (!likes || likes.length === 0) {
      return res.status(200).json({ message: "No s'han trobat pel·lícules a la llista de seguiment", movies: [] });
    }

    const movies = likes.map(movie => ({
      id_api: movie.id_api,
      poster: movie.poster
    }));

    res.status(200).json({
      message: "Pel·lícules de la llista de seguiment obtingudes correctament",
      movies: movies
    });

  } catch (error) {
    console.error("Error en obtenir la llista de pel·lícules:", error);
    res.status(500).json({ message: "Error al obtenir la llista de pel·lícules" });
  }
};

exports.fetchRatings = async (req, res) => {
  const { userId } = req.params;

  try {
    const ratings = await userModel.getRatings(userId);

    if (!ratings || ratings.length === 0) {
      return res.status(200).json({ message: "No s'han trobat pel·lícules a la llista de seguiment", movies: [] });
    }

    const movies = ratings.map(movie => ({
      id_api: movie.id_api,
      poster: movie.poster
    }));

    res.status(200).json({
      message: "Pel·lícules de la llista de seguiment obtingudes correctament",
      movies: movies
    });

  } catch (error) {
    console.error("Error en obtenir la llista de pel·lícules:", error);
    res.status(500).json({ message: "Error al obtenir la llista de pel·lícules" });
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
};

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
};

exports.fetchCounts = async (req, res) => {
  const { userId } = req.params;

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
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User id not provided" });
    }

    const user = await userModel.deleteUser(userId);

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "User with this ID doesn't exist" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      userId: userId
    });

  } catch (error) {
    console.error("Error deleting the user:", error);
    res.status(500).json({ message: "Error deleting this user" });
  }
};

exports.updateUserById = async (req, res) => {
  const { userId, name, username, email, avatar, is_admin } = req.body;

  try {
    const currentUsername = await userModel.getCurrentUsername(userId);

    if (username && username !== currentUsername) {
      const exists = await userModel.checkUserExists(username);
      if (exists) {
        return res.status(400).json({ message: "El nom d'usuari ja està en ús" });
      }
    }

    const updates = { name, username, email, avatar, is_admin };
    const updatedUser = await userModel.updateUserById(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: "No s'ha trobat cap usuari amb aquest ID" });
    }

    res.status(200).json({
      message: "Usuari modificat correctament",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error en editar l'usuari:", error);
    res.status(500).json({ message: "Error al modificar l'usuari" });
  }
};

exports.fetchRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await userModel.getRequests(userId);

    if (!requests || requests.length === 0) {
      return res.status(200).json({ message: "No s'han trobat sol·licituds", requests: [] });
    }

    res.status(200).json({
      notifications: requests
    });

  } catch (error) {
    console.error("Error en obtenir les sol·licituds:", error);
    res.status(500).json({ message: "Error al obtenir les sol·licituds" });
  }
};

exports.acceptRequest = async (req, res) => {
  const { requestId } = req.params;
  const { senderId, reciverId } = req.body;

  try {
    const result = await userModel.acceptRequest(senderId, reciverId, requestId);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No s'ha trobat cap sol·licitud amb aquest ID" });
    }

    res.status(200).json({
      message: "Sol·licitud acceptada correctament",
      requestId: result.request_id
    });

  } catch (error) {
    console.error("Error en acceptar la sol·licitud:", error);
    res.status(500).json({ message: "Error al acceptar la sol·licitud" });
  }
};

exports.rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  const { senderId, reciverId } = req.body;

  try {
    const result = await userModel.rejectRequest(senderId, reciverId, requestId);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No s'ha trobat cap sol·licitud amb aquest ID" });
    }

    res.status(200).json({
      message: "Sol·licitud rebutjada correctament",
      requestId: result.request_id
    });

  } catch (error) {
    console.error("Error en rebutjar la sol·licitud:", error);
    res.status(500).json({ message: "Error al rebutjar la sol·licitud" });
  }
};

exports.fetchFriends = async (req, res) => {
  const { userId } = req.params;

  try {
    const friends = await userModel.getFriends(userId);

    if (!friends || friends.length === 0) {
      return res.status(200).json({ message: "No s'han trobat amics", friends: [] });
    }

    res.status(200).json({
      friends: friends
    });

  } catch (error) {
    console.error("Error en obtenir els amics:", error);
    res.status(500).json({ message: "Error al obtenir els amics" });
  }
};

exports.fetchFriendsStatus = async (req, res) => {
  const { userId, friendId } = req.query;

  if (!friendId || isNaN(friendId)) {
    return res.status(400).json({ message: "Friend ID invàlid" });
  }

  try {
    const status = await userModel.getFriendshipStatus(userId, friendId);

    if (!status) {
      return res.status(200).json({ is_friend: null });
    }

    res.status(200).json({
      is_friend: status?.is_friend ?? null
    });

  } catch (error) {
    console.error("Error en obtenir l'estat d'amic:", error);
    res.status(500).json({ message: "Error al obtenir l'estat d'amic" });
  }
};

exports.setFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  if (!friendId || isNaN(friendId)) {
    return res.status(400).json({ message: "Friend ID invàlid" });
  }

  try {
    const request = await userModel.setFriendRequest(userId, friendId);

    if (!request) {
      return res.status(200).json({ request: null });
    }

    res.status(200).json({
      request: request
    });

  } catch (error) {
    console.error("Error en obtenir la sol·licitud d'amic:", error);
    res.status(500).json({ message: "Error al obtenir la sol·licitud d'amic" });
  }
};

exports.deleteFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  if (!friendId || isNaN(friendId)) {
    return res.status(400).json({ message: "Friend ID invàlid" });
  }

  try {
    const request = await userModel.deleteFriend(userId, friendId);

    if (!request) {
      return res.status(200).json({ request: null });
    }

    res.status(200).json({
      request: request
    });

  } catch (error) {
    console.error("Error en obtenir la sol·licitud d'amic:", error);
    res.status(500).json({ message: "Error al obtenir la sol·licitud d'amic" });
  }
};
