/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('movie_list').del()
  await knex('movie_list').insert([
    {
      list_id: 1,
      movie_id: 133,
    },
    {
      list_id: 1,
      movie_id: 159,
    },
    {
      list_id: 1,
      movie_id: 139,
    },
    {
      list_id: 2,
      movie_id: 133,
    },
    {
      list_id: 2,
      movie_id: 159,
    },
    {
      list_id: 2,
      movie_id: 139,
    },
    {
      list_id: 3,
      movie_id: 133,
    },
    {
      list_id: 3,
      movie_id: 159,
    },
    {
      list_id: 3,
      movie_id: 139,
    },
    {
      list_id: 4,
      movie_id: 133,
    },
    {
      list_id: 4,
      movie_id: 159,
    },
    {
      list_id: 4,
      movie_id: 139,
    },
    {
      list_id: 5,
      movie_id: 133,
    },
    {
      list_id: 5,
      movie_id: 159,
    },
    {
      list_id: 5,
      movie_id: 139,
    },
    {
      list_id: 6,
      movie_id: 133,
    },
    {
      list_id: 6,
      movie_id: 159,
    },
    {
      list_id: 6,
      movie_id: 139,
    },
    {
      list_id: 7,
      movie_id: 133,
    },
    {
      list_id: 7,
      movie_id: 159,
    },
    {
      list_id: 7,
      movie_id: 139,
    },
    {
      list_id: 8,
      movie_id: 133,
    },
    {
      list_id: 8,
      movie_id: 159,
    },
    {
      list_id: 8,
      movie_id: 139,
    },
    {
      list_id: 9,
      movie_id: 133,
    },
    {
      list_id: 9,
      movie_id: 159,
    },
    {
      list_id: 9,
      movie_id: 139,
    },
    {
      list_id: 10,
      movie_id: 133,
    },
    {
      list_id: 10,
      movie_id: 159,
    },
    {
      list_id: 10,
      movie_id: 139,
    }
  ]);
};
