const axios = require('axios');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const genresURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`;

async function fetchAndInsertGenres() {
  try {
    const response = await axios.get(genresURL);
    const genres = response.data.genres;

    for (const genre of genres) {
      const { id, name } = genre;

      const query = `
        INSERT INTO genres(id, name, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (id) DO NOTHING;
      `;

      await pool.query(query, [id, name]);
      console.log(`Gènere ${name} afegit correctament.`);
    }

  } catch (error) {
    console.error('Error:', error.message || error);
  } finally {
    await pool.end();
  }
}

fetchAndInsertGenres();
