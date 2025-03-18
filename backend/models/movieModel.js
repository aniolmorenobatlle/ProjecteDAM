const pool = require('../config/db.js');

const getMovies = async (limit, offset) => {
  const query = 'SELECT * FROM "movies" LIMIT $1 OFFSET $2';
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const getMoviesQuery = async (limit, offset, query) => {
  const movieQuery = `
    SELECT *
    FROM movies
    WHERE LOWER(title) LIKE LOWER($1)
    LIMIT $2 OFFSET $3
  `;
  const result = await pool.query(movieQuery, [`%${query}%`, limit, offset]);
  return result.rows;
};

const getMoviesCount = async () => {
  const query = 'SELECT COUNT(*) FROM "movies"';
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};

const getMovieByTitle = async (title) => {
  const query = 'SELECT * FROM "movies" WHERE title = $1 LIMIT 1';
  const result = await pool.query(query, [title]);

  return result.rows[0];
};

const getLastMostPopularMovies = async () => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthString = lastMonth.toISOString().split("T")[0];

  const query = `
    SELECT * FROM "movies"
    WHERE release_year >= $1
    ORDER BY vote_average DESC
    LIMIT 5
  `;

  const result = await pool.query(query, [lastMonthString]);
  return result.rows;
};

const getMovieComments = async (id) => {
  const query = `
    SELECT c.*, u.username, u.image
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.movie_id = $1
    ORDER BY c.created_at DESC 
  `;
  const result = await pool.query(query, [id]);
  return result.rows;
};

const addMovieComment = async (id_api, user_id, comment) => {
  const query = `
    INSERT INTO comments (movie_id, user_id, comment, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
  `;
  const result = await pool.query(query, [id_api, user_id, comment]);
  return result.rows[0];
};

const getMovieStreaming = async (id_api) => {
  const query = `
    SELECT m.id_api, s.*, ms.display_priority
    FROM streaming s
    JOIN movies_streaming ms ON s.id = ms.streaming_id
    JOIN movies m ON ms.movie_id = m.id_api
    WHERE m.id_api = $1
    ORDER BY ms.display_priority ASC;
  `;

  const result = await pool.query(query, [id_api]);
  return result.rows;
};

const getMovieCreditsCast = async (id) => {
  const query = `
    SELECT
      m.id_api,
      a.id AS actor_id, 
      a.name AS actor_name, 
      a.image AS actor_profile_path,
      ma."order" AS "order"
    FROM "movies" m
    LEFT JOIN "movies_actors" ma ON m.id_api = ma.movie_id
    LEFT JOIN "actors" a ON ma.actor_id = a.id
    WHERE m.id_api = $1
  `;

  const result = await pool.query(query, [id])
  return result.rows;
};

const getMovieCreditsDirector = async (id) => {
  const query = `
    SELECT 
      m.id_api, 
      d.id AS director_id, 
      d.name AS director_name 
    FROM "movies" m 
    LEFT JOIN "directors" d 
    ON m.director_id = d.id 
    WHERE m.id_api = $1;
  `;

  const result = await pool.query(query, [id])
  return result.rows;
};

const getMovieById = async (id) => {
  const query = 'SELECT * FROM "movies" WHERE id_api = $1 LIMIT 1';
  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = { getMovies, getMoviesQuery, getMoviesCount, getMovieByTitle, getLastMostPopularMovies, getMovieComments, addMovieComment, getMovieStreaming, getMovieCreditsCast, getMovieCreditsDirector, getMovieById };
