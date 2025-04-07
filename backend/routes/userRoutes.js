const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const { register, checkUsername, login, me, editProfile, editProfilePoster, editProfileAvatar, fetchFavorites, addFavorite, deleteFavorite } = require('../controllers/userController.js');

const router = Router();

router.get('/check-username/:username', checkUsername);
router.get("/me", authMiddleware, me);
router.get('/favorites', authMiddleware, fetchFavorites);

router.post('/register', register);
router.post('/login', login);
router.post('/editProfile', authMiddleware, editProfile);
router.post('/editProfilePoster', authMiddleware, editProfilePoster);
router.post('/editProfileAvatar', authMiddleware, editProfileAvatar);
router.post('/addFavorite', authMiddleware, addFavorite);
router.post('/deleteFavorite', authMiddleware, deleteFavorite);

module.exports = router;
