// movieController.js
import movieModel from '../models/movieModel.js'; // Import the default export

export const fetchMovies = async (req, res) => {
  try {
    // Parametres de la paginacio
    const page = parseInt(req.query.page) || 1; // Per defecte comença per la 1
    const limit = parseInt(req.query.limit) || 20; // Limit de 20 pelis per pagina
    const offset = (page - 1) * limit; // Calcula l'offset

    const movies = await movieModel.getMovies(limit, offset);  // Access functions via the default export
    const totalMovies = await movieModel.getMoviesCount();     // Access functions via the default export

    // Retornar pelis
    res.json({
      movies,
      page,
      limit,
      total: totalMovies,
      totalPages: Math.ceil(totalMovies / limit),
    });
  } catch (error) {
    console.error('Error obtenint les pel·lícules:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
