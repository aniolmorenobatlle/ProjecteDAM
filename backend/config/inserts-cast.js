require('dotenv').config();
const axios = require('axios');
const pool = require('./db.js');

const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3/';

// Obtenir i afegir actors i director
async function fetchAndInsertActorsAndDirector(movieId) {
  const client = await pool.connect();

  try {
    const response = await axios.get(`${baseURL}movie/${movieId}/credits?api_key=${apiKey}`);
    const { cast, crew } = response.data;

    for (let actor of cast) {
      const { id: actorId, name, profile_path, order } = actor;
      const actorImage = profile_path ? `https://image.tmdb.org/t/p/w500${profile_path}` : null;

      // Comprovar si l'actor ja existeix
      const checkActorQuery = `SELECT id FROM "actors" WHERE "id_api" = $1 LIMIT 1`;
      const checkActorValues = [actorId];
      const checkActorResult = await client.query(checkActorQuery, checkActorValues);

      let actorDbId;

      if (checkActorResult.rowCount === 0) {
        // Insertar només els camps necessaris a la taula "actors" (sense "order")
        const actorQuery = `
          INSERT INTO "actors" ("name", "image", "id_api", "created_at")
          VALUES($1, $2, $3, NOW()) RETURNING id;
        `;
        const actorValues = [name, actorImage, actorId];
        const actorResult = await client.query(actorQuery, actorValues);
        actorDbId = actorResult.rows[0].id;
      } else {
        actorDbId = checkActorResult.rows[0].id;
      }

      // Inserir la relació a la taula "movies_actors" amb l'atribut "order"
      const movieActorQuery = `
        INSERT INTO "movies_actors" ("movie_id", "actor_id", "order", "created_at")
        VALUES ($1, $2, $3, NOW()) 
        ON CONFLICT ("movie_id", "actor_id") 
        DO UPDATE SET "order" = EXCLUDED."order";
      `;
      const movieActorValues = [movieId, actorDbId, order];
      await client.query(movieActorQuery, movieActorValues);

      console.log(`Actor associat a la pel·lícula ${movieId}: ${name}`);
    }


    const directors = crew.filter(person => person.job === 'Director');
    for (const director of directors) {
      const { id: directorId, name: directorName } = director;

      // comprovar si existeix
      const checkDirectorQuery = `SELECT id FROM "directors" WHERE "id_api" = $1 LIMIT 1`;
      const checkDirectorResult = await client.query(checkDirectorQuery, [directorId]);
      let directorDbId;

      if (checkDirectorResult.rowCount === 0) {
        const insertDirectorQuery = `
      INSERT INTO "directors" ("name", "id_api", "created_at")
      VALUES($1, $2, NOW()) RETURNING id;
    `;
        const directorResult = await client.query(insertDirectorQuery, [directorName, directorId]);
        directorDbId = directorResult.rows[0].id;
      } else {
        directorDbId = checkDirectorResult.rows[0].id;
      }

      // Inserir relació
      const movieDirectorQuery = `
        INSERT INTO "movies_directors" ("movie_id", "director_id")
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `;
      await client.query(movieDirectorQuery, [movieId, directorDbId]);

      console.log(`Director associat a la pel·lícula ${movieId}: ${directorName}`);
    }
  } catch (error) {
    console.error(`Error al obtenir o inserir actors/director per a la pel·lícula ${movieId}:`, error);
  } finally {
    client.release();
  }
}

// Obtenir les pel·lícules de la base de dades
async function processAllMovies() {
  try {
    const client = await pool.connect();
    const query = 'SELECT id_api FROM "movies"';
    const result = await client.query(query);
    client.release();

    const movieIds = result.rows.map(row => row.id_api);

    for (const movieId of movieIds) {
      await fetchAndInsertActorsAndDirector(movieId);
    }
  } catch (error) {
    console.error('Error obtenint les pel·lícules de la base de dades:', error);
  }
}

processAllMovies();
