const { Router } = require('express');
const { fetchMovies, fetchMostPopularMovies, fetchLastMostPopularMovies, fetchMovieStreaming, fetchMovieCast, fetchMovieDirector, fetchMovieDetails } = require('../controllers/movieController.js');
const router = Router();

router.get('/', fetchMovies);
router.get('/most_popular', fetchMostPopularMovies);
router.get('/last_most_popular', fetchLastMostPopularMovies);
router.get('/:id_api/streaming', fetchMovieStreaming)
router.get('/:id_api/credits/cast', fetchMovieCast);
router.get('/:id_api/credits/director', fetchMovieDirector);
router.get('/:id', fetchMovieDetails);

module.exports = router;
