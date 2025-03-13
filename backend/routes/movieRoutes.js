// movieRoutes.js
const { Router } = require('express');
const { fetchMovies, fetchMostPopularMovies, fetchLastMostPopularMovies, fetchMovieCast, fetchMovieDirector, fetchMovieDetails  } = require('../controllers/movieController.js');
const router = Router();

router.get('/api/movies', fetchMovies);
router.get('/api/movies/most_popular', fetchMostPopularMovies);
router.get('/api/movies/last_most_popular', fetchLastMostPopularMovies);
router.get('/api/movies/:id_api/credits/cast', fetchMovieCast);
router.get('/api/movies/:id_api/credits/director', fetchMovieDirector);
router.get('/api/movies/:id', fetchMovieDetails);

module.exports = router;
