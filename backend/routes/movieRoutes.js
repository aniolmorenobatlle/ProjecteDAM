const { Router } = require('express');
const { fetchMovies, fetchMostPopularMovies, fetchLastMostPopularMovies, fetchMovieComments, fetchAddMovieComment, fetchMovieStreaming, fetchMovieCast, fetchMovieDirector, fetchMovieDetails, fetchAddMovieToWatched, fetchAddMovieToLike, fetchAddMovieToWatchlist, fetchMovieStatus, updateMovieStatus } = require('../controllers/movieController.js');
const router = Router();

router.get('/', fetchMovies);
router.get('/most_popular', fetchMostPopularMovies);
router.get('/last_most_popular', fetchLastMostPopularMovies);
router.get('/:id_api/comments', fetchMovieComments);
router.get('/:id_api/streaming', fetchMovieStreaming)
router.get('/:id_api/credits/cast', fetchMovieCast);
router.get('/:id_api/credits/director', fetchMovieDirector);
router.get('/:id', fetchMovieDetails);
router.get('/:id_api/status', fetchMovieStatus);

router.post('/:id_api/comments', fetchAddMovieComment);
router.post('/:id_api/watched', fetchAddMovieToWatched);
router.post('/:id_api/like', fetchAddMovieToLike);
router.post('/:id_api/watchlist', fetchAddMovieToWatchlist);
router.put('/:id_api/status', updateMovieStatus);


module.exports = router;
