const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const adminMiddleware = require('../middleware/adminMiddleware.js');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { fetchUsers, fetchUserById, fetchUserAvatar, register, checkUsername, checkEmail, login, me, editProfile, editProfilePoster, editProfileAvatar, fetchFavorites, addFavorite, deleteFavorite, fetchCounts, loginDesktop, fetchUsersDesktop, deleteUser, updateUserById, fetchWatchlist, fetchWatched, fetchWatchedThisYear, fetchReviews, fetchLikes, fetchRatings, fetchRequests, acceptRequest, rejectRequest, fetchFriends, fetchFriendsStatus, setFriendRequest, deleteFriend } = require('../controllers/userController.js');

const router = Router();

router.get('/', authMiddleware, fetchUsers);
router.get("/me", authMiddleware, me);

router.get('/check-username/:username', checkUsername);
router.get('/check-email/:email', checkEmail);

router.get('/requests/:userId', fetchRequests);

router.get('/friends/status', authMiddleware, fetchFriendsStatus);
router.post('/friends/send-request', authMiddleware, setFriendRequest);
router.post('/friends/delete-friend', authMiddleware, deleteFriend);
router.get('/friends/:userId', authMiddleware, fetchFriends);

router.get('/favorites/:userId', authMiddleware, fetchFavorites);
router.get('/watchlist/:userId', authMiddleware, fetchWatchlist);
router.get('/watched/:userId', authMiddleware, fetchWatched);
router.get('/watchedThisYear/:userId', authMiddleware, fetchWatchedThisYear);
router.get('/reviews/:userId', authMiddleware, fetchReviews);
router.get('/likes/:userId', authMiddleware, fetchLikes);
router.get('/ratings/:userId', authMiddleware, fetchRatings);
router.get('/userCounts/:userId', authMiddleware, fetchCounts);

router.post('/register', register);
router.post('/login', login);

router.post('/accept-request/:requestId', authMiddleware, acceptRequest);
router.post('/reject-request/:requestId', authMiddleware, rejectRequest);

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

// 
router.get('/:userId', authMiddleware, fetchUserById)
router.get('/:userId/avatar', fetchUserAvatar);

module.exports = router;
