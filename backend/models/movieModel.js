const pool = require('../config/db.js');

exports.getMovies = async (limit, offset, sort = 'created_at', order = 'DESC') => {
  const validSorts = ['title', 'release_year', 'vote_average', 'created_at'];
  const validOrders = ['ASC', 'DESC'];

  const safeSort = validSorts.includes(sort) ? sort : 'created_at';
  const safeOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

  const query = await pool.query(`
    SELECT 
      m.id,
      m.title,
      m.release_year,
      m.poster,
      m.cover,
      m.synopsis,
      m.vote_average,
      m.id_api,
      m.created_at,
      m.is_trending
    FROM movies m
    ORDER BY m.${safeSort} ${safeOrder}
    LIMIT $1 OFFSET $2;`,
    [limit, offset]
  );

  return query.rows;
};

exports.getDirectors = async (limit, offset) => {
  const query = await pool.query(
    `SELECT * FROM directors LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return query.rows;
};

exports.getDirectorsCount = async () => {
  const query = await pool.query(
    `SELECT COUNT(*) FROM directors`
  );

  return parseInt(query.rows[0].count);
};

exports.getDirectorsQuery = async (limit, offset, query) => {
  const directorQuery = `
    SELECT *
    FROM directors
    WHERE LOWER(name) LIKE LOWER($1)
    LIMIT $2 OFFSET $3
  `;
  const result = await pool.query(directorQuery, [`%${query}%`, limit, offset]);
  return result.rows;
};

exports.getMoviesQuery = async (limit, offset, query, sort = 'created_at', order = 'DESC') => {
  const validSorts = ['title', 'release_year', 'vote_average', 'created_at'];
  const validOrders = ['ASC', 'DESC'];

  const safeSort = validSorts.includes(sort) ? sort : 'created_at';
  const safeOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

  const moviesQuery = await pool.query(`
    SELECT 
      m.id,
      m.title,
      m.release_year,
      m.poster,
      m.cover,
      m.synopsis,
      m.vote_average,
      m.id_api,
      m.created_at,
      m.is_trending
    FROM movies m
    WHERE (LOWER(m.title) LIKE LOWER($1))
      AND m.poster IS NOT NULL
    ORDER BY m.${safeSort} ${safeOrder}
    LIMIT $2 OFFSET $3;`,
    [`%${query}%`, limit, offset]
  );

  return moviesQuery.rows;
};

exports.getMoviesCountByQuery = async (query) => {
  const countQuery = `
    SELECT COUNT(*) 
    FROM movies
    WHERE LOWER(title) LIKE LOWER($1)
    AND poster IS NOT NULL;
  `;
  const result = await pool.query(countQuery, [`%${query}%`]);
  return parseInt(result.rows[0].count);
};

exports.getMoviesMin = async (limit, offset, query) => {
  const movieQuery = `
    SELECT m.id_api, m.title, m.poster, m.release_year AS director_name
    FROM movies m
    WHERE LOWER(m.title) LIKE LOWER($1)
    AND m.poster IS NOT NULL
    LIMIT $2 OFFSET $3
  `;

  const result = await pool.query(movieQuery, [`%${query}%`, limit, offset]);
  return result.rows;
}

exports.getMoviesCount = async () => {
  const query = 'SELECT COUNT(*) FROM "movies"';
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
};

exports.getMovieByTitle = async (title) => {
  const query = 'SELECT * FROM "movies" WHERE title = $1 LIMIT 1';
  const result = await pool.query(query, [title]);

  return result.rows[0];
};

exports.getTrendingMovies = async () => {
  const query = `
    SELECT * FROM "movies"
    WHERE "is_trending" = TRUE
  `;

  const result = await pool.query(query, []);
  return result.rows;
};

exports.getMovieComments = async (id) => {
  const query = `
    SELECT c.*, u.username, u.avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.movie_id = $1
    ORDER BY c.created_at DESC 
  `;
  const result = await pool.query(query, [id]);
  return result.rows;
};

exports.getMovieStreaming = async (id_api) => {
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

exports.getMovieCreditsCast = async (id) => {
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

exports.getMovieCreditsDirector = async (id) => {
  const query = `
    SELECT 
      m.id_api, 
      d.id AS director_id, 
      d.name AS director_name 
    FROM "movies" m 
    LEFT JOIN "movies_directors" md ON m.id_api = md.movie_id 
    LEFT JOIN "directors" d ON md.director_id = d.id 
    WHERE m.id_api = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows;
};

exports.getMovieById = async (id) => {
  const query = 'SELECT * FROM "movies" WHERE id_api = $1 LIMIT 1';
  const result = await pool.query(query, [id]);

  return result.rows[0];
};

exports.getMovieStatus = async (user_id, id_api) => {
  const query = `
    SELECT * FROM to_watch
    WHERE user_id = $1 AND movie_id = $2
  `;
  const result = await pool.query(query, [user_id, id_api]);
  return result.rows[0];
};

exports.updateMovieStatus = async (user_id, id_api, watched, likes, watchlist) => {
  const query = `
    INSERT INTO to_watch (user_id, movie_id, watched, likes, watchlist, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (user_id, movie_id)
    DO UPDATE SET 
      watched = $3,
      likes = $4,
      watchlist = $5;
  `;

  await pool.query(query, [user_id, id_api, watched, likes, watchlist]);
};

exports.updateMovieRate = async (user_id, id_api, rate) => {
  const query = `
    INSERT INTO to_watch (user_id, movie_id, rating, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (user_id, movie_id)
    DO UPDATE SET rating = $3;
  `;

  await pool.query(query, [user_id, id_api, rate]);
};

exports.getFavoritesUserMovies = async (user_id) => {
  const query = `
    SELECT * FROM to_watch
    WHERE user_id = $1
    AND likes = true
    ORDER BY created_at ASC
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

exports.addMovieComment = async (id_api, user_id, comment) => {
  const query = `
    INSERT INTO comments (movie_id, user_id, comment, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
  `;
  const result = await pool.query(query, [id_api, user_id, comment]);
  return result.rows[0];
};

exports.addMovieIsWatched = async (user_id, id_api) => {
  const query = `
    INSERT INTO to_watch (user_id, movie_id, watched, created_at)
    VALUES ($1, $2, true, NOW())
    ON CONFLICT (user_id, movie_id) 
    DO UPDATE SET watched = true
    RETURNING *;
  `;

  const result = await pool.query(query, [user_id, id_api]);
  return result.rows[0];
};

exports.addMovieIsLike = async (user_id, id_api) => {
  const query = `
    INSERT INTO to_watch (user_id, movie_id, likes, created_at)
    VALUES ($1, $2, true, NOW())
    ON CONFLICT (user_id, movie_id) 
    DO UPDATE SET likes = true
    RETURNING *;
  `;

  const result = await pool.query(query, [user_id, id_api]);
  return result.rows[0];
};

exports.addMovieIsWatchlist = async (user_id, id_api) => {
  const query = `
    INSERT INTO to_watch (user_id, movie_id, watchlist, created_at)
    VALUES ($1, $2, true, NOW())
    ON CONFLICT (user_id, movie_id) 
    DO UPDATE SET watchlist = true
    RETURNING *;
  `;

  const result = await pool.query(query, [user_id, id_api]);
  return result.rows[0];
};

exports.deleteMovie = async (id_api) => {
  const query = await pool.query(
    `DELETE FROM movies WHERE id_api = $1 RETURNING id_api`,
    [id_api]
  );

  return query.rows[0];
};

exports.updateMovie = async (id_api, title, release_year, synopsis, director_id) => {
  const query = await pool.query(
    `UPDATE movies 
      SET
        title = $1,
        release_year = $2,
        synopsis = $3,
        director_id = $4
      WHERE id_api = $5
      RETURNING id_api`,
    [title, release_year, synopsis, director_id, id_api]
  );

  return query.rows[0];
};

exports.getActorMovies = async (actor_id) => {
  const query = await pool.query(`
    SELECT 
      m.id_api,
      m.poster
    FROM movies m
    JOIN movies_actors ma ON m.id_api = ma.movie_id
    JOIN actors a ON ma.actor_id = a.id
    WHERE a.id = $1
  `, [actor_id]);

  return query.rows;
};

exports.deleteComment = async (id_api, comment_id) => {
  const query = await pool.query(`
    DELETE FROM comments 
    WHERE movie_id = $1 AND id = $2 
    RETURNING *
  `, [id_api, comment_id]
  );

  return query.rows[0];
};

exports.editComment = async (id_api, comment_id, comment) => {
  const query = await pool.query(`
    UPDATE comments 
    SET comment = $1
    WHERE movie_id = $2 AND id = $3 
    RETURNING *
  `, [comment, id_api, comment_id]);

  return query.rows[0];
};

exports.getVoteAverage = async (id_api) => {
  const query = await pool.query(`
    SELECT get_vote_average_by_id_api($1) AS vote_average
  `, [id_api]);

  if (query.rows.length === 0) return null;

  return query.rows[0].vote_average;
};
