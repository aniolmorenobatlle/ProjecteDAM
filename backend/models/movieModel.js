// movieModel.js
const pool = require('../config/db.js');

const getMovies = async (limit, offset) => {
  const query = 'SELECT * FROM "movies" LIMIT $1 OFFSET $2';
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const getMoviesCount = async () => {
  const query = 'SELECT COUNT(*) FROM "movies"';
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};

const getMovieByTitle = async (title) => {
  const query = 'SELECT * FROM "movies" WHERE name = $1 LIMIT 1';
  const result = await pool.query(query, [title]);
  
  return result.rows[0];
};

const getMovieById = async (id) => {
  const query = 'SELECT * FROM "movies" WHERE id = $1 LIMIT 1';
  const result = await pool.query(query, [id]);
  
  return result.rows[0];
}

module.exports = { getMovies, getMoviesCount, getMovieByTitle, getMovieById };
