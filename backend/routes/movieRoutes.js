import { Router } from 'express';
import { fetchMovies } from '../controllers/movieController.js';
const router = Router();

router.get('/api/movies', fetchMovies);

export default router;
