// movieRoutes.js
const { Router } = require('express');
const { fetchMovies, fetchMostPopularMovies, fetchMovieDetails } = require('../controllers/movieController.js');
const router = Router();

router.get('/api/movies', fetchMovies);
router.get('/api/movies/most_popular', fetchMostPopularMovies);
router.get('/api/movies/:id', fetchMovieDetails);

module.exports = router;
