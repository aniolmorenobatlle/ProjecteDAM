require('dotenv').config();

const axios = require('axios');
const pool = require('./db.js');

const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3/';
const totalPages = 500;

async function fetchAndInsertMovies() {
  const client = await pool.connect();
  try {
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Carregant la pàgina ${page}...`);

      const response = await axios.get(`${baseURL}movie/popular?api_key=${apiKey}&page=${page}`);
      const movies = response.data.results;

      for (let movie of movies) {
        const { title, release_date, genre_ids, popularity } = movie;
        const cover = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
        const cover2 = movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : null;
        const synopsis = movie.overview || '';

        const movieQuery = `
          INSERT INTO "movies"("name", "release_year", "cover", "cover2", "synopsis", "popularity", "created_at")
          VALUES($1, $2, $3, $4, $5, $6, NOW())
          RETURNING id;
        `;
        
        let releaseYear = release_date || null;
        
        if (releaseYear && !Date.parse(releaseYear)) {
          releaseYear = null;
        }
        
        const movieValues = [title, releaseYear, cover, cover2, synopsis, popularity];
        const result = await client.query(movieQuery, movieValues);
        const newMovieId = result.rows[0].id;

        for (let genreId of genre_ids) {
          const genreQuery = 'INSERT INTO "movies_genres"("movie_id", "genre_id", "created_at") VALUES($1, $2, NOW())';
          const genreValues = [newMovieId, genreId];
          await client.query(genreQuery, genreValues);
          console.log(`Genere associat a la pel·lícula ${title}`);
        }
      }
    }
  } catch (error) {
    console.error('Error al fer la petició o inserir a la base de dades:', error);
  } finally {
    client.release();
  }
}

fetchAndInsertMovies();
