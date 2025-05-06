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

    // Cerca pelis
    const query = req.query.query || '';

    let movies;
    let totalMovies;

    if (query) {
      movies = await movieModel.getMoviesQuery(limit, offset, query);
      totalMovies = await movieModel.getMoviesCount(query);
    } else {
      movies = await movieModel.getMovies(limit, offset);
      totalMovies = await movieModel.getMoviesCount();
    }

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

exports.fetchDirectors = async (req, res) => {
  try {
    // Parametres de la paginacio
    const page = parseInt(req.query.page) || 1; // Per defecte comença per la 1
    const limit = parseInt(req.query.limit) || 20; // Limit de 20 pelis per pagina
    const offset = (page - 1) * limit; // Calcula l'offset

    // Cerca pelis
    const query = req.query.query || '';

    let directors;
    let totalDirectors;

    if (query) {
      directors = await movieModel.getMoviesQuery(limit, offset, query);
      totalDirectors = await movieModel.getDirectorsCount(query);
    } else {
      directors = await movieModel.getMovies(limit, offset);
      totalDirectors = await movieModel.getDirectorsCount();
    }

    // Retornar directors
    res.json({
      directors,
      page,
      limit,
      total: totalDirectors,
      totalPages: Math.ceil(totalDirectors / limit),
    });
  } catch (error) {
    console.error('Error obtenint els directors:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.fetchMoviesMin = async (req, res) => {
  try {
    // Parametres de la paginacio
    const page = parseInt(req.query.page) || 1; // Per defecte comença per la 1
    const limit = parseInt(req.query.limit) || 20; // Limit de 20 pelis per pagina
    const offset = (page - 1) * limit; // Calcula l'offset

    // Cerca pelis
    const query = req.query.query || '';

    let movies;
    let totalMovies;

    if (query) {
      movies = await movieModel.getMoviesMin(limit, offset, query);
      totalMovies = await movieModel.getMoviesCount(query);
    } else {
      movies = await movieModel.getMoviesMin(limit, offset);
      totalMovies = await movieModel.getMoviesCount();
    }

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
}

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

exports.fetchTrendingMovies = async (_, res) => {
  try {
    const movies = await movieModel.getTrendingMovies();
    res.json({ movies });
  } catch (error) {
    console.error("Error obtenint les pel·lícules més populars del darrer mes:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.fetchMovieComments = async (req, res) => {
  try {
    const { id_api } = req.params;
    const comments = await movieModel.getMovieComments(id_api);

    if (!comments.length) {
      return res.status(404).json({ message: 'Comentaris no trobats' });
    }

    res.json(comments);
  } catch (error) {
    console.error('Error obtenint els comentaris de la pel·lícula:', error);
    res.status(500).json({ message: 'Error del servidor' });
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
};

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
};

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
};

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

exports.fetchMovieStatus = async (req, res) => {
  try {
    const { id_api } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "Falta l'identificador de l'usuari" });
    }

    const status = await movieModel.getMovieStatus(user_id, id_api);

    if (!status) {
      return res.json({ watched: false, likes: false, watchlist: false });
    }

    res.json(status);
  } catch (error) {
    console.error('Error obtenint l\'estat de la pel·lícula:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.updateMovieStatus = async (req, res) => {
  try {
    const { id_api } = req.params;
    const { user_id, likes, watched, watchlist } = req.body;

    if (!user_id) {
      console.log("Falta l'identificador de l'usuari");
      return res.status(400).json({ message: "Falta l'identificador de l'usuari" });
    }

    if (likes === undefined || watched === undefined || watchlist === undefined) {
      console.log("Falten valors necessaris", { likes, watched, watchlist });
      return res.status(400).json({ message: "Falten valors necessaris" });
    }

    await movieModel.updateMovieStatus(user_id, id_api, watched, likes, watchlist);

    res.json({ message: "Estat actualitzat correctament" });
  } catch (error) {
    console.error("Error actualitzant l'estat de la pel·lícula:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.updateMovieRate = async (req, res) => {
  try {
    const { id_api } = req.params;
    const { user_id, rate } = req.body;

    if (user_id === undefined || rate === undefined) {
      console.log("Falten camps obligatoris");
      return res.status(400).json({ message: 'Falten camps obligatoris' });
    }

    if (rate === null || rate === undefined) {
      console.log("Valoració no vàlida");
      return res.status(400).json({ message: 'Valoració no vàlida' });
    }

    await movieModel.updateMovieRate(user_id, id_api, rate);
    res.json({ message: 'Puntuació actualitzada correctament' });

  } catch (error) {
    console.error('Error actualitzant la puntuació de la pel·lícula:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.fetchFavoriteUserMovies = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      console.log("Falta l'identificador de l'usuari");
      return res.status(400).json({ message: "Falta l'identificador de l'usuari" });
    }

    const favorites = await movieModel.getFavoritesUserMovies(user_id);

    const detailedMovies = await Promise.all(
      favorites.map(async (movie) => {
        const movieDetails = await movieModel.getMovieById(movie.movie_id);
        return { ...movie, ...movieDetails };
      })
    );

    res.json({ movies: detailedMovies });
  } catch (error) {
    console.error('Error obtenint les pel·lícules favorites de l\'usuari:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.fetchAddMovieComment = async (req, res) => {
  try {
    const { id_api } = req.params;
    const { user_id, content } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ message: 'Falten camps obligatoris' });
    }

    await movieModel.addMovieComment(id_api, user_id, content);
    res.json({ message: 'Comentari afegit correctament' });
  } catch (error) {
    console.error('Error afegint el comentari a la pel·lícula:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.fetchAddMovieToWatched = async (req, res) => {
  try {
    const { id_api } = req.params;
    const { user_id } = req.body;

    if (!user_id || !id_api) {
      return res.status(400).json({ message: "Falten dades (user_id o id_api)" });
    }

    const movie = await movieModel.addMovieIsWatched(user_id, id_api);

    res.json({
      message: "Pel·lícula afegida a les vistes correctament",
      movie
    });

  } catch (error) {
    console.error("Error afegint la pel·lícula a les vistes:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.fetchAddMovieToLike = async (req, res) => {
  try {
    const { id_api } = req.params;
    const { user_id } = req.body;

    if (!user_id || !id_api) {
      return res.status(400).json({ message: "Falten dades (user_id o id_api)" });
    }

    const movie = await movieModel.addMovieIsLike(user_id, id_api);

    res.json({
      message: "Pel·lícula afegida a likes correctament",
      movie
    });

  } catch (error) {
    console.error("Error afegint la pel·lícula a les vistes:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.fetchAddMovieToWatchlist = async (req, res) => {
  try {
    const { id_api } = req.params;
    const { user_id } = req.body;

    if (!user_id || !id_api) {
      return res.status(400).json({ message: "Falten dades (user_id o id_api)" });
    }

    const movie = await movieModel.addMovieIsWatchlist(user_id, id_api);

    res.json({
      message: "Pel·lícula afegida a veure més tard correctament",
      movie
    });

  } catch (error) {
    console.error("Error afegint la pel·lícula a les vistes:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const { id_api } = req.params;

    if (!id_api) {
      return res.status(400).json({ message: "Falten dades (id_api)" });
    }

    const movie = await movieModel.deleteMovie(id_api);

    if (!movie) {
      return res.status(404).json({ message: "Pel·lícula no trobada" });
    }

    res.json({
      message: "Pel·lícula eliminada correctament",
      movie
    });

  } catch (error) {
    console.error("Error eliminant la pel·lícula:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
}
