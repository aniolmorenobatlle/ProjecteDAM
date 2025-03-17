const movieModel = require('../models/movieModel.js');

const mostPopularMovies = [
  'The Shawshank Redemption',
  'The Godfather',
  'The Dark Knight',
  'The Godfather Part II',
  '12 Angry Men',
  'The Lord of the Rings: The Return of the King',
  'Schindler\'s List',
  'Pulp Fiction',
  'The Lord of the Rings: The Fellowship of the Ring',
  'The Good, the Bad and the Ugly',
  'Forrest Gump',
  'The Lord of the Rings: The Two Towers',
  'Fight Club',
  'Inception',
  'Star Wars: Episode V - The Empire Strikes Back',
  'The Matrix',
  'Goodfellas',
  'One Flew Over the Cuckoo\'s Nest',
  'Interstellar',
  'Se7en',
  'It\'s a Wonderful Life',
  'Seven Samurai',
  'The Silence of the Lambs',
  'Saving Private Ryan',
  'City of God',
  'The Green Mile',
  'Life Is Beautiful',
  'Terminator 2: Judgment Day',
  'Star Wars: Episode IV - A New Hope',
  'Back to the Future',
  'Spirited Away',
  'The Pianist'
];


exports.fetchMovies = async (req, res) => {
  try {
    // Parametres de la paginacio
    const page = parseInt(req.query.page) || 1; // Per defecte comença per la 1
    const limit = parseInt(req.query.limit) || 20; // Limit de 20 pelis per pagina
    const offset = (page - 1) * limit; // Calcula l'offset

    const movies = await movieModel.getMovies(limit, offset);
    const totalMovies = await movieModel.getMoviesCount();

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

exports.fetchMostPopularMovies = async (_, res) => {
  try {
    const movies = await Promise.all(
      mostPopularMovies.map(async (title) => {
        const movie = await movieModel.getMovieByTitle(title);
        return movie;
      })
    );

    const validMovies = movies.filter(movie => movie);

    res.json({
      movies: validMovies,
    });
  } catch (error) {
    console.error('Error obtenint les pel·lícules més populars:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.fetchLastMostPopularMovies = async (_, res) => {
  try {
    const movies = await movieModel.getLastMostPopularMovies();
    res.json({ movies });
  } catch (error) {
    console.error("Error obtenint les pel·lícules més populars del darrer mes:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.fetchMovieStreaming = async (req, res) => {
  try {
    const { id_api } = req.params;
    const movie = await movieModel.getMovieStreaming(id_api);

    if (!movie) {
      return res.status(404).json({ message: 'Pel·lícula no trobada' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error obtenint la pel·lícula en streaming:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

exports.fetchMovieCast = async (req, res) => {
  try {
    const { id_api } = req.params;
    const credits = await movieModel.getMovieCreditsCast(id_api);

    if (!credits.length) {
      return res.status(404).json({ message: 'Crèdits no trobats' });
    }

    const cast = credits
      .filter(credit => credit.actor_profile_path)
      .sort((a, b) => a.order - b.order)
      .map(credit => ({
        id: credit.actor_id,
        known_for_department: 'Acting',
        name: credit.actor_name,
        profile_path: credit.actor_profile_path ? `https://image.tmdb.org/t/p/w500${credit.actor_profile_path}` : null,
        cast_id: credit.actor_id,
        credit_id: `actor_${credit.actor_id}`,
        order: credit.order,
      }));

    const creditsResponse = {
      id: id_api,
      cast: cast,
    };

    res.json(creditsResponse);

  } catch (error) {
    console.error('Error obtenint els crèdits de la pel·lícula:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

exports.fetchMovieDirector = async (req, res) => {
  try {
    const { id_api } = req.params;
    const director = await movieModel.getMovieCreditsDirector(id_api);

    if (!director.length) {
      return res.status(404).json({ message: 'Director no trobat' });
    }

    const directorResponse = director.map(credit => ({
      id: credit.director_id,
      known_for_department: 'Directing',
      name: credit.director_name,
      job: 'Director',
    }));

    res.json({ id: id_api, crew: directorResponse });

  } catch (error) {
    console.error('Error obtenint el director de la pel·lícula:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

exports.fetchMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieModel.getMovieById(id);

    if (!movie) {
      return res.status(404).json({ message: 'Pel·lícula no trobada' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error obtenint els detalls de la pel·lícula:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
