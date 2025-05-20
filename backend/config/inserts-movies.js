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
        const { title, release_date, genre_ids, vote_average, id } = movie;
        const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
        const cover = movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : null;
        const synopsis = movie.overview || '';

        // Comprovar si la data de llançament és vàlida, si no, utilitzar una data per defecte
        let releaseDate = release_date || '1900-01-01';  // Si no hi ha data, posar una per defecte

        // Si només tens l'any, crea una data completa amb l'any
        if (release_date && release_date.length === 4) {
          releaseDate = `${release_date}-01-01`;
        }

        // Comprovar si la pel·lícula ja existeix per id_api
        const checkMovieQuery = `
          SELECT 1 FROM "movies" WHERE "id_api" = $1 LIMIT 1;
        `;

        const checkMovieValues = [id];
        const checkResult = await client.query(checkMovieQuery, checkMovieValues);

        if (checkResult.rowCount > 0) {
          console.log(`La pel·lícula amb id_api ${id} ja existeix, saltant...`);
          continue;
        }

        // Si la pel·lícula no existeix, la inserim
        const movieQuery = `
          INSERT INTO "movies"("title", "release_year", "poster", "cover", "synopsis", "vote_average", "id_api", "created_at")
          VALUES($1, $2, $3, $4, $5, $6, $7, NOW())
          ON CONFLICT ("id_api") DO NOTHING
          RETURNING id;
        `;

        const movieValues = [title, releaseDate, poster, cover, synopsis, vote_average, id];
        const result = await client.query(movieQuery, movieValues);
        const newMovieId = result.rows.length > 0 ? result.rows[0].id : null;

        if (!newMovieId) {
          console.log(`No s'ha inserit la pel·lícula amb id_api ${id} perquè ja existia.`);
          continue;
        }

        // Inserir els gèneres associats a la pel·lícula
        for (let genreId of genre_ids) {
          const genreQuery = 'INSERT INTO "movies_genres"("movie_id", "genre_id", "created_at") VALUES($1, $2, NOW()) ON CONFLICT DO NOTHING;';
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
