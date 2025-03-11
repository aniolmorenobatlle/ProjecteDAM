// movieRoutes.js
const { Router } = require('express');
const { fetchMovies } = require('../controllers/movieController.js');
const router = Router();

router.get('/api/movies', fetchMovies);

module.exports = router;
