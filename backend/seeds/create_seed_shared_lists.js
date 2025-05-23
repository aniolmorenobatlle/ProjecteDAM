/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('shared_lists').del();
  await knex('shared_lists').insert([
    {
      list_id: 3,
      user_id: 1,
      friend_id: 2,
      created_at: new Date(),
    },
    {
      list_id: 5,
      user_id: 2,
      friend_id: 1,
      created_at: new Date(),
    },
    {
      list_id: 6,
      user_id: 2,
      friend_id: 4,
      created_at: new Date(),
    }
  ]);
};
