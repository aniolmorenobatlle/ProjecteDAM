const { hash, compare } = require('bcrypt');
const pool = require('../config/db.js');

exports.createUser = async (name, username, email, password, avatar, poster) => {
  const hashedPassword = await hash(password, 10);
  const query = await pool.query(
    `INSERT INTO "users" ("name", "username", "email", "password", "avatar", "poster", "created_at")
     VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id`,
    [name, username, email, hashedPassword, avatar, poster]
  )
  return query.rows[0].id;
}

exports.findUserByUsername = async (username) => {
  const query = await pool.query(
    `SELECT * FROM "users" WHERE "username" = $1`,
    [username]
  );
  return query.rows[0];
};

exports.findUserAdmin = async (username) => {
  const query = await pool.query(
    `SELECT * FROM "users" WHERE "username" = $1 AND "is_admin" = true`,
    [username]
  );
  return query.rows[0];
};

exports.checkUserExists = async (username) => {
  const query = await pool.query(
    `SELECT id FROM "users" WHERE "username" = $1`,
    [username]
  );
  return query.rows.length > 0;
}

exports.checkEmailExists = async (email) => {
  const query = await pool.query(
    `SELECT id FROM "users" WHERE "email" = $1`,
    [email]
  );
  return query.rows.length > 0;
}

exports.findUserById = async (userId) => {
  const query = await pool.query(
    `SELECT id, name, username, email, avatar_binary, avatar_mime_type, poster, avatar FROM "users" WHERE id = $1`,
    [userId]
  );

  const user = query.rows[0];

  if (user && user.avatar_binary) {
    const mimeType = user.avatar_mime_type || 'image/jpeg'; // Si tens la columna, millor
    if (Buffer.isBuffer(user.avatar_binary)) {
      user.avatar_binary = `data:${mimeType};base64,${user.avatar_binary.toString('base64')}`;
    } else {
      console.error('avatar_binary no és un Buffer');
      user.avatar_binary = null;
    }
  }


  return user;
};

exports.comparePasswords = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};

exports.getCurrentUsername = async (userId) => {
  const query = await pool.query(
    `SELECT username FROM "users" WHERE id = $1`,
    [userId]
  );
  return query.rows[0]?.username;
};

exports.editProfile = async (userId, updates) => {
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    setClauses.push(`name = $${paramIndex}`);
    values.push(updates.name);
    paramIndex++;
  }

  if (updates.username !== undefined) {
    setClauses.push(`username = $${paramIndex}`);
    values.push(updates.username);
    paramIndex++;
  }

  values.push(userId);

  const query = `
    UPDATE "users"
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, name, username;
  `;

  return await pool.query(query, values);
};

exports.editProfilePoster = async (userId, poster) => {
  const query = await pool.query(
    `UPDATE "users" SET poster = $1 WHERE id = $2 RETURNING id, name, username, avatar, poster`,
    [poster, userId]
  );
  return query.rows[0];
};

exports.editProfileAvatar = async (userId, avatar) => {
  const query = await pool.query(
    `UPDATE "users" 
     SET avatar_binary = $1,
         avatar = NULL
     WHERE id = $2
     RETURNING id, name, username, avatar_binary, avatar, poster`,
    [avatar, userId]
  );
  return query.rows[0];
};

exports.getFavorites = async (userId) => {
  const query = await pool.query(
    `
      SELECT m.id_api, m.poster 
      FROM to_watch AS tw
      JOIN movies AS m ON tw.movie_id = m.id_api
      WHERE tw.user_id = $1
      AND tw.favorite = true
      ORDER BY tw.created_at ASC
    `, [userId]
  );
  return query.rows;
};

