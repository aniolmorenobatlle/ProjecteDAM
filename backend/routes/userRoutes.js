const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const adminMiddleware = require('../middleware/adminMiddleware.js');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { fetchUsers, fetchUserAvatar, register, checkUsername, checkEmail, login, me, editProfile, editProfilePoster, editProfileAvatar, fetchFavorites, addFavorite, deleteFavorite, fetchCounts, loginDesktop, fetchUsersDesktop, deleteUser, updateUserById, fetchWatchlist, fetchWatched, fetchWatchedThisYear, fetchReviews, fetchLikes, fetchRatings } = require('../controllers/userController.js');

const router = Router();

router.get('/', fetchUsers);
router.get('/:userId/avatar', fetchUserAvatar);

router.get('/check-username/:username', checkUsername);
router.get('/check-email/:email', checkEmail);

router.get("/me", authMiddleware, me);
router.get('/favorites', authMiddleware, fetchFavorites);
router.get('/watchlist', authMiddleware, fetchWatchlist);
router.get('/watched', authMiddleware, fetchWatched);
router.get('/watchedThisYear', authMiddleware, fetchWatchedThisYear);
router.get('/reviews', authMiddleware, fetchReviews);
router.get('/likes', authMiddleware, fetchLikes);
router.get('/ratings', authMiddleware, fetchRatings);
router.get('/userCounts', authMiddleware, fetchCounts);

router.post('/register', register);
router.post('/login', login);

router.post('/editProfile', authMiddleware, editProfile);
router.post('/editProfilePoster', authMiddleware, editProfilePoster);
router.post('/addFavorite', authMiddleware, addFavorite);
router.post('/deleteFavorite', authMiddleware, deleteFavorite);
router.post('/editProfileAvatar', authMiddleware, upload.single('image'), editProfileAvatar);

// Desktop app
router.get('/desktop', authMiddleware, adminMiddleware, fetchUsersDesktop);

router.post('/login-desktop', loginDesktop);

router.put('/edit-user', authMiddleware, adminMiddleware, updateUserById);

router.delete('/delete-user/:userId', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
