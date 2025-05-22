/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('friends').del();
  await knex('friends').insert([
    {
      user_id: 1,
      friend_id: 2,
      is_friend: true,
    },
    {
      user_id: 2,
      friend_id: 1,
      is_friend: true,
    },
    {
      user_id: 1,
      friend_id: 3,
      is_friend: true,
    },
    {
      user_id: 3,
      friend_id: 1,
      is_friend: true,
    },
    {
      user_id: 2,
      friend_id: 4,
      is_friend: true,
    },
    {
      user_id: 4,
      friend_id: 2,
      is_friend: true,
    }
  ]);
};
