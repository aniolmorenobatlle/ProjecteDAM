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

module.exports = { getMovies, getMoviesCount };
