const pool = require('../config/db');

exports.getLists = async (user_id) => {
  const query = `
    SELECT * FROM lists
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

exports.addList = async (name, user_id) => {
  const query = `
    INSERT INTO lists (user_id, name, created_at)
    VALUES ($1, $2, NOW())
    RETURNING *;
  `;
  const result = await pool.query(query, [user_id, name]);
  return result.rows[0];
}