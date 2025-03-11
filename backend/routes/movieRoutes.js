// movieRoutes.js
const { Router } = require('express');
const { fetchMovies } = require('../controllers/movieController.js');
const { fetchMostPopularMovies } = require('../controllers/mostPopularController.js');
const router = Router();

router.get('/api/movies', fetchMovies);
router.get('/api/movies/most_popular', fetchMostPopularMovies);

module.exports = router;
