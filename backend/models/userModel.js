const { hash, compare } = require('bcrypt');
const pool = require('../config/db.js');

const createUser = async (name, username, email, password) => {
  const hashedPassword = await hash(password, 10);
  const result = await pool.query(
    `INSERT INTO "users" ("name", "username", "email", "password", "created_at")
     VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
    [name, username, email, hashedPassword]
  )
  return result.rows[0].id;
}

const findUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT * FROM "users" WHERE "username" = $1`,
    [username]
  );
  return result.rows[0];
};

const checkUserExists = async (username) => {
  const result = await pool.query(
    `SELECT id FROM "users" WHERE "username" = $1`,
    [username]
  );
  return result.rows.length > 0;
}

const findUserById = async (userId) => {
  const result = await pool.query(
    `SELECT id, name, username, email, image FROM "users" WHERE id = $1`,
    [userId]
  );
  return result.rows[0];
};

const comparePasswords = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};

module.exports = {
  createUser,
  findUserByUsername,
  checkUserExists,
  findUserById,
  comparePasswords,
}; 