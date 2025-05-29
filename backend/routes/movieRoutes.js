const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const adminMiddleware = require('../middleware/adminMiddleware.js');

const { fetchMovies, fetchMoviesMin, fetchMostPopularMovies, fetchTrendingMovies, fetchMovieComments, fetchAddMovieComment, fetchMovieStreaming, fetchMovieCast, fetchMovieDirector, fetchMovieDetails, fetchAddMovieToWatched, fetchAddMovieToLike, fetchAddMovieToWatchlist, fetchMovieStatus, updateMovieStatus, fetchFavoriteUserMovies, updateMovieRate, deleteMovie, fetchDirectors, updateMovie, fetchActorMovies, deleteComment, editComment } = require('../controllers/movieController.js');

const router = Router();

router.get('/', fetchMovies);
router.get('/directors', fetchDirectors);
router.get('/search', fetchMoviesMin);
router.get('/most_popular', fetchMostPopularMovies);
router.get('/trending', fetchTrendingMovies);
router.get('/actor/:actor_id', fetchActorMovies);
router.get('/:id_api/comments', fetchMovieComments);
router.get('/:id_api/streaming', fetchMovieStreaming)
router.get('/:id_api/credits/cast', fetchMovieCast);
router.get('/:id_api/credits/director', fetchMovieDirector);
router.get('/favorites/:userId', fetchFavoriteUserMovies);
router.get('/:id', fetchMovieDetails);
router.get('/:id_api/status', fetchMovieStatus);

router.post('/:id_api/comments', fetchAddMovieComment);
router.post('/:id_api/comments/:comment_id/edit', authMiddleware, editComment);
router.post('/:id_api/watched', fetchAddMovieToWatched);
router.post('/:id_api/like', fetchAddMovieToLike);
router.post('/:id_api/watchlist', fetchAddMovieToWatchlist);

router.delete('/:id_api/comments/:comment_id', authMiddleware, deleteComment);

router.put('/:id_api/status', updateMovieStatus);
router.put('/:id_api/status/rate', updateMovieRate);

// Desktop
router.put('/update-movie/:id_api', authMiddleware, adminMiddleware, updateMovie)

router.delete('/delete-movie/:id_api', authMiddleware, adminMiddleware, deleteMovie)


module.exports = router;
