const axios = require('axios');
const { exec } = require('child_process');

const apiKey = '38744b6c459ddd6f2e5e97a7d598773e';
const genresURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

// Configura les credencials de PostgreSQL
const dbUser = 'aniol';
const dbHost = 'postgres';
const dbName = 'movies_knex';
const dbPassword = 'password';
const dbPort = 5432;

async function fetchAndInsertGenres() {
  try {
    // 1. Fer la petició a l'API
    const response = await axios.get(genresURL);
    const genres = response.data.genres;

    // 2. Insertar cada gènere a la base de dades
    for (let genre of genres) {
      const { id, name } = genre;
      const query = `INSERT INTO "genres"("id", "name", "created_at") VALUES(${id}, '${name.replace("'", "''")}', NOW());`;
      const command = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -U ${dbUser} -d ${dbName} -c "${query}"`;

      // Executar la comanda
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${stderr}`);
        } else {
          console.log(`Gènere ${name} afegit correctament.`);
        }
      });
    }
  } catch (error) {
    console.error('Error al fer la petició a l\'API:', error);
  }
}

fetchAndInsertGenres();
