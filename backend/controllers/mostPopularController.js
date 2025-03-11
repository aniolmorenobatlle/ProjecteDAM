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

exports.fetchMostPopularMovies = async (req, res) => {
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
