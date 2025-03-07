import { get } from 'axios';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

// La teva clau API de TMDb
const apiKey = process.env.API_KEY;
const genresURL = 'https://api.themoviedb.org/3/genre/movie/list?api_key=' + apiKey + '&language=en-US';

async function fetchAndInsertGenres() {
  const client = await pool.connect();
  try {
    // Obtenir la llista de gèneres
    const response = await get(genresURL);
    const genres = response.data.genres;

    // Inserir cada gènere a la taula "Genres"
    for (let genre of genres) {
      const { id, name } = genre;

      // Inserir el gènere a la base de dades
      const query = 'INSERT INTO "Genres"("id", "name", "created_at") VALUES($1, $2, NOW())';
      const values = [id, name];
      await client.query(query, values);
      console.log(`Gènere ${name} afegit correctament.`);
    }
  } catch (error) {
    console.error('Error al fer la petició o insertar a la base de dades:', error);
  } finally {
    client.release();
  }
}

// Cridem la funció per executar-ho
fetchAndInsertGenres();