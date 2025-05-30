const { hash, compare } = require('bcrypt');
const pool = require('../config/db.js');

exports.getUsers = async (limit, offset, query) => {
  const queryUsers = await pool.query(
    `
      SELECT id, name, username, email, avatar, poster, created_at
      FROM users
      WHERE name ILIKE $1 OR email ILIKE $1 OR username ILIKE $1
      ORDER BY id
      LIMIT $2 OFFSET $3
    `, [`%${query || ''}%`, limit, offset]
  )

  return queryUsers.rows;
};

exports.getUserById = async (userId) => {
  const query = await pool.query(
    `
      SELECT id, name, username, email, avatar, poster, created_at
      FROM users
      WHERE id = $1
    `, [userId]
  )

  return query.rows[0];
}

exports.getUserAvatar = async (userId) => {
  const query = await pool.query(
    `
      SELECT avatar_binary, avatar_mime_type
      FROM users
      WHERE id = $1
    `, [userId]
  );

  return query.rows[0];
};

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
};

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

exports.getCurrentEmail = async (userId) => {
  const query = await pool.query(
    `SELECT email FROM "users" WHERE id = $1`,
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

  if (updates.email !== undefined) {
    setClauses.push(`email = $${paramIndex}`);
    values.push(updates.email);
    paramIndex++;
  }

  values.push(userId);

  const query = `
    UPDATE "users"
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, name, username, email;
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

exports.editProfileAvatar = async (userId, avatarBuffer, mimeType) => {
  const query = await pool.query(
    `UPDATE "users" 
     SET avatar_binary = $1,
         avatar_mime_type = $2,
         avatar = NULL
     WHERE id = $3
     RETURNING id, name, username, avatar_binary, avatar, avatar_mime_type, poster`,
    [avatarBuffer, mimeType, userId]
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

exports.getWatchlist = async (userId) => {
  const query = await pool.query(
    `
      SELECT m.id_api, m.poster 
      FROM to_watch AS tw
      JOIN movies AS m ON tw.movie_id = m.id_api
      WHERE tw.user_id = $1
      AND tw.watchlist = true
      ORDER BY tw.created_at ASC
    `, [userId]
  );
  return query.rows;
};

exports.getWatched = async (userId) => {
  const query = await pool.query(
    `
      SELECT m.id_api, m.poster 
      FROM to_watch AS tw
      JOIN movies AS m ON tw.movie_id = m.id_api
      WHERE tw.user_id = $1
      AND tw.watched = true
      ORDER BY tw.created_at ASC
    `, [userId]
  );
  return query.rows;
};

exports.getWatchedThisYear = async (userId) => {
  const query = await pool.query(
    `
      SELECT m.id_api, m.poster 
      FROM to_watch AS tw
      JOIN movies AS m ON tw.movie_id = m.id_api
      WHERE tw.user_id = $1
      AND tw.watched = true
      AND EXTRACT(YEAR FROM tw.created_at) = EXTRACT(YEAR FROM NOW())
      ORDER BY tw.created_at ASC
    `, [userId]
  );
  return query.rows;
};

exports.getReviews = async (userId) => {
  const query = await pool.query(
    `
      SELECT m.id_api, m.poster, c.comment, c.created_at
      FROM comments AS c
      JOIN movies AS m ON c.movie_id = m.id_api
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [userId]
  );
  return query.rows;
};

exports.getLikes = async (userId) => {
  const query = await pool.query(
    `
      SELECT m.id_api, m.poster 
      FROM to_watch AS tw
      JOIN movies AS m ON tw.movie_id = m.id_api
      WHERE tw.user_id = $1
      AND tw.likes = true
      ORDER BY tw.created_at ASC
    `, [userId]
  );

  return query.rows;
};

