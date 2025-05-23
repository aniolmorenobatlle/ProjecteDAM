const pool = require('../config/db');

exports.getLists = async (user_id) => {
  const query = `
    SELECT 
      l.*, 
      (SELECT COUNT(*) FROM movie_list WHERE list_id = l.id) AS movie_count
    FROM lists l
    WHERE l.user_id = $1
    ORDER BY l.created_at DESC;
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

exports.getSharedLists = async (user_id) => {
  const query = await pool.query(`
    SELECT 
      sl.*, 
      l.name AS list_name,
      u1.username AS user_username,
      u2.username AS friend_username
    FROM shared_lists sl
    JOIN lists l ON sl.list_id = l.id
    JOIN users u1 ON sl.user_id = u1.id
    JOIN users u2 ON sl.friend_id = u2.id
    WHERE sl.friend_id = $1
    ORDER BY sl.created_at DESC;
  `, [user_id]);

  return query.rows;
};

exports.addList = async (name, user_id) => {
  const query = `
    INSERT INTO lists (user_id, name, created_at)
    VALUES ($1, $2, NOW())
    RETURNING *;
  `;
  const result = await pool.query(query, [user_id, name]);
  return result.rows[0];
};

exports.deleteList = async (list_id) => {
  const query = `
    DELETE FROM lists
    WHERE id = $1;
  `;
  await pool.query(query, [list_id]);
};

exports.getListInfo = async (list_id) => {
  const query = `
    SELECT m.id_api, m.title, m.poster, m.cover
    FROM movies m
    JOIN movie_list ml ON ml.movie_id = m.id_api
    WHERE ml.list_id = $1;
  `;
  const result = await pool.query(query, [list_id]);
  return result.rows;
};

exports.addFilmToList = async (list_id, movie_id) => {
  const query = `
    INSERT INTO movie_list (list_id, movie_id, created_at)
    VALUES ($1, $2, NOW());
  `;
  await pool.query(query, [list_id, movie_id]);
};

exports.deleteFilmFromList = async (list_id, movie_id) => {
  const query = `
    DELETE FROM movie_list
    WHERE list_id = $1 AND movie_id = $2;
  `;
  await pool.query(query, [list_id, movie_id]);
};

exports.shareList = async (list_id, user_id, friend_id) => {
  const query = await pool.query(
    `
      INSERT INTO shared_lists (list_id, user_id, friend_id, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `, [list_id, user_id, friend_id]
  );

  return query.rows[0];
};

exports.checkMovieInList = async (listId, movieId) => {
  const query = `
    SELECT EXISTS (
      SELECT 1 
      FROM movie_list 
      WHERE list_id = $1 AND movie_id = $2
    ) AS exists;
  `;
  const result = await pool.query(query, [listId, movieId]);
  return result.rows[0].exists;
};