exports.addFavorite = async (userId, movieId) => {
  const existingFavorite = await pool.query(
    `SELECT * FROM to_watch WHERE user_id = $1 AND movie_id = $2`,
    [userId, movieId]
  );

  if (existingFavorite.rows.length > 0) {
    const updateQuery = await pool.query(
      `
        UPDATE to_watch
        SET favorite = TRUE, created_at = NOW()
        WHERE user_id = $1 AND movie_id = $2
        RETURNING movie_id
      `, [userId, movieId]
    );

    return updateQuery.rows[0];

  } else {
    const insertQuery = await pool.query(
      `
        INSERT INTO to_watch (user_id, movie_id, favorite, created_at)
        VALUES ($1, $2, TRUE, NOW())
        RETURNING movie_id
      `, [userId, movieId]
    );
    return insertQuery.rows[0];
  }
};

exports.deleteFavorite = async (userId, movieId) => {
  const query = await pool.query(
    `
      UPDATE to_watch
      SET favorite = FALSE, created_at = NOW()
      WHERE user_id = $1 
      AND movie_id = $2
      RETURNING movie_id
    `, [userId, movieId]
  );
  return query.rows[0];
};

exports.checkFavoriteExists = async (userId, movieId) => {
  const query = await pool.query(
    `
      SELECT * 
      FROM to_watch 
      WHERE user_id = $1 
      AND movie_id = $2
      AND favorite = TRUE
    `, [userId, movieId]
  );
  return query.rows.length > 0;
};

exports.fetchCounts = async (userId) => {
  const queryComments = await pool.query(
    `
      SELECT COUNT(*)
      FROM comments
      WHERE user_id = $1
    `, [userId]
  )
  const totalReviews = parseInt(queryComments.rows[0].count, 10);

  const queryTotal = await pool.query(
    `
      SELECT COUNT(*)
      FROM to_watch
      WHERE user_id = $1
      AND watched = TRUE
    `, [userId]
  )
  const totalFilms = parseInt(queryTotal.rows[0].count, 10);

  const queryThisYear = await pool.query(
    `
      SELECT COUNT(*)
      FROM to_watch
      WHERE user_id = $1
      AND watched = TRUE
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
    `, [userId]
  )
  const totalFilmsYear = parseInt(queryThisYear.rows[0].count, 10);

  const queryWatchlist = await pool.query(
    `
      SELECT COUNT(*)
      FROM to_watch tw
      WHERE user_id = $1
      AND watchlist = TRUE
    `, [userId]
  )
  const totalWatchlist = parseInt(queryWatchlist.rows[0].count, 10);

  const queryFavorites = await pool.query(
    `
      SELECT COUNT(*)
      FROM to_watch
      WHERE user_id = $1
      AND favorite = TRUE
    `, [userId]
  )
  const totalFavorites = parseInt(queryFavorites.rows[0].count, 10);

  const queryRates = await pool.query(
    `
      SELECT COUNT(*)
      FROM to_watch
      WHERE rating IS NOT NULL
      AND user_id = $1
    `, [userId]
  )
  const totalRates = parseInt(queryRates.rows[0].count, 10);

  const queryFriend = await pool.query(
    `
      SELECT COUNT(*) AS total_friends
      FROM friends
      WHERE (
          (user_id = $1 OR friend_id = $1) 
          AND status = 'accepted'
      )
      AND user_id != friend_id;
    `, [userId]
  );
  const totalFriends = parseInt(queryFriend.rows[0].total_friends, 10);

  return {
    totalReviews,
    totalFilms,
    totalFilmsYear,
    totalWatchlist,
    totalFavorites,
    totalRates,
    totalFriends
  }
}

exports.getUsers = async (limit, offset, search) => {
  const query = await pool.query(
    `SELECT * FROM users 
     WHERE name ILIKE $1 OR email ILIKE $1 OR username ILIKE $1
     ORDER BY id
     LIMIT $2 OFFSET $3`,
    [`%${search || ''}%`, limit, offset]
  );

  return query.rows;
};

exports.countUsers = async () => {
  const query = await pool.query(
    `SELECT COUNT(*) FROM users`
  );

  return parseInt(query.rows[0].count, 10);
};
