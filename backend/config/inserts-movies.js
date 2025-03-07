import { get } from 'axios';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3/';
const totalPages = 500;

async function fetchAndInsertMovies() {
  const client = await pool.connect();
  try {
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Carregant la pàgina ${page}...`);

      // Recuperem les pel·lícules de la pàgina actual
      const response = await get(`${baseURL}movie/popular?api_key=${apiKey}&page=${page}`);
      const movies = response.data.results;

      for (let movie of movies) {
        const { title, release_date, genre_ids } = movie;
        const year = release_date ? release_date.split('-')[0] : null;
        const cover = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
        const cover2 = movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : null;
        const synopsis = movie.overview || '';

        const movieQuery = `
          INSERT INTO "Movies"("name", "release_year", "cover", "cover2", "synopsis", "created_at")
          VALUES($1, $2, $3, $4, $5, NOW())
          RETURNING id;
        `;

        const movieValues = [title, year, cover, cover2, synopsis];
        const result = await client.query(movieQuery, movieValues);
        const newMovieId = result.rows[0].id; // Obtenir id autoincremental

        // Vincluar peli amb el genere
        for (let genreId of genre_ids) {
          const genreQuery = 'INSERT INTO "Movies_Genres"("movie_id", "genre_id", "created_at") VALUES($1, $2, NOW())';
          const genreValues = [newMovieId, genreId];
          await client.query(genreQuery, genreValues);
          console.log(`Genere associat a la pel·licula ${title}`);
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