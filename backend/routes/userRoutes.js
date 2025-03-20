const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const { register, checkUsername, login, me } = require('../controllers/userController.js');

const router = Router();

router.post('/register', register);
router.get('/check-username/:username', checkUsername);
router.post('/login', login);
router.get("/me", authMiddleware, me);

module.exports = router;
