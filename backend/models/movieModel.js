import pool from '../config/db.js';

const getMovies = async (limit, offset) => {
  const query = 'SELECT * FROM "Movies" LIMIT $1 OFFSET $2';
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const getMoviesCount = async () => {
  const query = 'SELECT COUNT(*) FROM "Movies"';
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};

export default { getMovies, getMoviesCount };