exports.getRatings = async (userId) => {
  const query = await pool.query(
    `
      SELECT m.id_api, m.poster
      FROM to_watch AS tw
      JOIN movies AS m ON tw.movie_id = m.id_api
      WHERE tw.user_id = $1
      AND tw.rating IS NOT NULL
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
      AND likes = TRUE
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
      SELECT COUNT(DISTINCT 
          LEAST(user_id, friend_id) || ',' || GREATEST(user_id, friend_id)
      ) AS total_friends
      FROM friends
      WHERE (user_id = $1 OR friend_id = $1) 
      AND is_friend = TRUE
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

exports.getUsersDesktop = async (limit, offset, search) => {
  const query = await pool.query(
    `SELECT id, name, username, email, avatar, avatar_binary, avatar_mime_type, is_admin, created_at FROM users 
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

exports.deleteUser = async (userId) => {
  const query = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );

  return query.rows[0];
}

exports.updateUserById = async (userId, updates) => {
  const { name, username, email, avatar, is_admin } = updates;

  const result = await pool.query(
    `UPDATE users
     SET name = $1,
         username = $2,
         email = $3,
         avatar = $4,
         is_admin = $5,
         avatar_binary = NULL,
         avatar_mime_type = NULL
     WHERE id = $6
     RETURNING id, name, username, email, avatar, avatar_binary, avatar_mime_type, is_admin`,
    [name, username, email, avatar, is_admin, userId]
  );

  return result.rows[0];
};

exports.getRequests = async (userId) => {
  const query = await pool.query(
    `
      SELECT 
        f.id AS request_id,
        u.id AS sender_id,
        u.name,
        u.username,
        u.avatar,
        f.is_friend,
        f.created_at
      FROM friends f
      JOIN users u ON f.user_id = u.id
      WHERE f.friend_id = $1
      ORDER BY f.created_at DESC
    `, [userId]
  );

  return query.rows;
};

exports.acceptRequest = async (senderId, receiverId, requestId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateQuery = `
      UPDATE friends
      SET is_friend = TRUE
      WHERE id = $1 AND user_id = $2 AND friend_id = $3
      RETURNING *
    `;
    const updateResult = await client.query(updateQuery, [requestId, senderId, receiverId]);

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const insertQuery = `
      INSERT INTO friends (user_id, friend_id, is_friend, created_at)
      VALUES ($1, $2, TRUE, NOW())
    `;
    await client.query(insertQuery, [receiverId, senderId]);

    await client.query('COMMIT');
    return updateResult;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error a la base de dades en acceptar la sol·licitud:", error);
    throw error;
  } finally {
    client.release();
  }
};

exports.rejectRequest = async (senderId, receiverId, requestId) => {
  const query = await pool.query(
    `
      DELETE FROM friends
      WHERE id = $1 AND user_id = $2 AND friend_id = $3
      RETURNING *
    `, [requestId, senderId, receiverId]
  );

  return query.rows[0];
};

exports.getFriends = async (userId) => {
  const query = await pool.query(
    `
      SELECT 
        f.id AS request_id,
        u.id AS friend_id,
        u.name,
        u.username,
        u.avatar,
        f.is_friend,
        f.created_at
      FROM friends f
      JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = $1
      AND f.is_friend = TRUE
      ORDER BY f.created_at DESC
    `, [userId]
  );

  return query.rows;
};

exports.getFriendshipStatus = async (userId, friendId) => {
  const query = await pool.query(
    `
      SELECT is_friend
      FROM friends
      WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)
    `, [userId, friendId]
  );

  return query.rows[0];
};

exports.setFriendRequest = async (userId, friendId) => {
  const existingRequest = await pool.query(
    `
      SELECT * 
      FROM friends 
      WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)
    `, [userId, friendId]
  );

  if (existingRequest.rows.length > 0) {
    const updateQuery = await pool.query(
      `
      UPDATE friends
      SET is_friend = FALSE, created_at = NOW()
      WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)
      RETURNING *
    `, [userId, friendId]
    );

    return updateQuery.rows[0];
  } else {
    const insertQuery = await pool.query(
      `
        INSERT INTO friends (user_id, friend_id, is_friend, created_at)
        VALUES ($1, $2, FALSE, NOW())
        RETURNING *
      `, [userId, friendId]
    );

    return insertQuery.rows[0];
  }
};

exports.deleteFriend = async (userId, friendId) => {
  const query = await pool.query(
    `
      DELETE FROM friends
      WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)
      RETURNING *
    `, [userId, friendId]
  );

  return query.rows[0];
};
