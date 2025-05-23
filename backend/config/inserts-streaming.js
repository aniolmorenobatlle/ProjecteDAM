require('dotenv').config();
const axios = require('axios');
const pool = require('./db.js');

const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const PLATFORM_MAP = {
  "Netflix basic with Ads": "Netflix",
  "Movistar Plus+ Ficción Total": "Movistar Plus+",
  "Amazon Video": "Amazon Prime Video",
};

async function fetchAndInsertStreamingPlatforms(movieId) {
  const client = await pool.connect();

  try {
    const response = await axios.get(`${baseURL}/movie/${movieId}/watch/providers?api_key=${apiKey}`);
    const providers = response.data.results?.ES?.flatrate || [];

    const uniqueProviders = new Map(); // Evita duplicats

    for (let provider of providers) {
      let { provider_id, provider_name, logo_path, display_priority } = provider;
      const providerLogo = logo_path ? `https://image.tmdb.org/t/p/w500${logo_path}` : null;

      // Normalitzar el nom (si està a PLATFORM_MAP)
      provider_name = PLATFORM_MAP[provider_name] || provider_name;

      // Evitar inserir duplicats per nom
      if (uniqueProviders.has(provider_name)) continue;
      uniqueProviders.set(provider_name, { provider_id, providerLogo });

      // Comprovar si la plataforma ja existeix
      const checkStreamingQuery = `SELECT id_api FROM "streaming" WHERE id_api = $1 LIMIT 1`;
      const checkStreamingValues = [provider_id];
      const checkStreamingResult = await client.query(checkStreamingQuery, checkStreamingValues);

      let streamingId;

      if (checkStreamingResult.rowCount === 0) {
        console.log(`Inserint nova plataforma: ${provider_name} (${provider_id})`);

        const insertStreamingQuery = `
          INSERT INTO "streaming" ("name", "logo", "id_api", "created_at")
          VALUES ($1, $2, $3, NOW()) RETURNING id_api;
        `;

        const insertStreamingValues = [provider_name, providerLogo, provider_id];
        const insertStreamingResult = await client.query(insertStreamingQuery, insertStreamingValues);
        streamingId = insertStreamingResult.rows[0].id_api;

        console.log(`Plataforma inserida correctament: ${provider_name} amb id ${streamingId}`);
      } else {
        streamingId = checkStreamingResult.rows[0].id_api;
        console.log(`Plataforma ja existent: ${provider_name} amb id ${streamingId}`);
      }

      // Inserir la relació a la taula "movies_streaming"
      const movieStreamingQuery = `
        INSERT INTO "movies_streaming" ("movie_id", "streaming_id", "display_priority", "created_at")
        VALUES ($1, $2, $3, NOW()) 
        ON CONFLICT ("movie_id", "streaming_id") DO NOTHING;
      `;
      const movieStreamingValues = [movieId, streamingId, display_priority];

      console.log(`Inserint relació movie_id=${movieId}, streaming_id=${streamingId}, display_priority=${display_priority}`);
      await client.query(movieStreamingQuery, movieStreamingValues);

      console.log(`Afegida plataforma "${provider_name}" per a la pel·lícula ${movieId}`);
    }
  } catch (error) {
    console.error(`Error al inserir streaming per a la pel·lícula ${movieId}:`, error);
  } finally {
    client.release();
  }
}

async function processAllMovies() {
  try {
    const client = await pool.connect();
    const query = 'SELECT id_api FROM "movies"';
    const result = await client.query(query);
    client.release();

    const movieIds = result.rows.map(row => row.id_api);

    for (let movieId of movieIds) {
      await fetchAndInsertStreamingPlatforms(movieId);
    }
  } catch (error) {
    console.error('Error al processar les pel·lícules:', error);
  }
}

processAllMovies();
