require('dotenv').config();
const axios = require('axios');
const pool = require('./db.js');

const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3/';

// Funció per obtenir i afegir actors i director
async function fetchAndInsertActorsAndDirector(movieId) {
  const client = await pool.connect();
  try {
    // Obtenir els crèdits de la pel·lícula
    const response = await axios.get(`${baseURL}movie/${movieId}/credits?api_key=${apiKey}`);
    const { cast, crew } = response.data;

    for (let actor of cast) {
      const { id: actorId, name, profile_path } = actor;
      const actorImage = profile_path ? `https://image.tmdb.org/t/p/w500${profile_path}` : null;

      // Comprovar si l'actor ja existeix
      // Comprovar si l'actor ja existeix
      const checkActorQuery = `SELECT id FROM "actors" WHERE "id_api" = $1 LIMIT 1`;
      const checkActorValues = [actorId];  // Utilitzant `id_api` de TMDB
      const checkActorResult = await client.query(checkActorQuery, checkActorValues);

      let actorDbId;

      if (checkActorResult.rowCount === 0) {
        // Si l'actor no existeix, el inserim
        const actorQuery = `
          INSERT INTO "actors"("name", "image", "id_api", "created_at")
          VALUES($1, $2, $3, NOW()) RETURNING id;
        `;
        const actorValues = [name, actorImage, actorId];
        const actorResult = await client.query(actorQuery, actorValues);
        actorDbId = actorResult.rows[0].id;  // Aquí obtenim l'ID intern de PostgreSQL
      } else {
        // Si l'actor ja existeix, utilitzem el seu ID intern
        actorDbId = checkActorResult.rows[0].id;
      }

      // Ara utilitzem l'ID intern de PostgreSQL per insertar la relació a la taula movies_actors
      const movieActorQuery = 'INSERT INTO "movies_actors"("movie_id", "actor_id", "created_at") VALUES($1, $2, NOW())';
      const movieActorValues = [movieId, actorDbId];  // Utilitzem `actorDbId`, l'ID intern generat per PostgreSQL
      await client.query(movieActorQuery, movieActorValues);
      console.log(`Actor associat a la pel·lícula ${movieId}: ${name}`);
    }

    // Afegir director (només el principal)
    const director = crew.find(person => person.job === 'Director');
    if (director) {
      const { id: directorId, name: directorName } = director;

      // Comprovar si el director ja existeix
      const checkDirectorQuery = `SELECT 1 FROM "director" WHERE "id_api" = $1 LIMIT 1`;
      const checkDirectorValues = [directorId];
      const checkDirectorResult = await client.query(checkDirectorQuery, checkDirectorValues);

      let directorDbId;

      if (checkDirectorResult.rowCount === 0) {
        // Si el director no existeix, el inserim
        const directorQuery = `
          INSERT INTO "director"("name", "id_api", "created_at")
          VALUES($1, $2, NOW()) RETURNING id;
        `;
        const directorValues = [directorName, directorId]; // Afegim id_api
        const directorResult = await client.query(directorQuery, directorValues);
        directorDbId = directorResult.rows[0].id;
      } else {
        // Si el director ja existeix, utilitzem el seu ID
        directorDbId = checkDirectorResult.rows[0].id;
      }

      // Actualitzar la pel·lícula amb el director
      const movieDirectorQuery = 'UPDATE "movies" SET "director_id" = $1 WHERE "id_api" = $2';
      const movieDirectorValues = [directorDbId, movieId];
      await client.query(movieDirectorQuery, movieDirectorValues);
      console.log(`Director associat a la pel·lícula ${movieId}: ${directorName}`);
    }
  } catch (error) {
    console.error('Error al obtenir o inserir actors/director:', error);
  } finally {
    client.release();
  }
}

fetchAndInsertActorsAndDirector(447273);
