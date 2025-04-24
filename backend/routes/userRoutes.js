const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const { register, checkUsername, checkEmail, login, me, editProfile, editProfilePoster, editProfileAvatar, fetchFavorites, addFavorite, deleteFavorite, fetchCounts } = require('../controllers/userController.js');

const router = Router();

router.get('/check-username/:username', checkUsername);
router.get('/check-email/:email', checkEmail);
router.get("/me", authMiddleware, me);
router.get('/favorites', authMiddleware, fetchFavorites);
router.get('/userCounts', authMiddleware, fetchCounts);

router.post('/register', register);
router.post('/login', login);
router.post('/editProfile', authMiddleware, editProfile);
router.post('/editProfilePoster', authMiddleware, editProfilePoster);
router.post('/addFavorite', authMiddleware, addFavorite);
router.post('/deleteFavorite', authMiddleware, deleteFavorite);

router.post('/editProfileAvatar', authMiddleware, editProfileAvatar);

module.exports = router;
